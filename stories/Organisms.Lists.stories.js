/**
 * Lists — DS-MARS v2
 * List / PLP  · dsvtw  · 360px · product listing with Add chips
 * List / Cart · Om56O  · 307px · cart items with qty+delete chip
 */

/* ── Chip helpers (FA icons, matches .pen) ──────────────── */
function chipAdd0() {
  return `
    <span class="chip-ds chip-ds-add0 chip-ds-shadow list-plp-action list-plp-chip-add0">
      <i class="fa-regular fa-plus"></i>
    </span>`;
}

function chipAdd1(qty) {
  return `
    <span class="chip-ds chip-ds-add1 chip-ds-shadow list-plp-action list-plp-chip-add1">
      <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
      <span class="chip-ds-number">${qty}</span>
      <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
    </span>`;
}

function chipAdd2(qty) {
  return `
    <span class="chip-ds chip-ds-add2 chip-ds-shadow list-plp-action list-plp-chip-add1">
      <i class="fa-regular fa-minus chip-ds-pill-icon chip-ds-trash"></i>
      <span class="chip-ds-number">${qty}</span>
      <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
    </span>`;
}

function chipQty(qty) {
  return `
    <span class="chip-ds chip-ds-qty chip-ds-shadow list-cart-qty">
      <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
      <span class="chip-ds-number">${qty}</span>
    </span>`;
}

/* ── Row builders ────────────────────────────────────────── */
function plpRow({ photo, name, price, was, discount, chip, divider = true }) {
  return `
    <div class="list-plp-row">
      <div class="list-plp-image">
        <img src="${photo}" alt="${name}">
      </div>
      <div class="list-plp-copy">
        <div class="token-product-text-plp">${name}</div>
        <div class="list-plp-prices">
          <span class="token-price-tag token-price-tag-plp">${price}</span>
          <span class="token-price token-price-plp">${was}</span>
        </div>
        ${discount ? `
        <div class="discount-ribbon discount-ribbon-list">
          <span class="discount-ribbon-text token-price-percent">${discount}</span>
        </div>` : ""}
      </div>
      ${chip}
    </div>
    ${divider ? '<div class="list-plp-divider"></div>' : ""}`;
}

function cartRow({ photo, name, price, was, discount, chip, divider = true }) {
  return `
    <div class="list-cart-row">
      <div class="list-cart-image">
        <img src="${photo}" alt="${name}">
      </div>
      <div class="list-cart-copy">
        <div class="token-product-text-cart">${name}</div>
        <div class="list-cart-prices">
          <span class="token-price-tag token-price-tag-cart">${price}</span>
          <span class="token-price token-price-cart">${was}</span>
        </div>
        ${discount ? `
        <div class="discount-ribbon discount-ribbon-list">
          <span class="discount-ribbon-text token-price-percent">${discount}</span>
        </div>` : ""}
      </div>
      ${chip}
    </div>
    ${divider ? '<div class="list-cart-divider"></div>' : ""}`;
}

/* ── Product data ─────────────────────────────────────────── */
const plpData = [
  { photo: "combo.webp",          name: "Combo Celebración",               price: "$40.00", was: "$50.00" },
  { photo: "nuggets.webp",        name: "McCombo de McNuggets de Pollo",   price: "$20.00", was: "$25.00" },
  { photo: "chicken-burger.png",  name: "Hamburguesa de Pollo",            price: "$20.00", was: "$25.00" },
];

const cartData = [
  { photo: "target.webp",  name: "eGift Card de Target",   price: "$40.00", was: "$50.00" },
  { photo: "macys.webp",   name: "eGift Card de Macy's",   price: "$20.00", was: "$25.00" },
  { photo: "apple.webp",   name: "eGift Card de Apple",    price: "$20.00", was: "$25.00" },
];

/* ── Story config ─────────────────────────────────────────── */
export default {
  title: "Organisms/Lists",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Listas de producto verticales del DS-MARS. " +
          "**List / PLP** (`dsvtw` · 360px) — rows con foto 100×100, precio, Discount Ribbon y chips Add0/Add1/Add2. " +
          "**List / Cart** (`Om56O` · 307px) — card con borde, foto 80×51, precio, Discount Ribbon y chip de cantidad.",
      },
    },
  },
};

/* ── List / PLP — Playground ──────────────────────────────── */
export const PLPPlayground = {
  name: "List / PLP — Playground",
  args: {
    item2chip: "Add1",
    showDiscount: true,
    discount: "10% OFF",
  },
  argTypes: {
    item2chip: {
      name: "Item 2 — chip",
      control: "inline-radio",
      options: ["Add0", "Add1", "Add2"],
      description: "Estado del chip de cantidad del segundo producto.",
    },
    showDiscount: {
      name: "Mostrar Discount Ribbon",
      control: "boolean",
    },
    discount: {
      name: "Texto del descuento",
      control: "text",
    },
  },
  render: ({ item2chip, showDiscount, discount }) => {
    const d = showDiscount ? discount : null;
    const chipMap = { Add0: chipAdd0(), Add1: chipAdd1(1), Add2: chipAdd2(2) };

    const rows =
      plpRow({ ...plpData[0], discount: d, chip: chipAdd0() }) +
      plpRow({ ...plpData[1], discount: d, chip: chipMap[item2chip] }) +
      plpRow({ ...plpData[2], discount: d, chip: chipAdd0(), divider: false });

    return `
      <div class="mars-story">
        <div class="mars-label">List / PLP · ID .pen: dsvtw</div>
        <div class="list-plp-anatomy">
          <div class="list-plp-inner">${rows}</div>
        </div>
      </div>`;
  },
};

/* ── List / Cart — Playground ─────────────────────────────── */
export const CartPlayground = {
  name: "List / Cart — Playground",
  args: {
    qty1: 1,
    qty2: 1,
    qty3: 2,
    showDiscount: true,
    discount: "10% OFF",
  },
  argTypes: {
    qty1: { name: "Item 1 — qty", control: { type: "number", min: 1, max: 99 } },
    qty2: { name: "Item 2 — qty", control: { type: "number", min: 1, max: 99 } },
    qty3: { name: "Item 3 — qty", control: { type: "number", min: 1, max: 99 } },
    showDiscount: {
      name: "Mostrar Discount Ribbon",
      control: "boolean",
    },
    discount: {
      name: "Texto del descuento",
      control: "text",
    },
  },
  render: ({ qty1, qty2, qty3, showDiscount, discount }) => {
    const d = showDiscount ? discount : null;

    const rows =
      cartRow({ ...cartData[0], discount: d, chip: chipQty(qty1) }) +
      cartRow({ ...cartData[1], discount: d, chip: chipQty(qty2) }) +
      cartRow({ ...cartData[2], discount: d, chip: chipQty(qty3), divider: false });

    return `
      <div class="mars-story">
        <div class="mars-label">List / Cart · ID .pen: Om56O</div>
        <div class="list-cart-anatomy">
          <div class="list-cart-inner">${rows}</div>
        </div>
      </div>`;
  },
};

/* ── Both Lists — Reference ───────────────────────────────── */
export const AllLists = {
  name: "Both Lists — Reference",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Referencia visual side-by-side de ambas listas con datos de ejemplo y Discount Ribbon visible.",
      },
    },
  },
  render: () => {
    const plpRows =
      plpRow({ ...plpData[0], discount: "10% OFF", chip: chipAdd0() }) +
      plpRow({ ...plpData[1], discount: "20% OFF", chip: chipAdd1(1) }) +
      plpRow({ ...plpData[2], discount: "10% OFF", chip: chipAdd0(), divider: false });

    const cartRows =
      cartRow({ ...cartData[0], discount: "10% OFF", chip: chipQty(1) }) +
      cartRow({ ...cartData[1], discount: "20% OFF", chip: chipQty(2) }) +
      cartRow({ ...cartData[2], discount: "10% OFF", chip: chipQty(1), divider: false });

    return `
      <div class="mars-story">
        <div style="display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start;">

          <div>
            <div class="mars-label" style="margin-bottom:8px">List / PLP · dsvtw · 360px</div>
            <div class="list-plp-anatomy">
              <div class="list-plp-inner">${plpRows}</div>
            </div>
          </div>

          <div>
            <div class="mars-label" style="margin-bottom:8px">List / Cart · Om56O · 307px</div>
            <div class="list-cart-anatomy">
              <div class="list-cart-inner">${cartRows}</div>
            </div>
          </div>

        </div>
      </div>`;
  },
};
