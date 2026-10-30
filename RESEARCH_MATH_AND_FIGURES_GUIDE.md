# Equations and figures on research pages (v84)

All 30 research topic and subtopic pages (and both `research.html` overview pages) already load local MathJax. **You can add LaTeX and graphics without changing the `<head>` or installing anything.**

## Working example

Open `research/topics/evolving-microstructure.html` or its German counterpart `evolving-microstructure-de.html`. The **Illustrative model / Illustratives Modell** section shows a LaTeX equation and an SVG illustration. The source code is marked `EXAMPLE` / `BEISPIEL` and may be copied or adapted for any research page.

## How to write equations

Inside any research page's `<div class="research-main">` you may write inline math directly in text:

```html
<p>We work on the unit cell \(Y=(0,1)^d\).</p>
```

For a displayed equation, write:

```html
<div class="research-equation">
\[
  -\nabla\cdot(A\nabla u)=f \quad\text{in }\Omega.
\]
</div>
```

MathJax supports many standard LaTeX math commands including `\frac`, `\partial`, `\nabla`, `\int`, `\begin{aligned}` and `\mathbf`. It renders in the browser as accessible scalable SVGs, **without contacting a third-party CDN and without shipping separate font files**.

## How to add images

Place your own image under `assets/images/research/` (SVG, PNG, JPEG, etc.), e.g. `my-figure.svg`. Then paste one of the following examples within `<div class="research-main">`:

### Main topic page `research/maxwell.html` (or any sibling)

```html
<figure class="research-figure">
  <img src="../assets/images/research/my-figure.svg"
       alt="Descriptive alternative text" loading="lazy"/>
  <figcaption>Caption for the illustration.</figcaption>
</figure>
```

### Subtopic page `research/topics/maxwell-homogenization.html` (or any sibling)

```html
<figure class="research-figure">
  <img src="../../assets/images/research/my-figure.svg"
       alt="Descriptive alternative text" loading="lazy"/>
  <figcaption>Caption for the illustration.</figcaption>
</figure>
```

### Research overview `research.html`

Use `assets/images/research/my-figure.svg` (no `../`).

The CSS classes `research-equation`, `research-figure`, and `research-subheading` are defined at the bottom of `style.css` for consistent layout on all pages. The `<figure>` adapts to smaller screens; long equations scroll horizontally inside the equation box.

## Project files

- `assets/js/mathjax-config.js` — MathJax configuration
- `assets/vendor/mathjax/tex-svg-full.js` — local MathJax 3.2.1 distribution (Apache 2.0)
- `assets/vendor/mathjax/LICENSE` — upstream license
- `assets/images/research/evolving-microstructure-example.svg` — editable example diagram

The site's current publication database and publication lists remain unchanged.
