import Link from 'next/link';
import { PageFooter } from '@/components/PageFooter';
import { PhotoSlot } from '@/components/PhotoSlot';
import { SiteHeader } from '@/components/SiteHeader';
import { lirePage, lirePages, type Photo } from '@/lib/content';
import styles from './accueil.module.css';

type Ouverture = {
  titre: string;
  chinese: string;
  mention: string;
  photo: Photo;
};

type CoupDeCoeur = { titre: string; chinese: string; texte: string };

export default function Accueil() {
  const page = lirePage('accueil');
  const pages = lirePages();
  const ouverture = page.ouverture as Ouverture;
  const sommaire = page.sommaire as { label: string; chinese: string };
  const coupDeCoeur = page.coupDeCoeur as CoupDeCoeur;
  const pied = page.pied as { gauche: string; droite: string };

  return (
    <>
      <SiteHeader page={page} pages={pages} enseigne={page.enseigne as { mention: string }} />

      <section className={styles.ouverture}>
        <div className={styles.grilleOuverture}>
          <div className={styles.cartouche}>
            <h1 className={styles.titre}>
              {ouverture.titre.split('\n').map((ligne, i) => (
                <span key={i} className={styles.ligneTitre}>
                  {ligne}
                </span>
              ))}
            </h1>
            <div className={styles.filet} />
            <div className={styles.chinois}>{ouverture.chinese}</div>
            <div className={styles.intro} dangerouslySetInnerHTML={{ __html: page.html }} />
            <div className={styles.mentionCartouche}>{ouverture.mention}</div>
          </div>

          <PhotoSlot photo={ouverture.photo} className={styles.photoOuverture} />
        </div>
      </section>

      <section className={styles.sommaire}>
        <div className={styles.entete}>
          <h2 className={styles.labelSection}>{sommaire.label}</h2>
          <div className={styles.trait} />
          <div className={styles.chinoisSection}>{sommaire.chinese}</div>
        </div>

        <div className={styles.cartes}>
          {pages
            .filter((p) => p.slug !== 'accueil')
            .map((p) => (
              <Link key={p.slug} href={p.href} className={styles.carte}>
                <PhotoSlot photo={p.photo} variant="bas" className={styles.vignette} />
                <div className={styles.corpsCarte}>
                  <div className={styles.numero}>{p.num}</div>
                  <div className={styles.titreCarte}>{p.title}</div>
                  <div className={styles.chinoisCarte}>{p.chinese}</div>
                  <p className={styles.teaser}>{p.teaser}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className={styles.coupDeCoeur}>
        <div className={styles.blocVert}>
          <div>
            <h2 className={styles.titreVert}>{coupDeCoeur.titre}</h2>
            <p className={styles.texteVert}>{coupDeCoeur.texte}</p>
          </div>
          <div className={styles.chinoisVert}>{coupDeCoeur.chinese}</div>
        </div>
      </section>

      <PageFooter gauche={{ label: pied.gauche }} droite={{ label: pied.droite }} />
    </>
  );
}
