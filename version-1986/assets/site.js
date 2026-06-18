(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  if (q) {
    const searchInput = document.querySelector('[data-search-input]');
    if (searchInput) searchInput.value = q;
  }

  const toTop = document.querySelector('[data-back-top]');
  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
