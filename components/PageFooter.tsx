import Link from 'next/link';
import styles from './PageFooter.module.css';

type Lien = { label: string; href?: string };

/**
 * Pied de page : la bande « ticket » puis, selon la page, les deux liens
 * précédent / suivant ou les mentions de l'accueil.
 */
export function PageFooter({ gauche, droite }: { gauche: Lien; droite: Lien }) {
  return (
    <div className={styles.pied}>
      <div className={styles.ticket} />
      <div className={styles.liens}>
        {gauche.href ? (
          <Link href={gauche.href} className={styles.lien}>
            ← {gauche.label}
          </Link>
        ) : (
          <span className={styles.mention}>{gauche.label}</span>
        )}
        {droite.href ? (
          <Link href={droite.href} className={styles.lien}>
            {droite.label} →
          </Link>
        ) : (
          <span className={styles.mention}>{droite.label}</span>
        )}
      </div>
    </div>
  );
}
