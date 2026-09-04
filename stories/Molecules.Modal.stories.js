const MODAL_VARIANTS = ["Large", "Medium", "Small", "Important", "Centered"];

const MODAL_META = {
  Large: {
    nodeId: "6434:33193",
    title: "Alcanza para",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
    badgeValue: "4",
    badgeLabel: "personas",
  },
  Medium: {
    nodeId: "7391:141249",
    title: "¿Para quién es?",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
    searchLabel: "Buscar otro contacto",
  },
  Small: {
    nodeId: "7391:141032",
    title: "Ingresa el código enviado",
    codePlaceholder: "Código de 4 dígitos",
    primaryCta: "Siguiente",
    secondaryCta: "No lo recibí",
  },
  Important: {
    nodeId: "7391:141742",
    title: "Title goes here",
    subtitle: "Description Text",
    primaryCta: "Primary CTA",
    secondaryCta: "Secondary CTA",
  },
  Centered: {
    nodeId: "99140:45084",
    title: "Solicitud de pago",
    subtitle: "",
    primaryCta: "Aprobar Pago",
    secondaryCta: "Rechazar",
    amountCurrency: "Q",
    amountValue: "380.00",
  },
};

/* Filas de detalle de la variante Centered (Yayo Flow).
   Reutilizan el átomo `icon-avatar` y el logo `logo-yayo.png`. */
const CENTERED_DETAILS = [
  {
    icon: "fa-light fa-store",
    title: "Tienda Don Juan",
    note: "ID: TP-4784",
    logo: "logo-yayo.png",
    logoAlt: "Yayo",
  },
  {
    icon: "fa-light fa-calendar",
    title: "24 / AGO / 2026&nbsp; -&nbsp; 13:15 hrs",
    note: "",
    logo: "",
    logoAlt: "",
  },
];

const CENTERED_COUNTDOWN = { label: "La solicitud vence en", value: "14:32" };

const LARGE_ITEMS = [
  "4 Papas medianas",
  "4 Sodas 16oz",
  "1 Chicken Nuggets de 10 piezas",
  "1 Big Mac",
  "1 Cuarto de Libra",
  "1 McNífica",
];

const LARGE_APPLIES = [
  { icon: "fa-light fa-motorcycle", label: "A domicilio" },
  { icon: "fa-light fa-store", label: "Retiro en tienda" },
  { icon: "fa-light fa-bag-shopping", label: "Para llevar" },
  { icon: "fa-light fa-utensils", label: "Comer aquí" },
];

const LARGE_NOT_APPLIES = [
  { icon: "fa-light fa-car", label: "Auto servicio" },
  { icon: "fa-light fa-mobile-screen-button", label: "Pedidos Online" },
];

const LARGE_TERMS = [
  "Los vales se canjean por servicios que tienen sus propias condiciones.",
  "Aplican restricciones por disponibilidad, horarios y tienda participante.",
];

const CONTACTS = [
  { initials: "A13", name: "Adre", phone: "+502 5634-1213", checked: true, starred: true },
  { initials: "Y54", name: "YEYO", phone: "+502 6578-4754", checked: false, starred: false },
  { initials: "D45", name: "Daniel", phone: "+502 6547-8745", checked: false, starred: false },
];

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveModalArgs(args = {}) {
  const variant = MODAL_VARIANTS.includes(args.variant) ? args.variant : "Large";
  const base = MODAL_META[variant];

  return {
    variant,
    ...base,
    title: typeof args.title === "string" && args.title.trim() ? args.title.trim() : base.title,
    subtitle: typeof args.subtitle === "string" ? args.subtitle.trim() : base.subtitle || "",
    primaryCta: typeof args.primaryCta === "string" && args.primaryCta.trim() ? args.primaryCta.trim() : base.primaryCta || "",
    secondaryCta:
      typeof args.secondaryCta === "string" && args.secondaryCta.trim() ? args.secondaryCta.trim() : base.secondaryCta || "",
    badgeValue:
      typeof args.badgeValue === "string" && args.badgeValue.trim() ? args.badgeValue.trim() : base.badgeValue || "",
    badgeLabel:
      typeof args.badgeLabel === "string" && args.badgeLabel.trim() ? args.badgeLabel.trim() : base.badgeLabel || "",
    searchLabel:
      typeof args.searchLabel === "string" && args.searchLabel.trim() ? args.searchLabel.trim() : base.searchLabel || "",
    codePlaceholder:
      typeof args.codePlaceholder === "string" && args.codePlaceholder.trim()
        ? args.codePlaceholder.trim()
        : base.codePlaceholder || "",
    amountCurrency:
      typeof args.amountCurrency === "string" && args.amountCurrency.trim()
        ? args.amountCurrency.trim()
        : base.amountCurrency || "Q",
    amountValue:
      typeof args.amountValue === "string" && args.amountValue.trim()
        ? args.amountValue.trim()
        : base.amountValue || "",
  };
}

function renderCloseButton(inverted = false) {
  return `
    <button class="header-icon modal-sheet-close ${inverted ? "is-inverted" : ""}" type="button" aria-label="Cerrar">
      <span class="fa-icon fa-icon-lg" aria-hidden="true">
        <i class="fa-light fa-times"></i>
      </span>
    </button>
  `;
}

function renderLargeModal(modal) {
  return `
    <section class="modal-sheet is-large" aria-label="Large Modal" data-figma-node="${modal.nodeId}">
      <div class="modal-sheet-header">
        <div class="modal-sheet-header-main">
          <div class="modal-sheet-title-row">
            <h3 class="modal-sheet-title is-regular">${escapeHtml(modal.title)}</h3>
            <span class="modal-sheet-badge">${escapeHtml(modal.badgeValue)}</span>
            <span class="modal-sheet-badge-label">${escapeHtml(modal.badgeLabel)}</span>
          </div>
        </div>
        ${renderCloseButton(false)}
      </div>

      <div class="modal-sheet-scroll">
        <div class="modal-large-body">
          <ul class="modal-bullet-list">
            ${LARGE_ITEMS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>

          <div class="modal-large-eligibility">
            <div class="modal-large-eligibility-column">
              <p class="modal-large-section-title">Aplica para:</p>
              <div class="modal-large-icon-grid">
                ${LARGE_APPLIES.map(
                  (item) => `
                    <div class="modal-large-icon-card">
                      <span class="modal-large-icon-wrap" aria-hidden="true">
                        <i class="${item.icon}"></i>
                      </span>
                      <span class="modal-large-icon-label">${escapeHtml(item.label)}</span>
                    </div>
                  `,
                ).join("")}
              </div>
            </div>

            <div class="modal-large-eligibility-column is-muted">
              <p class="modal-large-section-title">No aplica para:</p>
              <div class="modal-large-icon-grid">
                ${LARGE_NOT_APPLIES.map(
                  (item) => `
                    <div class="modal-large-icon-card">
                      <span class="modal-large-icon-wrap is-muted" aria-hidden="true">
                        <i class="${item.icon}"></i>
                        <i class="fa-light fa-ban modal-large-icon-ban"></i>
                      </span>
                      <span class="modal-large-icon-label is-muted">${escapeHtml(item.label)}</span>
                    </div>
                  `,
                ).join("")}
              </div>
            </div>
          </div>

          <div class="modal-large-terms">
            <p class="modal-large-section-title">Términos y condiciones</p>
            <ul class="modal-bullet-list">
              ${LARGE_TERMS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMediumContact(contact, index) {
  const inputId = `modal-contact-${index}`;
  return `
    <div class="modal-contact-row">
      <label class="radio-option" for="${inputId}">
        <input
          id="${inputId}"
          class="radio-native"
          type="radio"
          name="modal-contact"
          ${contact.checked ? "checked" : ""}
        />
        <span class="radio-control" aria-hidden="true"></span>

        <span class="modal-contact-main">
          <span class="modal-contact-avatar" aria-hidden="true">${escapeHtml(contact.initials)}</span>
          <span class="modal-contact-copy">
            <span class="modal-contact-name">${escapeHtml(contact.name)}</span>
            <span class="modal-contact-phone">${escapeHtml(contact.phone)}</span>
          </span>
        </span>
      </label>

      <span class="modal-contact-star ${contact.starred ? "is-active" : ""}" aria-hidden="true">
        <i class="${contact.starred ? "fa-solid" : "fa-light"} fa-star"></i>
      </span>
      <button type="button" class="radio-dots" aria-label="Más acciones">
        <i class="fa-light fa-ellipsis-vertical" aria-hidden="true"></i>
      </button>
    </div>
  `;
}

function renderMediumModal(modal) {
  return `
    <section class="modal-sheet is-medium" aria-label="Medium Modal" data-figma-node="${modal.nodeId}">
      <div class="modal-sheet-header">
        <div class="modal-sheet-header-main">
          <h3 class="modal-sheet-title">${escapeHtml(modal.title)}</h3>
        </div>
        ${renderCloseButton(false)}
      </div>

      <div class="modal-medium-body">
        <div class="modal-contact-list">
          ${CONTACTS.map((contact, index) => renderMediumContact(contact, index)).join("")}
        </div>

        <div class="modal-medium-footer">
          <button class="btn btn-outlined btn-large" type="button">
            <i class="fa-regular fa-magnifying-glass" aria-hidden="true"></i>
            <span>${escapeHtml(modal.searchLabel)}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderSmallModal(modal) {
  return `
    <section class="modal-sheet is-small" aria-label="Small Modal" data-figma-node="${modal.nodeId}">
      <div class="modal-sheet-header">
        <div class="modal-sheet-header-main">
          <h3 class="modal-sheet-title is-regular">${escapeHtml(modal.title)}</h3>
        </div>
        ${renderCloseButton(false)}
      </div>

      <div class="modal-small-body">
        <div class="modal-small-content">
          <div class="modal-small-pill">${escapeHtml(modal.codePlaceholder)}</div>
        </div>

        <div class="modal-small-footer">
          <button class="btn btn-outlined btn-large" type="button">${escapeHtml(modal.secondaryCta)}</button>
          <button class="btn btn-primary btn-large" type="button">${escapeHtml(modal.primaryCta)}</button>
        </div>
      </div>
    </section>
  `;
}

function renderImportantModal(modal) {
  return `
    <section class="modal-sheet is-important" aria-label="Important Modal" data-figma-node="${modal.nodeId}">
      <div class="modal-important-inner">
        <div class="modal-important-topbar">
          ${renderCloseButton(true)}
        </div>

        <div class="modal-important-copy">
          <h3 class="modal-important-title">${escapeHtml(modal.title)}</h3>
          <p class="modal-important-description">${escapeHtml(modal.subtitle)}</p>
        </div>

        <div class="modal-important-hero">
          <div class="modal-important-hero-stage" aria-hidden="true">
            <span class="modal-important-hero-ring is-outer"></span>
            <span class="modal-important-hero-ring is-inner"></span>
            <img class="modal-important-hero-image" src="modal-important-20off.png" alt="" />
          </div>
        </div>

        <div class="modal-important-actions">
          <button class="btn btn-secondary btn-large modal-important-primary" type="button">
            ${escapeHtml(modal.primaryCta)}
          </button>
          <button class="modal-important-secondary" type="button">${escapeHtml(modal.secondaryCta)}</button>
        </div>
      </div>
    </section>
  `;
}

/* Variante Centered — Figma 99140:45084.
   Reutiliza: modal-sheet-header / modal-sheet-title / modal-sheet-close,
   los átomos amount-summary + amount-display + icon-avatar + action-circle,
   y el Super Ribbon `super-ribbon-type-vence` en su forma adosada. */
function renderCenteredModal(modal) {
  return `
    <section class="modal-sheet is-centered" aria-label="Payment Request Modal" data-figma-node="${modal.nodeId}">
      <div class="modal-centered-body">
        <div class="modal-sheet-header">
          <div class="modal-sheet-header-main">
            <h3 class="modal-sheet-title is-regular">${escapeHtml(modal.title)}</h3>
          </div>
          <button class="header-icon modal-sheet-close" type="button" aria-label="Cerrar">
            <span class="fa-icon fa-icon-lg" aria-hidden="true">
              <i class="fa-light fa-chevron-down"></i>
            </span>
          </button>
        </div>

        <div class="amount-summary">
          <p class="amount-display is-hero">
            <span class="amount-display-currency">${escapeHtml(modal.amountCurrency)}</span>
            <span class="amount-display-value">${escapeHtml(modal.amountValue)}</span>
          </p>
        </div>

        <div class="modal-detail-list">
          <div class="modal-detail-rows">
            ${CENTERED_DETAILS.map(
              (row, index) => `
              ${index > 0 ? '<hr class="modal-detail-divider" />' : ""}
              <div class="modal-detail-row">
                <span class="icon-avatar is-small" aria-hidden="true">
                  <i class="${row.icon}"></i>
                </span>
                <div class="modal-detail-copy">
                  <p class="modal-detail-title">${row.title}</p>
                  ${row.note ? `<p class="modal-detail-note">${escapeHtml(row.note)}</p>` : ""}
                </div>
                ${
                  row.logo
                    ? `<span class="modal-detail-logo">
                        <img src="${row.logo}" alt="${escapeHtml(row.logoAlt)}" />
                      </span>`
                    : ""
                }
              </div>
            `,
            ).join("")}
          </div>

          <div class="super-ribbon super-ribbon-type-vence is-attached">
            <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
            <span class="super-ribbon-text super-ribbon-countdown">
              <span class="super-ribbon-countdown-label">${CENTERED_COUNTDOWN.label}</span>
              <span class="super-ribbon-countdown-value">${CENTERED_COUNTDOWN.value}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="modal-centered-actions">
        <div class="modal-centered-action">
          <button class="action-circle is-stacked is-large is-reject" type="button">
            <span class="action-circle-icon">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </span>
            <span class="action-circle-label">${escapeHtml(modal.secondaryCta)}</span>
          </button>
        </div>
        <div class="modal-centered-action">
          <button class="action-circle is-stacked is-large is-approve" type="button">
            <span class="action-circle-icon">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
            </span>
            <span class="action-circle-label">${escapeHtml(modal.primaryCta)}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderModalDemo(args = {}) {
  const modal = resolveModalArgs(args);

  const inner =
    modal.variant === "Large"
      ? renderLargeModal(modal)
      : modal.variant === "Medium"
        ? renderMediumModal(modal)
        : modal.variant === "Small"
          ? renderSmallModal(modal)
          : modal.variant === "Centered"
            ? renderCenteredModal(modal)
            : renderImportantModal(modal);

  const isCentered = modal.variant === "Centered";

  return `
    <div class="modal-molecule-stage${isCentered ? " is-centered" : ""}">
      <div class="modal-molecule-backdrop"></div>
      ${inner}
    </div>
  `;
}

export default {
  title: "Molecules/Modal",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molécula **Modal**. Las variantes **Large**, **Medium**, **Small** e **Important** emergen desde abajo " +
          "siguiendo el patrón mobile del sistema; **Centered** se ancla al centro vertical y horizontal de la pantalla. " +
          "Reutiliza tokens existentes como `--back-drop`, `--primary-main`, `--border-main`, y las clases de " +
          "`Buttons`, `Icons` y `Radio`. " +
          "**Centered** (Figma `99140:45084`, solicitud de pago del flujo Yayo) es la variante más compuesta: " +
          "reutiliza el header del modal (`modal-sheet-header` / `modal-sheet-title` / `modal-sheet-close`), " +
          "el átomo **Super Ribbon** en su type `vence` y forma adosada (`is-attached`), y cuatro átomos compartidos " +
          "con `History Card` y `Reminder Card`: **amount-summary**, **amount-display**, **icon-avatar** y " +
          "**action-circle**. Borde de `2px` en `--primary-base`, radio `24px`, ancho `335px`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: MODAL_VARIANTS,
      description: "Variante del modal según anatomía y contenido.",
    },
    title: {
      control: "text",
      description: "Título principal del modal.",
    },
    subtitle: {
      control: "text",
      description: "Descripción secundaria; aplica especialmente a `Important`.",
    },
    badgeValue: {
      control: "text",
      description: "Valor destacado del badge en `Large`.",
    },
    badgeLabel: {
      control: "text",
      description: "Label del badge en `Large`.",
    },
    searchLabel: {
      control: "text",
      description: "Texto del CTA inferior en `Medium`.",
    },
    codePlaceholder: {
      control: "text",
      description: "Texto del pill central en `Small`.",
    },
    primaryCta: {
      control: "text",
      description: "CTA primario de `Small` e `Important`.",
    },
    secondaryCta: {
      control: "text",
      description: "CTA secundario de `Small`, `Important` y `Centered` (label de rechazo).",
    },
    amountCurrency: {
      control: "text",
      description: "Símbolo de moneda del monto en `Centered`.",
    },
    amountValue: {
      control: "text",
      description: "Monto solicitado en `Centered`.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variant: "Large",
    title: MODAL_META.Large.title,
    subtitle: MODAL_META.Important.subtitle,
    badgeValue: MODAL_META.Large.badgeValue,
    badgeLabel: MODAL_META.Large.badgeLabel,
    searchLabel: MODAL_META.Medium.searchLabel,
    codePlaceholder: MODAL_META.Small.codePlaceholder,
    primaryCta: MODAL_META.Small.primaryCta,
    secondaryCta: MODAL_META.Small.secondaryCta,
  },
  render: (args) => {
    const modal = resolveModalArgs(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Modal · ${modal.variant} · Ref Figma: ${modal.nodeId}</div>
        <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">
          Bottom-up modal para flujos mobile, con scrim y CTA(s) según la variante.
        </div>
        ${renderModalDemo(args)}
      </div>
    `;
  },
};

export const VariantMatrix = {
  name: "Variant Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de las 4 variantes del modal en su contexto mobile con scrim.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="modal-story-grid">
        ${MODAL_VARIANTS.map((variant) => {
          const modal = MODAL_META[variant];
          return `
            <div class="modal-story-card">
              <div class="mars-label">${variant} · ${modal.nodeId}</div>
              ${renderModalDemo({
                variant,
                title: modal.title,
                subtitle: modal.subtitle,
                badgeValue: modal.badgeValue,
                badgeLabel: modal.badgeLabel,
                searchLabel: modal.searchLabel,
                codePlaceholder: modal.codePlaceholder,
                primaryCta: modal.primaryCta,
                secondaryCta: modal.secondaryCta,
              })}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `,
};

export const Large = {
  name: "Large",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Large · ${MODAL_META.Large.nodeId}</div>
      ${renderModalDemo({ variant: "Large" })}
    </div>
  `,
};

export const Medium = {
  name: "Medium",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Medium · ${MODAL_META.Medium.nodeId}</div>
      ${renderModalDemo({ variant: "Medium" })}
    </div>
  `,
};

export const Small = {
  name: "Small",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Small · ${MODAL_META.Small.nodeId}</div>
      ${renderModalDemo({ variant: "Small" })}
    </div>
  `,
};

export const Important = {
  name: "Important",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Important · ${MODAL_META.Important.nodeId}</div>
      ${renderModalDemo({ variant: "Important" })}
    </div>
  `,
};

export const Centered = {
  name: "Centered",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Solicitud de pago del flujo Yayo, centrada en pantalla. El countdown inferior es el átomo " +
          "**Super Ribbon** (`super-ribbon-type-vence is-attached`) con los tokens de soporte " +
          "`--warning-bg` / `--warning-text` / `--warning-main` / `--error-text`; las acciones son el átomo " +
          "**action-circle** en tamaño `is-large` y orientación `is-stacked`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Centered · ${MODAL_META.Centered.nodeId}</div>
      ${renderModalDemo({ variant: "Centered" })}
    </div>
  `,
};
