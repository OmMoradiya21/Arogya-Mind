import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// Custom Tooltip for PieChart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0].payload;
    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const bg = isDark ? '#1e293b' : '#fff';
    const text = isDark ? '#f1f5f9' : '#0f172a';
    const subText = isDark ? '#94a3b8' : '#64748b';
    return (
      <div style={{
        background: bg,
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        padding: '12px 18px',
        border: `2px solid ${color || '#ddd'}`,
        minWidth: 120
      }}>
        <div style={{ fontWeight: 700, color }}>{name}</div>
        <div style={{ fontSize: 14, color: subText, marginTop: 4 }}>{value} Logs</div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for AreaChart (Positivity Trajectory)
const CustomAreaTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { date, mood, score } = payload[0].payload;
    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const bg = isDark ? '#1e293b' : '#fff';
    const text = isDark ? '#f1f5f9' : '#0f172a';
    const subText = isDark ? '#94a3b8' : '#64748b';
    return (
      <div style={{
        background: bg,
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        padding: '12px 18px',
        border: `2px solid #10b981`,
        minWidth: 140
      }}>
        <div style={{ fontWeight: 700, color: text }}>{date}</div>
        <div style={{ fontSize: 14, color: subText, marginTop: 4 }}>Mood: <span style={{ color: text, fontWeight: 600 }}>{mood}</span></div>
        <div style={{ fontSize: 13, color: subText, marginTop: 2 }}>Positivity Score: <span style={{ color: text }}>{score}</span></div>
      </div>
    );
  }
  return null;
};
import { Target, TrendingUp, Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Progress = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await api.get('/moods');
        setMoods(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  if (loading) return <div className="text-center p-20 dark:text-white">Analyzing emotional transformation...</div>;

  // 1. Initial State vs Current State Calculation
  const initialLogs = moods.slice(0, 10); // Look at the first 10 entries ever
  const recentLogs = moods.slice(-10); // Look at the last 10 entries recently

  const getDominant = (arr) => {
    if(!arr || arr.length === 0) return 'None';
    const map = {};
    arr.forEach(m => map[m.mood] = (map[m.mood] || 0) + 1);
    return Object.keys(map).reduce((a,b) => map[a] > map[b] ? a : b);
  };

  const initialDominant = getDominant(initialLogs);
  const currentDominant = getDominant(recentLogs);

  // Color mapping logic for the visual states
  const moodColors = { 'Happy': 'emerald', 'Stressed': 'orange', 'Anxious': 'blue', 'Sad': 'indigo', 'Angry': 'red', 'None': 'gray' };
  const initialColor = moodColors[initialDominant] || 'gray';
  const currentColor = moodColors[currentDominant] || 'gray';

  // 2. Emotional Balance Math (Past 30 Logs)
  const hexColors = { 'Happy': '#10b981', 'Stressed': '#f59e0b', 'Anxious': '#3b82f6', 'Sad': '#6366f1', 'Angry': '#ef4444' };
  const last30Moods = moods.slice(-30);
  const balanceMap = {};
  last30Moods.forEach(m => { balanceMap[m.mood] = (balanceMap[m.mood] || 0) + 1; });
  const balanceData = Object.keys(balanceMap).map(mood => ({ name: mood, value: balanceMap[mood], color: hexColors[mood] || '#94a3b8' }));

  // 3. Trend Area Math (Positivity Velocity)
  const moodScores = { 'Happy': 5, 'Stressed': 2, 'Anxious': 3, 'Sad': 1, 'Angry': 1 };
  const trendData = last30Moods.map((m) => {
    const d = new Date(m.createdAt);
    return {
      date: `${d.getDate()}/${d.getMonth()+1}`,
      score: moodScores[m.mood] || 3,
      mood: m.mood
    };
  });

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white pt-6">Your Transformation</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">See exactly how far your mental health has progressed.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* The Transformation: Initial vs Current */}
          <div className="bg-gradient-to-r from-white to-blue-100 dark:from-slate-900 dark:to-indigo-950 p-10 rounded-[2.5rem] shadow-xl border border-indigo-200 dark:border-indigo-900/40 relative overflow-hidden md:col-span-3">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
               <Sparkles size={300} className="text-emerald-400" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10 relative z-10">Where You Started vs Where You Are Right Now</h3>
             
             <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 relative z-10">
                {/* Initial State */}
                 <div className="flex flex-col items-center">
                   <p className="text-gray-500 dark:text-gray-400 font-medium mb-4 uppercase tracking-widest text-sm">How You Started</p>
                   <div className="w-40 h-40 rounded-full border-4 border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800 shadow-inner">
                     <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">{initialDominant}</span>
                   </div>
                 </div>
                
                {/* Arrow Transition */}
                <div className="animate-pulse">
                   <ArrowRight size={48} className="text-blue-400 opacity-60 rotate-90 md:rotate-0" />
                </div>

                {/* Current State */}
                 <div className="flex flex-col items-center">
                   <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-4 uppercase tracking-widest text-sm">Where You Are Right Now</p>
                   <div className="w-48 h-48 rounded-full border-4 border-emerald-400 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/80 shadow-[0_0_50px_rgba(52,211,153,0.3)] transition-transform hover:scale-105 duration-700">
                     <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">{currentDominant}</span>
                   </div>
                 </div>
             </div>
          </div>

          {/* Emotional Balance Donut */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute top-4 left-4 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl"><Target size={20}/></div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 mt-4 text-center">Emotional Distribution</h3>
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={balanceData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={10}>
                    {balanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                 <BrainCircuit size={28} className="text-gray-200 dark:text-gray-600 opacity-60" />
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 font-medium z-10 pt-4 mt-2">Breakdown of your last 30 entries.</p>
          </div>

          {/* Positivity Velocity Area */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col relative overflow-hidden transition-all hover:shadow-lg md:col-span-2">
           <div className="absolute top-4 left-4 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><TrendingUp size={20}/></div>
            <div className="mb-6 mt-2 ml-12">
               <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Positivity Trajectory</h3>
               <p className="text-xs text-gray-400 font-medium mt-1">Are your emotions trending upwards or downwards?</p>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -40, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
export default Progress;
