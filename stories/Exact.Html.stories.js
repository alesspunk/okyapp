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
  const iframeId = "mars-react-code-iframe";
  let srcdoc = withBaseHref(dsHtml);
  if (sectionId) {
    srcdoc = withSectionTarget(srcdoc, sectionId);
  }

  return `
    <div class="mars-story" style="max-width:1400px">
      <div class="mars-label">Source: ATOMIC-DESIGN-LIBRARY.html (React code reference)</div>
      <iframe id="${iframeId}" title="MARS React Code" style="${iframeStyle}"></iframe>
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
          "These stories render `ATOMIC-DESIGN-LIBRARY.html` as the source of truth for React code examples. Sections below are aligned to real section ids in the HTML document so navigation does not land on empty states.",
      },
    },
  },
};

export const FullLibrary = { name: "Full Library", render: () => renderExact() };
export const OverviewSection = { name: "Overview", render: () => renderExact("overview") };
export const TokensSection = { name: "Tokens", render: () => renderExact("tokens") };
export const IconsSection = { name: "Icons", render: () => renderExact("icons") };
export const AtomsSection = { name: "Atoms", render: () => renderExact("atoms") };
export const MoleculesSection = { name: "Molecules", render: () => renderExact("molecules") };
export const OrganismsSection = { name: "Organisms", render: () => renderExact("organisms") };
export const PagesSection = { name: "Pages", render: () => renderExact("pages") };
export const ReferenceSection = { name: "Reference", render: () => renderExact("reference") };
