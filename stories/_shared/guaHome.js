/* ─────────────────────────────────────────────────────────
   Home de Guatemala.

   Es el mockup "Homepage 1" de Pages/Homepages (mockup-1.html) tal
   cual, sin rehacerlo: se le quita su Discovery Header —el prototipo
   pone el suyo, con el folder en el orden nuestro: USA a la izquierda
   y GUA a la derecha— y se reapuntan las rutas de imagen, que en
   Storybook van con ./images y aquí se sirven en la raíz.

   De todo lo que hay dentro solo una cosa es accionable: la tile de
   "Recargar el Móvil", que abre la Category Page de recargas y desde
   ahí al PDP de Tigo. El resto de marcas de esta home no se tocan, que
   es como se pidió.
───────────────────────────────────────────────────────── */
export const GUA_HOME_MARKUP = `
      <!-- 1) Discovery Header / Right / State 1 -->
      
      </section>

      <section id="mockup1-content-left">
        <section class="mockup-block" data-pen-id="76102:40872-carrusel">
          <section aria-label="Banners">
            <div class="carousel-container oky-flow-banner-track">
              <div class="carousel-banner"><img src="oky-banner-usa.png" alt="Nueva sección de USA para comprar Gift Cards" /></div>
              <div class="carousel-banner"><img src="oky-banner-1.png" alt="Promo Verano" /></div>
              <div class="carousel-banner"><img src="oky-banner-2.png" alt="POPS · 15% OFF" /></div>
            </div>
          </section>
        </section>

        <section class="mockup-block mockup-left-tiles-block" data-pen-id="76102:40872-tiles">
          <div class="mockup-left-tiles">
            <div class="mockup-tiles-row">
              <article class="mockup-half-tile-wrap">
                
                <div class="service-tile service-tile-half is-secondary-border">
                  <div class="tile-icon tile-icon-half"><img src="multimarca.webp" alt="Multimarca" /></div>
                  <div class="tile-label">Multimarca</div>
                </div>
              </article>
              <div class="service-tile service-tile-half">
                <div class="tile-icon tile-icon-half"><img src="halloween.png" alt="Halloween" /></div>
                <div class="tile-label">Halloween</div>
              </div>
              <div class="service-tile service-tile-half">
                <div class="tile-icon tile-icon-half"><img src="hot.webp" alt="Ofertas" /></div>
                <div class="tile-label">Ofertas</div>
              </div>
            </div>

            <div class="mockup-tiles-row">
              <div class="service-tile">
                <div class="tile-icon"><img src="remesas.webp" alt="Hacer Remesas" /></div>
                <div class="tile-label">Hacer<br />Remesas</div>
              </div>
              <div class="service-tile is-live" data-action="open-category" data-category="comida"
                role="button" tabindex="0">
                <div class="tile-icon"><img src="invitar.webp" alt="Invitar a Comer" /></div>
                <div class="tile-label">Invitar<br />a Comer</div>
              </div>
              <div class="service-tile">
                <div class="tile-icon"><img src="servicios.webp" alt="Pagar Servicios" /></div>
                <div class="tile-label">Pagar<br />Servicios</div>
              </div>
            </div>

            <div class="mockup-tiles-row">
              <div class="service-tile">
                <div class="tile-icon"><img src="doctor.webp" alt="Cuidar su Salud" /></div>
                <div class="tile-label">Cuidar<br />su Salud</div>
              </div>
              <div class="service-tile">
                <div class="tile-icon"><img src="super.webp" alt="Mandar el Super" /></div>
                <div class="tile-label">Mandar<br />el Super</div>
              </div>
              <div class="service-tile is-live" data-action="open-category" data-category="recargas"
                role="button" tabindex="0">
                <div class="tile-icon"><img src="recargar.webp" alt="Recargar el Móvil" /></div>
                <div class="tile-label">Recargar<br />el Móvil</div>
              </div>
            </div>

            <div class="mockup-tiles-row">
              <div class="service-tile">
                <div class="tile-icon"><img src="regalos.webp" alt="Enviar Regalos" /></div>
                <div class="tile-label">Enviar<br />Regalos</div>
              </div>
              <div class="service-tile">
                <div class="tile-icon"><img src="gas.webp" alt="Llenar el Tanque" /></div>
                <div class="tile-label">Llenar<br />el Tanque</div>
              </div>
              <div class="service-tile">
                <div class="tile-icon"><img src="hogar.png" alt="Equipar su Hogar" /></div>
                <div class="tile-label">Equipar<br />su Hogar</div>
              </div>
            </div>
          </div>
        </section>

        <section class="mockup-block homecard" data-pen-id="76102:40872-homecard-comida-rapida">
          <section class="homecard-organism">
            <header class="homecard-header">
              <h3 class="token-h6 homecard-title">Novedades</h3>
            </header>

            <div class="homecard-content homecard-content-default">
              <div class="homecard-grid">
                <article class="homecard-tile is-live" data-action="open-tigo" role="button" tabindex="0">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="tigo.webp" alt="Tigo" /></div>
                  <p class="token-brand homecard-tile-name">Tigo</p>
                </article>
                <article class="homecard-tile is-live" data-action="open-plp" data-brand="mcdonalds"
                  role="button" tabindex="0">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="mcdonalds.webp" alt="McDonald's logo" /></div>
                  <p class="token-brand homecard-tile-name">McDonald's</p>
                </article>
                <article class="homecard-tile">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="pollo-campero.webp" alt="Pollo Campero logo" /></div>
                  <p class="token-brand homecard-tile-name">Pollo Campero</p>
                </article>
                <article class="homecard-tile">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="burguerking.webp" alt="Burger King logo" /></div>
                  <p class="token-brand homecard-tile-name">Burger King</p>
                </article>
                <article class="homecard-tile">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="pollo-granjero.webp" alt="Pollo Granjero logo" /></div>
                  <p class="token-brand homecard-tile-name">Pollo Granjero</p>
                </article>
                <article class="homecard-tile">
                  <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="ihop.webp" alt="iHop logo" /></div>
                  <p class="token-brand homecard-tile-name">iHop</p>
                </article>

              </div>
            </div>

            <footer class="homecard-footer">
              <button class="btn btn-primary btn-small" type="button">Ver más</button>
            </footer>
          </section>
        </section>
      
      </section>

      <section id="mockup1-content-right" hidden>
      <!-- 5) Carrusel nuevo -->
      <section id="mockup-carrusel-slot" class="mockup-block" data-pen-id="6449:41089"></section>

      <!-- 6) 72353:23953 (Promo Strip Double) -->
      <section class="mockup-block" data-pen-id="72353:23953">
        <div class="mars-mobile promo-strip-mobile-shell">
          <div class="promo-strip-stack">
            <section class="promo-strip-organism">
              <div class="promo-strip-heading-wrap">
                <h3 class="token-h6 promo-strip-heading">Todas estas 25% menos</h3>
              </div>
              <div class="promo-strip-divider"></div>
              <div class="promo-strip-row">
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="cvs.webp" alt="CVS" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-18%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">CVS</p>
                </article>
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="google.webp" alt="Google Play" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-27%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">Google Play</p>
                </article>
              </div>
            </section>

            <section class="promo-strip-organism promo-strip-organism-compact">
              <div class="promo-strip-row">
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="xbox.png" alt="Xbox" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-11%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">Xbox</p>
                </article>
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="uber.png" alt="Uber" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-33%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">Uber</p>
                </article>
              </div>
            </section>

          </div>
        </div>
      </section>

      <!-- 7) 7295:52040 -->
      <section class="mockup-block" data-pen-id="7295:52040">
        <div class="mars-mobile tactic-strip-mobile-shell">
          <section class="tactic-strip">
            <header class="tactic-strip-header">
              <h3 class="token-h6 tactic-strip-title">Solo por hoy</h3>
              <div class="super-ribbon super-ribbon-type-por-tiempo">
                <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
                <span class="super-ribbon-text">Termina en 20:43:32</span>
              </div>
            </header>

            <div class="tactic-strip-carousel-window">
              <div class="tactic-strip-carousel-track">
                <article class="tactic-offer tactic-offer-left">
                  <div class="tactic-offer-hero-wrap">
                    <img class="tactic-offer-hero" src="promo-image1.png" alt="Twitch" />
                    <div class="tactic-logo-wrap tactic-logo-wrap-left">
                      <img class="tactic-logo" src="twitch.png" alt="Twitch logo" />
                    </div>
                    <div class="tactic-discount-wrap tactic-discount-wrap-left">
                      <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-type-normal">
                        <span class="discount-ribbon-text token-price-percent">19% OFF</span>
                      </div>
                    </div>
                  </div>
                  <div class="tactic-brand-row"><p class="token-brand tactic-brand">Twitch</p></div>
                </article>

                <article class="tactic-offer tactic-offer-right">
                  <div class="tactic-offer-hero-wrap">
                    <img class="tactic-offer-hero" src="promo-image2.png" alt="Amazon" />
                    <div class="tactic-logo-wrap tactic-logo-wrap-right">
                      <img class="tactic-logo" src="amazon.png" alt="Amazon logo" />
                    </div>
                    <div class="tactic-discount-wrap tactic-discount-wrap-right">
                      <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-type-normal">
                        <span class="discount-ribbon-text token-price-percent">24% OFF</span>
                      </div>
                    </div>
                  </div>
                  <div class="tactic-brand-row"><p class="token-brand tactic-brand">Amazon</p></div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </section>

      <!-- 8) IQRGM (IqRGM) -->
      <section class="mockup-block homecard" data-pen-id="IqRGM">
        <section class="homecard-organism">
          <header class="homecard-header">
            <h3 class="token-h6 homecard-title">Solo por hoy</h3>
          </header>

          <div class="homecard-content homecard-content-default">
            <div class="homecard-grid">
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="macys.png" alt="Macy's logo" /></div>
                <p class="token-brand homecard-tile-name">Macy's</p>
              </article>
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="apple.webp" alt="Apple logo" /></div>
                <p class="token-brand homecard-tile-name">Apple</p>
              </article>
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="adidas.png" alt="Adidas logo" /></div>
                <p class="token-brand homecard-tile-name">Adidas</p>
              </article>
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="bestbuy.jpg" alt="Best Buy logo" /></div>
                <p class="token-brand homecard-tile-name">Best Buy</p>
              </article>
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="instacart.png" alt="Instacart logo" /></div>
                <p class="token-brand homecard-tile-name">Instacart</p>
              </article>
              <article class="homecard-tile">
                <div class="homecard-tile-logo-wrap"><img class="homecard-tile-logo" src="doordash.png" alt="Doordash logo" /></div>
                <p class="token-brand homecard-tile-name">Doordash</p>
              </article>
            </div>
          </div>

          <footer class="homecard-footer">
            <button class="btn btn-primary btn-small" type="button">Ver más</button>
          </footer>
        </section>
      </section>

      <!-- 9) 72353:23990 · 72353:23953 -->
      <section class="mockup-block" data-pen-id="72353:23990-72353:23953">
        <div class="mars-mobile promo-strip-mobile-shell">
          <div class="promo-strip-stack">
            <section class="promo-strip-organism">
              <div class="promo-strip-heading-wrap"><h3 class="token-h6 promo-strip-heading">Tus compras online</h3></div>
              <div class="promo-strip-divider"></div>
              <div class="promo-strip-row">
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="starbucks.webp" alt="Starbucks" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-16%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">Starbucks</p>
                </article>
                <article class="promo-strip-item">
                  <div class="promo-strip-image-box">
                    <img src="ebay.png" alt="eBay" />
                    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
                      <span class="discount-ribbon-text token-price-percent">-28%</span>
                    </div>
                  </div>
                  <p class="token-brand promo-strip-brand">eBay</p>
                </article>
              </div>
            </section>

          </div>
        </div>
      </section>
      </section>
    `;
