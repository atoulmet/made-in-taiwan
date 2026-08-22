import { PageFooter } from './PageFooter';
import { SiteHeader } from './SiteHeader';
import { lirePage, lirePages, voisines } from '@/lib/content';
import styles from './PageAVenir.module.css';

/** Un encadré de recommandation, renseigné dans l'en-tête de la page. */
type Encadre = {
  texte: string;
  lien?: { url: string; label: string };
};

/**
 * Gabarit des pages dont le contenu n'est pas encore écrit : l'en-tête, le
 * titre et le pied de page sont en place, le corps annonce clairement qu'il
 * reste à faire. La navigation du site est ainsi complète dès maintenant.
 */
export function PageAVenir({ slug }: { slug: string }) {
  const page = lirePage(slug);
  const pages = lirePages();
  const { avant, apres } = voisines(slug);
  const encadre = page.encadre as Encadre | undefined;

  return (
    <>
      <SiteHeader page={page} pages={pages} />

      <section className={styles.intro}>
        <div className={styles.grilleIntro}>
          <h1 className={styles.titrePage}>{page.title}</h1>
          <div className={styles.chinoisPage}>{page.chinese}</div>
        </div>

        {/* Une page peut déjà porter une recommandation, même sans corps. */}
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

        <div className={styles.attente}>
          <div className={styles.label}>Page à venir</div>
          <p className={styles.texte}>{page.teaser}</p>
        </div>
      </section>

      <PageFooter
        gauche={{ label: avant?.footerLabel ?? 'Sommaire', href: avant?.href ?? '/' }}
        droite={{ label: apres?.footerLabel ?? 'Sommaire', href: apres?.href ?? '/' }}
      />
    </>
  );
}
