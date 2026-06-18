import { H as Hls } from "./hls-vendor.js";

function initPlayer(container) {
  const video = container.querySelector("video");
  const playButton = container.querySelector("[data-play-button]");
  const sourceSelect = container.querySelector("[data-source-select]");
  if (!video) return;

  let hls = null;
  let currentSrc = sourceSelect ? sourceSelect.value : video.dataset.defaultSrc;

  function destroyHls() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  }

  function loadSource(src) {
    currentSrc = src;
    destroyHls();
    video.pause();
    video.removeAttribute("src");
    video.load();

    const canPlayNative = video.canPlayType("application/vnd.apple.mpegurl");
    if (canPlayNative) {
      video.src = src;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data.fatal) {
          console.error("HLS playback error:", data);
        }
      });
      return;
    }

    video.src = src;
  }

  function togglePlay() {
    if (!video.src && currentSrc) {
      loadSource(currentSrc);
    }
    if (video.paused) {
      video.play().catch(() => {});
      if (playButton) playButton.style.opacity = "0";
    } else {
      video.pause();
      if (playButton) playButton.style.opacity = "1";
    }
  }

  if (playButton) {
    playButton.addEventListener("click", togglePlay);
  }
  video.addEventListener("click", togglePlay);

  if (sourceSelect) {
    sourceSelect.addEventListener("change", () => {
      loadSource(sourceSelect.value);
      if (playButton) playButton.style.opacity = "0";
      video.play().catch(() => {});
    });
  }

  loadSource(currentSrc);
  video.addEventListener("play", () => {
    if (playButton) playButton.style.opacity = "0";
  });
  video.addEventListener("pause", () => {
    if (playButton) playButton.style.opacity = "1";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-player]").forEach(initPlayer);
});
