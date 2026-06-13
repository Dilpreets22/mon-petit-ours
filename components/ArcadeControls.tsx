"use client";

import { ChevronLeft, ChevronRight, Hand } from "lucide-react";

interface ArcadeControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onGrab: () => void;
  disabled?: boolean;
}

export function ArcadeControls({ onMoveLeft, onMoveRight, onGrab, disabled }: ArcadeControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-panel rounded-2xl max-w-sm mx-auto w-full">
      <div className="flex justify-between items-center w-full">
        {/* Movement Controls */}
        <div className="flex gap-4">
          <button
            onPointerDown={(e) => { e.preventDefault(); onMoveLeft(); }}
            disabled={disabled}
            className="arcade-button rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-30 disabled:active:scale-100"
            aria-label="Move Left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
          </button>
          
          <button
            onPointerDown={(e) => { e.preventDefault(); onMoveRight(); }}
            disabled={disabled}
            className="arcade-button rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-30 disabled:active:scale-100"
            aria-label="Move Right"
          >
            <ChevronRight className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Grab Control */}
        <button
          onClick={onGrab}
          disabled={disabled}
          className="arcade-button primary rounded-full w-16 h-16 flex flex-col items-center justify-center disabled:opacity-30 disabled:active:scale-100 group"
        >
          <Hand className="w-5 h-5 mb-1 stroke-[1.5] group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-medium tracking-widest uppercase">Grab</span>
        </button>
      </div>
    </div>
  );
}
