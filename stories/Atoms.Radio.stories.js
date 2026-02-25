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
    const controlClasses = `radio-control ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`;
    const labelClasses = `radio-label ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`;

    if (variant === "Radio/Simple") {
      return `
        <div class="mars-story">
          <div class="mars-label">Variant: ${variant} · State: ${state}</div>
          <div class="mars-label">Reference: simple radio states (Atoms)</div>
          <div class="radio-group" style="max-width:420px">
            <div class="radio-row">
              <span class="${controlClasses}"></span>
              <span class="${labelClasses}">${label}</span>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${variant} · State: ${state}</div>
        <div class="mars-label">Reference: country selector list (Atoms)</div>
        <div class="radio-group" style="max-width:420px">
          <div class="radio-row">
            <span class="${controlClasses}"></span>
            <span class="radio-flag-xl ${isActive ? "active" : ""}">
              <img src="./images/guatemala-flag.png" alt="Guatemala">
            </span>
            <span class="${labelClasses}">${label}</span>
            ${showDots ? '<i class="fa-regular fa-ellipsis-vertical radio-dots"></i>' : ""}
          </div>
        </div>
      </div>
    `;
  },
};
