# Sukoon Technology Solutions — Website

Marketing website for **Sukoon Technology Solutions**, an AI &amp; ML consultancy
(sole proprietorship). Built as a fast, responsive static site and deployed to
**GitHub Pages**.

## Live site

Once Pages is enabled (see below), the site is served at:

```
https://im-jt.github.io/sukoon-tech-solutions/
```

## What's inside

```
index.html              Single-page site (hero, services, about, blog, contact)
assets/css/style.css    Styles + responsive layout (brand blue/teal theme)
assets/js/main.js       Mobile nav, scroll reveal, contact mailto, blog loader
assets/img/logo.svg     Scalable recreation of the Sukoon logo mark
.github/workflows/      GitHub Pages deployment (GitHub Actions)
```

## Features

- **Responsive design** matching the brand (blue → teal gradient, logo mark in SVG).
- **Services** focused on AI/ML: machine learning, generative AI/LLMs, data
  engineering, AI consulting, computer vision &amp; NLP, MLOps &amp; cloud.
- **Blog section** that auto-loads the latest posts from Substack, with a
  preview (image, date, excerpt) and a link to read the full post.
- **Contact**: phone/WhatsApp, email, GSTIN, plus a form that opens the
  visitor's email client pre-filled.

## Configuration

### Substack blog
The blog pulls posts from the RSS feed configured at the top of
`assets/js/main.js`:

```js
const SUBSTACK_PROFILE = "https://substack.com/@imjatintyagi";
const SUBSTACK_FEED    = "https://imjatintyagi.substack.com/feed";
```

A Substack publication's feed is usually `<publication>.substack.com/feed`.
If your posts live on a custom domain or a different subdomain, update
`SUBSTACK_FEED` to point at `https://<your-domain>/feed`. If the live feed
can't be reached, the section shows a graceful link to your Substack.

### Contact details
Phone, email and GSTIN live in `index.html` (Contact section + footer).

## Deployment (GitHub Pages)

This repo deploys via **GitHub Actions** on every push to `main`.

One-time setup in the repository:
1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

After that, pushing to `main` builds and publishes automatically. You can also
trigger it manually from the **Actions** tab (workflow: *Deploy to GitHub Pages*).

## Local preview

It's a static site — open `index.html` directly, or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

© Sukoon Technology Solutions · GSTIN 07ANQPT5915Q1ZW
