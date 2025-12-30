import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MaxTempScrollProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimationComplete?: () => void;
}

const YEARS = ["2022", "2023", "2024", "2025"];
const UNITS = ["国网经营区", "北京", "天津", "河北", "冀北", "山西", "山东", "上海", "江苏", "浙江", "安徽", "福建", "湖北", "湖南", "河南", "江西", "四川", "重庆", "辽宁", "吉林", "黑龙江", "内蒙古", "甘肃", "青海", "宁夏", "新疆", "西藏"];
const INDUSTRIES = ["全社会用电", "农林牧渔业", "工业", "建筑业", "交通运输、仓储和邮政业", "信息传输、软件和信息技术服务业", "批发和零售业", "住宿和餐饮业", "金融业", "房地产业", "租赁和商务服务业", "公共服务及管理组织"];
const TEMP_TYPES = ["降温", "取暖"];
const ANALYSIS_TYPES = ["不同行业", "不同单位"];
const OBJECT_TYPES = ["最大负荷", "用电量"];

// Mock data generator for heatmap
const generateHeatmapData = (units: string[], industries: string[]) => {
  // Sort units: if "国网经营区" is selected, put it first
  let sortedUnits = [...units];
  if (sortedUnits.includes("国网经营区")) {
    sortedUnits = [
      "国网经营区",
      ...sortedUnits.filter(u => u !== "国网经营区")
    ];
  }

  return sortedUnits.map(unit => {
    const row: any = { unit };
    industries.forEach(industry => {
      // Generate random correlation value between 0.5 and 1.0
      row[industry] = (Math.random() * 0.5 + 0.5).toFixed(2);
      // Generate mock max load/electricity for tooltip
      row[`${industry}_max`] = Math.floor(Math.random() * 5000 + 1000);
    });
    return row;
  });
};

// Mock data generator for sensitivity analysis
const generateSensitivityData = (items: string[]) => {
  return items.map(item => ({
    name: item,
    // Ensure split point is consistent for sorting logic (e.g. higher split point = higher temp range start)
    splitPoint: Math.floor(Math.random() * 10) + 15, // 15-25
    lowTempLoad: parseFloat((Math.random() * 100 + 50).toFixed(1)),
    highTempLoad: parseFloat((Math.random() * 100 + 50).toFixed(1)),
  }));
};

// Mock data generator for theoretical extreme values
const generateExtremeData = (units: string[]) => {
  return units.map(unit => {
    const years = ["2022", "2023", "2024", "2025"];
    const data: any = { name: unit };
    
    years.forEach(year => {
      // Generate total value directly
      data[`y${year}`] = Math.floor(Math.random() * 2000) + 1000;
    });
    
    return data;
  });
};

// Mock data generator for accumulated temperature effect
const generateAccumulatedTempData = (units: string[], year: string) => {
  return units.map(unit => {
    const days = Math.floor(Math.random() * 5) + 3; // 3-7 days
    const temp = Math.floor(Math.random() * 5) + 35; // 35-39 degrees
    const load = Math.floor(Math.random() * 500) + 100; // 100-600 load
    return {
      name: unit,
      description: `最高温度连续${days}天超过${temp}℃时，产生积温效应。即使温度不再显著升高，负荷仍会进一步增长${load}万千瓦。`
    };
  });
};

export function MaxTempScroll({ isOpen, onClose, onAnimationComplete }: MaxTempScrollProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [tempType, setTempType] = useState("降温");
  const [analysisType, setAnalysisType] = useState("不同行业");
  const [objectType, setObjectType] = useState("最大负荷");
  const [selectedUnits, setSelectedUnits] = useState<string[]>(["国网经营区", "北京", "天津", "河北", "冀北", "山西", "山东"]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(INDUSTRIES.slice(0, 6));
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [extremeData, setExtremeData] = useState<any[]>([]);
  const [accumulatedTempData, setAccumulatedTempData] = useState<any[]>([]);
  const [accumulatedYear, setAccumulatedYear] = useState("2024");
  
  // Independent sorting states for 3 columns
  const [sortConfig1, setSortConfig1] = useState<{
    column: 'splitPoint';
    direction: 'asc' | 'desc';
  }>({ column: 'splitPoint', direction: 'desc' });

  const [sortConfig2, setSortConfig2] = useState<{
    column: 'lowTempLoad';
    direction: 'asc' | 'desc';
  }>({ column: 'lowTempLoad', direction: 'desc' });

  const [sortConfig3, setSortConfig3] = useState<{
    column: 'highTempLoad';
    direction: 'asc' | 'desc';
  }>({ column: 'highTempLoad', direction: 'desc' });

  // Hover state for cross-highlighting
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const [heatmapHover, setHeatmapHover] = useState<{row: string, col: string} | null>(null);

  // Update heatmap data when selections change
  useEffect(() => {
    setHeatmapData(generateHeatmapData(selectedUnits, selectedIndustries));
  }, [selectedUnits, selectedIndustries]);

  // Update sensitivity data based on analysis type
  useEffect(() => {
    const items = analysisType === "不同行业" ? selectedIndustries : selectedUnits;
    setSensitivityData(generateSensitivityData(items));
  }, [analysisType, selectedIndustries, selectedUnits]);

  // Update extreme data based on selected units (independent of accumulatedYear)
  useEffect(() => {
    setExtremeData(generateExtremeData(selectedUnits));
  }, [selectedUnits]);

  // Update accumulated temp data based on selected units and year
  useEffect(() => {
    setAccumulatedTempData(generateAccumulatedTempData(selectedUnits, accumulatedYear));
  }, [selectedUnits, accumulatedYear]);

  // Generate trend data
  useEffect(() => {
    const data = YEARS.map(year => {
      // Base values
      const baseLoad = Math.floor(Math.random() * 3000) + 1000;
      const coolingLoad = Math.floor(Math.random() * 1500) + 500;
      const heatingLoad = Math.floor(Math.random() * 1000) + 200;
      
      const baseElec = Math.floor(Math.random() * 5000) + 2000;
      const coolingElec = Math.floor(Math.random() * 2000) + 800;
      const heatingElec = Math.floor(Math.random() * 1500) + 400;

      return {
        year,
        temp: Math.floor(Math.random() * 15) + 25, // 25-40 degrees
        // Load data
        baseLoad,
        coolingLoad,
        heatingLoad,
        totalLoad: baseLoad + coolingLoad + heatingLoad,
        // Electricity data
        baseElec,
        coolingElec,
        heatingElec,
        totalElec: baseElec + coolingElec + heatingElec,
      };
    });
    setTrendData(data);
  }, [selectedUnits, selectedIndustries, objectType]);

  // Handle analysis type change logic
  const handleAnalysisTypeChange = (type: string) => {
    setAnalysisType(type);
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

  // Helper to get ink style color and size based on value
  const getInkStyle = (value: number) => {
    // Ink opacity and size based on correlation value
    // Higher value = darker and larger ink blot
    let opacity = 0.2;
    let scale = 0.6;
    
    if (value >= 0.95) { opacity = 0.9; scale = 1.0; }
    else if (value >= 0.90) { opacity = 0.75; scale = 0.9; }
    else if (value >= 0.85) { opacity = 0.6; scale = 0.8; }
    else if (value >= 0.80) { opacity = 0.45; scale = 0.7; }
    else { opacity = 0.3; scale = 0.6; }

    return {
      backgroundColor: `rgba(92, 64, 51, ${opacity})`, // #5c4033 (dark brown/ink color)
      transform: `scale(${scale})`,
      boxShadow: `0 0 ${10 * scale}px rgba(92, 64, 51, ${opacity * 0.5})` // Soft ink diffusion
    };
  };

  // Find max values for marking
  const getMaxValues = () => {
    const rowMax: Record<string, number> = {};
    const colMax: Record<string, number> = {};
    
    heatmapData.forEach(row => {
      let rMax = 0;
      selectedIndustries.forEach(ind => {
        const val = parseFloat(row[ind]);
        if (val > rMax) rMax = val;
        
        if (!colMax[ind] || val > colMax[ind]) {
          colMax[ind] = val;
        }
      });
      rowMax[row.unit] = rMax;
    });
    
    return { rowMax, colMax };
  };

  const { rowMax, colMax } = getMaxValues();

  // Sort handlers
  const handleSort1 = () => {
    setSortConfig1(current => ({
      column: 'splitPoint',
      direction: current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSort2 = () => {
    setSortConfig2(current => ({
      column: 'lowTempLoad',
      direction: current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSort3 = () => {
    setSortConfig3(current => ({
      column: 'highTempLoad',
      direction: current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Get sorted data for each column
  const getSortedData = (data: any[], config: { column: string, direction: 'asc' | 'desc' }) => {
    return [...data].sort((a, b) => {
      const aValue = a[config.column];
      const bValue = b[config.column];
      return config.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const sortedData1 = getSortedData(sensitivityData, sortConfig1);
  const sortedData2 = getSortedData(sensitivityData, sortConfig2);
  const sortedData3 = getSortedData(sensitivityData, sortConfig3);

  // Custom Tooltip for Bar Charts
  const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#fdfbf7] border border-[#d4c4b7] p-3 rounded shadow-lg">
          <p className="text-[#5c4033] font-bold mb-1">{label}</p>
          <p className="text-[#5c4033] text-sm">
            {type === 'low' ? '低温段温升负荷' : '高温段温升负荷'}: <span className="font-mono font-bold">{payload[0].value}</span> 万千瓦
          </p>
        </div>
      );
    }
    return null;
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
                  <h2 className="text-4xl font-display text-[#2c1810] mb-2">最高温度规律</h2>
                  <div className="w-16 h-1 bg-[#a67c52] mx-auto rounded-full" />
                </div>

                {/* Filters Area */}
                <div className="bg-[#f5f0e6]/80 p-6 rounded-lg border border-[#d4c4b7] mb-8 space-y-6 shadow-sm">
                  
                  {/* Row 1: Year, Temp Type, Object Type */}
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

                    {/* Temp Type Selector */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">类型：</span>
                      <div className="flex bg-[#e8dcc5] rounded-md p-1 border border-[#d4c4b7]">
                        {TEMP_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => setTempType(type)}
                            className={cn(
                              "px-4 py-1.5 rounded-sm text-sm font-serif transition-all",
                              tempType === type 
                                ? "bg-[#5c4033] text-[#fdfbf7] shadow-sm" 
                                : "text-[#5c4033] hover:bg-[#d4c4b7]/50"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Object Type Selector */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033]">对象：</span>
                      <div className="flex bg-[#e8dcc5] rounded-md p-1 border border-[#d4c4b7]">
                        {OBJECT_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => setObjectType(type)}
                            className={cn(
                              "px-4 py-1.5 rounded-sm text-sm font-serif transition-all",
                              objectType === type 
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
                    {/* Unit Selector (Multi-select) */}
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
                        <PopoverContent className="w-[300px] p-0 bg-[#fdfbf7] border-[#d4c4b7]">
                          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {UNITS.map(unit => {
                              const isSelected = selectedUnits.includes(unit);
                              return (
                                <div 
                                  key={unit}
                                  className="flex items-center space-x-2 p-2 hover:bg-[#e8dcc5]/50 rounded cursor-pointer"
                                  onClick={() => toggleSelection(unit, selectedUnits, setSelectedUnits)}
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

                    {/* Industry Selector (Multi-select) */}
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
                              return (
                                <div 
                                  key={industry}
                                  className="flex items-center space-x-2 p-2 hover:bg-[#e8dcc5]/50 rounded cursor-pointer"
                                  onClick={() => toggleSelection(industry, selectedIndustries, setSelectedIndustries)}
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
                  </div>
                </div>

                {/* Section 0: Historical Trend */}
                <div className="mb-12">
                  <h3 className="text-xl font-display text-[#5c4033] mb-6 border-l-4 border-[#a67c52] pl-3">历年走势</h3>
                  <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 p-6 shadow-sm h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart key={objectType + JSON.stringify(trendData)} data={trendData} margin={{ top: 20, right: 80, bottom: 20, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b7" vertical={false} />
                            <XAxis 
                            dataKey="name" 
                            stroke="#8a6d5b" 
                            tick={{ fill: '#5c4033', fontSize: 12, fontWeight: 'bold' }} 
                            height={60}
                            tickMargin={10}
                          />   <YAxis 
                          yAxisId="left"
                          stroke="#8a6d5b"
                          tick={{ fill: '#5c4033' }}
                          label={{ value: '最高温度 (℃)', angle: -90, position: 'insideLeft', fill: '#5c4033' }}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          stroke="#8a6d5b"
                          tick={{ fill: '#5c4033' }}
                          label={{ value: objectType === '用电量' ? '电量 (万千瓦时)' : '负荷 (万千瓦)', angle: 90, position: 'right', offset: 0, fill: '#5c4033' }}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#d4c4b7', color: '#5c4033' }}
                          itemStyle={{ color: '#5c4033' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }} 
                          payload={[
                            { value: '最高温度', type: 'line', color: '#dc2626' },
                            { value: objectType === '最大负荷' ? '基础负荷' : '基础电量', type: 'rect', color: '#4ade80' }, // Green
                            { value: objectType === '最大负荷' ? '降温负荷' : '降温电量', type: 'rect', color: '#60a5fa' }, // Blue
                            { value: objectType === '最大负荷' ? '取暖负荷' : '取暖电量', type: 'rect', color: '#f87171' }  // Red
                          ]}
                        />
                        {/* Stacked Bars - Render all but conditionally hide via dataKey or just render specific ones based on state outside JSX if needed, but here we use simple conditional rendering which should work. Let's try explicit nulls if not matched to be safe, or just keep it simple but ensure keys are correct. */}
                        {objectType === '最大负荷' && <Bar yAxisId="right" dataKey="baseLoad" name="基础负荷" stackId="a" barSize={40} fill="#4ade80" />}
                        {objectType === '最大负荷' && <Bar yAxisId="right" dataKey="coolingLoad" name="降温负荷" stackId="a" barSize={40} fill="#60a5fa" />}
                        {objectType === '最大负荷' && <Bar yAxisId="right" dataKey="heatingLoad" name="取暖负荷" stackId="a" barSize={40} fill="#f87171" radius={[4, 4, 0, 0]} />}
                        
                        {objectType !== '最大负荷' && <Bar yAxisId="right" dataKey="baseElec" name="基础电量" stackId="a" barSize={40} fill="#4ade80" />}
                        {objectType !== '最大负荷' && <Bar yAxisId="right" dataKey="coolingElec" name="降温电量" stackId="a" barSize={40} fill="#60a5fa" />}
                        {objectType !== '最大负荷' && <Bar yAxisId="right" dataKey="heatingElec" name="取暖电量" stackId="a" barSize={40} fill="#f87171" radius={[4, 4, 0, 0]} />}
                        <Line yAxisId="left" type="monotone" dataKey="temp" name="最高温度" stroke="#dc2626" strokeWidth={3} dot={{ r: 6, fill: "#dc2626", strokeWidth: 2, stroke: "#fff" }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Section 1: Correlation Heatmap */}
                <div className="mb-12">
                  <h3 className="text-xl font-display text-[#5c4033] mb-6 border-l-4 border-[#a67c52] pl-3">相关性规律</h3>
                  {/* Full width container with semi-transparent background */}
                  <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <div className="min-w-full">
        {/* Table Header */}
                        <div 
                          className="grid border-b border-[#d4c4b7] bg-[#e8dcc5]/50"
                          style={{ gridTemplateColumns: `120px repeat(${selectedIndustries.length}, minmax(120px, 1fr))` }}
                        >
                          <div className="relative p-0 border-r border-[#d4c4b7] h-full w-full overflow-hidden">
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d4c4b7" strokeWidth="1" />
                                </svg>
                                <span className="absolute top-[25%] right-[10%] text-xs font-bold text-[#5c4033]">行业</span>
                                <span className="absolute bottom-[25%] left-[10%] text-xs font-bold text-[#5c4033]">地区</span>
                              </div>
                          {(() => {
                            // Sort industries: if "全社会用电" is selected, put it first
                            let displayIndustries = [...selectedIndustries];
                            if (displayIndustries.includes("全社会用电")) {
                              displayIndustries = [
                                "全社会用电",
                                ...displayIndustries.filter(i => i !== "全社会用电")
                              ];
                            }
                            
                            return displayIndustries.map(industry => (
                              <div key={industry} className="p-4 text-sm font-bold text-[#5c4033] text-center border-r border-[#d4c4b7] last:border-r-0 flex items-center justify-center">
                                {industry}
                              </div>
                            ));
                          })()}
                        </div>

                        {/* Table Body */}
                        {heatmapData.map((row, index) => (
                          <div 
                            key={row.unit} 
                            className="grid border-b border-[#d4c4b7] last:border-b-0 hover:bg-[#f5f0e6]/50 transition-colors"
                            style={{ gridTemplateColumns: `120px repeat(${selectedIndustries.length}, minmax(120px, 1fr))` }}
                          >
                            <div className="p-4 text-sm font-serif text-[#5c4033] text-center border-r border-[#d4c4b7] flex items-center justify-center bg-[#fdfbf7]/30">
                              {row.unit}
                            </div>
                            {(() => {
                              // Sort industries for body rows too
                              let displayIndustries = [...selectedIndustries];
                              if (displayIndustries.includes("全社会用电")) {
                                displayIndustries = [
                                  "全社会用电",
                                  ...displayIndustries.filter(i => i !== "全社会用电")
                                ];
                              }

                              return displayIndustries.map(industry => {
                                const value = parseFloat(row[industry]);
                                const inkStyle = getInkStyle(value);
                                const isRowMax = value === rowMax[row.unit];
                                const isColMax = value === colMax[industry];
                                
                                return (
                                  <div 
                                    key={`${row.unit}-${industry}`} 
                                    className="p-4 border-r border-[#d4c4b7] last:border-r-0 flex items-center justify-center relative h-16 group cursor-pointer"
                                    onMouseEnter={() => setHeatmapHover({row: row.unit, col: industry})}
                                    onMouseLeave={() => setHeatmapHover(null)}
                                  >
                                  {/* Ink Blot */}
                                  <div 
                                    className="rounded-full absolute transition-all duration-500 ease-in-out"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      ...inkStyle,
                                      border: (isRowMax || isColMax) ? '2px solid #a67c52' : 'none'
                                    }}
                                  />
                                  {/* Value Text */}
                                  <span className={cn(
                                    "relative z-10 text-sm font-serif font-bold transition-colors duration-300",
                                    value >= 0.8 ? "text-[#fdfbf7]" : "text-[#5c4033]"
                                  )}>
                                    {value.toFixed(2)}
                                  </span>
                                  
                                  {/* Max Indicator */}
                                  {(isRowMax || isColMax) && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-[#a67c52] rounded-full" />
                                  )}

                                  {/* Tooltip */}
                                  <div className={cn(
                                    "absolute left-1/2 -translate-x-1/2 w-64 bg-[#fdfbf7] border border-[#d4c4b7] p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]",
                                    index === 0 ? "top-full mt-2" : "bottom-full mb-2"
                                  )}>
                                    <p className="text-[#5c4033] font-bold mb-1 text-center">{selectedYear}年 {row.unit} {industry}</p>
                                    <p className="text-[#5c4033] text-xs mb-1">
                                      {objectType === '用电量' ? '用电量' : '最大负荷'}: <span className="font-mono font-bold">{row[`${industry}_max`]}</span> {objectType === '用电量' ? '万千瓦时' : '万千瓦'}
                                    </p>
                                    <p className="text-[#5c4033] text-xs">
                                      与最高温度相关性: <span className="font-mono font-bold">{value.toFixed(2)}</span>
                                    </p>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Sensitivity Analysis */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6 border-l-4 border-[#a67c52] pl-3">
                    <h3 className="text-xl font-display text-[#5c4033]">敏感性规律</h3>
                    
                    {/* Analysis Type Selector (Moved here) */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#5c4033] text-sm">对比分析：</span>
                      <div className="flex bg-[#e8dcc5] rounded-md p-1 border border-[#d4c4b7]">
                        {ANALYSIS_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => handleAnalysisTypeChange(type)}
                            className={cn(
                              "px-3 py-1 rounded-sm text-xs font-serif transition-all",
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Temperature Range Visualization */}
                    <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 p-4 shadow-sm flex flex-col h-[400px] relative">
                      {/* Global Tooltip Portal - Only show when hovering over the first column (Temperature Range) */}
                      {hoveredItem && (() => {
                        const item = sortedData1.find(i => i.name === hoveredItem);
                        if (!item) return null;
                        
                        // Only render if we are actually hovering over the first column's item
                        if (activeColumn !== 'tempRange') return null;

                        return (
                          <div 
                            className="fixed z-[9999] w-80 bg-[#fdfbf7] border border-[#d4c4b7] p-4 rounded shadow-xl text-left pointer-events-none"
                            style={{
                              left: mousePos.x + 20,
                              top: mousePos.y - 100,
                            }}
                          >
                            <p className="text-[#5c4033] font-bold mb-2 border-b border-[#d4c4b7] pb-1">
                              {selectedYear}年 {item.name}
                            </p>
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs font-bold text-blue-600 block mb-0.5">低温段 (0℃ - {item.splitPoint}℃)</span>
                                <p className="text-xs text-[#5c4033]">
                                  温度每升高1℃，{objectType}增长 <span className="font-mono font-bold">{item.lowTempLoad}</span> {objectType === '累计用电量' ? '万千瓦时' : '万千瓦'}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-red-600 block mb-0.5">高温段 ({item.splitPoint}℃ - 40℃)</span>
                                <p className="text-xs text-[#5c4033]">
                                  温度每升高1℃，{objectType}增长 <span className="font-mono font-bold">{item.highTempLoad}</span> {objectType === '累计用电量' ? '万千瓦时' : '万千瓦'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <h4 className="text-sm font-bold text-[#5c4033]">温度段划分</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-[#e8dcc5]/50"
                          onClick={handleSort1}
                        >
                          {sortConfig1.direction === 'asc' ? 
                            <ArrowUpAZ className="h-4 w-4 text-[#8a6d5b]" /> : 
                            <ArrowDownAZ className="h-4 w-4 text-[#8a6d5b]" />
                          }
                        </Button>
                      </div>
                      
                      <div className="flex justify-between text-xs text-[#8a6d5b] mb-2 px-2 items-center">
                        <span className="w-24">{analysisType === "不同行业" ? "行业" : "单位"}</span>
                        <div className="flex-1 flex relative px-2">
                          <span className="absolute left-1/4 -translate-x-1/2">低温段</span>
                          <span className="absolute right-1/4 translate-x-1/2">高温段</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pt-6">
                        {sortedData1.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "relative p-2 rounded transition-all duration-200 cursor-pointer border",
                              hoveredItem === item.name 
                                ? "bg-[#e8dcc5] border-[#a67c52] shadow-md scale-[1.02] z-50" 
                                : "border-transparent hover:bg-[#f5f0e6]/50 z-0"
                            )}
                            onMouseEnter={() => { setHoveredItem(item.name); setActiveColumn('tempRange'); }}
                            onMouseLeave={() => { setHoveredItem(null); setActiveColumn(null); }}
                          >
                            <div className="flex items-center group/row relative">
                              <span className={cn(
                                "w-24 text-sm font-serif truncate mr-4 transition-colors",
                                hoveredItem === item.name ? "text-[#2c1810] font-bold" : "text-[#5c4033]"
                              )}>{item.name}</span>
                              <div className="flex-1 h-6 bg-gradient-to-r from-blue-400 via-green-300 to-red-400 rounded-full relative">
                                {/* Split Line */}
                                <div 
                                  className="absolute top-0 bottom-0 w-0.5 bg-[#fdfbf7] shadow-[0_0_2px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
                                  style={{ left: `${(item.splitPoint / 40) * 100}%` }}
                                >
                                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-[#5c4033] bg-[#fdfbf7]/80 px-1 rounded whitespace-nowrap z-20">
                                    {item.splitPoint}℃
                                  </div>
                                </div>
                                
                                {/* Range Labels (Show on every row) */}
                                <span className="absolute top-7 left-0 text-[10px] text-[#5c4033]/70 scale-90 origin-left">0℃</span>
                                <span className="absolute top-7 right-0 text-[10px] text-[#5c4033]/70 scale-90 origin-right">40℃</span>
                              </div>

                              
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Low Temp Load Bar Chart */}
                    <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 p-4 shadow-sm flex flex-col h-[400px]">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <h4 className="text-sm font-bold text-[#5c4033]">低温段温升负荷（万千瓦）</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-[#e8dcc5]/50"
                          onClick={handleSort2}
                        >
                          {sortConfig2.direction === 'asc' ? 
                            <ArrowUpAZ className="h-4 w-4 text-[#8a6d5b]" /> : 
                            <ArrowDownAZ className="h-4 w-4 text-[#8a6d5b]" />
                          }
                        </Button>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={sortedData2} 
                            layout="vertical" 
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            onMouseMove={(state) => {
                              if (state.activeLabel) {
                                setHoveredItem(state.activeLabel);
                              }
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d4c4b7" />
                            <XAxis type="number" stroke="#8a6d5b" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#8a6d5b" fontSize={12} width={80} tick={{fill: '#5c4033'}} />
                            <Tooltip content={<CustomTooltip type="low" />} cursor={{ fill: '#e8dcc5', opacity: 0.3 }} />
                            <Bar dataKey="lowTempLoad" radius={[0, 4, 4, 0]} barSize={20}>
                              {sortedData2.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={hoveredItem === entry.name ? "#2563eb" : "#60a5fa"} 
                                  className="transition-all duration-200"
                                  stroke={hoveredItem === entry.name ? "#1e40af" : "none"}
                                  strokeWidth={2}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Column 3: High Temp Load Bar Chart */}
                    <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 p-4 shadow-sm flex flex-col h-[400px]">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <h4 className="text-sm font-bold text-[#5c4033]">高温段温升负荷（万千瓦）</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-[#e8dcc5]/50"
                          onClick={handleSort3}
                        >
                          {sortConfig3.direction === 'asc' ? 
                            <ArrowUpAZ className="h-4 w-4 text-[#8a6d5b]" /> : 
                            <ArrowDownAZ className="h-4 w-4 text-[#8a6d5b]" />
                          }
                        </Button>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={sortedData3} 
                            layout="vertical" 
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            onMouseMove={(state) => {
                              if (state.activeLabel) {
                                setHoveredItem(state.activeLabel);
                              }
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d4c4b7" />
                            <XAxis type="number" stroke="#8a6d5b" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#8a6d5b" fontSize={12} width={80} tick={{fill: '#5c4033'}} />
                            <Tooltip content={<CustomTooltip type="high" />} cursor={{ fill: '#e8dcc5', opacity: 0.3 }} />
                            <Bar dataKey="highTempLoad" radius={[0, 4, 4, 0]} barSize={20}>
                              {sortedData3.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={hoveredItem === entry.name ? "#dc2626" : "#f87171"} 
                                  className="transition-all duration-200"
                                  stroke={hoveredItem === entry.name ? "#991b1b" : "none"}
                                  strokeWidth={2}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Section 3: New Modules (Theoretical Extreme & Accumulated Temp) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Module 1: Theoretical Extreme Values */}
                  <div>
                    <h3 className="text-xl font-display text-[#5c4033] mb-6 border-l-4 border-[#a67c52] pl-3">理论极值</h3>
                    <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 p-6 shadow-sm h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={extremeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d4c4b7" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#8a6d5b" 
                            tick={{ fill: '#5c4033', fontSize: 12, fontWeight: 'bold' }} 
                            height={60}
                            tickMargin={10}
                            interval={0}
                          />
                          <YAxis 
                            stroke="#8a6d5b" 
                            tick={{ fill: '#5c4033' }} 
                            label={{ 
                              value: objectType === '用电量' ? '用电量 (万千瓦时)' : '最大负荷 (万千瓦)', 
                              angle: -90, 
                              position: 'insideLeft', 
                              fill: '#5c4033',
                              style: { textAnchor: 'middle' }
                            }} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#d4c4b7', color: '#5c4033' }}
                            itemStyle={{ color: '#5c4033' }}
                          />
                          <Legend />
                          
                          <Bar dataKey="y2022" name="2022年" fill="#a67c52" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="y2023" name="2023年" fill="#a67c52" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="y2024" name="2024年" fill="#8b4513" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="y2025" name="2025年" fill="#5c4033" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Module 2: Accumulated Temperature Effect */}
                  <div>
                    <div className="flex items-center justify-between mb-6 border-l-4 border-[#a67c52] pl-3">
                      <h3 className="text-xl font-display text-[#5c4033]">{accumulatedYear}年积温效应</h3>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            const currentIndex = YEARS.indexOf(accumulatedYear);
                            if (currentIndex > 0) setAccumulatedYear(YEARS[currentIndex - 1]);
                          }}
                          disabled={YEARS.indexOf(accumulatedYear) === 0}
                          className="h-8 w-8 p-0 hover:bg-[#d4c4b7]/50 disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4 rotate-90 text-[#5c4033]" />
                        </Button>
                        <span className="font-serif font-bold text-[#5c4033] min-w-[3rem] text-center">{accumulatedYear}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            const currentIndex = YEARS.indexOf(accumulatedYear);
                            if (currentIndex < YEARS.length - 1) setAccumulatedYear(YEARS[currentIndex + 1]);
                          }}
                          disabled={YEARS.indexOf(accumulatedYear) === YEARS.length - 1}
                          className="h-8 w-8 p-0 hover:bg-[#d4c4b7]/50 disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4 -rotate-90 text-[#5c4033]" />
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#d4c4b7] bg-[#f5f0e6]/80 shadow-sm h-[400px] overflow-hidden flex flex-col">
                      {/* Table Header */}
                      <div className="grid grid-cols-[120px_1fr] border-b border-[#d4c4b7] bg-[#e8dcc5]/50">
                        <div className="p-3 text-sm font-bold text-[#5c4033] text-center border-r border-[#d4c4b7]">单位</div>
                        <div className="p-3 text-sm font-bold text-[#5c4033] text-center">积温规律</div>
                      </div>
                      
                      {/* Table Body - Scrollable */}
                      <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {accumulatedTempData.map((row, index) => (
                          <div 
                            key={row.name} 
                            className="grid grid-cols-[120px_1fr] border-b border-[#d4c4b7] last:border-b-0 hover:bg-[#fdfbf7]/50 transition-colors"
                          >
                            <div className={`p-4 text-sm font-serif font-bold text-[#5c4033] flex items-center justify-center border-r border-[#d4c4b7] bg-[#fdfbf7]/30 ${row.name === '北京' ? 'text-lg font-extrabold text-[#8b5a2b]' : ''}`}>
                              {row.name}
                            </div>
                            <div className="p-4 text-sm text-[#5c4033] leading-relaxed flex items-center">
                              <span dangerouslySetInnerHTML={{ 
                                __html: row.description.replace(/(\d+(\.\d+)?)/g, '<span class="font-extrabold text-[#dc2626] text-lg">$1</span>') 
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right Scroll Handle - New Install Style (Mirrored) */}
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
