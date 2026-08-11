/* ─────────────────────────────────────────────────────────
   Payment Reminder Modal — modal CENTRADO/flotante (a diferencia de
   `Molecules/Modal`, que es siempre bottom-sheet). Blanco, bordes
   redondeados en las 4 esquinas, con scrim. Comunica que hay un saldo
   pendiente por pagar: tienda + fecha de vencimiento, monto total, y
   un desglose "matemático" (chips de color + operadores) inspirado en
   la barra de referencia adjunta por el usuario (Pendiente a fecha de
   corte + Pendiente adicional = Total a pagar), adaptado a una
   columna angosta de mobile en vez de una fila ancha de desktop.

   Nota: sin acceso a Figma (nodo 94691:23849) al momento de construir
   esto — se diseñó reutilizando tokens/colores/tipografías ya
   existentes en mars.css (--primary-main, --error-main,
   --warning-main, --border-main, --back-drop, Lato) y el mismo patrón
   de stage/backdrop que usa Molecules/Modal.
───────────────────────────────────────────────────────── */

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMathTerm({ modifier, label, amount }) {
  return `
    <div class="payment-modal-math-term ${modifier}">
      <span class="payment-modal-math-label">${escapeHtml(label)}</span>
      <span class="payment-modal-math-amount">${escapeHtml(amount)}</span>
    </div>
  `;
}

function renderPaymentReminderModal(args = {}) {
  const {
    storeName = "Tigo",
    storeLogo = "./images/tigo.webp",
    dueDate = "Vence el 15 de agosto",
    pendingAtCutoff = "$657",
    pendingAdditional = "$235",
    totalDue = "$892",
    primaryCta = "Pagar ahora",
    secondaryCta = "Recordarme después",
  } = args;

  return `
    <div class="modal-molecule-stage">
      <div class="modal-molecule-backdrop"></div>

      <section class="payment-modal" aria-label="Recordatorio de pago">
        <button class="payment-modal-close" type="button" aria-label="Cerrar">
          <i class="fa-light fa-xmark" aria-hidden="true"></i>
        </button>

        <div class="payment-modal-icon" aria-hidden="true">
          <i class="fa-light fa-calendar-exclamation"></i>
        </div>

        <h3 class="payment-modal-title">Es hora de pagar</h3>

        <div class="payment-modal-store">
          <span class="payment-modal-store-logo">
            <img src="${escapeHtml(storeLogo)}" alt="" />
          </span>
          <span class="payment-modal-store-copy">
            <span class="payment-modal-store-name">${escapeHtml(storeName)}</span>
            <span class="payment-modal-store-date">${escapeHtml(dueDate)}</span>
          </span>
        </div>

        <div class="payment-modal-balance">
          <span class="payment-modal-balance-label">Saldo pendiente</span>
          <span class="payment-modal-balance-amount">${escapeHtml(totalDue)}</span>
        </div>

        <div class="payment-modal-math" aria-label="Desglose del saldo pendiente">
          ${renderMathTerm({ modifier: "is-corte", label: "Pendiente a fecha de corte", amount: pendingAtCutoff })}
          <span class="payment-modal-math-operator" aria-hidden="true">+</span>
          ${renderMathTerm({ modifier: "is-adicional", label: "Pendiente adicional", amount: pendingAdditional })}
          <span class="payment-modal-math-operator is-equals" aria-hidden="true">=</span>
          ${renderMathTerm({ modifier: "is-total", label: "Total a pagar", amount: totalDue })}
        </div>

        <div class="payment-modal-actions">
          <button class="btn btn-primary btn-large" type="button">${escapeHtml(primaryCta)}</button>
          <button class="payment-modal-secondary" type="button">${escapeHtml(secondaryCta)}</button>
        </div>
      </section>
    </div>
  `;
}

export default {
  title: "Molecules/Payment Reminder Modal",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal **centrado** (no bottom-sheet) que avisa al usuario que tiene un saldo pendiente por pagar. " +
          "Blanco, bordes redondeados en las 4 esquinas, con scrim de fondo — reutiliza `--back-drop`, " +
          "`--primary-main`, `--border-main` y tokens semánticos (`--error-main`/`--warning-main`) ya existentes " +
          "en el sistema. Incluye tienda + fecha de vencimiento, el monto total, y un desglose tipo \"suma\" " +
          "(Pendiente a fecha de corte + Pendiente adicional = Total a pagar) inspirado en la barra de referencia " +
          "de Cupo Asignado, adaptado a una columna angosta de mobile.",
      },
    },
  },
  argTypes: {
    storeName: { control: "text", description: "Nombre de la tienda/marca." },
    dueDate: { control: "text", description: "Texto de fecha de vencimiento." },
    pendingAtCutoff: { control: "text", description: "Monto pendiente a la fecha de corte." },
    pendingAdditional: { control: "text", description: "Monto pendiente adicional (posterior al corte)." },
    totalDue: { control: "text", description: "Total a pagar (= suma de los dos anteriores)." },
    primaryCta: { control: "text", description: "Texto del botón primario." },
    secondaryCta: { control: "text", description: "Texto del link secundario." },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    storeName: "Tigo",
    dueDate: "Vence el 15 de agosto",
    pendingAtCutoff: "$657",
    pendingAdditional: "$235",
    totalDue: "$892",
    primaryCta: "Pagar ahora",
    secondaryCta: "Recordarme después",
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Payment Reminder Modal · Centrado</div>
      <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">
        Modal flotante (no bottom-sheet): blanco, bordes redondeados en las 4 esquinas, con scrim. Diseñado con
        tokens del sistema ya existentes mientras se recupera el acceso a Figma (nodo 94691:23849).
      </div>
      ${renderPaymentReminderModal(args)}
    </div>
  `,
};

export const Default = {
  name: "Default",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Payment Reminder Modal · Default</div>
      ${renderPaymentReminderModal({})}
    </div>
  `,
};
