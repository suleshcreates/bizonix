import { Boxes, Calculator, ShoppingBag, Store, Truck } from "lucide-react";
import Image from "next/image";

const nodes = [
  { label: "Procurement", icon: Truck, className: "compact-node-procurement" },
  {
    label: "Ecommerce",
    icon: ShoppingBag,
    className: "compact-node-ecommerce",
  },
  { label: "Inventory", icon: Boxes, className: "compact-node-inventory" },
  { label: "Retail POS", icon: Store, className: "compact-node-pos" },
  {
    label: "Accounting",
    icon: Calculator,
    className: "compact-node-accounting",
  },
  { label: "Franchise", icon: Store, className: "compact-node-franchise" },
] as const;

export function CompactOperatingEngine() {
  return (
    <div
      className="compact-engine"
      role="img"
      aria-label="Bizonix ERP connecting procurement, ecommerce, inventory, retail point of sale, accounting, and franchise operations."
    >
      <div className="compact-engine-label">
        <span>Bizonix operating engine</span>
        <span>One shared context</span>
      </div>

      <div className="compact-engine-stage">
        <span className="compact-engine-orbit compact-engine-orbit-one" />
        <span className="compact-engine-orbit compact-engine-orbit-two" />
        <svg viewBox="0 0 600 500" aria-hidden="true">
          <path d="M300 250C250 195 205 125 135 92" />
          <path d="M300 250C350 195 395 125 465 92" />
          <path d="M300 250C220 250 165 232 80 230" />
          <path d="M300 250C380 250 435 232 520 230" />
          <path d="M300 250C250 315 205 380 135 408" />
          <path d="M300 250C350 315 395 380 465 408" />
        </svg>

        {nodes.map((node, index) => (
          <div
            className={`compact-engine-node ${node.className}`}
            style={{ "--compact-index": index } as React.CSSProperties}
            key={node.label}
          >
            <span aria-hidden="true">
              <node.icon size={16} strokeWidth={1.9} />
            </span>
            <strong>{node.label}</strong>
          </div>
        ))}

        <div className="compact-engine-core">
          <span className="compact-core-layer compact-core-layer-back" />
          <span className="compact-core-layer compact-core-layer-middle" />
          <div className="compact-core-face">
            <Image src="/brand/icon.svg" alt="" width={38} height={38} />
            <span>
              <small>Shared operating core</small>
              <strong>Bizonix ERP</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
