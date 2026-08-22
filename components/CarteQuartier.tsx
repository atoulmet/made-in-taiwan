'use client';

import { useEffect, useRef, useState } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import styles from './TaipeiMap.module.css';
import { ajouterMetro } from './metro';
import { STYLE, echapper, zone } from './TaipeiMap';

/** Une adresse d'un quartier, telle qu'écrite dans l'en-tête de sa fiche. */
export type Adresse = {
  nom: string;
  chinese?: string;
  /** « à manger », « café », « boutique »… affiché en micro-caps. */
  type?: string;
  note?: string;
  lng: number;
  lat: number;
  libelle?: 'gauche' | 'droite';
};

export type CentreQuartier = { lng: number; lat: number; rayon?: number };

/**
 * La carte de la vue agrandie : cadrée sur un seul quartier, avec ses adresses.
 * Elles ne figurent pas sur la carte de la page — on ne les voit qu'ici, une
 * fois le quartier ouvert.
 */
export function CarteQuartier({
  nom,
  centre,
  adresses,
}: {
  nom: string;
  centre: CentreQuartier;
  adresses: Adresse[];
}) {
  const conteneur = useRef<HTMLDivElement>(null);
  const cle = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const [echec, setEchec] = useState(false);

  useEffect(() => {
    if (!conteneur.current || !cle) return;

    let carte: { remove: () => void } | null = null;
    let annule = false;
    const minuteur = setTimeout(() => setEchec(true), 10000);

    (async () => {
      const sdk = await import('@maptiler/sdk');
      if (annule || !conteneur.current) return;

      sdk.config.apiKey = cle;

      const map = new sdk.Map({
        container: conteneur.current,
        style: `${STYLE}?key=${cle}`,
        center: [centre.lng, centre.lat],
        zoom: 14,
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

        // Le métro passe sous la zone du quartier et sous les adresses.
        ajouterMetro(map);

        const rayon = centre.rayon ?? 500;
        const contour = zone(centre.lng, centre.lat, rayon);

        map.addSource('quartier', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [contour] },
          },
        });

        map.addLayer({
          id: 'quartier-fond',
          type: 'fill',
          source: 'quartier',
          paint: { 'fill-color': '#04492C', 'fill-opacity': 0.08 },
        });

        map.addLayer({
          id: 'quartier-trait',
          type: 'line',
          source: 'quartier',
          paint: { 'line-color': '#04492C', 'line-width': 1.6, 'line-dasharray': [3, 2] },
        });

        for (const adresse of adresses) {
          const gauche = adresse.libelle === 'gauche';
          const element = document.createElement('div');
          element.className = `${styles.pin} ${styles.adresse}${gauche ? ` ${styles.gauche}` : ''}`;
          element.innerHTML =
            `<div class="${styles.point}"></div>` +
            `<div class="${styles.libelle}">${echapper(adresse.nom)}</div>`;

          new sdk.Marker({ element, anchor: gauche ? 'right' : 'left' })
            .setLngLat([adresse.lng, adresse.lat])
            .setPopup(
              new sdk.Popup({ offset: 16, maxWidth: '280px' }).setHTML(
                `<div class="${styles.popupTitre}">${echapper(adresse.nom)}</div>` +
                  (adresse.chinese
                    ? `<div class="${styles.popupChinois}">${echapper(adresse.chinese)}</div>`
                    : '') +
                  (adresse.type
                    ? `<div class="${styles.popupLigne}">${echapper(adresse.type)}</div>`
                    : '') +
                  (adresse.note
                    ? `<div class="${styles.popupNote}">${echapper(adresse.note)}</div>`
                    : ''),
              ),
            )
            .addTo(map);
        }

        // Le cadrage tient compte du quartier et de toutes ses adresses : une
        // adresse un peu excentrée ne doit pas tomber hors de la vue.
        const cadre = new sdk.LngLatBounds();
        for (const point of contour) cadre.extend(point);
        for (const adresse of adresses) cadre.extend([adresse.lng, adresse.lat]);
        // La modale vient d'apparaître : le conteneur peut n'avoir pris sa
        // taille qu'après la création de la carte. Sans ce resize, le cadrage
        // se calcule sur une boîte vide et s'ouvre beaucoup trop large.
        map.resize();
        map.fitBounds(cadre, { padding: 48, duration: 0 });
      });
    })();

    return () => {
      annule = true;
      clearTimeout(minuteur);
      carte?.remove();
    };
  }, [centre, adresses, cle]);

  if (!cle) return null;

  return (
    <div className={styles.cadreQuartier} title={`Carte de ${nom}`}>
      <div ref={conteneur} className={styles.carte} />
      {echec && (
        <div className={styles.absente}>
          <p>La carte n&apos;a pas pu se charger.</p>
        </div>
      )}
    </div>
  );
}
