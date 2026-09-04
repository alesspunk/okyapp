/* ─────────────────────────────────────────────────────────
   Molecules / Reminder Card
   Figma: 99105:14325 (card) · 99105:14130 (pantalla con carrusel)
   Variantes: Default · With Brand · With Channels
───────────────────────────────────────────────────────── */

import {
  findReminderCard,
  REMINDER_CARD_PATHS,
  REMINDER_CARD_VARIANTS,
  renderReminderCard,
  renderReminderCarousel,
  resolveReminderCard,
} from "./_shared/reminderCards";

export default {
  title: "Molecules/Reminder Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Reminder Card** es la molécula de recordatorio de pago recurrente (agua, luz, telco). " +
          "Usa el surface token **$Info BG** (`--info-bg`), borde `--border-main`, radio `16px` y ancho `328px`. " +
          "Incluye las variantes de Figma: **Default** (título + contexto + CTA), " +
          "**With Brand** (logo del proveedor 71x45), **With Channels** (pills de canal y proveedor) y " +
          "**Yayo Approval** (variante prima del flujo Yayo: monto + comercio, chip de countdown y doble acción " +
          "rechazar/aprobar; radio `20px` y shadow *Plateu*). " +
          "El CTA reutiliza el átomo `btn btn-primary btn-medium` a ancho completo y el menú lateral usa " +
          "`fa-light fa-ellipsis-vertical`. " +
          "No vive solo en la pantalla de recordatorios: cuando hay varias marcas se listan en el " +
          "**carrusel** (story *Carousel*), que reutiliza los dots existentes `carrusel-dot`. " +
          "Figma: `99105:14325` · Tokens: `--info-bg`, `--primary-base`, `--border-main`, " +
          "`--success-bg` / `--success-text` (pill de canal), `--white`, `--disable-text` (label de sección). " +
          "La variante *Yayo Approval* reutiliza el átomo **Super Ribbon** (`super-ribbon-type-vence`) y los tokens " +
          "de soporte `--warning-bg` / `--warning-main` / `--error-text` / `--error-main` / `--success-main` / `--info-text`.",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: REMINDER_CARD_PATHS,
      description: "Selecciona la variante base del componente.",
    },
    title: {
      control: "text",
      description: "Título del recordatorio. Base Figma: `Electricidad de Daniel Paz`.",
    },
    body: {
      control: "text",
      description: "Contexto del recordatorio (última vez que pagó o aviso programado).",
    },
    ctaLabel: {
      control: "text",
      description: "Label del CTA. Base Figma: `Ver saldo` o `Pagar ahora`.",
    },
    showMenu: {
      control: "boolean",
      description: "Switch para mostrar u ocultar el menú de opciones (kebab).",
    },
    showCta: {
      control: "boolean",
      description: "Switch para mostrar u ocultar el CTA inferior.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID de Figma debajo del playground.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variantPath: "Molecule/Reminder Card/With Brand",
    title: "",
    body: "",
    ctaLabel: "",
    showMenu: true,
    showCta: true,
    showMeta: true,
  },
  render: (args) => {
    const card = resolveReminderCard(args);
    const base = findReminderCard(args.variantPath);

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${base.recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Surface: Info BG · Border: --border-main · Radius: 16px · Width: 328px · CTA: btn-primary btn-medium
        </div>
        ${args.showMeta ? `<div class="mars-label">ID Figma: ${card.id}</div>` : ""}
        ${renderReminderCard(card)}
      </div>
    `;
  },
};

export const Variants = {
  name: "Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de las variantes base de `Reminder Card`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-wrap:wrap;gap:20px">
        ${REMINDER_CARD_VARIANTS.map(
          (card) => `
          <div class="story-card">
            <div class="mars-label">${card.path}</div>
            ${renderReminderCard({ ...card, showMenu: true, showCta: true })}
            <div class="mars-label" style="margin-top:10px">ID Figma: ${card.id}</div>
          </div>
        `,
        ).join("")}
      </div>
    </div>
  `,
};

export const Carousel = {
  name: "Carousel",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Cuando el usuario tiene varias marcas con recordatorio, las cards se listan en un carrusel " +
          "horizontal con scroll-snap y dots (`carrusel-dot`), precedido por el label de sección " +
          "`RECORDATORIOS` (`token-exchange` en `--disable-text`).",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-mobile">
        ${renderReminderCarousel(
          REMINDER_CARD_VARIANTS.filter((card) => card.kind !== "approval").map((card) => ({
            ...card,
            showMenu: true,
            showCta: true,
          })),
          { activeIndex: 0 },
        )}
      </div>
    </div>
  `,
};
