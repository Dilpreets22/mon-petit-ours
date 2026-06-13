"use client";

import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { ArcadeControls } from "./ArcadeControls";

interface Teddy {
  id: number;
  name: string;
  imageSrc: string;
}

const TEDDIES: Teddy[] = [
  { id: 1, name: "The Classic", imageSrc: "/assets/teddy1.png" },
  { id: 2, name: "The Dreamer", imageSrc: "/assets/teddy2.png" },
  { id: 3, name: "The Companion", imageSrc: "/assets/teddy3.png" },
  { id: 4, name: "The Guardian", imageSrc: "/assets/teddy4.png" },
];

interface ClawMachineProps {
  correctTeddyId: number;
  onSuccess: () => void;
  onFail: () => void;
}

export function ClawMachine({ correctTeddyId, onSuccess, onFail }: ClawMachineProps) {
  const [clawX, setClawX] = useState(50);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [grabbedTeddy, setGrabbedTeddy] = useState<number | null>(null);
  
  const clawControls = useAnimation();
  const machineRef = useRef<HTMLDivElement>(null);

  const MIN_X = 10;
  const MAX_X = 90;
  const CHUTE_X = 15;

  const moveLeft = () => {
    if (isGrabbing) return;
    setClawX((prev) => Math.max(MIN_X, prev - 10));
  };

  const moveRight = () => {
    if (isGrabbing) return;
    setClawX((prev) => Math.min(MAX_X, prev + 10));
  };

  const handleGrab = async () => {
    if (isGrabbing) return;
    setIsGrabbing(true);

    await clawControls.start({ y: "55vh", transition: { duration: 1.2, ease: "easeIn" } });

    let caughtId: number | null = null;
    if (clawX >= 15 && clawX <= 35) caughtId = 1;
    else if (clawX >= 35 && clawX <= 55) caughtId = 2;
    else if (clawX >= 55 && clawX <= 75) caughtId = 3;
    else if (clawX >= 75 && clawX <= 95) caughtId = 4;

    if (caughtId) setGrabbedTeddy(caughtId);

    await clawControls.start({ y: "0vh", transition: { duration: 1.2, ease: "easeOut" } });

    if (caughtId) {
      setClawX(CHUTE_X);
      await new Promise(resolve => setTimeout(resolve, 800));

      setGrabbedTeddy(null);
      
      if (caughtId === correctTeddyId) {
        setTimeout(onSuccess, 400);
      } else {
        setTimeout(onFail, 400);
      }
    } else {
      setTimeout(onFail, 400);
    }

    setTimeout(() => {
      setClawX(50);
      setIsGrabbing(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* The Machine Cabinet */}
      <div 
        ref={machineRef}
        className="relative w-full aspect-[4/5] bg-white/40 dark:bg-black/40 rounded-t-xl border-x-[12px] border-t-[12px] border-gray-100 dark:border-gray-900 overflow-hidden shadow-2xl backdrop-blur-md"
      >
        {/* Sleek metallic top bar */}
        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm border-b border-gray-300 dark:border-black z-30 flex items-center justify-center">
           <div className="w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* The Rails */}
        <div className="absolute top-8 w-full h-3 bg-gray-800 dark:bg-black shadow-inner z-20" />

        {/* The Claw System */}
        <motion.div 
          className="absolute top-8 w-12 flex flex-col items-center z-20"
          animate={{ x: `calc(${clawX}% - 1.5rem)` }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
          style={{ left: 0 }}
        >
          {/* Cable */}
          <motion.div 
            className="w-0.5 bg-gray-500 dark:bg-gray-400 origin-top"
            animate={clawControls}
            style={{ height: '4rem' }}
          />
          {/* Claw Body - Elegant minimalistic metal claw */}
          <motion.div 
            animate={clawControls}
            className="relative w-12 h-14 drop-shadow-sm flex justify-center"
          >
            <div className="absolute top-0 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 rounded-sm border border-gray-400 dark:border-gray-500" />
            <div className="absolute top-5 left-1 w-2 h-10 border-l-2 border-b-2 border-gray-500 dark:border-gray-400 rounded-bl-md origin-top rotate-12" />
            <div className="absolute top-5 right-1 w-2 h-10 border-r-2 border-b-2 border-gray-500 dark:border-gray-400 rounded-br-md origin-top -rotate-12" />
            
            {/* Grabbed Teddy */}
            {grabbedTeddy && (
              <motion.div 
                className="absolute top-8 w-16 h-16 pointer-events-none"
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ rotate: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Image 
                  src={TEDDIES.find(t => t.id === grabbedTeddy)?.imageSrc || ""} 
                  alt="Grabbed Teddy" 
                  fill 
                  className="object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-md"
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Teddies inside the machine */}
        <div className="absolute bottom-16 w-full flex justify-around px-6 z-10 items-end">
          {TEDDIES.map((teddy) => {
            if (grabbedTeddy === teddy.id) return <div key={teddy.id} className="w-16 h-16 md:w-20 md:h-20" />;
            
            return (
              <div key={teddy.id} className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-sm mix-blend-multiply dark:mix-blend-normal">
                <Image src={teddy.imageSrc} alt={teddy.name} fill className="object-contain" />
              </div>
            );
          })}
        </div>

        {/* Elegant Display Base */}
        <div className="absolute bottom-0 w-full h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between px-8" />

        {/* Minimal Prize Chute Hole */}
        <div className="absolute bottom-4 left-[12%] w-16 h-10 bg-black/10 dark:bg-black/50 rounded border border-gray-300 dark:border-gray-700 shadow-inner z-0" />
        
        {/* Subtle Glass Reflection */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Arcade Controls Area */}
      <div className="w-full -mt-2 relative z-30">
        <ArcadeControls 
          onMoveLeft={moveLeft} 
          onMoveRight={moveRight} 
          onGrab={handleGrab} 
          disabled={isGrabbing}
        />
      </div>
    </div>
  );
}
