import {
  ArrowRight,
  BarChart4,
  Bell,
  BookOpen,
  Check,
  IndianRupee,
  LayoutGrid,
  MapPin,
  Search,
  Settings,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Warehouse,
} from "lucide-react";
import type { CSSProperties, ComponentType } from "react";
import {
  invoiceLines,
  invoiceParty,
  invoiceTax,
} from "@/lib/content/features/gst-invoice";
import {
  transferCheckpoints,
  transferConsignment,
} from "@/lib/content/features/stock-transfer";
import {
  consoleKpis,
  consoleNav,
} from "@/lib/content/home/home-hero-console-data";
import styles from "@/components/pages/home/home.module.css";
import stock from "@/components/pages/home/home.module.css";

/**
 * Billing / Transfers / Finance faces of the hero product stage. Each renders
 * the same Bizonix console chrome as the inventory StockConsole and a body
 * built from approved demo data only — the GST tax invoice, transfer
 * consignment TRF-1184, and values already shown on the console KPIs.
 */

/** Window chrome with the state's module highlighted in the nav. */
function ChromeBar({ activeModule }: { activeModule: string }) {
  return (
    <div className={stock.stockConsole__chrome}>
      <div className={stock.stockConsole__brand}>
        <span className={stock.stockConsole__brandMark} aria-hidden="true">
          B
        </span>
        <div className={stock.stockConsole__brandText}>
          <strong>Bizonix</strong>
          <span>{activeModule}</span>
        </div>
      </div>

      <div className={stock.stockConsole__chromeNav}>
        {consoleNav.map((item) => (
          <span
            key={item}
            className={
              item === activeModule ? stock.stockConsole__chromeNavActive : undefined
            }
          >
            {item}
          </span>
        ))}
      </div>

      <div className={stock.stockConsole__chromeRight}>
        <span className={stock.stockConsole__chromeIconBtn} aria-hidden="true">
          <Search size={14} strokeWidth={2.2} />
        </span>
        <span className={stock.stockConsole__chromeIconBtn} aria-hidden="true">
          <Bell size={14} strokeWidth={2.2} />
          <i className={stock.stockConsole__bellBadge} />
        </span>
        <span className={stock.stockConsole__chromeIconBtn} aria-hidden="true">
          <Settings size={14} strokeWidth={2.2} />
        </span>
        <span className={stock.stockConsole__userAvatar} aria-hidden="true">
          A
        </span>
      </div>
    </div>
  );
}

/** Module rail on the left edge; `activeIndex` follows the state. */
function Rail({ activeIndex }: { activeIndex: number }) {
  const railIcons = [LayoutGrid, ShoppingBag, Truck, ShoppingCart, BarChart4];

  return (
    <div className={stock.stockConsole__rail}>
      {railIcons.map((Icon, index) => (
        <span
          key={index}
          className={`${stock.stockConsole__railItem}${
            index === activeIndex ? ` ${stock.stockConsole__railItemActive}` : ""
          }`}
        >
          <Icon size={16} strokeWidth={1.9} />
        </span>
      ))}
      <span className={stock.stockConsole__railSpacer} />
      <span className={stock.stockConsole__railItem}>
        <Settings2 size={16} strokeWidth={1.9} />
      </span>
    </div>
  );
}

/** KPI chip reusing the inventory card, driven by passed descriptors. */
function Stat({
  icon: Icon,
  tone,
  label,
  value,
  note,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  tone: "blue" | "teal" | "navy";
  label: string;
  value: string;
  note: string;
}) {
  const toneClass =
    tone === "teal"
      ? stock.stockConsole__kpiIconTeal
      : tone === "navy"
        ? stock.stockConsole__kpiIconNavy
        : "";

  return (
    <div className={stock.stockConsole__kpi}>
      <span className={`${stock.stockConsole__kpiIcon} ${toneClass}`}>
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className={stock.stockConsole__kpiText}>
        <span className={stock.stockConsole__kpiLabel}>{label}</span>
        <span className={stock.stockConsole__kpiValue}>{value}</span>
        <span className={stock.stockConsole__kpiNote}>{note}</span>
      </span>
    </div>
  );
}

function Toolbar({ search, tabs }: { search: string; tabs: [string, string] }) {
  return (
    <div className={stock.stockConsole__toolbar}>
      <span className={stock.stockConsole__search}>
        <Search size={13} strokeWidth={2.2} />
        {search}
      </span>
      <span className={stock.stockConsole__segmented}>
        <span className={stock.stockConsole__segmentedActive}>{tabs[0]}</span>
        <span>{tabs[1]}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ billing */

export function BillingScreen() {
  return (
    <div className={stock.stockConsole__console}>
      <ChromeBar activeModule="Billing" />

      <div className={stock.stockConsole__body}>
        <Rail activeIndex={2} />

        <div className={stock.stockConsole__canvas}>
          <div className={stock.stockConsole__kpiRow}>
            <Stat
              icon={IndianRupee}
              tone="blue"
              label="Taxable"
              value={invoiceTax[0].value}
              note="HSN-wise lines"
            />
            <Stat
              icon={BookOpen}
              tone="teal"
              label="CGST 6%"
              value={invoiceTax[1].value}
              note={invoiceParty.place}
            />
            <Stat
              icon={BookOpen}
              tone="navy"
              label="SGST 6%"
              value={invoiceTax[2].value}
              note={invoiceParty.supply}
            />
            <Stat
              icon={ShoppingCart}
              tone="blue"
              label="Invoice total"
              value={invoiceTax[3].value}
              note={invoiceParty.name}
            />
          </div>

          <Toolbar
            search="Search party, invoice or HSN"
            tabs={["Tax invoices", "Credit notes"]}
          />

          <div className={styles.consoleScreens__docSplit}>
            <div className={styles.consoleScreens__docLines}>
              <div className={styles.consoleScreens__docTableWrap}>
                <div className={`${stock.stockConsole__row} ${styles.consoleScreens__docRow} ${styles.consoleScreens__docHead}`}>
                  <span>HSN</span>
                  <span>Item</span>
                  <span className={stock.stockConsole__numeric}>Qty</span>
                  <span className={stock.stockConsole__numeric}>Rate</span>
                  <span className={stock.stockConsole__numeric}>Taxable</span>
                </div>
                {invoiceLines.map((line, index) => (
                  <div
                    key={line.item}
                    className={`${stock.stockConsole__row} ${styles.consoleScreens__docRow} ${styles.consoleScreens__docBodyRow}`}
                    style={{ "--r": index } as CSSProperties}
                  >
                    <span className={styles.consoleScreens__docHsn}>{line.hsn}</span>
                    <span className={styles.consoleScreens__docItem}>
                      <strong>{line.item}</strong>
                    </span>
                    <span className={`${styles.consoleScreens__docMoneyMuted} ${stock.stockConsole__numeric}`}>
                      {line.qty}
                    </span>
                    <span
                      className={`${styles.consoleScreens__docMoneyMuted} ${stock.stockConsole__numeric} ${styles.consoleScreens__docRateHide}`}
                    >
                      ₹{line.rate}
                    </span>
                    <span className={`${styles.consoleScreens__docMoney} ${stock.stockConsole__numeric}`}>
                      ₹{line.taxable}
                    </span>
                  </div>
                ))}
                <div className={stock.stockConsole__tableFade} />
              </div>
            </div>

            <div className={styles.consoleScreens__totals}>
              <div className={styles.consoleScreens__partyId}>
                <span className={styles.consoleScreens__partyName}>{invoiceParty.name}</span>
                <span className={styles.consoleScreens__partyMeta}>
                  GSTIN {invoiceParty.gstin}
                </span>
              </div>
              {invoiceTax.map((line, index) => (
                <div
                  key={line.label}
                  className={`${styles.consoleScreens__totalLine}${
                    index === invoiceTax.length - 1
                      ? ` ${styles.consoleScreens__totalLineGrand}`
                      : ""
                  }`}
                >
                  <span>{line.label}</span>
                  <span className={styles.consoleScreens__totalLineValue}>{line.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- transfers */

const CHECKPOINT_STATE_CLASS = {
  done: styles.consoleScreens__checkpointDone,
  current: styles.consoleScreens__checkpointCurrent,
  future: styles.consoleScreens__checkpointFuture,
} as const;

const CHECKPOINT_STATES = [
  "done",
  "done",
  "done",
  "current",
  "future",
  "future",
] as const;

export function TransfersScreen() {
  return (
    <div className={stock.stockConsole__console}>
      <ChromeBar activeModule="Transfers" />

      <div className={stock.stockConsole__body}>
        <Rail activeIndex={3} />

        <div className={stock.stockConsole__canvas}>
          <div className={stock.stockConsole__kpiRow}>
            <Stat
              icon={Truck}
              tone="blue"
              label="Consignment"
              value={transferConsignment.reference}
              note={`${transferConsignment.pieces} pieces`}
            />
            <Stat
              icon={Warehouse}
              tone="navy"
              label={transferConsignment.from.label}
              value={String(transferConsignment.from.after)}
              note={`Bhiwandi · was ${transferConsignment.from.before}`}
            />
            <Stat
              icon={MapPin}
              tone="teal"
              label={transferConsignment.to.label}
              value={String(transferConsignment.to.after)}
              note={`Kalyan · was ${transferConsignment.to.before}`}
            />
            <Stat
              icon={Check}
              tone="teal"
              label="Checkpoint"
              value="In transit"
              note="Owned, counted, on the books"
            />
          </div>

          <Toolbar
            search="Search transfer or outlet"
            tabs={["Consignments", "Requests"]}
          />

          <div className={styles.consoleScreens__transferHead}>
            <span className={styles.consoleScreens__transferRef}>
              {transferConsignment.reference}
            </span>
            <span className={styles.consoleScreens__transferRoute}>
              <strong>{transferConsignment.from.place}</strong>
              <ArrowRight size={12} strokeWidth={2.2} />
              <strong>{transferConsignment.to.place}</strong>
              · {transferConsignment.pieces} pieces
            </span>
          </div>

          <div className={styles.consoleScreens__tracker}>
            {transferCheckpoints.map((checkpoint, index) => (
              <div
                key={checkpoint.key}
                className={`${styles.consoleScreens__checkpoint} ${CHECKPOINT_STATE_CLASS[CHECKPOINT_STATES[index]]}`}
                style={{ "--r": index } as CSSProperties}
              >
                <span className={styles.consoleScreens__checkpointNode}>
                  {CHECKPOINT_STATES[index] === "done" ? (
                    <Check size={12} strokeWidth={3.2} />
                  ) : null}
                </span>
                <span className={styles.consoleScreens__checkpointLabel}>{checkpoint.short}</span>
                <span className={styles.consoleScreens__checkpointActor}>{checkpoint.actor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ finance */

/** Approved values only: the GST invoice, the posted transfer, console KPIs. */
const financeLedger = [
  {
    time: "09:14",
    voucher: "GRN received",
    detail: "Purchase booked to stock on arrival",
    value: `₹${consoleKpis[1].value} Cr`,
    status: "Posted",
    tone: "teal" as const,
  },
  {
    time: "11:08",
    voucher: "Tax invoice",
    detail: `${invoiceParty.name} · ${invoiceParty.place}`,
    value: invoiceTax[3].value,
    status: "Posted",
    tone: "blue" as const,
  },
  {
    time: "11:09",
    voucher: transferConsignment.reference,
    detail: `${transferConsignment.from.place} → ${transferConsignment.to.place} · entity books settled`,
    value: "CGST + SGST",
    status: "Settled",
    tone: "teal" as const,
  },
];

export function FinanceScreen() {
  return (
    <div className={stock.stockConsole__console}>
      <ChromeBar activeModule="Finance" />

      <div className={stock.stockConsole__body}>
        <Rail activeIndex={4} />

        <div className={stock.stockConsole__canvas}>
          <div className={stock.stockConsole__kpiRow}>
            <Stat
              icon={BarChart4}
              tone="blue"
              label="Stock on books"
              value={`₹${consoleKpis[1].value} Cr`}
              note={`${consoleKpis[3].value} locations`}
            />
            <Stat
              icon={IndianRupee}
              tone="navy"
              label="Taxable value"
              value={invoiceTax[0].value}
              note="HSN-wise lines"
            />
            <Stat
              icon={BookOpen}
              tone="teal"
              label="CGST + SGST"
              value="₹3,508.80"
              note="Split at billing"
            />
            <Stat
              icon={Check}
              tone="teal"
              label="Books updated"
              value="11:09"
              note="No journal typed twice"
            />
          </div>

          <Toolbar
            search="Search ledger or voucher"
            tabs={["Day book", "GST filing"]}
          />

          <div className={styles.consoleScreens__docTableWrap}>
            <div
              className={`${stock.stockConsole__row} ${styles.consoleScreens__ledgerRow} ${styles.consoleScreens__ledgerHead}`}
            >
              <span>Time</span>
              <span>Voucher</span>
              <span className={stock.stockConsole__numeric}>Books</span>
              <span />
            </div>
            {financeLedger.map((entry, index) => (
              <div
                key={entry.voucher}
                className={`${stock.stockConsole__row} ${styles.consoleScreens__ledgerRow} ${styles.consoleScreens__ledgerBodyRow}`}
                style={{ "--r": index } as CSSProperties}
              >
                <span className={styles.consoleScreens__ledgerTime}>{entry.time}</span>
                <span className={styles.consoleScreens__ledgerDetail}>
                  <strong>{entry.voucher}</strong>
                  <span className={stock.stockConsole__variant}>{entry.detail}</span>
                </span>
                <span className={`${styles.consoleScreens__ledgerAmount} ${stock.stockConsole__numeric}`}>
                  {entry.value}
                </span>
                <span
                  className={`${styles.consoleScreens__statusPill}${
                    entry.tone === "blue" ? ` ${styles.consoleScreens__statusPillBlue}` : ""
                  }`}
                >
                  <Check size={10} strokeWidth={3} />
                  {entry.status}
                </span>
              </div>
            ))}
            <div className={stock.stockConsole__tableFade} />
          </div>
        </div>
      </div>
    </div>
  );
}
