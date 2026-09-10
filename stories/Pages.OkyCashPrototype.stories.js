/* ─────────────────────────────────────────────────────────
   Pages / OKY Cash / Prototype

   Flujo clickable end-to-end:
   Home → PDP → Producto agregado → Carrito → Checkout →
   Métodos de pago → Progress → Compra exitosa → Tus compras →
   Mi wallet → detalle de vale.

   Anatomía leída con el MCP de Figma sobre el canvas
   "Cash Back" (99101:20345) del archivo 7600 - UX Exploration.
   Los IDs de cada frame están anotados en
   stories/_shared/okyCashPrototype.js.
───────────────────────────────────────────────────────── */

import { mountOkyCashPrototype } from "./_shared/okyCashPrototype";

function renderPrototype(userType, steps) {
  const wrapper = document.createElement("div");
  wrapper.className = "mars-story";

  const label = document.createElement("div");
  label.className = "mars-label";
  label.textContent = userType === "returning" ? "Returning user" : "First-time user";

  const note = document.createElement("div");
  note.className = "mars-label";
  note.style.cssText = "margin-bottom:14px;color:var(--text-secondary);max-width:620px;font-weight:400";
  note.innerHTML = steps;

  const stage = document.createElement("div");
  stage.style.cssText = "display:flex;justify-content:center;padding:12px 0";

  wrapper.append(label, note, stage);
  mountOkyCashPrototype(stage, { userType });

  return wrapper;
}

export default {
  title: "Pages/OKY Cash/Prototype",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "Prototipo **clickable y funcional** del flujo de OKY Cash / Cashback. Todo el estado " +
            "(saldo, carrito, monto aplicado, compras, cashback ganado) vive en memoria dentro de " +
            "`_shared/okyCashPrototype.js`: HTML por template strings + un solo listener con delegación " +
            "de eventos, el mismo patrón de `Pages/Checkout`. Sin backend, sin React.",
          "**Reglas del diseño que implementa**",
          "· El monto del PDP se escribe en el `input-dinamic` con label flotante `Desde 10 hasta 1,000`. " +
            "No hay chips ni slider — eso es del PDP de telco.",
          "· Tier de cashback: **≤ $50 → 5% aqua** · **$50–$200 → 20% naranja** · **> $200 → 5% aqua**. " +
            "Cambia en vivo el ribbon del Middle Card y el Saving Bar mientras se teclea (Nike arranca en $200).",
          "· El cashback **nunca se suma al summary de precio**: vive solo en el ribbon y el Saving Bar.",
          "· El OKY Cash se aplica con un **checkbox** dentro de la fila agrupada de método de pago; es " +
            "*split payment* — el chip morado es lo que va a la tarjeta y el teal lo que sale del saldo.",
          "· En **Métodos de pago** el monto se modifica con el slider teal, con la leyenda " +
            "`$X de $Y · Guardas $Z para después`, y el saldo de la Payment Card se recalcula en vivo.",
          "· `Onboarding Contactos` es una **pantalla morada a pantalla completa**, no un modal.",
          "**Componentes reutilizados** — `middle-card-*`, `brand-item-atom`, `brand-carrousel-organism`, " +
            "`summary-box`, `discount-ribbon`, `saving-bar`, `dual-molecule`, `plateu-molecule`, " +
            "`input-dinamic`, `bottom-nav`, `btn`, y el molecule **Payment Card** (variantes Visa y OKY Cash Black) " +
            "importado directo de `_shared/paymentCards.js`.",
        ].join("\n\n"),
      },
    },
  },
};

export const FirstTimeUser = {
  name: "Scenario A — Primera compra completa",
  render: () =>
    renderPrototype(
      "first-time",
      "<strong>Home → Lyft → Agregar → Ver carrito → Ir a pagar → marca OKY Cash → Comprar → Compra exitosa → Tus compras.</strong> " +
        "Arranca con $20.00 de saldo; al terminar el saldo baja por lo usado y sube por el cashback ganado.",
    ),
};

export const CashbackTiers = {
  name: "Scenario B — Tiers de cashback (Nike)",
  render: () =>
    renderPrototype(
      "first-time",
      "<strong>Home → Nike</strong> y edita el monto en el campo. En <strong>$200</strong> el ribbon dice <em>Ganas 20%</em> " +
        "en naranja y el Saving Bar se pone naranja; en <strong>$201</strong> ambos vuelven a aqua con <em>Ganas 5%</em>; " +
        "en <strong>$50</strong> o menos también aqua al 5%.",
    ),
};

export const ModifyOkyCash = {
  name: "Scenario D — Modificar el monto de OKY Cash",
  render: () =>
    renderPrototype(
      "returning",
      "En Checkout toca los <strong>tres puntos</strong> de la fila de OKY Cash para abrir <strong>Métodos de pago</strong> " +
        "y mueve el slider teal: cambian el chip morado de la tarjeta, el chip teal, la leyenda de lo que guardas " +
        "y el saldo impreso en la Payment Card negra.",
    ),
};

export const Wallet = {
  name: "Scenario C — Mi wallet",
  render: () =>
    renderPrototype(
      "first-time",
      "Toca <strong>OKY Cash</strong> en el nav inferior para ver Mi wallet: la Payment Card con el saldo, los filtros " +
        "del plateu y los vales apilados a -90px con su badge de cantidad + QR. Lyft y Nike abren su detalle.",
    ),
};

export const ReturningUser = {
  name: "Scenario E — Usuario que regresa",
  render: () =>
    renderPrototype(
      "returning",
      "Arranca con $56.00 de saldo y una compra previa de Lyft. Al entrar a <strong>Mi wallet</strong> aparece la pantalla " +
        "morada <em>¿Es para ti o para alguien más?</em> (Onboarding Contactos, 99140:47037) antes del wallet.",
    ),
};
