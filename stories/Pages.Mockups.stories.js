import marsCss from "./mars.css?raw";
import mockup1Html from "../mockup-1.html?raw";
import mockup2Html from "../mockup-2.html?raw";
import mockup3Html from "../mockup-3.html?raw";
import mockup4Html from "../mockup-4.html?raw";
import mockup5Html from "../mockup-5.html?raw";

const iframeStyle =
  "width:100%;height:860px;border:1px solid rgba(0,0,0,0.12);border-radius:16px;background:#f5f5f5;";

const MOCKUPS = [
  { key: "homepage-1", name: "Homepage 1", file: "mockup-1.html", html: mockup1Html },
  { key: "homepage-2", name: "Homepage 2", file: "mockup-2.html", html: mockup2Html },
  { key: "homepage-3", name: "Homepage 3", file: "mockup-3.html", html: mockup3Html },
  { key: "homepage-4", name: "Homepage 4", file: "mockup-4.html", html: mockup4Html },
  { key: "homepage-5", name: "Homepage 5", file: "mockup-5.html", html: mockup5Html },
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

function renderViewer() {
  const iframeId = "pages-homepages-iframe";
  const buttonGroupId = "pages-homepages-buttons";
  const srcdocs = Object.fromEntries(MOCKUPS.map((mockup) => [mockup.key, buildSrcdoc(mockup.html)]));
  const items = MOCKUPS.map(
    (mockup) => `
      <button
        type="button"
        data-key="${mockup.key}"
        style="border:1px solid rgba(0,0,0,0.12);background:#fff;border-radius:999px;padding:8px 14px;font:700 14px/1 'Nunito Sans',sans-serif;color:#552588;cursor:pointer"
      >
        ${mockup.name}
      </button>`,
  ).join("");

  return `
    <div class="mars-story" style="max-width:1100px">
      <div class="mars-label">Pages · Homepages</div>
      <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
        Selector simple para navegar y visualizar las 5 páginas HTML de homepage.
      </div>
      <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
        <div id="${buttonGroupId}" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">${items}</div>
        <iframe id="${iframeId}" title="Homepages Viewer" style="${iframeStyle}"></iframe>
      </div>
    </div>
    <script>
      (function () {
        var iframe = document.getElementById(${JSON.stringify(iframeId)});
        var root = document.getElementById(${JSON.stringify(buttonGroupId)});
        if (!iframe || !root) return;
        var srcdocs = ${JSON.stringify(srcdocs)};
        var defaultKey = ${JSON.stringify(MOCKUPS[0].key)};
        var buttons = Array.from(root.querySelectorAll("button[data-key]"));

        function render(key) {
          var safeKey = srcdocs[key] ? key : defaultKey;
          iframe.srcdoc = srcdocs[safeKey];
          buttons.forEach(function (button) {
            var active = button.getAttribute("data-key") === safeKey;
            button.setAttribute("aria-pressed", active ? "true" : "false");
            button.style.background = active ? "#552588" : "#fff";
            button.style.color = active ? "#fff" : "#552588";
            button.style.borderColor = active ? "#552588" : "rgba(0,0,0,0.12)";
          });
        }

        buttons.forEach(function (button) {
          button.addEventListener("click", function () {
            render(button.getAttribute("data-key"));
          });
        });

        render(defaultKey);
      })();
    </script>
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
  title: "Pages/Homepages",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sección Pages para navegar de forma simple entre las 5 homepages HTML del proyecto, embebidas directamente en Storybook.",
      },
    },
  },
};

export const Viewer = {
  name: "Viewer",
  render: () => renderViewer(),
};

export const Homepage1 = {
  name: "Homepage 1",
  render: () => renderMockup(MOCKUPS[0]),
};

export const Homepage2 = {
  name: "Homepage 2",
  render: () => renderMockup(MOCKUPS[1]),
};

export const Homepage3 = {
  name: "Homepage 3",
  render: () => renderMockup(MOCKUPS[2]),
};

export const Homepage4 = {
  name: "Homepage 4",
  render: () => renderMockup(MOCKUPS[3]),
};

export const Homepage5 = {
  name: "Homepage 5",
  render: () => renderMockup(MOCKUPS[4]),
};
