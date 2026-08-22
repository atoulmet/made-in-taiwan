/**
 * Les lignes de métro de Taipei, partagées par la carte de la page et par
 * celles des vues agrandies. Les données viennent des tuiles du style : la
 * couche `subway` porte la couleur officielle de chaque ligne, `poi_station`
 * les stations et leurs noms.
 */

/** Les couches posées, dans leur ordre de dessin. */
export const COUCHES_METRO = ['metro-lignes', 'metro-stations', 'metro-noms'] as const;

/** Types seuls : rien de ce fichier ne charge le SDK à l'exécution. */
type CarteMetro = import('@maptiler/sdk').Map;
type Filtre = import('@maptiler/sdk').FilterSpecification;

/**
 * Pose les trois couches du métro. À appeler dans le gestionnaire `load`,
 * avant les zones de quartier : le métro passe dessous.
 *
 * Le nom de la source est déduit du style plutôt qu'écrit en dur — une couche
 * qui vise une source inconnue est rejetée par MapLibre sans lever
 * d'exception, et disparaît sans un mot.
 */
export function ajouterMetro(carte: CarteMetro) {
  const sources = carte.getStyle().sources;
  const vecteur = Object.entries(sources).find(
    ([id, source]) => source.type === 'vector' && id !== 'maptiler_attribution',
  )?.[0];
  if (!vecteur) return false;

  const stations: Filtre = [
    'all',
    ['==', ['get', 'class'], 'railway'],
    ['==', ['get', 'subclass'], 'subway'],
  ];

  carte.addLayer({
    id: 'metro-lignes',
    type: 'line',
    source: vecteur,
    'source-layer': 'subway',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['coalesce', ['get', 'colour'], '#6A6656'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 3.5],
      'line-opacity': 0.85,
    },
  });

  // Pastilles et noms n'apparaissent qu'une fois la carte assez zoomée :
  // à l'échelle de la ville, ils couvriraient tout.
  carte.addLayer({
    id: 'metro-stations',
    type: 'circle',
    source: vecteur,
    'source-layer': 'poi_station',
    minzoom: 12,
    filter: stations,
    paint: {
      'circle-radius': 4,
      'circle-color': '#FBF9F1',
      'circle-stroke-color': '#35322A',
      'circle-stroke-width': 1.6,
    },
  });

  carte.addLayer({
    id: 'metro-noms',
    type: 'symbol',
    source: vecteur,
    'source-layer': 'poi_station',
    minzoom: 13.5,
    filter: stations,
    layout: {
      'text-field': ['coalesce', ['get', 'name:fr'], ['get', 'name:en'], ['get', 'name']],
      'text-font': ['Metropolis Medium', 'Noto Sans Medium'],
      'text-size': 10,
      'text-offset': [0, 1.1],
      'text-anchor': 'top',
      'text-max-width': 8,
    },
    paint: {
      'text-color': '#35322A',
      'text-halo-color': '#F6F3E8',
      'text-halo-width': 1.6,
    },
  });

  // Le SDK MapTiler rejoue sa passe de langue à chaque modification du style,
  // et suppose que toute couche « symbol » posée sur une source MapTiler
  // figure dans son registre de libellés d'origine — rempli au seul
  // chargement. Une couche ajoutée après n'y est pas : le SDK lit undefined et
  // lève une TypeError.
  //
  // On l'y inscrit donc, mais avec une expression qui ne cite aucun champ
  // « name » : le SDK ne la reconnaît pas comme un libellé à traduire et
  // laisse la nôtre en place. L'inscrire telle quelle la ferait remplacer par
  // « name:latin », absent de ces stations, qui retomberaient en chinois.
  const registre = (carte as unknown as { originalLabelStyle?: Map<string, unknown> })
    .originalLabelStyle;
  registre?.set('metro-noms', ['get', 'ref']);

  return true;
}

/** Montre ou cache le métro, sans rien reconstruire. */
export function montrerMetro(carte: CarteMetro, visible: boolean) {
  for (const couche of COUCHES_METRO) {
    if (carte.getLayer(couche)) {
      carte.setLayoutProperty(couche, 'visibility', visible ? 'visible' : 'none');
    }
  }
}
