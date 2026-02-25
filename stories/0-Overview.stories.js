export default {
  title: "MARS/Overview",
  tags: ["autodocs"],
};

export const IntegrationMap = {
  render: () => `
    <div class="mars-story">
      <h2 style="margin:0 0 8px;color:var(--primary-main)">MARS Storybook Integration</h2>
      <p style="margin:0 0 16px;color:var(--text-secondary)">
        Integración basada en <code>DS-MARS2.pen</code>, <code>ATOMIC-DESIGN-LIBRARY.md</code> y <code>ATOMIC-DESIGN-LIBRARY.html</code>.
      </p>
      <div class="mars-grid">
        <div>
          <div class="mars-label">Atoms (IDs .pen)</div>
          <ul>
            <li>Buttons: <code>C6tBo</code>, <code>dkm5S</code>, <code>5Jb7s</code></li>
            <li>Inputs: <code>FEiGu</code>, <code>XjC9T</code>, <code>PGNyG</code></li>
            <li>Dropdowns: <code>OVdKu</code>, <code>FaPFl</code>, <code>1rSxD</code></li>
          </ul>
        </div>
        <div>
          <div class="mars-label">Molecules (IDs .pen)</div>
          <ul>
            <li>Tiles: <code>g0RAt</code>, <code>X1bOv</code>, <code>1Zzry</code></li>
            <li>Strips: <code>nf2yE</code>, <code>pTOSN</code></li>
          </ul>
        </div>
        <div>
          <div class="mars-label">Organisms (IDs .pen)</div>
          <ul>
            <li>Navbar: <code>MHKUc</code></li>
            <li>Header logged: <code>WO8oM</code></li>
            <li>Status bar: <code>vf35d</code></li>
          </ul>
        </div>
      </div>
    </div>
  `,
};
