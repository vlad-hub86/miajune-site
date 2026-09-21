#!/usr/bin/env bash
# Preview the site locally at http://localhost:8000
#
# The site is plain HTML, but opening files directly (file://) breaks the
# relative links and the news pages, so serve it over HTTP instead.
# Uses python3, which ships with Apple's command line tools. No install needed.
#
#   bash scripts/preview.sh          # serves on port 8000
#   bash scripts/preview.sh 3000     # pick another port
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-8000}"
echo "Serving $(pwd) at http://localhost:$PORT  (Ctrl+C to stop)"
( sleep 1; open "http://localhost:$PORT" 2>/dev/null || true ) &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
