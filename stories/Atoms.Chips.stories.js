export default {
  title: "Atoms/Chips",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Playground de Chips por variante del naming en DS-MARS.\n\n" +
          "Buenas practicas:\n" +
          "- Usa `Chips/New item` para etiquetar estados breves (ej. Nuevo).\n" +
          "- Mantén textos cortos en mayuscula para no romper el ancho visual.\n" +
          "- Conserva los tokens de color y elevacion para consistencia entre listas y cards.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Chips/Cart",
    count: 1,
    tagText: "Nuevo",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Chips/New item",
        "Chips/Cart",
        "Chips/Quantity Input / Add0 / Vales",
        "Chips/Quantity Input / Quantity/Gifcards/Giftcards",
        "Chips/Quantity Input / Add1 / Vales",
        "Chips/Quantity Input / Add2 / Vales",
      ],
    },
    count: { control: { type: "number", min: 0, max: 99, step: 1 } },
    tagText: { control: "text" },
  },
  render: ({ variant, count, tagText }) => {
    if (variant === "Chips/New item") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · ID Figma: 1913:1659</div>
          <span class="chip-ds chip-ds-new-item">${tagText || "Nuevo"}</span>
        </div>
      `;
    }

    if (variant === "Chips/Cart") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · ID .pen: 9fXxZ</div>
          <span class="chip-ds chip-ds-cart">
            <span>${count}</span>
            <i class="fa-regular fa-cart-shopping"></i>
          </span>
        </div>
      `;
    }

    if (variant === "Chips/Quantity Input / Add0 / Vales") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · ID .pen: DsDmy</div>
          <span class="chip-ds chip-ds-add0 chip-ds-shadow">
            <i class="fa-regular fa-plus"></i>
          </span>
        </div>
      `;
    }

    if (variant === "Chips/Quantity Input / Quantity/Gifcards/Giftcards") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · ID .pen: QtFxr</div>
          <span class="chip-ds chip-ds-qty chip-ds-shadow">
            <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
            <span class="chip-ds-number">${count}</span>
          </span>
        </div>
      `;
    }

    if (variant === "Chips/Quantity Input / Add1 / Vales") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · ID .pen: BEpku</div>
          <span class="chip-ds chip-ds-add1 chip-ds-shadow">
            <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
            <span class="chip-ds-number">${count}</span>
            <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
          </span>
        </div>
      `;
    }

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · ID .pen: AotiP</div>
        <span class="chip-ds chip-ds-add2 chip-ds-shadow">
          <i class="fa-regular fa-minus chip-ds-pill-icon"></i>
          <span class="chip-ds-number">${count}</span>
          <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
        </span>
      </div>
    `;
  },
};

export const Variants = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de todas las variantes disponibles de Chips, incluyendo `New item`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <div class="story-card">
          <div class="mars-label">New item · 1913:1659</div>
          <span class="chip-ds chip-ds-new-item">Nuevo</span>
        </div>
        <div class="story-card">
          <div class="mars-label">Cart · 9fXxZ</div>
          <span class="chip-ds chip-ds-cart"><span>1</span><i class="fa-regular fa-cart-shopping"></i></span>
        </div>
        <div class="story-card">
          <div class="mars-label">Add0 · DsDmy</div>
          <span class="chip-ds chip-ds-add0 chip-ds-shadow"><i class="fa-regular fa-plus"></i></span>
        </div>
        <div class="story-card">
          <div class="mars-label">Quantity · QtFxr</div>
          <span class="chip-ds chip-ds-qty chip-ds-shadow">
            <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
            <span class="chip-ds-number">1</span>
          </span>
        </div>
        <div class="story-card">
          <div class="mars-label">Add1 · BEpku</div>
          <span class="chip-ds chip-ds-add1 chip-ds-shadow">
            <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
            <span class="chip-ds-number">1</span>
            <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
          </span>
        </div>
        <div class="story-card">
          <div class="mars-label">Add2 · AotiP</div>
          <span class="chip-ds chip-ds-add2 chip-ds-shadow">
            <i class="fa-regular fa-minus chip-ds-pill-icon"></i>
            <span class="chip-ds-number">2</span>
            <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
          </span>
        </div>
      </div>
    </div>
  `,
};
