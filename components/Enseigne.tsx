import styles from './Enseigne.module.css';

/**
 * Cartouche d'enseigne pleine largeur — la marque, sur l'accueil seulement.
 * Double cadre vert, 臺灣製造, filet rouge, MADE IN TAIWAN, mention.
 */
export function Enseigne({ mention }: { mention: string }) {
  return (
    <div className={styles.cadre}>
      <div className={styles.interieur}>
        <div className={styles.chinois}>臺灣製造</div>
        <div className={styles.filet} />
        <div className={styles.mot}>Made in Taiwan</div>
        <div className={styles.mention}>{mention}</div>
      </div>
    </div>
  );
}
