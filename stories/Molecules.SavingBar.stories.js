/* ─────────────────────────────────────────────────────────
   Molecules / Saving Bar
   Pen reference: 8141:52920
   Variants: Default · Full width Increment +1 ·
             Summary Box - Normal · Summary Box - Increment +1
───────────────────────────────────────────────────────── */

export default {
  title: "Molecules/Saving Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Saving Bar** es la molécula que comunica el ahorro acumulado del usuario " +
          "(\"Vas ahorrando $X.XX\") sobre un fondo menta con ícono de etiqueta. " +
          "Tiene 4 variantes: **Default** y **Full width Increment +1** (barra suelta, " +
          "a ancho completo) y **Summary Box - Normal** / **Summary Box - Increment +1** " +
          "(la barra como cabecera de una tarjeta blanca con los CTAs \"Seguir comprando\" " +
          "/ \"Ir a pagar\"). Las variantes **Increment +1** agregan un fondo de confeti " +
          "animado detrás de la barra para celebrar un ahorro incremental. " +
          "Pen: `8141:52920` · Tokens: `$Secondary Light` (fondo menta #A8FAF5), " +
          "`#00524D` (texto/ícono), `#552588` (CTAs de la tarjeta), `$White`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Default",
        "Full width Increment +1",
        "Summary Box - Normal",
        "Summary Box - Increment +1",
      ],
      description:
        "**Default** / **Full width Increment +1** → barra suelta a ancho completo. " +
        "**Summary Box - *** → barra como cabecera de tarjeta con CTAs. " +
        "Las variantes **Increment +1** muestran el fondo de confeti.",
      table: { defaultValue: { summary: "Full width Increment +1" } },
    },
    amount: {
      control: "text",
      description:
        'Monto de ahorro mostrado en el copy ("Vas ahorrando $X.XX"). ' +
        "Si se deja vacío usa el default de la variante ($3.20 en Full width Increment +1, $1.20 en el resto).",
      table: { defaultValue: { summary: "(auto)" } },
    },
  },
};

/* ── helper ──────────────────────────────────────────── */

function buildSavingBar({ variant, amount }) {
  const v = variant ?? "Full width Increment +1";
  const isSummary = v === "Summary Box - Normal" || v === "Summary Box - Increment +1";
  const showConfetti = v === "Full width Increment +1" || v === "Summary Box - Increment +1";
  const defaultAmount = v === "Full width Increment +1" ? "$3.20" : "$1.20";
  const amt = amount || defaultAmount;

  const confettiHtml = showConfetti
    ? `<div class="saving-bar-confetti"><img src="saving-bar-confetti.png" alt=""></div>`
    : "";

  const barHtml = `
    <div class="saving-bar${isSummary ? " saving-bar--top" : ""}" data-variant="${v}">
      ${confettiHtml}
      <div class="saving-bar-copy">
        <i class="fa-solid fa-tags fa-icon"></i>
        <span>Vas ahorrando ${amt}</span>
      </div>
    </div>`;

  if (!isSummary) return barHtml;

  return `
    <div class="saving-bar-card">
      ${barHtml}
      <div class="saving-bar-card-actions">
        <button class="btn btn-outlined btn-large" type="button">Seguir comprando</button>
        <button class="btn btn-primary btn-large" type="button">Ir a pagar</button>
      </div>
    </div>`;
}

/* ── Playground ──────────────────────────────────────── */

export const Playground = {
  name: "Playground",
  args: {
    variant: "Full width Increment +1",
    amount: "",
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">
        Saving Bar / variant=${args.variant} · ID .pen: 8141:52920
      </div>
      ${buildSavingBar(args)}
    </div>`,
};

/* ── All Variants ────────────────────────────────────── */

export const AllVariants = {
  name: "All Variants — Reference",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Saving Bar — Las 4 variantes</h3>
      <p class="mars-subtitle">Pen: 8141:52920</p>
      <div style="display:flex;flex-wrap:wrap;gap:20px">

        <div class="story-card">
          <div class="mars-label">Default</div>
          ${buildSavingBar({ variant: "Default" })}
        </div>

        <div class="story-card">
          <div class="mars-label">Full width Increment +1</div>
          ${buildSavingBar({ variant: "Full width Increment +1" })}
        </div>

        <div class="story-card">
          <div class="mars-label">Summary Box - Normal</div>
          ${buildSavingBar({ variant: "Summary Box - Normal" })}
        </div>

        <div class="story-card">
          <div class="mars-label">Summary Box - Increment +1</div>
          ${buildSavingBar({ variant: "Summary Box - Increment +1" })}
        </div>

      </div>
    </div>`,
};
