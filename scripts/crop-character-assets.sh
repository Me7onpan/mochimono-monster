#!/bin/zsh
set -euo pipefail

ROOT="${0:A:h:h}"
SUBJECT_SOURCE="$ROOT/public/art/subject-monsters-v2.png"
ITEM_SOURCE="$ROOT/public/art/item-animals-v3.png"
TOWEL_OVERRIDE="$ROOT/public/art/item-overrides/towel-panda.png"
SUBJECT_DIR="$ROOT/public/art/subjects"
ITEM_DIR="$ROOT/public/art/items"

mkdir -p "$SUBJECT_DIR" "$ITEM_DIR"

subject_ids=(japanese math moral music library life english pe art pool)
for i in {1..10}; do
  index=$((i - 1))
  column=$((index % 5))
  row=$((index / 5))
  x=$((8 + column * 303))
  y=$((7 + row * 496))
  sips -c 484 296 --cropOffset "$y" "$x" "$SUBJECT_SOURCE" --out "$SUBJECT_DIR/${subject_ids[$i]}.png" >/dev/null
done

# pianica stays in this list so the v3 sheet cells do not shift.
# The app no longer shows that card; the instrument stays at school.
item_ids=(
  japanese-notebook japanese-textbook reading math-notebook math-textbook
  pencilcase bottle smock pianica swimsuit
  towel swimcap poolcard returnbook contact
  freebook deskpad contactbag handkerchief tissue
  cap homework
)

for i in {1..22}; do
  index=$((i - 1))
  column=$((index % 5))
  row=$((index / 5))
  x=$((19 + column * 234))
  y=$((10 + row * 239))
  sips -c 232 230 --cropOffset "$y" "$x" "$ITEM_SOURCE" --out "$ITEM_DIR/${item_ids[$i]}.png" >/dev/null
done

# The source sheet uses an otter for the towel card. Keep the distinct panda
# illustration whenever the sheet is cropped again.
cp "$TOWEL_OVERRIDE" "$ITEM_DIR/towel.png"

echo "Cropped ${#subject_ids[@]} subject monsters and ${#item_ids[@]} item animals."
