// Marketing-only local data for the product ecosystem visual. It is not
// connected to customer, operational, or production data.
export const operatingEnvironments = [
  { number: "01", label: "Wholesale HQ", title: "Know where stock is headed.", body: "Allocate, protect and move inventory with full network visibility.", image: "/product/ecosystem/wholesale.png", tone: "wholesale" },
  { number: "02", label: "Company retail / POS", title: "Keep every counter moving.", body: "Transact, reconcile and close the counter without slowing store operations.", image: "/product/ecosystem/retail-pos.png", tone: "retail" },
  { number: "03", label: "Franchise outlets", title: "Give partners autonomy.", body: "Let every outlet replenish and sell inside the guardrails you control.", image: "/product/ecosystem/franchise.png", tone: "franchise" },
] as const;

export const ecosystemProofs = [
  ["Same Piece Identity", "Track the same item across every step."],
  ["Entity-Aware Movement", "Every movement is linked to the right entity."],
  ["Nothing is Re-entered", "Data flows automatically without duplicate entry."],
  ["Real-time Visibility", "Complete transparency at every step."],
] as const;
