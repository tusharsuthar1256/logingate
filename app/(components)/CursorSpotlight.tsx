'use client';
import React, { useEffect, useState } from 'react';

const CursorSpotlight = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, var(--spotlight-color), transparent 60%)`,
      }}
    />
  );
};

export default CursorSpotlight;
