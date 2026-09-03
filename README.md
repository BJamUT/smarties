# Smarty Team Directory

A searchable photo directory of Smarty employees: photo, name, title, bio, and LinkedIn (when available).

Data was scraped from the individual profile pages linked off [smarty.com/company/team](https://www.smarty.com/company/team) on 2026-09-03, covering all 118 employees listed there at that time. Note: the source site's bios are a single combined paragraph per person (no separate "formal" vs. "fun" fields) — this captures the default bio shown on each profile page. A Formal/Fun toggle exists on the source site but its alternate ("fun") photo/bio could not be reliably extracted; only the default (formal) version is included for now.

## Running locally

Because the page loads `data.json` via `fetch()`, opening `index.html` directly (`file://`) won't work — serve it over HTTP:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html` / `style.css` / `app.js` — the static site
- `data.json` — scraped employee data (118 entries: `slug`, `name`, `title`, `photo`, `bio`, `linkedin`, `profileUrl`)
