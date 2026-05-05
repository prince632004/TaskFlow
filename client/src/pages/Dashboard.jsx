import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, api } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [api]);

  return (
    <Layout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-400 mt-2 text-lg">Here is what's happening across your projects today.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          Loading analytics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          <div className="glass-card p-6 border-t-4 border-t-blue-500 transform transition-all duration-200 hover:-translate-y-1">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Projects</h3>
            <p className="text-5xl font-bold text-white mt-3">{stats?.totalProjects || 0}</p>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-indigo-500 transform transition-all duration-200 hover:-translate-y-1">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Assigned to Me</h3>
            <p className="text-5xl font-bold text-indigo-400 mt-3">{stats?.myTasks || 0}</p>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-emerald-500 transform transition-all duration-200 hover:-translate-y-1">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Tasks Done</h3>
            <p className="text-5xl font-bold text-emerald-400 mt-3">{stats?.tasksByStatus?.done || 0}</p>
          </div>

          <div className="glass-card p-6 border-t-4 border-t-red-500 transform transition-all duration-200 hover:-translate-y-1 bg-gradient-to-b from-red-500/5 to-transparent">
            <h3 className="text-red-400/80 text-sm font-medium uppercase tracking-wider">Overdue Tasks</h3>
            <p className="text-5xl font-bold text-red-500 mt-3">{stats?.overdueTasks || 0}</p>
          </div>

        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
