document.addEventListener("click", async function (event) {
  const toggle = event.target.closest(".bibtex-toggle");

  if (toggle) {
    const publication = toggle.closest(".publication");
    if (!publication) return;

    const panel = publication.querySelector(".bibtex-panel");
    const copyButton = publication.querySelector(".copy-bibtex");
    if (!panel) return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const willOpen = !isOpen;

    toggle.setAttribute("aria-expanded", String(willOpen));
    panel.hidden = !willOpen;

    if (copyButton) {
      copyButton.hidden = !willOpen;
      if (!willOpen) {
        copyButton.textContent = document.documentElement.lang === "de" ? "BibTeX kopieren" : "Copy BibTeX";
      }
    }
    return;
  }

  const copyButton = event.target.closest(".copy-bibtex");
  if (!copyButton) return;

  const publication = copyButton.closest(".publication");
  if (!publication) return;

  const textarea = publication.querySelector(".bibtex-box");
  if (!textarea) return;

  const bibtex = textarea.value;

  try {
    await navigator.clipboard.writeText(bibtex);
  } catch (err) {
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
  }

  const oldText = copyButton.textContent;
  copyButton.textContent = document.documentElement.lang === "de" ? "Kopiert!" : "Copied!";

  window.setTimeout(function () {
    if (!copyButton.hidden) {
      copyButton.textContent = oldText;
    }
  }, 1400);
});


// Publication topic filters
document.addEventListener("click", function (event) {
  const filterButton = event.target.closest(".publication-filter");
  if (!filterButton) return;

  const filterWrap = filterButton.closest(".publication-filter-wrap");
  if (!filterWrap) return;

  const selected = filterButton.dataset.filter || "all";

  filterWrap.querySelectorAll(".publication-filter").forEach(function (button) {
    const active = button === filterButton;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".publication-year-block").forEach(function (yearBlock) {
    let visibleInYear = 0;

    yearBlock.querySelectorAll(".publication[data-topics]").forEach(function (publication) {
      const topics = (publication.dataset.topics || "").split(/\s+/).filter(Boolean);
      const show = selected === "all" || topics.includes(selected);
      publication.hidden = !show;

      if (show) {
        visibleInYear += 1;
      } else {
        const toggle = publication.querySelector(".bibtex-toggle");
        const panel = publication.querySelector(".bibtex-panel");
        const copyButton = publication.querySelector(".copy-bibtex");

        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (panel) panel.hidden = true;
        if (copyButton) {
          copyButton.hidden = true;
          copyButton.textContent = document.documentElement.lang === "de" ? "BibTeX kopieren" : "Copy BibTeX";
        }
      }
    });

    yearBlock.hidden = visibleInYear === 0;
  });
});


// v46: themed background image on the Publications page
(function () {
  const page = document.body;
  if (!page.classList.contains("publications-background-page")) return;

  const filterButtons = document.querySelectorAll(".publication-filter[data-filter]");

  function setPublicationBackground(filter) {
    const allowed = ["all", "maxwell", "homogenization", "evolving", "variations", "neural"];
    page.dataset.publicationTheme = allowed.includes(filter) ? filter : "all";
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setPublicationBackground(button.dataset.filter || "all");
    });
  });

  const activeButton =
    document.querySelector('.publication-filter[aria-pressed="true"]') ||
    document.querySelector('.publication-filter[data-filter="all"]');

  setPublicationBackground(activeButton ? activeButton.dataset.filter : "all");
})();


// v78: keep the current homepage section when changing language.
// The two homepages share the same section IDs, including #contact.
(function () {
  const links = document.querySelectorAll('.lang-switch a[data-preserve-home-section="true"]');
  if (!links.length) return;

  const sections = new Set(['top', 'research', 'publications', 'teaching', 'contact']);
  const destinations = Array.from(links, function (link) {
    return { link: link, page: link.getAttribute('href').split('#')[0] };
  });

  function activeSectionHash() {
    const currentHash = window.location.hash;
    const sectionId = currentHash.slice(1);
    if (sections.has(sectionId) && document.getElementById(sectionId)) {
      return currentHash;
    }

    // Also handle users who scrolled to Contact without clicking its menu link.
    // Only infer Contact when there is no explicit fragment in the URL.
    if (!currentHash) {
      const contact = document.getElementById('contact');
      if (contact) {
        const rect = contact.getBoundingClientRect();
        const viewportPoint = window.innerHeight * 0.55;
        if (rect.top <= viewportPoint && rect.bottom >= viewportPoint) {
          return '#contact';
        }
      }
    }
    return '';
  }

  function updateLanguageLinks() {
    const suffix = activeSectionHash();
    destinations.forEach(function (item) {
      item.link.setAttribute('href', item.page + suffix);
    });
  }

  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  window.addEventListener('scroll', updateLanguageLinks, { passive: true });
  links.forEach(function (link) {
    link.addEventListener('focus', updateLanguageLinks);
    link.addEventListener('pointerenter', updateLanguageLinks);
    link.addEventListener('click', updateLanguageLinks);
  });
})();
