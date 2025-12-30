import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ExperienceScrollProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
}

export function ExperienceScroll({ isOpen, onClose, title, content }: ExperienceScrollProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Scroll Container - Horizontal Layout */}
          <motion.div 
            className="relative h-[90vh] bg-[#fdfbf7] shadow-2xl overflow-hidden flex"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "95vw", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            {/* Left Scroll Handle - New Install Style */}
            <div className="w-16 h-full bg-[url('/images/scroll-handle-top.png')] bg-cover bg-center relative z-20 shadow-2xl rounded-l-lg bg-[#e8dcc5] border-r-4 border-[#8a6d5b] flex-shrink-0">
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="h-full w-2 bg-[#5c4033]/20 rounded-full my-4" />
               </div>
            </div>

            {/* Scroll Body (Paper) */}
            <motion.div 
              className="flex-1 h-full bg-[#fdfbf7] relative overflow-hidden shadow-2xl border-y-8 border-[#e8dcc5] flex flex-col -mx-1 z-10"
              initial={{ clipPath: "inset(0 50% 0 50%)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              exit={{ clipPath: "inset(0 50% 0 50%)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Paper Texture */}
              <div className="absolute inset-0 bg-[url('/images/ink-texture-pattern.jpg')] bg-cover bg-center opacity-50 pointer-events-none" />
              
              {/* Close Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-30 hover:bg-[#e8dcc5]/50 text-[#5c4033]"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full p-6 md:p-10 overflow-y-auto custom-scrollbar">
                {/* Title */}
                <div className="text-center mb-16 mt-8">
                  <h2 className="text-5xl font-display text-[#2c1810] mb-4 tracking-widest" style={{ fontFamily: '"Zhi Mang Xing", cursive' }}>{title}</h2>
                  <div className="w-24 h-1.5 bg-[#a67c52] mx-auto rounded-full opacity-80" />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-3 gap-12 px-20">
                  {content.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-[#f5f0e6]/60 border border-[#d4c4b7] p-8 rounded-lg shadow-sm hover:shadow-md hover:bg-[#f5f0e6] transition-all cursor-pointer group text-center"
                    >
                      <h3 className="text-2xl font-serif font-bold text-[#5c4033] group-hover:text-[#8b5a2b] transition-colors">
                        {item}
                      </h3>
                      <div className="w-12 h-0.5 bg-[#d4c4b7] mx-auto mt-4 group-hover:w-24 group-hover:bg-[#8b5a2b] transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Right Scroll Handle (Optional, for symmetry if needed, but MaxTempScroll only has left handle visible in code snippet provided. 
                However, usually scrolls have two handles. Let's check MaxTempScroll again. 
                Ah, the snippet only showed Left Scroll Handle. Let's assume symmetry for better look or stick to the snippet.
                The snippet showed:
                <div className="w-16 h-full ... rounded-l-lg ...">
                And then content.
                Let's add a right handle for symmetry to make it look like a real scroll opening.
            */}
            <div className="w-16 h-full bg-[url('/images/scroll-handle-top.png')] bg-cover bg-center relative z-20 shadow-2xl rounded-r-lg bg-[#e8dcc5] border-l-4 border-[#8a6d5b] flex-shrink-0">
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="h-full w-2 bg-[#5c4033]/20 rounded-full my-4" />
               </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
