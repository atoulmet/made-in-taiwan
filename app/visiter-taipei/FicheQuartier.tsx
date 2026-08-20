'use client';

import { useEffect, useRef, useState } from 'react';
import { PhotoSlot } from '@/components/PhotoSlot';
import type { Photo } from '@/lib/content';
import styles from './visiter.module.css';

export type DonneesFiche = {
  name: string;
  chinese: string;
  metro: string;
  /** Le corps du Markdown, déjà converti en HTML. */
  html: string;
  note?: string;
  maps?: string;
  /** Le cadre d'attente, tant qu'aucune photo n'est déposée. */
  photo: Photo;
  /** Les photos trouvées dans content/photos/<Quartier>/, s'il y en a. */
  photos: string[];
};

/**
 * La photo à afficher : celle du dossier si l'autrice en a déposé, sinon le
 * cadre d'attente décrit dans l'en-tête du Markdown.
 */
function photo(quartier: DonneesFiche, index: number): Photo {
  const src = quartier.photos[index];
  return src ? { src, alt: `${quartier.name} — photo ${index + 1}`, placeholder: '' } : quartier.photo;
}

/**
 * Le contenu d'une fiche, écrit une fois pour les deux affichages : replié
 * dans la colonne, déplié dans la modale. `grand` ne change que les tailles.
 */
function Corps({ quartier, grand }: { quartier: DonneesFiche; grand?: boolean }) {
  return (
    <>
      <div className={styles.enteteFiche}>
        <h2 className={grand ? styles.nomFicheGrand : styles.nomFiche}>{quartier.name}</h2>
        <div className={grand ? styles.chinoisFicheGrand : styles.chinoisFiche}>
          {quartier.chinese}
        </div>
      </div>

      <div className={styles.ligneMetro}>
        <span className={styles.pastilleMetro}>{quartier.metro}</span>
      </div>

      <div className={styles.texteFiche} dangerouslySetInnerHTML={{ __html: quartier.html }} />

      {quartier.note ? (
        <div className={styles.note}>
          <div className={styles.labelNote}>Ma note</div>
          <p className={styles.texteNote}>{quartier.note}</p>
        </div>
      ) : (
        <div className={styles.noteVide}>
          <div className={styles.labelNoteVide}>Ma note — à compléter</div>
        </div>
      )}

      {quartier.maps && (
        <div className={styles.lienMaps}>
          <a href={quartier.maps} target="_blank" rel="noreferrer">
            ↗ Google Maps
          </a>
        </div>
      )}
    </>
  );
}

/**
 * Une fiche de quartier. Repliée à 400 px dans la colonne ; si le texte
 * dépasse, un bouton ouvre la fiche en plein écran, photo agrandie et tout
 * le texte déroulé.
 */
export function FicheQuartier({ quartier }: { quartier: DonneesFiche }) {
  const [ouverte, setOuverte] = useState(false);
  const [active, setActive] = useState(0);
  const [deborde, setDeborde] = useState(false);
  const article = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);

  // « Voir plus » n'apparaît que si la fiche dépasse vraiment. La mesure se
  // refait au redimensionnement : la largeur de colonne change la hauteur.
  useEffect(() => {
    const el = article.current;
    if (!el) return;
    const mesurer = () => setDeborde(el.scrollHeight > el.clientHeight + 1);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [quartier]);

  // Échap ferme, la page ne défile pas derrière, et le focus revient au bouton.
  useEffect(() => {
    if (!ouverte) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuverte(false);
    };
    document.addEventListener('keydown', auClavier);
    const defilement = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', auClavier);
      document.body.style.overflow = defilement;
      bouton.current?.focus();
    };
  }, [ouverte]);

  return (
    <>
      <div ref={article} className={styles.fiche}>
        <PhotoSlot photo={photo(quartier, 0)} className={styles.vignetteFiche} />
        <div>
          <Corps quartier={quartier} />
        </div>

        {deborde && (
          <div className={styles.voile}>
            <button
              ref={bouton}
              type="button"
              className={styles.voirPlus}
              onClick={() => setOuverte(true)}
            >
              Voir plus
            </button>
          </div>
        )}
      </div>

      {ouverte && (
        <div
          className={styles.modale}
          role="dialog"
          aria-modal="true"
          aria-label={quartier.name}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOuverte(false);
          }}
        >
          <div className={styles.modaleCadre}>
            <button
              type="button"
              className={styles.fermer}
              onClick={() => setOuverte(false)}
              autoFocus
            >
              Fermer ✕
            </button>

            <div className={styles.modaleGrille}>
              <div className={styles.galerie}>
                <PhotoSlot photo={photo(quartier, active)} className={styles.photoModale} />

                {quartier.photos.length > 1 && (
                  <div className={styles.vignettes}>
                    {quartier.photos.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Photo ${i + 1} sur ${quartier.photos.length}`}
                        aria-current={i === active}
                        className={`${styles.vignette} ${i === active ? styles.vignetteActive : ''}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.modaleTexte}>
                <Corps quartier={quartier} grand />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
