/* ─────────────────────────────────────────────────────────
   MARS / Mapa Figma ↔ Storybook
   Qué componente de MARS (One App Components › «3 · Componentes
   creados o actualizados») corresponde a qué story. Storybook es la
   fuente de la verdad (19/10): si algo no coincide, se corrige en
   Figma. Cada componente de MARS lleva el enlace a su story en la
   descripción.
───────────────────────────────────────────────────────── */

const FIGMA = "https://www.figma.com/design/5j7iSrNCzdga5CikWyoKJx/MARS?node-id=";
const SB = "https://okyapp.vercel.app/?path=";

/* estado: igual · diferencias · solo-mars · legacy */
const FIGMA_MAP = [
  { mars: "OKY Cash / Balance Strip", node: "8367:206709", story: "/docs/molecules-oky-cash-balance-strip--docs", label: "Molecules/OKY Cash Balance Strip", estado: "igual" },
  { mars: "OKY Cash / Saving Bar", node: "8367:206715", story: "/story/molecules-saving-bar--oky-cash", label: "Molecules/Saving Bar › OKY Cash", estado: "diferencias", nota: "Storybook: Base PDP, Base Checkout y Ahorro GT. Promo, Terminada y Aviso son del cronómetro (legacy)." },
  { mars: "OKY Cash / Pastilla", node: "8367:206774", story: "/docs/molecules-oky-cash-pill--docs", label: "Molecules/OKY Cash Pill", estado: "diferencias", nota: "Falta Tamaño=Icono y Tipo=Recibo en Storybook." },
  { mars: "OKY Cash / Movimiento", node: "8367:206785", story: "/story/molecules-history-card--oky-cash-movement", label: "Molecules/History Card › OKY Cash · Movimiento", estado: "igual" },
  { mars: "OKY Cash / Diseño de tarjeta", node: "8367:206988", story: "/story/molecules-payment-card--oky-cash-designs", label: "Molecules/Payment Card › OKY Cash · Diseños", estado: "igual" },
  { mars: "OKY Cash / Ganaste", node: "8367:206999", story: "/docs/organisms-oky-cash-win--docs", label: "Organisms/OKY Cash Win", estado: "igual" },
  { mars: "Sheet / Tienes OKY Cash", node: "8367:207016", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Sheet / Confirmación", node: "8367:207283", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas («¿Ya la usaste?», «¿Eliminar esta tarjeta?»)", estado: "igual" },
  { mars: "Sheet / Para quién es (pestañas)", node: "8367:207297", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Sheet / Filtrar", node: "8367:207303", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Sheet / Agrega más, paga menos", node: "8367:207391", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Sheet / Elige el país", node: "8367:207397", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Sheet / Cambiar país", node: "8367:207406", story: "/story/molecules-modal--oky-cash-sheets", label: "Molecules/Modal › OKY Cash · Hojas", estado: "igual" },
  { mars: "Wallet / Pestañas v3", node: "8367:207065", story: "/docs/molecules-segmented-tabs--docs", label: "Molecules/Segmented Tabs › Mis compras", estado: "igual" },
  { mars: "Wallet / Pestañas · Tu billetera", node: "8367:207084", story: "/docs/molecules-segmented-tabs--docs", label: "Molecules/Segmented Tabs › Tu billetera", estado: "igual" },
  { mars: "Wallet / Estado vacío", node: "8367:207199", story: "/docs/molecules-empty-state--docs", label: "Molecules/Empty State", estado: "diferencias", nota: "Storybook: OKY Cash y Métodos de pago. Gift Cards, OKY Vales y Servicios son de la variante 1 (legacy)." },
  { mars: "Wallet / Punto Nuevo", node: "8367:207185", story: "/story/atoms-chips--voucher-badge", label: "Atoms/Chips › Insignia de vale · Punto Nuevo", estado: "igual" },
  { mars: "Wallet / Insignia de vale", node: "8367:207187", story: "/story/atoms-chips--voucher-badge", label: "Atoms/Chips › Insignia de vale · Punto Nuevo", estado: "igual" },
  { mars: "Wallet / Insignia de compra", node: "8367:207190", estado: "solo-mars" },
  { mars: "Wallet / Insignia de compra · fallida", node: "8367:207193", estado: "solo-mars" },
  { mars: "Wallet / Mazo de la misma marca", node: "8367:207196", estado: "solo-mars" },
  { mars: "Wallet / Sección plegada", node: "8367:207168", estado: "solo-mars" },
  { mars: "Wallet / Pestañas v1", node: "8367:207099", estado: "legacy", nota: "Variante 1 (/usa), fuera de /miscompras." },
  { mars: "Tour / Llamada", node: "8367:207491", story: "/docs/molecules-tour-callout--docs", label: "Molecules/Tour Callout", estado: "igual" },
  { mars: "Tour / ¿Estás listo?", node: "8367:207498", estado: "legacy", nota: "Recorrido con Clarita y cronómetro, fuera del sprint (15/10)." },
  { mars: "Tour / Cuenta", node: "8367:207500", estado: "legacy", nota: "Fuera del sprint (15/10)." },
  { mars: "Tour / Meta", node: "8367:207507", estado: "legacy", nota: "Fuera del sprint (15/10)." },
  { mars: "Clarita / Personaje", node: "8367:207418", estado: "legacy", nota: "Clarita, fuera del sprint (15/10)." },
  { mars: "Clarita / Guía", node: "8367:207430", estado: "legacy", nota: "Clarita, fuera del sprint (15/10)." },
  { mars: "Transición / Pared de banderas", node: "8367:207659", story: "/docs/organisms-flag-wall--docs", label: "Organisms/Flag Wall › US", estado: "igual" },
  { mars: "Transición / Pared de banderas · GT", node: "8367:207724", story: "/docs/organisms-flag-wall--docs", label: "Organisms/Flag Wall › GT", estado: "igual" },
  { mars: "Home / Pista de scroll", node: "8367:207789", story: "/docs/atoms-scroll-hint--docs", label: "Atoms/Scroll Hint", estado: "igual" },
  { mars: "List / Country Row", node: "8367:207800", story: "/story/organisms-lists--country-row", label: "Organisms/Lists › Country Row", estado: "igual" },
  { mars: "Flag / CA - Canada", node: "8367:207794", story: "/story/organisms-lists--country-row", label: "Organisms/Lists › Country Row (bandera CA)", estado: "igual" },
  { mars: "Folder / Doble flecha", node: "8367:207791", estado: "solo-mars" },
  { mars: "Card / Bottom · Gift Card USA", node: "8367:207814", estado: "solo-mars", nota: "Revisar contra Molecules/Bottom Card." },
  { mars: "Feedback / Compra exitosa", node: "8367:207859", story: "/docs/organisms-purchase-success--docs", label: "Organisms/Purchase Success", estado: "igual" },
  { mars: "Poscompra / Toast de estado (Fat Toast MARS)", node: "8367:207911", estado: "solo-mars" },
  { mars: "Poscompra / Botón (MARS button large)", node: "8367:207916", estado: "solo-mars" },
  { mars: "Poscompra / Vale fallido · parte inferior", node: "8367:207927", estado: "solo-mars" },
  { mars: "Webview / Barra", node: "8367:207939", story: "/docs/molecules-webview-bar--docs", label: "Molecules/Webview Bar", estado: "igual" },
  { mars: "Slider / Monto", node: "8367:207961", story: "/docs/atoms-slider--docs", label: "Atoms/Slider", estado: "igual" },
  { mars: "Carrito / Cantidad", node: "8367:207999", story: "/story/molecules-quantity-input--cart-quantity", label: "Molecules/Quantity Input › Carrito · Cantidad", estado: "igual" },
  { mars: "Icono / Compartir", node: "8478:81710", story: "/story/atoms-icons--share", label: "Atoms/Icons › Compartir", estado: "igual" },
  /* Solo en Storybook: falta su componente en MARS. */
  { mars: "—", story: "/docs/molecules-payment-method-row--docs", label: "Molecules/Payment Method Row", estado: "solo-storybook", nota: "En Pages 3.0 las filas son frames armados a mano." },
  { mars: "—", story: "/story/molecules-navigation--oky-cash-coin", label: "Molecules/Navigation › OKY Cash · Moneda", estado: "solo-storybook" },
  { mars: "Saldo Card (vieja) + arte", story: "/story/molecules-payment-card--oky-cash-designs", label: "Molecules/Payment Card › OKY Cash", estado: "diferencias", nota: "La tarjeta de Tu billetera (vencimiento + lápiz) no es componente en MARS: las 31 de Pages 3.0 son frames «Saldo Card · OKY Cash»." },
];

const ESTADOS = {
  igual: ["Igual", "is-ok"],
  diferencias: ["Con diferencias", "is-warn"],
  "solo-mars": ["Solo en MARS", "is-gap"],
  "solo-storybook": ["Solo en Storybook", "is-gap"],
  legacy: ["Legacy · fuera del sprint", "is-legacy"],
};

export default {
  title: "MARS/Mapa Figma ↔ Storybook",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Correspondencia entre los componentes nuevos de OKY Cash en MARS y sus stories. Storybook es la fuente de la verdad: " +
          "los colores de MARS salen de la colección de variables «OKY Tokens», con los mismos nombres que `:root` en `mars.css`.",
      },
    },
  },
};

export const Mapa = {
  render: () => {
    const counts = Object.keys(ESTADOS).map((k) => `${ESTADOS[k][0]}: ${FIGMA_MAP.filter((r) => r.estado === k).length}`).join(" · ");
    const rows = FIGMA_MAP.map((r) => {
      const [txt, cls] = ESTADOS[r.estado];
      const mars = r.node ? `<a href="${FIGMA}${r.node.replace(":", "-")}" target="_blank" rel="noopener">${r.mars}</a>` : r.mars;
      const sb = r.story ? `<a href="${SB}${r.story}" target="_blank" rel="noopener">${r.label}</a>` : "—";
      return `<tr><td>${mars}</td><td>${sb}</td><td><span class="figma-map-chip ${cls}">${txt}</span></td><td>${r.nota || ""}</td></tr>`;
    }).join("");
    return `
      <style>
        .figma-map { padding: 24px; font-family: "Nunito Sans", sans-serif; color: var(--text-primary); }
        .figma-map p { margin: 0 0 16px; color: var(--text-secondary); font-size: 14px; }
        .figma-map-wrap { overflow-x: auto; }
        .figma-map table { border-collapse: collapse; width: 100%; min-width: 760px; font-size: 13px; }
        .figma-map th, .figma-map td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--divider); vertical-align: top; }
        .figma-map th { font-weight: 800; color: var(--primary-base); }
        .figma-map a { color: var(--primary-base); }
        .figma-map-chip { display: inline-block; padding: 2px 8px; border-radius: 10px; font-weight: 700; white-space: nowrap; }
        .figma-map-chip.is-ok { background: var(--success-bg); color: var(--success-text); }
        .figma-map-chip.is-warn { background: var(--warning-bg); color: var(--warning-text); }
        .figma-map-chip.is-gap { background: var(--error-bg); color: var(--error-text); }
        .figma-map-chip.is-legacy { background: var(--background); color: var(--text-secondary); }
      </style>
      <div class="figma-map">
        <p>${counts}</p>
        <div class="figma-map-wrap">
          <table>
            <thead><tr><th>MARS</th><th>Storybook</th><th>Estado</th><th>Nota</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  },
};
