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
  const srcdocs = Object.fromEntries(MOCKUPS.map((mockup) => [mockup.key, buildSrcdoc(mockup.html)]));
  const defaultKey = MOCKUPS[0].key;
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "1100px";

  root.innerHTML = `
    <div class="mars-label">Pages · Homepages</div>
    <div class="mars-label" style="margin-bottom:16px;color:var(--text-secondary)">
      Selector simple para navegar y visualizar las 5 páginas HTML de homepage.
    </div>
    <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:20px 24px">
      <div data-role="buttons" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"></div>
      <iframe title="Homepages Viewer" style="${iframeStyle}"></iframe>
    </div>
  `;

  const iframe = root.querySelector("iframe");
  const buttonGroup = root.querySelector('[data-role="buttons"]');
  const buttons = MOCKUPS.map((mockup) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = mockup.key;
    button.textContent = mockup.name;
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

function renderMockup(mockup) {
  const srcdoc = buildSrcdoc(mockup.html);
  const root = document.createElement("div");
  root.className = "mars-story";
  root.style.maxWidth = "420px";
  root.innerHTML = `
    <div class="mars-label">${mockup.name}</div>
    <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">${mockup.file}</div>
    <iframe title="${mockup.name}" style="${iframeStyle}"></iframe>
  `;
  root.querySelector("iframe").srcdoc = srcdoc;
  return root;
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
