# Identité visuelle Taiwan retro

_Started 2026-08-20 07:55 UTC_

---

## User

Je veux chercher une identité visuelle qui soit dans l'esprit de Taiwan. Une petite marque un peu retro mais pas trop. Je veux mettre en avant du vert (le vert du DPP en plus foncé), un peu de rouge et banc noir. Éventuellement un peu de bleu foncé. Je te passe des screenshots de visuels qui me plaisent. J'écrirai en français et je mettrai des caractères chinois donc je veux aussi une police chinoise.

## User

Je veux chercher une identité visuelle qui soit dans l'esprit de Taiwan. Une petite marque un peu retro mais pas trop. Je veux mettre en avant du vert (le vert du DPP en plus foncé), un peu de rouge et banc noir. Éventuellement un peu de bleu foncé. Je te passe des screenshots de visuels qui me plaisent. J'écrirai en français et je mettrai des caractères chinois donc je veux aussi une police chinoise.

## Assistant

_[tool: ask_user]_

J'attends tes réponses (surtout le nom/secteur de la marque et les livrables) avant de dessiner.

## User

Answered — brand: Made in Taiwan; deliverables: Palette, Spécimen typo (FR + 中文), Motifs & textures; retro_level: Équilibré; chinese_script: Traditionnel (台灣); logo_type: option_1, option_3, option_4; variations: 3 directions

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

Trois directions sur la même planche (pan/zoom activé) : **1a** enseigne émaillée (Anton + Noto Sans TC, vert profond/rouge laqué, filets doubles), **1b** papier & mahjong (Instrument Serif + Noto Serif TC, crème, pastilles), **1c** nuit & néon (Space Grotesk + Noto Sans TC, bleu nuit dominant). Chinois traditionnel partout.

Dis-moi laquelle pousser — j'ajouterai logo, packaging ou affiche dessus.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Corrigé : les trois planches gardent leur largeur et s'alignent côte à côte.

## User

Alors j'adore la palette du 1 sauf #7EA24B. Pour les motifs, peux tu m'en proposer d'autres ?

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

**2a** en haut : 12 motifs sur la palette 1a, avec #7EA24B remplacé par un brun-olive sombre (#4A4636) — papier quadrillé, store rayé, écailles, éventail, grillage 鐵窗花, bâtonnets, pastilles mahjong, losanges émaillés, nappe, carreaux, tressage, ticket. Deux mises en situation en bas.

Dis-moi les numéros que tu gardes.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

La carte 2a a maintenant sa largeur propre (1336px) — plus de débordement.

## User

Super merci, maintenant est-ce qu'on peut itérer sur les typos ? française dans un premier temps. Pour les titres je veux une typo plus cursive, et propose moi d'autres pairing pour le texte body avec

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Turn 3 en haut : quatre titres cursifs sur la palette 1a — **3a** Grand Hotel (enseigne années 30), **3b** Yellowtail (pinceau 50s), **3c** Petit Formal Script (gravé, étiquette), **3d** Pinyon Script (anglaise fine). Chacun avec 3 pairings body différents (Karla, Spectral, Archivo, IBM Plex Sans, Newsreader, Space Grotesk, JetBrains Mono).

Donne-moi le couple qui te parle (ex. 3b + Newsreader) et je passe au chinois.Compris — j'abandonne les scripts. Je remplace par des italiques typographiques (didone, garamond, serif d'affiche) : rétro sans faire faux manuscrit.

_[tool: run_script]_

_[tool: ready_for_verification]_

Zéro script : **4a** Bodoni Moda italique (didone d'affiche), **4b** DM Serif Display italique (large, généreux), **4c** Cormorant Garamond italique (fin, lettré), **4d** Newsreader italique (éditorial). Les pairings body restent en dessous de chacun.

Si l'italique ne te convainc pas non plus, dis-le : on part sur des romains à fort caractère (condensés, empattements lourds, grotesques rétro).

## User

Par exemple j'adore la typo Silk Flower, mais je veux un truc moins rond

## Assistant

_[tool: run_script]_

_[tool: web_search]_

_[tool: ready_for_verification]_

Silk Flower est un display serif à fort contraste, mais à courbes molles — donc même registre, terminaisons taillées : **5a** Gloock (le plus proche, angles secs), **5b** Instrument Serif (étroit, gravé), **5c** Rozha One (didone à terminaisons en lame), **5d** Young Serif (empattements lourds, artisanal). Chacun avec accents FR et un body.

Dis-moi le numéro et j'accorde le chinois traditionnel dessus.

## User

Vas y fait des variant du premier 1A avec les typos 5A et 5D

## User

Vas y fait des variant du premier 1A avec les typos 5A et 5D

## User

J'aime pas en fait, tu avais raison, il faut une typo en majuscules. Montre moi des typos en majuscules, avec serif légères. On garde Gloock pour les seconds titres, et karla pour le body

## Assistant

_[tool: run_script]_

## Assistant

_[tool: ready_for_verification]_

Six capitales à serif léger, toutes montées avec Gloock en second titre et Karla en body : **7a** Cinzel (lapidaire), **7b** Marcellus (empattements évasés), **7c** Italiana (didone très fine), **7d** Cormorant Light (garamond doux), **7e** Antic Didone (sobre), **7f** Gilda Display (un peu affiche).

Choisis-en une et je décline la planche complète (palette + motifs + chinois) dessus.

## User

Et Cormorant en moins light ? avec d'autres variants ?

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

**8a** l'échelle de graisse (400→700, même corps) — en capitales, 500/600 tiennent le mieux. Puis les variantes en 600 : **8b** Garamond (plus large, plus stable en petit), **8c** Infant (terminaisons adoucies), **8d** Unicase (bas-de-casse à hauteur de capitale, très identitaire), **8e** SC (vraies petites capitales, idéal wordmark).

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

D'abord **9a** : la même Cormorant à 0,14 / 0,06 / 0,02 / 0em — souvent c'est juste le réglage. Puis six capitales naturellement plus compactes : **9b** EB Garamond, **9c** Crimson Pro, **9d** Sorts Mill Goudy (le plus rétro), **9e** Prata (didone verticale), **9f** Spectral, **9g** Petrona (la plus resserrée). Interlettrage 0,02–0,04em partout.

## User

Go pour refaire 1A avec Cormorant 600 et 0em en espace interlettrage. Mais space grotest en body

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

**10a** en haut : wordmark Cormorant 600 en capitales à 0em, chinois traditionnel en Noto Sans TC 900 vert, Gloock pour les seconds titres, Space Grotesk pour tout le body et les mentions. Palette 1a + motifs 05 et 12 en application.

Prochaine étape si tu veux : décliner en packaging, affiche ou signalétique.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

10a fait bien 880px de large, aligné avec les autres planches.

## User

Vire Cormorant et met Gloock en majuscules pour voir

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

10a passe en Gloock capitales (corps réduits, Gloock est bien plus épais que Cormorant) ; seconds titres en Gloock bas-de-casse, body Space Grotesk inchangé.

## User

Ok à la place de #4A4636 je veux un rouge un peu plus orangé en plus

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Palette 10a : #4A4636 remplacé par un rouge orangé brique #C1512A (même chroma que le #9E2B20, hue décalée vers l'orange). Dis-moi si tu le veux plus vif ou plus terreux.

## User

Peux tu me donner le design system ? Je vais partir dans une nouvelle task

## Assistant

_[tool: write_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Deux livrables :

- **Design System Made in Taiwan.dc.html** — la planche visuelle (couleurs, échelle typo, motifs, composants, ton).
- **design-system.md** — la version texte avec tous les hex, les URLs de fonts et les snippets CSS des motifs : c'est ce fichier à coller dans ta nouvelle task.

