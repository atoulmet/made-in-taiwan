import type { Photo } from '@/lib/content';
import styles from './PhotoSlot.module.css';

type Props = {
  photo?: Photo;
  /** Le cadre reçoit sa hauteur de la page qui l'utilise. */
  className?: string;
  /** `cadre` : filet sur les quatre côtés. `bas` : filet en bas seulement
   *  (vignettes du sommaire, où la carte porte déjà son propre cadre). */
  variant?: 'cadre' | 'bas';
};

/**
 * Emplacement photo. Tant qu'aucune image n'est renseignée dans le Markdown,
 * le cadre reste visible et annonce ce qui doit y venir — mieux qu'une image
 * de remplissage.
 *
 * Pour remplir un emplacement : déposer le fichier dans `public/photos/` puis
 * renseigner `photo.src` (et `photo.alt`) dans le fichier de contenu.
 */
export function PhotoSlot({ photo, className, variant = 'cadre' }: Props) {
  const classes = [styles.cadre, variant === 'bas' && styles.filetBas, className]
    .filter(Boolean)
    .join(' ');

  if (!photo?.src) {
    return (
      <div className={`${classes} ${styles.vide}`}>
        <span className={styles.attente}>{photo?.placeholder ?? 'photo — à venir'}</span>
      </div>
    );
  }

  return (
    <div className={classes}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.alt ?? ''} loading="lazy" className={styles.image} />
    </div>
  );
}
