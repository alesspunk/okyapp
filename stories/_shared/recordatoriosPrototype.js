/* ─────────────────────────────────────────────────────────
   Pages / Recordatorios de pago · EEGSA / Prototype (solo GT)

   Cuarto prototipo independiente (/recordatorios). Junta lo que ya se
   acordó para los recordatorios de pago y lo lleva a una marca, EEGSA:

     7500 · Recordatorios (99101:20347): menú › Recordatorios
       (99105:14317), la pantalla de la marca con los pagos recientes
       (99105:14130), el número correlativo nuevo (99105:13960), el pago
       ya hecho (99105:13972) y la consulta (99105:14896).
     7600 · Pagos de servicios en Mis compras (103018:45517): el
       post-checkout con el interruptor (SRV-01/02) y Mis compras con el
       recordatorio por correlativo (SRV-06/07/08).

   Lo que cambia contra el flujo de 7500:
   - Tocar EEGSA no abre una PDP: abre la pantalla de la marca con los
     recordatorios y la actividad.
   - Ya no hay «Ver detalle» → «Consultar»: tocar un recordatorio o un
     pago hecho consulta solo. Si ya llegó la factura (fecha de pago) se
     ve el saldo y se sigue al checkout con el contacto de la última vez.
     Si todavía no toca, sale el modal «Estás al día», sin nada que hacer.
   - Los filtros de la actividad arrancan en 45 días (un mes no alcanza
     para ver pagos mensuales) y se quitan con «Quitar filtro», igual que
     en Mis compras de OKY Cash.
   - El recordatorio es de la cuenta (número correlativo), no del pago:
     apagarlo en un sitio lo apaga en todos (nota 1 de 7600).

   En GT no se gana OKY Cash: nada de copy de cashback en todo el flujo.
───────────────────────────────────────────────────────── */

import { renderHistoryCard } from "./historyCards";
import { renderFlag } from "./flag";

const RATE = 7.55;
const FEE = 1;
/* Días desde el último pago a partir de los que ya hay factura nueva
   que consultar (el ciclo de EEGSA es mensual). */
const BILL_AFTER_DAYS = 25;
const CYCLE_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const MONTHS_LONG = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const money = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const quetzal = (n) => `Q${money(n)}`;
const usd = (n) => `$${money(n)}`;
const toUsd = (q) => Math.round((q / RATE) * 100) / 100;
const dateLabel = (d) => `${String(d.getDate()).padStart(2, "0")} / ${MONTHS[d.getMonth()]} / ${d.getFullYear()}`;
const shortDate = (d) => `${String(d.getDate()).padStart(2, "0")} / ${MONTHS[d.getMonth()]}`;
const addDays = (d, n) => new Date(d.getTime() + n * DAY);
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const reducedMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const formatCorr = (c) => c;

/* Hoy, fijo para que la demo sea igual siempre. El panel de abajo lo
   adelanta para probar que el recordatorio vuelve a consultar cuando
   llega la fecha de pago. */
const TODAY = new Date(2026, 10, 16);
const JUMP_TO = new Date(2026, 11, 1);

/* ── Datos ───────────────────────────────────────────────── */

/* Tres cuentas de EEGSA (números correlativos). Cada una con el
   contacto al que se le pagó la última vez: el checkout lo reusa. */
const BASE_ACCOUNTS = [
  {
    corr: "0011900222",
    alias: "Electricidad de Daniel Paz",
    contact: { name: "Daniel Paz", phone: "+502 5512 3344", initials: "DP" },
    reminder: true,
    day: 18,
    from: { y: 2025, m: 11 },
    amounts: [287, 291.5, 302, 296.75, 288.1, 279.4, 284, 301.25, 309.6, 302, 302],
    nextBill: 296.4,
  },
  {
    corr: "0011900471",
    alias: "Electricidad de Mamá",
    contact: { name: "Ana López (Mamá)", phone: "+502 4478 9012", initials: "AL" },
    reminder: true,
    day: 5,
    from: { y: 2026, m: 0 },
    amounts: [318, 322.4, 325, 331.8, 327, 319.5, 325, 340.2, 333.1, 325, 325],
    nextBill: 318.2,
  },
  {
    corr: "0011900588",
    alias: "Electricidad de +502 6598-7847",
    contact: { name: "", phone: "+502 6598 7847", initials: "" },
    /* Este se apagó al pagar (opt-out): vive en «Apagados». */
    reminder: false,
    day: 14,
    from: { y: 2026, m: 2 },
    amounts: [139.5, 144, 141.2, 150.3, 144, 147.75, 144, 144],
    nextBill: 151,
  },
];

/* Un número nuevo que no está en la cuenta: lo que trae la consulta. */
const NEW_BILL = 212.75;

function seedPayments() {
  const list = [];
  BASE_ACCOUNTS.forEach((acc) => {
    acc.amounts.forEach((q, i) => {
      const d = new Date(acc.from.y, acc.from.m + i, acc.day);
      if (d > TODAY) return;
      list.push({ id: `${acc.corr}-${i}`, corr: acc.corr, date: d, q });
    });
  });
  return list;
}

function createInitialState() {
  const accounts = {};
  BASE_ACCOUNTS.forEach((a) => {
    accounts[a.corr] = {
      corr: a.corr,
      alias: a.alias,
      contact: { ...a.contact },
      reminder: a.reminder,
      nextBill: a.nextBill,
    };
  });
  return {
    today: TODAY,
    screen: "servicios",
    history: [],
    accounts,
    payments: seedPayments(),
    /* Pantalla de la marca */
    corrInput: "",
    corrError: "",
    trackIndex: 0,
    filter: { period: "", corr: "" },
    draft: null,
    /* Flujo de pago */
    current: null, // { corr, q, isNew }
    newName: "",
    lastPayment: null,
    voucherCorr: "",
    recSearch: "",
    myTab: "otros",
    /* Capas */
    sheet: null, // { type, corr?, origin? }
    loading: null, // texto
    menuOpen: false,
    toast: null,
    keepScroll: false,
  };
}

/* ── Reglas ─────────────────────────────────────────────── */

function paymentsOf(state, corr) {
  return state.payments.filter((p) => p.corr === corr).sort((a, b) => b.date - a.date);
}

function lastPaymentOf(state, corr) {
  return paymentsOf(state, corr)[0] || null;
}

/* El estado del recordatorio sale de la fecha del último pago:
   - due: ya pasó el ciclo, hay factura → se consulta y se paga.
   - aldia: todavía no toca → modal «Estás al día».  */
function statusOf(state, corr) {
  const last = lastPaymentOf(state, corr);
  if (!last) return { kind: "due", label: "Por consultar", daysLeft: 0, notifyOn: state.today, dueOn: state.today };
  const notifyOn = addDays(last.date, BILL_AFTER_DAYS);
  const dueOn = addDays(last.date, CYCLE_DAYS);
  const daysLeft = daysBetween(state.today, dueOn);
  if (daysBetween(notifyOn, state.today) >= 0) {
    const label = daysLeft > 1 ? `Vence en ${daysLeft} días` : daysLeft === 1 ? "Vence mañana" : daysLeft === 0 ? "Vence hoy" : `Venció hace ${-daysLeft} ${-daysLeft === 1 ? "día" : "días"}`;
    return { kind: "due", label, daysLeft, notifyOn, dueOn, last };
  }
  return { kind: "aldia", label: "Al día", daysLeft, notifyOn, dueOn, last };
}

function accountTitle(acc) {
  return acc.alias || `Electricidad de #${acc.corr}`;
}

function dueAccounts(state) {
  return Object.values(state.accounts).filter((a) => a.reminder && statusOf(state, a.corr).kind === "due");
}

/* Recordatorios activos, lo que toca pagar primero. */
function activeReminders(state) {
  return Object.values(state.accounts)
    .filter((a) => a.reminder)
    .sort((a, b) => {
      const sa = statusOf(state, a.corr);
      const sb = statusOf(state, b.corr);
      if (sa.kind !== sb.kind) return sa.kind === "due" ? -1 : 1;
      return sa.dueOn - sb.dueOn;
    });
}

/* ── Filtros de actividad ────────────────────────────────
   Pagos mensuales: menos de 45 días casi siempre enseña uno solo, así
   que el rango arranca ahí y sube hasta todo el historial. */
const PERIODS = [
  { key: "45", label: "Últimos 45 días", days: 45 },
  { key: "90", label: "Últimos 3 meses", days: 90 },
  { key: "180", label: "Últimos 6 meses", days: 180 },
  { key: "year", label: "Este año", days: null },
];

function inPeriod(state, p, period) {
  if (!period) return true;
  const def = PERIODS.find((x) => x.key === period);
  if (!def) return true;
  if (def.key === "year") return p.date.getFullYear() === state.today.getFullYear();
  return daysBetween(p.date, state.today) <= def.days;
}

function filteredPayments(state, filter = state.filter) {
  const typed = state.corrInput.trim();
  return state.payments
    .filter((p) => inPeriod(state, p, filter.period))
    .filter((p) => !filter.corr || p.corr === filter.corr)
    .filter((p) => !typed || p.corr.startsWith(typed))
    .sort((a, b) => b.date - a.date);
}

function filterLabel(state) {
  const parts = [];
  if (state.filter.period) parts.push(PERIODS.find((p) => p.key === state.filter.period).label);
  if (state.filter.corr) {
    const acc = state.accounts[state.filter.corr];
    parts.push(accountTitle(acc).replace(/^Electricidad de /, ""));
  }
  return parts.join(" · ");
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

function titledHeader(title, { back = "back", right = "" } = {}) {
  return `
    <header class="oky-flow-header rec-header">
      ${
        back
          ? `<button class="oky-flow-header-icon" data-action="${back}" type="button" aria-label="Atrás">
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>`
          : `<span class="oky-flow-header-icon" aria-hidden="true"></span>`
      }
      <h1 class="oky-flow-title">${title}</h1>
      ${right || `<span class="oky-flow-header-icon" aria-hidden="true"></span>`}
    </header>
  `;
}

/* Cabecera de marca (7500): flecha, nombre y el logo en su caja. */
function brandHeader({ back = "back", right = "" } = {}) {
  return `
    <header class="rec-brand-head">
      <button class="oky-flow-header-icon rec-brand-back" data-action="${back}" type="button" aria-label="Atrás">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>
      <p class="rec-brand-name">EEGSA</p>
      <span class="rec-brand-logo"><img src="eggsa.png" alt="EEGSA" /></span>
      ${right ? `<span class="rec-brand-right">${right}</span>` : ""}
    </header>
  `;
}

function sectionLabel(text, extra = "") {
  return `<p class="rec-overline">${text}${extra}</p>`;
}

function pill(status) {
  const tone = status.kind === "due" ? (status.daysLeft < 0 ? "error" : "warning") : status.kind === "off" ? "off" : "success";
  return `<span class="rec-pill is-${tone}">${status.label}</span>`;
}

function rSwitch(on, action, corr, label) {
  return `
    <button class="rec-switch${on ? " is-on" : ""}" data-action="${action}" data-corr="${corr}" type="button"
      role="switch" aria-checked="${on}" aria-label="${label}">
      <span class="rec-switch-knob" aria-hidden="true"></span>
    </button>
  `;
}

function avatar(contact) {
  if (contact.initials) return `<span class="rec-avatar">${contact.initials}</span>`;
  return `<span class="rec-avatar is-phone"><i class="fa-solid fa-phone" aria-hidden="true"></i></span>`;
}

/* ── Reminder Card (7500 · 99105:14325, con marca) ────────
   Ya no lleva «Ver detalle»: el CTA dice lo que va a pasar y consulta
   solo. Con factura: «Pagar ahora». Sin factura: «Consultar saldo», que
   termina en «Estás al día». */
function reminderCard(state, acc, { wide = false } = {}) {
  const st = statusOf(state, acc.corr);
  const last = st.last;
  const body =
    st.kind === "due"
      ? last
        ? `Ya llegó tu factura. La última vez pagaste ${quetzal(last.q)} el ${shortDate(last.date)}.`
        : "Consulta tu saldo para pagar."
      : `Pagaste ${quetzal(last.q)} el ${shortDate(last.date)}. Te avisaremos el ${shortDate(st.notifyOn)}.`;
  return `
    <article class="reminder-card-molecule rec-card${wide ? " is-wide" : ""}${st.kind === "due" ? " is-due" : ""}"
      data-figma-node="99105:14325">
      <div class="reminder-card-top">
        <div class="reminder-card-main">
          <div class="rec-card-titlerow">
            <h3 class="reminder-card-title">${escapeHtml(accountTitle(acc))}</h3>
          </div>
          <div class="reminder-card-brand-row">
            <div class="reminder-card-brand"><img src="eggsa.png" alt="EEGSA" /></div>
            <div class="rec-card-copy">
              ${pill(st)}
              <p class="reminder-card-body">${body}</p>
            </div>
          </div>
        </div>
        <button class="reminder-card-menu" data-action="reminder-menu" data-corr="${acc.corr}" type="button"
          aria-label="Opciones de ${escapeHtml(accountTitle(acc))}">
          <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
        </button>
      </div>
      <div class="reminder-card-actions">
        <button class="btn ${st.kind === "due" ? "btn-primary" : "btn-outlined"} btn-medium reminder-card-cta"
          data-action="consult" data-corr="${acc.corr}" type="button">
          ${st.kind === "due" ? "Pagar ahora" : "Consultar saldo"}
        </button>
      </div>
    </article>
  `;
}

function reminderCarousel(state, list) {
  if (!list.length) {
    return `
      <div class="rec-empty-inline">
        <i class="fa-regular fa-bell-slash" aria-hidden="true"></i>
        <p>No tienes recordatorios activos. Se activan solos cuando pagas un servicio.</p>
      </div>
    `;
  }
  const multi = list.length > 1;
  const idx = Math.min(state.trackIndex, list.length - 1);
  return `
    <div class="rec-carousel${multi ? " is-multi" : ""}">
      <div class="rec-track" data-role="rec-track" role="list">
        ${list.map((acc) => `<div class="rec-slide" role="listitem">${reminderCard(state, acc)}</div>`).join("")}
      </div>
      ${
        multi
          ? `<div class="rec-dots" aria-hidden="true">
              ${list.map((_, i) => `<span class="rec-dot${i === idx ? " is-on" : ""}"></span>`).join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

/* Tarjeta de historial · Service Payment (99105:47460), con el foco de
   luz y el monto en quetzales abajo a la derecha. Toda la tarjeta
   consulta: es el «pago ya hecho» de 99105:13972. */
function paymentRow(p) {
  return `
    <div class="rec-pay" data-action="consult" data-corr="${p.corr}" role="button" tabindex="0"
      aria-label="Pago del ${dateLabel(p.date)} por ${quetzal(p.q)}. Consultar saldo de ${p.corr}">
      ${renderHistoryCard({
        key: "service-payment",
        id: "99105:13972",
        layout: "row",
        icon: { glyph: "fa-lightbulb", weight: "fa-regular" },
        date: dateLabel(p.date),
        amount: usd(toUsd(p.q) + FEE),
        meta: { type: "brand", logo: "eggsa.png", logoAlt: "EEGSA", brand: `#${p.corr}`, secondaryAmount: quetzal(p.q).replace(".00", "") },
      })}
    </div>
  `;
}

/* Agrupa por mes («ESTE MES», «OCTUBRE 2026»…) o, con un correlativo
   escrito, por número (99105:13960). */
function activityList(state) {
  const list = filteredPayments(state);
  if (!list.length && state.corrInput.trim()) {
    return `
      <div class="rec-empty">
        <p class="rec-empty-title">Sin pagos con este número</p>
        <p class="rec-empty-note">${
          /^\d{10}$/.test(state.corrInput.trim())
            ? "Toca Consultar para ver su saldo. Al pagarlo lo guardamos y te recordamos el próximo."
            : "Termina de escribir los 10 dígitos o elige uno de tus números."
        }</p>
      </div>
    `;
  }
  if (!list.length) {
    return `
      <div class="rec-empty">
        <img src="oky-campana-3d.png" alt="" class="rec-empty-art" />
        <p class="rec-empty-title">No hay pagos en este rango</p>
        <p class="rec-empty-note">Prueba con un período más largo o quita el filtro.</p>
        <button class="btn btn-outlined btn-small" data-action="clear-filter" type="button">Quitar filtro</button>
      </div>
    `;
  }
  const groups = [];
  const byCorr = !!state.corrInput.trim();
  list.forEach((p) => {
    const key = byCorr
      ? `#${p.corr}`
      : p.date.getMonth() === state.today.getMonth() && p.date.getFullYear() === state.today.getFullYear()
        ? "ESTE MES"
        : `${MONTHS_LONG[p.date.getMonth()].toUpperCase()} ${p.date.getFullYear()}`;
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push((g = { key, items: [] }));
    g.items.push(p);
  });
  return groups
    .map(
      (g) => `
      <p class="rec-group">${g.key}</p>
      <div class="rec-group-list">${g.items.map(paymentRow).join("")}</div>
    `,
    )
    .join("");
}

/* ── Pantallas ──────────────────────────────────────────── */

/* Home de Pago de servicios (GT). Los recordatorios de todas las marcas
   se acumulan aquí arriba; tocar EEGSA abre su pantalla, no una PDP. */
function screenServicios(state) {
  const due = dueAccounts(state).length;
  return `
    ${statusBar()}
    ${titledHeader("Pago de servicios", { back: "noop-back" })}
    <div class="rec-body">
      ${sectionLabel("Tus recordatorios", due ? ` <span class="rec-count">${due} por pagar</span>` : "")}
      ${reminderCarousel(state, activeReminders(state))}
      ${sectionLabel("Electricidad")}
      <div class="rec-brands">
        <button class="rec-brand-tile" data-action="go" data-screen="eegsa" type="button">
          <span class="rec-brand-tile-logo"><img src="eggsa.png" alt="" /></span>
          <span class="rec-brand-tile-name">EEGSA</span>
          ${due ? `<span class="rec-brand-tile-badge" aria-label="${due} por pagar">${due}</span>` : ""}
        </button>
        <div class="rec-brand-tile is-soon" aria-disabled="true">
          <span class="rec-brand-tile-logo is-text">ENERGUATE</span>
          <span class="rec-brand-tile-name">Energuate</span>
        </div>
      </div>
      ${sectionLabel("Agua")}
      <div class="rec-brands">
        <div class="rec-brand-tile is-soon" aria-disabled="true">
          <span class="rec-brand-tile-logo is-text"><i class="fa-solid fa-droplet" aria-hidden="true"></i></span>
          <span class="rec-brand-tile-name">Empagua</span>
        </div>
      </div>
      <p class="rec-hint">En el prototipo solo EEGSA está activo.</p>
    </div>
  `;
}

/* Pantalla de la marca (99105:14130 + 99105:13960). */
function screenEegsa(state) {
  const typed = state.corrInput.trim();
  const valid = /^\d{10}$/.test(typed);
  const filterOn = !!(state.filter.period || state.filter.corr);
  const known = Object.values(state.accounts);
  const suggestions = typed && !valid ? known.filter((a) => a.corr.startsWith(typed)) : [];
  const reminders = activeReminders(state);
  return `
    ${statusBar()}
    ${brandHeader()}
    <div class="rec-body has-cta">
      <div class="input-wrapper rec-input${typed ? " has-value" : ""}${state.corrError ? " has-error" : ""}">
        ${typed ? `<label class="rec-input-label" for="rec-corr">Número correlativo</label>` : ""}
        <input id="rec-corr" class="input-field" inputmode="numeric" maxlength="10" autocomplete="off"
          placeholder="Ingresar número correlativo" value="${escapeHtml(typed)}" data-role="corr-input"
          aria-describedby="rec-corr-help" />
        ${
          typed
            ? `<button class="rec-input-clear" data-action="clear-corr" type="button" aria-label="Borrar número">
                <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
              </button>`
            : ""
        }
      </div>
      <p class="rec-input-help${state.corrError ? " is-error" : ""}" id="rec-corr-help">
        ${
          state.corrError
            ? `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${state.corrError}`
            : typed && !valid
              ? `${typed.length}/10 dígitos`
              : "Son 10 dígitos. Lo encuentras arriba a la derecha de tu factura."
        }
      </p>
      ${
        suggestions.length
          ? `<div class="rec-suggest" role="listbox" aria-label="Números guardados">
              ${suggestions
                .map(
                  (a) => `<button class="rec-suggest-item" data-action="pick-corr" data-corr="${a.corr}" type="button" role="option">
                    <span class="rec-suggest-num">#${a.corr}</span>
                    <span class="rec-suggest-name">${escapeHtml(accountTitle(a))}</span>
                  </button>`,
                )
                .join("")}
            </div>`
          : ""
      }
      ${
        !typed
          ? `<button class="rec-demo-chip" data-action="type-new" type="button">
              <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Probar con un número nuevo
            </button>`
          : ""
      }

      ${typed ? "" : `${sectionLabel("Recordatorios")}${reminderCarousel(state, reminders)}`}

      <div class="rec-activity-head">
        ${
          filterOn
            ? `<button class="rec-filter-label is-tappable" data-action="open-filter" type="button">${filterLabel(state)}</button>`
            : `<p class="rec-overline is-flat">Actividad</p>`
        }
        ${
          filterOn
            ? `<button class="btn btn-primary btn-small oky-flow-filter-btn is-on" data-action="clear-filter" type="button">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>&nbsp;Quitar filtro
              </button>`
            : `<button class="btn btn-outlined btn-small oky-flow-filter-btn" data-action="open-filter" type="button">
                <i class="fa-solid fa-sliders" aria-hidden="true"></i>&nbsp;Filtrar
              </button>`
        }
      </div>
      ${activityList(state)}
    </div>
    <div class="oky-flow-cta-bar rec-cta-bar">
      <button class="btn btn-primary btn-large rec-full${valid ? "" : " btn-disabled"}" data-action="consult-typed"
        type="button" ${valid ? "" : 'aria-disabled="true"'}>Consultar</button>
    </div>
  `;
}

/* Resumen con la solapa del tipo de cambio (99105:14896). */
function summaryDock(q, { cta, action }) {
  const pay = toUsd(q);
  return `
    <div class="rec-summary">
      <div class="summary-type-overlay rec-summary-tab">
        <span class="token-exchange">TIPO DE CAMBIO: Q ${RATE.toFixed(2)}</span>
      </div>
      <div class="rec-summary-card">
        <div class="rec-sum-row"><span>Monto en moneda local</span><span>${quetzal(q)}</span></div>
        <div class="rec-sum-row is-strong"><span>Monto a pagar</span><span>${usd(pay)}</span></div>
        <div class="rec-sum-row"><span>Costo por servicio</span><span>${usd(FEE)}</span></div>
        <div class="rec-sum-row is-total"><span>PAGAS</span><span>${usd(pay + FEE)}</span></div>
        <button class="btn btn-primary btn-large rec-full" data-action="${action}" type="button">${cta}</button>
      </div>
    </div>
  `;
}

function bigAmount(q) {
  const [ent, dec] = money(q).split(".");
  return `
    <p class="rec-amount" aria-label="${quetzal(q)}">
      <span class="rec-amount-cur">Q</span><span class="rec-amount-val">${ent}</span>${dec !== "00" ? `<span class="rec-amount-dec">.${dec}</span>` : ""}
    </p>
  `;
}

/* La consulta: el saldo que trae EEGSA y, si ya se le pagó antes,
   para quién es. De aquí se sigue directo al checkout. */
function screenConsulta(state) {
  const cur = state.current;
  const acc = state.accounts[cur.corr];
  const st = acc ? statusOf(state, acc.corr) : null;
  return `
    ${statusBar()}
    ${brandHeader()}
    <div class="rec-body has-dock">
      <section class="rec-amount-card">
        <p class="rec-amount-kicker">Pago a servicios</p>
        ${bigAmount(cur.q)}
        <p class="rec-amount-corr">#${cur.corr}</p>
        ${
          st && st.kind === "due"
            ? `<span class="rec-pill is-${st.daysLeft < 0 ? "error" : "warning"}">${st.label} · ${shortDate(st.dueOn)}</span>`
            : ""
        }
      </section>
      ${
        acc && !cur.isNew
          ? `<div class="rec-for">
              ${avatar(acc.contact)}
              <div class="rec-for-copy">
                <p class="rec-for-kicker">La última vez le pagaste a</p>
                <p class="rec-for-name">${escapeHtml(acc.contact.name || acc.contact.phone)}</p>
              </div>
            </div>`
          : `<div class="rec-for is-new">
              <span class="rec-avatar is-new"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>
              <div class="rec-for-copy">
                <p class="rec-for-kicker">Número nuevo</p>
                <p class="rec-for-name">Lo guardamos al pagar para recordártelo.</p>
              </div>
            </div>`
      }
    </div>
    ${summaryDock(cur.q, { cta: cur.isNew ? "Continuar" : "Volver a pagar", action: "go-checkout" })}
  `;
}

function screenCheckout(state) {
  const cur = state.current;
  const acc = state.accounts[cur.corr];
  return `
    ${statusBar()}
    ${titledHeader("Checkout")}
    <div class="rec-body has-dock">
      ${sectionLabel("Para")}
      ${
        acc && !cur.isNew
          ? `<div class="rec-row">
              ${avatar(acc.contact)}
              <div class="rec-row-copy">
                <p class="rec-row-title">${escapeHtml(acc.contact.name || "Sin nombre")}</p>
                <p class="rec-row-sub">${acc.contact.phone} · el mismo de la última vez</p>
              </div>
              <button class="rec-link" data-action="toast-info" data-text="Elegir otro contacto (fuera del prototipo)" type="button">Cambiar</button>
            </div>`
          : `<div class="input-wrapper rec-input${state.newName ? " has-value" : ""}">
              ${state.newName ? `<label class="rec-input-label" for="rec-name">¿De quién es este servicio?</label>` : ""}
              <input id="rec-name" class="input-field" maxlength="24" autocomplete="off" data-role="name-input"
                placeholder="¿De quién es? Ej. Casa, Mamá (opcional)" value="${escapeHtml(state.newName)}" />
            </div>
            <p class="rec-input-help">Así se llamará tu recordatorio.</p>`
      }
      ${sectionLabel("Servicio")}
      <div class="rec-row">
        <span class="rec-row-logo"><img src="eggsa.png" alt="" /></span>
        <div class="rec-row-copy">
          <p class="rec-row-title">EEGSA · Pago a servicios</p>
          <p class="rec-row-sub">#${cur.corr}</p>
        </div>
        <p class="rec-row-amount">${quetzal(cur.q)}</p>
      </div>
      ${sectionLabel("Método de pago")}
      <div class="rec-row">
        <img class="rec-row-card" src="oky-card-3d.png" alt="" />
        <div class="rec-row-copy">
          <p class="rec-row-title">Visa **** 2111</p>
          <p class="rec-row-sub">Tarjeta para pago</p>
        </div>
        <i class="fa-solid fa-ellipsis-vertical rec-row-more" aria-hidden="true"></i>
      </div>
    </div>
    ${summaryDock(cur.q, { cta: `Pagar - ${usd(toUsd(cur.q) + FEE)}`, action: "pay" })}
  `;
}

/* El vale del pago (SRV-01 / SRV-06): top con OKY y bandera, logo,
   monto y los datos para reclamar. El correlativo también se copia
   (nota 10 de 7600: es lo que más piden para volver a pagar). */
function voucher(state, pay, { repay = false } = {}) {
  return `
    <article class="rec-voucher">
      <div class="rec-voucher-top">
        <img class="rec-voucher-oky" src="logo-oky.svg" alt="OKY" />
        ${renderFlag({ code: "GTM", size: "Medium" })}
        <span class="rec-voucher-logo"><img src="eggsa.png" alt="EEGSA" /></span>
      </div>
      <div class="rec-voucher-mid">
        <p class="rec-amount-kicker">Pago a servicios</p>
        ${bigAmount(pay.q)}
        ${
          repay
            ? `<button class="rec-link is-center" data-action="consult" data-corr="${pay.corr}" type="button">
                <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Pagar de nuevo
              </button>`
            : ""
        }
      </div>
      <div class="rec-voucher-data">
        <div class="rec-data-row">
          <span class="rec-data-k">NÚMERO CORRELATIVO</span>
          <span class="rec-data-k is-right">PAGO ${shortDate(pay.date)} / ${pay.date.getFullYear()}</span>
        </div>
        <p class="rec-data-v">${pay.corr}
          <button class="rec-copy" data-action="copy" data-text="Número correlativo copiado" type="button" aria-label="Copiar número correlativo">
            <i class="fa-regular fa-copy" aria-hidden="true"></i>
          </button>
        </p>
        <span class="rec-data-k">NÚMERO DE TRANSACCIÓN</span>
        <p class="rec-data-v">${pay.tx || "702570257025"}
          <button class="rec-copy" data-action="copy" data-text="Número de transacción copiado" type="button" aria-label="Copiar número de transacción">
            <i class="fa-regular fa-copy" aria-hidden="true"></i>
          </button>
        </p>
        <div class="rec-data-row is-last">
          <div>
            <span class="rec-data-k">AUX CODE</span>
            <p class="rec-data-v">09109201</p>
          </div>
          <button class="rec-help" data-action="toast-info" data-text="Abriendo Ayuda por WhatsApp" type="button">
            <img src="whatsapp.png" alt="" /> AYUDA
          </button>
        </div>
      </div>
    </article>
  `;
}

function reminderRow(state, corr, { title, origin }) {
  const acc = state.accounts[corr];
  const st = statusOf(state, corr);
  return `
    <div class="rec-remind-row${acc.reminder ? "" : " is-off"}">
      <div class="rec-remind-copy">
        <p class="rec-remind-title">${title}</p>
        <p class="rec-remind-sub">${
          acc.reminder
            ? `<i class="fa-regular fa-bell" aria-hidden="true"></i> Te avisaremos el ${shortDate(st.notifyOn)}`
            : "Apagado. No te avisaremos de este número."
        }</p>
      </div>
      ${rSwitch(acc.reminder, `toggle-reminder:${origin}`, corr, title)}
    </div>
  `;
}

/* Post-checkout · pago exitoso (SRV-01). El recordatorio nace encendido
   (opt-in al adquirir); apagarlo pide confirmación (SRV-02). */
function screenExito(state) {
  const pay = state.lastPayment;
  return `
    ${statusBar()}
    <header class="rec-success-head">
      <button class="oky-flow-header-icon" data-action="go" data-screen="eegsa" type="button" aria-label="Volver a EEGSA">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>
      <span class="rec-success-chip"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Pago exitoso</span>
      <button class="oky-flow-header-icon" data-action="open-voucher" data-corr="${pay.corr}" type="button" aria-label="Ver en Mis compras">
        <i class="fa-solid fa-receipt" aria-hidden="true"></i>
      </button>
    </header>
    <div class="rec-body has-cta">
      ${voucher(state, pay)}
      ${reminderRow(state, pay.corr, { title: "Te recordaremos el próximo pago", origin: "exito" })}
    </div>
    <div class="oky-flow-cta-bar rec-cta-bar">
      <button class="btn btn-outlined btn-large rec-full" data-action="send-photo" type="button">
        <i class="fa-solid fa-camera" aria-hidden="true"></i> Mandale foto
      </button>
    </div>
  `;
}

/* Mis compras · Para otros, ya filtrado por Pago de servicios (SRV-05).
   Una fila por cuenta con el estado del recordatorio a la vista. */
function screenMisCompras(state) {
  const tab = state.myTab;
  const accs = Object.values(state.accounts).filter((a) => lastPaymentOf(state, a.corr));
  return `
    ${statusBar()}
    ${titledHeader("Mis compras")}
    <div class="rec-body">
      <div class="rec-seg" role="tablist" aria-label="Para quién">
        <button class="rec-seg-item${tab === "mi" ? " is-on" : ""}" role="tab" aria-selected="${tab === "mi"}"
          data-action="my-tab" data-tab="mi" type="button"><span aria-hidden="true">🙋</span> Para mí</button>
        <button class="rec-seg-item${tab === "otros" ? " is-on" : ""}" role="tab" aria-selected="${tab === "otros"}"
          data-action="my-tab" data-tab="otros" type="button"><span aria-hidden="true">👨‍👩‍👧</span> Para otros</button>
      </div>
      ${
        tab === "mi"
          ? `<div class="rec-empty">
              <p class="rec-empty-title">Nada por aquí todavía</p>
              <p class="rec-empty-note">Los pagos de servicios del prototipo están en Para otros.</p>
            </div>`
          : `
        <div class="rec-activity-head">
          <p class="rec-overline is-flat">Pago de servicios</p>
          <span class="rec-count is-muted">${accs.length}</span>
        </div>
        <div class="rec-group-list">
          ${accs
            .map((a) => {
              const last = lastPaymentOf(state, a.corr);
              return `
              <button class="rec-mc" data-action="open-voucher" data-corr="${a.corr}" type="button">
                <span class="rec-row-logo"><img src="eggsa.png" alt="" /></span>
                <span class="rec-mc-copy">
                  <span class="rec-row-title">${escapeHtml(accountTitle(a))}</span>
                  <span class="rec-row-sub">#${a.corr} · ${quetzal(last.q)} el ${shortDate(last.date)}</span>
                </span>
                <span class="rec-mc-bell${a.reminder ? " is-on" : ""}" aria-label="${a.reminder ? "Recordatorio activo" : "Recordatorio apagado"}">
                  <i class="fa-${a.reminder ? "solid" : "regular"} fa-bell${a.reminder ? "" : "-slash"}" aria-hidden="true"></i>
                </span>
              </button>`;
            })
            .join("")}
        </div>`
      }
    </div>
  `;
}

/* Pago de servicio abierto desde Mis compras (SRV-06 / SRV-08): compartir
   arriba a la derecha y un solo interruptor abajo. */
function screenVoucher(state) {
  const corr = state.voucherCorr;
  const pay = lastPaymentOf(state, corr);
  return `
    ${statusBar()}
    ${titledHeader("EEGSA", {
      right: `<button class="oky-flow-header-icon" data-action="send-photo" type="button" aria-label="Compartir">
        <i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i></button>`,
    })}
    <div class="rec-body has-cta-tall">
      ${voucher(state, pay, { repay: true })}
    </div>
    <div class="oky-flow-cta-bar rec-cta-bar">
      ${reminderRow(state, corr, { title: "Recordatorio de pago", origin: "voucher" })}
    </div>
  `;
}

/* Menú › Recordatorios (99105:14317): todos juntos, con buscador. Los
   apagados quedan abajo para volver a encenderlos. */
function screenRecordatorios(state) {
  const q = state.recSearch.trim().toLowerCase();
  const match = (a) => !q || accountTitle(a).toLowerCase().includes(q) || a.corr.includes(q) || "eegsa".includes(q);
  const on = activeReminders(state).filter(match);
  const off = Object.values(state.accounts).filter((a) => !a.reminder && match(a));
  return `
    ${statusBar()}
    ${titledHeader("Recordatorios")}
    <div class="rec-body">
      <div class="input-wrapper rec-input is-search">
        <i class="fa-solid fa-magnifying-glass rec-search-icon" aria-hidden="true"></i>
        <input id="rec-search" class="input-field" placeholder="Buscar recordatorios" autocomplete="off"
          value="${escapeHtml(state.recSearch)}" data-role="rec-search" aria-label="Buscar recordatorios" />
      </div>
      ${sectionLabel("Activos", on.length ? ` <span class="rec-count is-muted">${on.length}</span>` : "")}
      ${
        on.length
          ? `<div class="rec-stack">${on.map((a) => reminderCard(state, a, { wide: true })).join("")}</div>`
          : `<p class="rec-hint">${q ? "Ningún recordatorio activo coincide." : "No tienes recordatorios activos."}</p>`
      }
      ${
        off.length
          ? `${sectionLabel("Apagados")}
            <div class="rec-group-list">
              ${off
                .map(
                  (a) => `
                <div class="rec-mc is-static">
                  <span class="rec-row-logo"><img src="eggsa.png" alt="" /></span>
                  <span class="rec-mc-copy">
                    <span class="rec-row-title">${escapeHtml(accountTitle(a))}</span>
                    <span class="rec-row-sub">#${a.corr}</span>
                  </span>
                  <button class="btn btn-outlined btn-small" data-action="reminder-on" data-corr="${a.corr}" type="button">Activar</button>
                </div>`,
                )
                .join("")}
            </div>`
          : ""
      }
    </div>
  `;
}

/* Notificaciones › Recordatorios (7500): el aviso lleva directo a la
   consulta, no a un detalle. */
function screenNotifs(state) {
  const due = dueAccounts(state);
  const items = [
    ...due.map(
      (a) => `
      <article class="rec-notif is-unread">
        <span class="rec-notif-dot" aria-hidden="true"></span>
        <div class="rec-notif-copy">
          <p class="rec-notif-title">💡 Es hora de pagar EEGSA</p>
          <p class="rec-notif-body">${escapeHtml(accountTitle(a))}: ya llegó tu factura. ${statusOf(state, a.corr).label}.</p>
          <button class="rec-link" data-action="consult" data-corr="${a.corr}" type="button">Pagar ahora</button>
        </div>
        <span class="rec-notif-time">Hoy</span>
      </article>`,
    ),
    `<article class="rec-notif">
      <span class="rec-notif-dot is-read" aria-hidden="true"></span>
      <div class="rec-notif-copy">
        <p class="rec-notif-title">¡Te avisamos!</p>
        <p class="rec-notif-body">Creamos avisos de pago para apoyar a tus seres queridos. Los manejas desde Recordatorios.</p>
        <button class="rec-link" data-action="go" data-screen="recordatorios" type="button">Ver recordatorios</button>
      </div>
      <span class="rec-notif-time">Hace 30 días</span>
    </article>`,
  ];
  return `
    ${statusBar()}
    ${titledHeader("Notificaciones")}
    <div class="rec-tabs" role="tablist">
      <span class="rec-tab" role="tab" aria-selected="false">Todas</span>
      <span class="rec-tab" role="tab" aria-selected="false">Promociones</span>
      <span class="rec-tab is-on" role="tab" aria-selected="true">Recordatorios</span>
    </div>
    <div class="rec-body">${items.join("")}</div>
  `;
}

/* ── Capas ──────────────────────────────────────────────── */

function navbar(active, state) {
  const due = dueAccounts(state).length;
  const item = (key, label, icon, action) => `
    <div class="nav-item ${key === active ? "active" : ""}" data-action="${action}" role="button" tabindex="0">
      ${
        key === "okycash"
          ? `<img class="rec-nav-coin" src="oky-cash-coin.png" alt="" />`
          : `<span class="rec-nav-icon"><i class="fa-${key === active ? "solid" : "regular"} fa-${icon}" style="font-size:20px" aria-hidden="true"></i>${
              key === "notif" && due ? `<span class="rec-nav-dot" aria-label="${due} avisos"></span>` : ""
            }</span>`
      }
      <span class="nav-label">${label}</span>
    </div>
  `;
  return `
    <nav class="oky-flow-navbar">
      <div class="bottom-nav">
        ${item("home", "Home", "house", "go:servicios")}
        ${item("notif", "Notificaciones", "bell", "go:notifs")}
        ${item("okycash", "OKY Cash", null, "toast:OKY Cash está fuera de este prototipo")}
        ${item("ayuda", "Ayuda", "comments", "toast:Ayuda está fuera de este prototipo")}
        ${item("menu", "Menú", "bars", "open-menu")}
      </div>
    </nav>
  `;
}

function menuSheet(state) {
  const due = dueAccounts(state).length;
  const rows = [
    { label: "Mis compras", icon: "bag-shopping", style: "solid", action: "menu:miscompras" },
    { label: "Recordatorios", icon: "bell", action: "menu:recordatorios", badge: due },
    { label: "Notificaciones", icon: "envelope", action: "menu:notifs" },
    { label: "Historial", icon: "clock-rotate-left" },
    { label: "Métodos de Pago", icon: "credit-card" },
    { label: "Perfil", icon: "user" },
    { label: "Ayuda", icon: "circle-question" },
  ];
  return `
    <div class="oky-flow-menu" role="dialog" aria-modal="true" aria-label="Menú">
      <header class="oky-flow-menu-head">
        <button class="oky-flow-menu-close" data-action="close-menu" type="button" aria-label="Cerrar el menú">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <span class="oky-flow-menu-bell" aria-hidden="true"><i class="fa-regular fa-bell"></i></span>
      </header>
      <div class="oky-flow-menu-list">
        ${rows
          .map(
            (it) => `
          <div class="oky-flow-menu-row${it.action ? " is-live" : ""}"
            ${it.action ? `data-action="${it.action}" role="button" tabindex="0"` : ""}>
            <i class="fa-${it.style || "regular"} fa-${it.icon} oky-flow-menu-icon" aria-hidden="true"></i>
            <span class="oky-flow-menu-label">${it.label}</span>
            ${it.badge ? `<span class="rec-menu-badge">${it.badge}</span>` : ""}
            <i class="fa-solid fa-chevron-right oky-flow-menu-go" aria-hidden="true"></i>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  `;
}

/* Hoja de filtros: período (desde 45 días) y número correlativo. El
   botón dice cuántos pagos va a enseñar antes de aplicar. */
function filterSheet(state) {
  const d = state.draft;
  const count = filteredPayments(state, d).length;
  const radio = (group, key, label, on, sub = "") => `
    <button class="oky-flow-filter-option${on ? " is-on" : ""}" data-action="draft" data-group="${group}"
      data-key="${key}" type="button" role="radio" aria-checked="${on}">
      <span class="oky-flow-radio" aria-hidden="true"></span>
      <span class="oky-flow-filter-option-label">${label}${sub ? `<span class="rec-opt-sub">${sub}</span>` : ""}</span>
    </button>
  `;
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet is-filter rec-filter" role="dialog" aria-modal="true" aria-label="Filtrar pagos">
      <div class="oky-flow-sheet-grab" aria-hidden="true"></div>
      <header class="oky-flow-filter-head">
        <h2 class="oky-flow-filter-title">Filtrar</h2>
        <button class="oky-flow-sheet-close is-dark" data-action="close-sheet" type="button" aria-label="Cerrar">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>
      <div class="rec-filter-scroll">
        <p class="rec-filter-k">Período</p>
        <div class="rec-chips" role="radiogroup" aria-label="Período">
          ${[{ key: "", label: "Todo" }, ...PERIODS]
            .map(
              (p) => `<button class="rec-chip${d.period === p.key ? " is-on" : ""}" data-action="draft" data-group="period"
                data-key="${p.key}" type="button" role="radio" aria-checked="${d.period === p.key}">${p.label}</button>`,
            )
            .join("")}
        </div>
        <p class="rec-filter-k">Número correlativo</p>
        <div class="oky-flow-filter-list" role="radiogroup" aria-label="Número correlativo">
          ${radio("corr", "", "Todos los números", !d.corr)}
          ${Object.values(state.accounts)
            .filter((a) => lastPaymentOf(state, a.corr))
            .map((a) => radio("corr", a.corr, escapeHtml(accountTitle(a)), d.corr === a.corr, `#${a.corr}`))
            .join("")}
        </div>
      </div>
      <div class="rec-filter-foot">
        <button class="btn btn-outlined btn-large" data-action="draft-reset" type="button">Limpiar</button>
        <button class="btn btn-primary btn-large${count ? "" : " btn-disabled"}" data-action="apply-filter" type="button">
          ${count ? `Ver ${count} ${count === 1 ? "pago" : "pagos"}` : "Sin pagos"}
        </button>
      </div>
    </section>
  `;
}

/* ⋮ de un recordatorio (7500): ver sus pagos o darse de baja. */
function reminderMenuSheet(state, corr) {
  const acc = state.accounts[corr];
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet is-filter rec-actions" role="dialog" aria-modal="true" aria-label="Opciones del recordatorio">
      <div class="oky-flow-sheet-grab" aria-hidden="true"></div>
      <p class="rec-actions-title">${escapeHtml(accountTitle(acc))}</p>
      <button class="rec-action-row" data-action="see-payments" data-corr="${corr}" type="button">
        <i class="fa-regular fa-file-lines" aria-hidden="true"></i><span>Ver pagos de este número</span>
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
      <button class="rec-action-row" data-action="ask-off" data-corr="${corr}" data-origin="menu" type="button">
        <i class="fa-regular fa-bell-slash" aria-hidden="true"></i><span>Darse de baja del recordatorio</span>
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    </section>
  `;
}

/* SRV-02 / SRV-07: la campana y la decisión, con «Mantener activo» como
   salida principal. */
function confirmOffSheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="keep-on" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet rec-confirm" role="dialog" aria-modal="true" aria-labelledby="rec-off-title">
      <button class="oky-flow-sheet-close" data-action="keep-on" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="oky-flow-sheet-title" id="rec-off-title">¿Quieres apagar este recordatorio?</h2>
      <p class="oky-flow-sheet-note">Si lo apagas, OKY no te avisará antes del próximo pago de este número. Puedes volver a encenderlo cuando quieras desde Recordatorios.</p>
      <div class="oky-flow-sheet-art"><img class="rec-sheet-art" src="oky-campana-3d.png" alt="" /></div>
      <div class="oky-flow-sheet-actions">
        <button class="oky-flow-sheet-confirm" data-action="keep-on" type="button">Mantener activo</button>
        <button class="oky-flow-sheet-dismiss" data-action="confirm-off" type="button">Darme de baja</button>
      </div>
    </section>
  `;
}

/* Edge case: se consultó y todavía no hay factura. Nada que accionar. */
function alDiaSheet(state, corr) {
  const acc = state.accounts[corr];
  const st = statusOf(state, corr);
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet rec-confirm is-ok" role="dialog" aria-modal="true" aria-labelledby="rec-ok-title">
      <button class="oky-flow-sheet-close" data-action="close-sheet" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="oky-flow-sheet-title" id="rec-ok-title">¡Estás al día!</h2>
      <p class="oky-flow-sheet-note">
        Consultamos #${corr} con EEGSA y no hay saldo pendiente. Pagaste ${quetzal(st.last.q)} el ${shortDate(st.last.date)}.
      </p>
      <div class="oky-flow-sheet-art"><img class="rec-sheet-art" src="oky-check-3d.png" alt="" /></div>
      <p class="rec-ok-next">
        <i class="fa-regular fa-bell" aria-hidden="true"></i>
        ${acc.reminder ? `Te avisaremos el ${shortDate(st.notifyOn)}, cuando llegue la próxima factura.` : "El recordatorio de este número está apagado."}
      </p>
      <div class="oky-flow-sheet-actions">
        ${
          acc.reminder
            ? `<button class="oky-flow-sheet-confirm" data-action="close-sheet" type="button">Entendido</button>
               <button class="oky-flow-sheet-dismiss" data-action="see-payments" data-corr="${corr}" type="button">Ver pagos de este número</button>`
            : `<button class="oky-flow-sheet-confirm" data-action="reminder-on" data-corr="${corr}" type="button">Recordármelo</button>
               <button class="oky-flow-sheet-dismiss" data-action="close-sheet" type="button">Ahora no</button>`
        }
      </div>
    </section>
  `;
}

function sheetHtml(state) {
  if (!state.sheet) return "";
  switch (state.sheet.type) {
    case "filter":
      return filterSheet(state);
    case "reminder-menu":
      return reminderMenuSheet(state, state.sheet.corr);
    case "confirm-off":
      return confirmOffSheet(state);
    case "aldia":
      return alDiaSheet(state, state.sheet.corr);
    default:
      return "";
  }
}

function loadingLayer(state) {
  if (!state.loading) return "";
  return `
    <div class="rec-loading" role="status" aria-live="polite">
      <div class="rec-loading-card">
        <span class="rec-spinner" aria-hidden="true"></span>
        <p class="rec-loading-title">${state.loading.title}</p>
        <p class="rec-loading-note">${state.loading.note}</p>
      </div>
    </div>
  `;
}

function toastLayer(state) {
  if (!state.toast) return "";
  const t = state.toast;
  return `
    <div class="rec-toast" role="status">
      <article class="toast-banner toast-banner-${t.tone}${t.action ? " has-action" : ""}">
        <span class="fa-icon toast-banner-icon icon-main-${t.tone}" aria-hidden="true"><i class="fa-solid ${t.icon}"></i></span>
        <p class="toast-banner-message">${t.text}</p>
        ${
          t.action
            ? `<button class="toast-banner-action" data-action="${t.action.action}" data-corr="${t.action.corr || ""}" type="button">${t.action.label}</button>`
            : ""
        }
      </article>
    </div>
  `;
}

const NAV_ACTIVE = { servicios: "home", eegsa: "home", consulta: "home", checkout: "home", exito: "home", notifs: "notif", miscompras: "menu", voucher: "menu", recordatorios: "menu" };

/* ── Montaje ─────────────────────────────────────────────── */

export function mountRecordatoriosPrototype(root) {
  let state = createInitialState();
  const timers = new Set();
  let toastTimer = 0;

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

  function screenHtml() {
    switch (state.screen) {
      case "eegsa":
        return screenEegsa(state);
      case "consulta":
        return screenConsulta(state);
      case "checkout":
        return screenCheckout(state);
      case "exito":
        return screenExito(state);
      case "miscompras":
        return screenMisCompras(state);
      case "voucher":
        return screenVoucher(state);
      case "recordatorios":
        return screenRecordatorios(state);
      case "notifs":
        return screenNotifs(state);
      default:
        return screenServicios(state);
    }
  }

  /* Panel de demo, fuera del teléfono: la fecha de hoy (para probar el
     día de pago) y atajos a cada parte del flujo. */
  function demoPanel() {
    const jumped = state.today.getTime() !== TODAY.getTime();
    return `
      <div class="rec-demo">
        <div class="rec-demo-row">
          <span class="rec-demo-k"><i class="fa-regular fa-calendar" aria-hidden="true"></i> Hoy: ${dateLabel(state.today)}</span>
          <button class="oky-flow-reset" data-action="jump-date" type="button">
            ${jumped ? "Volver al 16 / NOV" : "Adelantar al 01 / DIC (día de pago)"}
          </button>
        </div>
        <div class="rec-demo-row">
          ${[
            ["servicios", "Servicios"],
            ["eegsa", "EEGSA"],
            ["miscompras", "Mis compras"],
            ["recordatorios", "Recordatorios"],
            ["notifs", "Notificaciones"],
          ]
            .map(([k, l]) => `<button class="rec-demo-link${state.screen === k ? " is-on" : ""}" data-action="go" data-screen="${k}" type="button">${l}</button>`)
            .join("")}
        </div>
        <button class="oky-flow-reset" data-action="reset" type="button">
          <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>Reiniciar prototipo
        </button>
      </div>
    `;
  }

  function render() {
    const active = document.activeElement;
    const focusId = active && root.contains(active) ? active.id : "";
    const caret = focusId && active.selectionStart != null ? active.selectionStart : null;
    const scroller = root.querySelector(".oky-flow-scroll");
    const keptScroll = scroller ? scroller.scrollTop : 0;
    const track = root.querySelector("[data-role='rec-track']");
    const keptTrack = track ? track.scrollLeft : 0;

    root.innerHTML = `
      <div class="oky-flow-frame rec-flow">
        <div class="oky-flow-scroll">${screenHtml()}</div>
        ${navbar(NAV_ACTIVE[state.screen] || "home", state)}
        ${state.menuOpen ? menuSheet(state) : ""}
        ${sheetHtml(state)}
        ${loadingLayer(state)}
        ${toastLayer(state)}
      </div>
      ${demoPanel()}
    `;

    const newScroller = root.querySelector(".oky-flow-scroll");
    if (newScroller && state.keepScroll) newScroller.scrollTop = keptScroll;
    state.keepScroll = false;

    const newTrack = root.querySelector("[data-role='rec-track']");
    if (newTrack) {
      newTrack.scrollLeft = keptTrack;
      newTrack.addEventListener(
        "scroll",
        () => {
          const slides = newTrack.children;
          if (slides.length < 2) return;
          const step = slides[1].offsetLeft - slides[0].offsetLeft;
          const i = Math.round(newTrack.scrollLeft / step);
          if (i !== state.trackIndex) {
            state.trackIndex = i;
            root.querySelectorAll(".rec-dot").forEach((dot, n) => dot.classList.toggle("is-on", n === i));
          }
        },
        { passive: true },
      );
    }

    if (focusId) {
      const el = root.querySelector(`#${focusId}`);
      if (el) {
        el.focus();
        if (caret != null && el.setSelectionRange) el.setSelectionRange(caret, caret);
      }
    }
    fitToViewport();
  }

  function set(patch) {
    state = { ...state, ...patch };
    render();
  }

  function go(screen, extra = {}) {
    const history = state.screen === screen ? state.history : [...state.history, state.screen];
    clearTimeout(toastTimer);
    set({ screen, history, sheet: null, menuOpen: false, toast: null, ...extra });
    const scroller = root.querySelector(".oky-flow-scroll");
    if (scroller) scroller.scrollTop = 0;
  }

  function back() {
    const history = [...state.history];
    let prev = history.pop() || "servicios";
    /* Del pago ya no se vuelve al checkout. */
    if (prev === "checkout" || prev === "consulta") prev = "eegsa";
    set({ screen: prev, history, sheet: null });
  }

  function toast(text, { tone = "success", icon = "fa-circle-check", action = null, ms = 3200 } = {}) {
    clearTimeout(toastTimer);
    set({ toast: { text, tone, icon, action }, keepScroll: true });
    toastTimer = later(() => set({ toast: null, keepScroll: true }), ms);
  }

  /* La consulta automática: un momento con EEGSA y el resultado. Con
     factura se va a la consulta; sin ella, el modal «Estás al día». */
  function consult(corr, { isNew = false } = {}) {
    set({ loading: { title: "Consultando tu saldo…", note: `EEGSA · #${corr}` }, sheet: null, menuOpen: false, keepScroll: true });
    later(
      () => {
        state.loading = null;
        if (isNew) {
          go("consulta", { current: { corr, q: NEW_BILL, isNew: true }, newName: "" });
          return;
        }
        const st = statusOf(state, corr);
        if (st.kind === "due") {
          go("consulta", { current: { corr, q: state.accounts[corr].nextBill, isNew: false } });
        } else {
          set({ sheet: { type: "aldia", corr }, keepScroll: true });
        }
      },
      reducedMotion() ? 300 : 1300,
    );
  }

  function pay() {
    set({ loading: { title: "Procesando tu pago…", note: "No cierres la app" }, keepScroll: true });
    later(() => {
      const cur = state.current;
      const accounts = { ...state.accounts };
      if (cur.isNew) {
        const name = state.newName.trim();
        accounts[cur.corr] = {
          corr: cur.corr,
          alias: name ? `Electricidad de ${name}` : `Electricidad de #${cur.corr}`,
          contact: { name, phone: "", initials: name ? name.slice(0, 2).toUpperCase() : "" },
          /* Opt-in al adquirir: nace encendido. */
          reminder: true,
          nextBill: 205.9,
        };
      } else {
        accounts[cur.corr] = { ...accounts[cur.corr], reminder: true, nextBill: Math.round((cur.q * (0.95 + Math.random() * 0.1)) * 100) / 100 };
      }
      const payment = {
        id: `${cur.corr}-${Date.now()}`,
        corr: cur.corr,
        date: new Date(state.today),
        q: cur.q,
        tx: String(Math.floor(100000000000 + Math.random() * 899999999999)),
      };
      state.loading = null;
      go("exito", {
        accounts,
        payments: [...state.payments, payment],
        lastPayment: payment,
        corrInput: "",
        history: ["servicios", "eegsa"],
      });
    }, reducedMotion() ? 400 : 1600);
  }

  function setReminder(corr, on) {
    const accounts = { ...state.accounts, [corr]: { ...state.accounts[corr], reminder: on } };
    state.accounts = accounts;
  }

  root.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || !root.contains(el)) return;
    const action = el.dataset.action;
    const corr = el.dataset.corr;
    if (el.classList.contains("btn-disabled")) {
      if (action === "consult-typed") toast("Escribe los 10 dígitos del número correlativo.", { tone: "warning", icon: "fa-triangle-exclamation" });
      return;
    }

    if (action.startsWith("go:")) return go(action.slice(3));
    if (action.startsWith("toast:")) return toast(action.slice(6), { tone: "info", icon: "fa-circle-info" });
    if (action.startsWith("menu:")) return go(action.slice(5));
    if (action.startsWith("toggle-reminder:")) {
      const acc = state.accounts[corr];
      if (acc.reminder) return set({ sheet: { type: "confirm-off", corr, origin: action.slice(16) }, keepScroll: true });
      setReminder(corr, true);
      return toast(`Listo. Te avisaremos el ${shortDate(statusOf(state, corr).notifyOn)}.`, { icon: "fa-bell" });
    }

    switch (action) {
      case "reset":
        timers.forEach(clearTimeout);
        timers.clear();
        state = createInitialState();
        render();
        return;
      case "jump-date": {
        const jumped = state.today.getTime() !== TODAY.getTime();
        set({ today: jumped ? TODAY : JUMP_TO, keepScroll: true });
        return toast(jumped ? "De vuelta al 16 / NOV." : "Hoy es 01 / DIC: llegó la factura de Mamá.", { tone: "info", icon: "fa-calendar" });
      }
      case "go":
        return go(el.dataset.screen);
      case "back":
        return back();
      case "noop-back":
        return toast("Aquí volverías al Home de GT.", { tone: "info", icon: "fa-circle-info" });
      case "open-menu":
        return set({ menuOpen: true, keepScroll: true });
      case "close-menu":
        return set({ menuOpen: false, keepScroll: true });
      case "close-sheet":
        return set({ sheet: null, draft: null, keepScroll: true });
      case "consult":
        return consult(corr);
      case "consult-typed": {
        const typed = state.corrInput.trim();
        if (/^0+$/.test(typed) || typed.startsWith("9")) {
          return set({ corrError: "No encontramos este número en EEGSA. Revísalo en tu factura.", keepScroll: true });
        }
        if (state.accounts[typed]) return consult(typed);
        return consult(typed, { isNew: true });
      }
      case "pick-corr":
        set({ corrInput: corr, corrError: "", keepScroll: true });
        return;
      case "clear-corr":
        set({ corrInput: "", corrError: "", keepScroll: true });
        root.querySelector("#rec-corr")?.focus();
        return;
      case "type-new":
        set({ corrInput: "0011907315", corrError: "", keepScroll: true });
        return;
      case "open-filter":
        return set({ sheet: { type: "filter" }, draft: { ...state.filter }, keepScroll: true });
      case "draft":
        return set({ draft: { ...state.draft, [el.dataset.group]: el.dataset.key }, keepScroll: true });
      case "draft-reset":
        return set({ draft: { period: "", corr: "" }, keepScroll: true });
      case "apply-filter":
        return set({ filter: { ...state.draft }, draft: null, sheet: null, corrInput: "" });
      case "clear-filter":
        set({ filter: { period: "", corr: "" }, corrInput: "", keepScroll: true });
        return toast("Filtro quitado.", { tone: "info", icon: "fa-circle-info", ms: 1800 });
      case "reminder-menu":
        return set({ sheet: { type: "reminder-menu", corr }, keepScroll: true });
      case "see-payments":
        return go("eegsa", { filter: { period: "", corr }, corrInput: "" });
      case "ask-off":
        return set({ sheet: { type: "confirm-off", corr, origin: el.dataset.origin }, keepScroll: true });
      case "keep-on":
        set({ sheet: null, keepScroll: true });
        return toast("Tu recordatorio sigue activo.", { icon: "fa-bell" });
      case "confirm-off": {
        const c = state.sheet.corr;
        setReminder(c, false);
        set({ sheet: null, keepScroll: true });
        return toast("Recordatorio apagado.", {
          tone: "info",
          icon: "fa-bell-slash",
          action: { label: "Deshacer", action: "reminder-on", corr: c },
          ms: 4500,
        });
      }
      case "reminder-on":
        setReminder(corr, true);
        set({ sheet: null, keepScroll: true });
        return toast(`Recordatorio activo. Te avisaremos el ${shortDate(statusOf(state, corr).notifyOn)}.`, { icon: "fa-bell" });
      case "go-checkout":
        return go("checkout");
      case "pay":
        return pay();
      case "open-voucher":
        return go("voucher", { voucherCorr: corr });
      case "my-tab":
        return set({ myTab: el.dataset.tab, keepScroll: true });
      case "send-photo":
        return toast("Abriendo compartir con la foto del pago…", { tone: "info", icon: "fa-camera" });
      case "copy":
        return toast(el.dataset.text, { icon: "fa-copy", ms: 1800 });
      case "toast-info":
        return toast(el.dataset.text, { tone: "info", icon: "fa-circle-info" });
      default:
        return undefined;
    }
  });

  root.addEventListener("input", (event) => {
    const role = event.target.dataset.role;
    if (role === "corr-input") {
      const clean = event.target.value.replace(/\D/g, "").slice(0, 10);
      /* Escribir un número manda sobre el filtro por número. */
      set({ corrInput: clean, corrError: "", filter: { ...state.filter, corr: "" }, keepScroll: true });
    } else if (role === "name-input") {
      set({ newName: event.target.value.slice(0, 24), keepScroll: true });
    } else if (role === "rec-search") {
      set({ recSearch: event.target.value, keepScroll: true });
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.dataset.role === "corr-input") {
      root.querySelector("[data-action='consult-typed']")?.click();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[role='button'][data-action]")) {
      event.preventDefault();
      event.target.click();
    }
    if (event.key === "Escape" && (state.sheet || state.menuOpen)) {
      set({ sheet: null, menuOpen: false, draft: null, keepScroll: true });
    }
  });

  /* Entrada directa: /recordatorios#eegsa, #miscompras, #recordatorios… */
  const hash = (window.location.hash || "").replace("#", "");
  if (["eegsa", "miscompras", "recordatorios", "notifs"].includes(hash)) state.screen = hash;

  render();
}
