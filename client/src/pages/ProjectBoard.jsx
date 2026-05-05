import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const ProjectBoard = () => {
  const { projectId } = useParams(); // Gets the project ID from the browser URL
  const navigate = useNavigate(); // Hook to redirect user after deleting project
  const { api, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]); // Store teammates
  const [loading, setLoading] = useState(true);

  // Task Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState(user._id); // Defaults to self
  const [error, setError] = useState('');

  // Member Modal State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');

  const fetchBoardData = async () => {
    try {
      // 1. Fetch Tasks
      const { data: tasksData } = await api.get(`/tasks/project/${projectId}`);
      setTasks(tasksData);

      // 2. Fetch Projects to get the team members for this specific project
      const { data: projectsData } = await api.get('/projects');
      const currentProject = projectsData.find(p => p._id === projectId);
      
      if (currentProject) {
        // Combine the admin and members into one array so we can assign tasks to anyone
        const allMembers = [currentProject.admin, ...currentProject.members.filter(m => m._id !== currentProject.admin._id)];
        setProjectMembers(allMembers);
        
        // If assignedTo is empty (e.g. first load), default to the admin
        if (!assignedTo) setAssignedTo(allMembers[0]._id);
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [projectId, api]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/tasks/project/${projectId}`, {
        title,
        description: desc,
        priority,
        assignedTo // Now dynamically selected from the dropdown
      });
      setShowModal(false);
      setTitle('');
      setDesc('');
      fetchBoardData(); // Refresh board

    } catch (error) {
      setError(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchBoardData(); // Refresh board to show task in new column
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status. Are you authorized?");
      // If it fails, we fetch again to revert the dropdown to its original state
      fetchBoardData();
    }
  };

  // Invite Teammate Handler
  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    try {
      await api.put(`/projects/${projectId}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      alert('Teammate invited successfully!');
      fetchBoardData(); // Refresh to update the assignee dropdown
    } catch (error) {
      setMemberError(error.response?.data?.message || 'Failed to invite member');
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchBoardData(); // Refresh board
      } catch (error) {
        alert(error.response?.data?.message || "Only the project Admin can delete tasks.");
      }
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async () => {
    if (window.confirm("WARNING: Are you sure you want to delete this ENTIRE project and all its tasks? This action cannot be undone.")) {
      try {
        await api.delete(`/projects/${projectId}`);
        navigate('/projects'); // Kick them back to the projects list
      } catch (error) {
        alert(error.response?.data?.message || "Only the project Admin can delete the project.");
      }
    }
  };

  // Helper function to split tasks into their respective columns
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  // A reusable component for the 3 columns (To Do, In Progress, Done)
  const TaskColumn = ({ title, status, colorClass }) => (
    <div className="flex flex-col bg-slate-800/20 rounded-xl p-4 border border-slate-700/50 min-h-[500px]">
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${colorClass}`}>
        <span className="w-2 h-2 rounded-full bg-current"></span>
        {title} 
        <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded-md text-xs text-slate-400">
          {getTasksByStatus(status).length}
        </span>
      </h3>
      
      <div className="space-y-4 flex-1">
        {getTasksByStatus(status).map(task => (
          <div key={task._id} className="glass-card p-4 hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-sm ${
                task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>{task.priority}</span>
              
              {/* Delete Task Button */}
              <button 
                onClick={() => handleDeleteTask(task._id)} 
                className="text-slate-600 hover:text-red-400 transition-colors" 
                title="Delete Task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
            
            <h4 className="font-semibold text-white text-sm mb-1">{task.title}</h4>
            <p className="text-slate-400 text-xs mb-4 line-clamp-2">{task.description}</p>
            
            <div className="flex justify-between items-center border-t border-slate-700/50 pt-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold" title={task.assignedTo?.name}>
                {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              
              {/* Dropdown to move task between columns */}
              <select 
                className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <header className="mb-8">
        <Link to="/projects" className="text-indigo-400 text-sm hover:underline mb-2 inline-block">
          ← Back to Projects
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Board</h1>
            <p className="text-slate-400 mt-1">Manage tasks and track progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMemberModal(true)} className="btn-secondary text-indigo-400 border-indigo-900/50 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-colors">
              Invite Teammate
            </button>
            <button onClick={handleDeleteProject} className="btn-secondary text-red-400 border-red-900/50 hover:bg-red-500/10 hover:border-red-500/50 transition-colors">
              Delete Project
            </button>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
              <span>+</span> Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Pop-up Modal for Inviting Teammates */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Invite a Teammate</h2>
            {memberError && <div className="mb-4 p-2 bg-red-500/10 text-red-400 rounded text-sm">{memberError}</div>}
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Teammate's Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="input-field" 
                  placeholder="email@example.com" 
                  value={memberEmail} 
                  onChange={(e) => setMemberEmail(e.target.value)} 
                />
                <p className="text-xs text-slate-500 mt-2">Note: They must already have an account registered on TaskFlow.</p>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pop-up Modal for Creating a Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
            {error && <div className="mb-4 p-2 bg-red-500/10 text-red-400 rounded text-sm">{error}</div>}
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Task Title</label>
                <input type="text" required className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Description</label>
                <textarea className="input-field min-h-[80px]" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Priority</label>
                <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Assign To</label>
                <select className="input-field" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  {projectMembers.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} {member._id === user._id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board Grid */}
      {loading ? (
        <div className="text-slate-400">Loading board...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn title="To Do" status="To Do" colorClass="text-slate-300" />
          <TaskColumn title="In Progress" status="In Progress" colorClass="text-blue-400" />
          <TaskColumn title="Done" status="Done" colorClass="text-emerald-400" />
        </div>
      )}
    </Layout>
  );
};

export default ProjectBoard;
