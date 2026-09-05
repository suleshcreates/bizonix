/** Product-view data for the transfer route and its consignment ledger. */
export const transferConsignment = {
  reference: "TRF-1184",
  pieces: 48,
  from: { label: "HQ warehouse", place: "Bhiwandi", before: 1284, after: 1236 },
  to: { label: "Franchise outlet", place: "Kalyan", before: 312, after: 360 },
} as const;

/** `short` labels the dot on the rail; `label` is what the readout announces. */
export const transferCheckpoints = [
  {
    key: "requested",
    label: "Requested",
    short: "Requested",
    actor: "Outlet",
    body: "The outlet raises a request against what it can actually sell, not a guess from HQ.",
  },
  {
    key: "approved",
    short: "Approved",
    label: "Approved",
    actor: "HQ",
    body: "HQ approves at the franchise rate the series carries. Quantity and value are fixed here.",
  },
  {
    key: "dispatched",
    short: "Dispatched",
    label: "Dispatched",
    actor: "Warehouse",
    body: "Pieces are scanned out. HQ stock drops the moment the consignment leaves, not a week later.",
  },
  {
    key: "transit",
    short: "In transit",
    label: "In transit",
    actor: "Both",
    body: "The consignment sits in a visible in-transit position — owned, counted and on the books.",
  },
  {
    key: "received",
    short: "Received",
    label: "Received",
    actor: "Outlet",
    body: "Receiving scans each piece. A short receipt shows as a variance against the dispatch, by piece.",
  },
  {
    key: "posted",
    short: "Posted",
    label: "Books updated",
    actor: "System",
    body: "Entity books settle on their own — no journal typed twice, no month-end reconciliation call.",
  },
] as const;
