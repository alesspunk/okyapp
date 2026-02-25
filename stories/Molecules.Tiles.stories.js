const fullTileVariants = [
  {
    path: "Macro/Tile/Food",
    id: "g0RAt",
    name: "Invitar a Comer",
    image: "invitar.webp",
  },
  {
    path: "Macro/Tile/Money",
    id: "X1bOv",
    name: "Comparar Remesas",
    image: "remesas.webp",
  },
  {
    path: "Macro/Tile/Mobile Topup",
    id: "1Zzry",
    name: "Recargar el Móvil",
    image: "recargar.webp",
  },
  {
    path: "Macro/Tile/Bill Payment",
    id: "GY8MG",
    name: "Pagar Servicios",
    image: "servicios.webp",
  },
];

const halfTileVariants = [
  {
    path: "Macro/HalfTile/Seasonal",
    id: "AqHu9",
    name: "Navidad",
    image: "navidad.webp",
  },
  {
    path: "Macro/HalfTile/Topup",
    id: "pEubm",
    name: "Recargas",
    image: "recargas.webp",
  },
  {
    path: "Macro/HalfTile/Multi-Brand",
    id: "fHlYu",
    name: "Multimarca",
    image: "multimarca.webp",
  },
];

function renderTile(tile, half = false) {
  const classes = half ? "service-tile service-tile-half" : "service-tile";
  const iconClass = half ? "tile-icon tile-icon-half" : "tile-icon";
  return `
    <div class="${classes}">
      <div class="${iconClass}">
        <img src="${tile.image}" alt="${tile.name}" />
      </div>
      <div class="tile-label">${tile.name}</div>
    </div>
  `;
}

const allTileVariants = [...fullTileVariants, ...halfTileVariants];
const variantPaths = allTileVariants.map((tile) => tile.path);
const tileImages = [...new Set(allTileVariants.map((tile) => tile.image))];

function findTileByPath(path) {
  return allTileVariants.find((tile) => tile.path === path) ?? allTileVariants[0];
}

export default {
  title: "Molecules/Tiles",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Playground de Macro/Tile y Macro/HalfTile para variar path, size, label e imagen.",
      },
    },
  },
};

export const Playground = {
  args: {
    variantPath: "Macro/Tile/Money",
    sizeMode: "auto",
    label: "Comparar Remesas",
    image: "remesas.webp",
    useCustomImage: false,
    customImage: "",
    showMeta: true,
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: variantPaths,
    },
    sizeMode: {
      control: "inline-radio",
      options: ["auto", "full", "half"],
    },
    label: { control: "text" },
    image: {
      control: "select",
      options: tileImages,
    },
    useCustomImage: { control: "boolean" },
    customImage: { control: "text" },
    showMeta: { control: "boolean" },
  },
  render: ({ variantPath, sizeMode, label, image, useCustomImage, customImage, showMeta }) => {
    const baseTile = findTileByPath(variantPath);
    const isHalf =
      sizeMode === "auto" ? baseTile.path.startsWith("Macro/HalfTile/") : sizeMode === "half";
    const tile = {
      ...baseTile,
      name: label || baseTile.name,
      image: useCustomImage && customImage ? customImage : image || baseTile.image,
    };

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${tile.path} · Size: ${isHalf ? "Half (103x85)" : "Full (103x130)"}</div>
        ${showMeta ? `<div class="mars-label">ID .pen: ${tile.id}</div>` : ""}
        ${renderTile(tile, isHalf)}
      </div>
    `;
  },
};

export const ServiceTiles = {
  parameters: {
    docs: {
      description: {
        story: "Tile variants grouped by Macro full and Macro half definitions.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Macro/Tile/*</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px">
        ${fullTileVariants
          .map(
            (tile) => `
              <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
                ${renderTile(tile)}
                <div style="font-size:11px;color:var(--text-secondary)">${tile.path} · ${tile.id}</div>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="mars-label">Macro/HalfTile/*</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${halfTileVariants
          .map(
            (tile) => `
              <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
                ${renderTile(tile, true)}
                <div style="font-size:11px;color:var(--text-secondary)">${tile.path} · ${tile.id}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `,
};

export const MacroTileMoney = {
  name: "Macro/Tile/Money",
  parameters: {
    docs: {
      description: {
        story: "Focused variant for Money tile (`X1bOv`).",
      },
    },
  },
  render: () => {
    const tile = fullTileVariants.find((item) => item.path === "Macro/Tile/Money");
    return `
      <div class="mars-story">
        <div class="mars-label">${tile.path}</div>
        <div style="display:flex;gap:16px;align-items:flex-start">
          ${renderTile(tile)}
          <div class="story-card" style="min-width:240px">
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">Component ID</div>
            <div style="font-weight:700;color:var(--primary-main);margin-bottom:10px">${tile.id}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">Label</div>
            <div style="font-weight:600">${tile.name}</div>
          </div>
        </div>
      </div>
    `;
  },
};

export const MacroHalfTileSeasonal = {
  name: "Macro/HalfTile/Seasonal",
  parameters: {
    docs: {
      description: {
        story: "Focused variant for Seasonal half tile (`AqHu9`).",
      },
    },
  },
  render: () => {
    const tile = halfTileVariants.find((item) => item.path === "Macro/HalfTile/Seasonal");
    return `
      <div class="mars-story">
        <div class="mars-label">${tile.path}</div>
        <div style="display:flex;gap:16px;align-items:flex-start">
          ${renderTile(tile, true)}
          <div class="story-card" style="min-width:240px">
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">Component ID</div>
            <div style="font-weight:700;color:var(--primary-main);margin-bottom:10px">${tile.id}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">Label</div>
            <div style="font-weight:600">${tile.name}</div>
          </div>
        </div>
      </div>
    `;
  },
};
