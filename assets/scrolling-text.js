if (!customElements.get("marquee-scroll")) {
  customElements.define(
    "marquee-scroll",
    class marqueeScroll extends HTMLElement {
      constructor() {
        super();
        this.scrolling = this.querySelector(".scrolling--item ");
        initSectionVisiable({
          element: this,
          callback: this.initScroll.bind(this),
          margin: 300,
        });
      }
      // Init Scolling
      initScroll() {
        const childCount = this.childElementCount === 1 ? true : false;
        if (childCount) {
          this.scrolling.classList.add("scrolling--animated");

          for (let i = 0; i < 10; i++) {
            this.clone = this.scrolling.cloneNode(true);
            this.clone.setAttribute("aria-hidden", true);
            this.appendChild(this.clone);
          }

          // Animation pause and run based on visible screen
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  this.classList.remove("scrolling--text--paused");
                } else {
                  this.classList.add("scrolling--text--paused");
                }
              });
            },
            { rootMargin: "0px 0px 50px 0px" }
          );
          observer.observe(this);
        }
      }
    }
  );
}
