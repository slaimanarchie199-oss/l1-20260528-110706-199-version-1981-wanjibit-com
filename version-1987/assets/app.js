(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMenu() {
    var button = qs('.menu-toggle');
    var panel = qs('.mobile-panel');
    if (!button || !panel) return;
    button.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? '×' : '☰';
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) return;
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    if (slides.length < 2) return;
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(i);
        start();
      });
    });

    start();
  }

  function filterCards(input, list) {
    if (!input || !list) return;
    var cards = qsa('[data-title]', list);
    input.addEventListener('input', function () {
      var keyword = normalize(input.value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        card.classList.toggle('is-filtered-out', keyword && haystack.indexOf(keyword) === -1);
      });
    });
  }

  function setupPageFilter() {
    filterCards(qs('[data-filter-input]'), qs('[data-filter-list]'));
  }

  function setupSearchPage() {
    var input = qs('[data-search-page-input]');
    var list = qs('[data-search-list]');
    var note = qs('[data-result-note]');
    if (!input || !list) return;
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    var cards = qsa('[data-title]', list);

    function apply() {
      var keyword = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matched = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle('is-filtered-out', !matched);
        if (matched) visible += 1;
      });
      if (note) {
        note.textContent = keyword ? '已匹配 ' + visible + ' 部影片' : '输入关键词查看匹配影片';
      }
    }

    input.value = initial;
    input.addEventListener('input', apply);
    apply();
  }

  function setupTableFilter() {
    var input = qs('[data-table-filter]');
    var table = qs('[data-filter-table]');
    if (!input || !table) return;
    var rows = qsa('tbody tr', table);
    input.addEventListener('input', function () {
      var keyword = normalize(input.value);
      rows.forEach(function (row) {
        var haystack = normalize([
          row.getAttribute('data-title'),
          row.getAttribute('data-region'),
          row.getAttribute('data-genre'),
          row.getAttribute('data-tags'),
          row.textContent
        ].join(' '));
        row.classList.toggle('is-filtered-out', keyword && haystack.indexOf(keyword) === -1);
      });
    });
  }

  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = qs('script[data-hls-loader]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
    script.async = true;
    script.setAttribute('data-hls-loader', 'true');
    script.addEventListener('load', callback, { once: true });
    document.head.appendChild(script);
  }

  window.initMoviePlayer = function (source) {
    var video = qs('#movieVideo');
    var button = qs('#moviePlayButton');
    if (!video || !button || !source) return;
    var hlsInstance = null;

    function hideButton() {
      button.classList.add('is-hidden');
    }

    function attachWithHls() {
      if (!window.Hls || !window.Hls.isSupported()) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }
      if (!hlsInstance) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.play().catch(function () {});
      }
    }

    function startPlayback() {
      hideButton();
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.getAttribute('src')) {
          video.src = source;
        }
        video.play().catch(function () {});
      } else {
        loadHlsLibrary(attachWithHls);
      }
    }

    button.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (!video.getAttribute('src')) startPlayback();
    });
    video.addEventListener('play', hideButton);
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupPageFilter();
    setupSearchPage();
    setupTableFilter();
  });
})();
