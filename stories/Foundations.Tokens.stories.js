const coreSwatches = [
  { name: "Primary Main",    value: "#552588" },
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
      { name: "Background",  value: "#fff5e0", css: "--warning-bg" },
      { name: "Light",       value: "#faab5c", css: "--warning-light" },
      { name: "Icon / Main", value: "#ff9800", css: "--warning-main" },
      { name: "Dark",        value: "#f57c00", css: "--warning-dark" },
      { name: "Text",        value: "#734500", css: "--warning-text" },
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

// Full 30-token typography scale — DS-MARS2.pen source of truth
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
  { token: "CARDLABEL",   size: "10px", weight: "500", style: "",       cas: "UPPERCASE", ls: "0px",    lh: "1.6"   },
  { token: "EXCHANGE",    size: "10px", weight: "400", style: "",       cas: "UPPERCASE", ls: "1px",    lh: "1.6"   },
  { token: "TAG",         size: "7px",  weight: "700", style: "",       cas: "UPPERCASE", ls: "1px",    lh: "1.57", family: "Lato" },
  // ── Material Icons Outlined ──────────────────────────────────
  { token: "Icon/24",     size: "24px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
  { token: "Icon/16",     size: "16px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
  { token: "Icon/12",     size: "12px", weight: "300", style: "",       cas: "",          ls: "—",      lh: "1",    isIcon: true },
];

function previewStyle(t) {
  const size = Math.min(parseInt(t.size), 28);
  const textTransform = t.cas === "UPPERCASE" ? "uppercase" : "none";
  const family =
    t.family === "Lato"
      ? '"Lato",sans-serif'
      : t.family === "Inter"
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
          "Core design tokens: color palette, semantic palettes, surface/effect tokens and full typography scale (30 tokens). Incluye la familia `Card Top`, `Card Middle`, `Card Bottom`, `Back Drop` y `Separator Border`.",
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
      <p class="mars-subtitle">Nunito Sans + Lato + Inter (text) · Material Icons Outlined (icons) — 30 tokens.</p>
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
