function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

class SectionId {
  static #separator = "__";

  // for a qualified section id (e.g. 'template--22224696705326__main'), return just the section id (e.g. 'template--22224696705326')
  static parseId(qualifiedSectionId) {
    return qualifiedSectionId.split(SectionId.#separator)[0];
  }

  // for a qualified section id (e.g. 'template--22224696705326__main'), return just the section name (e.g. 'main')
  static parseSectionName(qualifiedSectionId) {
    return qualifiedSectionId.split(SectionId.#separator)[1];
  }

  // for a section id (e.g. 'template--22224696705326') and a section name (e.g. 'recommended-products'), return a qualified section id (e.g. 'template--22224696705326__recommended-products')
  static getIdForSection(sectionId, sectionName) {
    return `${sectionId}${SectionId.#separator}${sectionName}`;
  }
}

class HTMLUpdateUtility {
  /**
   * Used to swap an HTML node with a new node.
   * The new node is inserted as a previous sibling to the old node, the old node is hidden, and then the old node is removed.
   *
   * The function currently uses a double buffer approach, but this should be replaced by a view transition once it is more widely supported https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
   */
  static viewTransition(
    oldNode,
    newContent,
    preProcessCallbacks = [],
    postProcessCallbacks = []
  ) {
    preProcessCallbacks?.forEach((callback) => callback(newContent));

    const newNodeWrapper = document.createElement("div");
    HTMLUpdateUtility.setInnerHTML(newNodeWrapper, newContent.outerHTML);
    const newNode = newNodeWrapper.firstChild;

    // dedupe IDs
    const uniqueKey = Date.now();
    oldNode.querySelectorAll("[id], [form]").forEach((element) => {
      element.id && (element.id = `${element.id}-${uniqueKey}`);
      element.form &&
        element.setAttribute(
          "form",
          `${element.form.getAttribute("id")}-${uniqueKey}`
        );
    });

    oldNode.parentNode.insertBefore(newNode, oldNode);
    oldNode.style.display = "none";

    postProcessCallbacks?.forEach((callback) => callback(newNode));

    setTimeout(() => oldNode.remove(), 500);
  }

  // Sets inner HTML and reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
  static setInnerHTML(element, html) {
    element.innerHTML = html;
    element.querySelectorAll("script").forEach((oldScriptTag) => {
      const newScriptTag = document.createElement("script");
      Array.from(oldScriptTag.attributes).forEach((attribute) => {
        newScriptTag.setAttribute(attribute.name, attribute.value);
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = [
    "ARROWUP",
    "ARROWDOWN",
    "ARROWLEFT",
    "ARROWRIGHT",
    "TAB",
    "ENTER",
    "SPACE",
    "ESCAPE",
    "HOME",
    "END",
    "PAGEUP",
    "PAGEDOWN",
  ];
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener("keydown", (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener("mousedown", (event) => {
    mouseClick = true;
  });

  window.addEventListener(
    "focus",
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove("focused");

      if (mouseClick) return;

      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add("focused");
    },
    true
  );
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });
    this.input.addEventListener("change", this.onInputChange.bind(this));
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  quantityUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.quantityUpdate,
      this.validateQtyRules.bind(this)
    );
  }

  disconnectedCallback() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }

  onInputChange(event) {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    if (event.target.name === "plus") {
      if (
        parseInt(this.input.dataset.min) > parseInt(this.input.step) &&
        this.input.value == 0
      ) {
        this.input.value = this.input.dataset.min;
      } else {
        this.input.stepUp();
      }
    } else {
      this.input.stepDown();
    }

    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);

    if (
      this.input.dataset.min === previousValue &&
      event.target.name === "minus"
    ) {
      this.input.value = parseInt(this.input.min);
    }
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    if (this.input.min) {
      const min = parseInt(this.input.min);
      const buttonMinus = this.querySelector(".quantity__button[name='minus']");
      buttonMinus.classList.toggle("disabled", value <= min);
    }
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonPlus = this.querySelector(".quantity__button[name='plus']");
      buttonPlus.classList.toggle("disabled", value >= max);
    }
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);

  for (const key of formData.keys()) {
    const regex = /(?:^(properties\[))(.*?)(?:\]$)/;

    if (regex.test(key)) {
      obj.properties = obj.properties || {};
      obj.properties[regex.exec(key)[2]] = formData.get(key);
    } else {
      obj[key] = formData.get(key);
    }
  }

  return JSON.stringify(obj);
};

// Shopify editor
function editorShopifyEvent(t, e, i) {
  let n = !1;
  t.type.includes("shopify:section")
    ? e.hasAttribute("data-section-id") &&
      e.getAttribute("data-section-id") === t.detail.sectionId &&
      (n = !0)
    : t.type.includes("shopify:block") && t.target === e && (n = !0),
    n && i(t);
}

// When the section function is visible, disable the observer.
const initSectionVisiable = function (elemnts) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (typeof elemnts.callback === "function") {
            elemnts.callback();
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { rootMargin: `0px 0px ${elemnts.margin}px 0px` }
  );
  observer.observe(elemnts.element);
};

// Shopify Currency Symbol
const currencySymbol = {AED:"د.إ",AFN:"؋",ALL:"L",AMD:"֏",ANG:"ƒ",AOA:"Kz",ARS:"$",AUD:"$",AWG:"ƒ",AZN:"₼",BAM:"KM",BBD:"$",BDT:"Tk",BGN:"лв",BHD:".د.ب",BIF:"FBu",BMD:"$",BND:"$",BOB:"$b",BOV:"BOV",BRL:"R$",BSD:"$",BTC:"₿",BTN:"Nu.",BWP:"P",BYN:"Br",BYR:"Br",BZD:"BZ$",CAD:"$",CDF:"FC",CHE:"CHE",CHF:"CHF",CHW:"CHW",CLF:"CLF",CLP:"$",CNY:"¥",COP:"$",COU:"COU",CRC:"₡",CUC:"$",CUP:"₱",CVE:"$",CZK:"Kč",DJF:"Fdj",DKK:"kr",DOP:"RD$",DZD:"دج",EEK:"kr",EGP:"£",ERN:"Nfk",ETB:"Br",ETH:"Ξ",EUR:"€",FJD:"$",FKP:"£",GBP:"£",GEL:"₾",GGP:"£",GHC:"₵",GHS:"GH₵",GIP:"£",GMD:"D",GNF:"FG",GTQ:"Q",GYD:"$",HKD:"$",HNL:"L",HRK:"kn",HTG:"G",HUF:"Ft",IDR:"Rp",ILS:"₪",IMP:"£",INR:"₹",IQD:"ع.د",IRR:"﷼",ISK:"kr",JEP:"£",JMD:"J$",JOD:"JD",JPY:"¥",KES:"KSh",KGS:"лв",KHR:"៛",KMF:"CF",KPW:"₩",KRW:"₩",KWD:"KD",KYD:"$",KZT:"₸",LAK:"₭",LBP:"£",LKR:"₨",LRD:"$",LSL:"M",LTC:"Ł",LTL:"Lt",LVL:"Ls",LYD:"LD",MAD:"MAD",MDL:"lei",MGA:"Ar",MKD:"ден",MMK:"K",MNT:"₮",MOP:"MOP$",MRO:"UM",MRU:"UM",MUR:"₨",MVR:"Rf",MWK:"MK",MXN:"$",MXV:"MXV",MYR:"RM",MZN:"MT",NAD:"$",NGN:"₦",NIO:"C$",NOK:"kr",NPR:"₨",NZD:"$",OMR:"﷼",PAB:"B/.",PEN:"S/.",PGK:"K",PHP:"₱",PKR:"₨",PLN:"zł",PYG:"Gs",QAR:"﷼",RMB:"￥",RON:"lei",RSD:"Дин.",RUB:"₽",RWF:"R₣",SAR:"﷼",SBD:"$",SCR:"₨",SDG:"ج.س.",SEK:"kr",SGD:"S$",SHP:"£",SLL:"Le",SOS:"S",SRD:"$",SSP:"£",STD:"Db",STN:"Db",SVC:"$",SYP:"£",SZL:"E",THB:"฿",TJS:"SM",TMT:"T",TND:"د.ت",TOP:"T$",TRL:"₤",TRY:"₺",TTD:"TT$",TVD:"$",TWD:"NT$",TZS:"TSh",UAH:"₴",UGX:"USh",USD:"$",UYI:"UYI",UYU:"$U",UYW:"UYW",UZS:"лв",VEF:"Bs",VES:"Bs.S",VND:"₫",VUV:"VT",WST:"WS$",XAF:"FCFA",XBT:"Ƀ",XCD:"$",XOF:"CFA",XPF:"₣",XSU:"Sucre",XUA:"XUA",YER:"﷼",ZAR:"R",ZMW:"ZK",ZWD:"Z$",ZWL:"$"};
const shopCurrencySymbol = currencySymbol[Shopify.currency.active];

/* Get Sibling */
const getSiblings = function (elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

/* Slide Up */
const slideUp = (target, time) => {
  const duration = time ? time : 500;
  target.style.transitionProperty = "height, margin";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};
/* Slide Down */
const slideDown = (target, time) => {
  let duration = time ? time : 500;
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "block";
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

// Get window top offset
function TopOffset(el) {
  let rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop };
}

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    this.dataset.section = this.closest(".shopify-section").id.replace(
      "shopify-section-",
      ""
    );
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove("overflow-hidden");
    document.body.dispatchEvent(new CustomEvent("modalClosed"));
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener("click", this.loadContent.bind(this));
  }

  loadContent() {
    window.pauseAllMedia();
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );
      if (focus) deferredElement.focus();
      if (
        deferredElement.nodeName == "VIDEO" &&
        deferredElement.getAttribute("autoplay")
      ) {
        // force autoplay for safari
        deferredElement.play();
      }
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class DataCountdown extends HTMLElement {
  constructor() {
    super();

    this.onCountDown();
  }

  onCountDown() {
    const CountDownElement = this.querySelector("[data-countdown]");

    if (CountDownElement) {
      const countDownItem = (value, label) => {
        return `<div class="countdown-item ${label}"><div class="countdown__inner"><span class="countdown__digit">${value}</span> <span class="countdown__labels">${label}</span></div></div>`;
      };
      const date = new Date(
          CountDownElement.getAttribute("data-countdown")
        ).getTime(),
        second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      const countDownInterval = setInterval(function () {
        let currentTime = new Date().getTime(),
          timeDistance = date - currentTime,
          daysValue = Math.floor(timeDistance / day),
          hoursValue = Math.floor((timeDistance % day) / hour),
          minutesValue = Math.floor((timeDistance % hour) / minute),
          secondsValue = Math.floor((timeDistance % minute) / second);

        CountDownElement.innerHTML =
          countDownItem(daysValue, window.countdown.days) +
          countDownItem(hoursValue, window.countdown.Hours) +
          countDownItem(minutesValue, window.countdown.minutes) +
          countDownItem(secondsValue, window.countdown.second);

        if (timeDistance < 0) clearInterval(countDownInterval);
      }, 1000);
    }
  }
}
customElements.define("countdown-timer", DataCountdown);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("change", (event) => {
      const target = this.getInputForEventTarget(event.target);
      this.updateSelectionMetadata(event);

      publish(PUB_SUB_EVENTS.optionValueSelectionChange, {
        data: {
          event,
          target,
          selectedOptionValues: this.selectedOptionValues,
        },
      });
    });
  }

  updateSelectionMetadata({ target }) {
    const { value, tagName } = target;
    if (tagName === "SELECT" && target.selectedOptions.length) {
      Array.from(target.options)
        .find((option) => option.getAttribute("selected"))
        .removeAttribute("selected");
      target.selectedOptions[0].setAttribute("selected", "selected");

      const swatchValue = target.selectedOptions[0].dataset.optionSwatchValue;
      const selectedDropdownSwatchValue = target
        .closest(".product-form__input")
        .querySelector("[data-selected-value] > .swatch");
      if (!selectedDropdownSwatchValue) return;
      if (swatchValue) {
        selectedDropdownSwatchValue.style.setProperty(
          "--swatch--background",
          swatchValue
        );
        selectedDropdownSwatchValue.classList.remove("swatch--unavailable");
      } else {
        selectedDropdownSwatchValue.style.setProperty(
          "--swatch--background",
          "unset"
        );
        selectedDropdownSwatchValue.classList.add("swatch--unavailable");
      }

      selectedDropdownSwatchValue.style.setProperty(
        "--swatch-focal-point",
        target.selectedOptions[0].dataset.optionSwatchFocalPoint || "unset"
      );
    } else if (tagName === "INPUT" && target.type === "radio") {
      const selectedSwatchValue = target
        .closest(`.product-form__input`)
        .querySelector("[data-selected-value]");
      if (selectedSwatchValue) selectedSwatchValue.innerHTML = value;
    }
  }

  getInputForEventTarget(target) {
    return target.tagName === "SELECT" ? target.selectedOptions[0] : target;
  }

  get selectedOptionValues() {
    return Array.from(
      this.querySelectorAll("select option[selected], fieldset input:checked")
    ).map(({ dataset }) => dataset.optionValueId);
  }
}

customElements.define("variant-selects", VariantSelects);

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("[grid-recommendation]");
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.querySelector("[grid-recommendation]").innerHTML =
              recommendations.innerHTML;
          }

          if (recommendations) {
            if (recommendations.innerHTML.trim().length === 0) {
              this.parentElement.classList.add("no-js-inline");
            } else {
              this.children[0].classList.remove("no-js-inline");
            }
          }

          if (html.querySelector(".product-grid-item")) {
            this.classList.add("product-recommendations--loaded");
          }

          if (this.dataset.intent == "complementary") {
            let complementaryProducts = new Swiper(
              this.querySelector(".complementory--slider"),
              {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 15,
                autoHeight: true,
                pagination: {
                  el: this.querySelector(".swiper-pagination"),
                  clickable: true,
                },
                navigation: {
                  nextEl: this.querySelector(".swiper-button-next"),
                  prevEl: this.querySelector(".swiper-button-prev"),
                },
              }
            );
            this.querySelector(
              ".complementary-slideshow--slider"
            ).classList.remove("no-js-inline");

            this.querySelector("details")
              ? (this.querySelector("details").open = true)
              : null;
          }

          if (this.dataset.intent == "related") {
            let autoplay = false,
              sliderAutoplay = this.dataset.autoplay,
              autoPlayValue = false,
              autoPlayTime = parseInt(this.dataset.autoplayTime),
              sliderContainer = true;
            if (sliderAutoplay == "true") {
              autoPlayValue = {
                delay: autoPlayTime,
              };
            }
            if (this.dataset.sliderEnable !== "true") {
              sliderContainer = false;
            }

            let relatedProducts = new Swiper(
              this.querySelector(".productSlider"),
              {
                loop: true,
                slidesPerView: parseInt(this.dataset.showMobile),
                spaceBetween: 20,
                autoplay: autoPlayValue,
                pagination: {
                  el: this.querySelector(".swiper-pagination"),
                  clickable: true,
                  type: "fraction",
                },
                navigation: {
                  nextEl: this.querySelector(".swiper-button-next"),
                  prevEl: this.querySelector(".swiper-button-prev"),
                },
                breakpoints: {
                  640: {
                    slidesPerView: parseInt(this.dataset.showMobile),
                  },
                  750: {
                    slidesPerView: parseInt(this.dataset.showMobile),
                  },
                  992: {
                    slidesPerView: parseInt(this.dataset.showExtraLarge),
                  },
                },
              }
            );

            if (sliderContainer && sliderAutoplay == "true") {
              this.querySelector(".productSlider").addEventListener(
                "mouseenter",
                (e) => {
                  relatedProducts.autoplay.stop();
                }
              );
              this.querySelector(".productSlider").addEventListener(
                "mouseleave",
                (e) => {
                  relatedProducts.autoplay.start();
                }
              );
            }

            // Slide thumbnail height
            const slideThumbHeight = () => {
              const proudctThumbnails = this.querySelector(
                ".productSlider"
              ).querySelectorAll(".card--client-height");
              if (proudctThumbnails.length > 0) {
                const productThumbnailHeight = proudctThumbnails[0];
                this.querySelector(
                  ".productSlider"
                ).parentElement.style.setProperty(
                  "--slider-navigation-top-offset",
                  `${productThumbnailHeight.clientHeight / 2}px`
                );
              }
            };
            slideThumbHeight();
            window.addEventListener("resize", () => {
              slideThumbHeight();
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 400px 0px",
    }).observe(this);
  }
}

customElements.define("product-recommendations", ProductRecommendations);

class BulkAdd extends HTMLElement {
  constructor() {
    super();
    this.queue = [];
    this.requestStarted = false;
    this.ids = [];
  }

  startQueue(id, quantity) {
    this.queue.push({ id, quantity });
    const interval = setInterval(() => {
      if (this.queue.length > 0) {
        if (!this.requestStarted) {
          this.sendRequest(this.queue);
        }
      } else {
        clearInterval(interval);
      }
    }, 250);
  }

  sendRequest(queue) {
    this.requestStarted = true;
    const items = {};
    queue.forEach((queueItem) => {
      items[parseInt(queueItem.id)] = queueItem.quantity;
    });
    this.queue = this.queue.filter(
      (queueElement) => !queue.includes(queueElement)
    );
    const quickBulkElement =
      this.closest("quick-order-list") || this.closest("quick-add-bulk");
    quickBulkElement.updateMultipleQty(items);
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    input.value = input.getAttribute("value");
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

  validateQuantity(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;

    if (inputValue < event.target.dataset.min) {
      this.setValidity(
        event,
        index,
        window.quickOrderListStrings.min_error.replace(
          "[min]",
          event.target.dataset.min
        )
      );
    } else if (inputValue > parseInt(event.target.max)) {
      this.setValidity(
        event,
        index,
        window.quickOrderListStrings.max_error.replace(
          "[max]",
          event.target.max
        )
      );
    } else if (inputValue % parseInt(event.target.step) != 0) {
      this.setValidity(
        event,
        index,
        window.quickOrderListStrings.step_error.replace(
          "[step]",
          event.target.step
        )
      );
    } else {
      event.target.setCustomValidity("");
      event.target.reportValidity();
      this.startQueue(index, inputValue);
    }
  }

  getSectionsUrl() {
    if (window.pageNumber) {
      return `${window.location.pathname}?page=${window.pageNumber}`;
    } else {
      return `${window.location.pathname}`;
    }
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }
}

if (!customElements.get("bulk-add")) {
  customElements.define("bulk-add", BulkAdd);
}
