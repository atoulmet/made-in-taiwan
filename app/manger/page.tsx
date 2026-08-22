import { PageFooter } from '@/components/PageFooter';
import { PhotoSlot } from '@/components/PhotoSlot';
import { SiteHeader } from '@/components/SiteHeader';
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
import styles from './manger.module.css';

type Section = { dossier: string; label: string; chinese: string; intro: string };
type Encadre = { texte: string; lien?: { url: string; label: string } };
type BubbleTea = { label: string; chinese: string; pinyin: string; intro: string };

/**
 * Une fiche de plat : la photo, le nom, le nom chinois et sa prononciation,
 * puis le texte. Le même gabarit sert aux quatre sections.
 */
function CartePlat({ plat, photos }: { plat: Fiche; photos: string[] }) {
  const photo = photos[0]
    ? { src: photos[0], alt: plat.name as string, placeholder: '' }
    : (plat.photo as Photo);

  return (
    <article className={styles.plat}>
      <PhotoSlot photo={photo} className={styles.vignette} />

      <div className={styles.corps}>
        <div className={styles.entete}>
          <h3 className={styles.nom}>{plat.name as string}</h3>
          {plat.moment ? <span className={styles.moment}>{plat.moment as string}</span> : null}
        </div>

        <div className={styles.ligneChinois}>
          <span className={styles.chinois}>{plat.chinese as string}</span>
          <span className={styles.pinyin}>{plat.pinyin as string}</span>
        </div>

        <div className={styles.texte} dangerouslySetInnerHTML={{ __html: plat.html }} />
      </div>
    </article>
  );
}

export default function Manger() {
  const page = lirePage('manger');
  const pages = lirePages();
  const { avant, apres } = voisines('manger');
  const albums = photosParDossier();

  const encadre = page.encadre as Encadre | undefined;
  const sections = page.sections as Section[];
  const bubbleTea = page.bubbleTea as BubbleTea;
  const perles = lireDossier('manger', 'bubble-tea');

  return (
    <>
      <SiteHeader page={page} pages={pages} />

      <section className={styles.intro}>
        <div className={styles.grilleIntro}>
          <h1 className={styles.titrePage}>{page.title}</h1>
          <div className={styles.chinoisPage}>{page.chinese}</div>
        </div>

        {encadre && (
          <div className={styles.encadre}>
            <p className={styles.encadreTexte}>{encadre.texte}</p>
            {encadre.lien && (
              <a
                className={styles.encadreLien}
                href={encadre.lien.url}
                target="_blank"
                rel="noreferrer"
              >
                ↗ {encadre.lien.label}
              </a>
            )}
          </div>
        )}
      </section>

      {sections.map((section) => (
        <section key={section.dossier} className={styles.section}>
          <div className={styles.enteteSection}>
            <h2 className={styles.labelSection}>{section.label}</h2>
            <div className={styles.trait} />
            <div className={styles.chinoisSection}>{section.chinese}</div>
          </div>

          <p className={styles.introSection}>{section.intro}</p>

          <div className={styles.grillePlats}>
            {lireDossier('manger', section.dossier).map((plat) => (
              <CartePlat key={plat.slug} plat={plat} photos={photosDe(plat, albums)} />
            ))}
          </div>
        </section>
      ))}

      {/* Le bubble tea a sa propre section : fond vert, pleine largeur. */}
      <section className={styles.bubble}>
        <div className={styles.bubbleDedans}>
          <div className={styles.bubbleEntete}>
            <h2 className={styles.bubbleTitre}>{bubbleTea.label}</h2>
            <div className={styles.bubbleChinois}>{bubbleTea.chinese}</div>
            <div className={styles.bubblePinyin}>{bubbleTea.pinyin}</div>
          </div>

          <p className={styles.bubbleIntro}>{bubbleTea.intro}</p>

          <div className={styles.grillePerles}>
            {perles.map((perle) => (
              <article key={perle.slug} className={styles.perle}>
                <PhotoSlot
                  photo={
                    photosDe(perle, albums)[0]
                      ? {
                          src: photosDe(perle, albums)[0],
                          alt: perle.name as string,
                          placeholder: '',
                        }
                      : (perle.photo as Photo)
                  }
                  className={styles.vignettePerle}
                />
                <h3 className={styles.perleNom}>{perle.name as string}</h3>
                <div className={styles.ligneChinois}>
                  <span className={styles.perleChinois}>{perle.chinese as string}</span>
                  <span className={styles.perlePinyin}>{perle.pinyin as string}</span>
                </div>
                <div
                  className={styles.perleTexte}
                  dangerouslySetInnerHTML={{ __html: perle.html }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageFooter
        gauche={{ label: avant?.footerLabel ?? 'Sommaire', href: avant?.href ?? '/' }}
        droite={{ label: apres?.footerLabel ?? 'Sommaire', href: apres?.href ?? '/' }}
      />
    </>
  );
}
