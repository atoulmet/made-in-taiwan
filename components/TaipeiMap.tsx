'use client';

import { useEffect, useRef, useState } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { ajouterMetro, montrerMetro } from './metro';
import styles from './TaipeiMap.module.css';

/** Le SDK arrive par import dynamique : on ne type ici que ce qu'on appelle. */
type CarteMLGL = {
  remove: () => void;
  setFilter: (couche: string, filtre: unknown) => void;
  getLayer: (couche: string) => unknown;
  setPaintProperty: (couche: string, propriete: string, valeur: unknown) => void;
};
type MarqueurMLGL = { addTo: (carte: CarteMLGL) => void; remove: () => void };

/** Les trois familles de points, chacune pilotée par son étiquette. */
export type Categorie = 'quartier' | 'lieu' | 'marche';

export const CATEGORIES: Categorie[] = ['quartier', 'lieu', 'marche'];

/** Les trois familles de points, plus le métro — qui n'est pas une famille de
 *  points mais s'allume et s'éteint de la même façon. */
export type Filtres = Record<Categorie, boolean> & { metro: boolean };

export type LieuCarte = {
  categorie: Categorie;
  nom: string;
  chinese?: string;
  /** Ligne de métro ou temps de trajet, en micro-caps dans la popup. */
  ligne?: string;
  /** La phrase de la bulle. À défaut, la note de la fiche prend le relais. */
  note?: string;
  lng: number;
  lat: number;
  /** Rayon de la zone, en mètres. Les marchés de nuit n'en ont pas : un point. */
  rayon?: number;
  /** Centre de la zone, si elle déborde du point (Maokong englobe le zoo). */
  zoneLng?: number;
  zoneLat?: number;
  /** Les quartiers du cœur de la ville : eux seuls fixent le cadrage. */
  coeur?: boolean;
  /** Côté du libellé, pour éviter les collisions. */
  libelle?: 'gauche' | 'droite';
};

/**
 * Cercle géodésique approximatif autour d'un point.
 * Ce sont des zones d'ambiance, pas des limites administratives : Dadaocheng
 * et Maokong n'ont d'ailleurs pas de frontière officielle.
 */
export function zone(lng: number, lat: number, metres: number): [number, number][] {
  const points: [number, number][] = [];
  const dLat = metres / 111320;
  const dLng = metres / (111320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    points.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return points;
}

/**
 * Le style dessiné sur cloud.maptiler.com pour le site. La clé s'y ajoute au
 * moment de l'appel : le SDK ne la pose pas sur l'URL du style lui-même, et
 * sans elle api.maptiler.com répond 403 — la carte n'atteint jamais « load ».
 */
export const STYLE = 'https://api.maptiler.com/maps/01a01f74-0421-7f9d-a971-302ce6ecaf48/style.json';

/**
 * Échappe un texte pour la bulle. Tolère l'absence : un champ optionnel non
 * renseigné dans le Markdown ne doit pas faire tomber la carte entière.
 */
export function echapper(texte?: string) {
  return (texte ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Montre ou cache une famille : les zones par un filtre d'expression sur la
 * couche, les points en les retirant de la carte. Rien n'est reconstruit.
 */
function appliquerFiltres(
  carte: CarteMLGL,
  filtres: Filtres,
  marqueurs: Record<Categorie, MarqueurMLGL[]>,
) {
  montrerMetro(carte as never, filtres.metro);

  const visibles = CATEGORIES.filter((categorie) => filtres[categorie]);
  for (const couche of ['quartiers-fond', 'quartiers-trait']) {
    carte.setFilter(couche, ['in', ['get', 'categorie'], ['literal', visibles]]);
  }
  for (const categorie of CATEGORIES) {
    for (const marqueur of marqueurs[categorie]) {
      if (filtres[categorie]) marqueur.addTo(carte);
      else marqueur.remove();
    }
  }
}

/**
 * Éclaire la zone du quartier survolé : fond plus dense, contour à la brique
 * et plus épais. Une expression suffit, pas besoin d'une source à part.
 */
function appliquerSurvol(carte: CarteMLGL, survole: string | null | undefined) {
  if (!carte.getLayer('quartiers-fond')) return;
  const estSurvole = ['==', ['get', 'nom'], survole ?? ''];
  carte.setPaintProperty('quartiers-fond', 'fill-opacity', ['case', estSurvole, 0.3, 0.1]);
  carte.setPaintProperty('quartiers-trait', 'line-color', ['case', estSurvole, '#C1512A', '#04492C']);
  carte.setPaintProperty('quartiers-trait', 'line-width', ['case', estSurvole, 2.8, 1.6]);
}

/**
 * La carte des adresses. Seul îlot interactif du site : chargée côté client,
 * avec le SDK MapTiler (style BASIC, libellés latins).
 */
export function TaipeiMap({
  lieux,
  filtres,
  survole,
}: {
  lieux: LieuCarte[];
  filtres: Filtres;
  /** Le nom du quartier survolé dans la colonne, ou null. */
  survole?: string | null;
}) {
  const conteneur = useRef<HTMLDivElement>(null);
  const cle = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [echec, setEchec] = useState(false);

  // La carte se construit une fois. Les filtres n'y touchent qu'après coup :
  // masquer une famille ne doit pas rejouer le cadrage ni recharger le style.
  const carteRef = useRef<CarteMLGL | null>(null);
  const marqueursRef = useRef<Record<Categorie, MarqueurMLGL[]>>({
    quartier: [],
    lieu: [],
    marche: [],
  });
  const filtresRef = useRef(filtres);
  filtresRef.current = filtres;
  const survoleRef = useRef(survole);
  survoleRef.current = survole;

  useEffect(() => {
    if (!conteneur.current || !cle) return;

    let carte: { remove: () => void } | null = null;
    let annule = false;

    // Si le style n'est pas arrivé au bout de dix secondes (réseau coupé, clé
    // refusée), on le dit plutôt que de laisser un cadre vide.
    const minuteur = setTimeout(() => setEchec(true), 10000);

    (async () => {
      const sdk = await import('@maptiler/sdk');
      if (annule || !conteneur.current) return;

      sdk.config.apiKey = cle;

      const map = new sdk.Map({
        container: conteneur.current,
        style: `${STYLE}?key=${cle}`,
        center: [121.545, 25.02],
        zoom: 10.6,
        // Gestes coopératifs : le défilement à deux doigts reste à la page,
        // le pincement (et ⌘/Ctrl + molette) zoome la carte.
        cooperativeGestures: true,
        locale: {
          'CooperativeGesturesHandler.MacHelpText': 'Pincer, ou ⌘ + défiler, pour zoomer',
          'CooperativeGesturesHandler.WindowsHelpText': 'Pincer, ou Ctrl + défiler, pour zoomer',
          'CooperativeGesturesHandler.MobileHelpText': 'Deux doigts pour déplacer la carte',
        },
        geolocate: false,
        navigationControl: 'bottom-right',
        terrainControl: false,
        language: sdk.Language.LATIN,
      });
      carte = map;

      map.on('load', () => {
        clearTimeout(minuteur);
        setEchec(false);

        ajouterMetro(map);

        map.addSource('quartiers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: lieux
              .filter((lieu) => lieu.rayon)
              .map((lieu) => ({
                type: 'Feature' as const,
                properties: { nom: lieu.nom, categorie: lieu.categorie },
                geometry: {
                  type: 'Polygon' as const,
                  coordinates: [
                    zone(lieu.zoneLng ?? lieu.lng, lieu.zoneLat ?? lieu.lat, lieu.rayon as number),
                  ],
                },
              })),
          },
        });

        map.addLayer({
          id: 'quartiers-fond',
          type: 'fill',
          source: 'quartiers',
          paint: { 'fill-color': '#04492C', 'fill-opacity': 0.1 },
        });

        map.addLayer({
          id: 'quartiers-trait',
          type: 'line',
          source: 'quartiers',
          paint: { 'line-color': '#04492C', 'line-width': 1.6, 'line-dasharray': [3, 2] },
        });

        marqueursRef.current = { quartier: [], lieu: [], marche: [] };

        for (const lieu of lieux) {
          const gauche = lieu.libelle === 'gauche';
          // Un point vert pour les quartiers, un point rouge pour les marchés
          // de nuit, un triangle vert pour les lieux à visiter.
          const forme =
            lieu.categorie === 'marche'
              ? ` ${styles.rouge}`
              : lieu.categorie === 'lieu'
                ? ` ${styles.triangle}`
                : '';
          const element = document.createElement('div');
          element.className = `${styles.pin}${gauche ? ` ${styles.gauche}` : ''}${forme}`;
          element.innerHTML = `<div class="${styles.point}"></div><div class="${styles.libelle}">${echapper(lieu.nom)}</div>`;

          const marqueur = new sdk.Marker({ element, anchor: gauche ? 'right' : 'left' })
            .setLngLat([lieu.lng, lieu.lat])
            .setPopup(
              new sdk.Popup({ offset: 16, maxWidth: '280px' }).setHTML(
                `<div class="${styles.popupTitre}">${echapper(lieu.nom)}</div>` +
                  (lieu.chinese
                    ? `<div class="${styles.popupChinois}">${echapper(lieu.chinese)}</div>`
                    : '') +
                  (lieu.ligne
                    ? `<div class="${styles.popupLigne}">${echapper(lieu.ligne)}</div>`
                    : '') +
                  (lieu.note ? `<div class="${styles.popupNote}">${echapper(lieu.note)}</div>` : ''),
              ),
            );
          marqueursRef.current[lieu.categorie].push(marqueur as unknown as MarqueurMLGL);
        }

        // Le cadrage ne tient compte que des quartiers du cœur de la ville.
        const cadre = new sdk.LngLatBounds();
        for (const lieu of lieux.filter((l) => l.coeur)) cadre.extend([lieu.lng, lieu.lat]);
        map.fitBounds(cadre, { padding: 90, duration: 0 });

        carteRef.current = map as unknown as CarteMLGL;
        appliquerFiltres(map as unknown as CarteMLGL, filtresRef.current, marqueursRef.current);
        // Une fiche peut avoir été survolée pendant que la carte chargeait.
        appliquerSurvol(map as unknown as CarteMLGL, survoleRef.current);
      });
    })();

    return () => {
      annule = true;
      carteRef.current = null;
      clearTimeout(minuteur);
      carte?.remove();
    };
  }, [lieux, cle]);

  // Le survol d'une fiche éclaire sa zone.
  useEffect(() => {
    if (carteRef.current) appliquerSurvol(carteRef.current, survole);
  }, [survole]);

  // Les étiquettes ne touchent qu'à la visibilité, la carte reste en place.
  useEffect(() => {
    if (carteRef.current) {
      appliquerFiltres(carteRef.current, filtres, marqueursRef.current);
    }
  }, [filtres]);

  if (!cle) {
    return (
      <div className={styles.absente}>
        <p>
          Carte indisponible : la variable <code>NEXT_PUBLIC_MAPTILER_KEY</code> n&apos;est pas
          définie. La copier depuis <code>.env.example</code> vers <code>.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div ref={conteneur} className={styles.carte} />
      {echec && (
        <div className={styles.absente}>
          <p>La carte n&apos;a pas pu se charger. Les quartiers restent listés à gauche.</p>
        </div>
      )}
    </>
  );
}
