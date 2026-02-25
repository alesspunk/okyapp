export default {
  title: "Atoms/Chips",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Playground de Chips por variante del naming en DS-MARS.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Chips/Cart",
    count: 1,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Chips/Cart",
        "Chips/Quantity Input / Add0 / Vales",
        "Chips/Quantity Input / Quantity/Gifcards/Giftcards",
        "Chips/Quantity Input / Add1 / Vales",
        "Chips/Quantity Input / Add2 / Vales",
      ],
    },
    count: { control: { type: "number", min: 0, max: 99, step: 1 } },
  },
  render: ({ variant, count }) => {
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
