# Research subpages — editing guide (v79)

## File structure

The main research overview pages remain at `research.html` and `research-de.html`.
The three principal research-area pages remain at `research/maxwell.html`,
`research/homogenization.html`, `research/variations.html` (and the corresponding
`-de.html` versions).

The 12 topic pages are under `research/topics/` in both languages:

### Homogenization & multiscale media
- `evolving-microstructure.html`
- `pulsating-microstructure.html`
- `homogenization-interface-conditions.html`
- `effective-fluid-flow.html`
- `effective-diffusion-equations.html`
- `effective-electromagnetic-transmission.html`

### Maxwell equations & wave propagation
- `maxwell-homogenization.html`
- `maxwell-interface-conditions.html`
- `maxwell-boundary-conditions.html`

### Calculus of variations
- `dimension-reduction.html`
- `polyconvexity.html`
- `neural-networks.html`

A matching `-de.html` file exists for every topic. You may edit the explanatory
text or add figures/equations independently in each language.

## Updating the publications displayed on a topic page

Each topic page that has publications includes, for example:

```html
<div class="publication-list research-publications"
     data-publication-ids="schweizer-wiedemann-2026-maxwell, delourme-2025-polarization"></div>
```

Edit the IDs to select **which** publications to display and **in what order**.
Available IDs and all titles, authors, DOI/arXiv links, and BibTeX entries are
stored centrally in `data/publications.js`. You do **not** need to duplicate
bibliographic information in any topic page.

If you want the same selection in both languages, modify both the English
and the German topic page's `data-publication-ids` attribute.

**Dimension reduction** currently has no publication explicitly associated
with it in the existing database. Its page contains a brief placeholder text;
when you want to add publications, replace that placeholder with a `<div>` as
shown above and insert the relevant publication IDs.

## Editing the sidebar links

The 'Methods & themes' index is repeated as static markup in the main research
area pages and topic pages. To add, rename or remove topics in the future,
update the corresponding sidebar links wherever displayed. The publication
bibliography itself remains centralized in `data/publications.js`.

For a complete page to work in the `research/topics/` folder, link the stylesheet
as `../../style.css`, the publication database as
`../../data/publications.js`, the renderer as `../../publications-render.js`,
and the main script as `../../script.js`.

## Collapsed research area navigation (v80)

In the *Methods & themes* sidebar, only the current research area displays
its subtopic links. The other two research areas appear only as clickable
headings. Clicking another area opens its overview page, where that area's
subtopics are expanded. Topic pages keep the same parent area expanded.

This is implemented in static HTML, so it also works when pages are opened
locally without a web server or JavaScript. When adding a topic, add its link
to the expanded sidebar group on every page belonging to that research area.

## Subtopic-only sidebars (v81)

On every research area page and individual subtopic page, the *Methods & themes*
sidebar now shows **only the subtopics of the active research area**. It no
longer shows any of the three overarching research-area names. You can return
to an overview via the breadcrumbs or the topic page's back link.

To add or remove a subtopic, update the `<ul class="research-topic-links">`
on the corresponding research-area and subtopic pages (in both languages).
