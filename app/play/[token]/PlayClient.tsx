"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoveLetter } from "@/lib/supabase";

const TEDDIES = [
  { id: 1, name: "Rose Bear", imageSrc: "/assets/Teddy1.png" },
  { id: 2, name: "Gift Bear", imageSrc: "/assets/Teddy2.png" },
  { id: 3, name: "Daisy Bear", imageSrc: "/assets/Teddy3.png" },
  { id: 4, name: "Heart Bear", imageSrc: "/assets/Teddy4.png" },
];

// Positions of the 4 teddies as % of the game area width
const TEDDY_POSITIONS = [12, 37, 62, 87];

interface PlayClientProps {
  letter: LoveLetter;
}

type GameState = "idle" | "grabbing" | "won" | "failed";

export function PlayClient({ letter }: PlayClientProps) {
  const [clawPercent, setClawPercent] = useState(5); // 0-100
  const [gameState, setGameState] = useState<GameState>("idle");
  const [showModal, setShowModal] = useState(false);
  const [failMsg, setFailMsg] = useState(false);
  const [grabbedTeddyId, setGrabbedTeddyId] = useState<number | null>(null);
  const [removedTeddyId, setRemovedTeddyId] = useState<number | null>(null);

  const clawControls = useAnimation();
  const machineRef = useRef<HTMLDivElement>(null);

  const moveLeft = () => {
    if (gameState !== "idle") return;
    setClawPercent((p) => Math.max(5, p - 20));
  };

  const moveRight = () => {
    if (gameState !== "idle") return;
    setClawPercent((p) => Math.min(95, p + 20));
  };

  const handleGrab = async () => {
    if (gameState !== "idle") return;
    setGameState("grabbing");

    // Animate claw down
    await clawControls.start({
      y: "52%",
      transition: { duration: 1.0, ease: "easeIn" },
    });

    // Determine which teddy was caught
    let caughtTeddyId: number | null = null;
    let minDist = 999;
    TEDDIES.forEach((t, i) => {
      const dist = Math.abs(clawPercent - TEDDY_POSITIONS[i]);
      if (dist < 12 && dist < minDist) {
        minDist = dist;
        caughtTeddyId = t.id;
      }
    });

    if (caughtTeddyId !== null) {
      setGrabbedTeddy(caughtTeddyId);
    }

    // Animate claw up
    await clawControls.start({
      y: "0%",
      transition: { duration: 1.0, ease: "easeOut" },
    });

    if (caughtTeddyId !== null) {
      setRemovedTeddyId(caughtTeddyId);
      // Move claw to left (chute)
      setClawPercent(5);
      await new Promise((r) => setTimeout(r, 700));
      setGrabbedTeddy(null);

      if (caughtTeddyId === letter.teddy_id) {
        setGameState("won");
        setTimeout(() => setShowModal(true), 400);
      } else {
        setGameState("failed");
        setFailMsg(true);
        setTimeout(() => {
          setFailMsg(false);
          setRemovedTeddyId(null);
          setGameState("idle");
        }, 2500);
      }
    } else {
      setGameState("failed");
      setFailMsg(true);
      setTimeout(() => {
        setFailMsg(false);
        setGameState("idle");
      }, 2000);
    }
  };

  const setGrabbedTeddy = (id: number | null) => {
    setGrabbedTeddyId(id);
  };

  const wonTeddy = TEDDIES.find((t) => t.id === letter.teddy_id);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="px-8 py-5 flex items-center">
        <span className="font-serif text-lg font-semibold text-gray-800">
          Mon Petit Ours 🧸
        </span>
      </nav>

      {/* Title */}
      <header className="text-center px-6 pt-4 pb-6">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-gray-900">
          Catch Your Teddy 🧸
        </h1>
        <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Among these adorable teddy bears hides a special message written just for you.
          <br />
          Guide the claw, choose your teddy, and discover the surprise waiting inside 💝
        </p>
      </header>

      {/* Claw Machine */}
      <main className="flex-1 flex items-start justify-center px-4 pb-8">
        {/* Pink outer card */}
        <div
          className="relative rounded-3xl p-4 shadow-lg"
          style={{
            background: "linear-gradient(145deg, #f9a8c0, #f472a8, #ec4899)",
            width: "min(440px, 95vw)",
          }}
        >
          {/* Blue inner game area */}
          <div
            ref={machineRef}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "#d6eef8",
              height: "280px",
            }}
          >
            {/* Chain from top */}
            <motion.div
              className="absolute top-0 flex flex-col items-center z-20"
              animate={{ left: `calc(${clawPercent}% - 10px)` }}
              transition={{ type: "spring", stiffness: 120, damping: 28 }}
            >
              {/* Chain links */}
              <div className="flex flex-col items-center">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border-2 border-gray-400 bg-gray-200 -mt-1"
                    style={{ transform: "scaleX(0.6)" }}
                  />
                ))}
              </div>

              {/* Claw arm + prongs */}
              <motion.div
                animate={clawControls}
                className="flex flex-col items-center"
              >
                {/* Claw housing */}
                <div className="w-5 h-5 bg-gray-300 border border-gray-400 rounded-sm" />
                {/* Prongs */}
                <div className="flex gap-1 relative" style={{ top: "-2px" }}>
                  <div
                    className="w-[3px] h-8 bg-gray-400 rounded-b-full"
                    style={{ transform: "rotate(-18deg)", transformOrigin: "top center" }}
                  />
                  <div className="w-[3px] h-10 bg-gray-400 rounded-b-full" />
                  <div
                    className="w-[3px] h-8 bg-gray-400 rounded-b-full"
                    style={{ transform: "rotate(18deg)", transformOrigin: "top center" }}
                  />
                </div>

                {/* Grabbed teddy hanging */}
                <AnimatePresence>
                  {grabbedTeddyId && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: [-4, 4, -4] }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ rotate: { repeat: Infinity, duration: 1.2 } }}
                      className="relative w-16 h-16 mt-1"
                    >
                      <Image
                        src={TEDDIES.find((t) => t.id === grabbedTeddyId)?.imageSrc || ""}
                        alt="caught teddy"
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Teddies at bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-around items-end px-4">
              {TEDDIES.map((teddy) => {
                if (removedTeddyId === teddy.id) {
                  return <div key={teddy.id} className="w-16 h-16" />;
                }
                return (
                  <motion.div
                    key={teddy.id}
                    className="relative w-16 h-16"
                    initial={{ opacity: 1 }}
                  >
                    <Image
                      src={teddy.imageSrc}
                      alt={teddy.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Fail message overlay */}
            <AnimatePresence>
              {failMsg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm"
                >
                  <p className="font-serif text-lg text-gray-700 text-center px-6">
                    Not this one! Try again 💕
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls panel */}
          <div
            className="flex items-center justify-between px-4 py-4 mt-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            {/* Left/Right arrows */}
            <div className="flex gap-3">
              <button
                onPointerDown={(e) => { e.preventDefault(); moveLeft(); }}
                disabled={gameState !== "idle"}
                className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center shadow-sm hover:bg-white transition-all disabled:opacity-40 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); moveRight(); }}
                disabled={gameState !== "idle"}
                className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center shadow-sm hover:bg-white transition-all disabled:opacity-40 active:scale-95"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
            </div>

            {/* Grab button */}
            <button
              onClick={handleGrab}
              disabled={gameState !== "idle"}
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg disabled:opacity-40 active:scale-95 transition-all"
              style={{
                background: "radial-gradient(circle, #f9c6d0, #f472a8)",
                border: "3px solid white",
              }}
            >
              <span className="text-xl leading-none">🐻</span>
              <span className="text-xs font-semibold text-white mt-0.5 drop-shadow">Grab</span>
            </button>
          </div>
        </div>
      </main>

      {/* Letter Reveal Modal */}
      <AnimatePresence>
        {showModal && wonTeddy && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 gap-4">
            {/* Lighter frosted backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(12px) saturate(140%)",
                WebkitBackdropFilter: "blur(12px) saturate(140%)",
                background: "rgba(220, 220, 228, 0.25)",
              }}
            />

            {/* Glass modal card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="relative mx-auto w-full max-w-2xl rounded-3xl p-8 shadow-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.68)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.80)",
                boxShadow: "0 12px 56px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              {/* Top gloss line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)" }}
              />

              {/* Title */}
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 text-center mb-6">
                You found it ❤️
              </h2>

              {/* Content row: Teddy + Paper note postcard */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Teddy image */}
                <div className="relative w-44 h-44 flex-shrink-0">
                  <Image
                    src={wonTeddy.imageSrc}
                    alt={wonTeddy.name}
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>

                {/* Paper note postcard with actual image as background */}
                <div
                  className="flex-1 rounded-2xl overflow-hidden relative"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)", minHeight: "220px" }}
                >
                  {/* Background image */}
                  <Image
                    src="/assets/paper-letter-v2.jpg"
                    alt="paper note"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {/* Letter text — centered on the paper */}
                  <div
                    className="absolute inset-0 z-10 flex items-start mt-[-8%]"
                    style={{ padding: "10% 23% 18% 18%" }}
                  >
                    <p
                      className="font-serif text-sm text-gray-800 whitespace-pre-wrap"
                      style={{
                        lineHeight: "1.9",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {letter.letter_text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Create Yours button — outside the modal, below it */}
            <motion.a
              href="/"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 w-full max-w-2xl text-white font-serif text-lg text-center py-4 rounded-2xl transition-all active:scale-95 block"
              style={{
                background: "rgba(0,0,0,0.88)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Create Yours
            </motion.a>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
