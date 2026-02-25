/**
 * Quantity Input — DS-MARS v2 (updated)
 * 4 reusable components. Icons use Material Icons Outlined to match DS-MARS2.pen.
 *
 * DsDmy  — Add0     · initial, single + button
 * BEpku  — Add1     · qty 1, can only add more
 * AotiP  — Add2     · qty ≥2, decrease or increase
 * OWd3Y  — Giftcard · fixed qty, can delete
 */

/* ── chip helpers ────────────────────────────────────── */
function chipAdd0() {
  return `<span class="chip-ds chip-ds-add0 chip-ds-shadow">
    <span class="material-icons-outlined" style="font-size:20px">add</span>
  </span>`;
}

function chipAdd1(qty) {
  return `<span class="chip-ds chip-ds-add1 chip-ds-shadow" style="width:auto">
    <span style="width:16px;flex-shrink:0"></span>
    <span class="chip-ds-number">${qty}</span>
    <span class="material-icons-outlined" style="font-size:16px">add</span>
  </span>`;
}

function chipAdd2(qty) {
  return `<span class="chip-ds chip-ds-add2 chip-ds-shadow" style="width:auto">
    <span class="material-icons-outlined" style="font-size:16px">remove</span>
    <span class="chip-ds-number">${qty}</span>
    <span class="material-icons-outlined" style="font-size:16px">add</span>
  </span>`;
}

function chipGiftcard(qty) {
  return `<span class="chip-ds chip-ds-qty chip-ds-shadow" style="width:auto;padding:8px 16px">
    <span class="material-icons-outlined" style="font-size:16px;color:var(--error-main,#f44336)">delete</span>
    <span class="chip-ds-number">${qty}</span>
  </span>`;
}

/* ── story config ─────────────────────────────────────── */
export default {
  title: "Molecules/Quantity Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Quantity Input — 4 states from DS-MARS2.pen. " +
          "Icons: Material Icons Outlined (matches .pen source of truth). " +
          "Add0 = first add; Add1 = qty 1, add-only; Add2 = qty ≥2, both directions; Giftcard = fixed qty with delete.",
      },
    },
  },
};

/* ── Playground ───────────────────────────────────────── */
export const Playground = {
  name: "Playground",
  args: {
    state: "Add0",
    quantity: 1,
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["Add0", "Add1", "Add2", "Giftcard"],
      labels: {
        Add0:     "Add0 · DsDmy",
        Add1:     "Add1 · BEpku",
        Add2:     "Add2 · AotiP",
        Giftcard: "Giftcard · OWd3Y",
      },
    },
    quantity: { control: { type: "number", min: 1, max: 99 } },
  },
  render: ({ state, quantity }) => {
    const penIds = {
      Add0:     "DsDmy",
      Add1:     "BEpku",
      Add2:     "AotiP",
      Giftcard: "OWd3Y",
    };
    const chips = {
      Add0:     () => chipAdd0(),
      Add1:     () => chipAdd1(quantity),
      Add2:     () => chipAdd2(quantity),
      Giftcard: () => chipGiftcard(quantity),
    };
    return `
      <div class="mars-story">
        <div class="mars-label">
          Chips/Quantity Input / ${state} · ID .pen: ${penIds[state]}
        </div>
        <div style="padding:24px 0">
          ${chips[state]()}
        </div>
      </div>`;
  },
};

/* ── All States — Reference ───────────────────────────── */
export const AllStates = {
  name: "All States — Reference",
  render: () => {
    const rows = [
      {
        label: "Add0",
        sub: "Initial · tap to add",
        penId: "DsDmy",
        chip: chipAdd0(),
        note: "40×40 · cornerRadius 12",
      },
      {
        label: "Add1",
        sub: "Qty 1 · can only increase",
        penId: "BEpku",
        chip: chipAdd1(1),
        note: "90px pill · left slot empty",
      },
      {
        label: "Add2",
        sub: "Qty ≥2 · decrease or increase",
        penId: "AotiP",
        chip: chipAdd2(2),
        note: "90px pill · remove | qty | add",
      },
      {
        label: "Giftcard",
        sub: "Fixed qty · delete only",
        penId: "OWd3Y",
        chip: chipGiftcard(1),
        note: "65px pill · delete (red) | qty",
      },
    ];

    return `
      <div class="mars-story">
        <h3 style="margin:0 0 4px;color:var(--primary-main)">Quantity Input — All States</h3>
        <p class="mars-subtitle">4 reusable components · icons: Material Icons Outlined</p>
        <table class="story-table" style="margin-top:8px">
          <thead>
            <tr>
              <th>State</th>
              <th>Preview</th>
              <th>ID .pen</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td>
                  <strong style="color:var(--primary-main)">${r.label}</strong>
                  <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${r.sub}</div>
                </td>
                <td style="padding:12px 8px">
                  <div style="display:flex;align-items:center;min-height:48px">${r.chip}</div>
                </td>
                <td><code>${r.penId}</code></td>
                <td style="font-size:12px;color:var(--text-secondary)">${r.note}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  },
};
