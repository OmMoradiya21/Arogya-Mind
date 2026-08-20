import { Link } from 'react-router-dom';
import { Brain, Heart, Activity, ArrowRight } from 'lucide-react';

const Landing = () => {

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm mb-4">
          <Brain size={18} /> <span className="font-medium text-sm">AI-Powered Emotional Support</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 tracking-tight leading-tight">
          Your Digital Companion for Mental Wellness
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Track your emotions, understand your patterns, and get personalized AI guidance to enhance your daily well-being.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/register" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold text-lg shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105">
            Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-lg shadow-sm transition-all hover:scale-105">
            Log In to Account
          </Link>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
        {[
          { icon: <Activity className="text-blue-500 w-8 h-8" />, title: "Mood Tracking", desc: "Log your daily emotions and build a streak of self-awareness." },
          { icon: <Brain className="text-purple-500 w-8 h-8" />, title: "AI Insights", desc: "Interact with an empathetic AI tailored to your current mood." },
          { icon: <Heart className="text-emerald-500 w-8 h-8" />, title: "Visual Analytics", desc: "Spot patterns and triggers with beautiful interactive charts." }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800 shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-slate-700">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-left">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-left leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Landing;
