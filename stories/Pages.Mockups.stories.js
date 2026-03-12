import marsCss from "./mars.css?raw";
import mockup1Html from "../mockup-1.html?raw";
import mockup2Html from "../mockup-2.html?raw";
import mockup3Html from "../mockup-3.html?raw";
import mockup4Html from "../mockup-4.html?raw";
import mockup5Html from "../mockup-5.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

const MOCKUPS = [
  { key: "mockup-1", name: "Mockup 1", file: "mockup-1.html", html: mockup1Html },
  { key: "mockup-2", name: "Mockup 2", file: "mockup-2.html", html: mockup2Html },
  { key: "mockup-3", name: "Mockup 3", file: "mockup-3.html", html: mockup3Html },
  { key: "mockup-4", name: "Mockup 4", file: "mockup-4.html", html: mockup4Html },
  { key: "mockup-5", name: "Mockup 5", file: "mockup-5.html", html: mockup5Html },
];

function inlineMarsCss(html) {
  return html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/stories\/mars\.css"\s*\/?>\s*/i,
    `<style>${marsCss}</style>`,
  );
}

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function buildSrcdoc(html) {
  return withBaseHref(inlineMarsCss(html));
}

function renderIndex() {
  const items = MOCKUPS.map(
    (mockup) => `
      <li style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.08)">
        <div style="font-weight:700;color:#552588">${mockup.name}</div>
        <div style="font-size:13px;color:rgba(0,0,0,0.6)">${mockup.file}</div>
      </li>`,
  ).join("");

  return `
    <div class="mars-story" style="max-width:960px">
      <div class="mars-label">Pages · Mockups</div>
      <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
        Referencia de las 5 páginas HTML de mockups disponibles en el repo.
      </div>
      <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
        <ul style="list-style:none;margin:0;padding:0">${items}</ul>
      </div>
    </div>
  `;
}

function renderMockup(mockup) {
  const iframeId = `pages-${mockup.key}-iframe`;
  const srcdoc = buildSrcdoc(mockup.html);

  return `
    <div class="mars-story" style="max-width:420px">
      <div class="mars-label">${mockup.name}</div>
      <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">${mockup.file}</div>
      <iframe id="${iframeId}" title="${mockup.name}" style="${iframeStyle}"></iframe>
    </div>
    <script>
      (function () {
        var iframe = document.getElementById(${JSON.stringify(iframeId)});
        if (!iframe) return;
        iframe.srcdoc = ${JSON.stringify(srcdoc)};
      })();
    </script>
  `;
}

export default {
  title: "Pages/Mockups",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sección Pages para listar y visualizar los 5 mockups HTML existentes del proyecto, embebidos directamente en Storybook.",
      },
    },
  },
};

export const Index = {
  name: "Index",
  render: () => renderIndex(),
};

export const Mockup1 = {
  name: "Mockup 1",
  render: () => renderMockup(MOCKUPS[0]),
};

export const Mockup2 = {
  name: "Mockup 2",
  render: () => renderMockup(MOCKUPS[1]),
};

export const Mockup3 = {
  name: "Mockup 3",
  render: () => renderMockup(MOCKUPS[2]),
};

export const Mockup4 = {
  name: "Mockup 4",
  render: () => renderMockup(MOCKUPS[3]),
};

export const Mockup5 = {
  name: "Mockup 5",
  render: () => renderMockup(MOCKUPS[4]),
};
