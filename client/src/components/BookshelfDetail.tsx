import { motion } from "framer-motion";
import { X, FileText, ChevronRight } from "lucide-react";

type BookshelfDetailProps = {
  category: string;
  items: any[];
  onClose: () => void;
};

export default function BookshelfDetail({ category, items, onClose }: BookshelfDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl h-[80vh] bg-[#fdfbf7] rounded-lg shadow-2xl overflow-hidden flex flex-col border-8 border-[#3e2723]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 bg-[#3e2723] flex items-center justify-between px-6 shadow-md shrink-0">
          <h2 className="text-2xl font-bold text-[#eaddcf] tracking-widest font-serif">{category}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#5d4037] text-[#eaddcf] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[url('/images/paper-texture.png')] bg-repeat">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded border border-[#d7ccc8] shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8d6e63]" />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#efebe9] rounded flex items-center justify-center text-[#5d4037] group-hover:bg-[#3e2723] group-hover:text-[#eaddcf] transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2c1810] text-sm mb-1 group-hover:text-[#8d6e63] transition-colors">
                      {item.name}分析报告
                    </h3>
                    <p className="text-xs text-[#a1887f] line-clamp-2">
                      关于{item.name}维度的详细数据分析与趋势预测报告，包含核心指标解读。
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-[#d7ccc8] bg-[#5d4037] px-2 py-0.5 rounded-full">
                        {item.count} 篇文档
                      </span>
                      <ChevronRight size={14} className="text-[#a1887f] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 bg-[#efebe9] border-t border-[#d7ccc8] flex items-center justify-between px-6 text-xs text-[#8d6e63]">
          <span>共 {items.length} 个分类</span>
          <span>最后更新: 2025-12-15</span>
        </div>
      </div>
    </motion.div>
  );
}
