import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';

const Projects = () => {
  const { api } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to manage the "Create Project" modal
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Fetch the user's projects from the backend
  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [api]);

  // Handle form submission to create a new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      
      // Close modal and clear inputs
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      
      // Refresh the list immediately so the new project appears
      fetchProjects(); 
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Layout>
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">My Projects</h1>
          <p className="text-slate-400 mt-2 text-lg">Manage your teams and task boards.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <span>+</span> New Project
        </button>
      </header>

      {/* Pop-up Modal for Creating a Project */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="e.g. Website Redesign"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Briefly describe the project goals..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Projects */}
      {loading ? (
         <div className="text-slate-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex flex-col items-center">
          <p className="text-slate-400 text-lg mb-4">You are not part of any projects yet.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm px-6">Create your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="glass-card p-6 flex flex-col h-full hover:border-indigo-500/50 transition-colors group cursor-pointer">
              <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{project.description || "No description provided."}</p>
              
              <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                <div className="text-xs text-slate-500">
                  <span className="text-indigo-400 font-bold">{project.members.length}</span> Member(s)
                </div>
                <Link to={`/projects/${project._id}`} className="text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Board →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Projects;
