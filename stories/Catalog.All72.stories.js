const atoms = [
  ["Buttons", 54, "C6tBo, AQ2sd, Pc8pk, ... cYmLO"],
  ["Input Fields", 4, "FEiGu, XjC9T, PGNyG, xmKHs"],
  ["Dropdowns", 4, "OVdKu, FaPFl, 1rSxD, P0EWf"],
  ["Status Bar", 1, "vf35d"],
];

const molecules = [
  ["Form Fields with Labels", 4, "Composite variants"],
  ["Search Bars", 2, "PGNyG, xmKHs"],
  ["Button Groups", 8, "Derived layout variants"],
];

const organisms = [
  ["Navigation", 2, "MHKUc + labels variant"],
  ["Headers", 2, "WO8oM, HpR9Z"],
  ["Macro Tiles Full", 10, "g0RAt ... Rvm1L"],
  ["Macro Tiles Half", 3, "AqHu9, pEubm, fHlYu"],
  ["Widgets", 5, "dvBFn, wnaYi, Eoc3A, JhhAI, eCjrS"],
  ["Category Card", 1, "IqRGM"],
  ["Carousel", 1, "62kJL"],
  ["Promotional Strips", 2, "72353:23990, 72353:23953"],
  ["Derived organism variants", 5, "Doc variants from HTML/MD"],
];

function rows(data) {
  return data
    .map(
      ([name, total, ids]) => `
    <tr>
      <td>${name}</td>
      <td>${total}</td>
      <td><code>${ids}</code></td>
    </tr>`
    )
    .join("");
}

export default {
  title: "Legacy/Catalog All 72",
  tags: ["autodocs"],
};

export const CoverageIndex = {
  render: () => `
    <div class="mars-story">
      <h2 style="margin:0 0 10px;color:var(--primary-main)">MARS - Storybook Coverage Index</h2>
      <p class="mars-subtitle">Objetivo: cubrir los 72 componentes documentados en <code>ATOMIC-DESIGN-LIBRARY.md</code>.</p>

      <h3 style="margin:0 0 8px;color:var(--primary-main)">Atoms (28 componentes, 63 variantes visuales)</h3>
      <table class="story-table">
        <thead><tr><th>Grupo</th><th>Total</th><th>IDs / referencia</th></tr></thead>
        <tbody>${rows(atoms)}</tbody>
      </table>

      <h3 style="margin:16px 0 8px;color:var(--primary-main)">Molecules (14)</h3>
      <table class="story-table">
        <thead><tr><th>Grupo</th><th>Total</th><th>IDs / referencia</th></tr></thead>
        <tbody>${rows(molecules)}</tbody>
      </table>

      <h3 style="margin:16px 0 8px;color:var(--primary-main)">Organisms (31)</h3>
      <table class="story-table">
        <thead><tr><th>Grupo</th><th>Total</th><th>IDs / referencia</th></tr></thead>
        <tbody>${rows(organisms)}</tbody>
      </table>

      <div style="margin-top:14px;padding:10px;border-radius:8px;background:#fff3e0;border:1px solid #ffdf9f">
        <strong>Total catalogado en Storybook:</strong> 73 componentes.
      </div>
    </div>
  `,
};
