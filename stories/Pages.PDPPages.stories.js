import marsCss from "./mars.css?raw";
import pdpPagesCss from "../public/pdp-pages.css?raw";
import pdpPage1Html from "../pdp-page-1.html?raw";
import pdpPage2Html from "../pdp-page-2.html?raw";
import pdpPage3Html from "../pdp-page-3.html?raw";
import pdpPage4Html from "../pdp-page-4.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

const PDP_PAGES = [
  { key: "pdp-page-1", name: "PDP Page 1", file: "pdp-page-1.html", html: pdpPage1Html },
  { key: "pdp-page-2", name: "PDP Page 2", file: "pdp-page-2.html", html: pdpPage2Html },
  { key: "pdp-page-3", name: "PDP Page 3", file: "pdp-page-3.html", html: pdpPage3Html },
  { key: "pdp-page-4", name: "PDP Page 4", file: "pdp-page-4.html", html: pdpPage4Html },
];

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function inlinePdpPagesCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/pdp-pages\.css"\s*\/?>\s*/i,
    `<style>${pdpPagesCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlinePdpPagesCss(inlineMarsCss(html)));
}

function renderViewer() {
  const srcdocs = Object.fromEntries(PDP_PAGES.map((page) => [page.key, buildSrcdoc(page.html)]));
  const defaultKey = PDP_PAGES[0].key;
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "1100px";

  root.innerHTML = `
    <div class="mars-label">Pages · PDP Pages</div>
    <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
      Viewer simple para navegar entre las 4 páginas PDP HTML, construidas solo con componentes y tokens existentes.
    </div>
    <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
      <div data-role="buttons" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"></div>
      <iframe title="PDP Pages Viewer" style="${iframeStyle}"></iframe>
    </div>
  `;

  const iframe = root.querySelector("iframe");
  const buttonGroup = root.querySelector('[data-role="buttons"]');
  const buttons = PDP_PAGES.map((page) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = page.key;
    button.textContent = page.name;
    button.style.border = "1px solid rgba(0,0,0,0.12)";
    button.style.background = "#fff";
    button.style.borderRadius = "999px";
    button.style.padding = "8px 14px";
    button.style.font = "700 14px/1 'Nunito Sans',sans-serif";
    button.style.color = "#552588";
    button.style.cursor = "pointer";
    buttonGroup.appendChild(button);
    return button;
  });

  function updateActiveState(activeKey) {
    buttons.forEach((button) => {
      const active = button.dataset.key === activeKey;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.style.background = active ? "#552588" : "#fff";
      button.style.color = active ? "#fff" : "#552588";
      button.style.borderColor = active ? "#552588" : "rgba(0,0,0,0.12)";
    });
  }

  function render(key) {
    const safeKey = srcdocs[key] ? key : defaultKey;
    iframe.srcdoc = srcdocs[safeKey];
    updateActiveState(safeKey);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => render(button.dataset.key));
  });

  render(defaultKey);
  return root;
}

function renderPage(page) {
  const srcdoc = buildSrcdoc(page.html);
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "420px";
  root.innerHTML = `
    <div class="mars-label">${page.name}</div>
    <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">${page.file}</div>
    <iframe title="${page.name}" style="${iframeStyle}"></iframe>
  `;
  root.querySelector("iframe").srcdoc = srcdoc;
  return root;
}

export default {
  title: "Pages/PDP Pages",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sección Pages para navegar entre 4 páginas PDP HTML. Cada composición usa únicamente componentes, variantes y tokens ya existentes del sistema: `PDP Header`, `Page Header`, `Brand Item`, `Middle Card`, `Input / Dinamic`, `Slider`, `Summary Box`, `Navigation` y `Plateu`.",
      },
    },
  },
};

export const Viewer = {
  name: "Viewer",
  render: () => renderViewer(),
};

export const PDPPage1 = {
  name: "PDP Page 1",
  render: () => renderPage(PDP_PAGES[0]),
};

export const PDPPage2 = {
  name: "PDP Page 2",
  render: () => renderPage(PDP_PAGES[1]),
};

export const PDPPage3 = {
  name: "PDP Page 3",
  render: () => renderPage(PDP_PAGES[2]),
};

export const PDPPage4 = {
  name: "PDP Page 4",
  render: () => renderPage(PDP_PAGES[3]),
};
