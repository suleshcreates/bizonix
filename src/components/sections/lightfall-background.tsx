"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

type RGB = [number, number, number];

type LightfallBackgroundProps = {
  className?: string;
  paused?: boolean;
};

const hexToRgb = (hex: string): RGB => {
  const value = hex.replace("#", "").padEnd(6, "0");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ];
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

// Adapted from the supplied Lightfall component. The palette is deliberately
// restrained to Bizonix navy, blue, and teal rather than its original neon hues.
const fragment = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 uBlue;
uniform vec3 uTeal;
uniform vec3 uMist;
varying vec2 vUv;

vec3 tanhv(vec3 x) { vec3 e = exp(-2.0 * x); return (1.0 - e) / (1.0 + e); }
vec2 sceneC(vec2 frag, vec2 r) {
  vec2 p = (frag + frag - r) / r.x;
  float z = 0.0; float d = 1e3; vec4 o = vec4(0.0);
  for (int k = 0; k < 34; k++) {
    if (d <= 1e-4) break;
    o = z * normalize(vec4(p, 2.75, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(o * o)); z += d;
  }
  return vec2(o.x, atan(o.z, o.y));
}
void main() {
  vec2 r = iResolution.xy;
  vec2 uv = (vUv * r + vUv * r - r) / r.x;
  float t = iTime * 0.042 + 9.0;
  vec2 y = vec2(0.006, 0.82);
  vec2 c = sceneC(vUv * r, r);
  vec2 dx = sceneC(vUv * r + vec2(1.0, 0.0), r) - c;
  vec2 dy = sceneC(vUv * r + vec2(0.0, 1.0), r) - c;
  dx.y -= 6.28318 * floor(dx.y / 6.28318 + 0.5);
  dy.y -= 6.28318 * floor(dy.y / 6.28318 + 0.5);
  vec2 fw = abs(dx) + abs(dy);
  vec4 outColor = vec4(vec3(0.015, 0.048, 0.11), 1.0);
  vec2 p = vec2(2.0, 1.0) * uv - (r / r.x) * vec2(0.0, 1.0);
  outColor.rgb += uBlue * 0.09 / (dot(p, p) + 0.7);
  float zRadius = 0.0009;
  vec2 aa = vec2(max(length(fw), 1e-5));
  for (int m = 0; m < 6; m++) {
    float f = float(m) + 1.0;
    float seed = fract(sin(dot(vec2(f, floor(c.x / y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 q = c - (t + t * seed) * vec2(0.0, 1.0);
    q -= floor(q / y + 0.5) * y;
    vec3 color = mix(uBlue, uTeal, fract(seed * 7.13));
    if (m == 5) color = uMist;
    vec2 inner = vec2(length(max(q, vec2(-1.0, 0.0))), length(q) - zRadius) - zRadius;
    vec2 shape = vec2(1.0) - smoothstep(-aa, aa, inner);
    outColor.rgb += dot(shape, vec2(exp(14.0 * q.y), 2.1)) * color * .72;
    c.x += y.x / 8.0;
  }
  outColor.rgb = sqrt(tanhv(max(outColor.rgb * 1.16 - vec3(.01), 0.0)));
  gl_FragColor = outColor;
}
`;

export function LightfallBackground({
  className,
  paused = false,
}: LightfallBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      alpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = "display:block;width:100%;height:100%;";
    container.appendChild(canvas);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iTime: { value: 0 },
      uBlue: { value: hexToRgb("#2f6bff") },
      uTeal: { value: hexToRgb("#2ec4b6") },
      uMist: { value: hexToRgb("#9ebeff") },
    };
    const program = new Program(gl, { vertex, fragment, uniforms });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const bounds = container.getBoundingClientRect();
      renderer.setSize(bounds.width, bounds.height);
      uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        1,
      ];
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let frame = 0;
    const render = (time: number) => {
      if (!paused && !reduceMotion.matches) {
        uniforms.iTime.value = time * 0.001;
        renderer.render({ scene: mesh });
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
  }, [paused]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
