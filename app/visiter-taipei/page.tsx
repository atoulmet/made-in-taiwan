import { PageFooter } from '@/components/PageFooter';
import { PhotoSlot } from '@/components/PhotoSlot';
import { SiteHeader } from '@/components/SiteHeader';
import { type Categorie, type LieuCarte } from '@/components/TaipeiMap';
import { ColonnesCarte } from './ColonnesCarte';
import { FicheQuartier } from './FicheQuartier';
import {
  lireDossier,
  lirePage,
  lirePages,
  photosDe,
  photosParDossier,
  voisines,
  type Fiche,
  type Photo,
} from '@/lib/content';
import styles from './visiter.module.css';

type DonneesCarte = {
  lng: number;
  lat: number;
  /** Absent pour les marchés de nuit : ils n'ont qu'un point. */
  rayon?: number;
  zoneLng?: number;
  zoneLat?: number;
  coeur?: boolean;
  libelle?: 'gauche' | 'droite';
  note: string;
};

/** Les fiches alimentent à la fois la colonne de gauche et la carte. */
function versLieuCarte(categorie: Categorie) {
  return (fiche: Fiche): LieuCarte => {
    const carte = fiche.carte as DonneesCarte;
    return {
      categorie,
      nom: fiche.name as string,
      chinese: fiche.chinese as string,
      ligne: (fiche.metro ?? fiche.trajet) as string,
      note: carte.note,
      lng: carte.lng,
      lat: carte.lat,
      rayon: carte.rayon,
      zoneLng: carte.zoneLng,
      zoneLat: carte.zoneLat,
      coeur: carte.coeur,
      libelle: carte.libelle,
    };
  };
}

export default function VisiterTaipei() {
  const page = lirePage('visiter-taipei');
  const pages = lirePages();
  const { avant, apres } = voisines('visiter-taipei');
  const quartiers = lireDossier('visiter-taipei', 'quartiers');
  const albums = photosParDossier();
  const escapades = lireDossier('visiter-taipei', 'escapades');
  const marches = lireDossier('visiter-taipei', 'marches-nuit');
  const aVisiter = lireDossier('visiter-taipei', 'lieux-a-visiter');
  // « Lieux à visiter » couvre les sites de la ville et les échappées autour.
  const lieux = [
    ...quartiers.map(versLieuCarte('quartier')),
    ...aVisiter.map(versLieuCarte('lieu')),
    ...escapades.map(versLieuCarte('lieu')),
    ...marches.map(versLieuCarte('marche')),
  ];

  const carte = page.carte as { badge: string; titre: string };
  const labelQuartiers = (page.quartiers as { label: string }).label;
  const escapadesEntete = page.escapades as { label: string; chinese: string };

  return (
    <>
      <SiteHeader page={page} pages={pages} />

      <section className={styles.intro}>
        <div className={styles.grilleIntro}>
          <div>
            <h1 className={styles.titrePage}>{page.title}</h1>
            <div className={styles.texteIntro} dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
          <div className={styles.chinoisPage}>{page.chinese}</div>
        </div>
      </section>

      {/* Deux colonnes pleine fenêtre : les fiches défilent, la carte reste. */}
      <ColonnesCarte
        lieux={lieux}
        labelQuartiers={labelQuartiers}
        badge={carte.badge}
        titre={carte.titre}
      >
        {quartiers.map((quartier) => (
          <FicheQuartier
            key={quartier.slug}
            quartier={{
              name: quartier.name as string,
              chinese: quartier.chinese as string,
              metro: quartier.metro as string,
              html: quartier.html,
              note: quartier.note as string | undefined,
              maps: quartier.maps as string | undefined,
              photo: quartier.photo as Photo,
              photos: photosDe(quartier, albums),
            }}
          />
        ))}
      </ColonnesCarte>

      <section className={styles.escapades}>
        <div className={styles.enteteSection}>
          <h2 className={styles.labelSection}>{escapadesEntete.label}</h2>
          <div className={styles.trait} />
          <div className={styles.chinoisSection}>{escapadesEntete.chinese}</div>
        </div>

        <div className={styles.grilleEscapades}>
          {escapades.map((escapade) => (
            <article key={escapade.slug} className={styles.carteEscapade}>
              <PhotoSlot photo={escapade.photo as Photo} className={styles.vignetteEscapade} />
              <div className={styles.nomEscapade}>{escapade.name as string}</div>
              <div className={styles.chinoisEscapade}>{escapade.chinese as string}</div>
              <div className={styles.trajet}>{escapade.trajet as string}</div>
              <div
                className={styles.texteEscapade}
                dangerouslySetInnerHTML={{ __html: escapade.html }}
              />
            </article>
          ))}
        </div>
      </section>

      <PageFooter
        gauche={{ label: avant?.footerLabel ?? 'Sommaire', href: avant?.href ?? '/' }}
        droite={{ label: apres?.footerLabel ?? 'Sommaire', href: apres?.href ?? '/' }}
      />
    </>
  );
}
