import marsCss from "./mars.css?raw";
import postCheckoutPageCss from "../public/post-checkout-page.css?raw";
import postCheckoutPageHtml from "../post-checkout-page.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function inlinePostCheckoutPageCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/post-checkout-page\.css"\s*\/?>\s*/i,
    `<style>${postCheckoutPageCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlinePostCheckoutPageCss(inlineMarsCss(html)));
}

function renderScreen() {
  const srcdoc = buildSrcdoc(postCheckoutPageHtml);
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "420px";
  root.innerHTML = `
    <div class="mars-label">Pages · Post Checkout</div>
    <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">post-checkout-page.html</div>
    <iframe title="Post Checkout" style="${iframeStyle}"></iframe>
  `;
  root.querySelector("iframe").srcdoc = srcdoc;
  return root;
}

export default {
  title: "Pages/Post Checkout",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HTML page para **Post Checkout**, protagonizada por el `Organismo/Card` con un Toast Banner de éxito sobrepuesto sobre el Page Header y un botón Compartir. Incluye un carrusel funcional de 3 cards (scroll-snap + chips de navegación reutilizados de `Producto Header`/`Checkout`) con indicadores sincronizados.",
      },
    },
  },
};

export const Default = {
  name: "Default",
  render: () => renderScreen(),
};
