# MARS Design System - Atomic Design Library (Synced with Storybook)

Last update: 2026-03-09  
Scope: updated components/variants requested and aligned to current stories.

## Table of Contents
1. [Foundation Tokens](#foundation-tokens)
2. [Atoms](#atoms)
3. [Molecules](#molecules)
4. [Organisms](#organisms)
5. [Show/Hide Code Best Practice](#showhide-code-best-practice)

---

## Foundation Tokens

### Color & semantic tokens (from `stories/mars.css`)
- `--primary-main: #410088`
- `--primary-light: #bc9edc`
- `--primary-dark: #230741`
- `--secondary-main: #18afa5`
- `--secondary-light: #8adad7`
- `--secondary-dark: #057a73`
- `--accent-color: #ffb400`
- Semantic sets:
  - Success: `--success-*`
  - Warning: `--warning-*`
  - Error: `--error-*`
  - Info: `--info-*`

### Typography scale updates (from `Foundations/Tokens`)
- Full scale: 30 tokens.
- New/important tag token:
  - `TAG`: `7px`, `700`, uppercase, `letter-spacing: 1px`, family `Lato`.
- Related small-label tokens used in latest components:
  - `PLATEU`, `CARDLABEL`, `EXCHANGE`.

### Icon system (current implementation)
- Local assets (no runtime dependency on remote kit script):
  - `/public/fontawesome-free/css/all.min.css`
  - `/public/fontawesome-kit/css/custom-icons.min.css`
- Header wallet custom icon:
  - class: `fak fa-kit fa-wallet icon-medium`
- Navigation and general icon rule in current stories:
  - `fa-light` by default.
  - active state uses `fa-solid` only where specified (e.g. `fa-fire`).

<details>
<summary><strong>Show React snippet (theme + icon setup)</strong></summary>

```tsx
// app/theme/tokens.ts
export const marsTokens = {
  color: {
    primaryMain: '#410088',
    secondaryMain: '#18afa5',
    secondaryDark: '#057a73',
    secondaryLight: '#8adad7',
    accent: '#ffb400',
  },
  typography: {
    TAG: {
      fontFamily: 'Lato, sans-serif',
      fontSize: 7,
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      lineHeight: 1.57,
    },
  },
};

// app/layout.tsx
export function FontAwesomeAssets() {
  return (
    <>
      <link rel="stylesheet" href="/public/fontawesome-free/css/all.min.css" />
      <link rel="stylesheet" href="/public/fontawesome-kit/css/custom-icons.min.css" />
    </>
  );
}
```
</details>

---

## Atoms

### Chips (`Atoms/Chips`)
Variants in Playground:
- `Chips/New item` (Figma: `1913:1659`)
- `Chips/Cart` (`9fXxZ`)
- `Chips/Quantity Input / Add0 / Vales` (`DsDmy`)
- `Chips/Quantity Input / Quantity/Gifcards/Giftcards` (`QtFxr`)
- `Chips/Quantity Input / Add1 / Vales` (`BEpku`)
- `Chips/Quantity Input / Add2 / Vales` (`AotiP`)

New item chip spec:
- class: `chip-ds chip-ds-new-item`
- size: `45x15`
- text style mapped to TAG-like treatment (`7px`, uppercase, 1px tracking)
- color: background `--secondary-main`, text white

<details>
<summary><strong>Show React snippet (Chips/New item)</strong></summary>

```tsx
type ChipsVariant =
  | 'Chips/New item'
  | 'Chips/Cart'
  | 'Chips/Quantity Input / Add0 / Vales'
  | 'Chips/Quantity Input / Quantity/Gifcards/Giftcards'
  | 'Chips/Quantity Input / Add1 / Vales'
  | 'Chips/Quantity Input / Add2 / Vales';

export function ChipNewItem({ text = 'Nuevo' }: { text?: string }) {
  return <span className="chip-ds chip-ds-new-item">{text}</span>;
}
```
</details>

### Discount Ribbon (`Atoms/Discount Ribbon`)
Dimensions:
- Tipo: `List` | `Wrap`
- Type: `Normal`, `Por tiempo`, `Finito`, `Por temporada`, `OKY`
- Wrap size: `Default (75px)` | `Small (50px)`

Design behavior:
- `Wrap` uses notch + elevated overlay.
- `List` uses inline rectangular badge.
- Text style uses `token-price-percent`.

<details>
<summary><strong>Show React snippet (Discount Ribbon)</strong></summary>

```tsx
type DiscountTipo = 'List' | 'Wrap';
type DiscountType = 'Normal' | 'Por tiempo' | 'Finito' | 'Por temporada' | 'OKY';

export function DiscountRibbon({
  tipo = 'List',
  type = 'Normal',
  small = false,
  label = '25% OFF',
}: {
  tipo?: DiscountTipo;
  type?: DiscountType;
  small?: boolean;
  label?: string;
}) {
  const typeClass = `discount-ribbon-type-${type
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')}`;

  if (tipo === 'Wrap') {
    return (
      <div className={`discount-ribbon discount-ribbon-wrap ${small ? 'discount-ribbon-wrap-small' : ''} ${typeClass}`}>
        <span className="discount-ribbon-text token-price-percent">{label}</span>
      </div>
    );
  }

  return (
    <div className={`discount-ribbon discount-ribbon-list ${typeClass}`}>
      <span className="discount-ribbon-text token-price-percent">{label}</span>
    </div>
  );
}
```
</details>

### Super Ribbon (`Atoms/Super Ribbon`)
`Property 1` variants:
- `Por tiempo`
- `Finito`
- `Normal`
- `Por temporada`
- `OKY`

Rules:
- Fixed height `32px`.
- Changes by variant: background, text color, icon, copy.
- Supports text/icon override in Playground.

<details>
<summary><strong>Show React snippet (Super Ribbon)</strong></summary>

```tsx
type SuperRibbonType = 'Por tiempo' | 'Finito' | 'Normal' | 'Por temporada' | 'OKY';

const defaults: Record<SuperRibbonType, { icon: string; text: string; className: string }> = {
  'Por tiempo': { icon: 'fa-clock', text: 'Termina en 20:43:32', className: 'super-ribbon-type-por-tiempo' },
  Finito: { icon: 'fa-fire-flame-simple', text: 'Últimas 20 unidades', className: 'super-ribbon-type-finito' },
  Normal: { icon: 'fa-tags', text: 'Descuentos de temporada', className: 'super-ribbon-type-normal' },
  'Por temporada': { icon: 'fa-sun', text: 'Ofertas del mes de Abril', className: 'super-ribbon-type-por-temporada' },
  OKY: { icon: 'fa-heart', text: 'Para la persona que quieres', className: 'super-ribbon-type-oky' },
};

export function SuperRibbon({ type = 'Por tiempo', text, icon }: { type?: SuperRibbonType; text?: string; icon?: string }) {
  const meta = defaults[type];
  return (
    <div className={`super-ribbon ${meta.className}`}>
      <span className="super-ribbon-icon"><i className={`fa-solid ${icon || meta.icon}`} /></span>
      <span className="super-ribbon-text">{text || meta.text}</span>
    </div>
  );
}
```
</details>

---

## Molecules

### Folder (`Molecules/Folder`)
Variants:
- Expanded: `Left (7296:48469)`, `Right (7296:48471)`
- Collapsed: `Collapsed Left (7296:48472)`, `Collapsed Right (7296:48473)`

Key behavior:
- `showNewItemChip` affects expanded `Left` only.
- Left active tab can show chevrons (`GUA` case).
- Active line only under active side.

<details>
<summary><strong>Show React snippet (Folder + toggle chip)</strong></summary>

```tsx
type FolderVariant = 'Left' | 'Right' | 'Collapsed Left' | 'Collapsed Right';

export function Folder({
  property1 = 'Left',
  leftCode = 'GUA',
  rightCode = 'USA',
  showChevrons = true,
  showNewItemChip = true,
}: {
  property1?: FolderVariant;
  leftCode?: string;
  rightCode?: string;
  showChevrons?: boolean;
  showNewItemChip?: boolean;
}) {
  const isLeftExpanded = property1 === 'Left';
  return (
    <div className={`folder-control ${property1.includes('Right') ? 'is-right' : 'is-left'}`}>
      {/* top + bottom svg layers */}
      {isLeftExpanded && showNewItemChip ? <span className="chip-ds chip-ds-new-item">Nuevo</span> : null}
      {/* flags/text/active-line */}
    </div>
  );
}
```
</details>

### Plateu (`Molecules/Plateu`)
Property 1 options:
- `State=Productos, Telco=No, Scrolling=No` (`6944:57168`)
- `State=Vales, Telco=No, Scrolling=No` (`6944:57208`)
- `State=Ofertas, Telco=No, Scrolling=No` (`6944:57307`)
- `State=Paquetes, Telco=Yes, Scrolling=No` (`6985:152026`)
- `State=Internet, Telco=Yes, Scrolling=No` (`6985:152223`)
- `State=Recargas, Telco=Yes, Scrolling=No` (`6989:110025`)
- `State=Paquetes, Telco=Yes, Scrolling=Yes` (`6985:152321`)
- `State=Pasteleria, Telco=Yes, Scrolling=Yes` (`6996:111868`)
- `State=Restaurantes, Telco=Yes, Scrolling=Yes` (`7016:135942`)
- `State=Home, Telco=No, Scrolling=Yes` (`7331:50399`)

Latest behavior:
- Home scrolling variant keeps visual spacing (`8px`) between items.
- Active chip and inactive labels share reduced scale updated in latest round.

<details>
<summary><strong>Show React snippet (Plateu by property1)</strong></summary>

```tsx
export function Plateu({ property1 }: { property1: string }) {
  const variant = plateuVariants[property1] ?? plateuVariants['State=Productos, Telco=No, Scrolling=No'];
  return (
    <section className={`plateu-molecule ${variant.scrolling ? 'is-scrolling' : 'is-static'} ${variant.home ? 'is-home' : ''}`}>
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

### Promo Code (`Molecules/Promo Code`)
States:
- `empty`
- `entered`

Pen: `6437:28971`

Behavior:
- `empty`: shows placeholder + chevron.
- `entered`: shows applied code + clear action.

<details>
<summary><strong>Show React snippet (Promo Code states)</strong></summary>

```tsx
type PromoState = 'empty' | 'entered';

export function PromoCode({
  state = 'empty',
  promoCode = 'verano26',
  placeholder = 'Ingresa el código promocional',
}: {
  state?: PromoState;
  promoCode?: string;
  placeholder?: string;
}) {
  return (
    <div className="promo-code-molecule" data-state={state}>
      <span className="promo-code-leading"><img src="PROMOS@2x.webp" alt="" /></span>
      <p className="promo-code-copy">
        {state === 'entered' ? <><span className="promo-code-prefix">Código Promo:</span> {promoCode}</> : placeholder}
      </p>
      <button className="promo-code-action promo-clear" aria-label="Quitar código"><i className="fa-solid fa-circle-xmark icon-medium" /></button>
      <button className="promo-code-action promo-open" aria-label="Ingresar código"><i className="fa-solid fa-chevron-right icon-medium" /></button>
    </div>
  );
}
```
</details>

### Tiles (`Molecules/Tiles`)
Full variants:
- `Macro/Tile/Food` (`g0RAt`)
- `Macro/Tile/Money` (`X1bOv`)
- `Macro/Tile/Mobile Topup` (`1Zzry`)
- `Macro/Tile/Bill Payment` (`GY8MG`)

Half variants:
- `Macro/HalfTile/Seasonal` (`AqHu9`)
- `Macro/HalfTile/Topup` (`pEubm`)
- `Macro/HalfTile/Multi-Brand` (`fHlYu`)

<details>
<summary><strong>Show React snippet (Tile renderer)</strong></summary>

```tsx
export function ServiceTile({
  label,
  image,
  half = false,
}: {
  label: string;
  image: string;
  half?: boolean;
}) {
  return (
    <div className={half ? 'service-tile service-tile-half' : 'service-tile'}>
      <div className={half ? 'tile-icon tile-icon-half' : 'tile-icon'}>
        <img src={`/images/${image}`} alt={label} />
      </div>
      <div className="tile-label">{label}</div>
    </div>
  );
}
```
</details>

### Headers (`Molecules/Headers`)
App Header variants:
- `logged-empty` (`WO8oM`)
- `logged-cart` (`ArMsV`)
- `not-logged` (`ZPc9u`)
- extra toggle: `leftButtons = single | double`

Page Header variants:
- `screens` (`6IKuE`)
- `modal` (`5mGYt`)

Rules:
- custom wallet icon: `fak fa-kit fa-wallet`
- non-wallet icons in header: `fa-light`
- `fa-circle-user` is solid in `not-logged`

<details>
<summary><strong>Show React snippet (App Header)</strong></summary>

```tsx
type AppHeaderVariant = 'logged-empty' | 'logged-cart' | 'not-logged';

export function AppHeader({
  variant = 'logged-empty',
  leftButtons = 'single',
  cartCount = 2,
}: {
  variant?: AppHeaderVariant;
  leftButtons?: 'single' | 'double';
  cartCount?: number;
}) {
  return (
    <div className={`app-header ${variant === 'logged-cart' ? 'is-logged-cart' : ''}`}>
      <div className={`header-left-group ${leftButtons === 'double' ? 'header-side-cluster' : ''}`}>
        <div className="header-icon"><i className="fak fa-kit fa-wallet icon-medium" /></div>
        {leftButtons === 'double' ? <div className="header-icon"><i className="fa-light fa-magnifying-glass icon-medium" /></div> : null}
      </div>
      <img className="header-logo" src="logo-oky.svg" alt="OKY" />
      {variant === 'logged-cart' ? (
        <div className="header-cart-chip header-cart-full"><span className="header-cart-count">{cartCount}</span><i className="fa-light fa-cart-shopping" /></div>
      ) : variant === 'not-logged' ? (
        <div className="header-icon"><i className="fa-solid fa-circle-user icon-medium-solid" /></div>
      ) : (
        <div className="header-icon"><i className="fa-light fa-cart-shopping icon-medium" /></div>
      )}
    </div>
  );
}
```
</details>

### Navigation (`Molecules/Navigation`)
Variants:
- `Con label`
- `Sin label` (icon-only, height `56px`)

Items:
- Inicio (`fa-home`)
- Canje (`fa-map`)
- Ofertas (`fa-fire`, active solid)
- Ayuda (`fa-messages`)
- Menú (`fa-bars`)

Shell style:
- border radius: `0 0 24px 24px`
- top border and shadow enabled
- fixed-bottom behavior used in mockups

<details>
<summary><strong>Show React snippet (Bottom Nav)</strong></summary>

```tsx
const navItems = [
  { key: 'inicio', label: 'Inicio', icon: 'home' },
  { key: 'canje', label: 'Canje', icon: 'map' },
  { key: 'ofertas', label: 'Ofertas', icon: 'fire' },
  { key: 'ayuda', label: 'Ayuda', icon: 'messages' },
  { key: 'menu', label: 'Menú', icon: 'bars' },
];

export function BottomNavigation({ variant = 'Sin label', activeTab = 'ofertas' }) {
  const noLabel = variant === 'Sin label';
  return (
    <nav className={`bottom-nav ${noLabel ? 'is-no-label' : ''}`}>
      {navItems.map((item) => {
        const active = item.key === activeTab;
        const iconWeight = item.key === 'ofertas' && active ? 'fa-solid' : 'fa-light';
        return (
          <div key={item.key} className={`nav-item ${active ? 'active' : ''}`}>
            <i className={`${iconWeight} fa-${item.icon} icon-medium`} />
            {!noLabel ? <span className="nav-label">{item.label}</span> : null}
          </div>
        );
      })}
    </nav>
  );
}
```
</details>

---

## Organisms

### Carrusel (`Organisms/Carrusel`)
- Pen: `6449:41089`
- Mobile viewport 360px
- 2 banners visible (second partial)
- 5 dots pagination, controllable by `activeDot`

<details>
<summary><strong>Show React snippet (Carrusel)</strong></summary>

```tsx
export function Carrusel({ activeDot = 1 }: { activeDot?: number }) {
  return (
    <section className="carrusel-organism" data-pen-id="6449:41089">
      {/* banner track */}
      <div className="carrusel-dots">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span key={dot} className={dot === activeDot ? 'is-active' : ''} />
        ))}
      </div>
    </section>
  );
}
```
</details>

### Discovery Header (`Organisms/Discovery Header`)
Structure (composed only from existing molecules):
- Status Bar
- Header
- Folder (expanded/collapsed)
- Input/Search (Empty)
- Plateu Home (state 3)

Sides/states:
- Left:
  - State 1 (`7333:70238`)
  - State 2 (`7333:70233`)
  - State 3 (`7333:70234`)
- Right:
  - State 1 (`7333:70235`)
  - State 2 (`7333:70236`)
  - State 3 (`7333:70237`)

Playground controls:
- `side`
- `state`
- `showNewItemChip` (affects `Left + State 1`)

<details>
<summary><strong>Show React snippet (Discovery Header composition)</strong></summary>

```tsx
export function DiscoveryHeader({
  side = 'Left',
  state = 'State 1',
  showNewItemChip = true,
}: {
  side?: 'Left' | 'Right';
  state?: 'State 1' | 'State 2' | 'State 3';
  showNewItemChip?: boolean;
}) {
  const cfg = discoveryConfig[side][state];
  return (
    <section className="discovery-header-organism" data-side={side} data-state={state}>
      <StatusBar />
      {cfg.header !== 'none' ? <AppHeader variant={cfg.header} /> : null}
      <Folder property1={cfg.folder} showNewItemChip={showNewItemChip} />
      <SearchInput state="empty" compact={cfg.searchCompact} />
      {cfg.plateu ? <Plateu property1="State=Home, Telco=No, Scrolling=Yes" /> : null}
    </section>
  );
}
```
</details>

### HomeCard (`Organisms/HomeCard`)
Variants:
- `Default`
- `With Photo`

Base container: `IqRGM`

<details>
<summary><strong>Show React snippet (HomeCard)</strong></summary>

```tsx
export function HomeCard({
  variant = 'Default',
  title = 'Solo por hoy',
}: {
  variant?: 'Default' | 'With Photo';
  title?: string;
}) {
  return (
    <section className={`homecard-organism ${variant === 'With Photo' ? 'homecard-organism-photo' : ''}`}>
      <header className="homecard-header"><h3 className="token-h6 homecard-title">{title}</h3></header>
      <div className={`homecard-content ${variant === 'With Photo' ? 'homecard-content-photo' : 'homecard-content-default'}`}>
        {/* grid or photo track */}
      </div>
      <footer className="homecard-footer"><button className="btn btn-primary btn-small">Ver más</button></footer>
    </section>
  );
}
```
</details>

### Promo Strip (`Organisms/Promo Strip`)
Variants:
- `Single` (`72353:23990`)
- `Double` (`72353:23953`)

Rules:
- Uses nested `Discount Ribbon (Wrap Small)` on each card.
- `Playground` controls heading and discount label.

<details>
<summary><strong>Show React snippet (Promo Strip)</strong></summary>

```tsx
export function PromoStrip({
  variant = 'Single',
  singleHeading = 'Tus compras online',
  doubleHeading = 'Todas estas 25% menos',
  discount = '25%',
}: {
  variant?: 'Single' | 'Double';
  singleHeading?: string;
  doubleHeading?: string;
  discount?: string;
}) {
  const cardsA = baseCards.map((c) => ({ ...c, ribbon: discount }));
  const cardsB = secondCards.map((c) => ({ ...c, ribbon: discount }));

  return (
    <div className="promo-strip-stack">
      <PromoStripBlock heading={variant === 'Double' ? doubleHeading : singleHeading} cards={cardsA} />
      {variant === 'Double' ? <PromoStripBlock cards={cardsB} compact /> : null}
    </div>
  );
}
```
</details>

### Summary Box (`Organisms/Summary Box`)
Pen: `6959:56843`

Dimensions in stories:
- `flow`: `products | giftCards | billPayments`
- `step`: `pdp | plp | cart | checkout`
- `pricing`: `saving | normal`
- toggles: `showAddButton`, `withVoucherify`
- dynamic fields: `exchangeRate`, `productLabel`, `productCount`

Special handling:
- in `checkout` and `billPayments` total label changes to `TOTAL`
- includes exchange strip + white card + CTA area

<details>
<summary><strong>Show React snippet (Summary Box API)</strong></summary>

```tsx
type SummaryFlow = 'products' | 'giftCards' | 'billPayments';
type SummaryStep = 'pdp' | 'plp' | 'cart' | 'checkout';

type SummaryBoxProps = {
  flow?: SummaryFlow;
  step?: SummaryStep;
  pricing?: 'saving' | 'normal';
  showAddButton?: boolean;
  withVoucherify?: boolean;
  exchangeRate?: string;
  productLabel?: string;
  productCount?: number;
};

export function SummaryBox(props: SummaryBoxProps) {
  const {
    flow = 'giftCards',
    step = 'cart',
    pricing = 'saving',
    showAddButton = true,
    withVoucherify = false,
    exchangeRate = 'Q 7.55',
    productLabel = 'Producto, Gift Card',
    productCount = 3,
  } = props;

  return (
    <section className="summary-box with-overlap" data-flow={flow} data-step={step}>
      <div className="summary-type-overlay">TIPO DE CAMBIO: {exchangeRate}</div>
      <div className="summary-card">{/* body rows + ctas based on flow/step/pricing */}</div>
    </section>
  );
}
```
</details>

---

## Show/Hide Code Best Practice

Recommended pattern for Docs/Playground pages:
- Keep code hidden by default to prioritize visual review.
- Use one snippet per variant API (not one massive file dump).
- Use semantic disclosure with `<details><summary>Show React snippet</summary>...</details>`.
- Keep snippet minimal but production-oriented (typed props + defaults + tokens/classes).

Reusable snippet wrapper:

```tsx
type CodeExampleProps = {
  title?: string;
  children: React.ReactNode;
};

export function CodeExample({ title = 'Show React snippet', children }: CodeExampleProps) {
  return (
    <details>
      <summary><strong>{title}</strong></summary>
      <pre><code>{children}</code></pre>
    </details>
  );
}
```
