const minWidths = {
  large: { plain: 328, icon: 328 },
  medium: { plain: 129, icon: 167 },
  small: { plain: 84, icon: 100 },
};

export default {
  title: "Atoms/Buttons",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outlined"] },
    size: { control: "select", options: ["large", "medium", "small"] },
    disabled: { control: "boolean" },
    withIcon: { control: "boolean" },
    iconSide: { control: "inline-radio", options: ["left", "right"] },
    label: { control: "text" },
  },
};

export const Playground = {
  args: {
    variant: "primary",
    size: "medium",
    disabled: false,
    withIcon: true,
    iconSide: "left",
    label: "Continuar",
  },
  render: ({ variant, size, disabled, withIcon, iconSide, label }) => {
    const base = `btn btn-${variant} btn-${size} ${disabled ? "btn-disabled" : ""}`;
    const icon = `<i class="fa-regular fa-${iconSide === "left" ? "arrow-left" : "arrow-right"}"></i>`;
    const min = withIcon ? minWidths[size].icon : minWidths[size].plain;

    return `
      <div class="mars-story">
        <div class="mars-label">IDs de referencia (.pen): C6tBo, dkm5S, 5Jb7s</div>
        <button class="${base}" style="min-width:${min}px" ${disabled ? "disabled" : ""}>
          ${withIcon && iconSide === "left" ? icon : ""}
          ${label}
          ${withIcon && iconSide === "right" ? icon : ""}
        </button>
      </div>
    `;
  },
};

export const VariantMatrix = {
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <button class="btn btn-primary btn-medium" style="min-width:129px">Primary</button>
        <button class="btn btn-secondary btn-medium" style="min-width:129px">Secondary</button>
        <button class="btn btn-outlined btn-medium" style="min-width:129px">Outlined</button>
      </div>
    </div>
  `,
};
