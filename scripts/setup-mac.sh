#!/usr/bin/env bash
# Mia June site: one-time setup for the travel MacBook (Intel, macOS Sequoia).
#
# No Homebrew on purpose: Homebrew stopped building packages for Intel Macs in
# 2026, so everything here comes as a prebuilt binary (Apple's command line
# tools, plus mise for Node and the GitHub CLI).
#
# Safe to re-run: every step is skipped when it is already done.
#
#   Run it:            bash scripts/setup-mac.sh
#   From a fresh Mac:  curl -fsSL https://raw.githubusercontent.com/vlad-hub86/miajune-site/main/scripts/setup-mac.sh | bash
#   Custom location:   MIAJUNE_DIR=~/Sites/miajune bash scripts/setup-mac.sh
set -euo pipefail

REPO="vlad-hub86/miajune-site"
DEST="${MIAJUNE_DIR:-$HOME/code/miajune-site}"

say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is for macOS. On Windows, use the PC's existing setup."
  exit 1
fi

# 1. Apple command line tools: provides git and python3 (used for local preview)
if ! xcode-select -p >/dev/null 2>&1; then
  say "Installing Apple command line tools"
  echo "Click Install in the dialog that appears. When it finishes, run this script again."
  xcode-select --install || true
  exit 0
fi

# 2. mise: installs prebuilt Node and GitHub CLI, no compiling
export PATH="$HOME/.local/bin:$HOME/.local/share/mise/shims:$PATH"
if ! command -v mise >/dev/null 2>&1; then
  say "Installing mise"
  curl -fsSL https://mise.run | sh
fi

ZSHRC="$HOME/.zshrc"
ACTIVATE_LINE='eval "$(~/.local/bin/mise activate zsh)"'
if ! grep -qsF "$ACTIVATE_LINE" "$ZSHRC"; then
  echo "$ACTIVATE_LINE" >> "$ZSHRC"
fi

# 3. Node 22 (same version the GitHub Action uses) and the GitHub CLI
say "Installing Node 22 and the GitHub CLI"
mise use -g node@22 gh
mise reshim

# 4. Sign in to GitHub (opens the browser); also makes git use that login
if ! gh auth status >/dev/null 2>&1; then
  say "Signing in to GitHub: sign in as vlad-hub86"
  gh auth login --hostname github.com --git-protocol https --web
fi
gh auth setup-git

# 5. Get the site
if [[ -d "$DEST/.git" ]]; then
  say "Site already cloned at $DEST, updating"
  git -C "$DEST" fetch --prune
  git -C "$DEST" pull --ff-only || echo "Could not fast-forward (you have local work). Leaving it alone."
else
  say "Cloning the site to $DEST"
  mkdir -p "$(dirname "$DEST")"
  gh repo clone "$REPO" "$DEST"
fi

# 6. Commit identity for this repo only, if none is set
if [[ -z "$(git -C "$DEST" config user.email || true)" ]]; then
  git -C "$DEST" config user.name "Vlad"
  git -C "$DEST" config user.email "vlad@miajunefacialbar.com"
fi
git -C "$DEST" config pull.ff only

# 7. Safety net: a push to main publishes to the live site within a minute,
#    so block it from this laptop unless it is deliberate.
HOOK="$DEST/.git/hooks/pre-push"
cat > "$HOOK" <<'EOF'
#!/bin/sh
# Installed by scripts/setup-mac.sh
while read -r _local_ref _local_sha remote_ref _remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ] && [ "${ALLOW_MAIN:-}" != "1" ]; then
    echo ""
    echo "Blocked: pushing to main publishes straight to miajunefacialbar.com."
    echo "Push a branch and open a pull request instead (see ROAD-WORKFLOW.md)."
    echo "To override on purpose:  ALLOW_MAIN=1 git push"
    echo ""
    exit 1
  fi
done
exit 0
EOF
chmod +x "$HOOK"

say "Done"
cat <<EOF
Site folder:   $DEST
Preview it:    cd "$DEST" && bash scripts/preview.sh
How to work:   open ROAD-WORKFLOW.md in that folder

Open a NEW Terminal window so node and gh are on your PATH.
EOF
