# Made in Taiwan — Design System v1

Petite marque taïwanaise, rétro mesuré. Enseigne émaillée, épicerie de quartier.
Langues : français + chinois traditionnel (台灣).

## Couleurs

| Rôle | Hex | Usage |
|---|---|---|
| Vert enseigne | `#04492C` | couleur principale : cadres, bandeaux, chinois, titres |
| Rouge laqué | `#9E2B20` | accent : filets, seconds titres, bandeaux datés |
| Brique orangée | `#C1512A` | accent secondaire : aplats, packaging, tampons |
| Encre | `#16150F` | titres sur crème, texte fort |
| Crème | `#F6F3E8` | fond principal |
| Crème claire | `#FBF9F1` | fond des cartouches / intérieur de cadre |
| Bleu nuit | `#14213D` | usage rare : nuit, éditions limitées |
| Filet | `#CFCABB` | bordures 1px, séparateurs |
| Texte courant | `#35322A` | paragraphes |
| Texte secondaire | `#6A6656` | légendes, mentions |

Règles : un seul fond par surface (crème ou vert). Jamais rouge + brique côte à côte en aplats.
Le chinois prend le vert (ou le crème sur vert), pas le rouge quand le titre est déjà rouge.

## Typographie

- **Titres / wordmark** — Gloock, capitales, `letter-spacing: 0`, `line-height: 1.05–1.1`
- **Seconds titres** — Gloock bas-de-casse, couleur rouge `#9E2B20`
- **Body, mentions, chiffres** — Space Grotesk (400 / 500 / 700)
- **Chinois traditionnel** — Noto Sans TC 700 / 900 (variante serif : Noto Serif TC 900)
- **Micro-labels** — Space Grotesk, 11–12px, capitales, `letter-spacing: .20–.30em`

Échelle (px) : 60 · 40 · 30 · 26 · 17 · 12
Chinois : ~70 % du corps du titre latin, `letter-spacing: .08–.12em`

```
Gloock:        https://fonts.googleapis.com/css2?family=Gloock&display=swap
Space Grotesk: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap
Noto Sans TC:  https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap
```

## Motifs (CSS pur)

05 · Grillage 鐵窗花 — fond de packaging
```css
background-color: #f6f3e8;
background-image:
  repeating-linear-gradient(45deg, #04492c 0 3px, transparent 3px 16px),
  repeating-linear-gradient(-45deg, #04492c 0 3px, transparent 3px 16px);
```

12 · Ticket / reçu 收據 — bandeaux, en-têtes
```css
background-color: #f6f3e8;
background-image:
  repeating-linear-gradient(90deg, #16150f 0 1px, transparent 1px 7px),
  linear-gradient(0deg, #9e2b20 0 14px, transparent 14px),
  linear-gradient(180deg, #04492c 0 14px, transparent 14px);
```

07 · Pastilles 麻將筒 — doublure, fond secondaire
```css
background-color: #14213d;
background-image:
  radial-gradient(circle at center, #f6f3e8 0 5px, transparent 6px),
  radial-gradient(circle at center, #9e2b20 0 2px, transparent 3px);
background-size: 34px 34px;
background-position: 0 0, 17px 17px;
```

Version atténuée d'un motif en fond de cartouche : même dégradé, couleur à 6–7 % d'opacité.

## Composants

- **Cartouche d'enseigne** — `border: 6px double #04492c`, fond crème claire, motif 05 à 6 %, padding 38/32.
  Ordre : titre Gloock caps → filet rouge 3px (58 % de large) → chinois vert → ligne de mentions.
- **Bandeau daté** — barre rouge, texte crème 11px caps `letter-spacing: .28em`, lieu à gauche / année à droite.
- **Étiquette** — fond crème claire, `border: 2px solid #16150f`, titre Gloock caps 26px + label Space Grotesk.
- **Bloc plein vert** — fond `#04492C`, titre Gloock caps crème, chinois 500 + mention en `#D4CDB8`.

## Ton

Français simple, phrases courtes, pas de superlatif. Le chinois double le message clé, jamais tout le texte.
Rétro par les cadres, les filets et les motifs — jamais par du faux manuscrit ni du grain lourd.
