/**
 * Product-view data for the price ladder. Rates are illustrative product
 * screens, not published pricing.
 */
export type PriceRung = {
  key: string;
  label: string;
  note: string;
  value: number;
};

export type PurchaseSeries = {
  id: string;
  code: string;
  title: string;
  arrival: string;
  rungs: readonly PriceRung[];
};

export const priceCeiling = 3200;

export const purchaseSeries: readonly PurchaseSeries[] = [
  {
    id: "s-2451",
    code: "S-2451",
    title: "Anarkali kurta · festive",
    arrival: "GRN 18 Aug · 240 pieces",
    rungs: [
      {
        key: "purchase",
        label: "Purchase rate",
        note: "As billed by the supplier",
        value: 840,
      },
      {
        key: "landed",
        label: "Landed cost",
        note: "Freight and handling applied to the series",
        value: 905,
      },
      {
        key: "wholesale",
        label: "Wholesale rate",
        note: "Approved rate for distributor billing",
        value: 1180,
      },
      {
        key: "franchise",
        label: "Franchise rate",
        note: "What the outlet is transferred at",
        value: 1340,
      },
      {
        key: "retail",
        label: "Retail MRP",
        note: "Printed on the label, billed at the counter",
        value: 1999,
      },
    ],
  },
  {
    id: "s-2478",
    code: "S-2478",
    title: "Imitation jewellery set · gold tone",
    arrival: "GRN 26 Aug · 180 pieces",
    rungs: [
      {
        key: "purchase",
        label: "Purchase rate",
        note: "As billed by the supplier",
        value: 610,
      },
      {
        key: "landed",
        label: "Landed cost",
        note: "Freight and handling applied to the series",
        value: 662,
      },
      {
        key: "wholesale",
        label: "Wholesale rate",
        note: "Approved rate for distributor billing",
        value: 940,
      },
      {
        key: "franchise",
        label: "Franchise rate",
        note: "What the outlet is transferred at",
        value: 1075,
      },
      {
        key: "retail",
        label: "Retail MRP",
        note: "Printed on the label, billed at the counter",
        value: 1599,
      },
    ],
  },
  {
    id: "s-2492",
    code: "S-2492",
    title: "Cotton co-ord set · core",
    arrival: "GRN 02 Sep · 320 pieces",
    rungs: [
      {
        key: "purchase",
        label: "Purchase rate",
        note: "As billed by the supplier",
        value: 1120,
      },
      {
        key: "landed",
        label: "Landed cost",
        note: "Freight and handling applied to the series",
        value: 1198,
      },
      {
        key: "wholesale",
        label: "Wholesale rate",
        note: "Approved rate for distributor billing",
        value: 1560,
      },
      {
        key: "franchise",
        label: "Franchise rate",
        note: "What the outlet is transferred at",
        value: 1740,
      },
      {
        key: "retail",
        label: "Retail MRP",
        note: "Printed on the label, billed at the counter",
        value: 2499,
      },
    ],
  },
];

export const disciplineRules = [
  "The counter bills from the series the piece arrived on, not from a remembered rate.",
  "A discount below the approved floor needs a role that is allowed to give it.",
  "Franchise outlets see their own rate — never the wholesale sheet behind it.",
] as const;
