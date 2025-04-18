// https://developers.google.com/youtube/iframe_api_reference
// https://github.com/vimeo/player.js

if (!customElements.get("video-hero")) {
  customElements.define(
    "video-hero",
    class VideoHero extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.init();
      }

      init() {
        switch (this.dataset.type) {
          case "youtube":
            this.initYoutubeVideo();
            break;
          case "vimeo":
            this.initVimeoVideo();
            break;
          case "mp4":
            this.initMp4Video();
            break;
        }
      }

      initYoutubeVideo() {
        this.loadScript("youtube").then(() => this.onYouTubeIframeAPIReady());
      }

      initVimeoVideo() {
        this.loadScript("vimeo").then(() => this.onVimeoIframeAPIReady());
      }

      initMp4Video() {
        const player = this.querySelector("video");
        if (player) {
          player.play().catch(() => player.setAttribute("controls", ""));
        }
      }

      loadScript(videoType) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src =
            videoType === "youtube"
              ? "//www.youtube.com/iframe_api"
              : "//player.vimeo.com/api/player.js";
          document.body.appendChild(script);
        });
      }

      onYouTubeIframeAPIReady() {
        const videoId = this.dataset.videoId;
        const checkYTReady = setInterval(() => {
          if (window.YT) {
            window.YT.ready(() => {
              const element = document.createElement("div");
              this.appendChild(element);

              this.player = new YT.Player(element, {
                videoId: videoId,
                playerVars: {
                  showinfo: 0,
                  controls: 0,
                  fs: 0,
                  rel: 0,
                  height: "100%",
                  width: "100%",
                  iv_load_policy: 3,
                  html5: 1,
                  loop: 1,
                  playsinline: 1,
                  modestbranding: 1,
                  disablekb: 1,
                },
                events: {
                  onReady: () => this.onYoutubeReady(),
                  onStateChange: (event) => this.onYoutubeStateChange(event),
                },
              });
              clearInterval(checkYTReady);
            });
          }
        }, 50);
      }

      onYoutubeReady() {
        this.iframe = this.querySelector("iframe");
        this.iframe.setAttribute("tabindex", "-1");
        this.player.mute();
        this.player.playVideo();

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.isIntersecting ? this.youtubePlay() : this.youtubePause();
            });
          },
          { rootMargin: "0px 0px 50px 0px" }
        );

        observer.observe(this.iframe);
      }

      onYoutubeStateChange(event) {
        if (event.data === 0) this.youtubePlay();
      }

      youtubePlay() {
        this.player?.playVideo();
      }

      youtubePause() {
        this.player?.pauseVideo();
      }

      onVimeoIframeAPIReady() {
        const videoId = this.dataset.videoId;
        const checkVimeoReady = setInterval(() => {
          if (window.Vimeo) {
            this.player = new Vimeo.Player(this, {
              id: videoId,
              autoplay: true,
              autopause: false,
              background: false,
              controls: false,
              loop: true,
              height: "100%",
              width: "100%",
            });
            this.player.ready().then(() => this.onVimeoReady());
            clearInterval(checkVimeoReady);
          }
        }, 50);
      }

      onVimeoReady() {
        this.iframe = this.querySelector("iframe");
        this.iframe.setAttribute("tabindex", "-1");
        this.player.setMuted(true);

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.isIntersecting ? this.vimeoPlay() : this.vimeoPause();
            });
          },
          { rootMargin: "0px 0px 50px 0px" }
        );

        observer.observe(this.iframe);
      }

      vimeoPlay() {
        this.player?.play();
      }

      vimeoPause() {
        this.player?.pause();
      }
    }
  );
}
