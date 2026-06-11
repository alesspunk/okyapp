export const FLAG_SIZES = {
  Small: {
    className: "flag-atom-small",
    label: "S",
    dimensions: "16x12px",
  },
  Medium: {
    className: "flag-atom-medium",
    label: "M",
    dimensions: "20x15px",
  },
  Large: {
    className: "flag-atom-large",
    label: "L",
    dimensions: "32x24px",
  },
};

export const COUNTRY_PRESETS = [
  { alpha2: "GT", alpha3: "GTM", numeric: "320", name: "Guatemala", aliases: ["GUA"] },
  { alpha2: "US", alpha3: "USA", numeric: "840", name: "Estados Unidos" },
  { alpha2: "MX", alpha3: "MEX", numeric: "484", name: "Mexico" },
  { alpha2: "SV", alpha3: "SLV", numeric: "222", name: "El Salvador" },
  { alpha2: "HN", alpha3: "HND", numeric: "340", name: "Honduras" },
  { alpha2: "NI", alpha3: "NIC", numeric: "558", name: "Nicaragua" },
  { alpha2: "CR", alpha3: "CRI", numeric: "188", name: "Costa Rica" },
  { alpha2: "PA", alpha3: "PAN", numeric: "591", name: "Panama" },
  { alpha2: "DO", alpha3: "DOM", numeric: "214", name: "Republica Dominicana" },
  { alpha2: "CO", alpha3: "COL", numeric: "170", name: "Colombia" },
  { alpha2: "VE", alpha3: "VEN", numeric: "862", name: "Venezuela" },
  { alpha2: "PE", alpha3: "PER", numeric: "604", name: "Peru" },
  { alpha2: "EC", alpha3: "ECU", numeric: "218", name: "Ecuador" },
  { alpha2: "BR", alpha3: "BRA", numeric: "076", name: "Brasil" },
  { alpha2: "AR", alpha3: "ARG", numeric: "032", name: "Argentina" },
  { alpha2: "CL", alpha3: "CHL", numeric: "152", name: "Chile" },
  { alpha2: "BO", alpha3: "BOL", numeric: "068", name: "Bolivia" },
  { alpha2: "UY", alpha3: "URY", numeric: "858", name: "Uruguay" },
  { alpha2: "PY", alpha3: "PRY", numeric: "600", name: "Paraguay" },
  { alpha2: "PR", alpha3: "PRI", numeric: "630", name: "Puerto Rico" },
  { alpha2: "CA", alpha3: "CAN", numeric: "124", name: "Canada" },
  { alpha2: "ES", alpha3: "ESP", numeric: "724", name: "Espana" },
];

export const SIZE_OPTIONS = Object.keys(FLAG_SIZES);

const COUNTRY_BY_CODE = COUNTRY_PRESETS.reduce((acc, country) => {
  const values = [country.alpha2, country.alpha3, country.numeric, ...(country.aliases || [])];
  values.forEach((value) => {
    acc[value] = country;
  });
  return acc;
}, {});

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function normalizeFlagCode(code = "GTM") {
  return String(code).trim().replace(/\s+/g, "").toUpperCase();
}

function getRegionName(alpha2) {
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(alpha2) || `Pais ${alpha2}`;
  } catch {
    return `Pais ${alpha2}`;
  }
}

export function resolveCountry(code = "GTM") {
  const normalizedCode = normalizeFlagCode(code);
  const preset = COUNTRY_BY_CODE[normalizedCode];

  if (preset) {
    return {
      ...preset,
      inputCode: normalizedCode,
      isMapped: true,
    };
  }

  if (/^[A-Z]{2}$/.test(normalizedCode)) {
    return {
      alpha2: normalizedCode,
      alpha3: "",
      numeric: "",
      name: getRegionName(normalizedCode),
      inputCode: normalizedCode,
      isMapped: false,
    };
  }

  return {
    alpha2: normalizedCode.slice(0, 2) || "GT",
    alpha3: normalizedCode,
    numeric: "",
    name: `Codigo ${normalizedCode || "sin definir"}`,
    inputCode: normalizedCode,
    isMapped: false,
    isMissing: true,
  };
}

export function resolveSize(size = "Large") {
  return FLAG_SIZES[size] || FLAG_SIZES.Large;
}

export function renderFlag(args = {}) {
  const country = resolveCountry(args.code);
  const size = resolveSize(args.size);
  const borderClass = args.hasBorder === false ? " is-borderless" : "";
  const missingClass = country.isMissing ? " is-missing" : "";
  const title = `${country.name} · ${country.alpha3 || country.alpha2}`;
  const src = `/flagpack/4x3/${country.alpha2.toLowerCase()}.svg`;

  return `
    <span
      class="flag-atom ${size.className}${borderClass}${missingClass}"
      role="img"
      aria-label="${escapeHtml(title)}"
      title="${escapeHtml(title)}"
      data-alpha-2="${escapeHtml(country.alpha2)}"
      data-alpha-3="${escapeHtml(country.alpha3)}"
      data-input-code="${escapeHtml(country.inputCode)}"
    >
      <img
        src="${escapeHtml(src)}"
        alt=""
        loading="lazy"
        onerror="this.closest('.flag-atom').classList.add('is-missing')"
      />
    </span>
  `;
}
