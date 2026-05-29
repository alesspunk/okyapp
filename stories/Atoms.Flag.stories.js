import {
  COUNTRY_PRESETS,
  FLAG_SIZES,
  SIZE_OPTIONS,
  escapeHtml,
  renderFlag,
  resolveCountry,
  resolveSize,
} from "./_shared/flag.js";

function renderFlagSpec(args = {}) {
  const country = resolveCountry(args.code);
  const size = resolveSize(args.size);
  const mappingLabel = country.isMapped ? "mapeado" : "sin alias Alpha-3 local";

  return `
    <div class="flag-spec">
      <div><strong>Input</strong><span>${escapeHtml(country.inputCode)}</span></div>
      <div><strong>Alpha-3</strong><span>${escapeHtml(country.alpha3 || "-")}</span></div>
      <div><strong>Alpha-2 asset</strong><span>${escapeHtml(country.alpha2)}</span></div>
      <div><strong>Nombre</strong><span>${escapeHtml(country.name)}</span></div>
      <div><strong>Size</strong><span>${size.label} · ${size.dimensions}</span></div>
      <div><strong>Status</strong><span>${mappingLabel}</span></div>
    </div>
  `;
}

export default {
  title: "Atoms/Flag",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Atomo **Flag** basado en Flagpack. Usa flags 4:3 con tres tamanos oficiales: **S 16x12**, **M 20x15** y **L 32x24**. " +
          "Acepta `code` en **Alpha-2** (`GT`, `US`) y **Alpha-3** (`GTM`, `USA`) para los mercados principales de OKY; tambien soporta alias `GUA` para Guatemala. " +
          "La variante OKY mantiene borde redondeado, sin drop shadow y sin overlay/shine.",
      },
    },
  },
  argTypes: {
    code: {
      control: "text",
      description:
        "Codigo de pais. Recomendado: Alpha-3 para producto (`GTM`, `USA`). Tambien acepta Alpha-2 (`GT`, `US`) y alias OKY `GUA`.",
    },
    size: {
      control: "inline-radio",
      options: SIZE_OPTIONS,
      description: "Tamano visual del flag segun Flagpack.",
    },
    hasBorder: {
      control: "boolean",
      description: "Borde 1px sutil para lectura en fondos claros. No agrega sombra ni overlay.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    code: "GTM",
    size: "Large",
    hasBorder: true,
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Flag · Alpha-2 / Alpha-3</div>
      <div class="mars-subtitle">
        Usa <code>GTM</code> / <code>USA</code> para producto; el componente resuelve el SVG de Flagpack usando Alpha-2.
      </div>
      <div class="flag-playground-row">
        ${renderFlag(args)}
        ${renderFlagSpec(args)}
      </div>
    </div>
  `,
};

export const AllSizes = {
  name: "All Sizes",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Los tres tamanos salen de la especificacion de Flagpack: S 16x12, M 20x15 y L 32x24.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Flag sizes · GTM</div>
      <div class="flag-size-row">
        ${SIZE_OPTIONS.map(
          (size) => `
            <div class="flag-size-card">
              ${renderFlag({ code: "GTM", size })}
              <span>${size}</span>
              <small>${FLAG_SIZES[size].dimensions}</small>
            </div>
          `
        ).join("")}
      </div>
    </div>
  `,
};

export const CodeAliases = {
  name: "Code Aliases",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Referencia de compatibilidad para Guatemala: OKY puede seguir mostrando `GUA`, pero el atomo tambien acepta ISO `GTM`, `GT` y numerico `320`.",
      },
    },
  },
  render: () => {
    const aliases = ["GUA", "GTM", "GT", "320", "USA", "US", "840"];

    return `
      <div class="mars-story">
        <div class="mars-label">Aliases · Alpha-3, Alpha-2, numerico y OKY market code</div>
        <div class="flag-alias-grid">
          ${aliases
            .map((code) => {
              const country = resolveCountry(code);
              return `
                <div class="flag-alias-card">
                  ${renderFlag({ code, size: "Large" })}
                  <strong>${escapeHtml(code)}</strong>
                  <span>${escapeHtml(country.name)}</span>
                  <small>${escapeHtml(country.alpha3 || "-")} / ${escapeHtml(country.alpha2)}</small>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  },
};

export const MarketMatrix = {
  name: "Market Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Set inicial recomendado para mercados y audiencias frecuentes en OKY USA.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Country matrix · Alpha-3 visible</div>
      <div class="flag-market-grid">
        ${COUNTRY_PRESETS.map(
          (country) => `
            <div class="flag-market-card">
              ${renderFlag({ code: country.alpha3, size: "Large" })}
              <div>
                <strong>${country.alpha3}</strong>
                <span>${country.name}</span>
                <small>${country.alpha2} · ${country.numeric}</small>
              </div>
            </div>
          `
        ).join("")}
      </div>
    </div>
  `,
};
