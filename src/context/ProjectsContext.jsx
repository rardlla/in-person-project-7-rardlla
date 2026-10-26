
import { createContext, useState, useContext, useEffect } from 'react';

// Create the ProjectsContext
const ProjectsContext = createContext();

// Custom hook for using projects
export const useProjects = () => {
  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }

  return context;
};

// Provider component
export const ProjectsProvider = ({ children }) => {
  // Create state for projects, loading, and error
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects when component mounts
  useEffect(() => {
    let isCancelled = false;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch projects from API
        const response = await fetch('http://localhost:3001/projects');

        // Check if response is successful
        if (!response.ok) {
          throw new Error(`HTTP error, status ${response.status}`);
        }

        // Convert response to JSON
        const data = await response.json();

        // Update state only if not cancelled
        if (!isCancelled) {
          setProjects(data);
          setLoading(false);
        }
      } catch (err) {
        // Handle errors
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProjects();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, []);

  // Share projects, loading, and error
  const value = {
    projects,
    loading,
    error
  };

  // Return the Provider
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
