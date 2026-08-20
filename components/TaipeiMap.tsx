'use client';

import { useEffect, useRef, useState } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import styles from './TaipeiMap.module.css';

export type LieuCarte = {
  nom: string;
  chinese: string;
  /** Ligne de métro ou temps de trajet, en micro-caps dans la popup. */
  ligne: string;
  /** La phrase de la popup. */
  note: string;
  lng: number;
  lat: number;
  /** Rayon de la zone, en mètres. */
  rayon: number;
  /** Les cinq quartiers du cœur de la ville : eux seuls fixent le cadrage. */
  coeur?: boolean;
  /** Côté du libellé, pour éviter les collisions. */
  libelle?: 'gauche' | 'droite';
};

/**
 * Cercle géodésique approximatif autour d'un point.
 * Ce sont des zones d'ambiance, pas des limites administratives : Dadaocheng
 * et Maokong n'ont d'ailleurs pas de frontière officielle.
 */
function zone(lng: number, lat: number, metres: number): [number, number][] {
  const points: [number, number][] = [];
  const dLat = metres / 111320;
  const dLng = metres / (111320 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    points.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return points;
}

function echapper(texte: string) {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * La carte des adresses. Seul îlot interactif du site : chargée côté client,
 * avec le SDK MapTiler (style BASIC, libellés latins).
 */
export function TaipeiMap({ lieux }: { lieux: LieuCarte[] }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const cle = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [echec, setEchec] = useState(false);

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
        style: sdk.MapStyle.BASIC,
        center: [121.545, 25.02],
        zoom: 10.6,
        scrollZoom: false, // pour ne pas piéger le défilement de la page
        geolocate: false,
        navigationControl: 'bottom-right',
        terrainControl: false,
        language: sdk.Language.LATIN,
      });
      carte = map;

      map.on('load', () => {
        clearTimeout(minuteur);
        setEchec(false);

        map.addSource('quartiers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: lieux.map((lieu) => ({
              type: 'Feature' as const,
              properties: { nom: lieu.nom },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [zone(lieu.lng, lieu.lat, lieu.rayon)],
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

        for (const lieu of lieux) {
          const gauche = lieu.libelle === 'gauche';
          const element = document.createElement('div');
          element.className = `${styles.pin} ${gauche ? styles.gauche : ''}`;
          element.innerHTML = `<div class="${styles.point}"></div><div class="${styles.libelle}">${echapper(lieu.nom)}</div>`;

          new sdk.Marker({ element, anchor: gauche ? 'right' : 'left' })
            .setLngLat([lieu.lng, lieu.lat])
            .setPopup(
              new sdk.Popup({ offset: 16, maxWidth: '280px' }).setHTML(
                `<div class="${styles.popupTitre}">${echapper(lieu.nom)}</div>` +
                  `<div class="${styles.popupChinois}">${echapper(lieu.chinese)}</div>` +
                  `<div class="${styles.popupLigne}">${echapper(lieu.ligne)}</div>` +
                  `<div class="${styles.popupNote}">${echapper(lieu.note)}</div>`,
              ),
            )
            .addTo(map);
        }

        // Le cadrage ne tient compte que des quartiers du cœur de la ville.
        const cadre = new sdk.LngLatBounds();
        for (const lieu of lieux.filter((l) => l.coeur)) cadre.extend([lieu.lng, lieu.lat]);
        map.fitBounds(cadre, { padding: 90, duration: 0 });
      });
    })();

    return () => {
      annule = true;
      clearTimeout(minuteur);
      carte?.remove();
    };
  }, [lieux, cle]);

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
