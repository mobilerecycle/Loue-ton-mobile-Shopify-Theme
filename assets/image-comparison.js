// https://codepen.io/kunj4u/pen/LYYZbzR

if (!customElements.get("image-comparison")) {
  customElements.define(
    "image-comparison",
    class ImageComparison extends HTMLElement {
      constructor() {
        super();

        this.active = false;
        this.button = this.querySelector("button");
        this.horizontal = this.dataset.layout === "horizontal";
        this.init();
      }

      init() {
        this.button.addEventListener(
          "touchstart",
          this.startHandler.bind(this)
        );
        document.body.addEventListener("touchend", this.endHandler.bind(this));
        document.body.addEventListener("touchmove", this.onChange.bind(this));

        this.button.addEventListener("mousedown", this.startHandler.bind(this));
        document.body.addEventListener("mouseup", this.endHandler.bind(this));
        document.body.addEventListener("mousemove", this.onChange.bind(this));
      }

      startHandler() {
        this.active = true;
      }

      endHandler() {
        this.active = false;
      }

      onChange(e) {
        if (!this.active) return;

        const event = (e.touches && e.touches[0]) || e;
        const x = this.horizontal
          ? event.pageX - this.offsetLeft
          : event.pageY - this.offsetTop;

        this.scrollIt(x);
      }

      scrollIt(x) {
        const distance = this.horizontal ? this.clientWidth : this.clientHeight;

        const max = distance - 20;
        const min = 20;
        const mouseX = Math.max(min, Math.min(x, max));
        const mousePercent = (mouseX * 100) / distance;
        this.style.setProperty("--percent", mousePercent + "%");
      }
    }
  );
}
