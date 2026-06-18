(function () {
  window.prepareMoviePlayer = function (video, button, source) {
    if (!video || !button || !source) {
      return;
    }

    var hls = null;
    var manifestReady = false;

    function showButton() {
      button.classList.remove('is-hidden');
    }

    function hideButton() {
      button.classList.add('is-hidden');
    }

    function playVideo() {
      hideButton();
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          showButton();
        });
      }
    }

    function startNative() {
      if (!video.getAttribute('src')) {
        video.src = source;
      }
      playVideo();
    }

    function startWithHls() {
      if (!hls) {
        hls = new Hls({ enableWorker: true });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(source);
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          manifestReady = true;
          playVideo();
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            try {
              hls.destroy();
            } catch (error) {
              hls = null;
            }
            hls = null;
            startNative();
          }
        });
        return;
      }
      if (manifestReady) {
        playVideo();
      }
    }

    function start() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        startNative();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        startWithHls();
        return;
      }
      startNative();
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  };
}());
