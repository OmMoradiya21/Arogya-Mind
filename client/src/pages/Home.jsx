import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MoodSelector from '../components/MoodSelector';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [currentMood, setCurrentMood] = useState(null);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        
        <header className="mb-8 text-center md:text-left pt-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Hello, {user?.name?.split(' ')[0]} ??
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's take a moment for your mental well-being.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <MoodSelector onMoodSelected={setCurrentMood} />
          </div>
          
          <div className="lg:col-span-12">
            <Chatbot mood={currentMood} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
