/* ─────────────────────────────────────────────────────────
   Pages / Yayo × OKY / Prototype — Beneficiario

   Tercer prototipo, independiente de /miscompras y /timer. Recorre el
   flujo del beneficiario del archivo Yayo x OKY (IO8QZtZquMn8QpXRSDy2Tt,
   página Beneficiario):

     Login con la solicitud (1:12188) → método de entrega (1:12575) →
     código OTP (1:12578 / 1:12581) → Home con la Solicitud de pago
     (1:16043) → aprobar (animación, 1:15806) o rechazar
     (¿Estás seguro?, 1:12589) → Home con la actividad (1:12651 /
     1:13738). El menú (1:14484) abre Actividad, Mi perfil (1:12275),
     Compartir (1:14033), Ayuda (1:12253), Términos (1:12320) y Salir.

   Reutiliza sin reimplementar: el header Yayo, el modal Centered y el
   Small, el toast Payment Request, el Amount Summary, el Action Circle, la
   History Card (Yayo Aprobado / Rechazado), la Payment Card
   (Yayo Brand), el menú y las hojas del prototipo de OKY Cash, el
   átomo Flag, el buscador y los botones del sistema.

   El número y el código se rellenan solos al tocarlos, la solicitud
   vence de verdad (15 minutos, o lo que diga ?vence=segundos) y la
   actividad arranca vacía.
───────────────────────────────────────────────────────── */

import { findPaymentCard, renderPaymentCard } from "./paymentCards";
import { findHistoryCard, renderHistoryCard } from "./historyCards";
import { renderFlag } from "./flag";
import { lottie } from "./lottieLight";
import { OKY_CONFETTI } from "./okyConfettiAnimation";
import { listenYayoTopups, takeYayoTopups } from "./yayoInbox";

/* El mismo beneficiario al que /miscompras le manda el vale de Yayo. */
const PHONE = "6578 8744";
const OTP = "991222";
const REQUEST = {
  amount: 380,
  merchant: "Tienda Don Juan",
  id: "TP-4784",
};
const START_BALANCE = 380;
const DEFAULT_WINDOW_S = 15 * 60;
const APPROVE_MS = 2900;

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const quetzal = (n) => `Q${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const plain = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateLabel = (d) => `${String(d.getDate()).padStart(2, "0")} / ${MONTHS[d.getMonth()]} / ${d.getFullYear()}`;
const timeLabel = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} hrs`;
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const reducedMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

/* Cuánto dura la solicitud. ?vence=30 la deja en 30 segundos para
   probar el vencimiento sin esperar el cuarto de hora. */
function requestWindow() {
  const raw = new URLSearchParams(window.location.search).get("vence");
  const n = Number(raw);
  return raw && n > 0 ? Math.round(n) : DEFAULT_WINDOW_S;
}

function createInitialState() {
  const now = new Date();
  return {
    screen: "login",
    history: [],
    phone: "",
    typing: false,
    loginToast: true,
    sheet: null,
    otp: "",
    otpBusy: false,
    channel: "whatsapp",
    notif: false,
    passkey: false,
    request: { ...REQUEST, receivedAt: now, expiresAt: now.getTime() + requestWindow() * 1000 },
    requestOpen: false,
    balance: START_BALANCE,
    shownBalance: START_BALANCE,
    activity: [],
    newId: null,
    approving: null,
    menuOpen: false,
    filter: "todos",
    query: "",
    toast: null,
    chat: [],
    helpChannel: "correo",
    seq: 4784,
    credits: 0,
  };
}

/* ── Piezas compartidas ─────────────────────────────────── */

function statusBar() {
  return `
    <div class="status-bar">
      <div>9:41</div>
      <div style="display:flex;gap:8px">
        <i class="fa-solid fa-signal" aria-hidden="true"></i>
        <i class="fa-solid fa-wifi" aria-hidden="true"></i>
        <i class="fa-solid fa-battery-full" aria-hidden="true"></i>
      </div>
    </div>
  `;
}

/* Header Yayo (Organisms/Headers · Yayo, 99101:21449). */
function yayoHeader() {
  return `
    <header class="app-header yayo-header" data-figma-node="99101:21449">
      <button class="yayo-header-tab" data-action="open-menu" type="button" aria-label="Menú">
        <i class="fa-light fa-bars" aria-hidden="true"></i>
      </button>
      <div class="yayo-header-brand">
        <img class="header-logo" src="logo-oky.svg" alt="OKY" />
      </div>
      <button class="yayo-header-tab" data-action="scan" type="button" aria-label="Escanear código">
        <i class="fa-light fa-qrcode" aria-hidden="true"></i>
      </button>
    </header>
  `;
}

function titledHeader(title) {
  return `
    <header class="oky-flow-header">
      <button class="oky-flow-header-icon" data-action="back" type="button" aria-label="Atrás">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>
      <h1 class="oky-flow-title">${title}</h1>
      <span class="oky-flow-header-icon" aria-hidden="true"></span>
    </header>
  `;
}

/* Toast Payment Request (Atoms/Toast Banners, 99140:54682) en verde. */
function requestToast(amount, { action = "close-login-toast" } = {}) {
  return `
    <article class="toast-banner toast-banner-info is-success" data-figma-node="99140:54682">
      <span class="fa-icon toast-banner-icon icon-main-success" aria-hidden="true">
        <i class="fa-regular fa-circle-info"></i>
      </span>
      <div class="toast-banner-stack">
        <p class="toast-banner-message">Tienes una solicitud de pago</p>
        <p class="toast-banner-amount">${quetzal(amount)}</p>
      </div>
      <button class="toast-banner-close" data-action="${action}" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </article>
  `;
}

function secondsLeft(state) {
  if (!state.request) return 0;
  return Math.max(0, Math.ceil((state.request.expiresAt - Date.now()) / 1000));
}

/* Super Ribbon `vence`: el mismo del modal y de la Reminder Card. */
function countdownRibbon(state, { attached = false, label = "La solicitud vence en" } = {}) {
  const left = secondsLeft(state);
  return `
    <div class="super-ribbon super-ribbon-type-vence${attached ? " is-attached" : ""}${left <= 60 ? " is-urgent" : ""}">
      <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
      <span class="super-ribbon-text super-ribbon-countdown">
        <span class="super-ribbon-countdown-label">${label}</span>
        <span class="super-ribbon-countdown-value" data-role="countdown">${clock(left)}</span>
      </span>
    </div>
  `;
}

/* ── Login ───────────────────────────────────────────────── */

function screenLogin(state) {
  const ready = state.phone.replace(/\D/g, "").length === 8;
  return `
    ${statusBar()}
    <section class="yayo-flow-screen">
      <div class="yayo-flow-login">
        <div class="yayo-flow-login-logo" role="img" aria-label="Yayo × OKY">
          <img class="yayo-flow-login-wordmark" src="yayo-wordmark-dark.svg" alt="" />
          <span class="yayo-flow-login-x" aria-hidden="true">x</span>
          <img class="yayo-flow-login-oky" src="oky-contenedor.png" alt="" />
        </div>
        <div class="yayo-flow-login-slot">
          ${
            state.loginToast && state.request
              ? `<div class="yayo-flow-login-toast">${requestToast(state.request.amount)}</div>`
              : ""
          }
        </div>
        <div class="yayo-flow-fields">
          <div class="input-wrapper">
            <div class="yayo-flow-select" role="button" tabindex="0" aria-label="País: Guatemala">
              <label class="input-label">País</label>
              ${renderFlag({ code: "GTM", size: "Medium" })}
              <span>Guatemala</span>
              <i class="fa-solid fa-caret-down yayo-flow-select-caret" aria-hidden="true"></i>
            </div>
          </div>
          <div class="input-wrapper yayo-flow-phone${state.typing ? " is-typing" : ""}">
            <input id="yayo-phone" class="input-field${state.phone ? " input-has-clear" : ""}" type="tel" inputmode="tel"
              data-action="fill-phone" value="${state.phone}" placeholder="0000 0000" autocomplete="tel"
              aria-labelledby="yayo-phone-label" />
            <label id="yayo-phone-label" class="input-label" for="yayo-phone">Número de teléfono</label>
            ${
              state.phone && !state.typing
                ? '<button class="icon-button clear-icon icon-medium" data-action="clear-phone" type="button" aria-label="Borrar número"><i class="fa-regular fa-circle-xmark" aria-hidden="true"></i></button>'
                : ""
            }
          </div>
          ${state.phone ? "" : '<p class="yayo-flow-hint">Toca el campo para rellenar tu número</p>'}
        </div>
        <div class="yayo-flow-login-actions">
          <button class="btn btn-primary btn-large" data-action="request-code" type="button"${ready && !state.typing ? "" : " disabled"}>
            Recibir Código
          </button>
          <button class="btn btn-outlined btn-large" data-action="passkey" type="button">Ingresar con Passkey</button>
        </div>
        <div class="yayo-flow-terms">
          <span class="yayo-flow-terms-check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
          <p style="margin:0">
            Al ingresar aceptas los términos, condiciones y política de privacidad …
            <button class="yayo-flow-link" data-action="go:terms" type="button">Leer más</button>
          </p>
        </div>
      </div>
    </section>
  `;
}

const CHANNELS = [
  { key: "whatsapp", label: "WhatsApp", art: "yayo-whatsapp-3d.webp", app: "WhatsApp" },
  { key: "sms", label: "Mensaje de texto", art: "yayo-sms-3d.webp", app: "Mensajes" },
  { key: "call", label: "Llamada", art: "yayo-call-3d.webp", app: "Teléfono" },
];

function deliverySheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="yayo-flow-sheet" role="dialog" aria-modal="true" aria-label="Elige método de entrega">
      <h2 class="yayo-flow-sheet-title">Elige método de entrega</h2>
      ${CHANNELS.map(
        (c) => `
        <button class="yayo-flow-option" data-action="pick-channel" data-channel="${c.key}" type="button">
          <img src="${c.art}" alt="" />
          <span>${c.label}</span>
          <i class="fa-light fa-chevron-right yayo-flow-option-go" aria-hidden="true"></i>
        </button>`,
      ).join("")}
    </section>
  `;
}

/* La X fina del diseño: Font Awesome Free no trae la cara Light. */
const THIN_X = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

/* Modal Small (Molecules/Modal · Small, 7391:141032). */
function otpSheet(state) {
  const ready = state.otp.length === OTP.length;
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="modal-sheet is-small yayo-flow-otp" role="dialog" aria-modal="true" aria-label="Ingresa el código"
      data-figma-node="7391:141032">
      <div class="modal-sheet-header">
        <span class="yayo-flow-otp-spacer" aria-hidden="true"></span>
        <div class="modal-sheet-header-main">
          <h3 class="modal-sheet-title is-regular">Ingresa el código</h3>
        </div>
        <button class="header-icon modal-sheet-close" data-action="close-sheet" type="button" aria-label="Cerrar">
          ${THIN_X}
        </button>
      </div>
      <div class="modal-small-body">
        <div class="modal-small-content">
          <button class="yayo-flow-otp-field${state.otp ? " has-value" : ""}" data-action="fill-otp" type="button"
            aria-label="Código de verificación">
            <i class="fa-regular fa-magnifying-glass yayo-flow-otp-icon" aria-hidden="true"></i>
            <span data-role="otp-value">${state.otp || "Código"}</span>
          </button>
        </div>
        <div class="modal-small-footer">
          <button class="btn btn-outlined btn-large" data-action="resend" type="button">No lo recibí</button>
          <button class="btn btn-primary btn-large${state.otpBusy ? " yayo-flow-busy" : ""}" data-action="verify" type="button"${
            ready ? "" : " disabled"
          }>
            ${state.otpBusy ? '<span class="yayo-flow-spinner" aria-label="Verificando"></span>' : "Siguiente"}
          </button>
        </div>
      </div>
    </section>
  `;
}

function codeNotification(state) {
  const channel = CHANNELS.find((c) => c.key === state.channel) || CHANNELS[0];
  const body =
    state.channel === "call"
      ? `Llamada de OKY: tu código es ${OTP.split("").join(" ")}`
      : `OKY: ${OTP} es tu código para ingresar a Yayo. No lo compartas.`;
  return `
    <button class="yayo-flow-notif" data-action="fill-otp" type="button" aria-label="Usar el código ${OTP}">
      <img src="${channel.art}" alt="" />
      <span class="yayo-flow-notif-copy">
        <span class="yayo-flow-notif-head"><span>${channel.app}</span><span>ahora</span></span>
        <span class="yayo-flow-notif-body">${body}</span>
      </span>
    </button>
  `;
}

function passkeyOverlay() {
  return `
    <div class="yayo-flow-passkey" role="status" aria-live="polite">
      <div class="yayo-flow-passkey-card">
        <i class="fa-regular fa-face-smile" aria-hidden="true"></i>
        <span>Face ID</span>
      </div>
    </div>
  `;
}

/* ── Home ────────────────────────────────────────────────── */

function balanceCard(state) {
  const card = findPaymentCard("Molecule/Payment Card/Yayo Brand");
  return renderPaymentCard({ ...card, balance: { ...card.balance, value: plain(state.shownBalance) } });
}

/* La solicitud minimizada en el home (1:12651): el mismo bloque de
   monto con cuenta atrás del modal y, debajo, las dos acciones del
   átomo Action Circle en su forma en línea. Tocar el monto la reabre. */
function pendingRequestCard(state) {
  const r = state.request;
  return `
    <article class="yayo-flow-pending">
      <div class="yayo-flow-amount" data-action="open-request" role="button" tabindex="0" aria-label="Ver la solicitud de pago">
        <div class="amount-summary is-success">
          <p class="amount-display is-hero">
            <span class="amount-display-currency">Q</span>
            <span class="amount-display-value">${plain(r.amount)}</span>
          </p>
        </div>
        ${countdownRibbon(state, { attached: true })}
      </div>
      <div class="yayo-flow-pending-actions">
        <button class="action-circle is-reject" data-action="reject" type="button">
          <span class="action-circle-icon"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>
          <span class="action-circle-label">Rechazar</span>
        </button>
        <button class="action-circle is-approve" data-action="approve" type="button">
          <span class="action-circle-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
          <span class="action-circle-label">Aprobar pago</span>
        </button>
      </div>
    </article>
  `;
}

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "acreditado", label: "Recargas" },
  { key: "aprobado", label: "Aprobados" },
  { key: "rechazado", label: "Rechazados" },
  { key: "vencido", label: "Vencidos" },
];

function historyEntry(entry, isNew) {
  const approved = entry.status === "aprobado" || entry.status === "acreditado";
  const credit = entry.status === "acreditado";
  const base = findHistoryCard(approved ? "Molecule/History Card/Yayo Approved" : "Molecule/History Card/Yayo Rejected");
  const chip = credit
    ? { label: "Acreditado", tone: "success", icon: "fa-circle-check" }
    : approved
    ? base.chip
    : entry.status === "vencido"
      ? { label: "Vencida", tone: "neutral", icon: "fa-clock" }
      : base.chip;
  const html = renderHistoryCard({
    ...base,
    /* Los íconos rellenos del diseño (1:16261) en vez del glifo de línea. */
    icon: { src: "yayo-avatar-store.png" },
    date: dateLabel(entry.at),
    amount: credit ? `+${quetzal(entry.amount)}` : approved ? `-${quetzal(entry.amount)}` : quetzal(entry.amount),
    meta: { ...base.meta, brand: entry.merchant, note: `ID: ${entry.id}` },
    chip,
  });
  return isNew ? html.replace('class="history-card-molecule', 'class="history-card-molecule is-new') : html;
}

function visibleActivity(state) {
  const q = state.query.trim().toLowerCase();
  return state.activity.filter(
    (e) =>
      (state.filter === "todos" || e.status === state.filter) &&
      (!q || `${e.merchant} ${e.id} ${e.amount}`.toLowerCase().includes(q)),
  );
}

function activityBlock(state) {
  const items = visibleActivity(state);
  const list = state.activity.length
    ? items.length
      ? `<p class="yayo-flow-group">Este mes</p>
         <div class="yayo-flow-list">${items.map((e) => historyEntry(e, e.id === state.newId)).join("")}</div>`
      : `<div class="yayo-flow-empty">
           <p class="yayo-flow-empty-title">Sin resultados</p>
           <p class="yayo-flow-empty-note">Prueba con otro filtro o búsqueda.</p>
         </div>`
    : `<div class="yayo-flow-empty">
         <span class="icon-avatar is-art" aria-hidden="true"><img src="yayo-avatar-store.png" alt="" /></span>
         <p class="yayo-flow-empty-title">Aún no tienes actividad</p>
         <p class="yayo-flow-empty-note">Aquí verás los pagos que apruebes o rechaces en las tiendas.</p>
       </div>`;
  const filterLabel = (FILTERS.find((f) => f.key === state.filter) || FILTERS[0]).label;
  return `
    <div class="yayo-flow-activity-head">
      <p class="yayo-flow-label">Actividad</p>
      <button class="btn btn-outlined btn-small" data-action="open-filter" type="button">
        <i class="fa-regular fa-sliders" aria-hidden="true"></i>
        ${state.filter === "todos" ? "Filtrar" : filterLabel}
      </button>
    </div>
    <div class="input-wrapper">
      <i class="fa-regular fa-magnifying-glass search-icon" aria-hidden="true"></i>
      <input id="yayo-search" class="input-field search-input ${state.query ? "search-input-hasvalue" : "search-input-empty"}"
        type="search" placeholder="Buscar" value="${state.query.replace(/"/g, "&quot;")}" aria-label="Buscar en la actividad" />
    </div>
    ${list}
  `;
}

function screenHome(state) {
  const pending = state.request && !state.requestOpen;
  return `
    ${statusBar()}
    ${yayoHeader()}
    <section class="yayo-flow-home">
      ${
        pending
          ? `<div class="yayo-flow-requests">
               <p class="yayo-flow-label">Solicitudes de pago</p>
               ${pendingRequestCard(state)}
             </div>`
          : ""
      }
      <div class="yayo-flow-card" data-role="balance-card">${balanceCard(state)}</div>
      ${activityBlock(state)}
    </section>
  `;
}

function screenActivity(state) {
  return `
    ${statusBar()}
    ${titledHeader("Actividad")}
    <section class="yayo-flow-home">${activityBlock(state)}</section>
  `;
}

/* Modal Centered (Molecules/Modal · Centered, 99140:45084). */
function requestModal(state) {
  const r = state.request;
  return `
    <div class="yayo-flow-modal">
      <button class="modal-molecule-backdrop" data-action="minimize" type="button" aria-label="Minimizar la solicitud"></button>
      <section class="modal-sheet is-centered" role="dialog" aria-modal="true" aria-label="Solicitud de pago"
        data-figma-node="99140:45084">
        <div class="modal-centered-body">
          <div class="modal-sheet-header">
            <div class="modal-sheet-header-main">
              <h3 class="modal-sheet-title is-regular">Solicitud de pago</h3>
            </div>
            <button class="header-icon modal-sheet-close" data-action="minimize" type="button" aria-label="Minimizar">
              <span class="fa-icon fa-icon-lg" aria-hidden="true"><i class="fa-light fa-chevron-down"></i></span>
            </button>
          </div>
          <div class="yayo-flow-amount">
            <div class="amount-summary is-success">
              <p class="amount-display is-hero">
                <span class="amount-display-currency">Q</span>
                <span class="amount-display-value">${plain(r.amount)}</span>
              </p>
            </div>
            ${countdownRibbon(state, { attached: true })}
          </div>
          <div class="modal-detail-list">
            <div class="modal-detail-rows">
              <div class="modal-detail-row">
                <span class="icon-avatar is-small is-art" aria-hidden="true"><img src="yayo-avatar-store.png" alt="" /></span>
                <div class="modal-detail-copy">
                  <p class="modal-detail-title">${r.merchant}</p>
                  <p class="modal-detail-note">ID: ${r.id}</p>
                </div>
                <span class="modal-detail-logo"><img src="yayo.webp" alt="Yayo" /></span>
              </div>
              <hr class="modal-detail-divider" />
              <div class="modal-detail-row">
                <span class="icon-avatar is-small is-art" aria-hidden="true"><img src="yayo-avatar-calendar.png" alt="" /></span>
                <div class="modal-detail-copy">
                  <p class="modal-detail-title">${dateLabel(r.receivedAt)}&nbsp; -&nbsp; ${timeLabel(r.receivedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-centered-actions">
          <div class="modal-centered-action">
            <button class="action-circle is-stacked is-large is-reject" data-action="reject" type="button">
              <span class="action-circle-icon"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>
              <span class="action-circle-label">Rechazar</span>
            </button>
          </div>
          <div class="modal-centered-action">
            <button class="action-circle is-stacked is-large is-approve" data-action="approve" type="button">
              <span class="action-circle-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
              <span class="action-circle-label">Aprobar Pago</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

/* La hoja morada de confirmación (la misma de las hojas de OKY Cash). */
function rejectSheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="cancel-reject" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet yayo-flow-reject" role="dialog" aria-modal="true" aria-label="¿Estás seguro?">
      <button class="oky-flow-sheet-close" data-action="cancel-reject" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="oky-flow-sheet-title">¿Estás seguro?</h2>
      <p class="yayo-flow-reject-note">Estás seguro que deseas rechazar la transacción, esta acción es permanente.</p>
      <div class="yayo-flow-reject-art"><img src="yayo-reject-hands.webp" alt="" /></div>
      <button class="btn btn-secondary btn-large" data-action="confirm-reject" type="button">Sí, estoy seguro</button>
    </section>
  `;
}

function filterSheet(state) {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet is-filter" role="dialog" aria-modal="true" aria-label="Filtrar actividad">
      <div class="oky-flow-sheet-grab" aria-hidden="true"></div>
      <header class="oky-flow-filter-head">
        <h2 class="oky-flow-filter-title">Filtrar</h2>
        <button class="oky-flow-sheet-close is-dark" data-action="close-sheet" type="button" aria-label="Cerrar">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>
      <div class="oky-flow-filter-list" role="radiogroup">
        ${FILTERS.map((f) => {
          const on = state.filter === f.key;
          const count = f.key === "todos" ? state.activity.length : state.activity.filter((e) => e.status === f.key).length;
          return `
            <button class="oky-flow-filter-option${on ? " is-on" : ""}" data-action="pick-filter" data-filter="${f.key}"
              type="button" role="radio" aria-checked="${on}">
              <span class="oky-flow-radio" aria-hidden="true"></span>
              <span class="oky-flow-filter-option-label">${f.label}</span>
              <span class="oky-flow-filter-option-count">${count}</span>
            </button>`;
        }).join("")}
      </div>
    </section>
  `;
}

function approveOverlay(state) {
  const a = state.approving;
  return `
    <div class="yayo-flow-approve${a.leaving ? " is-leaving" : ""}" role="status" aria-live="assertive"
      style="--x:${a.x}px;--y:${a.y}px">
      <div class="yayo-flow-approve-burst"></div>
      <div class="yayo-flow-approve-confetti" data-role="approve-confetti"></div>
      <div class="yayo-flow-approve-mark">
        <span class="yayo-flow-approve-ring"></span>
        <span class="yayo-flow-approve-ring is-late"></span>
        <img src="yayo-key-white.svg" alt="" />
      </div>
      <p class="yayo-flow-approve-title">Pago aprobado</p>
      <p class="yayo-flow-approve-amount">${quetzal(a.amount)}</p>
      <p class="yayo-flow-approve-note">${a.merchant} · ID: ${a.id}</p>
    </div>
  `;
}

/* ── Menú y sus pantallas ────────────────────────────────── */

const MENU_ITEMS = [
  { label: "Actividad", icon: "clock-rotate-left", action: "go:activity" },
  { label: "Mi perfil", icon: "user", action: "go:profile" },
  { label: "Compartir a un Amigo", icon: "share-nodes", action: "share" },
  { label: "Ayuda", icon: "circle-question", action: "go:help" },
  { label: "Términos y condiciones", icon: "circle-info", action: "go:terms" },
  { label: "Salir", icon: "arrow-right-from-bracket", action: "logout" },
];

function menuSheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-menu" type="button" aria-label="Cerrar el menú"></button>
    <div class="oky-flow-menu" role="dialog" aria-modal="true" aria-label="Menú">
      <header class="oky-flow-menu-head">
        <button class="oky-flow-menu-close" data-action="close-menu" type="button" aria-label="Cerrar el menú">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>
      <div class="oky-flow-menu-list">
        ${MENU_ITEMS.map(
          (it) => `
          <div class="oky-flow-menu-row is-live" data-action="${it.action}" role="button" tabindex="0">
            <i class="fa-regular fa-${it.icon} oky-flow-menu-icon" aria-hidden="true"></i>
            <span class="oky-flow-menu-label">${it.label}</span>
            <i class="fa-solid fa-chevron-right oky-flow-menu-go" aria-hidden="true"></i>
          </div>`,
        ).join("")}
      </div>
    </div>
  `;
}

function shareSheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <div class="yayo-flow-share" role="dialog" aria-modal="true" aria-label="Compartir">
      <img src="yayo-share-sheet.webp" alt="Compartir OKY con tus contactos" data-action="close-sheet" />
      <button class="yayo-flow-share-close" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    </div>
  `;
}

function screenProfile(state) {
  return `
    ${statusBar()}
    ${titledHeader("Mi Perfil")}
    <section class="yayo-flow-page">
      <p class="yayo-flow-label">Tus datos personales</p>
      <div class="input-wrapper">
        <span class="input-flag-left" aria-hidden="true">${renderFlag({ code: "GTM", size: "Medium" })}</span>
        <input id="yayo-profile-phone" class="input-field input-has-flag" type="tel" value="+502  ${state.phone || PHONE}" readonly
          aria-labelledby="yayo-profile-phone-label" />
        <label id="yayo-profile-phone-label" class="input-label" for="yayo-profile-phone">Tu número de teléfono</label>
      </div>
      <div class="input-wrapper">
        <input id="yayo-profile-name" class="input-field" type="text" value="Daniel" aria-labelledby="yayo-profile-name-label" />
        <label id="yayo-profile-name-label" class="input-label" for="yayo-profile-name">Su nombre</label>
      </div>
      <div class="input-wrapper">
        <input class="input-field" type="text" placeholder="Apellido" aria-label="Apellido" />
      </div>
      <div class="input-wrapper">
        <input class="input-field" type="email" placeholder="Email" aria-label="Email" />
      </div>
      <div class="yayo-flow-terms" style="margin:0">
        <span class="yayo-flow-terms-check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
        <p style="margin:0">Al ingresar aceptas los términos, condiciones y política de privacidad …
          <button class="yayo-flow-link" data-action="go:terms" type="button">Leer más</button></p>
      </div>
      <p class="yayo-flow-label" style="margin-top:8px">Mis dispositivos</p>
      <div class="yayo-flow-profile-device">
        <i class="fa-light fa-mobile-screen-button" aria-hidden="true"></i>
        <div>
          <p class="yayo-flow-profile-device-name">Mi iPhone</p>
          <p class="yayo-flow-profile-device-note">Este dispositivo · Agregado: ${dateLabel(new Date()).toLowerCase()}</p>
        </div>
        <button class="btn btn-outlined btn-small" type="button" aria-label="Quitar dispositivo">
          <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  `;
}

function screenTerms() {
  const items = [
    "El saldo de tu OKY Vale recargable está atado a tu número de teléfono y solo tú puedes aprobar sus pagos.",
    "Cada solicitud de pago de una tienda vence a los 15 minutos. Si vence o la rechazas, no se descuenta nada.",
    "Un pago aprobado no se puede revertir desde la app; para cualquier reclamo contacta a la tienda o a Ayuda.",
    "Nunca compartas el código que te enviamos para ingresar. OKY no te lo pedirá por ningún medio.",
    "Los vales solo se pueden utilizar en las tiendas afiliadas a Yayo.",
    "Las recargas que te envían por OKY se suman al mismo vale y las ves en tu actividad.",
    "Consulta tu saldo y tu actividad en cualquier momento desde el inicio de la app.",
  ];
  return `
    ${statusBar()}
    ${titledHeader("Términos y condiciones")}
    <section class="yayo-flow-page">
      <ul class="yayo-flow-terms-list">${items.map((t) => `<li>${t}</li>`).join("")}</ul>
    </section>
  `;
}

const HELP_CHANNELS = [
  { key: "whatsapp", label: "Whatsapp", art: "yayo-whatsapp-3d.webp" },
  { key: "correo", label: "Correo", art: "yayo-mail-3d.webp" },
  { key: "llamada", label: "Llamada", art: "yayo-call-3d.webp" },
];

function screenHelp(state) {
  const now = new Date();
  return `
    ${statusBar()}
    ${titledHeader("Ayuda")}
    <section class="yayo-flow-help">
      <div class="yayo-flow-help-channels">
        ${HELP_CHANNELS.map(
          (c) => `
          <button class="yayo-flow-help-channel${state.helpChannel === c.key ? " is-on" : ""}" data-action="help-channel"
            data-channel="${c.key}" type="button">
            <img src="${c.art}" alt="" /><span>${c.label}</span>
          </button>`,
        ).join("")}
      </div>
      <div class="yayo-flow-chat-bar">
        <img src="logo-oky-white.svg" alt="" />
        <span>OKY, yes tú puedes</span>
        <span class="yayo-flow-chat-dot" aria-hidden="true"></span>
      </div>
      <div class="yayo-flow-chat" data-role="chat">
        <div class="yayo-flow-bubble">Bienvenido ¿cómo podemos ayudarte?</div>
        <p class="yayo-flow-bubble-time">${now.toLocaleDateString("en-US")}, ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
        ${state.chat.map((m) => `<div class="yayo-flow-bubble${m.me ? " is-me" : ""}">${m.text}</div>`).join("")}
      </div>
      <form class="yayo-flow-chat-input" data-role="chat-form">
        <input id="yayo-chat" type="text" placeholder="Escribir Mensaje..." aria-label="Escribir mensaje" autocomplete="off" />
        <button type="button" aria-label="Adjuntar"><i class="fa-solid fa-paperclip" aria-hidden="true"></i></button>
        <button type="submit" aria-label="Enviar"><i class="fa-solid fa-arrow-turn-down fa-rotate-90" aria-hidden="true"></i></button>
      </form>
    </section>
  `;
}

function toastLayer(state) {
  if (!state.toast) return "";
  const t = state.toast;
  return `
    <div class="yayo-flow-toast">
      <article class="toast-banner toast-banner-${t.tone}">
        <span class="fa-icon toast-banner-icon icon-main-${t.tone}" aria-hidden="true"><i class="fa-regular ${t.icon}"></i></span>
        <p class="toast-banner-message">${t.text}</p>
      </article>
    </div>
  `;
}

/* ── Montaje ─────────────────────────────────────────────── */

export function mountYayoPrototype(root) {
  let state = createInitialState();
  let tickTimer = 0;
  let typeTimer = 0;
  let notifTimer = 0;
  let toastTimer = 0;
  let countTimer = 0;
  let confetti = null;
  const timers = new Set();

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };

  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.alignItems = "center";
  root.style.gap = "16px";

  const phoneMedia = window.matchMedia("(max-width: 640px)");

  function fitToViewport() {
    if (!phoneMedia.matches) {
      root.style.removeProperty("--oky-fit");
      root.style.removeProperty("--oky-frame-h");
      root.style.alignItems = "center";
      root.style.gap = "16px";
      return;
    }
    root.style.alignItems = "flex-start";
    root.style.gap = "0";
    const frame = root.querySelector(".oky-flow-frame");
    if (!frame) return;
    const vv = window.visualViewport;
    const fitted = root.style.getPropertyValue("--oky-fit");
    const el = document.activeElement;
    const editing = !!el && el.matches && el.matches("input, textarea");
    if (fitted && (editing || (vv && vv.height < window.innerHeight * 0.85))) return;
    const scale = (vv ? vv.width : window.innerWidth) / (frame.offsetWidth || 360);
    if (!scale) return;
    root.style.setProperty("--oky-fit", String(scale));
    root.style.setProperty("--oky-frame-h", (vv ? vv.height : window.innerHeight) / scale + "px");
  }

  window.addEventListener("resize", fitToViewport);
  window.addEventListener("orientationchange", fitToViewport);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fitToViewport);

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "oky-flow-reset";
  resetButton.dataset.action = "reset";
  resetButton.innerHTML = '<i class="fa-solid fa-rotate-left" aria-hidden="true"></i>Reiniciar prototipo';

  function screenHtml() {
    switch (state.screen) {
      case "home":
        return screenHome(state);
      case "activity":
        return screenActivity(state);
      case "profile":
        return screenProfile(state);
      case "help":
        return screenHelp(state);
      case "terms":
        return screenTerms();
      default:
        return screenLogin(state);
    }
  }

  function sheetHtml() {
    switch (state.sheet) {
      case "delivery":
        return deliverySheet();
      case "otp":
        return otpSheet(state);
      case "reject":
        return rejectSheet();
      case "filter":
        return filterSheet(state);
      case "share":
        return shareSheet();
      default:
        return "";
    }
  }

  function render() {
    if (confetti) {
      confetti.destroy();
      confetti = null;
    }
    const focusId = document.activeElement && root.contains(document.activeElement) ? document.activeElement.id : "";
    const caret = focusId && document.activeElement.selectionStart;
    const scroller = root.querySelector(".oky-flow-scroll");
    const keptScroll = scroller ? scroller.scrollTop : 0;

    root.innerHTML = `
      <div class="oky-flow-frame yayo-flow">
        <div class="oky-flow-scroll">${screenHtml()}</div>
        ${state.screen === "home" && state.request && state.requestOpen && !state.sheet ? requestModal(state) : ""}
        ${sheetHtml()}
        ${state.notif && state.sheet === "otp" ? codeNotification(state) : ""}
        ${state.passkey ? passkeyOverlay() : ""}
        ${state.menuOpen ? menuSheet() : ""}
        ${state.approving ? approveOverlay(state) : ""}
        ${toastLayer(state)}
      </div>
    `;
    root.appendChild(resetButton);

    const newScroller = root.querySelector(".oky-flow-scroll");
    if (newScroller && state.keepScroll) newScroller.scrollTop = keptScroll;
    state.keepScroll = false;

    if (focusId) {
      const el = root.querySelector(`#${focusId}`);
      if (el) {
        el.focus({ preventScroll: true });
        try {
          if (typeof caret === "number") el.setSelectionRange(caret, caret);
        } catch (error) {
          /* type="search" no deja mover el cursor en todos los motores. */
        }
      }
    }

    const host = root.querySelector("[data-role='approve-confetti']");
    if (host && !reducedMotion() && !state.approving.leaving) {
      confetti = lottie.loadAnimation({
        container: host,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: OKY_CONFETTI,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
      later(() => confetti && confetti.play(), 550);
    }

    const chat = root.querySelector("[data-role='chat']");
    if (chat) chat.scrollTop = chat.scrollHeight;

    fitToViewport();
  }

  function go(screen, { push = true } = {}) {
    if (push && state.screen !== screen) state.history.push(state.screen);
    state.screen = screen;
    state.menuOpen = false;
    state.sheet = null;
    render();
  }

  function back() {
    const prev = state.history.pop();
    state.screen = prev || (state.loggedIn ? "home" : "login");
    render();
  }

  function showToast(text, { tone = "success", icon = "fa-circle-check", ms = 2600 } = {}) {
    clearTimeout(toastTimer);
    state.toast = { text, tone, icon };
    render();
    toastTimer = later(() => {
      state.toast = null;
      render();
    }, ms);
  }

  /* El reloj de la solicitud: cada segundo se reescribe solo el texto
     de la cuenta atrás, sin repintar la pantalla. Al llegar a cero la
     solicitud vence y queda en la actividad. */
  function tick() {
    clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      if (!state.request) return;
      const left = secondsLeft(state);
      root.querySelectorAll("[data-role='countdown']").forEach((n) => {
        n.textContent = clock(left);
        const ribbon = n.closest(".super-ribbon");
        if (ribbon) ribbon.classList.toggle("is-urgent", left <= 60);
      });
      if (left <= 0) expireRequest();
    }, 1000);
  }

  function expireRequest() {
    const r = state.request;
    if (!r) return;
    state.request = null;
    state.requestOpen = false;
    if (state.sheet === "reject") state.sheet = null;
    if (state.loggedIn) {
      addActivity({ status: "vencido", amount: r.amount, merchant: r.merchant, id: `VX-${r.id.split("-")[1]}` });
      showToast("La solicitud de pago venció", { tone: "warning", icon: "fa-clock" });
    } else {
      state.pendingExpired = r;
      state.loginToast = false;
      render();
    }
  }

  function addActivity(entry) {
    const full = { ...entry, at: new Date() };
    state.activity.unshift(full);
    state.newId = full.id;
    later(() => {
      if (state.newId === full.id) state.newId = null;
    }, 1200);
  }

  /* Escribe el número como lo haría el autocompletado del teclado. */
  function typeInto(text, onStep, onDone) {
    clearInterval(typeTimer);
    let i = 0;
    typeTimer = setInterval(() => {
      i += 1;
      onStep(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typeTimer);
        onDone && onDone();
      }
    }, 70);
  }

  function fillPhone() {
    if (state.typing || state.phone === PHONE) return;
    state.typing = true;
    state.phone = "";
    render();
    typeInto(
      PHONE,
      (v) => {
        state.phone = v;
        const input = root.querySelector("#yayo-phone");
        if (input) input.value = v;
      },
      () => {
        state.typing = false;
        render();
      },
    );
  }

  function fillOtp() {
    if (state.otp === OTP || state.otpBusy) return;
    state.notif = false;
    state.otp = "";
    render();
    typeInto(
      OTP,
      (v) => {
        state.otp = v;
        const field = root.querySelector(".yayo-flow-otp-field");
        if (field) {
          field.querySelector("[data-role='otp-value']").textContent = v;
          field.classList.add("has-value");
        }
      },
      () => render(),
    );
  }

  function sendCode() {
    clearTimeout(notifTimer);
    state.notif = false;
    state.otp = "";
    state.sheet = "otp";
    render();
    notifTimer = later(() => {
      if (state.sheet !== "otp" || state.otp) return;
      state.notif = true;
      render();
    }, 1100);
  }

  /* Recargas que llegaron desde /miscompras (vale Yayo de GUA). Con
     sesión se acreditan al momento; en el login esperan a que se entre. */
  function receiveTopups() {
    if (!state.loggedIn) return;
    const list = takeYayoTopups();
    if (!list.length) return;
    const total = list.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    list.forEach((t) => {
      state.credits += 1;
      addActivity({
        status: "acreditado",
        amount: Number(t.amount) || 0,
        merchant: "Acreditación de saldo",
        id: `AC-${String(1000 + state.credits).slice(-4)}`,
      });
    });
    state.balance += total;
    if (state.screen !== "home" && state.screen !== "activity") state.screen = "home";
    state.menuOpen = false;
    /* El toast admite 30 caracteres: con Q1,000.00 queda justo. */
    showToast(`Recibiste ${quetzal(total)} de recarga`, { tone: "success", icon: "fa-circle-check" });
    later(() => animateBalance(state.balance), 250);
  }

  function enterHome() {
    state.loggedIn = true;
    state.sheet = null;
    state.notif = false;
    state.otpBusy = false;
    state.passkey = false;
    state.history = [];
    state.screen = "home";
    if (state.pendingExpired) {
      const r = state.pendingExpired;
      state.pendingExpired = null;
      addActivity({ status: "vencido", amount: r.amount, merchant: r.merchant, id: `VX-${r.id.split("-")[1]}` });
    }
    render();
    receiveTopups();
    /* La solicitud que avisaba el login se abre sola al entrar. */
    if (state.request) {
      later(() => {
        if (state.screen === "home" && state.request && !state.sheet && !state.menuOpen) {
          state.requestOpen = true;
          render();
        }
      }, 450);
    }
  }

  /* La cuenta del saldo baja de a poco hasta el valor nuevo. */
  function animateBalance(to) {
    clearInterval(countTimer);
    const from = state.shownBalance;
    if (reducedMotion() || from === to) {
      state.shownBalance = to;
      render();
      return;
    }
    const start = performance.now();
    const ms = 900;
    countTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      state.shownBalance = from + (to - from) * eased;
      const value = root.querySelector("[data-role='balance-card'] .payment-card-amount-value");
      if (value) value.textContent = plain(state.shownBalance);
      if (t >= 1) {
        clearInterval(countTimer);
        state.shownBalance = to;
      }
    }, 30);
  }

  function approve(button) {
    const r = state.request;
    if (!r || state.approving) return;
    const frame = root.querySelector(".oky-flow-frame");
    const fr = frame.getBoundingClientRect();
    const br = button ? button.getBoundingClientRect() : null;
    const scale = fr.width / (frame.offsetWidth || 360) || 1;
    const x = br ? (br.left + br.width / 2 - fr.left) / scale : 180;
    const y = br ? (br.top + br.height / 2 - fr.top) / scale : 560;
    const id = `AP-${String(++state.seq)}`;
    state.request = null;
    state.requestOpen = false;
    state.approving = { x: Math.round(x), y: Math.round(y), amount: r.amount, merchant: r.merchant, id };
    render();
    later(() => {
      state.approving = { ...state.approving, leaving: true };
      render();
    }, reducedMotion() ? 1200 : APPROVE_MS);
    later(() => {
      state.approving = null;
      state.balance = Math.max(0, state.balance - r.amount);
      addActivity({ status: "aprobado", amount: r.amount, merchant: r.merchant, id });
      if (state.screen !== "home") state.screen = "home";
      render();
      later(() => animateBalance(state.balance), 250);
    }, (reducedMotion() ? 1200 : APPROVE_MS) + 400);
  }

  function confirmReject() {
    const r = state.request;
    state.sheet = null;
    if (!r) return render();
    state.request = null;
    state.requestOpen = false;
    addActivity({ status: "rechazado", amount: r.amount, merchant: r.merchant, id: `RX-${r.id.split("-")[1]}` });
    state.screen = "home";
    showToast("Rechazaste la solicitud", { tone: "error", icon: "fa-circle-xmark" });
  }

  function reset() {
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    clearInterval(typeTimer);
    clearInterval(countTimer);
    state = createInitialState();
    render();
    tick();
  }

  root.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || !root.contains(el)) return;
    const action = el.dataset.action;

    /* Los botones de la tarjeta pendiente viven dentro de la tarjeta,
       que a su vez abre el modal: gana el más cercano. */
    if (action === "reset") return reset();
    if (action === "close-login-toast") {
      state.loginToast = false;
      return render();
    }
    if (action === "fill-phone") return fillPhone();
    if (action === "clear-phone") {
      state.phone = "";
      return render();
    }
    if (action === "request-code") {
      state.sheet = "delivery";
      return render();
    }
    if (action === "pick-channel") {
      state.channel = el.dataset.channel || "whatsapp";
      return sendCode();
    }
    if (action === "resend") return sendCode();
    if (action === "fill-otp") return fillOtp();
    if (action === "verify") {
      if (state.otp !== OTP) return;
      state.otpBusy = true;
      render();
      return later(enterHome, 800);
    }
    if (action === "passkey") {
      state.passkey = true;
      render();
      return later(enterHome, 1300);
    }
    if (action === "close-sheet") {
      if (state.sheet === "otp" || state.sheet === "delivery") {
        clearTimeout(notifTimer);
        state.notif = false;
      }
      state.sheet = null;
      return render();
    }
    if (action === "open-request") {
      if (!state.request) return;
      state.requestOpen = true;
      return render();
    }
    if (action === "minimize") {
      state.requestOpen = false;
      return render();
    }
    if (action === "approve") return approve(el);
    if (action === "reject") {
      if (!state.request) return;
      state.requestOpen = false;
      state.sheet = "reject";
      return render();
    }
    if (action === "cancel-reject") {
      state.sheet = null;
      state.requestOpen = !!state.request;
      return render();
    }
    if (action === "confirm-reject") return confirmReject();
    if (action === "open-menu") {
      state.menuOpen = true;
      return render();
    }
    if (action === "close-menu") {
      state.menuOpen = false;
      return render();
    }
    if (action === "scan") {
      return showToast("Escanea el QR de la tienda", { tone: "warning", icon: "fa-qrcode", ms: 2000 });
    }
    if (action === "share") {
      state.menuOpen = false;
      state.sheet = "share";
      return render();
    }
    if (action === "logout") {
      clearInterval(countTimer);
      state.menuOpen = false;
      state.loggedIn = false;
      state.history = [];
      state.phone = "";
      state.otp = "";
      state.requestOpen = false;
      state.loginToast = !!state.request;
      state.screen = "login";
      return render();
    }
    if (action.startsWith("go:")) return go(action.slice(3));
    if (action === "back") return back();
    if (action === "open-filter") {
      state.sheet = "filter";
      return render();
    }
    if (action === "pick-filter") {
      state.filter = el.dataset.filter || "todos";
      state.sheet = null;
      return render();
    }
    if (action === "help-channel") {
      state.helpChannel = el.dataset.channel;
      return render();
    }
  });

  root.addEventListener("input", (event) => {
    if (event.target.id === "yayo-search") {
      state.query = event.target.value;
      state.keepScroll = true;
      render();
    }
    if (event.target.id === "yayo-phone") {
      clearInterval(typeTimer);
      state.typing = false;
      state.phone = event.target.value.replace(/[^\d ]/g, "").slice(0, 9);
      render();
    }
  });

  /* Lo que se pinta como botón sin serlo (filas del menú, la tarjeta
     pendiente) también responde a Enter y a la barra espaciadora. */
  root.addEventListener("keydown", (event) => {
    const el = event.target.closest && event.target.closest("[role='button'][data-action]");
    if (el && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      el.click();
    }
  });

  listenYayoTopups(receiveTopups);

  root.addEventListener("submit", (event) => {
    if (!event.target.matches("[data-role='chat-form']")) return;
    event.preventDefault();
    const input = root.querySelector("#yayo-chat");
    const text = (input && input.value.trim()) || "";
    if (!text) return;
    state.chat.push({ me: true, text: text.replace(/</g, "&lt;") });
    render();
    later(() => {
      state.chat.push({ me: false, text: "¡Gracias por escribirnos! Un agente de OKY te responde en unos minutos." });
      if (state.screen === "help") render();
    }, 1100);
  });

  /* #home entra ya con sesión: para mostrar la solicitud sin pasar
     por el login. */
  if (window.location.hash === "#home") {
    state.phone = PHONE;
    enterHome();
  } else {
    render();
  }
  tick();
}
