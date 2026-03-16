import marsCss from "./mars.css?raw";
import successPageCss from "../public/success-page.css?raw";
import successPageHtml from "../success-page.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function inlineSuccessPageCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\/public\/success-page\.css"\s*\/?>\s*/i,
    `<style>${successPageCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlineSuccessPageCss(inlineMarsCss(html)));
}

function renderPage() {
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "420px";
  root.innerHTML = `
    <div class="mars-label">Success Page</div>
    <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">success-page.html</div>
    <iframe title="Success Page" style="${iframeStyle}"></iframe>
  `;

  root.querySelector("iframe").srcdoc = buildSrcdoc(successPageHtml);
  return root;
}

export default {
  title: "Pages/Success Page",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HTML page para **Success Page**, guiada por Figma y armada solo con componentes existentes del sistema como `Toast Banners`, `Top Card`, `Middle Card`, `Bottom Card`, `Card`, `Buttons` e `Icons`.",
      },
    },
  },
};

export const Default = {
  name: "Default",
  render: () => renderPage(),
};
