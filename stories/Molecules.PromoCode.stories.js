/* ─────────────────────────────────────────────────────────
   Molecules / Promo Code
   Pen reference: 6437:28971
   States: empty · entered
───────────────────────────────────────────────────────── */

export default {
  title: "Molecules/Promo Code",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Promo Code** es la molécula de código promocional (Voucherify). " +
          "Tiene dos variantes: **empty** — invita al usuario a ingresar un código — " +
          "y **entered** — muestra el código aplicado con opción de quitarlo. " +
          "El estado controla qué ícono CTA es visible mediante CSS (`data-state`). " +
          "Pen: `6437:28971` · Tokens: `$Secondary Main` (border), `$Secondary Dark` (texto/íconos), `$Primary Main` (action icons).",
      },
    },
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["empty", "entered"],
      description: "**empty** → muestra placeholder + chevron. **entered** → muestra código aplicado + botón de quitar.",
      table: { defaultValue: { summary: "empty" } },
    },
    promoCode: {
      control: "text",
      description: "Código aplicado que se muestra en el estado **entered**.",
      table: { defaultValue: { summary: "verano26" } },
    },
    placeholder: {
      control: "text",
      description: "Texto del estado **empty**.",
      table: { defaultValue: { summary: "Ingresa el código promocional" } },
    },
  },
};

/* ── helper ──────────────────────────────────────────── */

function buildPromoCode({ state, promoCode, placeholder }) {
  const s = state ?? "empty";
  const code = promoCode ?? "verano26";
  const hint = placeholder ?? "Ingresa el código promocional";

  const copyHtml =
    s === "entered"
      ? `<p class="promo-code-copy"><span class="promo-code-prefix">Código Promo:</span> ${code}</p>`
      : `<p class="promo-code-copy">${hint}</p>`;

  return `
    <div class="promo-code-molecule" data-state="${s}">
      <span class="promo-code-leading" aria-hidden="true">
        <img src="PROMOS@2x.webp" alt="">
      </span>
      ${copyHtml}
      <button class="promo-code-action promo-clear" type="button" aria-label="Quitar código">
        <i class="fa-solid fa-circle-xmark icon-medium"></i>
      </button>
      <button class="promo-code-action promo-open" type="button" aria-label="Ingresar código">
        <i class="fa-solid fa-chevron-right icon-medium"></i>
      </button>
    </div>`;
}

/* ── Playground ──────────────────────────────────────── */

export const Playground = {
  name: "Playground",
  args: {
    state: "empty",
    promoCode: "verano26",
    placeholder: "Ingresa el código promocional",
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">
        Promo Code / state=${args.state} · ID .pen: 6437:28971
      </div>
      ${buildPromoCode(args)}
    </div>`,
};

/* ── Both Variants ───────────────────────────────────── */

export const BothVariants = {
  name: "Both Variants — Reference",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Promo Code — Ambas variantes</h3>
      <p class="mars-subtitle">Pen: 6437:28971 · state: empty · entered</p>
      <div style="display:flex;flex-direction:column;gap:20px">

        <div class="story-card">
          <div class="mars-label">Empty — sin código aplicado</div>
          ${buildPromoCode({ state:"empty", promoCode:"verano26", placeholder:"Ingresa el código promocional" })}
          <p style="margin:8px 0 0;font-size:12px;color:var(--text-secondary)">
            Muestra placeholder + chevron. El botón <code>×</code> está oculto.
          </p>
        </div>

        <div class="story-card">
          <div class="mars-label">Entered — código aplicado</div>
          ${buildPromoCode({ state:"entered", promoCode:"verano26", placeholder:"Ingresa el código promocional" })}
          <p style="margin:8px 0 0;font-size:12px;color:var(--text-secondary)">
            Muestra el código + botón <code>×</code> para quitar. El chevron está oculto.
          </p>
        </div>

      </div>
    </div>`,
};
