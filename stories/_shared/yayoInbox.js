/* ─────────────────────────────────────────────────────────
   Buzón de recargas Yayo, entre los dos prototipos.

   Comprar el OKY Vale Recargable de Yayo en /miscompras (GUA) deja la
   recarga aquí, y /yayo la recibe: al instante si está abierto en otra
   pestaña, o la próxima vez que se abra. No hay backend: los dos
   prototipos comparten el almacenamiento del navegador porque viven en
   el mismo origen (okyapp.vercel.app, o localhost en local). Por eso
   solo funciona en el mismo navegador.
───────────────────────────────────────────────────────── */

const KEY = "oky-yayo-inbox";
const CHANNEL = "oky-yayo";

function read() {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

function write(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch (error) {
    /* Sin almacenamiento (ventana privada, previews) la recarga se pierde
       y el prototipo de compra sigue igual. */
  }
}

/* /miscompras: deja la recarga en el buzón y avisa a las pestañas abiertas. */
export function sendYayoTopup({ amount, phone }) {
  const entry = { id: `t-${Date.now()}-${Math.round(Math.random() * 1e4)}`, amount, phone, at: Date.now() };
  write([...read(), entry]);
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage("topup");
    channel.close();
  } catch (error) {
    /* El evento storage de las otras pestañas también avisa. */
  }
}

/* /yayo: saca lo que haya en el buzón (y lo vacía). */
export function takeYayoTopups() {
  const list = read();
  if (list.length) write([]);
  return list;
}

/* /yayo: llama a onArrive cada vez que llega algo nuevo. */
export function listenYayoTopups(onArrive) {
  window.addEventListener("storage", (event) => {
    if (event.key === KEY && event.newValue && event.newValue !== "[]") onArrive();
  });
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = () => onArrive();
  } catch (error) {
    /* Sin BroadcastChannel queda el evento storage. */
  }
}
