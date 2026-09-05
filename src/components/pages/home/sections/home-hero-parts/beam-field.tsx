"use client";

import { useEffect, useRef } from "react";

/**
 * Home hero backdrop: layered light beams drifting up a navy stage, in the
 * Bizonix blue/teal palette.
 *
 * Two deliberate departures from the usual canvas-beam implementation:
 *  - every beam is a pre-blurred sprite drawn with `drawImage`, so the
 *    expensive `ctx.filter = blur()` runs six times at mount instead of
 *    ~20 times per frame;
 *  - the loop stops entirely when the hero scrolls out of view, and never
 *    starts when the visitor asks for reduced motion.
 */

type Beam = {
  x: number;
  y: number;
  length: number;
  scale: number;
  speed: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
  tint: number;
  angle: number;
};

const LAYERS = 3;
const BEAMS_PER_LAYER = 6;
const SPRITE_HEIGHT = 512;

/** Blue carries the field; teal is the occasional accent, as in the logo. */
const TINTS = ["104,156,255", "46,196,182"] as const;
const TEAL_CHANCE = 0.26;

function makeSprite(rgb: string, width: number, blur: number) {
  const canvas = document.createElement("canvas");
  const pad = Math.ceil(blur * 3);
  canvas.width = Math.ceil(width + pad * 2);
  canvas.height = SPRITE_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const gradient = ctx.createLinearGradient(0, 0, 0, SPRITE_HEIGHT);
  gradient.addColorStop(0, `rgba(${rgb},0)`);
  gradient.addColorStop(0.18, `rgba(${rgb},0.4)`);
  gradient.addColorStop(0.5, `rgba(${rgb},1)`);
  gradient.addColorStop(0.82, `rgba(${rgb},0.4)`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);

  ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = gradient;
  ctx.fillRect(pad, 0, width, SPRITE_HEIGHT);
  return canvas;
}

function createBeam(width: number, height: number, layer: number): Beam {
  return {
    x: Math.random() * width * 1.3 - width * 0.15,
    y: Math.random() * height,
    length: height * 2.2 + Math.random() * height * 0.6,
    scale: 0.8 + Math.random() * 0.7,
    speed: 0.16 + layer * 0.14 + Math.random() * 0.18,
    alpha: 0.16 + layer * 0.07 + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.008 + Math.random() * 0.012,
    layer,
    tint: Math.random() < TEAL_CHANCE ? 1 : 0,
    angle: ((-35 + Math.random() * 10) * Math.PI) / 180,
  };
}

export function BeamField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    container.appendChild(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // sprites[layer][tint]
    const sprites = Array.from({ length: LAYERS }, (_, index) => {
      const layer = index + 1;
      const spriteWidth = 11 + layer * 8;
      const blur = 3 + layer * 3.5;
      return TINTS.map((rgb) => makeSprite(rgb, spriteWidth, blur));
    });

    let beams: Beam[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      beams = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beams.push(createBeam(width, height, layer));
        }
      }
    };

    const draw = (advance: boolean) => {
      if (!width || !height) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const backdrop = ctx.createLinearGradient(0, 0, width * 0.4, height);
      backdrop.addColorStop(0, "#04101f");
      backdrop.addColorStop(0.55, "#071a31");
      backdrop.addColorStop(1, "#050f1e");
      ctx.fillStyle = backdrop;
      ctx.fillRect(0, 0, width, height);

      // Additive blending is what gives crossing beams their bloom.
      ctx.globalCompositeOperation = "lighter";

      for (const beam of beams) {
        if (advance) {
          beam.y -= beam.speed * (beam.layer / LAYERS + 0.6);
          beam.pulse += beam.pulseSpeed;
          if (beam.y + beam.length < -60) {
            beam.y = height + 60;
            beam.x = Math.random() * width * 1.3 - width * 0.15;
            beam.tint = Math.random() < TEAL_CHANCE ? 1 : 0;
          }
        }

        const sprite = sprites[beam.layer - 1][beam.tint];
        const spriteWidth = sprite.width * beam.scale;

        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate(beam.angle);
        ctx.globalAlpha = Math.min(
          1,
          beam.alpha * (0.72 + Math.sin(beam.pulse) * 0.34),
        );
        ctx.drawImage(sprite, -spriteWidth / 2, 0, spriteWidth, beam.length);
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    resize();
    draw(false);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(false);
    });
    resizeObserver.observe(container);

    let frame = 0;
    let running = false;

    const loop = () => {
      draw(true);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    // Off-screen heroes stop costing frames.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    visibility.observe(container);

    const onMotionChange = () => (reduceMotion.matches ? stop() : start());
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
