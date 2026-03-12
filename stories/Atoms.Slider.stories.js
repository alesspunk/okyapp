const SLIDER_VARIANTS = {
  Quetzales: {
    id: "image-ref-quetzales",
    currencySymbol: "Q",
    min: 25,
    max: 200,
    value: 85,
    step: 25,
    minLabel: "Mínimo",
    maxLabel: "Máximo",
  },
  Dollars: {
    id: "image-ref-dollars",
    currencySymbol: "$",
    min: 5,
    max: 100,
    value: 35,
    step: 5,
    minLabel: "Minimum",
    maxLabel: "Maximum",
  },
};

const VARIANT_OPTIONS = Object.keys(SLIDER_VARIANTS);

function resolveSlider(args = {}) {
  const base = SLIDER_VARIANTS[args.variant] ?? SLIDER_VARIANTS.Quetzales;
  const min = Number.isFinite(Number(args.min)) ? Number(args.min) : base.min;
  const max = Number.isFinite(Number(args.max)) ? Number(args.max) : base.max;
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const rawValue = Number.isFinite(Number(args.value)) ? Number(args.value) : base.value;
  const value = Math.min(Math.max(rawValue, safeMin), safeMax);
  const step = Number.isFinite(Number(args.step)) && Number(args.step) > 0 ? Number(args.step) : base.step;

  return {
    ...base,
    currencySymbol: args.currencySymbol || base.currencySymbol,
    min: safeMin,
    max: safeMax,
    value,
    step,
    minLabel: args.minLabel?.trim() || base.minLabel,
    maxLabel: args.maxLabel?.trim() || base.maxLabel,
  };
}

function renderSlider(args = {}) {
  const slider = resolveSlider(args);
  const percent = slider.max === slider.min ? 0 : ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  const sliderId = `slider-atom-${slider.currencySymbol === '$' ? 'usd' : 'gtq'}-${slider.min}-${slider.max}-${slider.value}`.replace(/[^a-z0-9-]/gi, '');

  return `
    <div class="slider-atom" style="--slider-progress:${percent}%;">
      <div class="slider-track-shell" aria-hidden="true">
        <div class="slider-track"></div>
        <div class="slider-ticks">
          ${Array.from({ length: 11 }, (_, index) => `<span class="slider-tick" style="left:${index * 10}%"></span>`).join("")}
        </div>
      </div>
      <input
        id="${sliderId}"
        class="slider-range"
        type="range"
        min="${slider.min}"
        max="${slider.max}"
        step="${slider.step}"
        value="${slider.value}"
        oninput="this.parentElement.style.setProperty('--slider-progress', (((this.value - this.min) / (this.max - this.min)) * 100) + '%')"
        aria-label="${slider.currencySymbol} slider desde ${slider.min} hasta ${slider.max}"
      />
      <div class="slider-values token-h5">
        <span>${slider.currencySymbol} ${slider.min}</span>
        <span>${slider.currencySymbol} ${slider.max}</span>
      </div>
      <div class="slider-labels token-body1">
        <span>${slider.minLabel}</span>
        <span>${slider.maxLabel}</span>
      </div>
    </div>
  `;
}

export default {
  title: "Atoms/Slider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Átomo **Slider** para seleccionar montos en dinero. " +
          "Se construye como `input[type=range]` estilizado para que sea operativo en Storybook, " +
          "con variantes para **Q** y **$**. Usa tokens del sistema: **H5** para los montos y **body1** para los labels de rango.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: VARIANT_OPTIONS,
      description: "Preset del slider según moneda/contexto.",
    },
    currencySymbol: {
      control: "inline-radio",
      options: ["Q", "$"],
      description: "Prefijo monetario visible en ambos extremos.",
    },
    min: {
      control: { type: "number", min: 0, step: 1 },
      description: "Valor mínimo del rango.",
    },
    max: {
      control: { type: "number", min: 1, step: 1 },
      description: "Valor máximo del rango.",
    },
    value: {
      control: { type: "number", min: 0, step: 1 },
      description: "Valor actual del slider. También se puede arrastrar desde el visor.",
    },
    step: {
      control: { type: "number", min: 1, step: 1 },
      description: "Incremento del slider.",
    },
    minLabel: {
      control: "text",
      description: "Texto descriptivo del extremo izquierdo.",
    },
    maxLabel: {
      control: "text",
      description: "Texto descriptivo del extremo derecho.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variant: "Quetzales",
    currencySymbol: "Q",
    min: 25,
    max: 200,
    value: 85,
    step: 25,
    minLabel: "Mínimo",
    maxLabel: "Máximo",
  },
  render: (args) => {
    const slider = resolveSlider(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Slider · ${slider.currencySymbol} · Drag enabled</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: labels máx. 8 caracteres por lado (base: "Mínimo" / "Máximo"). Arrastra el thumb dentro del visor o usa el control de value.
        </div>
        ${renderSlider(args)}
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
        story: "Referencia de las dos variantes iniciales del átomo: Quetzales y Dollars.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:28px;max-width:328px">
        ${renderSlider({ variant: "Quetzales" })}
        ${renderSlider({ variant: "Dollars" })}
      </div>
    </div>
  `,
};
