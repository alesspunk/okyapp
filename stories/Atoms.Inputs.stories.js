export default {
  title: "Atoms/Inputs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Playground por componente, usando convención de nombres de variantes del sistema. Incluye `Input/Search`, `Input/Phone` y la nueva variante `Input/Dinamic` para montos en dinero.",
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
    currencySymbol: "$",
    helperText: "Desde 10 hasta 1000",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Input/Search", "Input/Phone", "Input/Dinamic"],
    },
    state: {
      control: "inline-radio",
      options: ["Empty", "Hasvalue"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    areaCode: { control: "text" },
    phone: { control: "text" },
    currencySymbol: {
      control: "inline-radio",
      options: ["Q", "$"],
    },
    helperText: { control: "text" },
  },
  render: ({ variant, state, placeholder, value, areaCode, phone, currencySymbol, helperText }) => {
    const safeState = state.toLowerCase();

    if (variant === "Input/Dinamic") {
      const isHasValue = state === "Hasvalue";
      const dynamicInputId = `input-dinamic-${safeState}`;
      const dynamicLabelId = `${dynamicInputId}-label`;

      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · State: ${state}</div>
          <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
            Recomendado: placeholder máx. 16 caracteres ("Ingresa el monto") · helper text máx. 19 ("Desde 10 hasta 1000") · monto máx. 7 caracteres ("40.00").
          </div>
          <div class="mars-label">IDs .pen: ${isHasValue ? "7359:96469" : "7359:96511"}</div>
          <div class="input-wrapper">
            ${
              isHasValue
                ? `<label id="${dynamicLabelId}" class="input-label input-label-dinamic" for="${dynamicInputId}">${helperText}</label>`
                : ""
            }
            ${
              isHasValue
                ? `<span class="input-dinamic-prefix" aria-hidden="true">${currencySymbol}</span>`
                : ""
            }
            <input
              id="${dynamicInputId}"
              class="input-field input-dinamic ${isHasValue ? "input-dinamic-hasvalue" : "input-dinamic-empty"}"
              type="text"
              inputmode="decimal"
              name="dinamic-amount"
              placeholder="${placeholder}"
              value="${isHasValue ? value : ""}"
              ${isHasValue ? `aria-labelledby="${dynamicLabelId}"` : `aria-label="${placeholder}"`}
            />
          </div>
        </div>
      `;
    }

    if (variant === "Input/Phone") {
      const isHasValue = state === "Hasvalue";
      const areaInputId = `input-phone-area-${safeState}`;
      const phoneInputId = `input-phone-number-${safeState}`;
      const areaLabelId = `${areaInputId}-label`;
      const phoneLabelId = `${phoneInputId}-label`;

      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · State: ${state}</div>
          <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
            Recomendado: Área máx. 4 caracteres (+502) · Número máx. 9 caracteres (6696-3223).
          </div>
          <div class="mars-label">IDs .pen: ${isHasValue ? "XjC9T" : "FEiGu"}</div>
          <div style="display:flex;gap:8px;align-items:flex-start;max-width:328px">
            <div class="input-wrapper" style="min-width:0;width:88px;flex-shrink:0">
              <input
                id="${areaInputId}"
                class="input-field"
                type="tel"
                inputmode="tel"
                name="area-code"
                value="${isHasValue ? areaCode : ""}"
                placeholder="+502"
                style="padding-right:8px"
                ${isHasValue ? `aria-labelledby="${areaLabelId}"` : 'aria-label="Código de área"'}
              />
              ${
                isHasValue
                  ? `<label id="${areaLabelId}" class="input-label" for="${areaInputId}">Área</label>`
                  : ""
              }
            </div>
            <div class="input-wrapper" style="min-width:0;flex:1">
              ${
                isHasValue
                  ? '<span class="input-flag-left" aria-hidden="true"><img src="./images/guatemala-flag.png" alt=""></span>'
                  : ""
              }
              <input
                id="${phoneInputId}"
                class="input-field ${isHasValue ? "input-has-flag input-has-clear" : ""}"
                type="tel"
                inputmode="tel"
                name="phone-number"
                value="${isHasValue ? phone : ""}"
                placeholder="6696-3223"
                ${isHasValue ? `aria-labelledby="${phoneLabelId}"` : 'aria-label="Número de teléfono"'}
              />
              ${
                isHasValue
                  ? `<label id="${phoneLabelId}" class="input-label" style="left:46px" for="${phoneInputId}">Número de teléfono</label>`
                  : ""
              }
              ${
                isHasValue
                  ? '<button class="icon-button clear-icon icon-medium" type="button" aria-label="Limpiar número de teléfono"><i class="fa-regular fa-circle-xmark" aria-hidden="true"></i></button>'
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    }

    const isHasValue = state === "Hasvalue";
    const searchInputId = `input-search-${safeState}`;

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo 13 caracteres en placeholder/value (base: "Buscas marcas").
        </div>
        <div class="mars-label">IDs .pen: ${isHasValue ? "xmKHs" : "PGNyG"}</div>
        <div class="input-wrapper">
          <i class="fa-regular fa-magnifying-glass search-icon" aria-hidden="true"></i>
          <input
            id="${searchInputId}"
            class="input-field search-input ${isHasValue ? "search-input-hasvalue" : "search-input-empty"}"
            type="search"
            name="search"
            placeholder="${placeholder}"
            value="${isHasValue ? value : ""}"
            aria-label="${placeholder}"
          />
          ${
            isHasValue
              ? '<button class="icon-button clear-icon search-clear-icon" type="button" aria-label="Limpiar búsqueda"><i class="fa-regular fa-circle-xmark" aria-hidden="true"></i></button>'
              : ""
          }
        </div>
      </div>
    `;
  },
};

export const DynamicInputReference = {
  name: "Dynamic Input — Reference",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia rápida de los dos estados de `Input/Dinamic`: placeholder y has value.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <div class="story-card">
          <div class="mars-label">Input/Dinamic · Empty · 7359:96511</div>
          <div class="input-wrapper">
            <input
              class="input-field input-dinamic input-dinamic-empty"
              type="text"
              inputmode="decimal"
              placeholder="Ingresa el monto"
              aria-label="Ingresa el monto"
            />
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Input/Dinamic · Hasvalue · 7359:96469</div>
          <div class="input-wrapper">
            <label id="dynamic-input-reference-label" class="input-label input-label-dinamic" for="dynamic-input-reference">Desde 10 hasta 1000</label>
            <span class="input-dinamic-prefix" aria-hidden="true">$</span>
            <input
              id="dynamic-input-reference"
              class="input-field input-dinamic input-dinamic-hasvalue"
              type="text"
              inputmode="decimal"
              value="40.00"
              aria-labelledby="dynamic-input-reference-label"
            />
          </div>
        </div>
      </div>
    </div>
  `,
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
    const controlId = `dropdown-${isCountry ? "country" : "province"}-${state.toLowerCase()}`;
    const labelId = `${controlId}-label`;
    const displayId = `${controlId}-value`;
    const listboxId = `${controlId}-listbox`;

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: placeholder máx. 16 caracteres (base: "Seleccionar país") · value máx. 14 ("Estados Unidos").
        </div>
        <div class="mars-label">ID .pen: ${variantId}</div>
        <div class="input-wrapper">
          ${
            isHasValue
              ? `<label id="${labelId}" class="dropdown-label" for="${controlId}">${isCountry ? "País" : "Provincia"}</label>`
              : ""
          }
          <div
            id="${controlId}"
            class="dropdown-control"
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-controls="${listboxId}"
            aria-labelledby="${isHasValue ? `${labelId} ${displayId}` : displayId}"
            tabindex="0"
          >
            ${
              isCountry && !isHasValue
                ? '<span class="dropdown-icon-left" aria-hidden="true"><i class="fa-regular fa-globe"></i></span>'
                : ""
            }
            ${
              isCountry && isHasValue
                ? '<span class="dropdown-flag-sm" aria-hidden="true"><img src="./images/us.webp" alt=""></span>'
                : ""
            }
            <span id="${displayId}" class="dropdown-text ${isHasValue ? "value" : "placeholder"}">${isHasValue ? value : placeholder}</span>
            <i class="fa-regular fa-chevron-down dropdown-chevron" aria-hidden="true"></i>
          </div>
          <ul id="${listboxId}" role="listbox" hidden aria-label="Opciones de ${isCountry ? "país" : "provincia"}"></ul>
        </div>
      </div>
    `;
  },
};
