const coreSwatches = [
  /* El morado OKY es Primary Base (#552588, en Figma primary/main);
     Primary Main (#410088) es el morado oscuro de botones y bordes
     activos. Los dos existen y no se mezclan (19/10). */
  { name: "Primary Base",    value: "#552588" },
  { name: "Primary Main",    value: "#410088" },
  { name: "Primary Dark",    value: "#230741" },
  { name: "Primary Light",   value: "#bc9edc" },
  { name: "Secondary Main",  value: "#18afa5" },
  { name: "Secondary Dark",  value: "#057a73" },
  { name: "Secondary Light", value: "#a8faf5" },
  { name: "Accent",          value: "#ffb400" },
  { name: "Border Main",     value: "rgba(0,0,0,0.23)" },
  { name: "Text Primary",    value: "rgba(0,0,0,0.87)" },
  { name: "Text Secondary",  value: "rgba(0,0,0,0.54)" },
];

const surfaceTokens = [
  {
    name: "Card Top",
    css: "--card-top",
    type: "gradient",
    value: "linear-gradient(149.41deg, #FCFCFC 18.83%, #F1F2F5 41%)",
    preview: "linear-gradient(149.41deg, #FCFCFC 18.83%, #F1F2F5 41%)",
    note: "Surface superior de card. Border 1px 1px 0 1px, color #E0E0E0 y radius 16px.",
  },
  {
    name: "Card Middle",
    css: "--card-middle",
    type: "gradient",
    value: "radial-gradient(50% 50% at 50% 50%, #FFF 0%, #F1F2F5 100%)",
    preview: "radial-gradient(50% 50% at 50% 50%, #FFF 0%, #F1F2F5 100%)",
    note: "Surface token usado por Middle Card.",
  },
  {
    name: "Card Bottom",
    css: "--card-bottom",
    type: "gradient",
    value: "linear-gradient(180deg, #F1F2F5 0%, #ECEFF8 88.01%)",
    preview: "linear-gradient(180deg, #F1F2F5 0%, #ECEFF8 88.01%)",
    note: "Surface inferior de card. Border 0 1px 1px 1px, color #E0E0E0 y radius 16px.",
  },
  {
    name: "Back Drop",
    css: "--back-drop",
    type: "color",
    value: "rgba(0, 0, 0, 0.4)",
    preview: "rgba(0, 0, 0, 0.4)",
    note: "Surface token para scrims, overlays y fondos de modal.",
  },
  {
    name: "Separator Border",
    css: "--separator-border",
    type: "border",
    value: "1px dashed rgba(0, 0, 0, 0.231373)",
    preview: "#ffffff",
    note: "Token de borde para separators dashed y contenedores guía.",
  },
  {
    name: "Card Shadow",
    css: "--card-shadow",
    type: "effect",
    value: "drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.1))",
    preview: "#ffffff",
    note: "Token reservado para uso futuro. Se mantiene declarado en Foundations.",
  },
  {
    name: "PDP Card",
    css: "--pdp-card-shadow",
    type: "effect",
    value: "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.14)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.12))",
    preview: "#ffffff",
    note: "Shell token aplicado al Middle Card. Border radius asociado: 16px.",
  },
  {
    name: "Border Main (Middle Card)",
    css: "--border-main",
    type: "color",
    value: "#E0E0E0",
    preview: "#E0E0E0",
    note: "Override scopeado dentro de Middle Card para respetar el stroke lateral del componente sin afectar el token global existente.",
  },
  // ── OKY Cash (sprint 20/10) ────────────────────────────────
  {
    name: "Highlight Surface",
    css: "--highlight-surface",
    type: "solid",
    value: "#E8FBF8",
    preview: "#E8FBF8",
    note: "Aqua claro de OKY Cash: la línea resaltada del resumen (descuentos de OKY Cash y código promo, desbordada 6px a cada lado) y la fila de OKY Cash marcada en «Método de pago». Reemplaza a Payrow Checked (#EFFDFC), que era casi igual (19/10).",
  },
  {
    name: "Highlight Text",
    css: "--highlight-text",
    type: "solid",
    value: "#007C72",
    preview: "#007C72",
    note: "Monto de la línea resaltada: teal sobre Highlight Surface, en ExtraBold 800 (token summaryHighlight).",
  },
  {
    name: "OKY Cash Dark",
    css: "--oky-cash-dark",
    type: "solid",
    value: "#00524D",
    preview: "#00524D",
    note: "Verde oscuro de OKY Cash: fondo de «Ganaste OKY Cash» y de la hoja «Tienes OKY Cash», y la casilla marcada de OKY Cash.",
  },
];

const semanticGroups = [
  {
    label: "Success",
    shades: [
      { name: "Background",  value: "#edf7ed", css: "--success-bg" },
      { name: "Light",       value: "#7bc67e", css: "--success-light" },
      { name: "Icon / Main", value: "#4caf50", css: "--success-main" },
      { name: "Dark",        value: "#3b873e", css: "--success-dark" },
      { name: "Text",        value: "#1e4620", css: "--success-text" },
    ],
  },
  {
    label: "Warning",
    shades: [
      { name: "Background",  value: "#fff5e5", css: "--warning-bg" },
      { name: "Light",       value: "#faab5c", css: "--warning-light" },
      { name: "Icon / Main", value: "#ff9800", css: "--warning-main" },
      { name: "Dark",        value: "#f57c00", css: "--warning-dark" },
      { name: "Text",        value: "#663d00", css: "--warning-text" },
    ],
  },
  {
    label: "Error",
    shades: [
      { name: "Background",  value: "#feeceb", css: "--error-bg" },
      { name: "Light",       value: "#f88078", css: "--error-light" },
      { name: "Icon / Main", value: "#f44336", css: "--error-main" },
      { name: "Dark",        value: "#e31b0c", css: "--error-dark" },
      { name: "Text",        value: "#621b16", css: "--error-text" },
    ],
  },
  {
    label: "Info",
    shades: [
      { name: "Background",  value: "#e9f5fe", css: "--info-bg" },
      { name: "Light",       value: "#64b6f7", css: "--info-light" },
      { name: "Icon / Main", value: "#2196f3", css: "--info-main" },
      { name: "Dark",        value: "#0b79d0", css: "--info-dark" },
      { name: "Text",        value: "#0d3c61", css: "--info-text" },
    ],
  },
];

// Full 31-token typography scale — DS-MARS2.pen source of truth
const typographyTokens = [
  // ── Display / Headings ──────────────────────────────────────
  { token: "H1",          size: "96px", weight: "700", style: "",       cas: "",          ls: "-1.5px", lh: "1.167" },
  { token: "H2",          size: "60px", weight: "700", style: "",       cas: "",          ls: "-0.5px", lh: "1.2"   },
  { token: "H3",          size: "48px", weight: "500", style: "",       cas: "",          ls: "0px",    lh: "1.167" },
  { token: "H4",          size: "32px", weight: "700", style: "",       cas: "",          ls: "0.25px", lh: "1.235" },
  { token: "H5",          size: "24px", weight: "700", style: "",       cas: "",          ls: "0px",    lh: "1.334" },
  { token: "H6",          size: "20px", weight: "700", style: "",       cas: "",          ls: "0.15px", lh: "1.6"   },
  // ── 20px ────────────────────────────────────────────────────
  { token: "CODE",        size: "20px", weight: "784", style: "italic", cas: "UPPERCASE", ls: "2px",    lh: "24px", family: "Inter", featureSettings: "\"zero\" on", numericVariant: "slashed-zero", variationSettings: "\"slnt\" -10", sample: "9905830250955525" },
  { token: "buttonLg",   size: "20px", weight: "700", style: "",       cas: "",          ls: "0.4px",  lh: "1.75"  },
  // ── 16px ────────────────────────────────────────────────────
  { token: "price",       size: "16px", weight: "900", style: "",       cas: "",          ls: "0.5px",  lh: "1.5"   },
  { token: "subtitle1",   size: "16px", weight: "700", style: "",       cas: "",          ls: "0.15px", lh: "1.36"  },
  { token: "body1",       size: "16px", weight: "400", style: "",       cas: "",          ls: "0.15px", lh: "1.5"   },
  // ── 14px ────────────────────────────────────────────────────
  { token: "button",      size: "14px", weight: "700", style: "",       cas: "",          ls: "0.4px",  lh: "1.75"  },
  { token: "sumTotal",    size: "14px", weight: "700", style: "",       cas: "",          ls: "0.15px", lh: "1.5"   },
  { token: "priceTag",    size: "14px", weight: "700", style: "italic", cas: "",          ls: "0.15px", lh: "1.5"   },
  { token: "subtitle2",   size: "14px", weight: "500", style: "",       cas: "",          ls: "0.1px",  lh: "1.57"  },
  { token: "productText", size: "14px", weight: "600", style: "",       cas: "",          ls: "0.15px", lh: "1.5"   },
  { token: "summaryHighlight", size: "14px", weight: "800", style: "", cas: "", ls: "0.15px", lh: "1.43" },
  { token: "SumText",     size: "14px", weight: "400", style: "",       cas: "",          ls: "0.15px", lh: "1.5"   },
  // ── 13px ────────────────────────────────────────────────────
  { token: "buttonSm",    size: "13px", weight: "500", style: "",       cas: "",          ls: "0.4px",  lh: "1.75"  },
  { token: "priceSm",     size: "13px", weight: "400", style: "",       cas: "",          ls: "0.5px",  lh: "1.5"   },
  // ── 12px ────────────────────────────────────────────────────
  { token: "caption",     size: "12px", weight: "700", style: "",       cas: "",          ls: "0.4px",  lh: "1.66"  },
  { token: "descText",    size: "12px", weight: "600", style: "",       cas: "",          ls: "0.15px", lh: "1.5"   },
  { token: "OVERLINE",    size: "12px", weight: "400", style: "",       cas: "UPPERCASE", ls: "1px",    lh: "2.66"  },
  { token: "Brand",       size: "12px", weight: "400", style: "",       cas: "Sentence",  ls: "0.15px", lh: "1.5"   },
  // ── 10px ────────────────────────────────────────────────────
  { token: "PLATEU",      size: "10px", weight: "700", style: "",       cas: "Sentence",  ls: "0.5px",  lh: "1.6"   },
  { token: "CARDLABEL",   size: "10px", weight: "500", style: "",       cas: "Sentence",  ls: "0px",    lh: "1.2"   },
  { token: "EXCHANGE",    size: "10px", weight: "400", style: "",       cas: "UPPERCASE", ls: "1px",    lh: "1.6"   },
  { token: "TAG",         size: "7px",  weight: "700", style: "",       cas: "UPPERCASE", ls: "1px",    lh: "1.57" },
  // ── Material Icons Outlined ──────────────────────────────────
  { token: "Icon/24",     size: "24px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
  { token: "Icon/16",     size: "16px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
  { token: "Icon/12",     size: "12px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
];

function previewStyle(t) {
  const size = Math.min(parseInt(t.size), 28);
  const textTransform = t.cas === "UPPERCASE" ? "uppercase" : "none";
  const family =
    t.family === "Inter"
      ? '"Inter",sans-serif'
      : '"Nunito Sans",sans-serif';
  return [
    `font-size:${size}px`,
    `font-weight:${t.weight}`,
    `font-style:${t.style || "normal"}`,
    `letter-spacing:${t.ls}`,
    `line-height:${t.lh}`,
    `text-transform:${textTransform}`,
    `font-family:${family}`,
    t.featureSettings ? `font-feature-settings:${t.featureSettings}` : "",
    t.numericVariant ? `font-variant-numeric:${t.numericVariant}` : "",
    t.variationSettings ? `font-variation-settings:${t.variationSettings}` : "",
  ].join(";");
}

export default {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Core design tokens: color palette, semantic palettes, surface/effect tokens and full typography scale (31 tokens). Incluye la familia `Card Top`, `Card Middle`, `Card Bottom`, `Back Drop` y `Separator Border`, y los de OKY Cash: `Highlight Surface`, `Highlight Text` y `OKY Cash Dark`.",
      },
    },
  },
};

export const ColorPalette = {
  name: "Color Palette — Core",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Core Token Palette</h3>
      <p class="mars-subtitle">Base brand colors used across all components.</p>
      <div class="swatches">
        ${coreSwatches
          .map(
            (c) => `
          <div class="swatch">
            <div class="swatch-color" style="background:${c.value}"></div>
            <div class="swatch-meta">
              <strong>${c.name}</strong><br/>
              <code>${c.value}</code>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `,
};

export const SemanticPalettes = {
  name: "Color Palette — Semantic",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Semantic Palettes</h3>
      <p class="mars-subtitle">Status colors for feedback states: success, warning, error, info.</p>
      <div class="semantic-palette">
        ${semanticGroups
          .map(
            (g) => `
          <div class="semantic-group">
            <div class="semantic-group-label">${g.label}</div>
            ${g.shades
              .map(
                (s) => `
              <div class="semantic-swatch">
                <div class="semantic-swatch-color" style="background:${s.value}"></div>
                <div>
                  <div style="font-weight:700;color:var(--text-primary)">${s.name}</div>
                  <div style="color:var(--text-secondary);font-size:11px">${s.value} · <code>${s.css}</code></div>
                </div>
              </div>`
              )
              .join("")}
          </div>`
          )
          .join("")}
      </div>
    </div>
  `,
};

export const SurfaceTokens = {
  name: "Surface Tokens",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Surface / Effect Tokens</h3>
      <p class="mars-subtitle">Tokens declarados para superficies especiales como <code>Middle Card</code>.</p>
      <div class="semantic-palette">
        ${surfaceTokens
          .map(
            (token) => `
          <div class="semantic-group">
            <div class="semantic-group-label">${token.name}</div>
            <div class="semantic-swatch" style="align-items:flex-start">
              <div
                class="semantic-swatch-color"
                style="
                  width:72px;
                  height:72px;
                  border-radius:16px;
                  background:${token.preview};
                  ${
                    token.type === "effect"
                      ? `filter:${token.value}; border:1px solid rgba(0,0,0,0.08);`
                      : token.type === "border"
                        ? `border:${token.value};`
                        : ""
                  }
                "
              ></div>
              <div>
                <div style="font-weight:700;color:var(--text-primary)">${token.name}</div>
                <div style="color:var(--text-secondary);font-size:11px;margin:4px 0"><code>${token.css}</code></div>
                <div style="color:var(--text-secondary);font-size:11px;line-height:1.5">${token.value}</div>
                <div style="color:var(--text-secondary);font-size:11px;line-height:1.5;margin-top:6px">${token.note}</div>
              </div>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `,
};

export const TypographyScale = {
  name: "Typography Scale",
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 4px;color:var(--primary-main)">Typography Tokens</h3>
      <p class="mars-subtitle">Nunito Sans + Inter (text) · Material Icons Outlined (icons) — 31 tokens.</p>
      <table class="type-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Preview</th>
            <th>Size</th>
            <th>Weight</th>
            <th>Style</th>
            <th>Case</th>
            <th>LS</th>
            <th>LH</th>
          </tr>
        </thead>
        <tbody>
          ${typographyTokens
            .map(
              (t) => `
            <tr>
              <td><code>${t.token}</code></td>
              <td>
                ${
                  t.isIcon
                    ? `<span class="material-icons-outlined" style="font-size:${t.size};color:var(--text-primary)">home</span>`
                    : `<span class="type-preview" style="${previewStyle(t)}">${t.sample || t.family || "Nunito Sans"}</span>`
                }
              </td>
              <td>${t.size}</td>
              <td>${t.weight}</td>
              <td>${t.style || "—"}</td>
              <td>${t.cas || "—"}</td>
              <td>${t.ls}</td>
              <td>${t.lh}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `,
};

/* ── OKY Tokens (19/10) ───────────────────────────────────
   Todos los colores de :root en mars.css, con el nombre que llevan en
   Figma (MARS › variables «OKY Tokens»: el primer guion es la barra,
   --primary-text-dark → primary/text-dark). Se leen del CSS cargado,
   así que esta tabla no se desincroniza del código. */
const FIGMA_SPECIAL = { black: "base/black", white: "base/white", divider: "line/divider", "separator-border": "line/separator-border", background: "surface/background", "back-drop": "surface/back-drop" };
const figmaName = (css) => FIGMA_SPECIAL[css] || (css.startsWith("oky-cash-") ? css.replace("oky-cash-", "oky-cash/") : css.replace("-", "/"));

function rootColorTokens() {
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const rule of Array.from(rules || [])) {
      if (rule.selectorText !== ":root") continue;
      for (const prop of Array.from(rule.style)) {
        if (!prop.startsWith("--")) continue;
        const value = rule.style.getPropertyValue(prop).trim();
        if (/^(#[0-9a-f]{3,8}|rgba?\()/i.test(value)) out.push({ css: prop.slice(2), value });
      }
    }
  }
  return out;
}

export const OkyTokens = {
  name: "OKY Tokens (Storybook = Figma)",
  render: () => {
    const el = document.createElement("div");
    el.className = "mars-story";
    const tokens = rootColorTokens();
    el.innerHTML = `
      <h2 class="mars-section-title">OKY Tokens · ${tokens.length} colores</h2>
      <p class="mars-subtitle">Fuente de la verdad: <code>:root</code> en <code>mars.css</code>. En Figma son las variables de la colección «OKY Tokens» con el mismo valor; en Dev Mode cada una muestra su <code>var(--…)</code>.</p>
      <table class="mars-token-table">
        <thead><tr><th></th><th>CSS</th><th>Figma</th><th>Valor</th></tr></thead>
        <tbody>
          ${tokens
            .map(
              (t) => `<tr>
                <td><span style="display:inline-block;width:28px;height:28px;border-radius:6px;border:1px solid var(--divider);background:${t.value}"></span></td>
                <td><code>--${t.css}</code></td>
                <td><code>${figmaName(t.css)}</code></td>
                <td><code>${t.value}</code></td>
              </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
    return el;
  },
};

// Tipografía OKY: los valores viven en :root de mars.css (--type-*), medidos
// del Figma de la épica. Aquí solo va el nombre del text style en MARS y si
// el token lleva mayúsculas (la variable `font` no incluye text-transform).
const OKY_TYPE = {
  "h1": ["H1", false],
  "h2": ["H2", false],
  "h3": ["H3", false],
  "h4": ["H4", false],
  "h5": ["H5", false],
  "h6": ["H6", false],
  "code": ["CODE", true],
  "button-lg": ["buttonLg", false],
  "price": ["price", false],
  "subtitle1": ["subtitle1", false],
  "body1": ["body1", false],
  "button": ["button", false],
  "price-tag": ["priceTag", false],
  "subtitle2": ["subtitle2", false],
  "product-text": ["productText", false],
  "summary-highlight": ["summaryHighlight", false],
  "sum-text": ["SumText", false],
  "button-sm": ["buttonSm", false],
  "price-sm": ["priceSm", false],
  "caption": ["caption", false],
  "desc-text": ["descText", false],
  "overline": ["OVERLINE", true],
  "brand": ["Brand", false],
  "plateu": ["PLATEU", false],
  "cardlabel": ["CARDLABEL", false],
  "exchange": ["EXCHANGE", true],
  "tag": ["TAG", true],
  "plateu-120": ["PLATEU-120", false],
  "t10-regular": ["t10-regular", false],
  "t12-bold-caps": ["t12-bold-caps", true],
  "subtitle1-175": ["subtitle1-175", false],
  "t9-regular": ["t9-regular", false],
  "t20-semibold": ["t20-semibold", false],
  "subtitle1-120": ["subtitle1-120", false],
  "button-143": ["button-143", false],
  "sum-text-175": ["SumText-175", false],
  "t10-regular-caps": ["t10-regular-caps", true],
  "t18-semibold": ["t18-semibold", false],
  "subtitle1-125": ["subtitle1-125", false],
  "t14-bold-caps": ["t14-bold-caps", true],
  "sum-text-143": ["SumText-143", false],
  "t14-extrabold-caps": ["t14-extrabold-caps", true],
  "t13-semibold": ["t13-semibold", false],
  "t21-bold": ["t21-bold", false],
  "body1-120": ["body1-120", false],
  "subtitle1-160": ["subtitle1-160", false],
  "desc-text-167": ["descText-167", false],
  "t18-black": ["t18-black", false],
  "brand-167": ["Brand-167", false],
  "body1-150": ["body1-150", false],
  "brand-200": ["Brand-200", false],
  "product-text-157": ["productText-157", false],
  "sum-text-150": ["SumText-150", false],
  "t10-light-caps": ["t10-light-caps", true],
  "t8-regular": ["t8-regular", false],
  "t20-regular": ["t20-regular", false],
  "sum-total": ["sumTotal", false],
  "brand-140": ["Brand-140", false],
  "t12-bold-caps-120": ["t12-bold-caps-120", true],
  "t9-regular-143": ["t9-regular-143", false],
  "h6-280": ["H6-280", false],
  "price-120": ["price-120", false],
  "t12-bold-caps-133": ["t12-bold-caps-133", true],
  "t15-black": ["t15-black", false],
  "t22-black": ["t22-black", false],
  "t18-regular": ["t18-regular", false],
  "t9-bold-caps": ["t9-bold-caps", true],
  "t14-medium-italic": ["t14-medium-italic", false],
  "h6-130": ["H6-130", false],
  "t20-extrabold": ["t20-extrabold", false],
  "t10-medium-caps": ["t10-medium-caps", true],
  "t8-black-caps": ["t8-black-caps", true],
  "t18-extrabold": ["t18-extrabold", false],
  "t11-bold": ["t11-bold", false],
  "t10-light-caps-220": ["t10-light-caps-220", true],
  "t15-bold": ["t15-bold", false],
  "t40-bold": ["t40-bold", false],
  "t20-black": ["t20-black", false],
  "t9-extrabold": ["t9-extrabold", false],
  "t11-regular": ["t11-regular", false],
  "t12-regular-italic": ["t12-regular-italic", false],
  "t17-bold": ["t17-bold", false],
  "brand-133": ["Brand-133", false],
  "button-129": ["button-129", false],
  "plateu-240": ["PLATEU-240", false],
  "price-sm-169": ["priceSm-169", false],
  "t11-bold-132": ["t11-bold-132", false],
  "t26-extrabold": ["t26-extrabold", false],
  "t15-regular": ["t15-regular", false],
  "t22-bold": ["t22-bold", false],
  "t22-regular": ["t22-regular", false],
  "t15-regular-145": ["t15-regular-145", false],
  "t56-black": ["t56-black", false],
  "t14-bold": ["t14-bold", false],
  "t22-extrabold": ["t22-extrabold", false],
  "t11-black": ["t11-black", false],
  "t15-bold-100": ["t15-bold-100", false],
  "t24-black": ["t24-black", false],
  "t24-black-115": ["t24-black-115", false],
  "t24-extrabold": ["t24-extrabold", false],
  "t8-medium": ["t8-medium", false],
  "t56-black-106": ["t56-black-106", false],
  "t44-black": ["t44-black", false],
  "t40-black": ["t40-black", false],
  "t13-bold-caps": ["t13-bold-caps", true],
  "t92-regular": ["t92-regular", false],
  "t30-black": ["t30-black", false],
  "t14-semibold": ["t14-semibold", false]
};

function rootTypeTokens() {
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const rule of Array.from(rules || [])) {
      if (rule.selectorText !== ":root") continue;
      for (const prop of Array.from(rule.style)) {
        const m = prop.match(/^--type-(.+?)$/);
        if (!m || m[1].endsWith("-ls")) continue;
        const css = m[1];
        out.push({ css, font: rule.style.getPropertyValue(prop).trim(), ls: rule.style.getPropertyValue(`--type-${css}-ls`).trim() });
      }
    }
  }
  return out;
}

export const OkyTypography = {
  name: "OKY Tipografía (Storybook = Figma)",
  render: () => {
    const el = document.createElement("div");
    el.className = "mars-story";
    const tokens = rootTypeTokens();
    el.innerHTML = `
      <h2 class="mars-section-title">OKY Tipografía · ${tokens.length} tokens</h2>
      <p class="mars-subtitle">Fuente de la verdad: las variables <code>--type-*</code> en <code>:root</code> de <code>mars.css</code>, medidas del Figma de la épica OKY Cash. En MARS son los text styles «OKY/…» con los mismos valores. Uso: <code>font: var(--type-x); letter-spacing: var(--type-x-ls);</code> y <code>text-transform: uppercase</code> en los que dicen MAYÚSCULAS.</p>
      <div style="overflow-x:auto"><table class="mars-token-table">
        <thead><tr><th>Muestra</th><th>CSS</th><th>Figma</th><th>Valor</th></tr></thead>
        <tbody>
          ${tokens
            .map((t) => {
              const [figma, upper] = OKY_TYPE[t.css] || [t.css, false];
              return `<tr>
                <td style="font:var(--type-${t.css});letter-spacing:var(--type-${t.css}-ls);${upper ? "text-transform:uppercase;" : ""}color:var(--primary-main);white-space:nowrap">${Number(t.font.match(/(\d+(?:\.\d+)?)px\//)[1]) >= 30 ? "OKY Cash" : "Gana $0.25 de OKY Cash"}</td>
                <td><code>--type-${t.css}</code></td>
                <td><code>OKY/${figma}</code></td>
                <td><code>${t.font} · ls ${t.ls}${upper ? " · MAYÚSCULAS" : ""}</code></td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table></div>`;
    return el;
  },
};
