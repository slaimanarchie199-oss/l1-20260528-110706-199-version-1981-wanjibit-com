
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('[data-menu-btn]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  const filters = document.querySelectorAll('[data-filter-input]');
  filters.forEach((input) => {
    const targetSelector = input.getAttribute('data-filter-target');
    const field = input.getAttribute('data-filter-field') || 'search';
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) return;
    const cards = Array.from(target.querySelectorAll('[data-searchable]'));
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const text = (card.getAttribute(`data-${field}`) || card.textContent || '').toLowerCase();
        card.classList.toggle('hide', q && !text.includes(q));
      });
      const count = cards.filter((card) => !card.classList.contains('hide')).length;
      const counter = document.querySelector(input.getAttribute('data-filter-count'));
      if (counter) counter.textContent = count;
    };
    input.addEventListener('input', apply);
    apply();
  });

  document.querySelectorAll('[data-player-source]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const video = document.querySelector('[data-player-video]');
      if (!video) return;
      const src = btn.getAttribute('data-player-source');
      const type = btn.getAttribute('data-player-type') || 'video/mp4';
      video.innerHTML = `<source src="${src}" type="${type}">`;
      video.load();
      video.play().catch(() => {});
      document.querySelectorAll('[data-player-source]').forEach((b) => b.classList.remove('secondary'));
      btn.classList.add('secondary');
    });
  });

  document.querySelectorAll('[data-focus-search]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.getAttribute('data-focus-search'));
      if (input) input.focus();
    });
  });

  const topBtn = document.querySelector('[data-back-top]');
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
