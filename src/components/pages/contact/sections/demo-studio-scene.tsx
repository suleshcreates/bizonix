"use client";

import { useEffect, useRef, useState } from "react";
import { Warehouse, Store, Network, BookOpen, ArrowUpRight, Box } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import styles from "../contact.module.css";

const scenes = [
  { title: "Warehouse", icon: Warehouse, note: "Know what arrived. Know where it belongs.", action: "Receipt → Piece identity → Available stock", label: "Inventory & procurement" },
  { title: "Stores", icon: Store, note: "A sale at the counter. A record everywhere it matters.", action: "Counter → Stock movement → Books", label: "Sales & POS" },
  { title: "Franchise", icon: Network, note: "One connected network. Each entity stays distinct.", action: "Allocation → Transfer → Outlet receipt", label: "Franchise & wholesale" },
  { title: "Books", icon: BookOpen, note: "Follow the operation all the way to the ledger.", action: "Transaction → Entity books → Group view", label: "Accounting & analytics" },
] as const;

export function DemoStudioScene() {
  const [active, setActive] = useState(0);
  const tilt = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const scene = scenes[active];

  useEffect(() => {
    if (reduced || !tilt.current || !pointer.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const area = pointer.current;
    const context = gsap.context(() => {
      const x = gsap.quickTo(tilt.current, "rotationX", { duration: 0.65, ease: "power2.out" });
      const y = gsap.quickTo(tilt.current, "rotationY", { duration: 0.65, ease: "power2.out" });
      const move = (event: PointerEvent) => { const box = area.getBoundingClientRect(); x(5 - (event.clientY - box.top) / box.height * 10); y((event.clientX - box.left) / box.width * 10 - 5); };
      const leave = () => { x(0); y(0); };
      area.addEventListener("pointermove", move); area.addEventListener("pointerleave", leave);
      return () => { area.removeEventListener("pointermove", move); area.removeEventListener("pointerleave", leave); };
    }, area);
    return () => context.revert();
  }, [reduced]);

  return <div className={styles.studioScene} ref={pointer}>
    <div className={styles.studioSceneHeader}><span>ONE OPERATING RECORD</span><small>Interactive preview</small></div>
    <div className={styles.studioSceneTilt} ref={tilt}>
      <div className={styles.studioScenePlane} aria-hidden="true"><div /><div /><div /></div>
      <div className={styles.studioCore}><Box size={25} strokeWidth={1.4} /><span>Bizonix<small>Connected by design</small></span><i /></div>
      <div className={styles.studioNodes} role="group" aria-label="Explore a demo workflow">
        {scenes.map((item, index) => <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)} onFocus={() => setActive(index)} onMouseEnter={() => setActive(index)}><item.icon size={23} strokeWidth={1.5} /><span>{item.title}</span><i /></button>)}
      </div>
    </div>
    <div className={styles.studioSceneDetail}>
      <AnimatePresence mode="wait" initial={false}><motion.div key={scene.title} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }}><span>{scene.label}<ArrowUpRight size={14} /></span><p>{scene.note}</p><small>{scene.action}</small></motion.div></AnimatePresence>
    </div>
  </div>;
}
