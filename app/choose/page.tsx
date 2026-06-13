"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TeddyCard } from "@/components/TeddyCard";
import { supabase, TeddyType } from "@/lib/supabase";
import { Loader2, Copy, Check } from "lucide-react";

const TEDDIES = [
  { id: 1 as TeddyType, name: "The Classic", imageSrc: "/assets/teddy1.png" },
  { id: 2 as TeddyType, name: "The Dreamer", imageSrc: "/assets/teddy2.png" },
  { id: 3 as TeddyType, name: "The Companion", imageSrc: "/assets/teddy3.png" },
  { id: 4 as TeddyType, name: "The Guardian", imageSrc: "/assets/teddy4.png" },
];

export default function ChooseTeddyPage() {
  const [selectedTeddy, setSelectedTeddy] = useState<TeddyType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const draft = localStorage.getItem("love_letter_draft");
    if (!draft) {
      router.push("/");
    }
  }, [router]);

  const handleHideLetter = async () => {
    if (!selectedTeddy) return;
    
    setIsSaving(true);
    try {
      const letterText = localStorage.getItem("love_letter_draft") || "";
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('love_letters')
        .insert([
          { letter_text: letterText, teddy_id: selectedTeddy, share_token: token }
        ]);
        
      if (error) {
        console.error("Error saving letter:", error);
        alert("There was an error saving your letter. Please ensure Supabase is configured and try again.");
      } else {
        const link = `${window.location.origin}/play/${token}`;
        setShareLink(link);
        localStorage.removeItem("love_letter_draft");
      }
    } catch (err) {
      console.error("Failed to hide letter:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-4xl flex flex-col items-center text-center"
      >
        {!shareLink ? (
          <>
            <h2 className="text-3xl md:text-4xl font-light mb-4 font-serif text-foreground tracking-wide">
              Select Your Vessel
            </h2>
            
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-12 text-gray-500">
              Choose the keeper of your message.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 w-full px-4">
              {TEDDIES.map((teddy) => (
                <TeddyCard
                  key={teddy.id}
                  id={teddy.id}
                  name={teddy.name}
                  imageSrc={teddy.imageSrc}
                  selected={selectedTeddy === teddy.id}
                  onClick={() => setSelectedTeddy(teddy.id)}
                />
              ))}
            </div>

            <motion.button
              whileHover={selectedTeddy ? { scale: 1.02 } : {}}
              whileTap={selectedTeddy ? { scale: 0.98 } : {}}
              onClick={handleHideLetter}
              disabled={!selectedTeddy || isSaving}
              className="bg-black dark:bg-white text-white dark:text-black font-medium py-3 px-10 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all tracking-widest uppercase text-sm flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Securing..." : "Conceal Letter"}
            </motion.button>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-10 md:p-14 rounded-2xl max-w-2xl w-full flex flex-col items-center"
          >
            <div className="w-16 h-16 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center mb-6">
              <Check className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </div>
            <h2 className="text-2xl font-light text-foreground mb-4 font-serif tracking-wide">Safely Secured</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm tracking-wide uppercase max-w-sm">
              Share this key with your recipient.
            </p>
            
            <div className="w-full flex items-center gap-2 p-3 bg-white/50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-md">
              <input 
                type="text" 
                readOnly 
                value={shareLink} 
                className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200 font-mono text-sm px-2"
              />
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest h-4">
              {copied ? "Copied to clipboard" : ""}
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
