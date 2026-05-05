import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// This is a Wrapper Component
// It checks if a user is logged in before letting them see the page inside it.
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading screen while we check local storage for the token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user exists, render the requested page (children). 
  // If not, instantly redirect them back to the Login page.
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
