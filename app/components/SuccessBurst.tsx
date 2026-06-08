"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { playRejectSound, playSuccessSound } from "../lib/sounds";

type Tone = "success" | "reject";

const successColors = ["#9945FF", "#14F195", "#00D1FF", "#FFD700"];
const rejectColors = ["#ef4444", "#f97316", "#fb7185", "#f59e0b"];

// Deterministic pseudo-random so SSR and client match (no Math.random in render).
function jitter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = i * 30 + jitter(i) * 16;
  const distance = 58 + jitter(i + 7) * 38;
  const radians = (angle * Math.PI) / 180;
  return {
    id: i,
    tx: Math.cos(radians) * distance,
    ty: Math.sin(radians) * distance,
    size: 4 + jitter(i + 3) * 4,
    delay: jitter(i + 11) * 0.08,
  };
});

interface SuccessBurstProps {
  show: boolean;
  tone?: Tone;
}

// A one-shot particle burst + expanding ring, played over its positioned parent.
// Pair it with a `position: relative` container. Replays whenever `show` flips to true.
export function SuccessBurst({ show, tone = "success" }: SuccessBurstProps) {
  const [burstKey, setBurstKey] = useState(0);
  const prevShow = useRef(false);

  useEffect(() => {
    if (show && !prevShow.current) {
      setBurstKey((key) => key + 1);
      if (tone === "reject") {
        playRejectSound();
      } else {
        playSuccessSound();
      }
    }
    prevShow.current = show;
  }, [show, tone]);

  if (!show) return null;

  const colors = tone === "reject" ? rejectColors : successColors;

  return (
    <div className={`success-burst ${tone}`} key={burstKey} aria-hidden="true">
      <span className="success-burst-glow" />
      <span className="success-burst-ring" />
      {PARTICLES.map((particle) => (
        <span
          className="success-burst-particle"
          key={particle.id}
          style={
            {
              "--tx": `${particle.tx}px`,
              "--ty": `${particle.ty}px`,
              "--size": `${particle.size}px`,
              "--delay": `${particle.delay}s`,
              background: colors[particle.id % colors.length],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
