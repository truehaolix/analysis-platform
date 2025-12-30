import { useState } from "react";
import { Search, Map, FileText, Database, Settings, Activity, Calendar, ChevronLeft, ChevronRight, User, MessageSquare, HelpCircle, Star, LogOut, Bell, LayoutGrid, List, Bookmark, HelpCircle as Question } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const EXPERIENCE_MAP_DATA = [
  { name: "电力看行业", count: 98, color: "bg-blue-50 text-blue-700" },
  { name: "经济测电力", count: 233, color: "bg-blue-50 text-blue-700" },
  { name: "数据运营", count: 47, color: "bg-blue-50 text-blue-700" },
  { name: "机制建设", count: 106, color: "bg-blue-50 text-blue-700" },
  { name: "系统运营", count: 64, color: "bg-blue-50 text-blue-700" },
  { name: "基础知识", count: 29, color: "bg-blue-50 text-blue-700" },
];

const HEADQUARTERS_RESULTS = [
  { title: "看经济", count: 9, new: 0 },
  { title: "看事件", count: 15, new: 0 },
  { title: "看社会", count: 4, new: 0 },
  { title: "看电力", count: 14, new: 0 },
];

const PROVINCE_RESULTS = [
  { title: "北京", count: 2, new: 0 },
  { title: "河北", count: 10, new: 0 },
  { title: "冀北", count: 2, new: 0 },
  { title: "山西", count: 3, new: 0 },
];

const QUICK_ACCESS = [
  { name: "标准规划", icon: "/images/icon-standard-transparent.png" },
  { name: "需求发布", icon: "/images/icon-demand-transparent.png" },
  { name: "经验合集", icon: "/images/icon-collection-transparent.png" },
  { name: "智能工具", icon: "/images/icon-tools-transparent.png" },
];

const EXPERTS = [
  { name: "叶建", role: "量化分析预测", avatar: "/images/avatar1.png" },
  { name: "冯延坤", role: "电力市场研究", avatar: "/images/avatar2.png" },
  { name: "张文韬", role: "智能微网", avatar: "/images/avatar3.png" },
  { name: "李佳玮", role: "电力预测", avatar: "/images/avatar4.png" },
  { name: "方智淳", role: "市场化交易", avatar: "/images/avatar5.png" },
  { name: "赵伟博", role: "新能源消纳", avatar: "/images/avatar6.png" },
];

const BOOK_COVERS = [
  "/images/book-style-light-green.png?v=2",
  "/images/book-style-light-green.png?v=2",
  "/images/book-style-light-green.png?v=2",
  "/images/book-style-light-green.png?v=2",
];

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(12);

  return (
    <div className="h-full p-4 font-serif text-[#2c1810] overflow-y-auto bg-[url('/images/bg-style-c.jpg')] bg-cover bg-center bg-fixed relative">
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Top Rolling News */}
        <div className="w-full bg-white/50 backdrop-blur-sm border border-[#eaddcf] rounded-sm mb-4 py-2 px-4 flex items-center gap-2 text-sm text-[#8d6e63] shadow-sm">
            <div className="bg-[#8d6e63] text-white text-xs px-2 py-0.5 rounded-sm">最新信息</div>
            <Bell size={14} className="animate-pulse" />
            <div className="flex-1 overflow-hidden relative h-5">
            <div className="absolute animate-marquee whitespace-nowrap flex gap-8">
                <span>参加全国经济运行监测分析工作交流会 2025-12-05</span>
                <span>公司领导提工作要求，加强新兴产业电量统计 2025-12-02</span>
                <span>召开分析预测工作座谈会 2025-11-25</span>
            </div>
            </div>
        </div>

        {/* Search Area */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-4 border border-[#eaddcf]">
            <div className="relative mb-4">
            <input 
                type="text" 
                placeholder="请输入内容" 
                className="w-full pl-4 pr-12 py-2 bg-[#fdfbf7]/40 border border-[#d7ccc8] rounded focus:outline-none focus:border-[#8d6e63] text-sm"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-[#a1887f] hover:text-[#8d6e63]">
                <Search size={18} />
            </button>
            </div>
            
            <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
                <span className="text-[#ffb300] font-bold whitespace-nowrap flex items-center gap-1"><Activity size={12}/> 热搜词</span>
                <div className="flex flex-wrap gap-2">
                {["黑色金属冶炼压延", "文旅产业", "用电需求", "分时预测", "商圈用电", "元旦可需用电"].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#efebe9]/50 text-[#5d4037] rounded-sm cursor-pointer hover:bg-[#d7ccc8] transition-colors">{tag}</span>
                ))}
                </div>
            </div>
            
            <div className="flex items-start gap-2">
                <span className="text-[#8d6e63] font-bold whitespace-nowrap">作者</span>
                <div className="flex flex-wrap gap-3 text-[#5d4037]">
                {["赵传博", "苏笑", "钱晓瑞", "方智淳", "别芳玫"].map((author, i) => (
                    <span key={i} className="cursor-pointer hover:underline">{author}</span>
                ))}
                </div>
            </div>

            <div className="flex items-start gap-2">
                <span className="text-[#8d6e63] font-bold whitespace-nowrap">单位</span>
                <div className="flex flex-wrap gap-3 text-[#5d4037]">
                {["北京", "天津", "河北", "冀北", "山西", "山东", "上海", "江苏", "浙江", "安徽", "福建", "湖北", "湖南", "河南", "江西", "辽宁", "吉林", "黑龙江", "蒙东", "陕西", "甘肃", "青海", "宁夏", "新疆", "四川", "重庆", "西藏", "国网"].map((unit, i) => (
                    <span key={i} className="cursor-pointer hover:underline">{unit}</span>
                ))}
                </div>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
            
            {/* Left Column (Main Content) */}
            <div className="col-span-9 space-y-4">
            
            {/* Experience Map */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf] min-h-[360px]">
                <div className="flex justify-between items-center mb-8 border-l-4 border-[#8d6e63] pl-3">
                <h2 className="text-base font-bold text-[#2c1810]">经验地图</h2>
                <div className="flex items-center gap-2 text-xs text-[#8d6e63]">
                    <span>地区</span>
                    <select className="bg-[#fdfbf7]/40 border border-[#d7ccc8] rounded px-2 py-0.5">
                    <option>国网</option>
                    </select>
                </div>
                </div>
                
                <div className="grid grid-cols-6 gap-4 text-center py-10">
                {EXPERIENCE_MAP_DATA.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-5 group cursor-pointer">
                        <span className="text-sm font-bold text-[#5d4037]">{item.name}</span>
                        <div className="w-24 h-24 rounded-full bg-[#efebe9]/50 flex items-center justify-center text-[#2c1810] font-bold text-3xl shadow-sm group-hover:scale-105 transition-transform border-2 border-white/60 ring-1 ring-[#d7ccc8]">
                        {item.count}
                        </div>
                        <div className="text-[10px] text-[#a1887f] w-full space-y-2 px-2">
                        <div className="flex justify-between"><span>报告</span><span>{item.count}</span></div>
                        <div className="flex justify-between"><span>模型</span><span>0</span></div>
                        <div className="flex justify-between"><span>手册</span><span>0</span></div>
                        <div className="flex justify-between"><span>视频</span><span>0</span></div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Excellent Results Zone */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <div className="flex justify-between items-center mb-4 border-l-4 border-[#8d6e63] pl-3">
                <h2 className="text-base font-bold text-[#2c1810]">优秀成果专区</h2>
                <span className="text-xs text-[#8d6e63] cursor-pointer hover:underline">更多</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                {/* Headquarters Card */}
                <div className="bg-[#fdfbf7]/40 border border-[#eaddcf] rounded-lg p-4 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2c1810] text-[#eaddcf] px-4 py-1 rounded-b-lg text-sm font-bold shadow-sm flex items-center gap-1">
                        <Star size={12} className="fill-current text-[#ffb300]" /> 总部优秀经验成果
                    </div>
                    <div className="mt-6 text-center">
                        <h3 className="font-bold text-[#3e2723] mb-3 text-sm leading-relaxed px-4">2025年8月,国网总部开展关于业扩及变更用电业务对负荷规律总结报告分析</h3>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {HEADQUARTERS_RESULTS.map((item, i) => (
                                <div key={i} className="bg-white/50 p-2 rounded border border-[#efebe9] text-center">
                                    <div className="text-xs text-[#8d6e63] font-bold">{item.title} {item.count} 篇</div>
                                    <div className="text-[10px] text-[#a1887f] mt-1">本月新增 {item.new} 个</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-2 justify-items-center">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-full max-w-[96px] h-32 relative group cursor-pointer transition-transform hover:-translate-y-1 bg-[#1e293b] rounded-[2px] shadow-md flex flex-col items-center justify-center overflow-hidden border-l-4 border-l-[#0f172a]">
                                    {/* Top Line */}
                                    <div className="absolute top-4 left-0 right-0 h-[1px] bg-white/20" />
                                    {/* Bottom Line */}
                                    <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-white/20" />
                                    
                                    {/* White Label */}
                                    <div className="w-10 h-20 bg-[#f8fafc] flex items-center justify-center shadow-sm z-10 border border-gray-200">
                                        <span className="text-xs font-serif font-bold text-[#1e293b] writing-vertical-rl tracking-widest leading-none py-1">
                                            优秀经验成果
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Province Card */}
                <div className="bg-[#fdfbf7]/40 border border-[#eaddcf] rounded-lg p-4 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2c1810] text-[#eaddcf] px-4 py-1 rounded-b-lg text-sm font-bold shadow-sm flex items-center gap-1">
                        <Star size={12} className="fill-current text-[#ffb300]" /> 省侧优秀经验成果
                    </div>
                    <div className="mt-6 text-center">
                        <h3 className="font-bold text-[#3e2723] mb-3 text-sm leading-relaxed px-4">2025年11月,四川公司开展了区域性重大活动对基于电力数据分析研判钢铁行业发展趋势研究</h3>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {PROVINCE_RESULTS.map((item, i) => (
                                <div key={i} className="bg-white/50 p-2 rounded border border-[#efebe9] text-center">
                                    <div className="text-xs text-[#8d6e63] font-bold">{item.title} {item.count} 篇</div>
                                    <div className="text-[10px] text-[#a1887f] mt-1">本月新增 {item.new} 个</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-2 justify-items-center">
                            {[5,6,7,8].map(i => (
                                <div key={i} className="w-full max-w-[96px] h-32 relative group cursor-pointer transition-transform hover:-translate-y-1 bg-[#1e293b] rounded-[2px] shadow-md flex flex-col items-center justify-center overflow-hidden border-l-4 border-l-[#0f172a]">
                                    {/* Top Line */}
                                    <div className="absolute top-4 left-0 right-0 h-[1px] bg-white/20" />
                                    {/* Bottom Line */}
                                    <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-white/20" />
                                    
                                    {/* White Label */}
                                    <div className="w-10 h-20 bg-[#f8fafc] flex items-center justify-center shadow-sm z-10 border border-gray-200">
                                        <span className="text-xs font-serif font-bold text-[#1e293b] writing-vertical-rl tracking-widest leading-none py-1">
                                            优秀经验成果
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* Small Classroom */}
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf] border-l-4 border-l-[#8d6e63] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/images/classroom-bg.jpg')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-bold text-[#2c1810] flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#8d6e63] rounded-full"></span>
                            小课堂
                        </h2>
                        <span className="text-xs text-[#8d6e63] cursor-pointer hover:underline bg-[#fdfbf7]/50 px-2 py-0.5 rounded-full">更多</span>
                        </div>
                        <div className="space-y-3">
                        <div className="flex gap-3 bg-[#fdfbf7]/50 border border-[#eaddcf] rounded-lg p-3 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-20 h-14 bg-[#efebe9] rounded shrink-0 overflow-hidden">
                                <img src="/images/classroom-bg.jpg" className="w-full h-full object-cover" alt="Thumbnail" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-[#8d6e63] mb-1 font-bold">智能体培训</div>
                                <div className="font-bold text-sm text-[#3e2723] mb-1 truncate">国网人工智能应用实战</div>
                                <div className="flex justify-between items-center text-[10px] text-[#a1887f]">
                                    <span>主讲人: 国网专家</span>
                                    <span className="flex items-center gap-1"><Calendar size={10}/> 11-01</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 bg-[#fdfbf7]/50 border border-[#eaddcf] rounded-lg p-3 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-20 h-14 bg-[#efebe9] rounded shrink-0 overflow-hidden">
                                <img src="/images/classroom-bg.jpg" className="w-full h-full object-cover" alt="Thumbnail" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-[#8d6e63] mb-1 font-bold">大语言模型培训</div>
                                <div className="font-bold text-sm text-[#3e2723] mb-1 truncate">大模型在电力领域的应用</div>
                                <div className="flex justify-between items-center text-[10px] text-[#a1887f]">
                                    <span>主讲人: 资深工程师</span>
                                    <span className="flex items-center gap-1"><Calendar size={10}/> 11-01</span>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Ability Improvement Games */}
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf] border-l-4 border-l-[#8d6e63] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/game-icon-bg-circle.png')] bg-no-repeat bg-center opacity-5 scale-150"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-bold text-[#2c1810] flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#8d6e63] rounded-full"></span>
                            能力提升小游戏
                        </h2>
                        </div>
                        <div className="flex flex-col items-center justify-center h-48 relative">
                        {/* Central Game Board */}
                        <div className="w-32 h-32 rounded-full bg-[#fdfbf7]/50 border-4 border-[#8d6e63] flex items-center justify-center shadow-inner relative z-10">
                            <img src="/images/game-icon-bg-circle.png" className="w-28 h-28 opacity-90" alt="Game Board" />
                        </div>
                        <div className="mt-6 text-[#8d6e63] text-sm font-bold bg-[#fdfbf7]/50 px-3 py-1 rounded-full border border-[#eaddcf]">敬请期待</div>
                        </div>
                    </div>
                </div>

            </div>

            </div>

            {/* Right Column (Sidebar Widgets) */}
            <div className="col-span-3 space-y-4">
            
            {/* My Space */}
            <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-[#eaddcf]">
                <div className="bg-[#fdfbf7]/50 p-3 flex justify-between items-center border-b border-[#eaddcf]">
                    <h3 className="font-bold text-[#2c1810] text-sm border-l-4 border-[#8d6e63] pl-2">我的空间</h3>
                    <div className="bg-[#efebe9]/50 text-[#5d4037] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span> LVO
                    </div>
                </div>
                <div className="p-4 bg-[url('/images/my-space-bg.jpg')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-white/90"></div>
                    <div className="relative z-10 flex items-start gap-3">
                    <div className="p-2 bg-[#efebe9]/50 rounded text-[#8d6e63]">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm text-[#3e2723]">用电需求分析预测报告</h4>
                        <div className="text-xs text-[#a1887f] mt-1">最近编辑时间: 10月17日 08:00</div>
                    </div>
                    </div>
                    <div className="relative z-10 flex gap-2 mt-4 justify-end">
                    <button className="px-2 py-1 bg-[#8d6e63] text-white text-xs rounded hover:bg-[#6d4c41]">进入空间</button>
                    <button className="px-2 py-1 bg-[#bcaaa4] text-white text-xs rounded hover:bg-[#a1887f]">我的收藏</button>
                    <button className="px-2 py-1 bg-[#bcaaa4] text-white text-xs rounded hover:bg-[#a1887f]">我的问题</button>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <h3 className="font-bold text-[#2c1810] text-sm mb-4 border-l-4 border-[#8d6e63] pl-2">快捷入口</h3>
                <div className="grid grid-cols-4 gap-2">
                {QUICK_ACCESS.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-[#efebe9]/50 flex items-center justify-center group-hover:bg-[#d7ccc8] transition-colors">
                        <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-[10px] text-[#5d4037] text-center">{item.name}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Big Events */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <h3 className="font-bold text-[#2c1810] text-sm mb-4 border-l-4 border-[#8d6e63] pl-2">大事记</h3>
                <div className="flex gap-3 items-start">
                    <div className="p-2 bg-[#efebe9]/50 rounded text-[#8d6e63]">
                    <Bookmark size={20} />
                    </div>
                    <div>
                    <h4 className="font-bold text-xs text-[#3e2723]">用电需求分析预测大事记</h4>
                    <p className="text-[10px] text-[#ffb300] mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#ffb300] rounded-full"></span>
                        围绕通过电力数据研判经济运行态势做交流研讨并发言。
                    </p>
                    </div>
                </div>
            </div>

            {/* Work Reminder / Calendar */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#2c1810] text-sm border-l-4 border-[#8d6e63] pl-2">工作提醒</h3>
                    <div className="flex gap-2 text-[#a1887f]">
                    <Bell size={14} className="cursor-pointer hover:text-[#8d6e63]"/>
                    <Settings size={14} className="cursor-pointer hover:text-[#8d6e63]"/>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <div key={m} className={`border rounded p-1 text-center cursor-pointer text-xs ${m === 12 ? 'bg-[#8d6e63] text-white border-[#8d6e63]' : 'border-[#d7ccc8] text-[#5d4037] hover:border-[#a1887f]'}`}>
                        <div className="w-full h-1 bg-green-500 rounded-full mb-1 mx-auto w-1/2"></div>
                        {m}月
                    </div>
                    ))}
                </div>
                <div className="flex justify-center items-center gap-4 text-sm font-bold text-[#3e2723] mb-4">
                    <button className="p-1 hover:bg-[#efebe9]/50 rounded"><ChevronLeft size={14}/></button>
                    十二月 2025
                    <button className="p-1 hover:bg-[#efebe9]/50 rounded"><ChevronRight size={14}/></button>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#8d6e63] font-bold cursor-pointer hover:underline">
                    <span className="w-2 h-2 bg-[#8d6e63] rounded-sm"></span> 工作事项
                    </div>
                    <div className="flex items-center gap-2 text-[#bcaaa4] cursor-pointer hover:underline">
                    <span className="w-2 h-2 bg-[#bcaaa4] rounded-sm"></span> 我的工作
                    </div>
                </div>
            </div>

            {/* Quarterly Selection (Moved to Right Column) */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#2c1810] text-sm border-l-4 border-[#8d6e63] pl-2">季度选编</h3>
                <div className="flex gap-1">
                    <button className="p-0.5 bg-[#efebe9]/50 rounded text-[#5d4037] hover:bg-[#d7ccc8]"><ChevronLeft size={12}/></button>
                    <button className="p-0.5 bg-[#efebe9]/50 rounded text-[#5d4037] hover:bg-[#d7ccc8]"><ChevronRight size={12}/></button>
                </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#fdfbf7]/50 p-1 rounded transition-colors">
                    <div className="w-12 h-16 bg-white border border-[#d7ccc8] shadow-sm rounded-sm relative overflow-hidden shrink-0">
                        <img src="/images/quarterly-cover-2025-q1.jpg" className="w-full h-full object-cover" alt="Cover 1" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-[#5d4037] font-bold truncate">用电需求分析预测汇编</div>
                        <div className="text-[10px] text-[#a1887f] mt-0.5">2025年第1季度</div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Expert Consultation (Moved to Right Column) */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#eaddcf]">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#2c1810] text-sm border-l-4 border-[#8d6e63] pl-2">专家咨询</h3>
                <span className="text-[10px] text-[#8d6e63] cursor-pointer hover:underline">更多</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {EXPERTS.slice(0, 3).map((expert, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#efebe9]/50 overflow-hidden border border-[#d7ccc8] group-hover:border-[#8d6e63] transition-colors">
                            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                        </div>
                        <div className="text-[10px] font-bold text-[#3e2723]">{expert.name}</div>
                    </div>
                    ))}
                </div>
                <button className="w-full mt-3 py-1.5 bg-[#8d6e63] text-white text-xs rounded hover:bg-[#6d4c41] transition-colors flex items-center justify-center gap-1">
                    <MessageSquare size={12} /> 立即咨询
                </button>
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}
