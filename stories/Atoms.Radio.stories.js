export default {
  title: "Atoms/Radio",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Playground de Radio por variante y estado.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Radio/Simple",
    state: "Active",
    label: "Guatemala",
    showDots: true,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Radio/Simple", "Radio/Flag"],
    },
    state: {
      control: "inline-radio",
      options: ["Active", "Inactive", "Disabled"],
    },
    label: { control: "text" },
    showDots: {
      control: "boolean",
      if: { arg: "variant", eq: "Radio/Flag" },
    },
  },
  render: ({ variant, state, label, showDots }) => {
    const isActive = state === "Active";
    const isDisabled = state === "Disabled";
    const radioId = `radio-${variant.replace("/", "-").toLowerCase()}-${state.toLowerCase()}`;
    const groupLabel = variant === "Radio/Simple" ? "Selección simple" : "Selección por bandera";
    const labelClasses = `radio-label ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`;

    if (variant === "Radio/Simple") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · State: ${state}</div>
          <div class="mars-label">Reference: simple radio states (Atoms)</div>
          <fieldset class="radio-group" style="max-width:420px">
            <legend class="sr-only">${groupLabel}</legend>
            <div class="radio-row">
              <label class="radio-option" for="${radioId}">
                <input
                  id="${radioId}"
                  class="radio-native"
                  type="radio"
                  name="radio-simple"
                  ${isActive ? "checked" : ""}
                  ${isDisabled ? "disabled" : ""}
                />
                <span class="radio-control" aria-hidden="true"></span>
                <span class="${labelClasses}">${label}</span>
              </label>
            </div>
          </fieldset>
        </div>
      `;
    }

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label">Reference: country selector list (Atoms)</div>
        <fieldset class="radio-group" style="max-width:420px">
          <legend class="sr-only">${groupLabel}</legend>
          <div class="radio-row">
            <label class="radio-option" for="${radioId}">
              <input
                id="${radioId}"
                class="radio-native"
                type="radio"
                name="radio-flag"
                ${isActive ? "checked" : ""}
                ${isDisabled ? "disabled" : ""}
              />
              <span class="radio-control" aria-hidden="true"></span>
              <span class="radio-flag-xl ${isActive ? "active" : ""}" aria-hidden="true">
                <img src="./images/guatemala-flag.png" alt="">
              </span>
              <span class="${labelClasses}">${label}</span>
            </label>
            ${
              showDots
                ? '<button type="button" class="radio-dots" aria-label="Más acciones"><i class="fa-regular fa-ellipsis-vertical" aria-hidden="true"></i></button>'
                : ""
            }
          </div>
        </fieldset>
      </div>
    `;
  },
};
