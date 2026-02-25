# MARS Design System - Atomic Design Component Library v1.0.1

## Table of Contents
1. [Design Tokens (Foundation)](#design-tokens)
2. [Atoms](#atoms)
3. [Molecules](#molecules)
4. [Organisms](#organisms)
5. [Component Index](#component-index)

---

## Design Tokens

### Color Palette

#### Primary Colors
- **Primary Main**: `#552588` - Main brand color
- **Primary Light**: `#bc9edc` - Light variant
- **Primary Dark**: `#230741` - Dark variant
- **Primary Background**: `#8620f314` - Background tint
- **Primary Text**: `#000000de` - Primary text color

#### Secondary Colors
- **Secondary Main**: `#18afa5`
- **Secondary Light**: `#a8faf5`
- **Secondary Dark**: `#057a73`
- **Secondary Background**: `#20f3e514`
- **Secondary Text**: `#0000008a`

#### Accent & Utility Colors
- **Accent Color**: `#ffb400`
- **White**: `#ffffff`
- **Backdrop**: `#00000080`

#### Border Colors
- **Border Main**: `#0000003b`
- **Border Active**: `#410088`
- **Border Secondary**: `#20f3e580`
- **Divider**: `#0000001f`

#### State Colors

**Disabled States:**
- **Disable Main**: `#e0e0e0`
- **Disable Background**: `#0000001f`
- **Disable Text**: `#00000061`
- **Disable Selected**: `#00000014`
- **Disable Hover**: `#0000000a`
- **Disable Focus**: `#0000001f`

**Success:**
- **Success Icon**: `#4caf50`
- **Success Light**: `#7bc67e`
- **Success Dark**: `#3b873e`
- **Success Background**: `#edf7ed`
- **Success Text**: `#1e4620`

**Error:**
- **Error Icon**: `#f44336`
- **Error Light**: `#f88078`
- **Error Dark**: `#e31b0c`
- **Error Background**: `#feeceb`
- **Error Text**: `#621b16`

**Warning:**
- **Warning Icon**: `#ff9800`
- **Warning Light**: `#faab5c`
- **Warning Dark**: `#f57c00`
- **Warning Background**: `#fff5e0`
- **Warning Text**: `#734500`

**Info:**
- **Info Icon**: `#2196f3`
- **Info Light**: `#64b6f7`
- **Info Dark**: `#0b79d0`
- **Info Background**: `#e9f5fe`
- **Info Text**: `#0d3c61`

#### Other
- **Snackbar**: `#323232`
- **Knob Active**: `#fafafa`

### Typography Tokens
- **H1-H6**: Heading styles
- **body1**: Body text
- **subtitle1, subtitle2**: Subtitle styles
- **button, buttonLg, buttonSm**: Button text styles
- **caption**: Caption text
- **OVERLINE**: Uppercase labels
- **PLATEU**: Platform-specific text
- **productText**: Product descriptions
- **descriptionText**: Descriptions
- **price, price%, priceTag**: Price formatting
- **sumText, sumTotal**: Summary text
- **iconSm, iconMd, iconLg**: Icon sizes

### Icon Rules (Font Awesome 6 Pro)
- **Kit**: `https://kit.fontawesome.com/b5a8f622db.js`
- **Default icon style**: `fa-regular`
- **Solid usage**: `fa-solid` is reserved for the **active** icon in bottom navigation

#### Icon Size Tokens
- **Regular**
- `icon-large`: 48px / weight 300 / line-height 48px
- `icon-medium`: 24px / weight 300 / line-height 24px
- `icon-small`: 16px / weight 300 / line-height 16px
- `icon-xsmall`: 12px / weight 300 / line-height 12px
- **Solid**
- `icon-large-solid`: 48px / weight 900 / line-height 48px
- `icon-medium-solid`: 24px / weight 900 / line-height 24px
- `icon-small-solid`: 16px / weight 900 / line-height 16px
- `icon-xsmall-solid`: 12px / weight 900 / line-height 12px

---

## Latest Variant Updates

- **Molecules reclassified**: `Service Tiles`, `Promo Code`, `Headers`, and `Navigation` are documented as Molecules in the library.
- **Headers icon rule**: headers use `fa-light`; only `Header / Logged Out` keeps user icon as solid (`fa-solid fa-circle-user`).
- **Navigation icon rule**: active icon is `fa-solid`; non-active icons are `fa-regular`.
- **Promo Code / Entered**: clear icon (`fa-circle-xmark`) uses `fa-solid` with `icon-medium-solid`.
- **Summary Box**: in `checkout/payment` variants, label updated from `PAGAS` to `TOTAL`; other variants remain `PAGAS`.
- **Summary Box / crossed-out prices**: crossed-out values use `$Disable Text`; row label + regular/current price in those rows use `$Secondary Dark` (ej. `3 Productos`).
- **Widgets**: CTA added to `OFERTAS DEL DÍA` (`Comprar`) and `COMPARA TIPOS DE CAMBIO` (`Comparar`), aligned with `RECARGAS TIEMPO AIRE`.

---

## Atoms

### 1. Buttons

Buttons are the most fundamental interactive elements with multiple variants across three dimensions: **Type**, **Size**, and **State**.

#### Button Types

##### Primary Buttons
**Usage**: Main call-to-action buttons
**Component IDs**:
- Large: `C6tBo` (Default), `AQ2sd` (Icon), `Pc8pk` (Disabled)
- Medium: `dkm5S` (Default), `RUWiD` (Icon), `ecoVn` (Disabled)
- Small: `5Jb7s` (Default), `Vcveu` (Icon), `izVsr` (Disabled)

**Styling**:
- Fill: `$Primary Main (#552588)`
- Text: White
- Corner Radius: 20-44px (size dependent)
- Shadow: Multi-layer drop shadow effect
- Min width (no icon): Large `328px`, Medium `129px`, Small `84px`
- Min width (with icon): Large `328px`, Medium `167px`, Small `100px`

##### Secondary Buttons
**Usage**: Secondary actions, less emphasis
**Component IDs**:
- Large: `eTIc3` (Default), `Aimqt` (Icon), `bESQi` (Disabled)
- Medium: `WLCy3` (Default), `iYEgi` (Icon), `s9Kk0` (Disabled)
- Small: `Ve25H` (Default), `Mjdl6` (Icon), `A6gci` (Disabled)

**Styling**:
- Fill: `$White`
- Text: Primary color
- Corner Radius: 20-44px
- No shadow
- Disabled state: white fill + `$Disable Text`
- Min width (no icon): Large `328px`, Medium `129px`, Small `84px`
- Min width (with icon): Large `328px`, Medium `167px`, Small `100px`

##### Outlined Buttons
**Usage**: Tertiary actions, minimal emphasis
**Component IDs**:
- Large: `CG4TO` (Default), `nVicC` (Icon), `QaRKY` (Disabled)
- Medium: `4DRvJ` (Default), `9fjW4` (Icon), `P5PPg` (Disabled)
- Small: `TE00F` (Default), `yZZVs` (Icon), `cYmLO` (Disabled)

**Styling**:
- Fill: `$White`
- Stroke: `$Border Active` (1px)
- Text: Primary color
- Corner Radius: 20-44px
- Disabled state: white fill + `$Disable Selected` border + `$Disable Text`
- Min width (no icon): Large `328px`, Medium `129px`, Small `84px`
- Min width (with icon): Large `328px`, Medium `167px`, Small `100px`

#### Button Sizes
- **Large**: Height 41-49px, Padding 8-24px, Font size 24px
- **Medium**: Height ~33px, Padding 8-16px, Font size 17px
- **Small**: Height ~30px, Padding 4-8px, Font size 22px

#### Button States
- **Default**: Normal interactive state
- **Icon**: Includes icon (left or right)
- **Disabled**: Non-interactive state with reduced opacity

---

### 2. Input Fields

#### Text Input
**Component IDs**:
- Phone Empty: `FEiGu`
- Phone With Value: `XjC9T`

**Styling**:
- Corner Radius: 20px
- Height: 56px
- Padding: 0-16px
- Stroke: `$Border Main` (1px)
- Background: `$White`

**Features**:
- Floating label when value present
- Label animation
- Border color changes on focus

#### Search Input
**Component IDs**:
- Empty: `PGNyG`
- With Value: `xmKHs`

**Styling**:
- Corner Radius: 12px
- Height: 40px
- Padding: 0-16px
- Left icon: Search icon
- Right icon: Clear icon (when has value)

**Features**:
- Search icon prefix
- Clear button suffix
- Placeholder text

---

### 3. Dropdowns

#### Country Dropdown
**Component IDs**:
- Empty: `OVdKu`
- With Value: `FaPFl`

**Features**:
- Flag icon display
- Dropdown arrow icon
- Floating label
- Corner Radius: 20px
- Height: 56px

#### Province Dropdown
**Component IDs**:
- Empty: `1rSxD`
- With Value: `P0EWf`

**Features**:
- Dropdown arrow icon
- Floating label
- Corner Radius: 20px
- Height: 56px

---

### 4. Status Bar
**Component ID**: `vf35d`

**Specifications**:
- Height: 44px
- Width: 360px
- Background: `$White`
- Contains: Time, battery, signal indicators

---

### 5. Chips (Quantity Input)
**Component IDs**:
- Cart: `9fXxZ`
- cart/removable: `KIyIt`
- Add0 / Vales: `DsDmy`
- Quantity / Giftcards: `QtFxr`
- Add1 / Vales: `BEpku`
- Add2 / Vales: `AotiP`

**Cart Variant**:
- `Chips/Cart`: count + cart icon
- `Chips/cart/removable`: promo code chip + remove action (`x`)

**Quantity Input Border Update**:
- `Add0`, `Quantity`, `Add1`, and `Add2` use neutral border: `$Border Main`
- Border radius for all Quantity Input variants is now `16px`
- Heights: `Quantity/Gifcards` is `40px`; `Add1` and `Add2` are `40px`

**Token Usage**:
- Primary icons and numbers: `$Primary Main`
- Neutral container borders: `$Border Main`
- Error/removal icon: `$Error Dark`
- `Chips/cart/removable`: `$Secondary Background` + `$Secondary Main` text + `$Secondary Dark` border
- `Chips/cart/removable` close icon: `fa-solid fa-circle-xmark` with `icon-xsmall-solid` (12px, 900, line-height 12px), color `$Primary Main`

---

### 6. Discount Ribbon (Atom)
Reusable discount atom used inside strips and lists.

**Variants**:
- `Discount Ribbon / Wrap` (`Ta86S`)
- `Discount Ribbon / List` (`twV32`)

**Size**:
- Max width: `88px`
- Height: `40px` (Wrap)
- Height: `30px` (List)

**Anatomy**:
- `Wrap`: top-right notch (`6x6`) + body corner radius `[4,0,4,4]`
- `List`: no notch + body corner radius `4`

**Usage Rules**:
- `Wrap`: absolute positioning on giftcard cards
- `List`: only on product listing pages and cart

**Token Usage**:
- Background: `$Secondary Light`
- Text color: `$Secondary Dark`
- Text typography token: `price%`

---

## Molecules

> Updated scope in Atomic Design Library: this section now emphasizes `Service Tiles`, `Promo Code`, `Headers`, and `Navigation`.  
> `List / PLP` and `List / Cart` are documented under **Organisms**.

### 1. Form Fields with Labels
Input and dropdown components that include animated floating labels that move above the field when populated.

**Components**:
- Phone Input + Label
- Country Dropdown + Flag + Label
- Province Dropdown + Label
- Search Input + Icons

**Behavior**:
- Label floats on focus/value
- Icon indicators for state
- Validation states

---

### 2. Search Bar
**Component IDs**: `PGNyG`, `xmKHs`

**Composition**:
- Search icon (left)
- Text input field
- Clear button (right, conditional)

**States**:
- Empty with placeholder
- Active with value and clear button

---

### 3. Button Groups
Combinations of buttons for related actions, typically seen in forms and action bars.

---

### 4. Lists
Two list components added for reusable content blocks:

#### List / PLP (`dsvtw`)
- Product listing component (`360x422`)
- Inner content width `328px` with `16px` padding
- 3 vertical rows with divider between rows
- Each row anatomy: product image `100x100` (radius `16px`, border `$Border Main`) + text stack + right action chip (`Add0` `40x40` or `Add1` `90x40`, radius `16px`, border `$Border Main`)
- Product text token: Nunito Sans `14/600` + `$Primary Main`
- Price tag token: `16/900` + `$Secondary Dark`
- Regular price token: `13/400` + `$Disable Text`
- Uses `Discount Ribbon / List` below price in every row (`10% OFF` placeholder)
- Used on product listing pages (PLP)

#### List / Cart (`Om56O`)
- Cart list component (`307x436`) with corner radius `16px`
- Border: `$Border Main` (inside stroke)
- Inner padding: `16px`, with 3 vertical giftcard rows and divider between rows
- Each row anatomy: image `80x51` + text stack + right quantity chip (`Chips/Quantity Input / Quantity/Gifcards/Giftcards` `65x40`, radius `16px`, border `$Border Main`)
- Product text token: Nunito Sans `14/600` + `$Primary Main`
- Price tag token: `16/900` + `$Secondary Dark`
- Regular price token: `13/400` + `$Disable Text`
- Uses `Discount Ribbon / List` below price in every row (`10% OFF` placeholder)

#### Country Selector List
- Radio row list with optional circular flag icon
- Active/inactive/disabled row behavior
- Tokenized text and border colors

---

## Organisms

### 1. Navigation

#### Top Navigation Bar (Navbar)
**Component ID**: `MHKUc`

**Specifications**:
- Height: 56px
- Width: 360px (full width)
- Background: `$White`
- Border: Top stroke `$Border Main`

**Composition**:
- 5 navigation items
- Active state indicator (bottom border)
- Icons only (base component)
- Equal width distribution

**Navigation Items**:
- Home
- Categories
- Featured (with active state)
- Orders
- Profile

#### Bottom Nav / With Labels (Variant)
**Variant type**: Documentation/UI variant based on `MHKUc`

**Specifications**:
- Height: 56px
- Width: 360px (full width)
- Same structure and active indicator as base Navbar
- Label style: Nunito Sans, 10px

**Composition**:
- 5 navigation items
- `fa-regular` icon + text label per item
- Active nav item icon uses `fa-solid`
- Equal width distribution

**FA rule**:
- Use kit loader `https://kit.fontawesome.com/b5a8f622db.js`
- Use `fa-regular` for inactive icons
- Use `fa-solid` only for the active nav icon

---

### 2. Headers

#### Logged Header
**Component ID**: `WO8oM`

**Specifications**:
- Height: 56px
- Width: 360px
- Padding: 21px 16px
- Bottom border: 1px

**Composition**:
- Left: Logo (OKY)
- Center: Balance display
- Right: Action icon

#### Logout Header
**Component ID**: `HpR9Z`

**Specifications**:
- Same as Logged Header
- Different icon state on right

---

### 3. Macro Tiles (Full Size)

Category action tiles for primary services.

#### Available Tiles:

**Food** (`g0RAt`)
- Title: "Invitar a Comer"
- Image: invitar.png
- Size: 103x130px

**Money/Remittances** (`X1bOv`)
- Title: "Comparar Remesas"
- Image: Slice 2.png

**Mobile Topup** (`1Zzry`)
- Title: "Recargar el Móvil"
- Image: recargas.png

**Bill Payment** (`GY8MG`)
- Title: "Pagar Servicios"
- Image: servicios.png

**Supermarket** (`i6hZs`)
- Title: "Mandar el Super"
- Image: super-1.png

**Doctor/Health** (`98sOw`)
- Title: "Cuidar la Salud"
- Image: doctor-1.png

**Gifts** (`9GR0B`)
- Title: "Equipo su Hogar"
- Image: regalos-1.png

**Gas** (`oesZs`)
- Title: "Llenar el Tanque"
- Image: gas-1.png

**Home** (`2yJIx`)
- Title: "Mejorar el Hogar"
- Image: avadora-1.png

**Offers** (`Rvm1L`)
- Title: "Ver Ofertas"
- Image: image 3.png

**Styling**:
- Corner Radius: 12px
- Size: 103x130px
- Padding: 8px
- Shadow: 10.5px blur
- Stroke: `$Border Main` (1px)
- Background: `$White`

**Layout**:
- Vertical layout
- Image: 80x80px
- Title: 14px, font-weight 600
- Gap: 4px between image and title

---

### 4. Macro Half Tiles

Smaller category tiles for secondary services.

**Seasonal** (`AqHu9`)
- Title: "Navidad"
- Size: 103x85px
- Border: `$Accent Color`

**Topup** (`pEubm`)
- Title: "Recargas"
- Size: 103x85px

**Multi-Brand** (`fHlYu`)
- Title: "Multimarca"
- Size: 103x85px

**Styling**:
- Corner Radius: 12px
- Size: 103x85px
- Image: 55x55px
- Same shadow and stroke as full tiles

---

### 5. Widgets

Dashboard widgets displaying summarized information and quick actions.

#### Topups Widget
**Component ID**: `dvBFn`

**Size**: 218x130px
**Content**:
- Header: "RECARGAS TIEMPO AIRE"
- List item with icon and text
- Action button

#### Daily Offers Widget
**Component IDs**: `wnaYi`, `Eoc3A`

**Size**: 218x130px
**Content**:
- Header: "Ofertas del día" / "OFERTA DEL DÍA"
- Featured offer with image
- Description text
- Price/discount info

#### Remittances Widget
**Component ID**: `JhhAI`

**Size**: 218x130px
**Content**:
- Header: "COMPARA TIPOS DE CAMBIO"
- Exchange rate comparison
- Currency info

#### Bill Payment Widget
**Component ID**: `eCjrS`

**Size**: 218x130px
**Content**:
- Header: "ESTE MES DESDE PAGAR"
- Monthly bill summary
- Payment amount

**Common Widget Styling**:
- Corner Radius: 12px
- Shadow: 10.5px blur
- Padding: 8px
- Background: `$White`
- Border: `$Border Main` (1px)
- Gap: 4px between elements

---

### 6. Category Card (Expandable)
**Component ID**: `IqRGM`

**Specifications**:
- Size: 330x526px
- Corner Radius: 16px
- Padding: 4px 0px 16px 0px
- Shadow: 10.5px blur

**Composition**:
- Header section (52px)
- Scrollable content area (407px)
- "Ver más" button at bottom
- Gradient fade at bottom of scroll area

**Usage**: Display expandable lists of brands or categories with thumbnails

---

### 7. Carousel
**Component ID**: `62kJL`

**Specifications**:
- Promotional image carousel
- Image size: ~300x136px
- Corner Radius: 12px
- Horizontal scrolling
- Multiple promotional strips

**Content**:
- promo-strips1.png
- promo-strips2.png

---

### 8. Promotional Strips
**Component ID**: `VeEVO`

**Variants**:
- `Strips/Countdown/Offers` (`nf2yE`): timer + product cards + ribbon list below price
- `Strips/No Countdown/Giftcards` (`pTOSN`): giftcard cards + ribbon list below price

**Usage**: Promotional offers in card and list layouts
**Layout**: Full-width containers (horizontal card scroller or vertical list rows)
**Background**: White
**Ribbon Atom**:
- Use `List` on Countdown Offers and Giftcards (below price)
- Use `List` on product listing and cart rows
- Max width `88px` and height `30px` (List)
- Keep ribbon text on `price%` token

---

## Component Index

### By Category

#### **Atoms** (28 components)
- Buttons: 54 variants (Primary/Secondary/Outlined × Large/Medium/Small × Default/Left Icon/Right Icon × Active/Disabled)
- Input Fields: 4 variants
- Dropdowns: 4 variants
- Status Bar: 1
- Chips / Quantity Input: 6 variants
- Discount Ribbon: 2 variants (Wrap, List)

#### **Molecules** (15 components)
- Service Tiles: 13 components (10 Full + 3 Half)
- Promo Code: 2 variants (Empty, Entered)
- Headers: 5 variants (logged/cart states + page headers)
- Navigation: 2 variants (Icon Only, With Labels)

#### **Organisms** (30 components)
- Widgets: 5
- Summary Box: multi-flow matrix variants (products, giftCards, billPayments)
- Lists: 3 components (List / PLP, List / Cart, Country Selector List)
- Category Cards: 1
- Carousels: 1
- Promotional Strips: 2 variants

### Total Components: 73

---

## Component Naming Convention

The design system follows a hierarchical naming pattern:

```
Category/Type/Size/State
```

**Examples**:
- `Button/Primary/Large/Default`
- `Button/Outlined/Medium/Icon`
- `Macro/Tile/Food`
- `Widget/Daily Offers`
- `Input/Phone/Hasvalue`
- `Dropdown/Country/Empty`

---

## Usage Guidelines

### Button Selection
1. **Primary**: Use for main actions (Submit, Confirm, Buy)
2. **Secondary**: Use for alternative actions (Cancel, Back)
3. **Outlined**: Use for tertiary actions (Learn More, Details)

### Size Selection
- **Large**: Hero sections, important CTAs
- **Medium**: Standard forms, dialogs
- **Small**: Compact interfaces, mobile optimized

### Tile Usage
- **Full Tiles**: Main service categories on homepage
- **Half Tiles**: Secondary services, seasonal promotions
- **Widgets**: Dashboard summaries, quick access

### Color Application
- Primary color (#552588) for brand elements and CTAs
- Secondary color (#18afa5) for accents and highlights
- Accent color (#ffb400) for special promotions
- Maintain WCAG AA contrast ratios for accessibility

---

## Responsive Considerations

**Base Width**: 360px (mobile-first)
**Layout**: Vertical stack for mobile
**Spacing**: 8px grid system

### Component Scaling
- Buttons maintain fixed heights, width adapts
- Tiles maintain aspect ratios
- Widgets stack vertically on mobile
- Navigation remains fixed at bottom

---

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- Primary text on white: 14.8:1
- Secondary text on white: 4.5:1
- Disabled text on white: 3.1:1

### Touch Targets
Minimum 44x44px touch targets for all interactive elements

### Focus States
All interactive elements have visible focus indicators

### Labels
All form inputs include proper labels for screen readers

---

## File Reference

**Design File**: `DS-MARS2.pen`
**Theme**: MARS (Light)
**Last Updated**: 2026-02-18

---

## Quick Reference Tables

### Button Component Matrix

| Type | Size | State | Component ID |
|------|------|-------|--------------|
| Primary | Large | Default | C6tBo |
| Primary | Large | Icon | AQ2sd |
| Primary | Large | Disabled (Right Icon) | Pc8pk |
| Primary | Medium | Default | dkm5S |
| Primary | Medium | Icon | RUWiD |
| Primary | Medium | Disabled (Right Icon) | ecoVn |
| Primary | Small | Default | 5Jb7s |
| Primary | Small | Icon | Vcveu |
| Primary | Small | Disabled (Right Icon) | izVsr |
| Secondary | Large | Default | eTIc3 |
| Secondary | Large | Icon | Aimqt |
| Secondary | Large | Disabled (Right Icon) | bESQi |
| Secondary | Medium | Default | WLCy3 |
| Secondary | Medium | Icon | iYEgi |
| Secondary | Medium | Disabled (Right Icon) | s9Kk0 |
| Secondary | Small | Default | Ve25H |
| Secondary | Small | Icon | Mjdl6 |
| Secondary | Small | Disabled (Right Icon) | A6gci |
| Outlined | Large | Default | CG4TO |
| Outlined | Large | Icon | nVicC |
| Outlined | Large | Disabled (Right Icon) | QaRKY |
| Outlined | Medium | Default | 4DRvJ |
| Outlined | Medium | Icon | 9fjW4 |
| Outlined | Medium | Disabled (Right Icon) | P5PPg |
| Outlined | Small | Default | TE00F |
| Outlined | Small | Icon | yZZVs |
| Outlined | Small | Disabled (Right Icon) | cYmLO |

### Service Tiles Matrix

| Service | Tile Type | Title | Component ID |
|---------|-----------|-------|--------------|
| Food | Full | Invitar a Comer | g0RAt |
| Money | Full | Comparar Remesas | X1bOv |
| Mobile Topup | Full | Recargar el Móvil | 1Zzry |
| Bill Payment | Full | Pagar Servicios | GY8MG |
| Supermarket | Full | Mandar el Super | i6hZs |
| Doctor | Full | Cuidar la Salud | 98sOw |
| Gifts | Full | Equipo su Hogar | 9GR0B |
| Gas | Full | Llenar el Tanque | oesZs |
| Home | Full | Mejorar el Hogar | 2yJIx |
| Offers | Full | Ver Ofertas | Rvm1L |
| Seasonal | Half | Navidad | AqHu9 |
| Topup | Half | Recargas | pEubm |
| Multi-Brand | Half | Multimarca | fHlYu |

### Widget Types

| Widget | Purpose | Component ID |
|--------|---------|--------------|
| Topups | Mobile recharge quick access | dvBFn |
| Daily Offers | Featured daily deals | wnaYi, Eoc3A |
| Remittances | Exchange rate comparison | JhhAI |
| Bill Payment | Monthly bill summary | eCjrS |

---

**End of Component Library Documentation**
