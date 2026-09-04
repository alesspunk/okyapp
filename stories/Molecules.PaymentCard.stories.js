/* ─────────────────────────────────────────────────────────
   Molecules / Payment Card
   7 variantes: Default · Yayo · Saldo OKY · Visa ·
   Mastercard · OKY Cash Black · OKY Cash Teal
───────────────────────────────────────────────────────── */

import {
  findPaymentCard,
  PATTERN_OPTIONS,
  PAYMENT_CARD_PATHS,
  PAYMENT_CARD_VARIANTS,
  renderPaymentCard,
  renderPaymentCardStack,
} from "./_shared/paymentCards";

export default {
  title: "Molecules/Payment Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Payment Card** es la tarjeta de pago skeumórfica de `328x214` con radio `24px`. " +
          "Las 7 variantes comparten la **misma anatomía de 3 filas** y solo cambian de piel: " +
          "*header* (columna de logo `85px` · spacer · columna derecha con saldo disponible o últimos dígitos), " +
          "*región central* (slot reservado) y *footer* (vencimiento · área de acción). " +
          "Toda la piel se aplica con **custom properties** (`--payment-card-bg`, `--payment-card-ink`, " +
          "`--payment-card-border`, `--payment-card-pattern-opacity`, `--payment-card-pattern-blend`), " +
          "por lo que los controles de abajo customizan la card sin escribir CSS nuevo. " +
          "El **patrón** por defecto son los dos arcos de Figma (313px, `mix-blend-mode: color-burn`) que sangran " +
          "fuera de la card; la variante turquesa usa en su lugar una textura full-bleed en `screen`. " +
          "Tokens del sistema usados: `--border-main` (borde gris), `--white`, `--card-shadow`. " +
          "Los colores de marca (navy Visa, naranja Mastercard, morado OKY) son activos de marca y viven en la " +
          "variante, no en `:root`. " +
          "Las cards se pueden **apilar** con offset negativo (story *Stack*).",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: PAYMENT_CARD_PATHS,
      description: "Variante base del componente.",
    },
    backgroundMode: {
      control: "inline-radio",
      options: ["variant", "solid", "gradient"],
      description:
        "`variant` usa el fondo de la variante · `solid` aplica **Background color** · " +
        "`gradient` aplica un degradado de dos colores.",
    },
    backgroundColor: {
      control: "color",
      description: "Color sólido del fondo. Aplica con `backgroundMode: solid`.",
    },
    gradientFrom: {
      control: "color",
      description: "Color inicial (izquierda) del degradado.",
    },
    gradientTo: {
      control: "color",
      description: "Color final (derecha) del degradado.",
    },
    gradientAngle: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Ángulo del degradado. `90` = izquierda→derecha.",
    },
    ink: {
      control: "color",
      description: "Color del texto de la card (saldo, labels, footer).",
    },
    showBorder: {
      control: "boolean",
      description: "Muestra u oculta el borde de la card.",
    },
    borderColor: {
      control: "color",
      description: "Color del borde. El gris del sistema es `rgba(0,0,0,0.23)` (`--border-main`).",
    },
    pattern: {
      control: "select",
      options: PATTERN_OPTIONS,
      description:
        "Patrón que va **por encima** del contenido. `arcs` es el default (dos arcos en `color-burn`), " +
        "`bubbles` es la textura full-bleed y `none` lo apaga.",
    },
    patternOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Opacidad de la capa de patrón. Figma usa `0.12`, `0.38` (Yayo) y `0.27` (turquesa).",
    },
    patternBlend: {
      control: "select",
      options: ["color-burn", "screen", "multiply", "overlay", "normal"],
      description: "Blend mode del patrón.",
    },
    showHeader: {
      control: "boolean",
      description: "Muestra u oculta el header completo.",
    },
    showFooter: {
      control: "boolean",
      description: "Muestra u oculta el footer completo.",
    },
    footerDivider: {
      control: "boolean",
      description: "Línea superior del footer en `--border-main`. En Figma ninguna variante la trae.",
    },
  },
};

function resolveArgs(args = {}) {
  const base = findPaymentCard(args.variantPath);

  return {
    ...base,
    backgroundMode: args.backgroundMode ?? "variant",
    backgroundColor: args.backgroundColor,
    gradientFrom: args.gradientFrom,
    gradientTo: args.gradientTo,
    gradientAngle: args.gradientAngle,
    ink: args.ink,
    showBorder: args.showBorder,
    borderColor: args.borderColor,
    pattern: args.pattern ?? base.pattern,
    patternOpacity: args.patternOpacity,
    patternBlend: args.patternBlend,
    showHeader: args.showHeader ?? true,
    showFooter: args.showFooter ?? base.showFooter,
    footerDivider: args.footerDivider ?? base.footerDivider ?? false,
  };
}

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variantPath: "Molecule/Payment Card/Default",
    backgroundMode: "variant",
    backgroundColor: "#552588",
    gradientFrom: "#ac6fee",
    gradientTo: "#552588",
    gradientAngle: 90,
    pattern: "arcs",
    showHeader: true,
    showFooter: true,
    footerDivider: false,
  },
  render: (args) => {
    const card = resolveArgs(args);
    const base = findPaymentCard(args.variantPath);

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path} · ID Figma: ${card.id}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${base.recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:14px;color:var(--text-secondary)">
          328x214 · radio 24px · patrón: ${card.pattern} · fondo: ${card.backgroundMode}
        </div>
        ${renderPaymentCard(card)}
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
        story: "Las 7 variantes con su piel de Figma. Misma anatomía, distinta piel.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-wrap:wrap;gap:24px">
        ${PAYMENT_CARD_VARIANTS.map(
          (card) => `
          <div style="flex:0 0 auto">
            <div class="mars-label" style="margin-bottom:8px">${card.path} · ${card.id}</div>
            ${renderPaymentCard(card)}
          </div>
        `,
        ).join("")}
      </div>
    </div>
  `,
};

export const Stack = {
  name: "Stack",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Cards apiladas con offset negativo, como en Figma `99131:101546`. El offset se controla con " +
          "`--payment-card-stack-offset` (default `-150px`, el valor del archivo).",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;gap:40px;flex-wrap:wrap">
        <div style="flex:0 0 auto">
          <div class="mars-label" style="margin-bottom:8px">Visa + Saldo OKY · offset -150px</div>
          ${renderPaymentCardStack([findPaymentCard("Molecule/Payment Card/Visa"), findPaymentCard("Molecule/Payment Card/Saldo OKY")])}
        </div>
        <div style="flex:0 0 auto">
          <div class="mars-label" style="margin-bottom:8px">3 cards · offset -90px</div>
          ${renderPaymentCardStack(
            [
              findPaymentCard("Molecule/Payment Card/Visa"),
              findPaymentCard("Molecule/Payment Card/Mastercard"),
              findPaymentCard("Molecule/Payment Card/OKY Cash Teal"),
            ],
            { offset: -90 },
          )}
        </div>
      </div>
    </div>
  `,
};

export const Customization = {
  name: "Customization",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Las tres palancas que pide el sistema, sobre la misma variante Default: " +
          "**fondo** (sólido o degradado de dos colores), **patrón** (asset, opacidad y blend) y " +
          "**borde** (`--border-main`).",
      },
    },
  },
  render: () => {
    const base = findPaymentCard("Molecule/Payment Card/Default");
    const samples = [
      { label: "Sólido + borde gris", card: { ...base, backgroundMode: "solid", backgroundColor: "#552588", ink: "#ffffff", showBorder: true, borderColor: "rgba(0,0,0,0.23)" } },
      { label: "Degradado izq→der", card: { ...base, backgroundMode: "gradient", gradientFrom: "#0ab5b1", gradientTo: "#109794", gradientAngle: 90, ink: "#ffffff", showBorder: false } },
      { label: "Patrón bubbles / screen", card: { ...base, backgroundMode: "solid", backgroundColor: "#000000", ink: "#ffffff", pattern: "bubbles", patternOpacity: 0.35, patternBlend: "screen", showBorder: false } },
      { label: "Sin patrón", card: { ...base, backgroundMode: "gradient", gradientFrom: "#ac6fee", gradientTo: "#552588", gradientAngle: 90, ink: "#ffffff", pattern: "none", showBorder: true, borderColor: "#ffffff" } },
    ];

    return `
      <div class="mars-story">
        <div style="display:flex;flex-wrap:wrap;gap:24px">
          ${samples
            .map(
              (sample) => `
            <div style="flex:0 0 auto">
              <div class="mars-label" style="margin-bottom:8px">${sample.label}</div>
              ${renderPaymentCard(sample.card)}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  },
};
