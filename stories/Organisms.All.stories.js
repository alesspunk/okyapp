const widgetData = [
  ["dvBFn", "RECARGAS TIEMPO AIRE", "recargas.webp", "Claro + Tigo"],
  ["wnaYi", "OFERTAS DEL DIA", "nuggets.webp", "Combo $1.00"],
  ["Eoc3A", "OFERTA DEL DIA", "combo.webp", "95% OFF"],
  ["JhhAI", "COMPARA TIPOS DE CAMBIO", "remesas.webp", "USD/GTQ"],
  ["eCjrS", "ESTE MES DESDE PAGAR", "servicios.webp", "$59.99"],
];

export default {
  title: "Legacy/Organisms All",
  tags: ["autodocs"],
};

export const NavigationAndHeaders = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Navigation + Headers</h3>
      <div class="mars-subtitle">IDs: Navbar MHKUc, Header logged WO8oM, Header logout HpR9Z</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">
        <div class="mars-mobile">
          <div class="app-header">
            <img class="header-logo" src="logo-oky.svg" alt="OKY" />
            <div class="header-balance">$150.00</div>
            <i class="fa-regular fa-bell header-icon"></i>
          </div>
          <div class="bottom-nav">
            <div class="nav-item"><i class="fa-regular fa-house"></i><span class="nav-label">Inicio</span></div>
            <div class="nav-item"><i class="fa-regular fa-table-cells-large"></i><span class="nav-label">Categorias</span></div>
            <div class="nav-item active"><i class="fa-solid fa-fire"></i><span class="nav-label">Destacados</span></div>
            <div class="nav-item"><i class="fa-regular fa-receipt"></i><span class="nav-label">Ordenes</span></div>
            <div class="nav-item"><i class="fa-regular fa-circle-user"></i><span class="nav-label">Perfil</span></div>
          </div>
        </div>
        <div class="mars-mobile">
          <div class="app-header">
            <img class="header-logo" src="logo-oky.svg" alt="OKY" />
            <div class="header-left-group">
              <div class="header-cart-chip header-cart-empty"><i class="fa-regular fa-cart-shopping"></i></div>
              <button class="btn btn-primary btn-small">Login</button>
            </div>
          </div>
          <div class="status-bar"><div>9:41</div><div style="display:flex;gap:8px"><i class="fa-regular fa-signal"></i><i class="fa-regular fa-wifi"></i><i class="fa-regular fa-battery-full"></i></div></div>
        </div>
      </div>
    </div>
  `,
};

export const Widgets5 = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">Widgets (5)</h3>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        ${widgetData
          .map(
            ([id, title, img, value]) => `
          <div class="widget-card">
            <div class="widget-header">${title}</div>
            <div class="widget-content">
              <div class="widget-media"><img src="${img}" alt="${title}" /></div>
              <div>
                <div class="widget-title">${value}</div>
                <div class="widget-value">$1.00</div>
              </div>
            </div>
            <div style="font-size:10px;color:var(--text-secondary)">${id}</div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `,
};

export const HomeCardCarouselAndStrips = {
  render: () => `
    <div class="mars-story">
      <h3 style="margin:0 0 10px;color:var(--primary-main)">HomeCard + Carousel + Strips</h3>
      <div class="mars-subtitle">IDs: IqRGM, 62kJL, 72353:23990, 72353:23953</div>
      <div class="mars-grid">
        <div class="story-card">
          <div class="mars-label">HomeCard (IqRGM)</div>
          <div style="width:330px;max-width:100%;border:1px solid var(--border-main);border-radius:16px;padding:8px">
            <div style="font-weight:700;color:var(--primary-main);margin-bottom:8px">Comida Rapida</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <img src="mcdonalds.webp" style="width:100%;height:70px;object-fit:contain;border:1px solid var(--divider);border-radius:8px"/>
              <img src="burguerking.webp" style="width:100%;height:70px;object-fit:contain;border:1px solid var(--divider);border-radius:8px"/>
            </div>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Carousel (62kJL)</div>
          <div class="carousel-container">
            <div class="carousel-banner"><img src="promo-strips1.webp" alt="Promo 1"/></div>
            <div class="carousel-banner"><img src="promo-strips2.webp" alt="Promo 2"/></div>
          </div>
        </div>
        <div class="story-card">
          <div class="mars-label">Promo Strip / Single + Double</div>
          <div class="mars-mobile promo-strip-mobile-shell">
            <div class="promo-strip-stack">
              <section class="promo-strip-organism">
                <div class="promo-strip-heading-wrap"><h3 class="token-h6 promo-strip-heading">Tus compras online</h3></div>
                <div class="promo-strip-divider"></div>
                <div class="promo-strip-row">
                  <article class="promo-strip-item">
                    <div class="promo-strip-image-box">
                      <img src="target.webp" alt="Target">
                      <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                        <span class="discount-ribbon-text token-price-percent">-23%</span>
                      </div>
                    </div>
                    <p class="token-brand promo-strip-card-brand">Target</p>
                  </article>
                  <article class="promo-strip-item">
                    <div class="promo-strip-image-box">
                      <img src="google.webp" alt="Google Play">
                      <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                        <span class="discount-ribbon-text token-price-percent">-23%</span>
                      </div>
                    </div>
                    <p class="token-brand promo-strip-card-brand">Google Play</p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
