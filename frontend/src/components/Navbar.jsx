import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  // .1 - Hooks setup
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userProfile, isAuthenticated, signOut } = useAuth();

  // .2 - Scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // .3 - Base Navbar links
  const baseLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  // .3.1 - Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!isAuthenticated || !userProfile?.role) return null;
    
    switch (userProfile.role.toLowerCase()) {
      case 'mentee':
        return { path: '/mentee-dashboard', label: 'Mentee Dashboard' };
      case 'mentor':
        return { path: '/mentor-dashboard', label: 'Mentor Dashboard' };
      case 'hod':
        return { path: '/hod-dashboard', label: 'HOD Dashboard' };
      case 'project_coordinator':
        return { path: '/project-coordinator-dashboard', label: 'Coordinator Dashboard' };
      default:
        return null;
    }
  };

  // .3.2 - Build final nav links (insert Dashboard after Home when logged-in)
  const navLinks = (() => {
    const links = [...baseLinks];
    const dashboardLink = getDashboardLink();
    if (dashboardLink) {
      // Insert after Home (index 1)
      links.splice(1, 0, { path: dashboardLink.path, label: 'Dashboard' });
    }
    return links;
  })();

  // .3.3 - Logout handler
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  // .4 - Return UI
  return (
    <>
      {/* .4.1 - Fixed Top Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'navbar-glass' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* .4.1.1 - Brand & Links */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold transition-all duration-300 hover:scale-105">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    PR
                  </span>
                  <span className="text-gray-800 ml-1">Review Platform</span>
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                      location.pathname === link.path
                        ? 'text-indigo-600 bg-indigo-50 shadow-sm'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* .4.1.2 - User Profile & Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="inline-flex sm:hidden items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Show user info and logout when authenticated */}
              {isAuthenticated && userProfile ? (
                <div className="flex items-center space-x-3">
                  {/* User Profile Info */}
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{userProfile.role}</span>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm font-medium"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                /* Show Login/Signup when not authenticated */
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* .4.2 - Mobile Menu */}
        <div className="sm:hidden px-4 pb-3 pt-2 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          {/* Mobile User Info */}
          {isAuthenticated && userProfile && (
            <div className="flex items-center space-x-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{userProfile.name}</p>
                <p className="text-xs text-gray-500 capitalize">{userProfile.role}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-3 text-left rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full px-4 py-3 text-left rounded-lg text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* .4.3 - Spacer to push page content below fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar; 