let init = !1,
    initPrice = !1;
var monthValues = [1, 12, 24, 36],
    rawrules = {},
    formated = {},
    priceRules = [];
let isCart = !1,
    tva = 1.2,
    trackingId = null;
const greenleazePriceActualize = new Event("greenleazePriceActualize");

function parseRule(e, t) {
    return new Function("return " + e.replace(/\[\[(\w+)\]\]/g, ((e, n) => t[n])))
}

function getAllPricesForProduct(e) {
    const t = {};
    for (month in monthValues) t[monthValues[month]] = getRuleByProductPriceAndDuration(e, monthValues[month]);
    return t
}

function getRuleByProductPriceAndDuration(e, t = 36) {
    monthValues.includes(t) || (t = monthValues[monthValues.length - 1]), productPriceFormat = parseFloat(e);
    const n = priceRules.find((e => e.duration == t && e.minPrice <= productPriceFormat && e.maxPrice >= productPriceFormat)),
        r = parseRule(n.rule, {
            tva: tva,
            prixHT: e
        }),
        o = parseRule(n.depositRule, {
            tva: tva,
            prixHT: e
        });
    return n ? {
        monthly: Number(r()).toFixed(2),
        initial: Number(o()).toFixed(2)
    } : {
        monthly: "0.00",
        initial: "0.00"
    }
}
async function getAllPriceRules() {
    const e = await fetch("/apps/greenleaze-proxy/pricing", {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
    rawrules = await e.json(), priceRules = rawrules;

    const t = new Set;
    for (let n = 0; n < priceRules.length; n++) t.add(priceRules[n].duration);
    monthValues = [...t].sort((function(e, t) {
        return e - t
    })), initPrice = !0, console.log("GREENLEAZE INITIALIZED"), window.dispatchEvent(greenleazePriceActualize), document.addEventListener("on:cart:add", (function(e) {
        console.log("product added"), setTimeout((() => window.dispatchEvent(greenleazePriceActualize)), 1500)
    })), document.addEventListener("on:line-item:change", (function(e) {
        console.log("product changed"), setTimeout((() => window.dispatchEvent(greenleazePriceActualize)), 1500)
    })), document.addEventListener("dispatch:cart-drawer:refresh", (function(e) {
        console.log("dispatch:cart-drawer:refresh"), setTimeout((() => window.dispatchEvent(greenleazePriceActualize)), 1500)
    })), document.addEventListener("on:cart:error", (function(e) {
        console.log("on:cart:error"), setTimeout((() => window.dispatchEvent(greenleazePriceActualize)), 1500)
    }))
}
async function addTo(e, t) {
    var n = {
        id: e,
        quantity: t
    };
    try {
        let e = await fetch("/cart/add.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(n)
        });
        if (!e.ok) throw new Error("Error during request: " + e.statusText);
        await e.json()
    } catch (r) {
        console.error("Erreur:", r)
    }
}
async function sendCartAndRedirect(e, t, n) {
    let r = await fetch(window.Shopify.routes.root + "cart.js"),
        o = await r.json();
    if (t) {
        o.items.some((e => e.variant_id == t)) || (await addTo(t, 1), console.log(""), r = await fetch(window.Shopify.routes.root + "cart.js"), console.log(""), o = await r.json())
    }
    trackingId || (trackingId = window.ShopifyAnalytics?.lib?.user()?.traits()?.uniqToken || self?.crypto?.randomUUID());
    let i = await fetch("/apps/greenleaze-proxy/send-card", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            cartContents: JSON.stringify(o),
            duration: e,
            trackingId: trackingId,
            trackingData: null,
            postHogtrackingId: n
        })
    });
    return i.ok ? (i = await i.json(), i?.message && console.error(i?.message), i?.redirectUrl && (window.location.href = i?.redirectUrl + "&duration=" + e)) : (console.error("Une erreur s'est produite."), console.error("error during saved ", i)), !0
}
async function initGreenleaze() {
    console.log("INITIALIAZING GREENLEAZE"), init = !0, await getAllPriceRules()
}
init || initGreenleaze();