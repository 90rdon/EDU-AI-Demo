import React, { useState, useEffect } from 'react';
import { BOARD_ASSESSMENT_TRENDS, BOARD_GAP_ANALYSIS, BOARD_TURNOVER_DATA } from '../constants';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, ZAxis, PieChart, Pie } from 'recharts';
import { TrendingUp, Target, Users, Info, Sparkles, ChevronDown, MousePointerClick, AlertTriangle, BookOpen, Heart, Shield } from 'lucide-react';
import EduAI from './EduAI';
import { ViewProps } from '../types';

const STRATEGIC_GOALS = [
    { id: 1, title: "Empowered Student Learning", icon: BookOpen, color: "blue", metric: "College/Career Ready", value: "78%" },
    { id: 2, title: "Equitable Access", icon: Target, color: "purple", metric: "Gap Closure Rate", value: "+4.2%" },
    { id: 3, title: "Empowered Staff", icon: Users, color: "orange", metric: "Retention Rate", value: "88%" },
    { id: 4, title: "Impactful Family Engagement", icon: Heart, color: "green", metric: "Parent Satisfaction", value: "92%" },
    { id: 5, title: "Safe & Innovative Learning Environments", icon: Shield, color: "red", metric: "Safety Index", value: "98.5%" },
];

const FAMILY_ENGAGEMENT_DATA = [
    { name: 'Highly Engaged', value: 45, fill: '#10b981' },
    { name: 'Moderately Engaged', value: 35, fill: '#3b82f6' },
    { name: 'Low Engagement', value: 20, fill: '#9ca3af' },
];

const BoardView: React.FC<ViewProps> = ({ isAiOpen, setIsAiOpen }) => {
    const [selectedAssessment, setSelectedAssessment] = useState('NWEA MAP Growth: Math');
    const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);

    // Hint States
    const [showGoal1Hint, setShowGoal1Hint] = useState(false);
    const [hasClickedGoal1, setHasClickedGoal1] = useState(false);

    const [showGoal2Hint, setShowGoal2Hint] = useState(false);
    const [hasClickedGoal2, setHasClickedGoal2] = useState(false);

    const [showGoal3Hint, setShowGoal3Hint] = useState(false);
    const [hasClickedGoal3, setHasClickedGoal3] = useState(false);

    // Trigger Hints
    useEffect(() => {
        if (hasClickedGoal1) return;
        const timer = setTimeout(() => setShowGoal1Hint(true), 1000);
        return () => clearTimeout(timer);
    }, [hasClickedGoal1]);

    useEffect(() => {
        if (hasClickedGoal2) return;
        const timer = setTimeout(() => setShowGoal2Hint(true), 3000); // Sequence after Goal 1
        return () => clearTimeout(timer);
    }, [hasClickedGoal2]);

    useEffect(() => {
        if (hasClickedGoal3) return;
        const timer = setTimeout(() => setShowGoal3Hint(true), 5000); // Sequence after Goal 2
        return () => clearTimeout(timer);
    }, [hasClickedGoal3]);

    const boardContext = `
    Role: Board Member / Trustee.
    Focus: Oversight of the 5 Strategic Goals of Lone Star Unified School District (https://www.lonestar-usd.org/strategic-plan/).
    
    Goal 1: Empowered Student Learning.
    - Data: Longitudinal Growth Trends showing steady improvement (${JSON.stringify(BOARD_ASSESSMENT_TRENDS)}).
    - Key Metric: 78% CCMR (College, Career, Military Readiness).
    
    Goal 2: Equitable Access.
    - Data: Gap Analysis showing disparities for SPED and Emergent Bilinguals (${JSON.stringify(BOARD_GAP_ANALYSIS)}).
    - Target: Close gap by 5% annually.
    
    Goal 3: Empowered Staff.
    - Data: Teacher Turnover vs Growth correlation (${JSON.stringify(BOARD_TURNOVER_DATA)}).
    - Insight: High turnover at Zilker HS correlates with lower student growth.
    
    Goal 4: Impactful Family Engagement.
    - Data: 92% Parent Satisfaction on Climate Survey. 
    - Engagement Levels: 45% High, 35% Moderate, 20% Low.
    
    Goal 5: Safe and Innovative Learning Environments.
    - Data: Safety Index 98.5%. Innovation Pilot participation: 12 campuses.
    
    Task: Assist the board member in analyzing progress, identifying risks, and drafting policy talking points based on these 5 goals.
  `;

    const launchAi = (prompt: string) => {
        setAiPrompt(prompt);
        setIsAiOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">

            {/* EduAI Sidebar */}
            <EduAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} contextData={boardContext} initialPrompt={aiPrompt} role="Board Member" />

            <div className={`transition-all duration-300 ease-in-out ${isAiOpen ? 'mr-0 md:mr-[450px]' : ''}`}>
                <div className="p-6 max-w-7xl mx-auto pb-24 space-y-8">
                    {/* Header & Context */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Strategic Plan Dashboard</h1>
                            <p className="text-gray-500">Board of Trustees View • Monitoring 5-Year Strategic Goals</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAiOpen(true)}
                                className="px-4 py-2 bg-gradient-to-r from-vt-blue to-vt-lightBlue text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition hover:shadow-lg hover:brightness-110"
                            >
                                <Sparkles size={18} className="text-white" /> Launch EDU AI
                            </button>
                            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 pl-2">Filter:</span>
                                <div className="relative">
                                    <select
                                        value={selectedAssessment}
                                        onChange={(e) => setSelectedAssessment(e.target.value)}
                                        className="appearance-none bg-vt-grey border border-vt-borderGrey text-vt-textGrey text-sm rounded-md focus:ring-vt-blue focus:border-vt-blue block w-64 p-2 pr-8 cursor-pointer font-medium"
                                    >
                                        <option>All Strategic Goals</option>
                                        <option>Goal 1: Student Learning</option>
                                        <option>Goal 2: Equitable Access</option>
                                        <option>Goal 3: Empowered Staff</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategic Goals Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {STRATEGIC_GOALS.map((goal) => (
                            <div key={goal.id} className={`bg-white p-4 rounded-xl border-t-4 shadow-sm hover:shadow-md transition cursor-pointer group`} style={{ borderColor: goal.color }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg bg-${goal.color}-50 text-${goal.color}-600`}>
                                        <goal.icon size={20} color={goal.color === 'blue' ? '#BF5700' : undefined} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">Goal {goal.id}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1 h-10 leading-tight flex items-center">{goal.title}</h3>
                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <div className="text-xs text-gray-500">{goal.metric}</div>
                                        <div className="text-xl font-bold text-gray-900">{goal.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Analytics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* GOAL 1: Student Learning */}
                        <div
                            onClick={() => {
                                setHasClickedGoal1(true);
                                setShowGoal1Hint(false);
                                launchAi(`Analyze the District Longitudinal Growth trends for Goal 1: Empowered Student Learning. Specifically, why did the District Avg jump in Spring 2025 compared to the National Norm?`);
                            }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg hover:border-vt-lightBlue transition group relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition text-vt-blue flex items-center gap-1 text-xs font-bold bg-blue-50 px-2 py-1 rounded">
                                <MousePointerClick size={14} /> Analyze with AI
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Goal 1</span>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-vt-blue transition">Empowered Student Learning</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">Longitudinal Growth vs National Norm</p>
                                </div>
                            </div>

                            {/* Purple Guided Highlight - Goal 1 */}
                            {showGoal1Hint && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 animate-bounce pointer-events-none min-w-[200px]">
                                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border-2 border-white flex items-center justify-center gap-2">
                                        <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                                        <span>Analyze Student Growth!</span>
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-600 mx-auto -mt-0.5"></div>
                                </div>
                            )}

                            <div className="h-72 w-full pointer-events-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={BOARD_ASSESSMENT_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line name="District Avg" type="monotone" dataKey="district" stroke="#BF5700" strokeWidth={3} activeDot={{ r: 6 }} />
                                        <Line name="National Norm" type="monotone" dataKey="norm" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* GOAL 2: Equitable Access */}
                        <div
                            onClick={() => {
                                setHasClickedGoal2(true);
                                setShowGoal2Hint(false);
                                launchAi(`Analyze the Equity & Gap Analysis for Goal 2. Which groups are missing the 80% target, and what specific resources should the board consider allocating?`);
                            }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg hover:border-purple-300 transition group relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition text-purple-500 flex items-center gap-1 text-xs font-bold bg-purple-50 px-2 py-1 rounded">
                                <MousePointerClick size={14} /> Analyze with AI
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Goal 2</span>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition">Equitable Access</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">Gap Analysis: % Meeting Growth Projections</p>
                                </div>
                            </div>

                            {/* Purple Guided Highlight - Goal 2 */}
                            {showGoal2Hint && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 animate-bounce pointer-events-none min-w-[200px]">
                                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border-2 border-white flex items-center justify-center gap-2">
                                        <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                                        <span>Check Equity Gaps!</span>
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-600 mx-auto -mt-0.5"></div>
                                </div>
                            )}

                            <div className="h-72 w-full pointer-events-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={BOARD_GAP_ANALYSIS} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="group" type="category" tick={{ fontSize: 12, fontWeight: 500 }} width={100} />
                                        <Tooltip
                                            cursor={{ fill: '#f3f4f6' }}
                                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                        />
                                        <Legend />
                                        <ReferenceLine x={80} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Goal (80%)', fill: 'red', fontSize: 10 }} />
                                        <Bar name="Current % Met" dataKey="current" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar name="Target %" dataKey="target" fill="#e5e7eb" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* GOAL 3: Empowered Staff */}
                        <div
                            onClick={() => {
                                setHasClickedGoal3(true);
                                setShowGoal3Hint(false);
                                launchAi("For Goal 3: Empowered Staff, analyze the correlation between teacher turnover and student growth. Which campuses need retention support?");
                            }}
                            className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg hover:border-orange-300 transition group relative"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition text-orange-600 flex items-center gap-1 text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                                <MousePointerClick size={14} /> Analyze with AI
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Goal 3</span>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition">Empowered Staff</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">Teacher Turnover Impact on Student Growth (Bubble Size = Replacement Cost)</p>
                                </div>
                            </div>

                            {/* Purple Guided Highlight - Goal 3 */}
                            {showGoal3Hint && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 animate-bounce pointer-events-none min-w-[200px]">
                                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border-2 border-white flex items-center justify-center gap-2">
                                        <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                                        <span>Analyze Staff Turnover!</span>
                                    </div>
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-600 mx-auto -mt-0.5"></div>
                                </div>
                            )}

                            <div className="h-80 w-full pointer-events-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" dataKey="turnover" name="Turnover Rate" unit="%" label={{ value: 'Teacher Turnover Rate (%)', position: 'bottom', offset: 0 }} domain={[0, 30]} />
                                        <YAxis type="number" dataKey="growth" name="Student Growth" unit="%" label={{ value: 'Avg Student Growth (%)', angle: -90, position: 'insideLeft' }} />
                                        <ZAxis type="number" dataKey="cost" range={[100, 1000]} name="Replacement Cost" unit="$" />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
                                                            <p className="font-bold text-gray-900">{data.campus}</p>
                                                            <p className="text-orange-600">Turnover: {data.turnover}%</p>
                                                            <p className="text-vt-blue">Growth: {data.growth}%</p>
                                                            <p className="text-gray-500">Est. Cost: ${data.cost.toLocaleString()}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Scatter name="Campuses" data={BOARD_TURNOVER_DATA} fill="#f97316">
                                            {BOARD_TURNOVER_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.turnover > 15 ? '#ea580c' : '#fb923c'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Goals 4 & 5 Summary */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Goal 4: Family Engagement */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Goal 4</span>
                                    <h3 className="font-bold text-gray-800">Impactful Family Engagement</h3>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="h-40 w-40">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={FAMILY_ENGAGEMENT_DATA} dataKey="value" innerRadius={40} outerRadius={60}>
                                                    {FAMILY_ENGAGEMENT_DATA.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        {FAMILY_ENGAGEMENT_DATA.map((item) => (
                                            <div key={item.name}>
                                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                                    <span>{item.name}</span>
                                                    <span>{item.value}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.fill }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Goal 5: Safe Environments */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Goal 5</span>
                                    <h3 className="font-bold text-gray-800">Safe & Innovative Learning Environments</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Safety Index Score</span>
                                        <span className="text-xl font-bold text-green-600">98.5%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Innovative Programs</span>
                                        <span className="text-xl font-bold text-blue-600">12 Campuses</span>
                                    </div>
                                    <button
                                        onClick={() => launchAi("Summarize the recent safety audit findings and list the campuses piloting the new Innovation Learning Labs.")}
                                        className="w-full mt-2 text-vt-blue text-sm font-bold hover:underline text-center"
                                    >
                                        View Detailed Safety Audit
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardView;