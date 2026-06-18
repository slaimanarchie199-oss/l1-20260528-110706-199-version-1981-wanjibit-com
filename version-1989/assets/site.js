(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function textOf(card) {
    var title = card.getAttribute('data-title') || '';
    var keywords = card.getAttribute('data-keywords') || '';
    return (title + ' ' + keywords + ' ' + card.textContent).toLowerCase();
  }

  function applyFilter(input) {
    var selector = input.getAttribute('data-movie-search');
    if (!selector) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll(selector));
    var value = input.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var matched = !value || textOf(card).indexOf(value) !== -1;
      card.classList.toggle('is-hidden', !matched);
      if (matched) {
        visible += 1;
      }
    });
    document.querySelectorAll('[data-empty-state]').forEach(function (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    });
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav-links');
    var headerSearch = document.querySelector('.header-search');

    if (menuButton && nav && headerSearch) {
      menuButton.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        headerSearch.classList.toggle('open', isOpen);
        menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuButton.textContent = isOpen ? '×' : '☰';
      });
    }

    document.querySelectorAll('[data-scroll-left], [data-scroll-right]').forEach(function (button) {
      button.addEventListener('click', function () {
        var targetSelector = button.getAttribute('data-scroll-left') || button.getAttribute('data-scroll-right');
        var target = document.querySelector(targetSelector);
        if (!target) {
          return;
        }
        var direction = button.hasAttribute('data-scroll-left') ? -1 : 1;
        target.scrollBy({ left: direction * 260, behavior: 'smooth' });
      });
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    document.querySelectorAll('[data-movie-search]').forEach(function (input) {
      if (query) {
        input.value = query;
      }
      applyFilter(input);
      input.addEventListener('input', function () {
        applyFilter(input);
      });
    });

    document.querySelectorAll('[data-filter-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter-value') || '';
        var input = document.querySelector('[data-movie-search]');
        if (input) {
          input.value = value;
          applyFilter(input);
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  });
}());
