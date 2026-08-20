import Link from 'next/link';
import type { Page } from '@/lib/content';
import { Enseigne } from './Enseigne';
import { Logo } from './Logo';
import styles from './SiteHeader.module.css';

/** Le trait manuscrit sous le lien de la page active. Une seule courbe irrégulière. */
function Soulignage() {
  return (
    <svg viewBox="0 0 120 12" preserveAspectRatio="none" className={styles.soulignage} aria-hidden="true">
      <path
        d="M2 7 C 18 3.2, 34 9.4, 52 5.6 C 70 2.2, 88 8.8, 104 4.4 C 110 2.9, 115 4.6, 118 5.4"
        fill="none"
        stroke="#C1512A"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  /** La page affichée : donne le numéro, le nom du bandeau et le lien actif. */
  page: Page;
  /** Les sept pages, dans l'ordre, pour la barre de navigation. */
  pages: Page[];
  /** Mention du cartouche d'enseigne — l'accueil seulement. */
  enseigne?: { mention: string };
};

/**
 * En-tête commun à toutes les pages : barre de navigation, puis la marque —
 * cartouche pleine largeur sur l'accueil, logo rond ailleurs.
 */
export function SiteHeader({ page, pages, enseigne }: Props) {
  const accueil = page.slug === 'accueil';

  return (
    <>
      <div className={styles.barre}>
        <nav className={styles.nav}>
          {pages.map((p) =>
            p.slug === page.slug ? (
              <span key={p.slug} className={styles.actif} aria-current="page">
                {p.nav}
                <Soulignage />
              </span>
            ) : (
              <Link key={p.slug} href={p.href} className={styles.lien}>
                {p.nav}
              </Link>
            ),
          )}
        </nav>
      </div>

      {accueil ? (
        <div className={styles.marqueAccueil}>
          <Link href="/" className={styles.lienEnseigne}>
            <Enseigne mention={enseigne?.mention ?? ''} />
          </Link>
        </div>
      ) : (
        <div className={styles.marquePage}>
          <Link href="/" className={styles.lienLogo} aria-label="Retour au sommaire">
            <Logo />
          </Link>
        </div>
      )}
    </>
  );
}
