# Mia June Facial Bar — Site Admin Guide

The site is plain files in this GitHub repository. "Publishing" means committing a file —
which is what makes the roles below work with no passwords stored on the site and nothing to hack.

## The admin area

**URL:** `/admin/` on the live site (e.g. vlad-hub86.github.io/miajune-site/admin/).
It runs Decap CMS — a visual editor that reads and writes this repo. Writers see a form
(title, date, author, teaser, "feature on home page" toggle, body); saving creates the
markdown file in `news/posts/`, and a GitHub Action instantly rebuilds the News page,
the post page, the home-page featured band, and the sitemap. Nobody edits HTML.

## Accounts & roles

Roles are enforced by GitHub repository permissions — the CMS simply inherits them:

| Role | Person | GitHub permission | What they can do |
|---|---|---|---|
| **Owner** | Magen / Vlad | Repo **Admin** | Everything: publish, approve, manage people, change any page |
| **Business Relations Coordinator** | Allison | Repo **Write** | Publish posts immediately; review & approve Marketing submissions |
| **Marketing** | (any) | **No repo access** | Write posts in /admin; submissions become Pull Requests that wait for Owner/BRC approval |

The approval flow is Decap's *editorial workflow*: a Marketing user's post moves through
**Draft → In review → Ready**, and behind the scenes it's a Pull Request. Allison or the
Owner clicks approve (merge) and it goes live; they can also edit it first or request changes.

## Setup still required (one-time, ~15 minutes)

1. **GitHub accounts** for Magen and Allison (free). Add them at
   Repo → Settings → Collaborators: Magen as Admin, Allison as Write.
   Marketing users need a free GitHub account but are NOT added as collaborators.
2. **OAuth bridge** so /admin can log people in with GitHub:
   - Create a GitHub OAuth App (Settings → Developer settings → OAuth Apps):
     callback URL = the bridge URL below.
   - Deploy the bridge — easiest is the Cloudflare Worker
     [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (works for Decap too),
     or use Netlify's built-in OAuth if hosting moves there.
   - Put the bridge URL in `admin/config.yml` as `base_url`.
3. Until step 2 is done, Allison and the Owner can use **GitHub's own web editor**
   (open `news/posts/`, Add file) — the Action builds everything the same way.

## Writing a post without the CMS

Create `news/posts/my-post-slug.md`:

```
---
title: "My Post Title"
date: 2026-07-15
author: Allison Kravchuk
teaser: "One sentence shown on the News page and, if featured, the home page."
featured: false
---
Post body in plain paragraphs. **Bold**, *italic*, and [links](https://example.com) work.
```

Commit it. Done — the Action does the rest. Set `featured: true` to put it in the
home-page "What's New" band (the newest featured post wins).

## Everything else on the site

Pages (services, team, prices, hours) are the `.html` files at the repo root — edit via
Claude, the GitHub web editor, or any text editor. The design tokens live at the top of
`styles.css`.
