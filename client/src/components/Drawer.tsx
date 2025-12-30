import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DrawerProps {
  label: string;
  index: number;
  className?: string;
  onClick?: () => void;
  isPulledOut?: boolean;
  theme?: 'default' | 'blue';
}

export function Drawer({ label, index, className, onClick, isPulledOut, theme = 'default' }: DrawerProps) {
  return (
    <motion.div
      className={cn(
        "relative h-16 rounded shadow-inner border flex items-center justify-center overflow-hidden group/drawer cursor-pointer transition-colors",
        theme === 'blue' 
          ? "bg-[#1e40af] border-[#1e3a8a] hover:bg-[#2563eb]" 
          : "bg-[#5c4033] border-[#3d2b1f] hover:bg-[#6d4c3d]",
        className
      )}
      onClick={onClick}
      initial={{ x: 20, opacity: 0 }}
      animate={{ 
        x: isPulledOut ? 50 : 0, // Pull out effect
        opacity: 1,
        zIndex: isPulledOut ? 50 : 1
      }}
      transition={{ 
        x: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.5, delay: index * 0.1 + 0.3 }
      }}
    >
      {/* Wood Texture Overlay */}
      <div className={cn(
        "absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay",
        theme === 'blue' ? "bg-[url('/images/drawer-bg.jpg')] hue-rotate-180 saturate-50" : "bg-[url('/images/drawer-bg.jpg')]"
      )} />
      
      {/* Drawer Front */}
      <div className="relative z-10 flex items-center gap-3 w-full px-4">
        {/* Handle */}
        <div className={cn(
          "w-8 h-2 rounded-full shadow-sm mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
          theme === 'blue' ? "bg-[#172554]" : "bg-[#2a1d15]"
        )} />
        
        {/* Label */}
        <span className={cn(
          "text-[#fdfbf7] font-serif text-sm tracking-wider z-20 px-2 py-0.5 rounded shadow-sm mx-auto mt-4 group-hover/drawer:text-[#ffd700] transition-colors",
          theme === 'blue' ? "bg-[#1e3a8a]/80" : "bg-[#3d2b1f]/80"
        )}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
