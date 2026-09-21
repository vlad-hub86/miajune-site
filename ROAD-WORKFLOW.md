# Working on the site from the road

Short version: **branch, preview locally, open a PR, merge from your phone or laptop.
Never push to `main` from the laptop.**

Why: every push to `main` runs `.github/workflows/deploy.yml`, which FTPs the
whole repo to Porkbun within about a minute. There is no staging site and no
deploy preview. `main` *is* production.

## First time on a new Mac

```bash
curl -fsSL https://raw.githubusercontent.com/vlad-hub86/miajune-site/main/scripts/setup-mac.sh | bash
```

Installs git, Node 22, and the GitHub CLI without Homebrew (Homebrew no longer
supports Intel Macs), signs you in to GitHub, clones the site to `~/code/miajune-site`,
and installs a git hook that blocks accidental pushes to `main`.
Then install VS Code from https://code.visualstudio.com if it isn't already there.

## Every time you sit down

```bash
cd ~/code/miajune-site
git switch main && git pull
git switch -c fix/whatever-you-are-changing
```

Pulling first matters: the news bot commits to `main` on its own, and the PC
may have pushed since the laptop was last open.

## Preview

```bash
bash scripts/preview.sh
```

Opens http://localhost:8000. Reload the browser after saving a file.
Don't open the `.html` files directly from Finder; relative links and the news
pages break under `file://`.

If you touched anything under `news/posts/` or `scripts/build-news.mjs`, rebuild
the generated pages before previewing:

```bash
node scripts/build-news.mjs
```

(Skipping this is fine; the GitHub Action runs it after merge. But then your
preview won't show the change.)

## Ship it

```bash
git add -A
git commit -m "Update Oxford hours"
git push -u origin HEAD
gh pr create --fill --web
```

Review the PR on GitHub (phone works), merge it, and it's live in about a minute.
Check the live page afterwards.

If you have to push straight to `main` on purpose: `ALLOW_MAIN=1 git push`.

## Text-only changes without the laptop

- **News posts:** `/admin/` on the live site (Decap CMS), if the GitHub login
  bridge from ADMIN-GUIDE.md has been set up. Otherwise add a markdown file under
  `news/posts/` with GitHub's web editor; the Action builds the pages.
- **Any file:** GitHub's web editor (press `.` in the repo to get VS Code in the
  browser). Commit to a new branch and open a PR from there.
- **Bigger changes:** a cloud Claude session against the repo works from any
  browser and doesn't need the laptop at all.

## Before a trip

```bash
cd ~/code/miajune-site && git switch main && git pull && mise upgrade
```

The laptop sits closed for weeks at a time. Do this at home on good wifi, not at
the airport.

## Where things live

| What | Where |
|---|---|
| Pages | `*.html` at the repo root, shared `styles.css` (design tokens at the top) |
| News posts | `news/posts/*.md` → built into `news/*.html`, `news.html`, the home page band, `sitemap.xml` |
| Deploy | `.github/workflows/deploy.yml` (FTP to Porkbun on push to `main`) |
| News build | `.github/workflows/build-news.yml` (runs on merge, commits the output) |
| Forms | Formspree via `forms.js` |
| Booking | Square Appointments links in `book.html` |
| Editor roles | `ADMIN-GUIDE.md` |
