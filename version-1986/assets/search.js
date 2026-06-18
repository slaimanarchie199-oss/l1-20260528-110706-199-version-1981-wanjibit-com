function escHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function card(item) {
  return `
  <a class="movie-card" href="video/${item.id}.html">
    <div class="poster" style="--c1:${item.c1};--c2:${item.c2};--c3:${item.c3};">
      <div class="poster-glow"></div>
      <div class="poster-inner">
        <span class="poster-kicker">${escHtml(item.category)}</span>
        <span class="poster-initials">${escHtml(item.initials)}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-head">
        <h3>${escHtml(item.title)}</h3>
        <span class="year-pill">${escHtml(item.year)}</span>
      </div>
      <p class="card-meta">${escHtml(item.region)} · ${escHtml(item.type)} · ${escHtml(item.genre)}</p>
      <p class="card-desc">${escHtml(item.one_line)}</p>
      <div class="card-tags">
        ${(item.tags || []).slice(0, 3).map(t => `<span>${escHtml(t)}</span>`).join("")}
      </div>
    </div>
  </a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("[data-search-input]");
  const result = document.querySelector("[data-search-results]");
  const count = document.querySelector("[data-search-count]");
  const empty = document.querySelector("[data-search-empty]");
  const chips = document.querySelectorAll("[data-search-chip]");
  const moreBtn = document.querySelector("[data-load-more]");

  if (!window.CATALOG || !result) return;
  const params = new URLSearchParams(location.search);
  let activeQ = (params.get("q") || input?.value || "").trim();
  let activeCategory = params.get("category") || "";
  let limit = 48;

  if (input) input.value = activeQ;

  function normalize(s) {
    return String(s || "").toLowerCase();
  }

  function applyFilters() {
    const q = normalize(activeQ);
    const cat = normalize(activeCategory);
    const filtered = window.CATALOG.filter(item => {
      const hay = normalize([
        item.title, item.region, item.type, item.genre, item.one_line, item.summary, item.review,
        ...(item.tags || [])
      ].join(" "));
      const qMatch = !q || hay.includes(q);
      const cMatch = !cat || normalize(item.category).includes(cat);
      return qMatch && cMatch;
    }).sort((a, b) => b.score - a.score);

    const visible = filtered.slice(0, limit);
    result.innerHTML = visible.map(card).join("");
    if (count) count.textContent = `找到 ${filtered.length} 条内容`;
    if (empty) empty.style.display = filtered.length ? "none" : "block";
    if (moreBtn) moreBtn.style.display = filtered.length > limit ? "inline-flex" : "none";
    result.dataset.total = filtered.length;
  }

  input && input.addEventListener("input", () => {
    activeQ = input.value.trim();
    limit = 48;
    applyFilters();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.searchChip || "";
      chips.forEach(x => x.classList.remove("active"));
      chip.classList.add("active");
      limit = 48;
      applyFilters();
    });
  });

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      limit += 48;
      applyFilters();
    });
  }

  applyFilters();
});
