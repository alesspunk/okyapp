# MARS React Code Library

Last update: 2026-03-12  
Scope: React reference snippets aligned to the current Storybook APIs and menu structure.

## Table of Contents
1. [Overview](#overview)
2. [Tokens](#tokens)
3. [Icons](#icons)
4. [Atoms](#atoms)
5. [Molecules](#molecules)
6. [Organisms](#organisms)
7. [Pages](#pages)
8. [Reference](#reference)

---

## Overview

This document is the content source for the Storybook **React code** section. It focuses on operational snippets and current props, not pixel-perfect implementation details.

Included here:
- Foundation tokens currently used by recent work
- Updated React references for Atoms, Molecules, Organisms, and Pages
- Character recommendations and show/hide code guidance

Recent additions reflected here:
- `Brand Item`, `Slider`, `Toast Banners`, `Status Chips`
- `Middle Card`, `PDP Header`
- `Homepages` and `PDP Pages`

---

## Tokens

### Color and semantic tokens
- `--primary-main: #410088`
- `--primary-light: #bc9edc`
- `--primary-dark: #230741`
- `--secondary-main: #18afa5`
- `--secondary-light: #8adad7`
- `--secondary-dark: #057a73`
- Semantic sets:
  - `--success-*`
  - `--warning-*`
  - `--error-*`
  - `--info-*`

### Recent surface and effect tokens
- `--card-middle`
- `--card-shadow`
- `--pdp-card-shadow`
- `--border-main`

### Typography mapping used by recent components
- `productText`
- `subtitle2`
- `H2`
- `CARDLABEL`
- `body1`
- `caption`
- `TAG`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export const marsTokens = {
  color: {
    primaryMain: '#410088',
    secondaryMain: '#18afa5',
    successMain: '#4caf50',
    warningMain: '#ff9800',
    errorMain: '#f44336',
    infoMain: '#2196f3',
  },
  surface: {
    cardMiddle: 'radial-gradient(50% 50% at 50% 50%, #FFF 0%, #F1F2F5 100%)',
    borderMain: '#E0E0E0',
  },
  effect: {
    cardShadow: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.1))',
    pdpCardShadow: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.14)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.12))',
  },
};
```
</details>

---

## Icons

### Setup
- `/public/fontawesome-free/css/all.min.css`
- `/public/fontawesome-kit/css/custom-icons.min.css`
- Default system rule:
  - `fa-light` for neutral
  - `fa-solid` for active or semantic emphasis

### Variants
- `Large`
- `Medium`
- `Small`
- `Default`
- `Active`
- `Card Use`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function MarsIcon({
  icon = 'fa-arrow-up-right-from-square',
  weight = 'fa-light',
  variant = 'Medium',
}: {
  icon?: string;
  weight?: 'fa-thin' | 'fa-light' | 'fa-regular' | 'fa-solid';
  variant?: 'Large' | 'Medium' | 'Small' | 'Default' | 'Active' | 'Card Use';
}) {
  const variantClass = {
    Large: 'fa-icon-large',
    Medium: 'fa-icon-medium',
    Small: 'fa-icon-small',
    Default: 'fa-icon-default',
    Active: 'fa-icon-active',
    'Card Use': 'fa-icon-card-use',
  }[variant];

  return <span className={`fa-icon ${variantClass}`}><i className={`${weight} ${icon}`} /></span>;
}
```
</details>

---

## Atoms

### Chips
- `New item`
- `Cart`
- `Status`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function StatusChip({
  status = 'processing',
  label = 'Procesando',
}: {
  status?: 'button' | 'error' | 'processing' | 'expired' | 'sended';
  label?: string;
}) {
  const iconMap = {
    button: 'fa-qrcode',
    error: 'fa-circle-xmark',
    processing: 'fa-hourglass-half',
    expired: 'fa-clock',
    sended: 'fa-circle-check',
  };

  return (
    <span className={`chip-status chip-status-${status}`}>
      <span className="fa-icon fa-icon-small"><i className={`fa-solid ${iconMap[status]}`} /></span>
      <span className="token-button-sm">{label}</span>
    </span>
  );
}
```
</details>

### Discount Ribbon
- `List`
- `Wrap`
- `Normal`
- `Por tiempo`
- `Finito`
- `Por temporada`
- `OKY`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function DiscountRibbon({
  tipo = 'Wrap',
  type = 'Normal',
  size = 'Default',
  label = '25% OFF',
}: {
  tipo?: 'List' | 'Wrap';
  type?: 'Normal' | 'Por tiempo' | 'Finito' | 'Por temporada' | 'OKY';
  size?: 'Default' | 'Small';
  label?: string;
}) {
  const typeClass = `discount-ribbon-type-${type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`;
  const sizeClass = size === 'Small' ? 'discount-ribbon-wrap-small' : '';

  return tipo === 'Wrap' ? (
    <div className={`discount-ribbon discount-ribbon-wrap ${sizeClass} ${typeClass}`}>
      <span className="discount-ribbon-text token-price-percent">{label}</span>
    </div>
  ) : (
    <div className={`discount-ribbon discount-ribbon-list ${typeClass}`}>
      <span className="discount-ribbon-text token-price-percent">{label}</span>
    </div>
  );
}
```
</details>

### Brand Item
- `With label`
- `No label`
- `Big`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function BrandItem({
  image = 'mcdonalds.webp',
  label = "McDonald's",
  variant = 'With label',
  background = 'transparent',
}: {
  image?: string;
  label?: string;
  variant?: 'With label' | 'No label' | 'Big';
  background?: string;
}) {
  const isBig = variant === 'Big';
  const showLabel = variant === 'With label';

  return (
    <div className={`brand-item-atom ${isBig ? 'is-big' : showLabel ? 'is-with-label' : 'is-no-label'}`} style={{ backgroundColor: background }}>
      {showLabel ? <p className="brand-item-label token-product-text">{label}</p> : null}
      <div className="brand-item-frame">
        <div className="brand-item-base">
          <img src={`/images/${image}`} alt={label} />
        </div>
      </div>
    </div>
  );
}
```
</details>

### Inputs / Dinamic
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function DynamicAmountInput({
  currencySymbol = 'Q',
  label = 'Desde 50 hasta 2000',
  value = '250',
}: {
  currencySymbol?: 'Q' | '$';
  label?: string;
  value?: string;
}) {
  return (
    <div className="input-wrapper">
      <label className="input-label input-label-dinamic">{label}</label>
      <span className="input-dinamic-prefix">{currencySymbol}</span>
      <input className="input-field input-dinamic input-dinamic-hasvalue" value={value} readOnly />
    </div>
  );
}
```
</details>

### Slider
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function MoneySlider({
  currency = 'Q',
  min = 25,
  max = 200,
  step = 25,
  value = 85,
}: {
  currency?: 'Q' | '$';
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}) {
  const progress = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className="slider-atom" style={{ ['--slider-progress' as string]: progress }}>
      <input className="slider-range" type="range" min={min} max={max} step={step} defaultValue={value} />
      <div className="slider-values token-body1"><span>{currency} {min}</span><span>{currency} {max}</span></div>
      <div className="slider-labels token-caption"><span>Mínimo</span><span>Máximo</span></div>
    </div>
  );
}
```
</details>

### Toast Banners
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function ToastBanner({
  variant = 'success',
  message = 'Vale enviado correctamente',
  icon = 'fa-circle-check',
}: {
  variant?: 'success' | 'warning' | 'error';
  message?: string;
  icon?: string;
}) {
  return (
    <div className={`toast-banner toast-banner-${variant}`}>
      <span className="fa-icon fa-icon-small"><i className={`fa-solid ${icon}`} /></span>
      <span className="toast-banner-copy">{message}</span>
    </div>
  );
}
```
</details>

---

## Molecules

### Folder
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function Folder({
  property1 = 'Left',
  showNewItemChip = true,
}: {
  property1?: 'Left' | 'Right' | 'Collapsed Left' | 'Collapsed Right';
  showNewItemChip?: boolean;
}) {
  return (
    <div className={`folder-control ${property1.includes('Right') ? 'is-right' : 'is-left'}`}>
      {property1 === 'Left' && showNewItemChip ? <span className="chip-ds chip-ds-new-item">Nuevo</span> : null}
    </div>
  );
}
```
</details>

### Plateu
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function Plateu({ property1 }: { property1: string }) {
  const variant = plateuVariants[property1] ?? plateuVariants['State=Productos, Telco=No, Scrolling=No'];
  return (
    <section className={`plateu-molecule ${variant.scrolling ? 'is-scrolling' : 'is-static'}`}>
      <div className={`plateu-track ${variant.scrolling ? 'is-scrolling' : 'is-static'}`}>
        {variant.items.map((item) => (
          <div key={item.key} className="plateu-item">
            <img className="plateu-icon" src={`/images/${item.image}`} alt={item.label} />
            {item.active ? <span className="plateu-chip">{item.label}</span> : <span className="plateu-label">{item.label}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
```
</details>

### Promo Code
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function PromoCode({
  state = 'empty',
  promoCode = 'verano26',
  placeholder = 'Ingresa el código promocional',
}: {
  state?: 'empty' | 'entered';
  promoCode?: string;
  placeholder?: string;
}) {
  return (
    <div className="promo-code-molecule" data-state={state}>
      <p className="promo-code-copy">{state === 'entered' ? `Código Promo: ${promoCode}` : placeholder}</p>
      <button className="promo-code-action promo-clear" />
      <button className="promo-code-action promo-open" />
    </div>
  );
}
```
</details>

### Middle Card
<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function MiddleCard({
  variantPath = 'Molecule/Middle Card/Vale de Monto',
  pageContext = 'PDP',
  showDiscountRibbon = true,
  discountRibbonType = 'Normal',
  discountRibbonLabel = '25% OFF',
}: {
  variantPath?: string;
  pageContext?: 'PDP' | 'Checkout';
  showDiscountRibbon?: boolean;
  discountRibbonType?: 'Normal' | 'Por tiempo' | 'Finito' | 'Por temporada' | 'OKY';
  discountRibbonLabel?: string;
}) {
  const card = resolveMiddleCard({ variantPath, pageContext, showDiscountRibbon, discountRibbonType, discountRibbonLabel });
  return <div dangerouslySetInnerHTML={{ __html: renderMiddleCard(card) }} />;
}
```
</details>

### Headers / Navigation / Tiles
- `Headers` includes app and page headers, including `No title`
- `Navigation` includes `Con label` and `Sin label`
- `Tiles` still render from the same full/half tile anatomy

---

## Organisms

### Carrusel
### Discovery Header
### HomeCard
### Promo Strip
### Summary Box
### PDP Header

<details>
<summary><strong>Show React snippet (PDP Header)</strong></summary>

```tsx
export function PDPHeader({
  showPlateu = false,
  plateuVariant = 'State=Productos, Telco=No, Scrolling=No',
  showDiscountRibbon = true,
}: {
  showPlateu?: boolean;
  plateuVariant?: string;
  showDiscountRibbon?: boolean;
}) {
  return (
    <section className="pdp-header-stack">
      <PageHeader variant="No title" />
      <BrandItem variant="With label" />
      {showPlateu ? <Plateu property1={plateuVariant} /> : null}
      <MiddleCard showDiscountRibbon={showDiscountRibbon} />
      <DynamicAmountInput />
    </section>
  );
}
```
</details>

<details>
<summary><strong>Show React snippet (Summary Box)</strong></summary>

```tsx
export function SummaryBox({
  flow = 'products',
  step = 'pdp',
  pricing = 'saving',
  exchangeRate,
  productLabel = 'Producto',
}: {
  flow?: 'products' | 'giftCards' | 'billPayments';
  step?: 'pdp' | 'plp' | 'cart' | 'checkout';
  pricing?: 'normal' | 'saving';
  exchangeRate?: string;
  productLabel?: string;
}) {
  return <div dangerouslySetInnerHTML={{ __html: buildSummaryBox({ flow, step, pricing, exchangeRate, productLabel }) }} />;
}
```
</details>

---

## Pages

### Homepages
- `Homepage 1` to `Homepage 5`
- Rendered in Storybook under `Pages / Homepages`

### PDP Pages
- `PDP Page 1` to `PDP Page 4`
- Rendered in Storybook under `Pages / PDP Pages`

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
export function PDPPageExample() {
  return (
    <main className="pdp-page-shell has-no-plateu">
      <PageHeader variant="No title" />
      <BrandItem variant="With label" label="Apple" image="apple.webp" />
      <MiddleCard variantPath="Molecule/Middle Card/eGift Card" pageContext="PDP" showDiscountRibbon />
      <DynamicAmountInput currencySymbol="$" value="25" />
      <SummaryBox flow="giftCards" step="pdp" pricing="saving" productLabel="Producto" />
      <BottomNavigation variant="Sin label" activeTab="ofertas" />
    </main>
  );
}
```
</details>

---

## Reference

### Character recommendations
- `Middle Card / Vale de Monto`: title max 14 chars, amount max 5 digits + separators
- `Middle Card / eGift Card`: title max 21 chars
- `Toast Banners`: max 30 chars
- `Brand Item label`: one line only, centered

### Show/Hide code best practice
Use semantic disclosure with `<details>` so long snippets stay readable.

<details>
<summary><strong>Show React snippet</strong></summary>

```tsx
type CodeExampleProps = {
  title?: string;
  children: React.ReactNode;
};

export function CodeExample({ title = 'Show React snippet', children }: CodeExampleProps) {
  return (
    <details>
      <summary>{title}</summary>
      <pre><code>{children}</code></pre>
    </details>
  );
}
```
</details>
