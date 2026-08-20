import { PageFooter } from '@/components/PageFooter';
import { PhotoSlot } from '@/components/PhotoSlot';
import { SiteHeader } from '@/components/SiteHeader';
import { TaipeiMap, type LieuCarte } from '@/components/TaipeiMap';
import { lireDossier, lirePage, lirePages, voisines, type Fiche, type Photo } from '@/lib/content';
import styles from './visiter.module.css';

type DonneesCarte = {
  lng: number;
  lat: number;
  rayon: number;
  coeur?: boolean;
  libelle?: 'gauche' | 'droite';
  note: string;
};

/** Les fiches alimentent à la fois la colonne de gauche et la carte. */
function versLieuCarte(fiche: Fiche): LieuCarte {
  const carte = fiche.carte as DonneesCarte;
  return {
    nom: fiche.name as string,
    chinese: fiche.chinese as string,
    ligne: (fiche.metro ?? fiche.trajet) as string,
    note: carte.note,
    lng: carte.lng,
    lat: carte.lat,
    rayon: carte.rayon,
    coeur: carte.coeur,
    libelle: carte.libelle,
  };
}

export default function VisiterTaipei() {
  const page = lirePage('visiter-taipei');
  const pages = lirePages();
  const { avant, apres } = voisines('visiter-taipei');
  const quartiers = lireDossier('visiter-taipei', 'quartiers');
  const escapades = lireDossier('visiter-taipei', 'escapades');
  const lieux = [...quartiers, ...escapades].map(versLieuCarte);

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
      <div className={styles.deuxColonnes}>
        <div className={styles.colonneFiches}>
          <div className={styles.enteteColonne}>
            <div className={styles.labelColonne}>{labelQuartiers}</div>
            <div className={styles.trait} />
          </div>

          {quartiers.map((quartier) => (
            <article key={quartier.slug} className={styles.fiche}>
              <PhotoSlot photo={quartier.photo as Photo} className={styles.vignetteFiche} />
              <div>
                <div className={styles.enteteFiche}>
                  <h2 className={styles.nomFiche}>{quartier.name as string}</h2>
                  <div className={styles.chinoisFiche}>{quartier.chinese as string}</div>
                </div>

                <div className={styles.ligneMetro}>
                  <span className={styles.pastilleMetro}>{quartier.metro as string}</span>
                </div>

                <div
                  className={styles.texteFiche}
                  dangerouslySetInnerHTML={{ __html: quartier.html }}
                />

                {quartier.note ? (
                  <div className={styles.note}>
                    <div className={styles.labelNote}>Ma note</div>
                    <p className={styles.texteNote}>{quartier.note as string}</p>
                  </div>
                ) : (
                  <div className={styles.noteVide}>
                    <div className={styles.labelNoteVide}>Ma note — à compléter</div>
                  </div>
                )}

                <div className={styles.lienMaps}>
                  <a href={quartier.maps as string} target="_blank" rel="noreferrer">
                    ↗ Google Maps
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.colonneCarte}>
          <div className={styles.cadreCarte} title={carte.titre}>
            <TaipeiMap lieux={lieux} />
          </div>
          <div className={styles.badgeCarte}>{carte.badge}</div>
        </div>
      </div>

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
