import marsCss from "./mars.css?raw";
import catalogPagesCss from "../public/catalog-pages.css?raw";
import categoryPageHtml from "../category-page.html?raw";
import plpPageHtml from "../plp-page.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

export const categoryPage = {
  name: "Category Page",
  file: "category-page.html",
  html: categoryPageHtml,
};

export const plpPage = {
  name: "PLP Page",
  file: "plp-page.html",
  html: plpPageHtml,
};

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

export function renderCatalogPage(page) {
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
