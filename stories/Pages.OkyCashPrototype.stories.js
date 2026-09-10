/* ─────────────────────────────────────────────────────────
   Pages / OKY Cash / Prototype
   Flujo end-to-end clickable: Home → PDP → Cart → Checkout →
   Payment Methods → Success → Purchases → Wallet.

   Ver stories/_shared/okyCashPrototype.js para la nota completa
   sobre el bloqueo de Figma (MCP desconectado) y los supuestos
   de contenido marcados como "SUPUESTO".
───────────────────────────────────────────────────────── */

import { mountOkyCashPrototype } from "./_shared/okyCashPrototype";

function renderPrototype(userType, scenario) {
  const wrapper = document.createElement("div");
  wrapper.className = "mars-story";

  const label = document.createElement("div");
  label.className = "mars-label";
  label.textContent = `OKY Cash Prototype · ${userType === "returning" ? "Returning user" : "First-time user"}`;

  const note = document.createElement("div");
  note.className = "mars-label";
  note.style.marginBottom = "14px";
  note.style.color = "var(--text-secondary)";
  note.style.maxWidth = "600px";
  note.innerHTML = scenario;

  const stage = document.createElement("div");
  stage.style.display = "flex";
  stage.style.justifyContent = "center";
  stage.style.padding = "12px 0";

  wrapper.append(label, note, stage);
  mountOkyCashPrototype(stage, { userType });

  return wrapper;
}

export default {
  title: "Pages/OKY Cash/Prototype",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Prototipo **clickable y funcional** del flujo de OKY Cash / Cashback, de punta a punta: " +
          "Home → PDP (Lyft/Nike) → Cart → Checkout → aplicar OKY Cash → Payment Methods → Success → " +
          "Purchases → Wallet. Todo el estado (saldo, carrito, monto aplicado, compras) vive en memoria " +
          "dentro de `_shared/okyCashPrototype.js` — no hay backend, ni React, ni Figma bridge: es HTML " +
          "generado por template strings + un único listener con delegación de eventos, el mismo patrón " +
          "que ya usa `Pages/Checkout`. " +
          "**Bloqueo conocido:** el MCP de Figma se desconectó durante la construcción y no se pudo leer " +
          "ningún frame de `7600 - UX Exploration`. El prototipo se construyó reutilizando componentes " +
          "y tokens ya existentes en este Storybook (Payment Card, History Card, Super Ribbon, Saving Bar, " +
          "Modal, el patrón `.payment-method-input` de `checkout-page.html`); los puntos donde tuve que " +
          "inventar contenido (copy de onboarding, el modal de returning-user, el arte de Lyft) están " +
          "marcados como `SUPUESTO` en el código fuente para validarlos contra el Figma real.",
      },
    },
  },
};

export const FirstTimeUser = {
  name: "Scenario A/B — First-time User",
  render: () =>
    renderPrototype(
      "first-time",
      "Home → Lyft → Add to cart → Checkout → Apply OKY Cash → Payment Methods (editar monto) → Pay → Success → Purchases. " +
        "También: Home → Nike → cambia el monto con los chips y observa el Super Ribbon + Saving Bar cambiar de tier en vivo.",
    ),
};

export const ReturningUser = {
  name: "Scenario E — Returning User",
  render: () =>
    renderPrototype(
      "returning",
      "Arranca con una compra previa de Lyft ya en Purchases y saldo OKY Cash acumulado. No muestra el banner de " +
        "onboarding first-time. Entra a Wallet (nav inferior) para ver el modal de confirmación de returning-user.",
    ),
};

export const WalletDirect = {
  name: "Scenario C — Wallet (Lyft/Nike detail)",
  parameters: {
    docs: {
      description: {
        story: "Mismo prototipo first-time, útil para ir directo a Wallet → Lyft/Nike sin repetir el flujo de compra.",
      },
    },
  },
  render: () => renderPrototype("first-time", "Toca Wallet en el nav inferior, luego Lyft o Nike para ver su detalle."),
};
