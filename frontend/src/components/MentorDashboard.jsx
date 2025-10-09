import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import ProjectList from './ProjectList';
import StageDetails from './StageDetails';

function MentorDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploads, setUploads] = useState({});
  const [viewFile, setViewFile] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleFileView = (section) => {
    const fileURL = uploads[section]?.fileURL;
    if (fileURL) {
      setViewFile(fileURL);
    }
  };

  const closeFileView = () => {
    setViewFile(null);
  };

  const handleDownload = (section) => {
    const fileURL = uploads[section]?.fileURL;
    if (fileURL) {
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = uploads[section].filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRemarkChange = (section, event) => {
    setRemarks({ ...remarks, [section]: event.target.value });
  };

  const submitRemark = (section) => {
    if (!selectedProject) return;
    
    const updatedUploads = {
      ...uploads,
      [section]: { ...uploads[section], remark: remarks[section] || "No remarks" },
    };
    setUploads(updatedUploads);
    
    // Update project-specific uploads in localStorage
    const storedProjectUploads = JSON.parse(localStorage.getItem('projectUploads')) || {};
    storedProjectUploads[selectedProject.id] = updatedUploads;
    localStorage.setItem('projectUploads', JSON.stringify(storedProjectUploads));
    
    alert("Remark submitted successfully!");
  };

  const handleDeleteFile = (section, filename) => {
    if (!selectedProject) return;
    
    const newUploads = { ...uploads };
    if (newUploads[section]) {
      delete newUploads[section];
      setUploads(newUploads);
      
      // Update project-specific uploads in localStorage
      const storedProjectUploads = JSON.parse(localStorage.getItem('projectUploads')) || {};
      if (storedProjectUploads[selectedProject.id]) {
        delete storedProjectUploads[selectedProject.id][section];
        localStorage.setItem('projectUploads', JSON.stringify(storedProjectUploads));
      }
    }
  };

  // Mock project data for demonstration
  const mockProjects = [
    {
      id: 1,
      group_id: "G1",
      project_name: "AI Chatbot",
      title: "AI Chatbot",
      description: "An intelligent chatbot system using natural language processing",
      domain: "Artificial Intelligence",
      mentor_id: "mentor1"
    },
    {
      id: 2,
      group_id: "G2",
      project_name: "E-Commerce Platform",
      title: "E-Commerce Platform",
      description: "A complete online shopping platform with payment integration",
      domain: "Web Development",
      mentor_id: "mentor1"
    },
    {
      id: 3,
      group_id: "G3",
      project_name: "Mobile Banking App",
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      domain: "Mobile Development",
      mentor_id: "mentor1"
    },
    {
      id: 4,
      group_id: "G4",
      project_name: "Data Analytics Dashboard",
      title: "Data Analytics Dashboard",
      description: "Real-time data visualization and analytics dashboard",
      domain: "Data Science",
      mentor_id: "mentor1"
    },
    {
      id: 5,
      group_id: "G5",
      project_name: "IoT Smart Home",
      title: "IoT Smart Home",
      description: "Internet of Things based smart home automation system",
      domain: "IoT",
      mentor_id: "mentor1"
    }
  ];

  // Load projects assigned to the current mentor
  useEffect(() => {
    const loadProjects = () => {
      try {
        setLoading(true);
        
        // Get current user from localStorage
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
          console.error('No user logged in');
          navigate('/login');
          return;
        }

        const currentUser = JSON.parse(currentUserStr);
        const mentorId = currentUser.userId || 'mentor1'; // Default to mentor1 for demo

        // Filter projects assigned to this mentor
        const assignedProjects = mockProjects.filter(project => project.mentor_id === mentorId);
        setProjects(assignedProjects);

      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();

    // Load project-specific uploads from localStorage or create sample data
    const storedProjectUploads = JSON.parse(localStorage.getItem('projectUploads')) || {};
    
    // If no uploads exist, create some sample data for demonstration
    if (Object.keys(storedProjectUploads).length === 0) {
      const sampleProjectUploads = {
        1: { // G1_AI Chatbot
          ideaPresentation: {
            filename: "AI_Chatbot_Idea_Presentation.pdf",
            fileURL: "#",
            timestamp: "2024-01-15 10:30:00",
            remark: "Accepted"
          },
          progress1: {
            filename: "AI_Chatbot_Progress_1.pdf",
            fileURL: "#",
            timestamp: "2024-02-01 14:20:00",
            remark: "Needs Improvement"
          },
          progress2: {
            filename: "AI_Chatbot_Progress_2.ppt",
            fileURL: "#",
            timestamp: "2024-02-15 16:45:00",
            remark: "Accepted"
          },
          finalReport: {
            filename: "AI_Chatbot_Final_Report.pdf",
            fileURL: "#",
            timestamp: "2024-03-20 11:15:00",
            remark: "Pending Review"
          }
        },
        2: { // G2_E-Commerce Platform
          ideaPresentation: {
            filename: "ECommerce_Idea_Presentation.pdf",
            fileURL: "#",
            timestamp: "2024-01-20 09:15:00",
            remark: "Accepted"
          },
          progress1: {
            filename: "ECommerce_Progress_1.pdf",
            fileURL: "#",
            timestamp: "2024-02-05 13:30:00",
            remark: "Accepted"
          }
        },
        3: { // G3_Mobile Banking App
          ideaPresentation: {
            filename: "Banking_App_Idea.pdf",
            fileURL: "#",
            timestamp: "2024-01-25 11:45:00",
            remark: "Needs Improvement"
          }
        }
        // G4 and G5 will have no data to demonstrate "No progress available"
      };
      localStorage.setItem('projectUploads', JSON.stringify(sampleProjectUploads));
    }
    
    // Set uploads based on selected project or empty if no project selected
    setUploads({});
  }, [navigate]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    
    // Load project-specific uploads
    const storedProjectUploads = JSON.parse(localStorage.getItem('projectUploads')) || {};
    const projectUploads = storedProjectUploads[project.id] || {};
    setUploads(projectUploads);
  };

  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-900 p-5">
        <h2 className="text-xl font-bold text-center mb-6">Mentor Dashboard</h2>
        
        <ProjectList
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          loading={loading}
        />

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-6 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-6 bg-white text-gray-900 overflow-auto">
        <StageDetails
          selectedProject={selectedProject}
          uploads={uploads}
          remarks={remarks}
          onRemarkChange={handleRemarkChange}
          onSubmitRemark={submitRemark}
          onFileView={handleFileView}
          onDownload={handleDownload}
          onDelete={handleDeleteFile}
        />

        {/* File View Modal */}
        {viewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-4/5 h-4/5 relative shadow-xl">
              <button
                onClick={closeFileView}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaTimes />
                <span>Close</span>
              </button>
              <iframe
                src={viewFile}
                className="w-full h-full rounded-lg"
                title="File Viewer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorDashboard;
