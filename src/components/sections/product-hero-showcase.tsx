import { Activity, ArrowUpRight, Layers3 } from "lucide-react";
import styles from "./product-hero-showcase.module.css";

export function ProductHeroShowcase() {
  return (
    <section className={styles.showcase} aria-label="Illustrative Bizonix sales overview">
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <div className={styles.brand}><span>B</span><strong>Bizonix</strong><small>OPERATING VIEW</small></div>
          <div className={styles.live}><i />Current period</div>
        </header>
        <div className={styles.body}>
          <div className={styles.overview}>
            <div><span>Network performance</span><h2>One business. <em>In motion.</em></h2></div>
            <button type="button">View report <ArrowUpRight size={14} /></button>
          </div>
          <div className={styles.kpis}>
            <div><small>Total sales</small><strong>₹1,84,200</strong><span>Across connected channels</span></div>
            <div><small>Orders</small><strong>96</strong><span>Processed this period</span></div>
            <div><small>Avg ticket</small><strong>₹1,919</strong><span>Per completed order</span></div>
            <div><small>Active channels</small><strong>3</strong><span>Wholesale · Retail · Franchise</span></div>
          </div>
          <div className={styles.analytics}>
            <div className={styles.chartCard}>
              <header><span><Activity size={14} />Sales movement</span><small>Current period</small></header>
              <svg viewBox="0 0 640 190" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="bizonix-hero-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6bff" stopOpacity=".28"/><stop offset="1" stopColor="#2f6bff" stopOpacity="0"/></linearGradient></defs>
                <path className={styles.grid} d="M0 35H640M0 92H640M0 150H640" />
                <path d="M0 150L58 134L116 140L174 105L232 116L290 82L348 94L406 55L464 68L522 39L580 53L640 25L640 190L0 190Z" fill="url(#bizonix-hero-area)" />
                <path className={styles.line} d="M0 150L58 134L116 140L174 105L232 116L290 82L348 94L406 55L464 68L522 39L580 53L640 25" />
              </svg>
              <footer><span>Start</span><span>Now</span></footer>
            </div>
            <div className={styles.mixCard}>
              <header><Layers3 size={15} /><span>Channel mix</span></header>
              <div className={styles.mixBars}>
                <p><span>Wholesale</span><i><b style={{ width: "46%" }} /></i><strong>46%</strong></p>
                <p><span>Retail</span><i><b style={{ width: "33%" }} /></i><strong>33%</strong></p>
                <p><span>Franchise</span><i><b style={{ width: "21%" }} /></i><strong>21%</strong></p>
              </div>
            </div>
          </div>
          <div className={styles.activitySection}>
            <header><span>Recent activity</span><small>Entity movement</small></header>
            <div className={styles.activityTable} role="table" aria-label="Recent business activity">
              <div role="row" className={styles.tableHead}><span role="columnheader">Entity</span><span role="columnheader">Movement</span><span role="columnheader">Status</span></div>
              <div role="row"><span role="cell">Branch 02</span><span role="cell">Stock transfer</span><b role="cell">Synced</b></div>
              <div role="row"><span role="cell">Franchise 04</span><span role="cell">Order placed</span><b role="cell">Synced</b></div>
              <div role="row"><span role="cell">HQ</span><span role="cell">Ledger posted</span><b role="cell">Synced</b></div>
              <div role="row"><span role="cell">Retail North</span><span role="cell">Price update</span><b role="cell">Synced</b></div>
            </div>
          </div>
          <footer className={styles.status}><i />All systems in sync <span>Data refreshed across every active channel</span></footer>
        </div>
      </div>
    </section>
  );
}
