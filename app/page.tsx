"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { supabase, TeddyType } from "@/lib/supabase";

const TEDDIES = [
  { id: 1 as TeddyType, name: "Rose Bear", imageSrc: "/assets/Teddy1.png" },
  { id: 2 as TeddyType, name: "Gift Bear", imageSrc: "/assets/Teddy2.png" },
  { id: 3 as TeddyType, name: "Daisy Bear", imageSrc: "/assets/Teddy3.png" },
  { id: 4 as TeddyType, name: "Heart Bear", imageSrc: "/assets/Teddy4.png" },
];

export default function Home() {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTeddy, setSelectedTeddy] = useState<TeddyType | null>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!selectedTeddy || message.trim().length === 0) return;
    setIsSaving(true);
    try {
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const letterText = `To: ${to}\n\n${message}\n\n— ${from}`;
      const { error } = await supabase
        .from("love_letters")
        .insert([{ letter_text: letterText, teddy_id: selectedTeddy, share_token: token }]);
      if (error) {
        alert("Error saving. Please check your Supabase configuration.");
      } else {
        setShareLink(`${window.location.origin}/play/${token}`);
      }
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="px-8 py-5 flex items-center">
        <span className="font-serif text-lg font-semibold text-gray-800">
          Mon Petit Ours 🧸
        </span>
      </nav>

      {/* Hero */}
      <header className="text-center px-4 pt-6 pb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-gray-900 leading-tight max-w-2xl mx-auto">
          One claw machine, four teddies one message from the heart.
        </h1>
        <p className="mt-4 text-sm text-gray-400 italic font-serif">
          Une machine à pinces, quatre ours, un seul message venu du cœur.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-16 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                To:
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Who you are thinking of ?"
                className="w-full border-b border-gray-300 pb-2 outline-none text-sm text-gray-500 placeholder-gray-300 bg-transparent focus:border-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                From:
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Write your name"
                className="w-full border-b border-gray-300 pb-2 outline-none text-sm text-gray-500 placeholder-gray-300 bg-transparent focus:border-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Write your message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something from your heart..."
                maxLength={1000}
                rows={7}
                className="w-full border border-gray-200 rounded-lg p-4 text-sm text-gray-600 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors resize-none bg-white"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {message.length}/1000
              </div>
            </div>
          </div>

          {/* Right: Teddy Selector + Share */}
          <div className="flex flex-col gap-4">
            {/* Teddy selection box */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-center text-sm font-semibold text-gray-700 mb-4">
                Select your favourite teddy
              </h3>
              <div className="flex flex-col gap-4">
                {/* Large featured preview — shows whichever teddy is selected */}
                <div className="flex justify-center">
                  <motion.div
                    key={selectedTeddy ?? 0}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-48 h-44"
                  >
                    {selectedTeddy && (
                      <Image
                        src={TEDDIES.find((t) => t.id === selectedTeddy)?.imageSrc ?? ""}
                        alt="Selected teddy"
                        fill
                        sizes="192px"
                        className="object-contain"
                      />
                    )}
                  </motion.div>
                </div>

                {/* All 4 teddies as small thumbnails — grid so they never overflow */}
                <div className="grid grid-cols-4 gap-2">
                  {TEDDIES.map((teddy) => (
                    <motion.button
                      key={teddy.id}
                      onClick={() => setSelectedTeddy(teddy.id)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      className={`relative rounded-xl p-1 transition-all flex justify-center ${
                        selectedTeddy === teddy.id
                          ? "ring-2 ring-gray-400 bg-gray-50"
                          : ""
                      }`}
                    >
                      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                        <Image
                          src={teddy.imageSrc}
                          alt={teddy.name}
                          fill
                          sizes="(max-width: 640px) 18vw, 80px"
                          className="object-contain"
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleShare}
              disabled={isSaving || message.trim().length === 0 || !selectedTeddy}
              className="w-full bg-black text-white font-serif text-lg py-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {isSaving ? "Sharing..." : "Share"}
            </motion.button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-sm text-gray-400 border-t border-gray-100">
        Made with Love by your Baby 🧸 ❤️
      </footer>

      {/* Share Modal */}
      <AnimatePresence>
        {shareLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* iOS 26-style blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareLink(null)}
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                background: "rgba(200, 200, 210, 0.45)",
              }}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-md mx-4 text-center rounded-3xl px-10 py-10 shadow-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {/* Subtle top-edge gloss */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)" }}
              />
              {/* Envelope icon */}
              <div className="text-5xl mb-4">💌</div>
              <h2 className="font-serif text-3xl font-normal text-gray-900 mb-2">
                Share your letter
              </h2>
              <p className="text-sm text-gray-500 mb-6">Copy the link from below</p>

              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(255, 220, 230, 0.5)",
                  border: "1px solid rgba(255,180,200,0.4)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-1 bg-transparent text-xs text-gray-700 outline-none font-mono"
                />
                <button
                  onClick={copyLink}
                  className="p-2 rounded-xl flex-shrink-0 transition-all active:scale-90"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
