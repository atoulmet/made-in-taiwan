import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

/** Racine du contenu éditorial : tout le texte du site vit ici, en Markdown. */
const CONTENU = path.join(process.cwd(), 'content');

/** Un emplacement photo. `src` vide = cadre laissé volontairement vide. */
export type Photo = {
  src?: string;
  alt?: string;
  /** Ce qu'on attend dans le cadre, affiché tant qu'il n'y a pas de photo. */
  placeholder: string;
};

/** En-tête d'une page : alimente la nav, le bandeau, le sommaire et le pied de page. */
export type Page = {
  /** Numéro affiché dans le bandeau et sur la carte de sommaire (« 00 » … « 06 »). */
  num: string;
  slug: string;
  /** Chemin de la route. L'accueil est à la racine. */
  href: string;
  title: string;
  /** Nom court dans la barre de navigation, si différent du titre. */
  nav: string;
  /** Nom de la page en chinois, doublé dans le bandeau. */
  chinese: string;
  /** Nom repris dans les liens précédent / suivant du pied de page. */
  footerLabel: string;
  /** Phrase de la carte de sommaire sur l'accueil. */
  teaser: string;
  /** Vignette de la carte de sommaire. */
  photo: Photo;
  /** Le contenu de la page est-il écrit ? Les pages à venir gardent la nav intacte. */
  aVenir?: boolean;
  /** Le corps du Markdown, converti en HTML. */
  html: string;
  /** Les autres champs de l'en-tête, propres à chaque page. */
  [key: string]: unknown;
};

/** Une fiche : quartier, escapade, adresse… Le corps Markdown est son paragraphe. */
export type Fiche = {
  slug: string;
  html: string;
  [key: string]: unknown;
};

function lire(fichier: string) {
  const { data, content } = matter(fs.readFileSync(fichier, 'utf8'));
  return {
    slug: path.basename(fichier, '.md').replace(/^\d+-/, ''),
    html: (marked.parse(content.trim(), { async: false }) as string).trim(),
    ...data,
  };
}

/** Lit un dossier de fiches, dans l'ordre alphabétique des fichiers (préfixés 1-, 2-…). */
export function lireDossier(...segments: string[]): Fiche[] {
  const dossier = path.join(CONTENU, ...segments);
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => lire(path.join(dossier, f)) as Fiche);
}

/** Les sept pages du site, dans l'ordre du sommaire. */
export function lirePages(): Page[] {
  return lireDossier('pages') as unknown as Page[];
}

export function lirePage(slug: string): Page {
  const page = lirePages().find((p) => p.slug === slug);
  if (!page) throw new Error(`Page introuvable dans content/pages : ${slug}`);
  return page;
}

/** Page précédente et suivante, pour les liens du pied de page. */
export function voisines(slug: string): { avant?: Page; apres?: Page } {
  const pages = lirePages();
  const i = pages.findIndex((p) => p.slug === slug);
  return { avant: pages[i - 1], apres: pages[i + 1] };
}

/* Photos ------------------------------------------------------------------ */

/** Dossier servi par Next, alimenté par `npm run photos` depuis content/photos. */
const PHOTOS = path.join(process.cwd(), 'public', 'photos');

/** Minuscules, sans accents ni séparateurs : « Da'an — Est » → « daanest ». */
function normaliser(nom: string) {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Les photos rangées par dossier, lues au build. Déposer des fichiers dans
 * `content/photos/<Quartier>/` suffit : ils apparaissent sur la fiche du
 * quartier du même nom, sans rien écrire dans le Markdown.
 */
export function photosParDossier(): Record<string, string[]> {
  if (!fs.existsSync(PHOTOS)) return {};
  const par: Record<string, string[]> = {};
  for (const dossier of fs.readdirSync(PHOTOS)) {
    const chemin = path.join(PHOTOS, dossier);
    if (!fs.statSync(chemin).isDirectory()) continue;
    par[normaliser(dossier)] = fs
      .readdirSync(chemin)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/photos/${dossier}/${f}`);
  }
  return par;
}

/**
 * Les photos d'une fiche. Le dossier est retrouvé par son nom : d'abord le
 * champ `photos:` de l'en-tête s'il est renseigné, sinon le slug, sinon le
 * nom affiché. Rien ne correspond ? La fiche garde son cadre d'attente.
 */
export function photosDe(fiche: Fiche, par: Record<string, string[]>): string[] {
  for (const piste of [fiche.photos as string | undefined, fiche.slug, fiche.name as string]) {
    if (!piste) continue;
    const trouve = par[normaliser(piste)];
    if (trouve?.length) return trouve;
  }
  return [];
}
