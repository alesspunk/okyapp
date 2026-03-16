import marsCss from "./mars.css?raw";
import checkoutPagesCss from "../public/checkout-pages.css?raw";
import checkoutPageHtml from "../checkout-page.html?raw";
import checkoutMockupHtml from "../checkout-mockup.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

const CHECKOUT_SCREENS = [
  { key: "checkout-page", name: "Checkout Page", file: "checkout-page.html", html: checkoutPageHtml },
  { key: "checkout-mockup", name: "Checkout Mockup", file: "checkout-mockup.html", html: checkoutMockupHtml },
];

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function inlineCheckoutPagesCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/checkout-pages\.css"\s*\/?>\s*/i,
    `<style>${checkoutPagesCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlineCheckoutPagesCss(inlineMarsCss(html)));
}

function renderViewer() {
  const srcdocs = Object.fromEntries(CHECKOUT_SCREENS.map((screen) => [screen.key, buildSrcdoc(screen.html)]));
  const defaultKey = CHECKOUT_SCREENS[0].key;
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "1100px";

  root.innerHTML = `
    <div class="mars-label">Pages · Checkout</div>
    <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
      Viewer para navegar entre el nuevo checkout HTML y su mockup companion, ambos guiados por Figma y construidos con componentes del sistema.
    </div>
    <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
      <div data-role="buttons" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"></div>
      <iframe title="Checkout Viewer" style="${iframeStyle}"></iframe>
    </div>
  `;

  const iframe = root.querySelector("iframe");
  const buttonGroup = root.querySelector('[data-role="buttons"]');
  const buttons = CHECKOUT_SCREENS.map((screen) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = screen.key;
    button.textContent = screen.name;
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

function renderScreen(screen) {
  const srcdoc = buildSrcdoc(screen.html);
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "420px";
  root.innerHTML = `
    <div class="mars-label">${screen.name}</div>
    <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">${screen.file}</div>
    <iframe title="${screen.name}" style="${iframeStyle}"></iframe>
  `;
  root.querySelector("iframe").srcdoc = srcdoc;
  return root;
}

export default {
  title: "Pages/Checkout",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sección Pages para visualizar el nuevo **Checkout Page** y **Checkout Mockup**, usando `Page Header`, `Brand Carrousel`, `Dual Input`, `Promo Code` y `Summary Box`, con layout guiado por Figma y consistencia de markup con el resto de mockups HTML.",
      },
    },
  },
};

export const Viewer = {
  name: "Viewer",
  render: () => renderViewer(),
};

export const CheckoutPage = {
  name: "Checkout Page",
  render: () => renderScreen(CHECKOUT_SCREENS[0]),
};

export const CheckoutMockup = {
  name: "Checkout Mockup",
  render: () => renderScreen(CHECKOUT_SCREENS[1]),
};
