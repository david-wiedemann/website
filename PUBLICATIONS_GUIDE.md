# Managing publications — one central file

All 16 publication records are now stored ONLY in **`data/publications.js`**.
Edit title, authors, year, journal, external links, topics and BibTeX there. Changes
appear everywhere that publication is selected (English and German).

**Do not copy publication cards into an HTML file.** Add a selection to its list instead.

## Select exactly which publications appear on a page

Example in `research/maxwell.html` or `research/maxwell-de.html`:

```html
<div class="publication-list research-publications"
     data-publication-ids="schweizer-wiedemann-2026-maxwell, delourme-2025-polarization,
                           schweizer-wiedemann-2025-impedance"></div>
```

Each comma-separated `id` refers to an entry in `data/publications.js`.
The order of the IDs determines the order shown. Removing an ID hides only that
publication from that page; the central entry is kept.

Alternatively, automatically show every publication tagged with a topic:

```html
<div class="publication-list research-publications"
     data-publication-ids="topic:maxwell"></div>
```

Available topic tags: `maxwell`, `homogenization`, `evolving`, `variations`, `neural`.
Set the `topics` array on each publication in the central file to control this.

## Automatic selections

- `data-publication-ids="all"` — all publications, newest first.
- `data-publication-ids="latest:5"` — five most recent publications, newest first.
- `data-publication-ids="topic:variations"` — all publications with a given topic tag.
- `data-publication-ids="id-one, id-two"` — exactly these entries, in this order.

The two `publications*.html` pages use `all`, with `data-group-by-year="true"`
so their year headings are created automatically. Topic filter buttons on these
pages still work.

The two homepages use `latest:5`, automatically selecting the five newest.
The six pages inside `research/` have explicit ID lists preserving the former
selections. You can modify the ID list independently per page or use a topic rule.

## Add a new publication

1. Copy one `{ ... }` publication object in `data/publications.js` and edit its
   properties, keeping a **unique, stable `id`**.
2. Use the new ID on any research page where you want it. If the page uses a
   `topic:` selection instead, simply add the relevant topic to the publication.
3. No need to edit the main Publications pages or homepages; those update automatically.
4. Keep both language files in sync if you change a research page's ID list.

All publication information is shared across EN/DE. The interface labels
(for example, "Copy BibTeX" vs "BibTeX kopieren") adjust automatically.

## Works offline

The database is a normal `.js` file rather than `fetch()`-loaded JSON, so
it also works when opening an HTML file directly using `file://`, and
works unchanged with GitHub Pages. **JavaScript must be enabled** in the browser.
The local path differs in `research/` pages: they load `../data/publications.js`.

## Files

- `data/publications.js`: **only source of publication details**.
- `publications-render.js`: common rendering logic; usually do not edit.
- `script.js`: existing BibTeX copy, filter, and background controls, unchanged.
- `index*.html`, `publications*.html`, `research/*.html`: only select which entries to show.
