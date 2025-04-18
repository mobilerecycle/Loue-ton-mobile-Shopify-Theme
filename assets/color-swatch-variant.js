if (!customElements.get("variant-swatch-buttons")) {
  customElements.define(
    "variant-swatch-buttons",
    class variantSwatchButtons extends HTMLElement {
      constructor() {
        super();
        this.onColorSwatches();
      }

      onColorSwatches() {
        const variantList = this.getVariantData() || [];
        const swatchButtonList = this.querySelectorAll("color-swatch-variant");
        const result = Object.values(
          variantList.reduce((total, item) => {
            let k = `${item[this.dataset.colorSwatch]}`;
            if (!total[k]) {
              total[k] = { ...item, count: 1 };
            } else {
              total[k].count += 1;
            }
            return total;
          }, {})
        );

        if (swatchButtonList.length > 0) {
          swatchButtonList.forEach((button) => {
            result.forEach((data) => {
              if (data[this.dataset.colorSwatch] === button.dataset.value) {
                if (
                  this.dataset.colorSwatchStyle === "image" &&
                  data.featured_image != null
                ) {
                  const attributes = {
                    style: `--swatch-background-image: url(${
                      data.featured_image.src
                    }); --swatch-background-color: ${
                      data[this.dataset.colorSwatch]
                    };`,
                    "data-variant-id": `${data.id}`,
                  };
                  for (var key in attributes) {
                    button.setAttribute(key, attributes[key]);
                  }
                } else {
                  const attributes = {
                    style: `--swatch-background-color: ${
                      data[this.dataset.colorSwatch]
                    };`,
                    "data-variant-id": `${data.id}`,
                  };
                  for (var key in attributes) {
                    button.setAttribute(key, attributes[key]);
                  }
                }
              }
            });
          });
        }
      }

      getVariantData() {
        this.variantData =
          this.variantData ||
          JSON.parse(
            this.querySelector('[type="application/json"]').textContent
          );
        return this.variantData;
      }
    }
  );
}

if (!customElements.get("color-swatch-variant")) {
  customElements.define(
    "color-swatch-variant",
    class ColorSwatchVariant extends HTMLElement {
      constructor() {
        super();
        this.variantId = this.dataset.variantId;
        this.productHandle = this.dataset.productHandle;
        this.productCard = this.closest(".product-grid-item");

        this.addEventListener("click", this.onClickHandler.bind(this));
      }

      onClickHandler(event) {
        let url = `/products/${this.productHandle}?variant=${this.variantId}&view=colorswatch`;
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            this.updateThumbnail(html);
            this.updateTitle(html);
            this.updatePrice(html);
          })
          .catch((e) => {
            console.error(e);
          });
        // Color swatch button active/remove classList
        const colorButtonList = this.productCard.querySelectorAll(
          ".product--color-swatch"
        );
        colorButtonList.forEach((button) => {
          button.classList.remove("checked-color");
        });
        this.classList.add("checked-color");
      }

      updateThumbnail(html) {
        const destination = this.productCard.querySelector(".media").firstChild;
        const source = html.querySelector(".media").firstChild;
        if (source && destination) {
          destination.src = source.src;
          destination.srcset = source.srcset;
        }
        // Thumbnail link update
        const linkDestination = this.productCard.querySelector(
          ".product__card--link"
        );
        const linkSource = html
          .querySelector(".product__card--link")
          .getAttribute("href");

        if (linkDestination && linkSource)
          linkDestination.setAttribute("href", `${linkSource}`);
      }

      updateTitle(html) {
        const destination = this.productCard.querySelector(
          ".product-grid-item__title"
        );
        const source = html.querySelector(".product-grid-item__title");

        if (source && destination) destination.innerHTML = source.innerHTML;
      }

      updatePrice(html) {
        const destination = this.productCard.querySelector(".price");
        const source = html.querySelector(".price");
        if (source && destination) destination.innerHTML = source.innerHTML;
      }
    }
  );
}
