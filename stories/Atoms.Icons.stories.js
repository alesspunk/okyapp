export default {
  title: "Atoms/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "FA Icon component — 3 sizes (Large 40px, Medium 32px, Small 24px) × 2 states (Default, Active). " +
          "Active state uses Primary Main background with white icon.",
      },
    },
  },
};

export const Playground = {
  args: {
    size: "Large",
    state: "Default",
    icon: "house",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["Large", "Medium", "Small"],
    },
    state: {
      control: "inline-radio",
      options: ["Default", "Active"],
    },
    icon: { control: "text" },
  },
  render: ({ size, state, icon }) => {
    const sizeClass = { Large: "fa-icon-lg", Medium: "fa-icon-md", Small: "fa-icon-sm" }[size];
    const activeClass = state === "Active" ? " fa-icon-active" : "";
    const penIds = {
      "Large-Default": "7r6Cm", "Medium-Default": "aLtcq", "Small-Default": "s3Hoi",
      "Large-Active": "v0Am1", "Medium-Active": "G1vvo", "Small-Active": "X3XC4",
    };
    const penId = penIds[`${size}-${state}`];
    const iconWeight = state === "Active" ? "fa-solid" : "fa-regular";
    return `
      <div class="mars-story">
        <div class="mars-label">Icon/FA/${size}/${state} · ID .pen: ${penId}</div>
        <span class="fa-icon ${sizeClass}${activeClass}">
          <i class="${iconWeight} fa-${icon}"></i>
        </span>
      </div>
    `;
  },
};

export const AllSizes = {
  name: "All Sizes & States",
  render: () => {
    const sizes = [
      { label: "Large · 40px", cls: "fa-icon-lg", penDef: "7r6Cm", penAct: "v0Am1" },
      { label: "Medium · 32px", cls: "fa-icon-md", penDef: "aLtcq", penAct: "G1vvo" },
      { label: "Small · 24px",  cls: "fa-icon-sm", penDef: "s3Hoi", penAct: "X3XC4" },
    ];
    const icons = ["house", "bell", "gear", "magnifying-glass", "user", "cart-shopping"];

    const rows = sizes
      .map(
        (s) => `
        <tr>
          <td style="color:var(--text-secondary);font-size:12px;padding:12px 8px;white-space:nowrap">${s.label}</td>
          <td style="padding:12px 16px">
            <span class="fa-icon ${s.cls}"><i class="fa-regular fa-house"></i></span>
            <div style="font-size:10px;color:var(--text-secondary);margin-top:4px">Default · ${s.penDef}</div>
          </td>
          <td style="padding:12px 16px">
            <span class="fa-icon ${s.cls} fa-icon-active"><i class="fa-solid fa-house"></i></span>
            <div style="font-size:10px;color:var(--text-secondary);margin-top:4px">Active · ${s.penAct}</div>
          </td>
        </tr>`
      )
      .join("");

    const iconGrid = icons
      .map(
        (ic) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <span class="fa-icon fa-icon-lg"><i class="fa-regular fa-${ic}"></i></span>
          <span style="font-size:10px;color:var(--text-secondary)">${ic}</span>
        </div>`
      )
      .join("");

    return `
      <div class="mars-story">
        <h3 style="margin:0 0 4px;color:var(--primary-main)">FA Icon — Sizes & States</h3>
        <p class="mars-subtitle">Reusable components: Icon/FA/[Large|Medium|Small]/[Default|Active]</p>
        <table style="border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr>
              <th style="background:var(--primary-main);color:#fff;padding:8px 8px;text-align:left;font-size:11px">Size</th>
              <th style="background:var(--primary-main);color:#fff;padding:8px 16px;text-align:left;font-size:11px">Default</th>
              <th style="background:var(--primary-main);color:#fff;padding:8px 16px;text-align:left;font-size:11px">Active</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="mars-label" style="margin-bottom:8px">Sample icons (Default / Large)</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">${iconGrid}</div>
      </div>
    `;
  },
};
