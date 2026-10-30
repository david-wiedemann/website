# David Wiedemann — personal academic website

Upload these files to the root of the GitHub Pages repository:

- `index.html`
- `style.css`
- `publications.html`
- `maxwell.html`
- `homogenization.html`
- `variations.html`

Optional:
- `cv.pdf` — your CV; the existing CV buttons point to this filename.

## What changed in v3

- Dedicated publications page with all 16 bibliography entries included in the current site data.
- Every publication has a DOI/arXiv/thesis link.
- Every publication has a collapsible `BibTeX` control.
- Opening `BibTeX` reveals a selectable read-only text field.
- Research pages show all publications assigned to that research area, with the same BibTeX control.
- Homepage shows the five most recent entries and links to the full list.


## Images used in v4

Add these optional image files to the same repository folder:

- `profile.jpg` — your profile picture
- `background.jpg` — the homepage background image

The homepage now expects these filenames.
The white overlay on the background image was reduced so the background is more visible.

## v5 layout fix

- DOI and BibTeX controls are vertically aligned.
- Opening a BibTeX entry no longer moves the BibTeX button downward.
- The BibTeX text field expands on a separate row beneath both controls.

## v11 BibTeX layout fix

The previous CSS-only `<details>` implementation was replaced by a small JavaScript toggle.
This makes the layout deterministic:
- DOI/arXiv and BibTeX stay on one row.
- The BibTeX field always opens on a new full-width row underneath.
- The field can no longer move to the right of the buttons.

## v17 Copy BibTeX

When a BibTeX entry is opened, a `Copy BibTeX` button appears next to the `BibTeX` button.
Clicking it copies the complete BibTeX entry to the clipboard and briefly changes the label to `Copied!`.

## v19 academic profile links

- ORCID is now displayed with the official ORCID icon and the visible ID `0000-0002-3839-6245`.
- ResearchGate is linked as `https://www.researchgate.net/profile/David-Wiedemann` and shown with its icon.
- Both external profile links open in a new tab.

## v20 Google Scholar and email

- Added a Google Scholar link using an author search because no verified public Scholar profile ID was available in the retrieved sources.
- Added the visible email address `wiedemann@math.univ-paris13.fr` as a clickable `mailto:` link.

## v28 publication filters

The Publications page now includes four client-side filters:
- All publications
- Maxwell & wave propagation
- Homogenization & multiscale media
- Calculus of variations

Years with no matching publications are hidden automatically.

## v29 overlapping publication filters

Added the filter `Evolving microstructure`.

Publications can now belong to multiple research filters simultaneously.
In particular, papers on evolving geometries are tagged both
`Homogenization & multiscale media` and `Evolving microstructure`.

## v30 neural-network publication filter

Added `Neural networks` as an additional filter.
Relevant papers remain simultaneously assigned to `Calculus of variations`.

## v32 CV icon

The `Curriculum Vitae` link in the contact/profile list now uses the same
visual pattern as ORCID, ResearchGate, and Google Scholar, with a custom
light-blue circular `CV` icon.

## v33 TU Dortmund and arXiv

- Added a compact TU Dortmund badge in TU green (`#639A00`) next to the university profile link.
- Added arXiv author page: https://arxiv.org/a/wiedemann_d_1.html


## v36 real TU Dortmund / arXiv logos

The TU Dortmund and arXiv links now expect real image files instead of synthetic text badges.

Put these files into the repository root:
- `tu-dortmund-logo.png`
- `arxiv-logo.png`

They may be square image files. The website will automatically crop the center
and display them as round icons via CSS.

## v38 email and stronger background

- Email updated everywhere to `wiedemann@math.univ-paris13.fr`.
- Background image made substantially more visible across hero, sections, alternate sections, header, footer, cards, and research/publication subpages.

## v44 Teaching page

Added `teaching.html` as a dedicated teaching page.
The main navigation now links directly to it, and the homepage Teaching section includes a button to the full page.

## v46 topic-specific publication backgrounds

The Publications page now switches its fixed background image with the active publication filter.
Expected optional files are listed in `PUBLICATION_BACKGROUNDS.txt`. `background.jpg` remains the fallback.

## v51 Research dropdown + legal pages

- Added a hover/focus dropdown under `Research` in the main navigation.
- Added `imprint.html` and `privacy.html`.
- Added Imprint/Privacy links to all footers.
- IMPORTANT: replace `[POSTANSCHRIFT VOR VERÖFFENTLICHUNG EINTRAGEN]` on both legal pages before publishing.

## v52 bilingual website

The website now has complete English and German page sets.
English remains the default (`index.html`). German pages use the `-de.html` suffix.
Every page contains an EN/DE switch in the header, and language-specific internal links remain within the selected language.

German pages:
- index-de.html
- publications-de.html
- teaching-de.html
- maxwell-de.html
- homogenization-de.html
- variations-de.html
- imprint-de.html
- privacy-de.html

Publication titles and journal names remain in their original language.

## v53 CV web pages

Added:
- `cv.html` (English)
- `cv-de.html` (German)

The header and homepage CV links now open the web CV page.
Each web CV page contains a direct button to the original `cv.pdf`.

## v54 asset folders + uploaded CV

New structure:

- `assets/images/`
  - `profile.jpg` (included; extracted from the supplied CV)
  - `background.jpg` (add your existing background image here)
  - optional publication-topic backgrounds
- `assets/logos/`
  - `tu-dortmund-logo.png` (included; extracted from the supplied CV)
  - `arxiv-logo.png` (place your downloaded file here)
- `documents/`
  - `cv.pdf` (the supplied four-page CV)

All relevant HTML and CSS paths were updated.

The web CV pages were rebuilt from the supplied PDF and now include:
education/work experience, voluntary work, research stays, funding acquisition,
awards, academic service, outreach, invited talks, and conference/workshop talks.

For privacy, the public HTML CV does not reproduce date of birth, home address,
private phone number, or private email from the PDF.

## v55 CV timeline logos

The web CV now shows institution/funding logos beneath the corresponding years,
following the visual structure of the supplied PDF CV. Relevant logos were extracted
or cropped directly from that PDF and stored locally in `assets/logos/`.

## v56 CV link fix

All regular CV links across the website now open the HTML CV page:
- English: `cv.html`
- German: `cv-de.html`

Only the explicit PDF buttons on the CV pages open `documents/cv.pdf`.

## v57 supplied original logos

Replaced the previously extracted/cropped CV logos with the logo files supplied directly
by the user. All website copies live in `assets/logos/`.

The SGL Carbon logo was rendered from the supplied PDF into a local PNG.

## v58

Increased the displayed size of the TopMath logo on the CV pages (timeline and awards).

## v59

TopMath timeline/award logos and the Cambridge timeline logo now use max-width 300px and max-height 100px.

## v60 Awards layout

In the Awards section, the left column now contains only the logo.
The year/date has been moved into the award description on the right.

## v61

Preserved the manually selected Cambridge logo size: 100 × 40 px maximum.

## v62 clickable CV links

- Linked Prof. Dr. Ben Schweizer to his official TU Dortmund profile.
- Linked Prof. Dr. Malte A. Peter to his official University of Augsburg profile.
- Made all institution/funding logos on `cv.html` and `cv-de.html` clickable.
- Logo links open the corresponding official institution or organization website in a new tab.

## v63 links + stable page scaling

Added CV links:
- SAMM 2026: https://www.gamm-juniors.de/samm-2026/
- Winter School "Multiple Scales in Mathematics and Engineering": https://www.uni-augsburg.de/de/fakultaet/mntf/math/prof/numa/veranstaltungen/winter-school-multiple-scales-mathematics-and-engineering/
- FSMP postdoctoral programme: https://www.sciencesmaths-paris.fr/nos-programmes/postdocs

Also standardized viewport metadata and added stable scrollbar/text-sizing rules
to prevent visual size/width changes when navigating between pages.

## v64 Research overview + Teaching breadcrumb

Added:
- `research.html`
- `research-de.html`

The Research navigation item and homepage Research button now open the dedicated
research overview page. Research subpages link back to that overview in their breadcrumbs.

Teaching now uses the same breadcrumb pattern as Publications:
- Home › Teaching
- Startseite › Lehre

## v65 cleaner subpage headers

Removed the small eyebrow label above the main title on all subpages.
Breadcrumbs and main H1 titles remain unchanged.

## v66 homepage email

The email address in the top-right homepage profile card is kept on one line.
A slightly smaller font is used there to avoid wrapping.

## v67 teaching overview

Reworked the Teaching page from a teaching-statement style into a factual overview
of previous university teaching, organized by institution and course/activity.

## v68 detailed teaching history

The Teaching pages now use the supplied teaching list and show each individual
course chronologically with semester, course title, level, and contribution.
Own lectures are separated from teaching-assistant/tutor activities.

## v69 imprint address

Replaced the postal-address placeholder in the English and German imprint with:

TU Dortmund University / TU Dortmund
Faculty of Mathematics / Fakultät für Mathematik
Vogelpothsweg 87
44227 Dortmund
Germany / Deutschland

## v70 compact privacy notice

Replaced the numbered large section headings on the privacy pages with a compact
paragraph-based notice. Added the TU Dortmund Mathematics postal address and clarified
GitHub Pages hosting, external image requests, cookies/tracking, email contact and data
subject rights.

## v72 publication lead and German CV navigation

- Removed the explanatory lead paragraph below the Publications title in EN and DE.
- Corrected cv-de.html to use the German navigation, German research submenu,
  German contact link, DE as the active language, and German legal footer links.
- Contact remains a section of the respective homepage (index.html / index-de.html),
  not a separate page.

## v73 separate TU Dortmund profile logo

Homepage and contact-section TU Dortmund icons now use:
`assets/logos/tu-dortmund-profile.png`

The CV continues to use:
`assets/logos/tu-dortmund-logo.png`

## v74 darker text

Darkened text throughout the website for improved contrast and readability.
The blue accent colors remain unchanged.

## v75 — Research topic pages moved into a subfolder

The research topic pages now live in `research/`:

- `research/maxwell.html`, `research/maxwell-de.html`
- `research/homogenization.html`, `research/homogenization-de.html`
- `research/variations.html`, `research/variations-de.html`

`research.html` and `research-de.html` remain at the website root as research overview pages.
All internal links, language switches, stylesheet/script references and breadcrumbs have been
adjusted for the new layout. The six former root-level topic pages are small redirect
stubs to keep previously shared URLs and bookmarks working.

## v76 — Centralized publications

All publication details are stored in `data/publications.js`, rendered by `publications-render.js` into the homepages, full publication pages, and three research topic pages in EN/DE. See `PUBLICATIONS_GUIDE.md`.


## v77: compact publication entries

The journal citation, DOI/arXiv link(s), and BibTeX toggle appear in a shared row
(and wrap naturally on narrow screens). The expanded BibTeX textarea remains below
all publication text at full width. Publication entry spacing is reduced site-wide.
The centralized `data/publications.js` database and the existing filters are unchanged.


## v78 — language switching from the homepage Contact section

EN/DE language-switch links on `index.html` and `index-de.html` retain matching homepage
section anchors (`#contact`, `#research`, `#publications`, `#teaching`, `#top`).
Switching from Contact now opens the translated homepage at Contact, rather than at the top.
This also handles manually scrolling into Contact without a URL fragment.
Other pages' existing EN/DE counterparts remain unchanged.


## v79 — Research topic subpages

- Removed the former **Topics / Themen** list from the three main research-area pages.
- Replaced the **Methods & themes / Methoden & Themen** sidebar with a three-group topic directory of 12 clickable subpages, in both languages.
- Added `research/topics/` with 24 standalone HTML pages (English / German).
- Each page uses the existing publication database (`data/publications.js`) and renders selected publications by stable IDs. The BibTeX/DOI UI is preserved.
- **Dimension reduction** has an explicit publications placeholder because no publication in the current database is clearly attributed to that topic.

To change which publications appear on an individual topic page, edit its `data-publication-ids` attribute in the corresponding HTML file. Publication bibliographic details are always edited centrally in `data/publications.js`.

## v80: active research subtopics only
The Research sidebar now displays subtopics solely for the currently opened
research area, on both area overviews and topic pages (EN/DE). Other area
headings remain linked to their overview pages.

## v81 subtopic-only research sidebars

Removed all research-area headings from the *Methods & themes* sidebar on
all 30 EN/DE research area and topic pages. Only the active area's subtopics
remain. Publication assignments and all other navigation remain unchanged.


## v82 research sidebar back links

Each main research topic sidebar now starts with a link back to the full Research overview.
Every subtopic sidebar starts with a link back to its parent research area, in English and German.


## v83: Research sidebar hierarchy

Main research pages and all research subtopic pages now show the name of the
current main research field above a clearly labeled **Subtopics / Unterthemen**
list. The subtopic pages link the field name back to the parent page and retain
a separate back-to-parent button. The main pages retain the link to the full
research overview. Same arrangement on the English and German pages.


## v84 LaTeX and research figures

Local MathJax (SVG renderer) is enabled for all topic/subtopic pages and both research overview pages. New reusable figure/equation CSS. Example equation and diagram on `research/topics/evolving-microstructure.html` and `-de.html`. See `RESEARCH_MATH_AND_FIGURES_GUIDE.md`.

## v85 Homogenization example

The homogenization main topic (EN/DE) now has the supplied periodic microstructure SVG, a fundamental explanation and the displayed microscopic, cell, and effective equations.

## v86 — microscopic and effective homogenization model columns

The Homogenization overview now has two side-by-side columns, each containing
its own cropped view of the existing user-supplied illustration and its matching
mathematical model. The original SVG is retained unchanged.

- `assets/images/research/homogenization-microscopic.svg`
- `assets/images/research/homogenization-effective.svg`

On narrow screens the columns stack to avoid squeezed equations.


## v90 – Interactive evolving microstructures

On `research/topics/evolving-microstructure.html` and `research/topics/evolving-microstructure-de.html` the overview now contains a synchronized Canvas animation. The three microscopic drawings are based on periodicity ε = 1/4, 1/8, and 1/16 on Ω ⊂ (0,2) × (0,1). A common slow growth front moves from left to right. The obstacle area fraction and its contour are parametrized together. At t=0 all obstacles are small and potato-like; at t=T they are larger, smooth ellipses. A macro-domain with indicative porosity shading and clickable reference cell are shown alongside. Play/pause, reset, speed, and scrub controls work locally and on GitHub Pages. The shared implementation is in `assets/js/evolving-microstructure.js` and the styling in `style.css`. This is a geometrical illustration, not a PDE solver.


## v92 layout

The Methods & themes sidebar on the three main research field pages (EN/DE) is now in the page header, alongside the research title and introductory paragraph. Overview and Publications are full-width. Responsive layouts stack the sidebar on narrow screens. Retains the user's custom evolving-wave values (advancingFront = 2.48*t and transition width 0.62).


## v93: Research subtopic layouts

Every research subtopic page now places its topic-navigation panel alongside the
page title in the hero, aligned with the breadcrumb. Main-topic pages use the
same higher alignment. The old “Methods & themes” / “Methoden & Themen”
panel heading is omitted while the navigation links and accessible aria-labels
remain. Overview, equations, illustrations, and publication lists span the full
width below. On narrow screens the navigation panel follows the hero intro.
The v92 evolving-microstructure animation is unchanged.


### v98 — Pulsating-microstructure comparison cells
The English and German `research/topics/pulsating-microstructure*.html` pages now have a magnified reference-cell canvas below each of the three epsilon-scaled microscopic panels. The corresponding JavaScript `assets/js/pulsating-microstructure.js` uses the same travelling-bend geometry and phases `t/epsilon` as each panel, and updates the three miniatures, their phase readouts and their dashed zoom connectors when the user clicks another location or changes time/options. CSS styling is in `style.css`.
