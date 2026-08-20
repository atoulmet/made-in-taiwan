# Handoff : « Made in Taiwan » — guide personnel de Taipei

## Vue d'ensemble

Site statique personnel : les adresses et quartiers préférés de l'autrice à Taipei, à partager avec ceux qui demandent des conseils sur Taïwan. Sept pages : un accueil-sommaire et six pages de contenu (Visiter Taipei, Manger, Moi et Taiwan, La culture, Conseils pratiques, Galerie photos). Langue : français, avec le chinois traditionnel en doublure des mots clés.

## À propos des fichiers de design

Les fichiers de ce paquet sont des **références de design réalisées en HTML** — des prototypes qui montrent l'intention visuelle et le comportement attendu, **pas du code de production à copier tel quel**. Le travail consiste à **recréer ces designs dans l'environnement du dépôt cible** (React/Next, Astro, Eleventy, Vue…) avec ses conventions et ses bibliothèques. S'il n'y a pas encore de codebase, un générateur de site statique (Astro ou Eleventy) est le choix le plus adapté : le site est composé de pages statiques, sans back-end, avec un seul îlot interactif (la carte).

Les `.dc.html` sont des composants de design : le markup utile se trouve entre `<x-dc>` et `</x-dc>`. Tout le style est **en attributs `style` inline** — c'est une contrainte de l'outil de design, pas une recommandation. Dans le codebase cible, extrais ces valeurs vers le système de style en place (CSS modules, Tailwind, styled-components…).

## Fidélité

**Haute fidélité (hifi).** Couleurs, typographies, tailles, espacements et interactions sont définitifs. Le rendu doit être reproduit au pixel près, en réutilisant les composants existants du codebase là où c'est possible.

## Design tokens

### Couleurs

| Rôle | Hex | Usage |
|---|---|---|
| Vert enseigne | `#04492C` | barre de nav, bandeau, cadres, chinois, blocs pleins |
| Rouge laqué | `#9E2B20` | filets, seconds titres, micro-labels d'accent |
| Brique orangée | `#C1512A` | soulignage manuscrit de la nav, pastilles de carte |
| Encre | `#16150F` | titres sur crème |
| Crème | `#F6F3E8` | fond principal |
| Crème claire | `#FBF9F1` | intérieur des cartes et cartouches |
| Filet | `#CFCABB` | bordures 1px, séparateurs |
| Texte courant | `#35322A` | paragraphes |
| Texte secondaire | `#6A6656` | légendes, mentions |
| Crème sur vert | `#D4CDB8` / `#DCD6C2` / `#E4DFCE` | textes secondaires sur fond vert |

Règles : un seul fond par surface (crème **ou** vert). Jamais rouge et brique en aplats côte à côte.

### Typographie

- **Titres, wordmark** — `Alloha` (fichier fourni : `Alloha.ttf`), capitales. Police display achetée par l'autrice — à déclarer en `@font-face`, à convertir en `woff2` pour la production.
- **Corps de texte, micro-labels** — `Karla` (Google Fonts, 400/500/700).
- **Chinois traditionnel** — `S2G Moon` (fichier fourni : `S2G-moon.ttf`), avec `'Noto Sans TC'` en repli.

**Piège important — glyphes vides.** `S2G-moon.ttf` contient dix glyphes vides : 份 你 卡 啤 埕 奶 燙 蔥 貓 麵 (U+4EFD, U+4F60, U+5361, U+5564, U+57D5, U+5976, U+71D9, U+8525, U+8C93, U+9EB5). Le repli navigateur ne s'active pas (le glyphe existe, il est juste vide), donc ces points de code sont **exclus par `unicode-range`** dans la règle `@font-face`, pour retomber sur Noto Sans TC. Conserver cette règle telle quelle :

```css
@font-face {
  font-family: 'S2G Moon';
  src: url('./S2G-moon.ttf') format('truetype');
  font-weight: 400 900;
  font-display: swap;
  unicode-range: U+0-4EFC, U+4EFE-4F5F, U+4F61-5360, U+5362-5563, U+5565-57D4,
                 U+57D6-5975, U+5977-71D8, U+71DA-8524, U+8526-8C92, U+8C94-9EB4, U+9EB6-10FFFF;
}
```

### Échelle typographique (px)

Titre de page 60 · titre de fiche 40 · wordmark header 54 · titre de carte 26-30 · corps 17 · corps secondaire 15-16 · micro-label 11-12 (capitales, `letter-spacing: .20–.28em`) · chinois de carte 20-22 · chinois de header 62.

### Espacements et divers

- Largeur de contenu : `max-width: 1080px`, `padding: 0 32px`.
- Gouttières : 18-28px entre cartes, 36-56px entre sections.
- Rayons : **5px** sur les pastilles de ligne de métro et le badge de carte. Aucun autre arrondi (pas de cartes arrondies).
- Bordures : `1px solid #CFCABB` (cartes), `2px solid #16150F` (étiquettes), `6px double #04492C` (cartouche d'enseigne), `2px + 1px solid #04492C` (double filet du logo rond).
- `text-wrap: pretty` sur les paragraphes.

## Structure de chaque page

Toutes les pages partagent le même en-tête, dans cet ordre :

1. **Barre de navigation** — pleine largeur, fond `#04492C`, bordure basse `1px solid rgba(246,243,232,.3)`. Liens centrés (`max-width:1080px`), Karla 11px 700, capitales, `letter-spacing:.22em`, couleur `#DCD6C2`, `padding-bottom:12px`, `display:inline-block`. La page active est en `#FBF9F1` et porte un **soulignage manuscrit** : un `<svg>` en `position:absolute` sous le mot, une seule courbe irrégulière (`stroke #C1512A`, `stroke-width 2.6`, `stroke-linecap round`), `width: calc(100% + 6px)`, `height: 9px`. Tous les liens ont le même `padding-bottom` et la nav est en `align-items: baseline` — l'élément actif **ne doit pas remonter**.
2. **Bandeau d'identification** — fond `#04492C`, `padding:12px 32px`, `justify-content:space-between`. À gauche : une puce crème avec le numéro de page (`00`…`06`) puis « NOM DE PAGE · 中文 ». À droite : « TAIPEI · GUIDE PERSONNEL ».
3. **Marque** — sur l'accueil, un **cartouche d'enseigne** pleine largeur : `border:2px solid #04492C` + `padding:5px` + intérieur `border:1px solid #04492C` sur `#FBF9F1`, centré, contenant 臺灣製造 (62px, vert), un filet rouge de 3px (52 % de large, `max-width:520px`), MADE IN TAIWAN (Alloha 54px, `#9E2B20`) et la mention « TAIPEI · MES ADRESSES · 2026 ». Sur les six pages intérieures, ce bloc est remplacé par le **logo rond** (`Logo.dc.html`), lien vers l'accueil.
4. **Contenu de la page**, puis un pied de page : bande « ticket » (`repeating-linear-gradient` noir 1px/7px + filet rouge 14px) et deux liens de navigation précédent / suivant en micro-caps.

### Logo rond (`Logo.dc.html`)

Médaillon de `6.4em` de côté, `border-radius:50%`, fond `#FBF9F1`, `border:.17em solid #04492C`, plus un cercle intérieur `inset:.2em; border:.05em solid #04492C`. Contenu centré : 臺灣製造 (`1.15em`, `white-space:nowrap`), filet rouge `2.4em × .07em`, MADE IN TAIWAN (Alloha `.68em`, `nowrap`). **Toutes les dimensions sont en `em`** : le logo se met à l'échelle en réglant le `font-size` du parent (21px dans les pages, soit ~135px de diamètre). Ne pas remettre de ligne de mention supplémentaire : sous 8px elle devient illisible.

### Accueil

Cartouche + photo d'ouverture (grille `minmax(0,1.05fr) minmax(0,1fr)`), puis un sommaire de six cartes en `repeat(3, minmax(0,1fr))` (vignette 180px, numéro, titre, chinois, une phrase), puis un bloc plein vert « Si tu ne fais qu'une chose » (Maokong).

### Visiter Taipei — la page à traiter en priorité

Sous l'intro, une section en **deux colonnes pleine fenêtre** (hors conteneur 1080) :

- Colonne gauche : `padding-left: max(32px, calc(50vw - 540px))` pour rester alignée sur la grille du site ; cinq fiches de quartier compactes en `grid-template-columns:112px minmax(0,1fr)` (vignette carrée + titre Alloha 30px, chinois 22px, pastille de ligne de métro, un paragraphe, un encadré « Ma note », un lien Google Maps).
- Colonne droite : `position:sticky; top:0; height:100vh; border-left:1px solid #04492C`, contenant la carte en `<iframe>` plein cadre, plus un badge « LA CARTE · 地圖 » en haut à gauche (`pointer-events:none`).

Puis, en pleine largeur, trois « escapades » (Beitou, Tamsui, Jiufen) en cartes `border:2px solid #16150F`.

Toutes les grilles du site utilisent **`minmax(0, …)`** sur les pistes `fr` : sans ça, les emplacements d'image imposent leur largeur intrinsèque et la page défile horizontalement.

### Autres pages

- **Manger** — quatre moments de la journée (matin, midi, nuit, boire), chacun avec vignette, paragraphe, quatre puces « mot chinois + traduction », et un emplacement « Mes adresses — à compléter ». Bloc vert final « Trois règles ».
- **Moi et Taiwan** — texte d'introduction + portrait, trois cartes (arriver / habiter / revenir), cartouche final « Ce que je dis toujours ».
- **La culture** — quatre cartes (temples, thé, mahjong, grilles 鐵窗花) en deux colonnes, puis un bloc vert « Dix mots qui suffisent » (grille de 5 colonnes : caractère 26px crème + traduction 13px `#D4CDB8`).
- **Conseils pratiques** — six cartes `border:2px solid #16150F` (EasyCard, métro, saisons, argent, SIM, quotidien), puis un cartouche « Trois jours, si tu n'as que ça ».
- **Galerie photos** — grille de sept emplacements photo de hauteurs variées (`grid-column: span 2` sur deux d'entre eux), chacun avec une légende à écrire.

## Interactions et comportement

- **Navigation** : liens `<a>` classiques entre pages, pas de routeur nécessaire. Le logo et le cartouche renvoient à l'accueil.
- **Carte** (`map-taipei.html`) : MapTiler SDK JS (bundle UMD via CDN), style `MapStyle.BASIC`, `language: LATIN`, `scrollZoom: false` (pour ne pas piéger le défilement), contrôle de zoom en bas à droite. Huit lieux ; chacun est dessiné comme une **zone** (polygone circulaire calculé en JS, rayon 600 à 1300 m selon le quartier ; `fill #04492C` à 10 %, contour `line-dasharray [3,2]`, 1.6px) plus un marqueur DOM (point de 7px + libellé en micro-caps, ancré à gauche ou à droite selon le lieu pour éviter les collisions). Au clic, une popup crème encadrée de vert donne quartier, chinois, ligne de métro, note.
  - `map.fitBounds` est calculé sur les cinq quartiers du cœur de la ville uniquement.
  - Ces zones sont des **approximations d'ambiance**, pas des limites administratives — c'est volontaire. Le travail non fait : charger les vrais tracés de districts (Da'an, Wanhua, Beitou…) pour ceux qui existent officiellement.
  - **Clé API** : `bzu2h9qXhaBmxOqO38bF` est en clair dans le fichier. À déplacer en variable d'environnement au build et à restreindre au domaine de production dans le compte MapTiler.
- **Emplacements photo** : dans le prototype, ce sont des `<image-slot>` (composant de l'outil de design, déposer-glisser). Dans le codebase cible, **remplace-les par de vraies balises `<img>`** (ou le composant image du framework), avec `object-fit: cover` et le même cadre `1px solid #CFCABB`. Les photos ne sont pas encore fournies : prévoir des emplacements et une légende par image.
- Aucun état applicatif, aucun appel réseau hors carte et polices.

## Contenu à finir (côté autrice)

- Les fiches marquées « Ma note — à compléter » et « Mes adresses — à compléter » attendent son texte. Seule la fiche Maokong est rédigée intégralement.
- Toutes les photos et illustrations.
- Les légendes de la galerie.

Garder ces emplacements visibles et clairement identifiés comme vides plutôt que de les remplir avec du texte de remplissage.

## Ton éditorial

Français simple, phrases courtes, pas de superlatif. Le chinois double le message clé, jamais tout le texte. Le rétro passe par les cadres, les filets et les motifs — jamais par du faux manuscrit ni du grain lourd (le soulignage de la nav est la seule exception, volontaire).

## Assets fournis

| Fichier | Rôle |
|---|---|
| `Accueil.dc.html` … `Galerie-photos.dc.html` | les sept pages |
| `Logo.dc.html` | le médaillon rond |
| `map-taipei.html` | la carte MapTiler (page HTML autonome, chargée en iframe) |
| `Alloha.ttf` | police de titrage (achetée — vérifier la licence web) |
| `S2G-moon.ttf` | police chinoise |
| `design-system.md` | le système de design d'origine (palette, motifs CSS, composants) |
| `image-slot.js`, `support.js` | dépendances de l'outil de design — **à ne pas porter** dans le codebase cible |

Polices Google utilisées : Karla (corps). `Anton` et `Yeseva One` apparaissent encore dans les `<link>` de certaines pages : ce sont des reliquats d'exploration, ils peuvent être retirés.
