export default {
  title: "Atoms/Inputs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Playground por componente, usando convención de nombres de variantes del sistema.",
      },
    },
  },
};

export const InputPlayground = {
  args: {
    variant: "Input/Search",
    state: "Hasvalue",
    placeholder: "Buscas marcas",
    value: "Pollo Campero",
    areaCode: "+502",
    phone: "6696-3223",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Input/Search", "Input/Phone"],
    },
    state: {
      control: "inline-radio",
      options: ["Empty", "Hasvalue"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    areaCode: { control: "text" },
    phone: { control: "text" },
  },
  render: ({ variant, state, placeholder, value, areaCode, phone }) => {
    if (variant === "Input/Phone") {
      const isHasValue = state === "Hasvalue";
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · State: ${state}</div>
          <div class="mars-label">IDs .pen: ${isHasValue ? "XjC9T" : "FEiGu"}</div>
          <div style="display:flex;gap:8px;align-items:flex-start;max-width:328px">
            <div class="input-wrapper" style="min-width:0;width:88px;flex-shrink:0">
              <input class="input-field" value="${isHasValue ? areaCode : ""}" placeholder="+502" style="padding-right:8px" />
              ${isHasValue ? '<div class="input-label">Área</div>' : ""}
            </div>
            <div class="input-wrapper" style="min-width:0;flex:1">
              ${
                isHasValue
                  ? '<span class="input-flag-left"><img src="./images/guatemala-flag.png" alt="Guatemala"></span>'
                  : ""
              }
              <input class="input-field ${isHasValue ? "input-has-flag input-has-clear" : ""}" value="${isHasValue ? phone : ""}" placeholder="6696-3223" />
              ${isHasValue ? '<div class="input-label" style="left:46px">Número de teléfono</div>' : ""}
              ${isHasValue ? '<i class="fa-regular fa-circle-xmark clear-icon icon-medium" style="display:flex"></i>' : ""}
            </div>
          </div>
        </div>
      `;
    }

    const isHasValue = state === "Hasvalue";
    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label">IDs .pen: ${isHasValue ? "xmKHs" : "PGNyG"}</div>
        <div class="input-wrapper">
          <i class="fa-regular fa-magnifying-glass search-icon"></i>
          <input class="input-field search-input" placeholder="${placeholder}" value="${isHasValue ? value : ""}" />
          ${isHasValue ? '<i class="fa-regular fa-circle-xmark clear-icon"></i>' : ""}
        </div>
      </div>
    `;
  },
};

export const DropdownPlayground = {
  args: {
    variant: "Dropdown/Country",
    state: "Hasvalue",
    placeholder: "Seleccionar país",
    value: "Estados Unidos",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Dropdown/Country", "Dropdown/Province"],
    },
    state: {
      control: "inline-radio",
      options: ["Empty", "Hasvalue"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
  },
  render: ({ variant, state, placeholder, value }) => {
    const isCountry = variant === "Dropdown/Country";
    const isHasValue = state === "Hasvalue";
    const variantId = isCountry
      ? isHasValue
        ? "FaPFl"
        : "OVdKu"
      : isHasValue
        ? "P0EWf"
        : "1rSxD";

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label">ID .pen: ${variantId}</div>
        <div class="input-wrapper">
          <div class="dropdown-control" role="combobox" aria-expanded="false">
            ${
              isCountry && !isHasValue
                ? '<span class="dropdown-icon-left"><i class="fa-regular fa-globe"></i></span>'
                : ""
            }
            ${
              isCountry && isHasValue
                ? '<span class="dropdown-flag-sm"><img src="./images/us.webp" alt="Estados Unidos"></span>'
                : ""
            }
            <span class="dropdown-text ${isHasValue ? "value" : "placeholder"}">${isHasValue ? value : placeholder}</span>
            <i class="fa-regular fa-chevron-down dropdown-chevron"></i>
          </div>
          ${
            isHasValue
              ? `<div class="dropdown-label">${isCountry ? "País" : "Provincia"}</div>`
              : ""
          }
        </div>
      </div>
    `;
  },
};
