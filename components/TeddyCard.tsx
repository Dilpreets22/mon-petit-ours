"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeddyCardProps {
  id: number;
  name: string;
  imageSrc: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TeddyCard({ id, name, imageSrc, selected, onClick, className }: TeddyCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-xl p-6 transition-all duration-300 flex flex-col items-center gap-6",
        "bg-white dark:bg-black border border-gray-100 dark:border-gray-900",
        "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700",
        selected && "border-black dark:border-white shadow-xl scale-[1.02]",
        className
      )}
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36 mix-blend-multiply dark:mix-blend-normal">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-contain drop-shadow-sm transition-transform duration-500"
          style={{ transform: selected ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>
      <div className="text-center font-light text-sm tracking-widest uppercase text-foreground">
        {name}
      </div>
      
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-black dark:bg-white rounded-full shadow-md"
        />
      )}
    </motion.div>
  );
}
