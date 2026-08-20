import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, User, LogOut, Settings, Edit3, X, Check, BarChart2, Brain, Activity, Type, Minus, Plus } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [fontScale, setFontScale] = useState(16);

  useEffect(() => {
    if (user) setEditForm({ name: user.name, email: user.email });
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Set theme on mount based on localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const adjustFont = (change) => {
    let newScale = fontScale + change;
    if (newScale < 12) newScale = 12;
    if (newScale > 24) newScale = 24;
    setFontScale(newScale);
    document.documentElement.style.fontSize = `${newScale}px`;
  };

  const handleProfileSave = async () => {
    try {
      const res = await api.put('/auth/profile', editForm);
      login(res.data);
      setIsEditingProfile(false);
    } catch (err) {
      alert("Error: Email might be taken.");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to={user ? '/home' : '/'} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 tracking-tight">Aarogya Mind</Link>
      </div>
      
      {user && (
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/home"
            className={`font-medium transition flex items-center gap-1 
              ${location.pathname === '/home' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}`}
          >
            <Brain size={16}/> Home
          </Link>
          <Link
            to="/progress"
            className={`font-medium transition flex items-center gap-1 
              ${location.pathname === '/progress' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}`}
          >
            <Activity size={16}/> Progress
          </Link>
          <Link
            to="/analytics"
            className={`font-medium transition flex items-center gap-1 
              ${location.pathname === '/analytics' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}`}
          >
            <BarChart2 size={16}/> Analytics
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4 relative">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-700 dark:text-gray-300">
          <Moon className="w-5 h-5 hidden dark:block text-blue-400" />
          <Sun className="w-5 h-5 block dark:hidden text-orange-500" />
        </button>
        
        {user ? (
          <div className="relative">
            <button onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsEditingProfile(false); }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
              <User size={16} /> <span>{user.name}</span>
            </button>
            
            {/* Animated Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden origin-top-right animate-fade-in-up z-50">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-gray-800 dark:text-gray-200 mb-2">
                    <span className="font-semibold flex items-center gap-2"><Settings size={16} /> User Settings</span>
                  </div>
                  
                  {isEditingProfile ? (
                    <div className="mt-4 space-y-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" placeholder="Name" />
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" placeholder="Email" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleProfileSave} className="flex-1 flex justify-center items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded-lg transition"><Check size={14}/> Save</button>
                        <button onClick={() => {setIsEditingProfile(false); setEditForm({name: user.name, email: user.email});}} className="flex-1 flex justify-center items-center gap-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-xs font-bold py-1.5 rounded-lg transition"><X size={14}/> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                       <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                       <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition"><Edit3 size={14}/> Edit Profile Data</button>
                    </div>
                  )}
                </div>

                <div className="p-4 border-b border-gray-100 dark:border-slate-800 items-center flex justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Type size={16}/> Font Size</span>
                  <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => adjustFont(-1)} className="p-1 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition"><Minus size={14}/></button>
                    <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                    <button onClick={() => adjustFont(1)} className="p-1 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition"><Plus size={14}/></button>
                  </div>
                </div>

                <div className="p-2">
                  <button onClick={handleLogout} className="w-full flex justify-between items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition font-medium">
                    Log Out <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
