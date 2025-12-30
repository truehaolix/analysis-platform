import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface CabinetProps {
  title: string;
  isLocked?: boolean;
  onClick?: () => void;
  isOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
  theme?: 'default' | 'blue';
}

export function Cabinet({ title, isLocked = false, onClick, isOpen = false, className, children, theme = 'default' }: CabinetProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn("relative w-full aspect-[4/3] perspective-1000 group cursor-pointer", className)}
      onClick={!isLocked ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cabinet Frame */}
      <div className={cn(
        "absolute inset-0 rounded-lg shadow-xl border-4 overflow-hidden",
        theme === 'blue' ? "bg-[#1e3a8a] border-[#1e40af]" : "bg-[#3d2b1f] border-[#5c4033]"
      )}>
        {/* Inner Content (Drawers) - Visible when door opens */}
        <div className={cn(
          "absolute inset-0 p-4 grid grid-cols-2 gap-2 content-center z-0",
          theme === 'blue' ? "bg-[#172554]" : "bg-[#2a1d15]"
        )}>
          <div className={cn(
            "absolute inset-0 bg-cover bg-center opacity-50",
            theme === 'blue' ? "bg-[url('/images/drawer-bg.jpg')] hue-rotate-180 saturate-50" : "bg-[url('/images/drawer-bg.jpg')]"
          )} />
          {children}
        </div>

        {/* Cabinet Door */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-cover bg-center origin-left z-10 flex items-center justify-center",
            theme === 'blue' ? "bg-[url('/images/cabinet-door-bg.jpg')] hue-rotate-180 saturate-50" : "bg-[url('/images/cabinet-door-bg.jpg')]"
          )}
          initial={false}
          animate={{ 
            rotateY: isOpen ? -110 : 0,
            filter: isHovered && !isOpen ? "brightness(1.1)" : "brightness(1)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 60, 
            damping: 15,
            mass: 1.2
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Door Label Container */}
          <div className="relative flex flex-col items-center gap-3">
            {/* Embedded Plaque Style */}
            <div className={cn(
              "relative px-5 py-5 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center min-w-[140px] max-w-[180px]",
              theme === 'blue' 
                ? "bg-[#f1f5f9] border-2 border-[#94a3b8]" 
                : "bg-[#fdf6e3] border-2 border-[#8d6e63]" // Warm paper/wood color with bronze border
            )}>
              {/* Four Corner Rivets */}
              {/* Top Left */}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#5d4037] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_1px_rgba(0,0,0,0.3)]" />
              {/* Top Right */}
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5d4037] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_1px_rgba(0,0,0,0.3)]" />
              {/* Bottom Left */}
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#5d4037] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_1px_rgba(0,0,0,0.3)]" />
              {/* Bottom Right */}
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5d4037] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_1px_rgba(0,0,0,0.3)]" />

              {/* Inner Border Line for Detail */}
              <div className={cn(
                "absolute inset-1 border border-dashed opacity-30 rounded-sm pointer-events-none",
                theme === 'blue' ? "border-[#475569]" : "border-[#5d4037]"
              )} />

              <div className={cn(
                "text-2xl font-display font-bold tracking-widest whitespace-nowrap z-10",
                theme === 'blue' ? "text-[#0f172a]" : "text-[#3e2723]"
              )}>
                {title}
              </div>
            </div>
            
            {/* Locked Status - Outside the plate (Absolute Positioned) */}
            {isLocked && (
              <div className="absolute top-full mt-3 text-xs text-[#e6d5c3] font-serif tracking-wider drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-[1px]">
                敬请期待
              </div>
            )}
          </div>

          {/* Handle */}
          <div className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-12 rounded-full shadow-md border",
            theme === 'blue' 
              ? "bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8] border-[#1e3a8a]" 
              : "bg-gradient-to-b from-[#a67c52] to-[#5c4033] border-[#3d2b1f]"
          )} />
        </motion.div>
      </div>
      
      {/* Ink Splash Effect on Hover */}
      {!isOpen && !isLocked && isHovered && (
        <motion.div 
          className="absolute -inset-4 pointer-events-none z-0 opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.3 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="w-full h-full bg-black blur-xl rounded-full" />
        </motion.div>
      )}
    </div>
  );
}
