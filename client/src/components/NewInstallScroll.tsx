import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface NewInstallScrollProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimationComplete?: () => void;
}

const YEARS = ["2022", "2023", "2024", "2025"];
const ANALYSIS_TYPES = ["不同行业", "不同单位"];
const UNITS = ["国网经营区", "北京", "河北", "陕西", "江苏", "浙江", "山东", "福建", "湖北", "湖南", "河南", "江西", "四川", "重庆", "辽宁", "吉林", "黑龙江", "内蒙古", "甘肃", "青海", "宁夏", "新疆", "西藏"];
const INDUSTRIES = ["农林牧渔业", "工业", "建筑业", "交通运输、仓储和邮政业", "信息传输、软件和信息技术服务业", "批发和零售业", "住宿和餐饮业", "金融业", "房地产业", "租赁和商务服务业", "公共服务及管理组织"];

// Mock data generator
const generateData = (items: string[]) => {
  return items.map(item => ({
    name: item,
    capacity: Math.floor(Math.random() * 5000) + 1000,
    time: Math.floor(Math.random() * 12) + 1,
    ratio: Math.floor(Math.random() * 60) + 40,
  })).sort((a, b) => b.capacity - a.capacity);
};

export function NewInstallScroll({ isOpen, onClose, onAnimationComplete }: NewInstallScrollProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [analysisType, setAnalysisType] = useState("不同行业");
  const [selectedUnits, setSelectedUnits] = useState<string[]>(["国网经营区"]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(INDUSTRIES);
  const [chartData, setChartData] = useState<any[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Update chart data when selections change
  useEffect(() => {
    const items = analysisType === "不同行业" ? selectedIndustries : selectedUnits;
    setChartData(generateData(items));
  }, [analysisType, selectedIndustries, selectedUnits]);

  // Sort data for each chart independently
  const sortedByCapacity = [...chartData].sort((a, b) => b.capacity - a.capacity);
  const sortedByTime = [...chartData].sort((a, b) => b.time - a.time);
  const sortedByRatio = [...chartData].sort((a, b) => b.ratio - a.ratio);

  // Handle analysis type change logic
  const handleAnalysisTypeChange = (type: string) => {
    setAnalysisType(type);
    if (type === "不同单位") {
      // Switch to Different Units: Unit becomes multi, Industry becomes single
      // Keep last selected industry
      const lastIndustry = selectedIndustries[selectedIndustries.length - 1] || INDUSTRIES[0];
      setSelectedIndustries([lastIndustry]);
    } else {
      // Switch to Different Industries: Industry becomes multi, Unit becomes single
      // Keep last selected unit
      const lastUnit = selectedUnits[selectedUnits.length - 1] || UNITS[0];
      setSelectedUnits([lastUnit]);
    }
  };

  // Helper to toggle selection for multi-select
  const toggleSelection = (item: string, currentList: string[], setList: (list: string[]) => void) => {
    if (currentList.includes(item)) {
      if (currentList.length === 1) return; // Keep at least one
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Scroll Container - Horizontal Layout */}
          <motion.div 
            className="relative h-[90vh] bg-[#fdfbf7] shadow-2xl overflow-hidden flex"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "95vw", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }} // Slower animation for "徐徐展开" feel
          >
            {/* Left Scroll Handle */}
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
              {/* Paper Texture - Fixed background repeat issue */}
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
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-display text-[#2c1810] mb-2">新装规律</h2>
                  <div className="w-16 h-1 bg-[#a67c52] mx-auto rounded-full" />
                </div>

                {/* Filters Area */}
                <div className="bg-[#f5f0e6]/80 p-6 rounded-lg border border-[#d4c4b7] mb-8 space-y-6 shadow-sm">
                  
                  {/* Row 1: Year & Analysis Type */}
                  <div className="flex flex-wrap gap-8 items-center">
                    {/* Year Selector */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">选择年份：</span>
                      <div className="flex bg-[#e8dcc5] rounded-md p-1 border border-[#d4c4b7]">
                        {YEARS.map(year => (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={cn(
                              "px-4 py-1.5 rounded-sm text-sm font-serif transition-all",
                              selectedYear === year 
                                ? "bg-[#5c4033] text-[#fdfbf7] shadow-sm" 
                                : "text-[#5c4033] hover:bg-[#d4c4b7]/50"
                            )}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Type Selector */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">对比分析：</span>
                      <div className="flex bg-[#e8dcc5] rounded-md p-1 border border-[#d4c4b7]">
                        {ANALYSIS_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => handleAnalysisTypeChange(type)}
                            className={cn(
                              "px-4 py-1.5 rounded-sm text-sm font-serif transition-all",
                              analysisType === type 
                                ? "bg-[#5c4033] text-[#fdfbf7] shadow-sm" 
                                : "text-[#5c4033] hover:bg-[#d4c4b7]/50"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Unit & Industry Selectors (Dropdowns) */}
                  <div className="flex flex-wrap gap-8 items-center">
                    {/* Industry Selector (Swapped Position) */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">选择行业：</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-between bg-[#fdfbf7] border-[#d4c4b7] text-[#5c4033]">
                            <span className="truncate">
                              {selectedIndustries.length > 0 
                                ? (selectedIndustries.length === INDUSTRIES.length ? "全部行业" : `${selectedIndustries[0]}${selectedIndustries.length > 1 ? ` (+${selectedIndustries.length - 1})` : ''}`)
                                : "请选择行业"}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-[#fdfbf7] border-[#d4c4b7]">
                          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {INDUSTRIES.map(industry => {
                              const isSelected = selectedIndustries.includes(industry);
                              const isMulti = analysisType === "不同行业";
                              return (
                                <div 
                                  key={industry}
                                  className="flex items-center space-x-2 p-2 hover:bg-[#e8dcc5]/50 rounded cursor-pointer"
                                  onClick={() => {
                                    if (isMulti) {
                                      toggleSelection(industry, selectedIndustries, setSelectedIndustries);
                                    } else {
                                      setSelectedIndustries([industry]);
                                    }
                                  }}
                                >
                                  <Checkbox 
                                    checked={isSelected}
                                    className="border-[#8a6d5b] data-[state=checked]:bg-[#5c4033] data-[state=checked]:text-[#fdfbf7]"
                                  />
                                  <span className="text-sm text-[#5c4033]">{industry}</span>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Unit Selector (Swapped Position) */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">选择单位：</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-between bg-[#fdfbf7] border-[#d4c4b7] text-[#5c4033]">
                            <span className="truncate">
                              {selectedUnits.length > 0 
                                ? (selectedUnits.length === UNITS.length ? "全部单位" : `${selectedUnits[0]}${selectedUnits.length > 1 ? ` (+${selectedUnits.length - 1})` : ''}`)
                                : "请选择单位"}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0 bg-[#fdfbf7] border-[#d4c4b7]">
                          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {UNITS.map(unit => {
                              const isSelected = selectedUnits.includes(unit);
                              const isMulti = analysisType === "不同单位";
                              return (
                                <div 
                                  key={unit}
                                  className="flex items-center space-x-2 p-2 hover:bg-[#e8dcc5]/50 rounded cursor-pointer"
                                  onClick={() => {
                                    if (isMulti) {
                                      toggleSelection(unit, selectedUnits, setSelectedUnits);
                                    } else {
                                      setSelectedUnits([unit]);
                                    }
                                  }}
                                >
                                  <Checkbox 
                                    checked={isSelected}
                                    className="border-[#8a6d5b] data-[state=checked]:bg-[#5c4033] data-[state=checked]:text-[#fdfbf7]"
                                  />
                                  <span className="text-sm text-[#5c4033]">{unit}</span>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                </div>

                {/* Charts Area */}
                <div className="flex-1 grid grid-cols-3 gap-6 min-h-[400px]">
                  {/* Chart 1: Capacity Impact */}
                  <div className="bg-white/50 rounded-lg border border-[#d4c4b7] p-4 flex flex-col">
                    <h3 className="text-center font-serif font-bold text-[#5c4033] mb-4">单位容量影响电量（万千瓦时）</h3>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          layout="vertical" 
                          data={sortedByCapacity} 
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          onMouseMove={(state) => {
                            if (state.activePayload) {
                              setHoveredItem(state.activePayload[0].payload.name);
                            }
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d4c4b7" />
                          <XAxis type="number" stroke="#8a6d5b" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="#8a6d5b" fontSize={12} width={80} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#8a6d5b', color: '#5c4033' }}
                            itemStyle={{ color: '#5c4033' }}
                            formatter={(value: any, name: any, props: any) => {
                              // Recharts passes the dataKey in the 'name' parameter for Bar charts if not overridden, 
                              // or we can infer it from the context if we hardcode it per chart.
                              // Since we have 3 separate charts, we can just hardcode the metric name for each instance.
                              // However, to keep the generic replacement working, let's try to detect based on value range or just use a simpler approach.
                              
                              // Actually, the previous replacement applied the SAME function to all 3 charts.
                              // We need to customize it for each chart to be correct.
                              // But since I used 'all: true', I need to make this function smart enough or edit them individually.
                              
                              // Let's use the 'name' prop which usually contains the dataKey
                              let metricName = "数值";
                              if (name === "capacity") metricName = "单位容量影响电量";
                              if (name === "time") metricName = "平均稳定时间";
                              if (name === "ratio") metricName = "投运比例";
                              
                              return [name === "ratio" ? `${value}%` : value, metricName];
                            }}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Bar dataKey="capacity" radius={[0, 4, 4, 0]} barSize={20}>
                            {sortedByCapacity.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={hoveredItem === entry.name ? "#5c4033" : "#a67c52"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Average Stable Time */}
                  <div className="bg-white/50 rounded-lg border border-[#d4c4b7] p-4 flex flex-col">
                    <h3 className="text-center font-serif font-bold text-[#5c4033] mb-4">平均稳定时间（月）</h3>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          layout="vertical" 
                          data={sortedByTime} 
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          onMouseMove={(state) => {
                            if (state.activePayload) {
                              setHoveredItem(state.activePayload[0].payload.name);
                            }
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d4c4b7" />
                          <XAxis type="number" stroke="#8a6d5b" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="#8a6d5b" fontSize={12} width={80} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#8a6d5b', color: '#5c4033' }}
                            itemStyle={{ color: '#5c4033' }}
                            formatter={(value: any, name: any, props: any) => {
                              // Recharts passes the dataKey in the 'name' parameter for Bar charts if not overridden, 
                              // or we can infer it from the context if we hardcode it per chart.
                              // Since we have 3 separate charts, we can just hardcode the metric name for each instance.
                              // However, to keep the generic replacement working, let's try to detect based on value range or just use a simpler approach.
                              
                              // Actually, the previous replacement applied the SAME function to all 3 charts.
                              // We need to customize it for each chart to be correct.
                              // But since I used 'all: true', I need to make this function smart enough or edit them individually.
                              
                              // Let's use the 'name' prop which usually contains the dataKey
                              let metricName = "数值";
                              if (name === "capacity") metricName = "单位容量影响电量";
                              if (name === "time") metricName = "平均稳定时间";
                              if (name === "ratio") metricName = "投运比例";
                              
                              return [name === "ratio" ? `${value}%` : value, metricName];
                            }}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={20}>
                            {sortedByTime.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={hoveredItem === entry.name ? "#5c4033" : "#8a6d5b"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 3: Operation Ratio */}
                  <div className="bg-white/50 rounded-lg border border-[#d4c4b7] p-4 flex flex-col">
                    <h3 className="text-center font-serif font-bold text-[#5c4033] mb-4">投运比例（%）</h3>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          layout="vertical" 
                          data={sortedByRatio} 
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          onMouseMove={(state) => {
                            if (state.activePayload) {
                              setHoveredItem(state.activePayload[0].payload.name);
                            }
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d4c4b7" />
                          <XAxis type="number" stroke="#8a6d5b" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="#8a6d5b" fontSize={12} width={80} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#8a6d5b', color: '#5c4033' }}
                            itemStyle={{ color: '#5c4033' }}
                            formatter={(value: any, name: any, props: any) => {
                              // Recharts passes the dataKey in the 'name' parameter for Bar charts if not overridden, 
                              // or we can infer it from the context if we hardcode it per chart.
                              // Since we have 3 separate charts, we can just hardcode the metric name for each instance.
                              // However, to keep the generic replacement working, let's try to detect based on value range or just use a simpler approach.
                              
                              // Actually, the previous replacement applied the SAME function to all 3 charts.
                              // We need to customize it for each chart to be correct.
                              // But since I used 'all: true', I need to make this function smart enough or edit them individually.
                              
                              // Let's use the 'name' prop which usually contains the dataKey
                              let metricName = "数值";
                              if (name === "capacity") metricName = "单位容量影响电量";
                              if (name === "time") metricName = "平均稳定时间";
                              if (name === "ratio") metricName = "投运比例";
                              
                              return [name === "ratio" ? `${value}%` : value, metricName];
                            }}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Bar dataKey="ratio" radius={[0, 4, 4, 0]} barSize={20}>
                            {sortedByRatio.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={hoveredItem === entry.name ? "#5c4033" : "#a67c52"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right Scroll Handle */}
            <div className="w-16 h-full bg-[url('/images/scroll-handle-bottom.png')] bg-cover bg-center relative z-20 shadow-2xl rounded-r-lg bg-[#e8dcc5] border-l-4 border-[#8a6d5b] flex-shrink-0">
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
