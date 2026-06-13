"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterText: string;
  teddyImageSrc: string;
  teddyName: string;
}

export function LoveLetterModal({ isOpen, onClose, letterText, teddyImageSrc, teddyName }: LoveLetterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Subtle Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-lg"
          />

          {/* Premium Stationery Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#111] rounded-none md:rounded-sm shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center p-10 md:p-16 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:opacity-50 transition-opacity"
            >
              <X className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
            </button>

            {/* Teddy Image - Small & Elegant */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative w-24 h-24 mb-8 mix-blend-multiply dark:mix-blend-normal"
            >
              <Image src={teddyImageSrc} alt={teddyName} fill className="object-contain opacity-80" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="w-full text-center mb-10"
            >
              <h2 className="text-xl md:text-2xl font-light mb-2 font-serif text-gray-900 dark:text-gray-100 tracking-wide">
                A Note For You
              </h2>
              <div className="w-12 h-[1px] bg-gray-300 dark:bg-gray-700 mx-auto" />
            </motion.div>

            {/* The Letter Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-full relative"
            >
              <p className="whitespace-pre-wrap font-serif text-base md:text-lg leading-[2] text-gray-700 dark:text-gray-300 tracking-wide text-justify">
                {letterText}
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
