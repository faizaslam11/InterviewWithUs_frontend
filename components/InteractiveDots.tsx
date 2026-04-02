'use client';

/**
 * InteractiveDots.tsx
 *
 * Canvas-based dot grid that reacts to mouse/touch movement.
 * Dots within cursor radius glow green and scale up smoothly.
 * Uses requestAnimationFrame — zero layout thrash, 60fps.
 */

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const SPACING = 30;       // px between dots
const DOT_RADIUS = 1.4;   // base dot size
const GLOW_RADIUS = 130;  // mouse influence radius in px
const MAX_SCALE = 3.5;    // max dot size multiplier at cursor centre
const BASE_OPACITY = 0.35;// resting dot opacity
const GLOW_OPACITY = 0.9; // lit dot opacity

interface Dot {
  x: number;
  y: number;
  scale: number;   // current animated scale
  target: number;  // target scale (set each frame from mouse proximity)
}

export function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Build dot grid ──
    const buildGrid = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;

      const dots: Dot[] = [];
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: c * SPACING, y: r * SPACING, scale: 1, target: 1 });
        }
      }
      dotsRef.current = dots;
    };

    buildGrid();

    // ── Mouse / touch tracking ──
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    // ── Resize ──
    const onResize = () => { buildGrid(); };
    window.addEventListener('resize', onResize);

    // ── Colour helpers ──
    const getDotColor = (scale: number, alpha: number): string => {
      const isDark = resolvedTheme === 'dark';
      if (scale > 1.05) {
        // Glowing dot — green tint
        const r = isDark ? 61  : 26;
        const g = isDark ? 220 : 122;
        const b = isDark ? 106 : 53;
        return `rgba(${r},${g},${b},${alpha})`;
      }
      // Resting dot
      const v = isDark ? 42 : 180;
      return `rgba(${v},${v+10},${v},${alpha})`;
    };

    // ── Animation loop ──
    const LERP = 0.12; // interpolation speed (lower = smoother)

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dots = dotsRef.current;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Distance from mouse
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Compute target scale based on proximity
        if (dist < GLOW_RADIUS) {
          const t = 1 - dist / GLOW_RADIUS;          // 0→1 as dot approaches cursor
          const eased = t * t * (3 - 2 * t);         // smoothstep
          d.target = 1 + eased * (MAX_SCALE - 1);
        } else {
          d.target = 1;
        }

        // Lerp current scale toward target
        d.scale += (d.target - d.scale) * LERP;

        // Compute opacity
        const progress = (d.scale - 1) / (MAX_SCALE - 1);
        const alpha = BASE_OPACITY + progress * (GLOW_OPACITY - BASE_OPACITY);

        // Draw dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS * d.scale, 0, Math.PI * 2);
        ctx.fillStyle = getDotColor(d.scale, alpha);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
