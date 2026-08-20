import { useState } from 'react';
import { Frown, Meh, Smile, Angry, Loader2 } from 'lucide-react';
import api from '../services/api';

const moods = [
  { name: 'Angry', icon: <Angry size={32} />, color: 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
  { name: 'Sad', icon: <Frown size={32} />, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  { name: 'Anxious', icon: <Meh size={32} />, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
  { name: 'Stressed', icon: <Meh size={32} />, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
  { name: 'Happy', icon: <Smile size={32} />, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

const MoodSelector = ({ onMoodSelected }) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = async (moodName) => {
    setLoading(true);
    setSelected(moodName);
    try {
      await api.post('/moods', { mood: moodName });
      onMoodSelected(moodName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">How are you feeling right now?</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {moods.map((m) => (
          <button 
            key={m.name}
            onClick={() => handleSelect(m.name)}
            disabled={loading}
            className={'flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 w-28 h-28 border-2 ' + 
              (selected === m.name ? 'border-gray-800 dark:border-gray-200 scale-105 shadow-md ' : 'border-transparent hover:scale-105 hover:bg-white dark:hover:bg-slate-800 ') + 
              m.color
            }
          >
            {loading && selected === m.name ? <Loader2 className="animate-spin w-8 h-8" /> : m.icon}
            <span className="mt-2 font-medium">{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default MoodSelector;
