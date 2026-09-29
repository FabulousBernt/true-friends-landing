#!/bin/sh
# Every path that existed before the split must still resolve, and must point
# at a destination that is itself reachable.
cd "$(dirname "$0")/.." || exit 1
fail=0
check() {
  if [ ! -f "$1" ]; then echo "MISSING  $1"; fail=1; return; fi
  if ! grep -q "$2" "$1"; then echo "WRONG    $1 does not point at $2"; fail=1; return; fi
  if ! grep -q 'rel="canonical"' "$1"; then echo "NOCANON  $1"; fail=1; return; fi
  echo "ok       $1 -> $2"
}
check consulting.html "https://consulting.truefriends.se/"
check studio.html     "https://studio.truefriends.se/"
for c in avarn bufab epiroc kopparbergs-brewery sectra ske-kraft; do
  check "reference-cases/johnny-vigersten/$c.html" \
        "https://consulting.truefriends.se/reference-cases/johnny-vigersten/$c.html"
done
check reference-cases/template.html \
      "https://consulting.truefriends.se/reference-cases/template.html"
exit $fail
