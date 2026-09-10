"use client";

import { useMemo } from "react";

const GRADIENTS = ["url(#petal-grad-a)", "url(#petal-grad-b)", "url(#petal-grad-c)"];

function makePetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 12 + Math.random() * 10,
    drift: `${Math.round((Math.random() - 0.5) * 160)}px`,
    size: 16 + Math.random() * 16,
    rotate: Math.round(Math.random() * 360),
    fill: GRADIENTS[i % GRADIENTS.length],
  }));
}

export function FallingPetals() {
  const petals = useMemo(() => makePetals(20), []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Degradados compartidos por todos los pétalos (evita ids duplicados). */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="petal-grad-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4c463" />
            <stop offset="100%" stopColor="#e07a3f" />
          </linearGradient>
          <linearGradient id="petal-grad-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8823f" />
            <stop offset="100%" stopColor="#c94f2c" />
          </linearGradient>
          <linearGradient id="petal-grad-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4a657" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>

      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute top-0 block opacity-0"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size,
            animation: `petal-fall ${petal.duration}s linear ${petal.delay}s infinite`,
            ["--petal-drift" as string]: petal.drift,
            ["--petal-rotate-start" as string]: `${petal.rotate}deg`,
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path
              d="M50 2 C78 22 84 62 50 98 C16 62 22 22 50 2 Z"
              fill={petal.fill}
              opacity={0.85}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
