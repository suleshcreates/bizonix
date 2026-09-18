"use client";

import { useMemo, useState, type CSSProperties } from "react";
import styles from "./background-ripple-effect.module.css";

type Cell = {
  row: number;
  col: number;
};

type BackgroundRippleEffectProps = {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
};

type CellStyle = CSSProperties & {
  "--delay"?: string;
  "--duration"?: string;
};

export function BackgroundRippleEffect({
  rows = 12,
  cols = 28,
  cellSize = 56,
  className,
}: BackgroundRippleEffectProps) {
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, index) => index),
    [cols, rows],
  );

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
  };

  return (
    <div
      className={`${styles.ripple}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div className={styles.viewport}>
        <div className={styles.fade} />
        <div className={styles.grid} style={gridStyle} key={rippleKey}>
          {cells.map((index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const distance = clickedCell
              ? Math.hypot(clickedCell.row - row, clickedCell.col - col)
              : 0;
            const cellStyle: CellStyle = clickedCell
              ? {
                  "--delay": `${Math.max(0, distance * 55)}ms`,
                  "--duration": `${200 + distance * 80}ms`,
                }
              : {};

            return (
              <span
                className={`${styles.cell}${clickedCell ? ` ${styles.active}` : ""}`}
                key={index}
                style={cellStyle}
                onClick={() => {
                  setClickedCell({ row, col });
                  setRippleKey((key) => key + 1);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
