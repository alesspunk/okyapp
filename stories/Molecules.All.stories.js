const fullTiles = [
  ["g0RAt", "Invitar a Comer", "invitar.webp"],
  ["X1bOv", "Comparar Remesas", "remesas.webp"],
  ["1Zzry", "Recargar el Movil", "recargar.webp"],
  ["GY8MG", "Pagar Servicios", "servicios.webp"],
  ["i6hZs", "Mandar el Super", "super.webp"],
  ["98sOw", "Cuidar la Salud", "doctor.webp"],
  ["9GR0B", "Equipo su Hogar", "regalos.webp"],
  ["oesZs", "Llenar el Tanque", "gas.webp"],
  ["2yJIx", "Mejorar el Hogar", "home.webp"],
  ["Rvm1L", "Ver Ofertas", "promo-strips1.webp"],
];

const halfTiles = [
  ["AqHu9", "Navidad", "navidad.webp"],
  ["pEubm", "Recargas", "recargas.webp"],
  ["fHlYu", "Multimarca", "multimarca.webp"],
];

export default {
  title: "Legacy/Molecules All",
  tags: ["autodocs"],
};

export const FormMolecules = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Molecules - Form/Field Compositions (14)</h3>
      <div class="mars-subtitle">Incluye composiciones de phone/search/dropdowns y grupos de botones.</div>
      <div class="mars-grid">
        <div class="story-card"><div class="mars-label">Phone + label</div><div style="display:flex;gap:8px"><input class="input-field" style="width:88px" value="+502"/><input class="input-field" value="6696-3223"/></div></div>
        <div class="story-card"><div class="mars-label">Country + flag + label</div><div class="dropdown-control"><span class="dropdown-flag-sm"><img src="us.webp"/></span><span class="dropdown-text">Estados Unidos</span><i class="fa-regular fa-chevron-down"></i></div></div>
        <div class="story-card"><div class="mars-label">Province + label</div><div class="dropdown-control"><span class="dropdown-text">Alta Verapaz</span><i class="fa-regular fa-chevron-down"></i></div></div>
        <div class="story-card"><div class="mars-label">Search bar</div><div class="input-wrapper"><i class="fa-regular fa-magnifying-glass search-icon"></i><input class="input-field search-input" value="Pollo Campero" /></div></div>
      </div>
    </div>
  `,
};

export const MacroTiles13 = {
  parameters: {
    docs: {
      description: { story: "Cobertura de 10 Full Tiles + 3 Half Tiles." },
    },
  },
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Macro Tiles (13)</h3>
      <div class="mars-label">Full tiles</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px">
        ${fullTiles
          .map(
            ([id, name, img]) => `
          <div class="service-tile">
            <div class="tile-icon"><img src="${img}" alt="${name}"/></div>
            <div class="tile-label">${name}</div>
            <div style="font-size:10px;color:var(--text-secondary)">${id}</div>
          </div>`
          )
          .join("")}
      </div>
      <div class="mars-label">Half tiles</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        ${halfTiles
          .map(
            ([id, name, img]) => `
          <div class="service-tile service-tile-half">
            <div class="tile-icon tile-icon-half"><img src="${img}" alt="${name}"/></div>
            <div class="tile-label">${name}</div>
            <div style="font-size:10px;color:var(--text-secondary)">${id}</div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `,
};
