class StickyProVariantSelect extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onStickyVariantChange);
  }

  onStickyVariantChange() {
    this.varOptions = this.querySelector("select");
    //console.log("connected", this.varOptions.value);

    let productForms = document.querySelector(
      `#product-sticky-form-${this.dataset.section}`
    );
    let input = productForms.querySelector('input[name="id"]');
    input.value = this.varOptions.value;
  }
}
customElements.define("sticky-variant-select", StickyProVariantSelect);

if (Shopify.designMode) {
  document.addEventListener("shopify:section:load", (event) => {
    stickyScroll();
  });
  document.addEventListener("shopify:section:select", (event) => {
    stickyScroll();
  });
  document.addEventListener("shopify:section:deselect", (event) => {
    stickyScroll();
  });
}

const stickyScroll = () => {
  let stickySelectedVariant = document.querySelector(`#sticky__variant`);
  if (stickySelectedVariant) {
    let stickySelectVairantInput = document.querySelector(
      "#sticky__selected_variant_id"
    );
    stickySelectVairantInput.value = stickySelectedVariant.value;
  }

  const BuyButtonForm = document.querySelector(".product_buy_button_form");
  const productStickyWrapper = document.querySelector(".product__sticky");

  window.addEventListener("scroll", function () {
    document.documentElement.style.setProperty(
      "--sticky-bar-height",
      `${productStickyWrapper.clientHeight}px`
    );
    let BuyBUttonOffset = TopOffset(BuyButtonForm);
    let BuyBUttonTopffset = BuyBUttonOffset.top;

    if (window.scrollY > BuyBUttonTopffset) {
      productStickyWrapper.classList.add("sticky");
      document.body.classList.add("sticky__cart");
    } else {
      productStickyWrapper.classList.remove("sticky");
      document.body.classList.remove("sticky__cart");
    }
  });
};
stickyScroll();
