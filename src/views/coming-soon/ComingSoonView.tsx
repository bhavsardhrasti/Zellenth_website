'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SWATCHES = [
  { color: '#A9784F', top: '10%', left: '7%', size: 60, delay: 0 },
  { color: '#6B5D52', top: '66%', left: '9%', size: 40, delay: 1.4 },
  { color: '#3A2A1E', top: '18%', left: '87%', size: 48, delay: 0.7 },
  { color: '#8C6B3F', top: '72%', left: '89%', size: 56, delay: 2.1 },
  { color: '#A9784F', top: '42%', left: '4%', size: 28, delay: 3 },
  { color: '#6B5D52', top: '46%', left: '93%', size: 32, delay: 1.9 },
];

const PANEL_COLORS = ['#A9784F', '#6B5D52', '#3A2A1E', '#8C6B3F'] as const;

function colorAt(index: number): string {
  return PANEL_COLORS[index % PANEL_COLORS.length] as string;
}
const WORDS = ['Real-time.', 'Grain-true.', 'Shadow-perfect.', 'Yours.'];

export default function ComingSoonView() {
  return (
    <main className="bg-background relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="from-brand/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="animate-grain-shift pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, #3A2A1E 0px, #3A2A1E 1px, transparent 1px, transparent 24px)',
        }}
      />

      {SWATCHES.map((swatch, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="shadow-elevated absolute hidden rounded-full sm:block"
          style={{
            top: swatch.top,
            left: swatch.left,
            width: swatch.size,
            height: swatch.size,
            backgroundColor: swatch.color,
          }}
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{
            duration: 6,
            delay: swatch.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative flex max-w-xl flex-col items-center gap-6 text-center">
        <Image
          src="/assets/logo/zellenth-logo-v2.webp"
          alt="Zellenth"
          width={816}
          height={241}
          priority
          className="h-10 w-auto sm:h-12"
        />

        <DoorMark />

        <div>
          <h1 className="font-marketing-display font-bold text-h1 text-text-primary sm:text-marketing-hero">
            Any laminate.
            <br />
            Any door.
          </h1>
          <div className="text-brand font-marketing-display font-bold relative mt-1 h-9 w-full sm:h-11">
            <RotatingWord />
          </div>
        </div>

        <p className="font-body text-body text-text-secondary max-w-md">
          See it before you order it. Pick a laminate, pick a door, watch it come together in real
          time — grain, sheen, shadow and all. Launching soon.
        </p>

        <span className="bg-success-bg text-success-text rounded-pill px-3 py-1 text-xs font-medium">
          Made in Ahmedabad
        </span>

        <p className="font-body text-text-secondary mt-4 text-lg italic">
          &ldquo;Crafted, not just manufactured.&rdquo;
        </p>
      </div>
    </main>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={WORDS[index]}
        className="text-h2 sm:text-h1 absolute inset-0 flex items-center justify-center whitespace-nowrap"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {WORDS[index]}
      </motion.span>
    </AnimatePresence>
  );
}

function DoorMark() {
  const [panelIndex, setPanelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPanelIndex((current) => (current + 1) % PANEL_COLORS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentColor = colorAt(panelIndex);
  const nextColor = colorAt(panelIndex + 1);

  return (
    <svg
      width="88"
      height="120"
      viewBox="0 0 88 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shadow-elevated rounded-md"
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="84"
        height="116"
        rx="6"
        fill="#FFFFFF"
        stroke="#A9784F"
        strokeWidth="2"
      />
      <motion.rect
        x="14"
        y="14"
        width="60"
        height="42"
        rx="3"
        animate={{ fill: currentColor }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <motion.rect
        x="14"
        y="64"
        width="60"
        height="42"
        rx="3"
        animate={{ fill: nextColor }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <line
        x1="20"
        y1="24"
        x2="68"
        y2="24"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="34"
        x2="68"
        y2="34"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="44"
        x2="68"
        y2="44"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="74"
        x2="68"
        y2="74"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="84"
        x2="68"
        y2="84"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="94"
        x2="68"
        y2="94"
        stroke="#FAF6F1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <circle cx="70" cy="60" r="3" fill="#A9784F" />
    </svg>
  );
}
