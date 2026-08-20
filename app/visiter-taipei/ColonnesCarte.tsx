'use client';

import { useState, type ReactNode } from 'react';
import { TaipeiMap, type Filtres, type LieuCarte } from '@/components/TaipeiMap';
import styles from './visiter.module.css';

/** L'ordre des étiquettes, et le mot affiché pour chaque famille de points. */
const ETIQUETTES: { cle: keyof Filtres; label: string }[] = [
  { cle: 'quartier', label: 'Quartiers' },
  { cle: 'marche', label: 'Marchés de nuit' },
  { cle: 'lieu', label: 'Lieux à visiter' },
];

type Props = {
  lieux: LieuCarte[];
  /** Le label de la colonne de gauche (« Six quartiers »). */
  labelQuartiers: string;
  badge: string;
  titre: string;
  /** Les fiches, rendues côté serveur et passées telles quelles. */
  children: ReactNode;
};

/**
 * Les deux colonnes de la page : les fiches défilent à gauche, la carte reste
 * à droite. Le seul état est ici — les étiquettes et la carte doivent le
 * partager alors qu'elles vivent dans deux colonnes différentes.
 */
export function ColonnesCarte({ lieux, labelQuartiers, badge, titre, children }: Props) {
  const [filtres, setFiltres] = useState<Filtres>({
    quartier: true,
    lieu: true,
    marche: true,
  });

  const basculer = (cle: keyof Filtres) =>
    setFiltres((actuels) => ({ ...actuels, [cle]: !actuels[cle] }));

  return (
    <div className={styles.deuxColonnes}>
      <div className={styles.colonneFiches}>
        <div className={styles.etiquettes}>
          {ETIQUETTES.map(({ cle, label }) => (
            <button
              key={cle}
              type="button"
              onClick={() => basculer(cle)}
              aria-pressed={filtres[cle]}
              className={`${styles.etiquette} ${filtres[cle] ? styles.etiquetteActive : ''}`}
            >
              <span className={`${styles.puce} ${styles[`puce_${cle}`]}`} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className={styles.enteteColonne}>
          <div className={styles.labelColonne}>{labelQuartiers}</div>
          <div className={styles.trait} />
        </div>

        {children}
      </div>

      <div className={styles.colonneCarte}>
        <div className={styles.cadreCarte} title={titre}>
          <TaipeiMap lieux={lieux} filtres={filtres} />
        </div>
        <div className={styles.badgeCarte}>{badge}</div>
      </div>
    </div>
  );
}
