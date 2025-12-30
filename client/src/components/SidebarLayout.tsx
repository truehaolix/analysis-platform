import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, BookOpen, LayoutDashboard, Library, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  const menuItems = [
    {
      title: "",
      items: [
        { name: "首页", path: "/dashboard", icon: Home },
        { name: "分析规律沉淀", path: "/", icon: BookOpen },
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#fdfbf7] overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        className={cn(
          "relative h-full bg-[#2c1810] border-r border-[#3e2b22] shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
      >
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 bg-[url('/images/wood-pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />

        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-[#a67c52] text-[#2c1810] rounded-full p-1 shadow-md hover:bg-[#c49a6c] transition-colors z-50 border border-[#2c1810]"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo / Title Area */}
        <div className="p-6 border-b border-[#3e2b22] flex items-center justify-center h-24 relative z-10 bg-[#1a0f0a]/30">
          {isCollapsed ? (
            <div className="w-10 h-10 bg-[#a67c52] rounded-md flex items-center justify-center text-[#2c1810] font-serif font-bold shadow-inner border border-[#8a6d5b]">
              库
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-xl font-display font-bold text-[#e8dcc5] tracking-widest drop-shadow-sm">经验成果库</h1>
              <div className="w-12 h-0.5 bg-[#a67c52] mx-auto mt-2 opacity-60" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-8 overflow-y-auto custom-scrollbar relative z-10">
          {menuItems.map((group, idx) => (
            <div key={idx} className="mb-8">
              {!isCollapsed && group.title && (
                <h3 className="px-6 mb-3 text-xs font-bold text-[#8a6d5b] uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#8a6d5b] rounded-full" />
                  {group.title}
                </h3>
              )}
              <div className="space-y-2 px-3">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div 
                        className={cn(
                          "flex items-center gap-4 px-3 py-3.5 rounded-md cursor-pointer transition-all duration-300 group relative overflow-hidden",
                          isActive 
                            ? "bg-[#3e2b22] text-[#e8dcc5] shadow-inner border border-[#5c4033]" 
                            : "text-[#a67c52] hover:bg-[#3e2b22]/50 hover:text-[#e8dcc5]"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#a67c52]" />
                        )}
                        <item.icon size={20} className={cn("flex-shrink-0 transition-colors", isActive ? "text-[#a67c52]" : "text-[#8a6d5b] group-hover:text-[#a67c52]")} />
                        {!isCollapsed && (
                          <span className="font-serif font-medium whitespace-nowrap overflow-hidden text-ellipsis tracking-wide">
                            {item.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Decoration */}
        <div className="p-4 border-t border-[#3e2b22] bg-[#1a0f0a]/30 relative z-10">
          {!isCollapsed && (
            <div className="flex flex-col items-center gap-1">
              {/* Footer text removed */}
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto relative bg-[#fdfbf7]">
        {children}
      </div>
    </div>
  );
}
