import { ArrowRight, Check, ChevronDown, IndianRupee } from "lucide-react";
import type { CSSProperties } from "react";
import type { ModuleScreen } from "@/lib/content/modules/module-hero-screens";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The seven shapes a module hero screen can take.
 *
 * Every one of them sits inside the same frame and uses the same primitives —
 * metric tiles, hairline rules, status pills, mono fields — so nine heroes
 * read as one application. What changes is the SHAPE of the surface, because
 * a ledger genuinely does not look like a work board and a counter does not
 * look like a network map.
 *
 * `active` is the row/card the live tick is currently resting on. It is passed
 * in rather than computed here so the whole hero shares one heartbeat.
 */

type ScreenProps = { data: ModuleScreen; active: number };

/* ------------------------------------------------------------- register */

function RegisterScreen({ data, active }: ScreenProps) {
  if (data.shape !== "register") return null;

  return (
    <div className={styles.screens__table}>
      <div className={`${styles.screens__row} ${styles.screens__rowHead}`}>
        {data.columns.map((column, index) => (
          <span key={column} data-col={index}>
            {column}
          </span>
        ))}
      </div>

      {data.rows.map((row, index) => (
        <div
          key={row.id}
          className={styles.screens__row}
          data-on={index === active % data.rows.length}
          style={{ "--i": index } as CSSProperties}
        >
          {row.cells.map((cell, cellIndex) => (
            <span key={cellIndex} data-col={cellIndex}>
              {cell}
            </span>
          ))}
          <span data-col={row.cells.length}>
            <span className={styles.screens__pill} data-tone={row.tone}>
              {row.state}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- ledger */

function LedgerScreen({ data, active }: ScreenProps) {
  if (data.shape !== "ledger") return null;

  return (
    <div className={styles.screens__ledger}>
      <div className={styles.screens__ledgerHead}>
        <span className={styles.screens__mono}>{data.entry.ref}</span>
        <span className={styles.screens__ledgerSource}>{data.entry.source}</span>
        <span className={styles.screens__ledgerDate}>{data.entry.date}</span>
      </div>

      <div className={`${styles.screens__ledgerRow} ${styles.screens__ledgerRowHead}`}>
        <span>Account</span>
        <span className={styles.screens__num}>Debit</span>
        <span className={styles.screens__num}>Credit</span>
      </div>

      {data.lines.map((line, index) => (
        <div
          key={line.account}
          className={styles.screens__ledgerRow}
          data-on={index === active % data.lines.length}
          style={{ "--i": index } as CSSProperties}
        >
          <span className={styles.screens__ledgerAccount}>
            <strong>{line.account}</strong>
            <em>{line.note}</em>
          </span>
          <span className={styles.screens__num} data-empty={line.debit === "—"}>
            {line.debit}
          </span>
          <span className={styles.screens__num} data-empty={line.credit === "—"}>
            {line.credit}
          </span>
        </div>
      ))}

      <div className={styles.screens__ledgerBalance}>
        <Check size={13} strokeWidth={3} aria-hidden="true" />
        {data.balance.label}
        <strong>{data.balance.value}</strong>
        <span className={styles.screens__pill} data-tone="ok">
          {data.balance.state}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- board */

function BoardScreen({ data, active }: ScreenProps) {
  if (data.shape !== "board") return null;

  return (
    <div className={styles.screens__board}>
      {data.lanes.map((lane, laneIndex) => (
        <div key={lane.title} className={styles.screens__lane}>
          <div className={styles.screens__laneHead}>
            <span className={styles.screens__laneDot} data-tone={lane.tone} />
            {lane.title}
            <em>{lane.count}</em>
          </div>

          {lane.cards.map((card, cardIndex) => (
            <div
              key={card.id}
              className={styles.screens__laneCard}
              data-on={
                laneIndex === active % data.lanes.length && cardIndex === 0
              }
              style={{ "--i": laneIndex * 2 + cardIndex } as CSSProperties}
            >
              <span className={styles.screens__laneRef}>{card.title}</span>
              <span className={styles.screens__laneMeta}>{card.meta}</span>
              <span className={styles.screens__laneValue}>{card.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- network */

function NetworkScreen({ data, active }: ScreenProps) {
  if (data.shape !== "network") return null;

  return (
    <div className={styles.screens__network}>
      <div className={styles.screens__hub}>
        <span className={styles.screens__hubMark}>HQ</span>
        <span className={styles.screens__hubText}>
          <strong>{data.hub.label}</strong>
          <em>
            {data.hub.place} · {data.hub.note}
          </em>
        </span>
        <span className={styles.screens__transfer}>
          <span className={styles.screens__mono}>{data.transfer.ref}</span>
          <span className={styles.screens__transferRoute} aria-hidden="true">
            {data.transfer.from}
            <i className={styles.screens__transferTrack}>
              <b />
            </i>
            {data.transfer.to}
          </span>
        </span>
      </div>

      <div className={styles.screens__outlets}>
        {data.outlets.map((outlet, index) => (
          <div
            key={outlet.name}
            className={styles.screens__outlet}
            data-on={index === active % data.outlets.length}
            style={{ "--i": index } as CSSProperties}
          >
            <span className={styles.screens__outletName}>{outlet.name}</span>
            <span className={styles.screens__outletPlace}>{outlet.place}</span>
            <span className={styles.screens__outletFoot}>
              <span className={styles.screens__pill} data-tone={outlet.tone}>
                {outlet.state}
              </span>
              <em>{outlet.value}</em>
            </span>
          </div>
        ))}
      </div>

      <p className={styles.screens__networkNote}>{data.transfer.note}</p>
    </div>
  );
}

/* -------------------------------------------------------------- counter */

function CounterScreen({ data, active }: ScreenProps) {
  if (data.shape !== "counter") return null;

  return (
    <div className={styles.screens__counter}>
      <div className={styles.screens__counterHead}>
        <span className={styles.screens__counterBadge}>2</span>
        <span className={styles.screens__counterText}>
          <strong>{data.session.counter}</strong>
          <em>
            {data.session.operator} · since {data.session.opened}
          </em>
        </span>
        <span className={styles.screens__counterBill}>
          <span className={styles.screens__mono}>{data.bill.ref}</span>
          <em>
            {data.bill.customer} · {data.bill.time}
          </em>
        </span>
      </div>

      <div className={styles.screens__lines}>
        {data.lines.map((line, index) => (
          <div
            key={line.item}
            className={styles.screens__line}
            data-on={index === active % data.lines.length}
            style={{ "--i": index } as CSSProperties}
          >
            <span className={styles.screens__lineItem}>
              <strong>{line.item}</strong>
              <em>{line.meta}</em>
            </span>
            <span className={styles.screens__lineQty}>×{line.qty}</span>
            <span className={styles.screens__lineAmount}>{line.amount}</span>
          </div>
        ))}
      </div>

      <div className={styles.screens__totals}>
        {data.totals.map((total) => (
          <div
            key={total.label}
            className={total.strong ? styles.screens__totalStrong : undefined}
          >
            <span>{total.label}</span>
            <span>{total.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.screens__payment}>
        <IndianRupee size={13} strokeWidth={2.4} aria-hidden="true" />
        {data.payment.method}
        <span className={styles.screens__pill} data-tone="ok">
          {data.payment.state}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- pipeline */

function PipelineScreen({ data, active }: ScreenProps) {
  if (data.shape !== "pipeline") return null;

  return (
    <div className={styles.screens__pipeline}>
      <div className={styles.screens__orderHead}>
        <span className={styles.screens__orderRef}>
          <span className={styles.screens__mono}>{data.order.ref}</span>
          <em>{data.order.channel}</em>
        </span>
        <span className={styles.screens__orderCustomer}>{data.order.customer}</span>
        <span className={styles.screens__orderValue}>{data.order.value}</span>
      </div>

      <ol className={styles.screens__stages}>
        {data.stages.map((stage, index) => (
          <li
            key={stage.label}
            data-state={stage.state}
            data-on={index === active % data.stages.length}
            style={{ "--i": index } as CSSProperties}
          >
            <i aria-hidden="true" />
            <span className={styles.screens__stageLabel}>{stage.label}</span>
            <span className={styles.screens__stageMeta}>{stage.meta}</span>
          </li>
        ))}
      </ol>

      <div className={styles.screens__stock}>
        {data.stock.map((entry) => (
          <div key={entry.label}>
            <span>{entry.label}</span>
            <strong>{entry.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- insight */

function InsightScreen({ data, active }: ScreenProps) {
  if (data.shape !== "insight") return null;

  const max = Math.max(...data.trend);
  const step = 100 / (data.trend.length - 1);
  const points = data.trend.map(
    (value, index) => `${(index * step).toFixed(1)},${(46 - (value / max) * 40).toFixed(1)}`,
  );
  const line = `M${points.join(" L")}`;
  const area = `${line} L100,46 L0,46 Z`;

  return (
    <div className={styles.screens__insight}>
      <div className={styles.screens__chart}>
        <div className={styles.screens__chartHead}>
          <span>{data.trendLabel}</span>
          <em>{data.trendRange}</em>
        </div>
        <svg viewBox="0 0 100 46" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="bz-trend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.screens__chartArea} d={area} fill="url(#bz-trend)" />
          <path className={styles.screens__chartLine} d={line} />
        </svg>
      </div>

      <ul className={styles.screens__breakdown}>
        {data.breakdown.map((entry, index) => (
          <li
            key={entry.label}
            data-on={index === active % data.breakdown.length}
            style={
              { "--share": `${entry.share}%`, "--i": index } as CSSProperties
            }
          >
            <span className={styles.screens__breakdownLabel}>{entry.label}</span>
            <span className={styles.screens__breakdownTrack} aria-hidden="true">
              <i />
            </span>
            <span className={styles.screens__breakdownValue}>{entry.value}</span>
            <ArrowRight
              className={styles.screens__breakdownArrow}
              size={12}
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------- registry */

const registry: Record<ModuleScreen["shape"], (props: ScreenProps) => React.JSX.Element | null> = {
  register: RegisterScreen,
  ledger: LedgerScreen,
  board: BoardScreen,
  network: NetworkScreen,
  counter: CounterScreen,
  pipeline: PipelineScreen,
  insight: InsightScreen,
};

export function ModuleScreenBody({ data, active }: ScreenProps) {
  const Screen = registry[data.shape];
  return <Screen data={data} active={active} />;
}

export { ChevronDown };
