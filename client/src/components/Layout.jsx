import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // We use this to highlight the active menu item

  return (
    <div className="flex min-h-screen bg-slate-900">
      
      {/* Universal Sidebar */}
      <aside className="w-64 bg-slate-800/30 border-r border-slate-700/50 flex flex-col shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-400 tracking-wider">TASK<span className="text-white">FLOW</span></h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/dashboard' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            Dashboard Overview
          </Link>
          <Link 
            to="/projects" 
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/projects' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            My Projects
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area: Whatever page is active is rendered here */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
