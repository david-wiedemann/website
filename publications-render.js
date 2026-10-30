/* Render publication cards from data/publications.js. No fetch() or server needed. */
(function () {
  'use strict';

  const publications = window.PUBLICATIONS;
  const targets = document.querySelectorAll('[data-publication-ids]');
  if (!targets.length) return;

  if (!Array.isArray(publications)) {
    console.error('Publication database missing. Load data/publications.js first.');
    targets.forEach(el => { el.textContent = 'Publication data could not be loaded.'; });
    return;
  }

  const byId = new Map();
  publications.forEach(function (entry) {
    if (byId.has(entry.id)) console.warn('Duplicate publication ID: ' + entry.id);
    byId.set(entry.id, entry);
  });

  const isGerman = document.documentElement.lang.toLowerCase().startsWith('de');

  function selectPublications(spec) {
    const value = spec.trim();
    if (value === 'all') {
      return publications.slice().sort((a, b) => b.year - a.year);
    }
    if (/^latest:\d+$/.test(value)) {
      const count = Number(value.slice(7));
      return publications.slice().sort((a, b) => b.year - a.year).slice(0, count);
    }
    if (value.startsWith('topic:')) {
      const topic = value.slice(6).trim();
      return publications.filter(p => p.topics.includes(topic)).sort((a, b) => b.year - a.year);
    }

    // Comma- or whitespace-separated stable IDs, in the order written in the HTML.
    const ids = value.split(/[\s,]+/).filter(Boolean);
    return ids.map(function (id) {
      const entry = byId.get(id);
      if (!entry) console.warn('Unknown publication ID: ' + id);
      return entry;
    }).filter(Boolean);
  }

  function make(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function renderCard(pub) {
    const article = make('article', 'publication publication-full');
    article.dataset.topics = (pub.topics || []).join(' ');
    article.dataset.publicationId = pub.id;
    article.appendChild(make('div', 'pub-year', String(pub.year)));
    const content = make('div', 'pub-content');
    content.appendChild(make('h3', '', pub.title));
    content.appendChild(make('p', '', pub.authors));

    // Journal and compact links share a row; BibTeX content remains below it.
    const metadata = make('div', 'pub-meta-row');
    metadata.appendChild(make('p', 'journal', pub.journal));
    const actions = make('div', 'pub-actions');
    const buttons = make('div', 'pub-buttons');
    (pub.links || []).forEach(function (link) {
      const a = make('a', 'pub-action', link.label);
      // Links are curated in our own local publication database.
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      buttons.appendChild(a);
    });
    const bibToggle = make('button', 'bibtex-toggle', 'BibTeX');
    bibToggle.type = 'button';
    bibToggle.setAttribute('aria-expanded', 'false');
    buttons.appendChild(bibToggle);
    const copy = make('button', 'copy-bibtex', isGerman ? 'BibTeX kopieren' : 'Copy BibTeX');
    copy.type = 'button';
    copy.hidden = true;
    buttons.appendChild(copy);
    actions.appendChild(buttons);

    const panel = make('div', 'bibtex-panel');
    panel.hidden = true;
    const textarea = make('textarea', 'bibtex-box');
    textarea.setAttribute('aria-label', 'BibTeX for ' + pub.title);
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.value = pub.bibtex || '';
    textarea.addEventListener('click', function () { textarea.select(); });
    panel.appendChild(textarea);
    metadata.appendChild(actions);
    content.appendChild(metadata);
    // Keep the expanded field below the full publication text, not in the inline metadata row.
    content.appendChild(panel);
    article.appendChild(content);
    return article;
  }

  targets.forEach(function (target) {
    const items = selectPublications(target.dataset.publicationIds || 'all');
    target.replaceChildren();

    if (target.dataset.groupByYear === 'true') {
      let currentYear = null;
      let list = null;
      items.forEach(function (pub) {
        if (pub.year !== currentYear) {
          currentYear = pub.year;
          const section = make('section', 'publication-year-block');
          section.id = 'year-' + currentYear;
          section.appendChild(make('h2', 'publication-year-heading', String(currentYear)));
          list = make('div', 'publication-list');
          section.appendChild(list);
          target.appendChild(section);
        }
        list.appendChild(renderCard(pub));
      });
    } else {
      items.forEach(pub => target.appendChild(renderCard(pub)));
    }

    if (!items.length) console.warn('No publications selected for this element:', target);
  });
})();
