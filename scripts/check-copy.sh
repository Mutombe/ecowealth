#!/usr/bin/env sh
# Copy lint: fails if any dash character, hollow superlative or
# "not just / not about" construction appears in the site source.
# Run from the repo root:  sh scripts/check-copy.sh
FILES="index.html js/*.js css/styles.css README.md"
fail=0
count() { n=$(grep -oiE "$1" $FILES | wc -l | tr -d ' '); printf '%-22s %s\n' "$2" "$n"; [ "$n" = 0 ] || { grep -noiE "$1" $FILES | head -5; fail=1; }; }
count "$(printf '\342\200\224')" "em dash"
count "$(printf '\342\200\223')" "en dash"
count "$(printf '\342\200\222|\342\200\225')" "figure/bar dash"
count "\b(seamless|robust|leverag|elevat|unlock|bespoke|cutting[ -]edge|comprehensive|tailor|holistic)" "hollow superlatives"
count "not just|not about|isn.t about|it.s about|not only" "not-just constructions"
exit $fail
