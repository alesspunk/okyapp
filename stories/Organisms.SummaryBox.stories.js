/* ─────────────────────────────────────────────────────────
   Organisms / Summary Box
   Pen reference: 6959:56843
   Flows: products · giftCards · billPayments
   Steps: pdp · plp · cart · checkout
───────────────────────────────────────────────────────── */

export default {
  title: "Organisms/Summary Box",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Summary Box** es el organismo de resumen de compra que aparece en los flujos " +
          "de productos, gift cards y pagos de servicios (bill payments). " +
          "Se adapta a cuatro pasos del embudo: PDP, PLP, Cart y Checkout. " +
          "Siempre incluye una barra de tipo de cambio y una tarjeta blanca con sombra. " +
          "Pen: `6959:56843` · Tokens: `$Primary Main`, `$Secondary Dark`, `$Disable Main`, `$Disable Text`, `$White`.",
      },
    },
  },
  argTypes: {
    flow: {
      control: "select",
      options: ["products", "giftCards", "billPayments"],
      description: "Contexto del flujo de compra",
      table: { defaultValue: { summary: "products" } },
    },
    step: {
      control: "select",
      options: ["pdp", "plp", "cart", "checkout"],
      description: "Paso de la pantalla donde aparece el box",
      table: { defaultValue: { summary: "pdp" } },
    },
    pricing: {
      control: "inline-radio",
      options: ["saving", "normal"],
      description:
        "**saving** muestra precio tachado + precio con descuento. **normal** muestra precio plano. No aplica en billPayments.",
      table: { defaultValue: { summary: "saving" } },
    },
    showAddButton: {
      control: "boolean",
      description: 'Muestra el CTA "Agregar" en el paso PDP.',
      table: { defaultValue: { summary: true } },
    },
    withVoucherify: {
      control: "boolean",
      description:
        "Muestra la fila de código promocional (Voucherify). **Solo aplica en PLP / cart / checkout** — en PDP no tiene efecto.",
      table: { defaultValue: { summary: false } },
    },
    exchangeRate: {
      control: "text",
      description: 'Valor del tipo de cambio en la barra superior (ej. "Q 7.55").',
      table: { defaultValue: { summary: "Q 7.55" } },
    },
    productLabel: {
      control: "text",
      description:
        "Copy del nombre del producto en la primera fila. Úsalo para probar etiquetas como: Producto, Gift Card, Recarga, Pago de Servicio.",
      table: { defaultValue: { summary: "Producto, Gift Card" } },
    },
    productCount: {
      control: { type: "number", min: 1, max: 99 },
      description: "Cantidad de ítems mostrada en PLP / Cart / Checkout.",
      table: { defaultValue: { summary: 3 } },
    },
  },
};

/* ── helpers ─────────────────────────────────────────── */

function buildOverlay(exchangeRate) {
  return `
    <div class="summary-type-overlay">
      <span class="token-exchange">TIPO DE CAMBIO: ${exchangeRate}</span>
    </div>`;
}

function buildSummaryBox({ flow, step, pricing, showAddButton, withVoucherify, exchangeRate, productLabel, productCount }) {
  const label = productLabel ?? (flow === "giftCards" ? "Producto, Gift Card" : "Producto");
  const count = productCount ?? 3;
  const isSaving = pricing === "saving";
  const isBill = flow === "billPayments";
  const isCompact = !isBill;
  const isNarrow = flow === "giftCards" && step === "plp";
  const finalLabel = (step === "checkout" || isBill) ? "TOTAL" : "PAGAS";

  const serviceSaving = `<span class="summary-value-old">$15.00</span> <span class="summary-label">$7.50</span>`;
  const serviceNormal = `<span class="summary-label">$3.50</span>`;
  const serviceHtml = isSaving ? serviceSaving : serviceNormal;

  const productsSaving = `<span class="summary-value-old">$100.00</span> <span class="summary-label-strong">$70.00</span>`;
  const productsNormal = `<span class="summary-label-strong">$100.00</span>`;
  const productsHtml = isSaving ? productsSaving : productsNormal;

  const promoRow = `
      <div class="summary-row">
        <span class="summary-value-success">Código promo</span>
        <span class="summary-value-success">-$5.00</span>
      </div>`;

  let bodyHtml = "";
  let footerHtml = "";

  /* ── billPayments ─────────────────────────────────── */
  if (isBill) {
    bodyHtml = `
      <div class="summary-row">
        <span class="summary-label">Monto en moneda local</span>
        <span class="summary-label">Q144.00</span>
      </div>
      <div class="summary-row">
        <span class="summary-label-strong">Monto a pagar</span>
        <span class="summary-label-strong">$50.00</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Costo por servicio</span>
        <span class="summary-label">$1.00</span>
      </div>
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label-strong">${finalLabel}</span>
        <span class="summary-label-strong">$51.00</span>
      </div>`;
    const ctaLabel = step === "pdp" || step === "plp" ? "Agregar" : "Ir a pagar";
    footerHtml = `
      <div class="summary-divider"></div>
      <div class="summary-cta-row">
        <button class="btn btn-primary summary-btn">${ctaLabel}</button>
      </div>`;

  /* ── PDP ──────────────────────────────────────────── */
  } else if (step === "pdp") {
    const productLabel = label;
    const pdpProduct = isSaving
      ? `<span class="summary-value-old">$57.31</span> <span class="summary-value-new">$32.69</span>`
      : `<span class="summary-label-strong">$57.31</span>`;
    const pdpTotal = isSaving ? "$40.19" : "$60.81";

    bodyHtml = `
      <div class="summary-row">
        <span class="summary-label-strong">${productLabel}</span>
        <span>${pdpProduct}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Costo por servicio</span>
        <span>${serviceHtml}</span>
      </div>
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label-strong">${finalLabel}</span>
        <span class="summary-label-strong">${pdpTotal}</span>
      </div>`;

    if (showAddButton) {
      footerHtml = `
      <div class="summary-divider"></div>
      <div class="summary-cta-row">
        <button class="btn btn-primary summary-btn">
          <i class="fa-regular fa-plus"></i>Agregar
        </button>
      </div>`;
    } else {
      footerHtml = `<div class="summary-divider"></div>`;
    }

  /* ── PLP ──────────────────────────────────────────── */
  } else if (step === "plp") {
    const plpLabel = `${count} ${label}`;
    const plpTotal = isSaving
      ? withVoucherify ? "$102.50" : "$107.50"
      : withVoucherify ? "$98.50"  : "$103.50";

    bodyHtml = `
      <div class="summary-row">
        <span class="summary-label-strong">${plpLabel}</span>
        <span class="summary-label-strong">$100.00</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Costo por servicio</span>
        <span>${serviceHtml}</span>
      </div>
      ${withVoucherify ? promoRow : ""}
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label-strong">${finalLabel}</span>
        <span class="summary-label-strong">${plpTotal}</span>
      </div>`;

    if (withVoucherify) {
      footerHtml = `
      <div class="summary-savings-row">
        <i class="fa-solid fa-tags"></i>
        <span>¡Ahorro total ${isSaving ? "$12.50" : "$5.00"}!</span>
      </div>
      <div class="summary-cta-row double">
        <button class="btn btn-outlined btn-medium" style="width:100%">Seguir comprando</button>
        <button class="btn btn-primary btn-medium" style="width:100%">Ir a caja</button>
      </div>`;
    } else {
      footerHtml = `
      <div class="summary-divider"></div>
      <div class="summary-cta-row double">
        <button class="btn btn-outlined btn-medium" style="width:100%">Seguir comprando</button>
        <button class="btn btn-primary btn-medium" style="width:100%">Ir a caja</button>
      </div>`;
    }

  /* ── Cart ─────────────────────────────────────────── */
  } else if (step === "cart") {
    const cartLabel = `${count} ${label}`;

    if (flow === "giftCards") {
      // giftCards/cart: no service-fee row; PAGAS uses summary-label (not strong)
      const giftCartTotal = isSaving
        ? withVoucherify ? "$65.00" : "$70.00"
        : withVoucherify ? "$95.00" : "$100.00";

      bodyHtml = `
      <div class="summary-row">
        <span class="summary-label-strong">${cartLabel}</span>
        <span>${productsHtml}</span>
      </div>
      ${withVoucherify ? promoRow : ""}
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label">${finalLabel}</span>
        <span class="summary-label-strong">${giftCartTotal}</span>
      </div>`;
    } else {
      const cartTotal = isSaving
        ? withVoucherify ? "$72.50" : "$77.50"
        : withVoucherify ? "$98.50" : "$103.50";

      bodyHtml = `
      <div class="summary-row">
        <span class="summary-label-strong">${cartLabel}</span>
        <span>${productsHtml}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Costo por servicio</span>
        <span>${serviceHtml}</span>
      </div>
      ${withVoucherify ? promoRow : ""}
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label-strong">${finalLabel}</span>
        <span class="summary-label-strong">${cartTotal}</span>
      </div>`;
    }

    const savingsAmt = isSaving
      ? (flow === "giftCards" ? "$35.00" : "$31.00")
      : "$5.00";

    if (withVoucherify) {
      footerHtml = `
      <div class="summary-savings-row">
        <i class="fa-solid fa-tags"></i>
        <span>¡Ahorro total ${savingsAmt}!</span>
      </div>
      <div class="summary-cta-row double">
        <button class="btn btn-outlined btn-medium" style="width:100%">Seguir comprando</button>
        <button class="btn btn-primary btn-medium" style="width:100%">Ir a caja</button>
      </div>`;
    } else {
      footerHtml = `
      <div class="summary-divider"></div>
      <div class="summary-cta-row double">
        <button class="btn btn-outlined btn-medium" style="width:100%">Seguir comprando</button>
        <button class="btn btn-primary btn-medium" style="width:100%">Ir a caja</button>
      </div>`;
    }

  /* ── Checkout ─────────────────────────────────────── */
  } else {
    const coLabel = `${count} ${label}`;
    const coTotal = isSaving
      ? withVoucherify ? "$72.50" : "$77.50"
      : withVoucherify ? "$98.50" : "$103.50";
    const savingsAmt = isSaving ? "$31.00" : "$5.00";

    bodyHtml = `
      <div class="summary-row">
        <span class="summary-label-strong">${coLabel}</span>
        <span>${productsHtml}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Costo por servicio</span>
        <span>${serviceHtml}</span>
      </div>
      ${withVoucherify ? promoRow : ""}
      <div class="summary-row summary-row-total" style="padding-bottom:8px">
        <span class="summary-label-strong">${finalLabel}</span>
        <span class="summary-label-strong">${coTotal}</span>
      </div>`;

    if (withVoucherify) {
      footerHtml = `
      <div class="summary-savings-row">
        <i class="fa-solid fa-tags"></i>
        <span>¡Ahorro total ${savingsAmt}!</span>
      </div>
      <div class="summary-cta-row">
        <button class="btn btn-primary summary-btn">Proceder al pago</button>
      </div>`;
    } else {
      footerHtml = `
      <div class="summary-divider"></div>
      <div class="summary-cta-row">
        <button class="btn btn-primary summary-btn">Proceder al pago</button>
      </div>`;
    }
  }

  const boxClasses = [
    "summary-box with-overlap",
    isCompact ? "summary-box-compact" : "",
    isNarrow ? "summary-box-narrow" : "",
    isSaving && !isBill ? "summary-box-saving" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <div class="${boxClasses}" data-flow="${flow}" data-step="${step}">
      ${buildOverlay(exchangeRate)}
      <div class="summary-card">
        <div class="summary-card-body">${bodyHtml}
        </div>${footerHtml}
      </div>
    </div>`;
}

/* ── Playground ──────────────────────────────────────── */

export const Playground = {
  name: "Playground",
  args: {
    flow: "giftCards",
    step: "cart",
    pricing: "saving",
    showAddButton: true,
    withVoucherify: false,
    exchangeRate: "Q 7.55",
    productLabel: "Producto, Gift Card",
    productCount: 3,
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">
        SummaryBox / flow=${args.flow} / step=${args.step} · ID .pen: 6959:56843
      </div>
      ${buildSummaryBox(args)}
    </div>`,
};

/* ── Variant Matrix ──────────────────────────────────── */

export const VariantMatrix = {
  name: "Variant Matrix — Reference",
  render: () => `
    <div class="mars-story" style="min-width:720px">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Summary Box — Variantes principales</h3>
      <p class="mars-subtitle">Pen: 6959:56843 · 3 flows × 4 steps · saving + voucherify</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px;align-items:start">

        <div class="story-card">
          <div class="mars-label">products / pdp — saving / add=yes</div>
          ${buildSummaryBox({ flow:"products", step:"pdp", pricing:"saving", showAddButton:true, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:1 })}
        </div>

        <div class="story-card">
          <div class="mars-label">products / pdp — normal / add=no</div>
          ${buildSummaryBox({ flow:"products", step:"pdp", pricing:"normal", showAddButton:false, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:1 })}
        </div>

        <div class="story-card">
          <div class="mars-label">giftCards / plp — saving / voucherify=yes</div>
          ${buildSummaryBox({ flow:"giftCards", step:"plp", pricing:"saving", showAddButton:true, withVoucherify:true, exchangeRate:"Q 7.55", productLabel:"Producto, Gift Card", productCount:3 })}
        </div>

        <div class="story-card">
          <div class="mars-label">products / cart — saving / voucherify=no</div>
          ${buildSummaryBox({ flow:"products", step:"cart", pricing:"saving", showAddButton:false, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:3 })}
        </div>

        <div class="story-card">
          <div class="mars-label">products / checkout — saving / voucherify=yes</div>
          ${buildSummaryBox({ flow:"products", step:"checkout", pricing:"saving", showAddButton:false, withVoucherify:true, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:3 })}
        </div>

        <div class="story-card">
          <div class="mars-label">giftCards / cart — saving / voucherify=no</div>
          ${buildSummaryBox({ flow:"giftCards", step:"cart", pricing:"saving", showAddButton:false, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto, Gift Card", productCount:3 })}
        </div>

        <div class="story-card">
          <div class="mars-label">billPayments / checkout — servicios</div>
          ${buildSummaryBox({ flow:"billPayments", step:"checkout", pricing:"normal", showAddButton:false, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:1 })}
        </div>

        <div class="story-card">
          <div class="mars-label">billPayments / pdp — servicios</div>
          ${buildSummaryBox({ flow:"billPayments", step:"pdp", pricing:"normal", showAddButton:false, withVoucherify:false, exchangeRate:"Q 7.55", productLabel:"Producto", productCount:1 })}
        </div>

      </div>
    </div>`,
};
