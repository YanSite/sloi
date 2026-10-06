#!/bin/sh
# Полный QA сайта (docs/07_QA пакета) на production-сборке:
# щели у краёв (6 размеров, все экраны, 2 кадра), наложения на нижнюю строку,
# совпадение экрана сайта с корпусом телефона на повороте (3.7 / 4.1 / 5.4 с),
# зазор ≥ 24px между шапкой и телефоном.
# Использование: sh run-qa.sh <url> <папка для снимков> <python с numpy и pillow>
set -e
URL=${1:-http://localhost:3200/preview/est-chto-pokazat}
OUT=${2:-tmp/gc}
PY=${3:-python3}
DIR=$(dirname "$0")
rm -rf "$OUT"
GC_DIR="$OUT" node "$DIR/gapcheck.mjs" "$URL"
GC_DIR="$OUT" "$PY" "$DIR/gapcheck.py"
node "$DIR/overlap.mjs" "$URL"
node "$DIR/sync.mjs" "$URL"
node "$DIR/header-gap.mjs" "$URL"
