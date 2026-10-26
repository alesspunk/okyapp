/* ─────────────────────────────────────────────────────────
   Pages / Yayo × OKY / Prototype — Beneficiario

   Flujo clickable del beneficiario de Yayo (archivo Yayo x OKY,
   IO8QZtZquMn8QpXRSDy2Tt, página Beneficiario). La lógica y los IDs
   de cada frame están en stories/_shared/yayoPrototype.js.
───────────────────────────────────────────────────────── */

import { mountYayoPrototype } from "./_shared/yayoPrototype";

export default {
  title: "Pages/Yayo × OKY/Prototype",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "Prototipo **clickable** del beneficiario de Yayo, independiente del de OKY Cash. Todo el estado " +
            "(saldo, solicitud, actividad) vive en memoria; HTML por template strings y un solo listener.",
          "**Recorrido** · Login con el aviso de la solicitud → tocar el teléfono lo rellena → Recibir Código → " +
            "método de entrega → el código llega como notificación y tocarla lo rellena → Siguiente → Home con la " +
            "**Solicitud de pago** abierta. Se puede minimizar (queda arriba del saldo), aprobar o rechazar.",
          "· La cuenta atrás es real: 15 minutos (o `?vence=segundos`). Al vencer, la solicitud pasa a la actividad como *Vencida*.",
          "· Aprobar abre la animación de marca (degradado Yayo, llave y confeti) y el saldo baja en vivo.",
          "· Rechazar pide confirmación en la hoja morada *¿Estás seguro?*.",
          "· La actividad arranca vacía; el menú abre Actividad, Mi perfil, Compartir, Ayuda (con chat), Términos y Salir.",
          "**Componentes reutilizados** — header Yayo, Modal Centered y Small, Toast Payment Request (en verde), " +
            "Amount Summary, Action Circle, Super Ribbon `vence`, History Card (Yayo Aprobado / Rechazado), " +
            "Payment Card **Yayo Brand**, el menú y las hojas del prototipo de OKY Cash, Flag y el buscador.",
        ].join("\n\n"),
      },
    },
  },
};

export const Beneficiario = {
  name: "Beneficiario — Solicitud de pago",
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.className = "mars-story";
    const stage = document.createElement("div");
    stage.style.cssText = "display:flex;justify-content:center;padding:12px 0";
    wrapper.append(stage);
    mountYayoPrototype(stage);
    return wrapper;
  },
};
