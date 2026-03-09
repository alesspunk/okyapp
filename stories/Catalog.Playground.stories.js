/**
 * Component Playground — DS-MARS v2
 * Full reference of all component categories in one view.
 */

const fullTiles = [
  { id: "g0RAt", name: "Comida",    image: "invitar.webp" },
  { id: "X1bOv", name: "Remesas",   image: "remesas.webp" },
  { id: "1Zzry", name: "Recargar",  image: "recargar.webp" },
  { id: "GY8MG", name: "Servicios", image: "servicios.webp" },
  { id: "i6hZs", name: "Super",     image: "supermercado.webp" },
  { id: "98sOw", name: "Doctor",    image: "doctor.webp" },
  { id: "9GR0B", name: "Giftcard",  image: "giftcard.webp" },
  { id: "oesZs", name: "Gas",       image: "gas.webp" },
  { id: "Rvm1L", name: "Ofertas",   image: "ofertas.webp" },
];

const halfTiles = [
  { id: "AqHu9", name: "Navidad",    image: "navidad.webp" },
  { id: "pEubm", name: "Recargas",   image: "recargas.webp" },
  { id: "fHlYu", name: "Multimarca", image: "multimarca.webp" },
];

function tile(t, half = false) {
  const cls = half ? "service-tile service-tile-half" : "service-tile";
  const iconCls = half ? "tile-icon tile-icon-half" : "tile-icon";
  return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="${cls}">
        <div class="${iconCls}"><img src="${t.image}" alt="${t.name}" /></div>
        <div class="tile-label">${t.name}</div>
      </div>
      <div style="font-size:10px;color:var(--text-secondary)">${t.id}</div>
    </div>`;
}

const faIcons = [
  { size: "Large · 40px",  cls: "fa-icon-lg", defId: "7r6Cm", actId: "v0Am1" },
  { size: "Medium · 32px", cls: "fa-icon-md", defId: "aLtcq", actId: "G1vvo" },
  { size: "Small · 24px",  cls: "fa-icon-sm", defId: "s3Hoi", actId: "X3XC4" },
];

export default {
  title: "Catalog/Playground",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Full component playground — DS-MARS v2. " +
          "All categories in one view: headers, icons, tiles, navbar.",
      },
    },
    layout: "fullscreen",
  },
};

export const FullPlayground = {
  name: "Full Playground",
  render: () => `
    <div style="background:#f5f5f5;padding:32px;font-family:'Nunito Sans',sans-serif">

      <!-- Title -->
      <h2 style="margin:0 0 4px;color:#552588;font-size:28px">Component Playground</h2>
      <p style="margin:0 0 32px;color:rgba(0,0,0,0.54);font-size:14px">DS-MARS v2 — Interactive component reference</p>

      <!-- ── APP HEADERS ───────────────────────────── -->
      <div class="mars-label" style="margin-bottom:8px">APP HEADERS</div>
      <div style="background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:20px;margin-bottom:24px;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="app-header">
              <button style="background:none;border:none;cursor:pointer;color:#552588;font-size:22px"><i class="fa-regular fa-bars"></i></button>
              <img class="header-logo" src="logo-oky.svg" alt="OKY" style="margin:0 auto" />
              <div class="header-left-group">
                <div class="header-cart-chip header-cart-empty"><i class="fa-regular fa-cart-shopping"></i></div>
                <button class="btn btn-primary btn-small">Login</button>
              </div>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Not Logged · ZPc9u</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="app-header">
              <button style="background:none;border:none;cursor:pointer;color:#552588;font-size:22px"><i class="fa-regular fa-bars"></i></button>
              <img class="header-logo" src="logo-oky.svg" alt="OKY" style="margin:0 auto" />
              <div class="header-left-group">
                <div style="position:relative;display:inline-flex">
                  <i class="fa-regular fa-bell header-icon"></i>
                  <span style="position:absolute;top:0;right:0;width:8px;height:8px;border-radius:50%;background:#18afa5;border:1.5px solid #fff"></span>
                </div>
              </div>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Logged / Empty Cart · WO8oM</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="app-header is-logged-cart">
              <button style="background:none;border:none;cursor:pointer;color:#552588;font-size:22px"><i class="fa-regular fa-bars"></i></button>
              <img class="header-logo" src="logo-oky.svg" alt="OKY" style="margin:0 auto" />
              <div class="header-left-group">
                <div class="header-cart-chip" style="background:#552588;border-color:#552588;color:#fff;gap:4px">
                  <span style="font-weight:700">2</span><i class="fa-regular fa-cart-shopping"></i>
                </div>
              </div>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Logged / Cart Full · ArMsV</span>
        </div>

      </div>

      <!-- ── PAGE HEADERS ──────────────────────────── -->
      <div class="mars-label" style="margin-bottom:8px">PAGE HEADERS</div>
      <div style="background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:20px;margin-bottom:24px;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="page-header">
              <button class="page-header-back"><i class="fa-regular fa-arrow-left" style="font-size:20px"></i></button>
              <span class="page-header-title">Page Title</span>
              <button class="page-header-action"><i class="fa-regular fa-cart-shopping" style="font-size:20px"></i></button>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Page Header / Screens · 6IKuE</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="page-header">
              <button class="page-header-back"><i class="fa-regular fa-arrow-left" style="font-size:20px"></i></button>
              <span class="page-header-title">Modal Title</span>
              <button class="page-header-action"><i class="fa-regular fa-xmark" style="font-size:22px"></i></button>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Page Header / Modal · 5mGYt</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div class="mars-mobile" style="overflow:hidden">
            <div class="bottom-nav">
              <div class="nav-item active"><i class="fa-regular fa-house" style="font-size:20px"></i><span class="nav-label">Home</span></div>
              <div class="nav-item"><i class="fa-regular fa-grid-2" style="font-size:20px"></i><span class="nav-label">Servicios</span></div>
              <div class="nav-item"><i class="fa-regular fa-ticket" style="font-size:20px"></i><span class="nav-label">Giftcards</span></div>
              <div class="nav-item"><i class="fa-regular fa-money-bill" style="font-size:20px"></i><span class="nav-label">Pagos</span></div>
              <div class="nav-item"><i class="fa-regular fa-bars" style="font-size:20px"></i><span class="nav-label">Menú</span></div>
            </div>
          </div>
          <span style="font-size:10px;color:rgba(0,0,0,0.54)">Navbar · MHKUc</span>
        </div>

      </div>

      <!-- ── FA ICONS ──────────────────────────────── -->
      <div class="mars-label" style="margin-bottom:8px">FA ICONS</div>
      <div style="background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:20px;margin-bottom:24px">
        <table style="border-collapse:collapse">
          <thead>
            <tr>
              <th style="background:#552588;color:#fff;padding:6px 12px;font-size:11px;text-align:left">Size</th>
              <th style="background:#552588;color:#fff;padding:6px 16px;font-size:11px;text-align:left">Default</th>
              <th style="background:#552588;color:#fff;padding:6px 16px;font-size:11px;text-align:left">Active</th>
            </tr>
          </thead>
          <tbody>
            ${faIcons.map((r) => `
              <tr>
                <td style="padding:12px;font-size:12px;color:rgba(0,0,0,0.54);white-space:nowrap">${r.size}</td>
                <td style="padding:12px 16px">
                  <span class="fa-icon ${r.cls}"><i class="fa-regular fa-house"></i></span>
                  <div style="font-size:10px;color:rgba(0,0,0,0.54);margin-top:4px">${r.defId}</div>
                </td>
                <td style="padding:12px 16px">
                  <span class="fa-icon ${r.cls} fa-icon-active"><i class="fa-solid fa-house"></i></span>
                  <div style="font-size:10px;color:rgba(0,0,0,0.54);margin-top:4px">${r.actId}</div>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <!-- ── CHIPS ─────────────────────────────────── -->
      <div class="mars-label" style="margin-bottom:8px">CHIPS</div>
      <div style="background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:20px;margin-bottom:24px">
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-new-item">Nuevo</span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">New item · 1913:1659</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-cart"><span>1</span><i class="fa-regular fa-cart-shopping"></i></span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">Cart · 9fXxZ</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-add0 chip-ds-shadow"><i class="fa-regular fa-plus"></i></span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">Add0 · DsDmy</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-qty chip-ds-shadow">
              <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
              <span class="chip-ds-number">1</span>
            </span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">Quantity · QtFxr</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-add1 chip-ds-shadow">
              <i class="fa-regular fa-trash chip-ds-pill-icon chip-ds-trash"></i>
              <span class="chip-ds-number">1</span>
              <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
            </span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">Add1 · BEpku</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
            <span class="chip-ds chip-ds-add2 chip-ds-shadow">
              <i class="fa-regular fa-minus chip-ds-pill-icon"></i>
              <span class="chip-ds-number">2</span>
              <i class="fa-regular fa-plus chip-ds-pill-icon"></i>
            </span>
            <span style="font-size:10px;color:rgba(0,0,0,0.54)">Add2 · AotiP</span>
          </div>
        </div>
      </div>

      <!-- ── MACRO TILES ───────────────────────────── -->
      <div class="mars-label" style="margin-bottom:8px">MACRO TILES</div>
      <div style="background:#fff;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:20px;margin-bottom:24px">
        <div style="font-size:12px;font-weight:700;color:#552588;margin-bottom:10px">Full Tiles</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
          ${fullTiles.map((t) => tile(t)).join("")}
        </div>
        <div style="font-size:12px;font-weight:700;color:#552588;margin-bottom:10px">Half Tiles</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${halfTiles.map((t) => tile(t, true)).join("")}
        </div>
      </div>

      <div style="font-size:11px;color:rgba(0,0,0,0.24);margin-top:8px">DS-MARS v2 — Component Playground</div>

    </div>
  `,
};
