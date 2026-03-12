import dsHtml from "../public/ATOMIC-DESIGN-LIBRARY.html?raw";

const iframeStyle =
  "width:100%;height:85vh;border:1px solid rgba(0,0,0,0.12);border-radius:12px;background:#fff;";

function withBaseHref(html) {
  return html.replace("</head>", '<base href="/" /></head>');
}

function withSectionTarget(html, sectionId) {
  const scrollScript = `
<script>
  window.addEventListener('load', function () {
    var el = document.getElementById(${JSON.stringify(sectionId)});
    if (el) {
      setTimeout(function () {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 60);
    }
  });
</script>`;
  return html.replace("</body>", `${scrollScript}</body>`);
}

function renderExact(sectionId) {
  const iframeId = "mars-exact-html-iframe";
  let srcdoc = withBaseHref(dsHtml);
  if (sectionId) {
    srcdoc = withSectionTarget(srcdoc, sectionId);
  }

  return `
    <div class="mars-story" style="max-width:1400px">
      <div class="mars-label">Source: ATOMIC-DESIGN-LIBRARY.html (exact code)</div>
      <iframe id="${iframeId}" title="MARS Exact HTML" style="${iframeStyle}"></iframe>
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
  title: "React code/Library",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Estas stories usan el HTML exacto del archivo `ATOMIC-DESIGN-LIBRARY.html` via `?raw`, para asegurar consistencia 1:1 entre tu libreria y Storybook.",
      },
    },
  },
};

export const FullLibrary = { render: () => renderExact() };
export const OverviewSection = { render: () => renderExact("overview") };
export const TokensSection = { render: () => renderExact("tokens") };
export const IconsSection = { render: () => renderExact("icons") };
export const AtomsSection = { render: () => renderExact("atoms") };
export const MoleculesSection = { render: () => renderExact("molecules") };
export const OrganismsSection = { render: () => renderExact("organisms") };
export const ReferenceSection = { render: () => renderExact("reference") };
