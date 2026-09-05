"use client";

import { useMemo, useState } from "react";
import type { VariantMatrix as MatrixData } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

/*
 * The argument the whole page rests on: a single stock number is an average
 * across a grid, and averages are exactly what an apparel team cannot sell
 * from. Switching location re-reads the same style the way the floor does.
 */

type Cell = { qty: number; state: "empty" | "low" | "ok" };

function buildGrid(matrix: MatrixData, locationId: string): Cell[][] {
  return matrix.colourways.map((colourway) =>
    matrix.sizes.map((_, index) => {
      const qty =
        locationId === "all"
          ? Object.values(colourway.stock).reduce(
              (total, row) => total + (row[index] ?? 0),
              0,
            )
          : (colourway.stock[locationId]?.[index] ?? 0);
      return {
        qty,
        state: qty === 0 ? "empty" : qty <= matrix.lowAt ? "low" : "ok",
      };
    }),
  );
}

export function VariantMatrix({ matrix }: { matrix: MatrixData }) {
  const [locationId, setLocationId] = useState(matrix.locations[0].id);
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

  const grid = useMemo(
    () => buildGrid(matrix, locationId),
    [matrix, locationId],
  );

  const stats = useMemo(() => {
    const cells = grid.flat();
    const units = cells.reduce((total, cell) => total + cell.qty, 0);
    return {
      units,
      cells: cells.length,
      empty: cells.filter((cell) => cell.state === "empty").length,
      low: cells.filter((cell) => cell.state === "low").length,
      /* Scales the fill so the busiest cell reads as full depth at every
         location — otherwise switching to a small outlet flattens the grid. */
      peak: Math.max(1, ...cells.map((cell) => cell.qty)),
    };
  }, [grid]);

  const location =
    matrix.locations.find((item) => item.id === locationId) ??
    matrix.locations[0];

  return (
    <section
      className={styles.industryDetailPage__variants}
      id="variants"
      aria-labelledby="variants-title"
    >
      <div className={styles.industryDetailPage__shell}>
        <div className={styles.industryDetailPage__variantsHead}>
          <div>
            <p className={styles.industryDetailPage__eyebrow}>
              <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />
              One style, thirty answers
            </p>
            <h2 id="variants-title">
              <span className={styles.industryDetailPage__variantsCount}>
                {stats.units.toLocaleString("en-IN")} units
              </span>{" "}
              in stock, and {stats.empty > 0 ? stats.empty : "no"} variant
              {stats.empty === 1 ? "" : "s"} you cannot sell.
            </h2>
            <p className={styles.industryDetailPage__variantsLede}>
              Every apparel style is a grid, not a number. Bizonix holds stock
              at the cell — this colour, this size, this location — so the gaps
              are visible before a customer finds them.
            </p>
          </div>

          <div
            className={styles.industryDetailPage__locationTabs}
            role="tablist"
            aria-label="Stock location"
          >
            {matrix.locations.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`loc-${item.id}`}
                aria-selected={item.id === locationId}
                aria-controls="variant-grid"
                className={styles.industryDetailPage__locationTab}
                onClick={() => setLocationId(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.industryDetailPage__matrixCard}>
          <div
            className={styles.industryDetailPage__matrixScroll}
            id="variant-grid"
            role="tabpanel"
            aria-labelledby={`loc-${location.id}`}
            tabIndex={0}
          >
            <table className={styles.industryDetailPage__matrix}>
              <caption className={styles.industryDetailPage__matrixCaption}>
                {matrix.style} — units on hand at {location.label.toLowerCase()}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={styles.industryDetailPage__matrixCorner}>
                    <span className={styles.industryDetailPage__srOnly}>Colourway</span>
                  </th>
                  {matrix.sizes.map((size, col) => (
                    <th
                      key={size}
                      scope="col"
                      data-hot={hover?.col === col ? "true" : undefined}
                    >
                      {size}
                    </th>
                  ))}
                  <th scope="col" className={styles.industryDetailPage__matrixTotalHead}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrix.colourways.map((colourway, row) => {
                  const rowTotal = grid[row].reduce(
                    (total, cell) => total + cell.qty,
                    0,
                  );
                  return (
                    <tr
                      key={colourway.name}
                      data-hot={hover?.row === row ? "true" : undefined}
                    >
                      <th scope="row" className={styles.industryDetailPage__matrixRowHead}>
                        <span className={styles.industryDetailPage__matrixRowInner}>
                          <span
                            className={styles.industryDetailPage__swatch}
                            style={{ background: colourway.swatch }}
                            aria-hidden="true"
                          />
                          {colourway.name}
                        </span>
                      </th>

                      {grid[row].map((cell, col) => (
                        <td
                          key={matrix.sizes[col]}
                          className={styles.industryDetailPage__matrixCell}
                          data-state={cell.state}
                          data-hot={
                            hover?.row === row || hover?.col === col
                              ? "true"
                              : undefined
                          }
                          style={
                            {
                              "--fill": cell.qty / stats.peak,
                            } as React.CSSProperties
                          }
                          onMouseEnter={() => setHover({ row, col })}
                          onMouseLeave={() => setHover(null)}
                        >
                          <span
                            className={styles.industryDetailPage__matrixFill}
                            aria-hidden="true"
                          />
                          <span className={styles.industryDetailPage__matrixValue}>
                            {cell.qty === 0 ? (
                              <>
                                <span aria-hidden="true">—</span>
                                <span className={styles.industryDetailPage__srOnly}>
                                  Out of stock
                                </span>
                              </>
                            ) : (
                              cell.qty
                            )}
                          </span>
                        </td>
                      ))}

                      <td className={styles.industryDetailPage__matrixTotal}>{rowTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.industryDetailPage__matrixFoot}>
            <ul className={styles.industryDetailPage__matrixStats}>
              <li>
                <strong>{stats.units.toLocaleString("en-IN")}</strong>
                <span>units on hand</span>
              </li>
              <li>
                <strong>{stats.cells}</strong>
                <span>variant cells</span>
              </li>
              <li data-tone="warn">
                <strong>{stats.low}</strong>
                <span>running out</span>
              </li>
              <li data-tone="empty">
                <strong>{stats.empty}</strong>
                <span>nothing left</span>
              </li>
            </ul>

            <ul className={styles.industryDetailPage__matrixLegend} aria-hidden="true">
              <li>
                <i data-state="ok" />
                Healthy
              </li>
              <li>
                <i data-state="low" />
                {matrix.lowAt} or fewer
              </li>
              <li>
                <i data-state="empty" />
                Out
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
