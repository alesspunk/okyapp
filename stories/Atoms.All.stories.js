const buttonTypes = [
  { key: "primary", label: "Primary", ids: ["C6tBo", "AQ2sd", "Pc8pk"] },
  { key: "secondary", label: "Secondary", ids: ["eTIc3", "Aimqt", "bESQi"] },
  { key: "outlined", label: "Outlined", ids: ["CG4TO", "nVicC", "QaRKY"] },
];

const sizes = [
  { key: "large", label: "Large", plain: 328, icon: 328 },
  { key: "medium", label: "Medium", plain: 129, icon: 167 },
  { key: "small", label: "Small", plain: 84, icon: 100 },
];

const iconBySide = {
  left: "arrow-left",
  right: "arrow-right",
};

function buttonCell(type, size, withIcon, side, disabled) {
  const icon = withIcon ? `<i class="fa-regular fa-${iconBySide[side]}"></i>` : "";
  const min = withIcon ? size.icon : size.plain;
  const label = `${size.label} ${withIcon ? side : "default"}`;
  const classes = `btn btn-${type.key} btn-${size.key} ${disabled ? "btn-disabled" : ""}`;
  return `<button class="${classes}" style="min-width:${min}px" ${disabled ? "disabled" : ""}>${
    withIcon && side === "left" ? icon : ""
  }${label}${withIcon && side === "right" ? icon : ""}</button>`;
}

export default {
  title: "Legacy/Atoms All",
  tags: ["autodocs"],
};

export const ButtonVariants54 = {
  parameters: {
    docs: {
      description: {
        story:
          "Cobertura completa de botones: 54 variantes (3 tipos x 3 tamanos x 3 configuraciones [default/left/right] x 2 estados).",
      },
    },
  },
  render: () => {
    let html = `<div class="mars-story"><h3 style="margin:0 0 10px;color:var(--primary-main)">Buttons (54 variants)</h3><div class="mars-subtitle">IDs base .pen por tipo: Primary (C6tBo, AQ2sd, Pc8pk), Secondary (eTIc3, Aimqt, bESQi), Outlined (CG4TO, nVicC, QaRKY)</div>`;
    buttonTypes.forEach((type) => {
      html += `<div class="story-card" style="margin-bottom:16px"><div class="mars-label">${type.label}</div><div style="display:flex;flex-direction:column;gap:10px">`;
      sizes.forEach((size) => {
        html += `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span style="min-width:70px;font-size:12px;color:var(--text-secondary)">${size.label}</span>`;
        html += buttonCell(type, size, false, "left", false);
        html += buttonCell(type, size, true, "left", false);
        html += buttonCell(type, size, true, "right", false);
        html += buttonCell(type, size, false, "left", true);
        html += buttonCell(type, size, true, "left", true);
        html += buttonCell(type, size, true, "right", true);
        html += `</div>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;
    return html;
  },
};

export const InputsDropdownsStatus = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Inputs + Dropdowns + Status</h3>
      <div class="mars-subtitle">Atoms IDs: FEiGu, XjC9T, PGNyG, xmKHs, OVdKu, FaPFl, 1rSxD, P0EWf, vf35d</div>
      <div class="mars-grid">
        <div class="story-card">
          <div class="mars-label">Phone empty (FEiGu)</div>
          <div style="display:flex;gap:8px">
            <div class="input-wrapper" style="width:88px"><input class="input-field" placeholder="+502" /></div>
            <div class="input-wrapper"><input class="input-field" placeholder="6696-3223" /></div>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Phone value (XjC9T)</div>
          <div style="display:flex;gap:8px">
            <div class="input-wrapper" style="width:88px"><input class="input-field" value="+502" /><span class="input-label">Area</span></div>
            <div class="input-wrapper"><input class="input-field" value="6696-3223" /><span class="input-label">Numero</span></div>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Search empty/value (PGNyG, xmKHs)</div>
          <div class="input-wrapper" style="margin-bottom:8px">
            <i class="fa-regular fa-magnifying-glass search-icon"></i><input class="input-field search-input search-input-empty" placeholder="Buscas marcas" />
          </div>
          <div class="input-wrapper">
            <i class="fa-regular fa-magnifying-glass search-icon"></i><input class="input-field search-input search-input-hasvalue" value="Pollo Campero" /><i class="fa-regular fa-circle-xmark clear-icon search-clear-icon"></i>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Dropdown country empty (OVdKu)</div>
          <div class="dropdown-control"><i class="fa-regular fa-globe"></i><span class="dropdown-text placeholder">Seleccionar pais</span><i class="fa-regular fa-chevron-down"></i></div>
        </div>
        <div class="story-card">
          <div class="mars-label">Dropdown country value (FaPFl)</div>
          <div class="dropdown-control"><span class="dropdown-flag-sm"><img src="us.webp" alt="US" /></span><span class="dropdown-text">Estados Unidos</span><i class="fa-regular fa-chevron-down"></i></div>
        </div>
        <div class="story-card">
          <div class="mars-label">Dropdown province (1rSxD, P0EWf)</div>
          <div class="dropdown-control" style="margin-bottom:8px"><span class="dropdown-text placeholder">Seleccionar provincia</span><i class="fa-regular fa-chevron-down"></i></div>
          <div class="dropdown-control"><span class="dropdown-text">Alta Verapaz</span><i class="fa-regular fa-chevron-down"></i></div>
        </div>
        <div class="story-card">
          <div class="mars-label">Status bar (vf35d)</div>
          <div class="status-bar">
            <div>9:41</div>
            <div style="display:flex;gap:8px"><i class="fa-regular fa-signal"></i><i class="fa-regular fa-wifi"></i><i class="fa-regular fa-battery-full"></i></div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const RadioAndChips = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Radio + Chips</h3>
      <div class="mars-subtitle">Chips IDs: 9fXxZ, DsDmy, QtFxr, BEpku, AotiP</div>
      <div class="mars-grid">
        <div class="story-card">
          <div class="mars-label">Radio simple</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div><span style="display:inline-block;width:22px;height:22px;border:2px solid var(--primary-main);border-radius:50%;vertical-align:middle;margin-right:8px"></span>Activa</div>
            <div><span style="display:inline-block;width:22px;height:22px;border:2px solid var(--text-secondary);border-radius:50%;vertical-align:middle;margin-right:8px"></span>Inactiva</div>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Chip cart (9fXxZ)</div>
          <span class="chip-ds chip-ds-cart"><span>1</span><i class="fa-regular fa-cart-shopping"></i></span>
        </div>
        <div class="story-card">
          <div class="mars-label">Chip add0 (DsDmy)</div>
          <span class="chip-ds chip-ds-add0"><i class="fa-regular fa-plus"></i></span>
        </div>
        <div class="story-card">
          <div class="mars-label">Chip qty (QtFxr)</div>
          <span class="chip-ds chip-ds-pill chip-ds-qty"><i class="fa-regular fa-trash"></i><span>1</span></span>
        </div>
        <div class="story-card">
          <div class="mars-label">Chip add1/add2 (BEpku, AotiP)</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span class="chip-ds chip-ds-pill chip-ds-add"><i class="fa-regular fa-trash"></i><span>1</span><i class="fa-regular fa-plus"></i></span>
            <span class="chip-ds chip-ds-pill chip-ds-add"><i class="fa-regular fa-minus"></i><span>2</span><i class="fa-regular fa-plus"></i></span>
          </div>
        </div>
      </div>
    </div>
  `,
};
