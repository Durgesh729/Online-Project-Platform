import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Keep for UI, but not sent to backend
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const normalizedEmail = email.toLowerCase();

      // Mock user data for demonstration
      const mockUsers = [
        {
          id: 'mentor1',
          email: 'mentor@example.com',
          role: 'mentor',
          name: 'Dr. John Smith'
        },
        {
          id: 'mentee1',
          email: 'mentee@example.com',
          role: 'mentee',
          name: 'Alice Johnson'
        },
        {
          id: 'coordinator1',
          email: 'coordinator@example.com',
          role: 'project_coordinator',
          name: 'Bob Wilson'
        },
        {
          id: 'hod1',
          email: 'hod@example.com',
          role: 'hod',
          name: 'Prof. Sarah Davis'
        }
      ];

      // Find user by email
      const user = mockUsers.find(u => u.email === normalizedEmail);

      if (!user) {
        setLoginError('User not found. Please use one of these demo accounts:\n- mentor@example.com (Mentor)\n- mentee@example.com (Mentee)\n- coordinator@example.com (Coordinator)\n- hod@example.com (HOD)');
        return;
      }

      // Store complete user information in localStorage
      const currentUser = {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Also keep individual items for backward compatibility
      if (user.role) {
        localStorage.setItem('role', user.role);
      }
      if (user.id) {
        localStorage.setItem('userId', user.id);
      }

      // Navigate based on role
      if (user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else if (user.role === 'mentee') {
        navigate('/mentee-dashboard');
      } else if (user.role === 'project_coordinator') {
        navigate('/project-coordinator-dashboard');
      } else if (user.role === 'hod') {
        navigate('/hod-dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h3 className="font-bold text-lg mb-4">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor="email" className='block text-sm font-medium'>Email</label>
            <input
              id="email"
              type="email"
              placeholder='Enter your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md outline-none'
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="password" className='block text-sm font-medium'>
              Password (Demo - any password works)
            </label>
            <input
              id="password"
              type="password"
              placeholder='Enter any password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-md outline-none'
            />
            <div className="text-sm text-blue-600 mt-2">
              <p className="font-medium">Demo Accounts:</p>
              <p>• mentor@example.com (Mentor Dashboard)</p>
              <p>• mentee@example.com (Mentee Dashboard)</p>
              <p>• coordinator@example.com (Coordinator)</p>
              <p>• hod@example.com (HOD Dashboard)</p>
            </div>
          </div>

          <div className='mb-4'>
            <button type="submit" className='w-full py-2 px-4 text-white bg-pink-500 rounded-md'>
              Login
            </button>
          </div>

          {loginError && <p className="text-center text-red-500">{loginError}</p>}

          <p className='text-sm text-center'>
            Don't have an account? <a href="/signup" className='text-blue-500 underline'>Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
