import styles from './Logo.module.css';

/**
 * Logo rond — la version compacte de l'enseigne, en tête des pages intérieures.
 * Toutes ses dimensions sont en em : pour le redimensionner, régler le
 * font-size du parent (21px dans les pages, soit ~135px de diamètre).
 */
export function Logo() {
  return (
    <div className={styles.medaillon}>
      <div className={styles.anneau} />
      <div className={styles.contenu}>
        <div className={styles.chinois}>臺灣製造</div>
        <div className={styles.filet} />
        <div className={styles.mot}>Made in Taiwan</div>
      </div>
    </div>
  );
}
