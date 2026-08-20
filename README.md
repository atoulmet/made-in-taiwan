# Made in Taiwan — Taipei, mes adresses

Guide personnel de Taipei : mes quartiers et mes adresses, à partager avec ceux
qui demandent des conseils sur Taïwan. Site statique, en français, avec le
chinois traditionnel en doublure des mots clés.

Le design vient de Claude Design ; le paquet d'origine (maquettes, transcriptions,
système de design) est conservé dans `design-handoff/`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # y coller la clé MapTiler
npm run dev                  # http://localhost:3000
```

Pour publier :

```bash
npm run build   # écrit le site complet dans out/
```

`out/` est un site entièrement statique : il se dépose tel quel sur n'importe
quel hébergeur (Netlify, Vercel, GitHub Pages, un simple dossier web).

## Où est le contenu

Tout le texte du site vit dans `content/`, en Markdown. Aucun besoin de toucher
au code pour écrire.

```
content/
  pages/                     en-tête des sept pages : numéro, titre, chinois,
                             phrase du sommaire, vignette
  visiter-taipei/
    quartiers/               les cinq fiches de quartier
    escapades/               Beitou, Tamsui, Jiufen
```

Une fiche de quartier :

```markdown
---
name: Maokong
chinese: 貓空
metro: Ligne marron · téléphérique
maps: https://www.google.com/maps/search/?api=1&query=Maokong+Taipei
note: Monte avant le coucher du soleil, redescends à la nuit.
photo:
  src: /photos/maokong.jpg
  alt: Salon de thé au-dessus des collines
  placeholder: photo — Maokong, salon de thé
carte:
  lng: 121.5883
  lat: 24.9683
  rayon: 900        # rayon de la zone dessinée sur la carte, en mètres
  coeur: true       # quartier du cœur de la ville : cadre la carte
  libelle: droite   # côté du libellé sur la carte
  note: Salons de thé au-dessus des collines.
---

Le paragraphe de la fiche s'écrit ici.
```

- **`note` absent** → la fiche affiche le cadre pointillé « Ma note — à compléter ».
- **`photo.src` vide** → l'emplacement reste visible et annonce la photo attendue.
- Les fichiers sont numérotés (`1-maokong.md`, `2-dadaocheng.md`…) : c'est cet
  ordre qui fixe l'ordre d'affichage.

### Ajouter une photo

Déposer le fichier dans `public/photos/`, puis renseigner `photo.src`
(`/photos/mon-image.jpg`) et `photo.alt` dans le fichier de contenu concerné.

### Ajouter un quartier

Créer un fichier dans `content/visiter-taipei/quartiers/`, sur le modèle
ci-dessus. Il apparaît à la fois dans la colonne de gauche et sur la carte.

## Le code

- **Next.js (App Router) en export statique**, TypeScript, CSS Modules.
- `app/` — une route par page. `app/globals.css` porte la palette et les polices.
- `components/` — en-tête, logo, cartouche d'enseigne, emplacement photo, carte,
  pied de page.
- `lib/content.ts` — lecture du Markdown (`gray-matter` + `marked`).

Les maquettes utilisaient des styles en attributs `style` inline (contrainte de
l'outil de design) et un composant `<image-slot>` propre à cet outil : ici, les
valeurs sont passées en jetons CSS (`--vert`, `--creme`, `--titre`…) et les
emplacements photo sont de vraies balises `<img>`.

## La carte

`components/TaipeiMap.tsx`, seul îlot interactif du site : SDK MapTiler, style
`BASIC`, libellés latins, molette désactivée pour ne pas piéger le défilement.
Chaque lieu est dessiné comme une zone (cercle approximatif) plus un marqueur.

Ce sont des **zones d'ambiance, pas des limites administratives** — Dadaocheng
et Maokong n'ont d'ailleurs pas de frontière officielle. Charger les vrais
tracés de districts reste à faire pour ceux qui existent.

La clé MapTiler est lue dans `NEXT_PUBLIC_MAPTILER_KEY` et injectée au build.
Elle reste lisible dans le site publié — inévitable pour une carte affichée côté
client : la protection se fait en **restreignant la clé au domaine du site**,
dans le compte MapTiler.

## Les polices

| Police | Rôle | Source |
|---|---|---|
| Alloha | titres et wordmark | `public/fonts/Alloha.woff2` — **police achetée, licence web à vérifier avant publication** |
| S2G Moon | chinois traditionnel | `public/fonts/S2G-moon.woff2` |
| Karla | corps de texte, micro-labels | Google Fonts |
| Noto Sans TC | repli du chinois | Google Fonts |

**Glyphes vides.** `S2G-moon` contient dix glyphes vides (份 你 卡 啤 埕 奶 燙 蔥
貓 麵). Le repli navigateur ne s'active pas tout seul — le glyphe existe, il est
juste vide — donc ces dix points de code sont exclus par `unicode-range` dans
`app/globals.css` pour retomber sur Noto Sans TC. **Ne pas modifier cette
règle** : sans elle, 貓空, 大稻埕, 九份 s'affichent troués.

## Ce qui reste à faire

- Les cinq pages **Manger**, **Moi et Taiwan**, **La culture**, **Conseils
  pratiques**, **Galerie photos** : la navigation, le titre et le pied de page
  sont en place, le contenu reste à écrire (voir `components/PageAVenir.tsx`).
- Les notes personnelles des quartiers autres que Maokong.
- Toutes les photos et illustrations.
