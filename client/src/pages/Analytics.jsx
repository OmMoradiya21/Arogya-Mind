import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Brush } from 'recharts';
// Custom Tooltip for Mood Timeline (LineChart)
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { mood, score } = payload[0].payload;
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
        border: `2px solid #3b82f6`,
        minWidth: 140
      }}>
        <div style={{ fontWeight: 700, color: text }}>{label}</div>
        <div style={{ fontSize: 14, color: subText, marginTop: 4 }}>Mood: <span style={{ color: text, fontWeight: 600 }}>{mood}</span></div>
        <div style={{ fontSize: 13, color: subText, marginTop: 2 }}>Score: <span style={{ color: text }}>{score}</span></div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Emotion Frequency (BarChart)
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, count } = payload[0].payload;
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
        minWidth: 120
      }}>
        <div style={{ fontWeight: 700, color: text }}>{name}</div>
        <div style={{ fontSize: 14, color: subText, marginTop: 4 }}>{count} Logs</div>
      </div>
    );
  }
  return null;
};
import { Activity, Flame, CalendarDays } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
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

  const moodScores = { 'Happy': 5, 'Stressed': 2, 'Anxious': 3, 'Sad': 1, 'Angry': 1 };
  
  const timelineData = moods.map(m => {
    const d = new Date(m.createdAt);
    return {
      date: `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`,
      score: moodScores[m.mood] || 3,
      mood: m.mood
    };
  }).slice(-14);

  const freqMap = {};
  moods.forEach(m => { freqMap[m.mood] = (freqMap[m.mood] || 0) + 1; });
  const freqData = Object.keys(freqMap).map(k => ({ name: k, count: freqMap[k] }));

  let streak = 0;
  if (moods.length > 0) {
    const dates = [...new Set(moods.map(m => new Date(m.createdAt).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
    const current = new Date();
    current.setHours(0,0,0,0);
    const firstLog = new Date(dates[0]);
    firstLog.setHours(0,0,0,0);
    
    let daysDiff = Math.floor((current - firstLog) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0 || daysDiff === 1) {
       streak = 1;
       for (let i = 0; i < dates.length - 1; i++) {
         const t1 = new Date(dates[i]);
         const t2 = new Date(dates[i+1]);
         const diff = Math.floor((t1 - t2) / (1000 * 60 * 60 * 24));
         if (diff === 1) streak++; else break;
       }
    }
  }
  
  if (loading) return <div className="text-center p-20 dark:text-white">Loading insights...</div>;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pt-6">Your Well-being Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl"><Flame size={28}/></div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Current Momentum</p>
              <h4 className="text-2xl font-bold text-orange-500 dark:text-orange-400">{streak} Day Streak 🔥</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl"><Activity size={28}/></div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Check-ins</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{moods.length} Logs</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl"><CalendarDays size={28}/></div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Most Frequent</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                {freqData.sort((a,b)=>b.count-a.count)[0]?.name || '-'}
              </h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Mood Timeline</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Peak (Happy)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Mid (Anxious)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Low (Stressed)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Lowest (Sad/Angry)</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} dot={{ strokeWidth: 4, r: 6, fill: '#fff' }} activeDot={{ r: 8 }} />
                  <Brush dataKey="date" height={30} stroke="#3b82f6" fill="rgba(59,130,246,0.1)" tickFormatter={() => ''} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Emotion Frequency</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freqData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: 'transparent'}} content={<CustomBarTooltip />} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
