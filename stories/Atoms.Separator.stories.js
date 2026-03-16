function buildSeparator({ width = 272, stretch = false }) {
  const numericWidth = Number(width);
  const resolvedWidth = Number.isFinite(numericWidth) ? Math.max(1, numericWidth) : 272;
  const inlineWidth = stretch ? "" : ` style="width:${resolvedWidth}px"`;

  return `<div class="separator-atom${stretch ? " is-stretch" : ""}" role="separator" aria-orientation="horizontal"${inlineWidth}></div>`;
}

export default {
  title: "Atoms/Separator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Separator** es un átomo helper para separar bloques dentro de layouts verticales. " +
          "Respeta la spec base de `272px x 0px` con borde dashed de `1px` usando el token `--separator-border`. " +
          "Además permite modo stretch para contenedores fluidos sin duplicar CSS inline en las páginas.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    width: 272,
    stretch: false,
  },
  argTypes: {
    width: {
      control: { type: "number", min: 1, step: 1 },
      description: "Ancho del separator. La spec base usa 272px.",
      if: { arg: "stretch", truthy: false },
    },
    stretch: {
      control: "boolean",
      description: "Hace que el separator use todo el ancho del contenedor.",
    },
  },
  render: ({ width, stretch }) => `
    <div class="mars-story">
      <div class="mars-label">Separator · ${stretch ? "Stretch" : `${width}px`}</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        Spec base: 272px · 1px dashed · rgba(0, 0, 0, 0.231373)
      </div>
      <div class="story-card" style="display:flex;flex-direction:column;gap:12px;max-width:320px;">
        <span class="token-caption" style="color:var(--text-secondary)">Bloque superior</span>
        ${buildSeparator({ width, stretch })}
        <span class="token-caption" style="color:var(--text-secondary)">Bloque inferior</span>
      </div>
    </div>
  `,
};

export const Variants = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual del separator en su spec fija y en modo stretch dentro de un contenedor.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid-tight">
        <div class="story-card" style="display:flex;flex-direction:column;gap:12px;">
          <div class="mars-label">Default · 272px</div>
          ${buildSeparator({ width: 272 })}
        </div>
        <div class="story-card" style="display:flex;flex-direction:column;gap:12px;max-width:320px;">
          <div class="mars-label">Stretch</div>
          ${buildSeparator({ stretch: true })}
        </div>
      </div>
    </div>
  `,
};
