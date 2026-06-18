
(function () {
  function normalize(s) {
    return (s || '').toString().toLowerCase().replace(/\s+/g, '');
  }

  function filterCards(input, list) {
    if (!input || !list) return;
    var cards = list.querySelectorAll('[data-card]');
    var value = normalize(input.value);
    cards.forEach(function (card) {
      var hay = normalize([
        card.dataset.title,
        card.dataset.type,
        card.dataset.year,
        card.dataset.tags
      ].join(' '));
      var visible = !value || hay.indexOf(value) !== -1;
      card.classList.toggle('is-hidden', !visible);
    });
  }

  function bindFilters() {
    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
      var scope = input.closest('.page-main') || document;
      var list = scope.querySelector('[data-filter-list]');
      if (!list) return;
      input.addEventListener('input', function () { filterCards(input, list); });
      filterCards(input, list);
    });
  }

  function startHeroRotation() {
    var cards = Array.from(document.querySelectorAll('[data-feature-card]'));
    if (!cards.length) return;
    var active = 0;
    function paint() {
      cards.forEach(function (card, idx) {
        card.style.opacity = idx === active ? '1' : '0.72';
        card.style.transform = idx === active ? 'translateY(0)' : 'translateY(4px) scale(.985)';
      });
    }
    paint();
    setInterval(function () {
      active = (active + 1) % cards.length;
      paint();
    }, 4200);
  }

  function initPlayer() {
    var video = document.getElementById('movie-player');
    if (!video) return;
    var src = video.dataset.src;
    if (!src) return;

    function attach(url) {
      try {
        if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (_, data) {
            if (data && data.fatal) {
              video.src = url;
            }
          });
        } else {
          video.src = url;
        }
      } catch (err) {
        video.src = url;
      }
    }

    attach(src);
  }

  function initSearchPage() {
    var input = document.getElementById('site-search');
    var results = document.getElementById('search-results');
    var data = window.__SEARCH_DATA__ || [];
    if (!input || !results || !data.length) return;

    function render(list) {
      results.innerHTML = list.map(function (m) {
        var tags = (m.tags || []).slice(0, 3).map(function (t) {
          return '<span>' + t + '</span>';
        }).join('');
        return '\n          <a class="movie-card" href="movie-' + m.numberId + '.html">' +
          '<div class="poster-wrap"><img src="assets/posters/' + m.numberId + '.svg" alt="' + m.title + '" loading="lazy" /><div class="poster-badge">' + m.type + '</div></div>' +
          '<div class="movie-card__body"><h3>' + m.title + '</h3><div class="movie-meta">' + m.region + ' · ' + m.year + '</div><p>' + m.oneLine + '</p><div class="tag-row">' + tags + '</div></div>' +
          '</a>';
      }).join('');
    }

    function apply() {
      var q = normalize(input.value);
      var list = !q ? data : data.filter(function (m) {
        var hay = normalize([m.title, m.type, m.year, m.region, m.genre, (m.tags || []).join(' ')].join(' '));
        return hay.indexOf(q) !== -1;
      });
      render(list.slice(0, 120));
    }

    input.addEventListener('input', apply);
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindFilters();
    startHeroRotation();
    initPlayer();
    initSearchPage();
  });
})();
