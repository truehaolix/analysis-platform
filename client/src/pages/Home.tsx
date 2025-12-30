import { Cabinet } from "@/components/Cabinet";
import { Drawer } from "@/components/Drawer";
import { NewInstallScroll } from "@/components/NewInstallScroll";
import { MaxTempScroll } from "@/components/MaxTempScroll";
import { PasswordModal } from "@/components/PasswordModal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [openCabinet, setOpenCabinet] = useState<string | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean; cabinetId: string; title: string; password?: string }>({
    isOpen: false,
    cabinetId: "",
    title: "",
  });
  const [isNewInstallScrollOpen, setIsNewInstallScrollOpen] = useState(false);
  const [isMaxTempScrollOpen, setIsMaxTempScrollOpen] = useState(false);
  // Track unlocked cabinets to avoid asking password again
  const [unlockedCabinets, setUnlockedCabinets] = useState<Set<string>>(new Set());

  const cabinets = [
    { id: "temp", title: "调温规律", isLocked: false, password: "fxyc" },
    { id: "expansion", title: "业扩规律", isLocked: false, password: "wangyang" },
    { id: "daytype", title: "日类型规律", isLocked: true },
    { id: "economic", title: "经济规律", isLocked: true },
    { id: "price", title: "分时电价规律", isLocked: true },
    { id: "weather", title: "极端气象规律", isLocked: true },
  ];

  const tempDrawers = [
    "最高温度", "最低温度", "平均温度", 
    "体感（最高）", "体感（最低）", "体感（平均）"
  ];

  const expansionDrawers = [
    "新装", "增容", "减容", "销户"
  ];

  const handleCabinetClick = (id: string) => {
    if (openCabinet === id) {
      setOpenCabinet(null);
      return;
    }

    const cabinet = cabinets.find(c => c.id === id);
    if (!cabinet) return;

    // If cabinet has password and hasn't been unlocked yet
    if (cabinet.password && !unlockedCabinets.has(id)) {
      setPasswordModal({
        isOpen: true,
        cabinetId: id,
        title: cabinet.title,
        password: cabinet.password
      });
    } else {
      setOpenCabinet(id);
    }
  };

  const handlePasswordSuccess = () => {
    setUnlockedCabinets(prev => new Set(prev).add(passwordModal.cabinetId));
    setOpenCabinet(passwordModal.cabinetId);
  };

  const [animatingDrawer, setAnimatingDrawer] = useState<string | null>(null);

  const handleDrawerClick = (drawerLabel: string) => {
    if (drawerLabel === "新装") {
      setAnimatingDrawer("新装");
      // Wait for drawer pull-out animation before opening scroll
      setTimeout(() => {
        setIsNewInstallScrollOpen(true);
        // Explicitly ensure cabinet stays open
        if (!openCabinet) {
           setOpenCabinet('expansion');
        }
      }, 600);
    } else if (drawerLabel === "最高温度") {
      setAnimatingDrawer("最高温度");
      setTimeout(() => {
        setIsMaxTempScrollOpen(true);
        if (!openCabinet) {
          setOpenCabinet('temp');
        }
      }, 600);
    }
  };

  const handleScrollClose = () => {
    setIsNewInstallScrollOpen(false);
    // Drawer push-back animation will be triggered after scroll closes (via onAnimationComplete)
  };

  const handleMaxTempScrollClose = () => {
    setIsMaxTempScrollOpen(false);
  };

  const handleScrollAnimationComplete = () => {
    // Scroll closed, now push drawer back
    if (!isNewInstallScrollOpen) {
      setAnimatingDrawer(null);
      // Ensure cabinet remains open
      if (!openCabinet) {
        setOpenCabinet('expansion');
      }
    }
  };

  const handleMaxTempScrollAnimationComplete = () => {
    if (!isMaxTempScrollOpen) {
      setAnimatingDrawer(null);
      if (!openCabinet) {
        setOpenCabinet('temp');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/ink-landscape-bg.jpg')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fdfbf7]/30 to-[#fdfbf7]" />
      </div>

      {/* Main Content Container - Scroll */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <header className="text-center mb-12 relative">
          <motion.h1 
            className="text-5xl md:text-6xl font-display text-[#2c1810] mb-2 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            分析规律沉淀
          </motion.h1>
          <div className="w-24 h-1 bg-[#2c1810] mx-auto rounded-full opacity-80 mb-4" />
          <p className="text-[#5c4033] font-serif text-lg tracking-widest">经验成果库</p>
        </header>

        {/* Cabinets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-12">
          {cabinets.map((cabinet) => (
            <div key={cabinet.id} className="relative">
              <Cabinet
                title={cabinet.title}
                isLocked={cabinet.isLocked}
                isOpen={openCabinet === cabinet.id}
                onClick={() => handleCabinetClick(cabinet.id)}
              >
                {cabinet.id === 'temp' && tempDrawers.map((drawer, idx) => (
                  <Drawer 
                    key={idx} 
                    label={drawer} 
                    index={idx} 
                    onClick={() => handleDrawerClick(drawer)}
                    isPulledOut={animatingDrawer === drawer}
                  />
                ))}
                {cabinet.id === 'expansion' && expansionDrawers.map((drawer, idx) => (
                  <Drawer 
                    key={idx} 
                    label={drawer} 
                    index={idx} 
                    onClick={() => handleDrawerClick(drawer)}
                    isPulledOut={animatingDrawer === drawer}
                  />
                ))}
              </Cabinet>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdfbf7] to-transparent pointer-events-none z-20" />

      <PasswordModal
        isOpen={passwordModal.isOpen}
        onClose={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
        onSuccess={handlePasswordSuccess}
        title={passwordModal.title}
        correctPassword={passwordModal.password}
      />

      <NewInstallScroll 
        isOpen={isNewInstallScrollOpen}
        onClose={handleScrollClose}
        onAnimationComplete={handleScrollAnimationComplete}
      />
      <MaxTempScroll 
        isOpen={isMaxTempScrollOpen} 
        onClose={handleMaxTempScrollClose}
        onAnimationComplete={handleMaxTempScrollAnimationComplete}
      />
    </div>
  );
}
