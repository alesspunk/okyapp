const ICONOS = {
  buscar: '<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path>',
  cerrar: '<path d="M18 6L6 18"></path><path d="M6 6l12 12"></path>',
  chevronDerecha: '<path d="M9 18l6-6-6-6"></path>',
  chevronIzquierda: '<path d="M15 18l-6-6 6-6"></path>',
  flechaDerecha: '<path d="M4 12h16"></path><path d="M14 6l6 6-6 6"></path>',
  mas: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  menos: '<path d="M5 12h14"></path>',
  borrar: '<path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><path d="M8 7l1 12h6l1-12"></path>',
  carrito: '<circle cx="9" cy="19" r="1.5"></circle><circle cx="17" cy="19" r="1.5"></circle><path d="M3 4h2l2.5 11h9.5l2-8H7"></path>',
  billetera: '<rect x="3" y="6" width="18" height="12" rx="2"></rect><path d="M15 12h6"></path>',
  usuario: '<circle cx="12" cy="8" r="3"></circle><path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"></path>',
  casa: '<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path>',
  grid: '<rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect>',
  fuego: '<path d="M12 3c2 3-1 4 1 7 1 1 3 2 3 5a4 4 0 1 1-8 0c0-3 2-4 3-6 1-2 0-3 1-6z"></path>',
  recibo: '<path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1V3z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path>',
  ticket: '<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 0 0-6V6H3z"></path>',
};

function icono(nombre, etiqueta = "") {
  const roleAttrs = etiqueta ? `role="img" aria-label="${etiqueta}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 24 24" class="ux-inline-icon" ${roleAttrs}>${ICONOS[nombre] || ICONOS.mas}</svg>`;
}

const COMPONENTES = [
  {
    id: "botones",
    name: "Botones",
    source: "stories/Atoms.Buttons.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Atoms/Buttons · Primario, Secundario, Outlined</div>
        <div class="mars-grid-tight">
          <button class="btn btn-primary btn-medium" style="min-width:129px">Continuar ${icono("flechaDerecha")}</button>
          <button class="btn btn-secondary btn-medium" style="min-width:129px">Guardar</button>
          <button class="btn btn-outlined btn-medium" style="min-width:129px">Cancelar</button>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es el propósito principal del componente Button?",
        options: [
          "Disparar una acción del usuario como continuar, guardar o enviar.",
          "Mostrar información estática sin interacción.",
          "Reemplazar etiquetas de formulario para reducir ruido visual.",
          "Decorar tarjetas con acentos visuales.",
        ],
        answer: 0,
        explanation:
          "En OKY DS, los botones son disparadores de acciones. La jerarquía visual debe dejar clara la siguiente decisión.",
      },
      {
        text: "En checkout hay un CTA principal y una acción de cancelar de baja prioridad. ¿Qué variante corresponde a cancelar?",
        options: [
          "Primary",
          "Outlined",
          "Primary deshabilitado",
          "Sin botón, solo texto plano",
        ],
        answer: 1,
        explanation:
          "Usa outlined para acciones secundarias y reserva primary para el objetivo principal de la pantalla.",
      },
      {
        text: "¿Qué regla de accesibilidad debe cumplirse siempre en botones?",
        options: [
          "Foco visible y texto de acción claro.",
          "Todos los botones deben ser solo ícono.",
          "El estado habilitado/deshabilitado puede depender solo del color.",
          "Los botones secundarios pueden omitirse del teclado.",
        ],
        answer: 0,
        explanation:
          "El usuario debe poder navegar por teclado y entender la acción sin ambigüedad.",
      },
    ],
  },
  {
    id: "inputs",
    name: "Inputs",
    source: "stories/Atoms.Inputs.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Atoms/Inputs · Búsqueda + Teléfono</div>
        <div style="display:grid;gap:10px;max-width:328px">
          <div class="input-wrapper">
            <span class="search-icon">${icono("buscar")}</span>
            <input class="input-field search-input" placeholder="Buscar marcas" value="Pollo Campero" />
            <span class="clear-icon">${icono("cerrar")}</span>
          </div>
          <div style="display:flex;gap:8px;align-items:flex-start;max-width:328px">
            <div class="input-wrapper" style="min-width:88px;width:88px;flex-shrink:0">
              <input class="input-field" value="+502" style="padding-right:8px" />
              <div class="input-label">Área</div>
            </div>
            <div class="input-wrapper" style="min-width:0;flex:1">
              <span class="input-flag-left"><img src="/images/guatemala-flag.png" alt="Guatemala" /></span>
              <input class="input-field input-has-flag input-has-clear" value="6696-3223" />
              <div class="input-label" style="left:46px">Número de teléfono</div>
              <span class="clear-icon" style="display:flex">${icono("cerrar")}</span>
            </div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es el objetivo principal de los Inputs en OKY DS?",
        options: [
          "Capturar datos del usuario con estructura y señales claras.",
          "Reemplazar botones de llamada a la acción.",
          "Mostrar totales de forma de solo lectura.",
          "Animar elementos de marca.",
        ],
        answer: 0,
        explanation:
          "Los inputs están diseñados para captura de datos. Placeholder, etiqueta e íconos deben reducir errores.",
      },
      {
        text: "Un flujo pide código de país y número telefónico. ¿Qué variante debes usar?",
        options: ["Input/Search", "Input/Phone", "Dropdown/Country", "Radio/Simple"],
        answer: 1,
        explanation:
          "Input/Phone ya cubre formato dividido y contexto visual por país según el patrón del DS.",
      },
      {
        text: "¿Qué regla UX/accesibilidad aplica en estos inputs?",
        options: [
          "Mantener la etiqueta visible cuando hay valor y mostrar errores con texto de apoyo.",
          "Ocultar etiquetas cuando el usuario escribe.",
          "Usar solo color para comunicar errores.",
          "Bloquear entrada por teclado en móvil.",
        ],
        answer: 0,
        explanation:
          "La etiqueta persistente mantiene contexto del campo y los errores deben explicarse con texto.",
      },
    ],
  },
  {
    id: "chips",
    name: "Chips",
    source: "stories/Atoms.Chips.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Atoms/Chips · Carrito + Cantidad</div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span class="chip-ds chip-ds-cart"><span>2</span>${icono("carrito")}</span>
          <span class="chip-ds chip-ds-add0 chip-ds-shadow">${icono("mas")}</span>
          <span class="chip-ds chip-ds-add2 chip-ds-shadow">${icono("menos")}<span class="chip-ds-number">2</span>${icono("mas")}</span>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Para qué se usan principalmente los Chips en este DS?",
        options: [
          "Acciones compactas como control de cantidad y conteo de carrito.",
          "Bloques de texto largo.",
          "Navegación principal de páginas.",
          "Mensajes de validación de formularios.",
        ],
        answer: 0,
        explanation:
          "Los chips permiten acciones rápidas y locales cerca del producto sin romper el flujo de compra.",
      },
      {
        text: "Un producto aún no se agregó al carrito. ¿Qué estado de chip corresponde?",
        options: ["Add0", "Quantity", "Add2", "Chip de carrito"],
        answer: 0,
        explanation:
          "Add0 es el punto de entrada para agregar por primera vez. Los demás estados aplican después.",
      },
      {
        text: "¿Qué regla de accesibilidad es clave para chips de cantidad?",
        options: [
          "Anunciar cambios de cantidad y mantener targets táctiles cómodos.",
          "Reducir los íconos al mínimo aunque cueste tocarlos.",
          "Ocultar la cantidad a lectores de pantalla.",
          "Requerir doble clic para más/menos.",
        ],
        answer: 0,
        explanation:
          "Los cambios de cantidad son cambios de estado críticos y deben ser perceptibles para todos.",
      },
    ],
  },
  {
    id: "discount-ribbon",
    name: "Cinta de descuento",
    source: "stories/Atoms.DiscountRibbon.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Atoms/Discount Ribbon · Wrap + List</div>
        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
          <div style="position:relative;width:140px;height:68px;border:1px dashed var(--divider);border-radius:8px;">
            <div class="discount-ribbon discount-ribbon-wrap">
              <span class="discount-ribbon-text token-price-percent">10% OFF</span>
            </div>
          </div>
          <div class="discount-ribbon discount-ribbon-list">
            <span class="discount-ribbon-text token-price-percent">20% OFF</span>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es la función principal del Discount Ribbon?",
        options: [
          "Comunicar ahorro junto al precio del producto.",
          "Reemplazar el nombre del producto.",
          "Funcionar como CTA principal de checkout.",
          "Mostrar solo estado de inventario.",
        ],
        answer: 0,
        explanation:
          "La cinta de descuento es una señal de valor económico, no un control de interacción primaria.",
      },
      {
        text: "¿Qué variante va sobre la esquina de una card de producto?",
        options: ["List", "Wrap", "Chip de carrito", "Outlined"],
        answer: 1,
        explanation:
          "Wrap es la variante overlay con muesca para cards. List se usa inline en listas.",
      },
      {
        text: "¿Qué regla UX/accesibilidad aplica a esta cinta?",
        options: [
          "El descuento debe entenderse más allá del color y con buen contraste.",
          "El color basta; el texto del descuento es opcional.",
          "Debe parpadear siempre para llamar atención.",
          "Debe colocarse lejos del precio para evitar ruido.",
        ],
        answer: 0,
        explanation:
          "El porcentaje o mensaje de descuento debe leerse claramente y no depender solo de percepción cromática.",
      },
    ],
  },
  {
    id: "radio",
    name: "Radio",
    source: "stories/Atoms.Radio.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Atoms/Radio · Simple + Flag</div>
        <div class="radio-group" style="max-width:420px">
          <div class="radio-row">
            <span class="radio-control active"></span>
            <span class="radio-label active">Guatemala</span>
          </div>
          <div class="radio-row">
            <span class="radio-control"></span>
            <span class="radio-flag-xl"><img src="/images/guatemala-flag.png" alt="Guatemala" /></span>
            <span class="radio-label">Estados Unidos</span>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuándo debes usar un Radio?",
        options: [
          "Cuando el usuario debe elegir solo una opción del grupo.",
          "Cuando el usuario debe seleccionar múltiples opciones.",
          "Cuando se necesita texto libre.",
          "Cuando se muestran placeholders de carga.",
        ],
        answer: 0,
        explanation:
          "Los radios son para selección exclusiva entre opciones mutuamente excluyentes.",
      },
      {
        text: "Si necesitas selector de país con bandera, ¿qué variante usas?",
        options: ["Radio/Simple", "Radio/Flag", "Input/Phone", "Bottom Nav"],
        answer: 1,
        explanation:
          "Radio/Flag agrega contexto visual de país conservando la lógica de selección única.",
      },
      {
        text: "¿Qué regla de accesibilidad aplica al grupo de radios?",
        options: [
          "Tener agrupación semántica y navegación por teclado.",
          "Ocultar el foco para limpiar la interfaz.",
          "Hacer clic solo en texto, no en el control.",
          "Mostrar estado seleccionado solo con color.",
        ],
        answer: 0,
        explanation:
          "La semántica de grupo y la operación por teclado son esenciales para tecnología asistiva.",
      },
    ],
  },
  {
    id: "quantity-input",
    name: "Quantity Input",
    source: "stories/Molecules.QuantityInput.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Molecules/Quantity Input · Add0, Add1, Add2, Giftcard</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <span class="chip-ds chip-ds-add0 chip-ds-shadow">${icono("mas")}</span>
          <span class="chip-ds chip-ds-add1 chip-ds-shadow" style="width:auto;padding:8px 12px">
            <span style="width:14px;display:inline-flex"></span>
            <span class="chip-ds-number">1</span>
            ${icono("mas")}
          </span>
          <span class="chip-ds chip-ds-add2 chip-ds-shadow" style="width:auto;padding:8px 12px">
            ${icono("menos")}
            <span class="chip-ds-number">2</span>
            ${icono("mas")}
          </span>
          <span class="chip-ds chip-ds-qty chip-ds-shadow" style="width:auto;padding:8px 12px">
            ${icono("borrar")}
            <span class="chip-ds-number">1</span>
          </span>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Para qué nos sirve Quantity Input en el sistema MARS?",
        options: [
          "Para ajustar cantidades rápido (sumar, restar o eliminar) sin salir del flujo.",
          "Para reemplazar el buscador de productos.",
          "Para navegar entre secciones de la app.",
          "Para mostrar banners promocionales.",
        ],
        answer: 0,
        explanation:
          "Es un patrón de microinteracción clave en MARS: permite controlar cantidades de forma clara y continua.",
      },
      {
        text: "Si el usuario todavía no ha agregado nada, ¿qué estado conviene mostrar?",
        options: ["Add0", "Add2", "Giftcard", "Summary Box"],
        answer: 0,
        explanation:
          "Add0 es el inicio natural: una sola acción para agregar y avanzar sin fricción.",
      },
      {
        text: "¿Qué detalle UX ayuda a que este componente se sienta más fácil de usar?",
        options: [
          "Mostrar cambios de cantidad al instante y mantener botones fáciles de tocar.",
          "Ocultar la cantidad para simplificar la UI.",
          "Reducir el tamaño del touch target al mínimo.",
          "Actualizar cantidad solo al recargar la página.",
        ],
        answer: 0,
        explanation:
          "Cuando el feedback es inmediato y los controles son cómodos, la experiencia se vuelve natural y confiable.",
      },
    ],
  },
  {
    id: "promo-code",
    name: "Código promocional",
    source: "stories/Molecules.PromoCode.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Molecules/Promo Code · entered</div>
        <div class="promo-code-molecule" data-state="entered">
          <span class="promo-code-leading" aria-hidden="true">
            <img src="/images/PROMOS@2x.webp" alt="" />
          </span>
          <p class="promo-code-copy"><span class="promo-code-prefix">Código Promo:</span> verano26</p>
          <button class="promo-code-action promo-clear" type="button" aria-label="Quitar código">${icono("cerrar")}</button>
          <button class="promo-code-action promo-open" type="button" aria-label="Ingresar código">${icono("chevronDerecha")}</button>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es la función principal del componente Promo Code?",
        options: [
          "Aplicar o remover códigos de descuento durante la compra.",
          "Mostrar información del perfil.",
          "Cambiar entre secciones de la app.",
          "Reemplazar filas de precios.",
        ],
        answer: 0,
        explanation:
          "Este componente gestiona el estado de cupones y afecta directamente los montos del resumen.",
      },
      {
        text: "Si el código ya se aplicó correctamente, ¿qué estado se muestra?",
        options: ["empty", "entered", "disabled", "loading-only"],
        answer: 1,
        explanation:
          "entered confirma que el descuento está activo y habilita la acción de quitar código.",
      },
      {
        text: "¿Qué regla UX/accesibilidad aplica aquí?",
        options: [
          "Notificar resultado de aplicar/quitar y etiquetar acciones claramente.",
          "Ocultar todo el estado cuando el código está aplicado.",
          "Usar solo íconos sin etiqueta en acciones.",
          "Excluir botón de quitar del foco de teclado.",
        ],
        answer: 0,
        explanation:
          "Los cambios de cupón impactan precio final; el feedback y los nombres de acción deben ser explícitos.",
      },
    ],
  },
  {
    id: "tiles",
    name: "Tiles",
    source: "stories/Molecules.Tiles.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Molecules/Tiles · Full + Half</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start">
          <div class="service-tile">
            <div class="tile-icon"><img src="/images/remesas.webp" alt="Comparar remesas" /></div>
            <div class="tile-label">Comparar remesas</div>
          </div>
          <div class="service-tile service-tile-half">
            <div class="tile-icon tile-icon-half"><img src="/images/navidad.webp" alt="Navidad" /></div>
            <div class="tile-label">Navidad</div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es el objetivo principal de los Tiles en OKY DS?",
        options: [
          "Dar accesos rápidos a servicios o categorías.",
          "Capturar texto largo del usuario.",
          "Reemplazar el resumen de checkout.",
          "Servir como placeholders de carga.",
        ],
        answer: 0,
        explanation:
          "Los tiles funcionan como atajos de navegación de alta intención con reconocimiento visual rápido.",
      },
      {
        text: "Una sección densa de home necesita más opciones visibles. ¿Qué variante usar?",
        options: ["Full Tile", "Half Tile", "Promo Banner", "Summary Box"],
        answer: 1,
        explanation:
          "Half Tile aumenta densidad sin perder la estructura reconocible del componente.",
      },
      {
        text: "¿Qué regla de accesibilidad aplica mejor a tiles interactivos?",
        options: [
          "Etiqueta legible y tamaño táctil suficiente.",
          "Permitir tiles sin texto y solo imagen.",
          "Reducir tipografía para que entren más tiles.",
          "Quitar acceso por teclado en desktop.",
        ],
        answer: 0,
        explanation:
          "Si el tile es acción, debe poder entenderse y tocarse con comodidad.",
      },
    ],
  },
  {
    id: "listas",
    name: "Listas",
    source: "stories/Organisms.Lists.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Organisms/Lists · PLP + Cart</div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start">
          <div class="list-plp-anatomy">
            <div class="list-plp-inner">
              <div class="list-plp-row">
                <div class="list-plp-image"><img src="/images/combo.webp" alt="Combo celebración" /></div>
                <div class="list-plp-copy">
                  <div class="token-product-text-plp">Combo celebración</div>
                  <div class="list-plp-prices">
                    <span class="token-price-tag token-price-tag-plp">$40.00</span>
                    <span class="token-price token-price-plp">$50.00</span>
                  </div>
                  <div class="discount-ribbon discount-ribbon-list"><span class="discount-ribbon-text token-price-percent">10% OFF</span></div>
                </div>
                <span class="chip-ds chip-ds-add0 chip-ds-shadow list-plp-action list-plp-chip-add0">${icono("mas")}</span>
              </div>
            </div>
          </div>
          <div class="list-cart-anatomy">
            <div class="list-cart-inner">
              <div class="list-cart-row">
                <div class="list-cart-image"><img src="/images/target.webp" alt="Gift card Target" /></div>
                <div class="list-cart-copy">
                  <div class="token-product-text-cart">Gift card de Target</div>
                  <div class="list-cart-prices">
                    <span class="token-price-tag token-price-tag-cart">$40.00</span>
                    <span class="token-price token-price-cart">$50.00</span>
                  </div>
                </div>
                <span class="chip-ds chip-ds-qty chip-ds-shadow list-cart-qty">${icono("borrar")}<span class="chip-ds-number">1</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es la finalidad principal de los componentes List?",
        options: [
          "Presentar productos de forma escaneable con precio y acción.",
          "Reemplazar encabezados y navegación.",
          "Capturar credenciales de usuario.",
          "Mostrar fondos decorativos.",
        ],
        answer: 0,
        explanation:
          "Las listas organizan contenido repetido para comparar rápido y accionar sin fricción.",
      },
      {
        text: "¿Qué variante corresponde a una pantalla de descubrimiento antes de checkout?",
        options: ["List/Cart", "List/PLP", "Summary Box", "Promo Code"],
        answer: 1,
        explanation:
          "PLP está orientada a exploración y agregado. Cart está orientada a revisar lo ya seleccionado.",
      },
      {
        text: "¿Qué regla UX/accesibilidad aplica a filas de listas?",
        options: [
          "Mantener nombre/precio legibles y usar alt útil en imágenes.",
          "Mostrar solo miniaturas sin texto de precio.",
          "Ocultar relación entre precio anterior y actual.",
          "Bajar contraste de texto para destacar fotos.",
        ],
        answer: 0,
        explanation:
          "La decisión de compra depende de entender precio y contexto del producto con claridad.",
      },
    ],
  },
  {
    id: "summary-box",
    name: "Summary Box",
    source: "stories/Organisms.SummaryBox.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Organisms/Summary Box · products/cart</div>
        <div class="summary-box with-overlap summary-box-compact summary-box-saving" data-flow="products" data-step="cart">
          <div class="summary-type-overlay"><span class="token-exchange">TIPO DE CAMBIO: Q 7.55</span></div>
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row">
                <span class="summary-label-strong">3 Producto</span>
                <span class="summary-label-strong">$100.00</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Costo por servicio</span>
                <span class="summary-label">$7.50</span>
              </div>
              <div class="summary-row summary-row-total" style="padding-bottom:8px">
                <span class="summary-label-strong">PAGAS</span>
                <span class="summary-label-strong">$107.50</span>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-cta-row">
              <button class="btn btn-primary summary-btn">Ir a caja</button>
            </div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es la responsabilidad principal del Summary Box?",
        options: [
          "Resumir totales, tipo de cambio y siguiente acción.",
          "Reemplazar cards de productos.",
          "Capturar únicamente código promocional.",
          "Mostrar tabs de navegación inferior.",
        ],
        answer: 0,
        explanation:
          "Summary Box da claridad financiera y orienta al siguiente paso del flujo de compra.",
      },
      {
        text: "¿En qué paso suele aparecer la acción de agregar un solo ítem?",
        options: ["PDP", "Checkout", "Cart", "Navigation"],
        answer: 0,
        explanation:
          "En PDP se concentra la acción de agregar. Cart y checkout priorizan confirmación y pago.",
      },
      {
        text: "¿Qué regla UX/accesibilidad es esencial para los totales?",
        options: [
          "Actualizar totales como texto y anunciar cambios relevantes.",
          "Renderizar totales solo como imagen decorativa.",
          "Ocultar tipo de cambio a lectores de pantalla.",
          "Actualizar montos únicamente al recargar página.",
        ],
        answer: 0,
        explanation:
          "Los cambios de precio son información crítica y deben percibirse inmediatamente.",
      },
    ],
  },
  {
    id: "navegacion",
    name: "Navegación",
    source: "stories/Organisms.Navigation.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Organisms/Navigation · Bottom Nav</div>
        <div class="mars-mobile">
          <div class="bottom-nav">
            <div class="nav-item">${icono("casa")}<span class="nav-label">Inicio</span></div>
            <div class="nav-item">${icono("grid")}<span class="nav-label">Categorías</span></div>
            <div class="nav-item active">${icono("fuego")}<span class="nav-label">Destacados</span></div>
            <div class="nav-item">${icono("recibo")}<span class="nav-label">Órdenes</span></div>
            <div class="nav-item">${icono("usuario")}<span class="nav-label">Perfil</span></div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es el propósito principal de Bottom Navigation?",
        options: [
          "Cambiar entre secciones principales de la app.",
          "Mostrar totales de transacciones.",
          "Capturar código promocional.",
          "Mostrar etiquetas de descuento de productos.",
        ],
        answer: 0,
        explanation:
          "Bottom nav organiza la IA principal. Debe contener destinos estables, no acciones contextuales.",
      },
      {
        text: "¿Qué regla visual aplica para tabs activas vs inactivas?",
        options: [
          "La activa debe tener mayor énfasis visual que las inactivas.",
          "Todas deben verse idénticas para consistencia.",
          "Solo las inactivas deben mostrar texto.",
          "En activa se pueden ocultar íconos.",
        ],
        answer: 0,
        explanation:
          "La ubicación actual debe identificarse en menos de un segundo.",
      },
      {
        text: "¿Qué regla de accesibilidad debe cumplirse en navegación?",
        options: [
          "Mostrar etiqueta de destino y estado actual del tab.",
          "Ocultar etiquetas y depender de memoria visual del ícono.",
          "Excluir tabs de foco de teclado.",
          "Usar solo color para indicar tab activa.",
        ],
        answer: 0,
        explanation:
          "Las etiquetas y el estado actual son esenciales para orientación y tecnología asistiva.",
      },
    ],
  },
  {
    id: "headers",
    name: "Headers",
    source: "stories/Organisms.Headers.stories.js",
    preview: () => `
      <div class="mars-story">
        <div class="mars-label">Organisms/Headers · App + Page</div>
        <div style="display:grid;gap:10px">
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group">
                <div class="header-icon">${icono("billetera")}</div>
              </div>
              <img class="header-logo" src="/images/logo-oky.svg" alt="OKY" />
              <div class="header-cart-chip header-cart-full"><span class="header-cart-count">1</span>${icono("carrito")}</div>
            </div>
          </div>
          <div class="mars-mobile">
            <div class="page-header-screen">
              <div class="header-icon header-icon-light">${icono("chevronIzquierda")}</div>
              <div class="page-header-title">Título de página</div>
              <div class="header-icon header-icon-light">${icono("ticket")}</div>
            </div>
          </div>
        </div>
      </div>
    `,
    questions: [
      {
        text: "¿Cuál es la función principal de los Headers?",
        options: [
          "Dar orientación y exponer acciones globales/de página.",
          "Renderizar filas de productos y descuentos.",
          "Capturar texto de búsqueda únicamente.",
          "Mostrar textos legales.",
        ],
        answer: 0,
        explanation:
          "Los headers conservan contexto y habilitan acciones clave como volver, cerrar, carrito y perfil.",
      },
      {
        text: "¿Qué variante corresponde a un modal con título centrado y cierre?",
        options: ["App Header", "Page Header / Modal", "Bottom Nav", "Summary Box"],
        answer: 1,
        explanation:
          "Page Header / Modal está diseñada para overlays y acciones de cierre contextual.",
      },
      {
        text: "¿Qué regla de accesibilidad aplica a acciones del header?",
        options: [
          "Controles de volver/cerrar/carrito con nombre claro y foco visible.",
          "Acciones solo con ícono sin etiqueta accesible.",
          "Omitir título del header para lectores de pantalla.",
          "Excluir íconos del foco por teclado.",
        ],
        answer: 0,
        explanation:
          "Son acciones de alta frecuencia; requieren descripción accesible y navegación visible por teclado.",
      },
    ],
  },
];

const PREGUNTAS_POR_COMPONENTE = 3;
const TOTAL_PREGUNTAS = COMPONENTES.length * PREGUNTAS_POR_COMPONENTE;
const LEADERBOARD_API_URL = "/api/ux-leaderboard";
const LEADERBOARD_LOCAL_KEY = "uxDetectiveLeaderboardLocalV2";
const LEADERBOARD_POLL_MS = 1000;
let leaderboardTimerId = null;

const estado = {
  step: 0,
  score: 0,
  misses: new Set(),
  locked: false,
  playerName: "",
  sessionId: "",
};

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const progressText = document.getElementById("progress-text");
const componentText = document.getElementById("component-text");
const scoreText = document.getElementById("score-text");
const playerText = document.getElementById("player-text");
const componentName = document.getElementById("component-name");
const componentSource = document.getElementById("component-source");
const componentPreview = document.getElementById("component-preview");
const questionText = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

const finalScore = document.getElementById("final-score");
const finalPlayer = document.getElementById("final-player");
const resultCopy = document.getElementById("result-copy");
const missedList = document.getElementById("missed-list");

const playerNameInput = document.getElementById("player-name");
const startError = document.getElementById("start-error");
const leaderboardBody = document.getElementById("leaderboard-body");
const leaderboardStatus = document.getElementById("leaderboard-status");
const winnerBanner = document.getElementById("winner-banner");

function getPosition() {
  const componentIndex = Math.floor(estado.step / PREGUNTAS_POR_COMPONENTE);
  const questionIndex = estado.step % PREGUNTAS_POR_COMPONENTE;
  return { componentIndex, questionIndex };
}

function renderQuestion() {
  const { componentIndex, questionIndex } = getPosition();
  const component = COMPONENTES[componentIndex];
  const question = component.questions[questionIndex];
  const globalQuestion = estado.step + 1;

  progressText.textContent = `Pregunta ${globalQuestion} de ${TOTAL_PREGUNTAS}`;
  componentText.textContent = `${component.name} · ${questionIndex + 1}/3 (Componente ${componentIndex + 1}/12)`;
  scoreText.textContent = `Puntaje: ${estado.score}`;
  playerText.textContent = `Participante: ${estado.playerName}`;

  componentName.textContent = component.name;
  componentSource.textContent = `Fuente: ${component.source}`;
  componentPreview.innerHTML = component.preview();

  questionText.textContent = question.text;
  optionsEl.innerHTML = "";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener("click", () => submitAnswer(index));
    optionsEl.appendChild(btn);
  });

  feedbackEl.className = "feedback hidden";
  feedbackEl.innerHTML = "";
  nextBtn.classList.add("hidden");
  estado.locked = false;
}

function submitAnswer(selectedIndex) {
  if (estado.locked) return;

  estado.locked = true;
  const { componentIndex, questionIndex } = getPosition();
  const component = COMPONENTES[componentIndex];
  const question = component.questions[questionIndex];
  const isCorrect = selectedIndex === question.answer;

  if (isCorrect) {
    estado.score += 1;
  } else {
    estado.misses.add(component.name);
  }

  scoreText.textContent = `Puntaje: ${estado.score}`;

  const optionButtons = [...optionsEl.querySelectorAll(".option-btn")];
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.answer) btn.classList.add("is-correct");
    if (idx === selectedIndex && idx !== question.answer) btn.classList.add("is-wrong");
  });

  feedbackEl.classList.remove("hidden");
  feedbackEl.classList.add(isCorrect ? "success" : "error");
  feedbackEl.innerHTML = `
    <strong>${isCorrect ? "¡Bien hecho!" : "Casi, vas muy bien"}</strong>
    <span><strong>Respuesta correcta:</strong> ${question.options[question.answer]}</span>
    <span><strong>Tip MARS:</strong> ${question.explanation}</span>
  `;

  // Sync inmediato por pregunta para multijugador en vivo.
  void registerScore();

  nextBtn.textContent = estado.step === TOTAL_PREGUNTAS - 1 ? "Ver resultados" : "Siguiente pregunta";
  nextBtn.classList.remove("hidden");
}

function generarSessionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadLocalLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => {
      return entry && typeof entry.name === "string" && typeof entry.score === "number";
    });
  } catch {
    return [];
  }
}

function saveLocalLeaderboard(entries) {
  try {
    localStorage.setItem(LEADERBOARD_LOCAL_KEY, JSON.stringify(entries));
  } catch {
    // no-op
  }
}

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function sortLeaderboard(entries) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aTime = new Date(a.updatedAt || 0).getTime();
    const bTime = new Date(b.updatedAt || 0).getTime();
    return bTime - aTime;
  });
}

function normalizarEntry(entry) {
  return {
    sessionId: String(entry.sessionId || ""),
    name: String(entry.name || "Sin nombre"),
    score: Number(entry.score || 0),
    total: Number(entry.total || TOTAL_PREGUNTAS),
    updatedAt: entry.updatedAt || new Date().toISOString(),
  };
}

function renderLeaderboard(entries) {
  leaderboardBody.innerHTML = "";

  if (entries.length === 0) {
    winnerBanner.textContent = "Ganador actual: esperando puntajes...";
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="4" class="leaderboard-empty">Sin puntajes aún.</td>';
    leaderboardBody.appendChild(row);
    return;
  }

  const ganador = entries[0];
  winnerBanner.textContent = `Ganador actual: ${ganador.name} con ${ganador.score}/${TOTAL_PREGUNTAS}`;

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    if (index === 0) row.classList.add("winner-row");
    row.innerHTML = `
      <td>${index + 1}º</td>
      <td>${entry.name}</td>
      <td>${entry.score}/${TOTAL_PREGUNTAS}</td>
      <td>${formatDate(entry.updatedAt)}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

function registrarPuntajeLocal() {
  if (!estado.playerName || !estado.sessionId) return;

  const now = new Date().toISOString();
  const entries = loadLocalLeaderboard();
  const index = entries.findIndex((entry) => entry.sessionId === estado.sessionId);

  if (index >= 0) {
    entries[index] = {
      ...entries[index],
      name: estado.playerName,
      score: Math.max(estado.score, entries[index].score || 0),
      total: TOTAL_PREGUNTAS,
      updatedAt: now,
    };
  } else {
    entries.push({
      sessionId: estado.sessionId,
      name: estado.playerName,
      score: estado.score,
      total: TOTAL_PREGUNTAS,
      updatedAt: now,
    });
  }

  const ordered = sortLeaderboard(entries).slice(0, 30);
  saveLocalLeaderboard(ordered);
  leaderboardStatus.textContent =
    "Modo local: no se pudo conectar al API global. El ranking se guarda solo en este navegador.";
}

async function fetchLeaderboardRemoto(limit = 30) {
  const response = await fetch(`${LEADERBOARD_API_URL}?limit=${limit}`, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.entries)) {
    throw new Error("Respuesta inválida del leaderboard.");
  }

  return payload.entries.map(normalizarEntry);
}

async function refreshLeaderboard() {
  try {
    const entries = await fetchLeaderboardRemoto(30);
    leaderboardStatus.textContent = "Conectado: ranking global en tiempo real.";
    renderLeaderboard(entries);
  } catch {
    const entries = sortLeaderboard(loadLocalLeaderboard());
    leaderboardStatus.textContent =
      "Modo local: no se pudo conectar al API global. El ranking se guarda solo en este navegador.";
    renderLeaderboard(entries);
  }
}

function iniciarPollingLeaderboard() {
  if (leaderboardTimerId) {
    window.clearInterval(leaderboardTimerId);
  }
  refreshLeaderboard();
  leaderboardTimerId = window.setInterval(() => {
    refreshLeaderboard();
  }, LEADERBOARD_POLL_MS);
}

async function registerScore() {
  if (!estado.playerName || !estado.sessionId) return;

  const payload = {
    sessionId: estado.sessionId,
    name: estado.playerName,
    score: estado.score,
    total: TOTAL_PREGUNTAS,
  };

  try {
    const response = await fetch(LEADERBOARD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    leaderboardStatus.textContent = "Conectado: ranking global en tiempo real.";
    await refreshLeaderboard();
  } catch {
    registrarPuntajeLocal();
    await refreshLeaderboard();
  }
}

function showEndScreen() {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  finalScore.textContent = String(estado.score);
  finalPlayer.textContent = `Participante: ${estado.playerName}`;

  if (estado.score >= 32) {
    resultCopy.textContent =
      "Excelente trabajo de detective UX. Aplicaste uso, variante y accesibilidad con mucha consistencia.";
  } else if (estado.score >= 24) {
    resultCopy.textContent =
      "Buen resultado. Revisa los componentes fallados para afinar decisiones de variante y reglas de uso.";
  } else {
    resultCopy.textContent =
      "Buen inicio. Juega otra vez y enfócate en elegir mejor variante y reglas de accesibilidad.";
  }

  missedList.innerHTML = "";
  if (estado.misses.size === 0) {
    const li = document.createElement("li");
    li.textContent = "Ninguno. Partida perfecta en todos los componentes.";
    missedList.appendChild(li);
  } else {
    COMPONENTES.forEach((component) => {
      if (!estado.misses.has(component.name)) return;
      const li = document.createElement("li");
      li.textContent = component.name;
      missedList.appendChild(li);
    });
  }

  registerScore();
}

function resetGame() {
  estado.step = 0;
  estado.score = 0;
  estado.misses = new Set();
  estado.locked = false;
}

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    startError.classList.remove("hidden");
    playerNameInput.focus();
    return;
  }

  startError.classList.add("hidden");
  estado.playerName = playerName;
  estado.sessionId = generarSessionId();

  resetGame();
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderQuestion();
  // Registra sesión con score 0 al iniciar.
  void registerScore();
}

function backToStart() {
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  playerNameInput.focus();
}

document.getElementById("start-btn").addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    startGame();
  }
});

nextBtn.addEventListener("click", () => {
  if (!estado.locked) return;
  if (estado.step === TOTAL_PREGUNTAS - 1) {
    showEndScreen();
    return;
  }
  estado.step += 1;
  renderQuestion();
});

document.getElementById("play-again-btn").addEventListener("click", backToStart);

iniciarPollingLeaderboard();
