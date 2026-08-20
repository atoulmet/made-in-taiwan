#!/bin/bash
# Prépare les copies web des photos.
#
#   content/photos/<Quartier>/*.jpg   ← tes originaux, jamais modifiés
#   public/photos/<quartier>/*.jpg    ← ce que le site sert, généré ici
#
# Chaque copie tient sous 500 Ko. On cherche le premier couple (côté long,
# qualité) qui y arrive, en rognant d'abord la définition plutôt que d'écraser
# la qualité : 1200 px à q=82 est plus propre que 1600 px à q=50, à poids égal.
# Le côté long plafonne à 1600 px, la photo n'étant jamais affichée à plus de
# 522 px CSS (1044 sur un écran retina).
#
# Lancé tout seul avant `npm run dev` et `npm run build`. Les fichiers déjà
# convertis et à jour sont sautés : ajouter une photo ne reconvertit pas tout.
set -e
cd "$(dirname "$0")/.."

SOURCE=content/photos
SORTIE=public/photos
LIMITE=$((500 * 1024))

[ -d "$SOURCE" ] || exit 0

convertis=0
sautes=0

while IFS= read -r src; do
  rel="${src#$SOURCE/}"
  dossier=$(dirname "$rel" | tr '[:upper:]' '[:lower:]')
  base=$(basename "$rel"); base=$(echo "${base%.*}" | tr '[:upper:]' '[:lower:]')
  dest="$SORTIE/$dossier/$base.jpg"

  if [ -f "$dest" ] && [ "$dest" -nt "$src" ]; then
    sautes=$((sautes + 1))
    continue
  fi

  mkdir -p "$(dirname "$dest")"
  fini=0
  for cote in 1600 1400 1200; do
    for q in 88 82 76 70; do
      sips -s format jpeg -s formatOptions "$q" -Z "$cote" "$src" --out "$dest" >/dev/null 2>&1
      if [ "$(stat -f%z "$dest")" -le "$LIMITE" ]; then fini=1; break; fi
    done
    [ "$fini" -eq 1 ] && break
  done

  printf "photo · %s  (%s Ko)\n" "$dest" "$(( $(stat -f%z "$dest") / 1024 ))"
  convertis=$((convertis + 1))
done < <(find "$SOURCE" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \) | sort)

echo "photos : $convertis converties, $sautes déjà à jour"
