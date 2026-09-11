/* ─────────────────────────────────────────────────────────
   Card (Organismo)

   Extraído de Organisms.Card.stories.js para que la story y
   Pages/OKY Cash/Prototype compongan el mismo organismo.
   Apila Top Card + separador + Middle Card + separador +
   Bottom Card, todos moléculas ya existentes.
───────────────────────────────────────────────────────── */

import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./middleCard";
import {
  CARD_BOTTOM_PATHS,
  CARD_TOP_PATHS,
  findCardBottom,
  findCardTop,
  renderCardBottom,
  renderCardTop,
  resolveCardBottom,
  resolveCardTop,
} from "./primeCards";

export function resolveCardOrganismArgs(args = {}) {
  const topBase = findCardTop(args.topVariantPath);
  const middleBase = findMiddleCard(args.middleCardPath);
  const bottomBase = findCardBottom(args.bottomVariantPath);

  return {
    top: resolveCardTop({
      variantPath: CARD_TOP_PATHS.includes(args.topVariantPath) ? args.topVariantPath : topBase.path,
      showBrandLabel: args.topShowBrandLabel,
      brandLabel: args.topBrandLabel?.trim() || topBase.brandLabel,
      heroImage: args.topHeroImage?.trim() || topBase.heroImage,
      heroAlt: args.topHeroAlt?.trim() || topBase.heroAlt,
      flagImage: args.topFlagImage?.trim() || topBase.flagImage,
      flagAlt: args.topFlagAlt?.trim() || topBase.flagAlt,
      footerLeftLabel: args.topFooterLeftLabel?.trim() || topBase.footerLeftLabel,
      footerRightLabel: args.topFooterRightLabel?.trim() || topBase.footerRightLabel,
    }),
    middle: resolveMiddleCard({
      variantPath: MIDDLE_CARD_PATHS.includes(args.middleCardPath) ? args.middleCardPath : middleBase.path,
      pageContext: "PDP",
      title: args.middleTitle?.trim() || middleBase.title,
      currency: args.middleCurrency?.trim() || middleBase.currency,
      amount: args.middleAmount?.trim() || middleBase.amount,
      leftLabel: args.middleLeftLabel?.trim() || middleBase.leftLabel,
      rightLabel: args.middleRightLabel?.trim() || middleBase.rightLabel,
      image: args.middleImage?.trim() || middleBase.image,
      showDiscountRibbon: args.middleShowDiscountRibbon === true,
      discountRibbonType: DISCOUNT_RIBBON_TYPES.includes(args.middleDiscountRibbonType)
        ? args.middleDiscountRibbonType
        : "Normal",
      discountRibbonLabel: args.middleDiscountRibbonLabel?.trim() || "25% OFF",
      discountRibbonSize: "Default",
    }),
    bottom: resolveCardBottom({
      variantPath: CARD_BOTTOM_PATHS.includes(args.bottomVariantPath) ? args.bottomVariantPath : bottomBase.path,
      transactionId: typeof args.bottomTransactionId === "string" ? args.bottomTransactionId : bottomBase.transactionId,
      expiry: typeof args.bottomExpiry === "string" ? args.bottomExpiry : bottomBase.expiry,
      buttonLabel: args.bottomButtonLabel?.trim() || bottomBase.buttonLabel,
      showButtonLabel:
        typeof args.bottomShowButtonLabel === "boolean" ? args.bottomShowButtonLabel : true,
      whatsappImage: args.bottomWhatsappImage?.trim() || "whatsapp-icon-card-bottom.png",
    }),
  };
}

export function renderCardOrganism(args = {}) {
  const resolved = resolveCardOrganismArgs(args);

  return `
    <section class="card-organism" aria-label="Card organism">
      <div class="card-organism-stack">
        <div class="card-organism-part card-organism-part-top">
          ${renderCardTop(resolved.top)}
        </div>
        <div class="card-organism-separator-slot">
          <div class="separator-atom" role="separator" aria-orientation="horizontal"></div>
        </div>
        <div class="card-organism-part card-organism-part-middle">
          ${renderMiddleCard(resolved.middle)}
        </div>
        <div class="card-organism-separator-slot">
          <div class="separator-atom" role="separator" aria-orientation="horizontal"></div>
        </div>
        <div class="card-organism-part card-organism-part-bottom">
          ${renderCardBottom(resolved.bottom)}
        </div>
      </div>
    </section>
  `;
}
