import marsCss from "./mars.css?raw";
import catalogPagesCss from "../public/catalog-pages.css?raw";
import categoryPageHtml from "../category-page.html?raw";
import plpPageHtml from "../plp-page.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

const CATALOG_PAGES = [
  { key: "category-page", name: "Category Page", file: "category-page.html", html: categoryPageHtml },
  { key: "plp-page", name: "PLP Page", file: "plp-page.html", html: plpPageHtml },
];

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function inlineCatalogPagesCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/catalog-pages\.css"\s*\/?>\s*/i,
    `<style>${catalogPagesCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlineCatalogPagesCss(inlineMarsCss(html)));
}

function renderViewer() {
  const srcdocs = Object.fromEntries(CATALOG_PAGES.map((page) => [page.key, buildSrcdoc(page.html)]));
  const defaultKey = CATALOG_PAGES[0].key;
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "1100px";

  root.innerHTML = `
    <div class="mars-label">Pages · Category + PLP</div>
    <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
      Viewer simple para navegar entre los nuevos pages HTML construidos con componentes del sistema y guiados por Figma.
    </div>
    <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
      <div data-role="buttons" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"></div>
      <iframe title="Category and PLP Pages Viewer" style="${iframeStyle}"></iframe>
    </div>
  `;

  const iframe = root.querySelector("iframe");
  const buttonGroup = root.querySelector('[data-role="buttons"]');
  const buttons = CATALOG_PAGES.map((page) => {
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
  title: "Pages/Category + PLP",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sección Pages para visualizar **Category Page** y **PLP Page**, ambas construidas en HTML con los componentes existentes de Storybook: `Page Header`, `Plateu`, `Input/Search`, `HomeCard`, `Lists`, `Brand Item` y `Navigation`.",
      },
    },
  },
};

export const Viewer = {
  name: "Viewer",
  render: () => renderViewer(),
};

export const CategoryPage = {
  name: "Category Page",
  render: () => renderPage(CATALOG_PAGES[0]),
};

export const PLPPage = {
  name: "PLP Page",
  render: () => renderPage(CATALOG_PAGES[1]),
};
