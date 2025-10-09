# 📊 Mentor Dashboard - Complete Documentation

> **Updated Mentor Dashboard for PR Review Platform**  
> Now with dynamic project loading from Supabase and modular component architecture

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [What's New](#whats-new)
3. [Quick Start](#quick-start)
4. [Components](#components)
5. [Features](#features)
6. [Setup Instructions](#setup-instructions)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

The Mentor Dashboard is a React-based interface that allows mentors to:
- View all projects assigned to them
- Review student submissions across multiple stages
- Provide feedback and status updates
- Manage project files (view, download, delete)

### Key Technologies
- **React** - UI framework
- **Supabase** - Backend database and authentication
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Icons** - Icon library

---

## ✨ What's New

### Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Sidebar** | Static list of stages | Dynamic list of projects from Supabase |
| **Project Selection** | N/A | Click to view project-specific stages |
| **Data Source** | localStorage only | Supabase + localStorage |
| **Components** | Single monolithic component | Modular (ProjectList, StageDetails) |
| **Mentor Assignment** | Not tracked | Fetches projects by mentor_id |

### New Components

1. **ProjectList.jsx** - Sidebar component showing assigned projects
2. **StageDetails.jsx** - Main content showing stages and files
3. **Updated MentorDashboard.jsx** - Orchestrates the new components

---

## 🚀 Quick Start

### Prerequisites
```bash
# Node.js 16+ and npm installed
node --version
npm --version
```

### Installation
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (if not already done)
npm install

# 3. Verify .env file exists with Supabase credentials
cat .env

# 4. Start development server
npm run dev
```

### Setup Test Data
```bash
# Run the SQL script in Supabase SQL Editor
# File: setup_test_data.sql
```

### Login
```
URL: http://localhost:5173/login
Email: mentor1@example.com
Password: (not required in current setup)
```

---

## 🧩 Components

### 1. MentorDashboard.jsx
**Main container component**

**Responsibilities:**
- Fetch projects from Supabase
- Manage application state
- Handle file operations
- Coordinate child components

**State:**
```javascript
{
  projects: [],           // Projects from Supabase
  selectedProject: null,  // Currently selected project
  uploads: {},            // Files from localStorage
  viewFile: null,         // File being viewed
  remarks: {},            // Temporary remark changes
  loading: true          // Loading state
}
```

### 2. ProjectList.jsx
**Sidebar component for project selection**

**Props:**
```javascript
{
  projects: Array,        // Array of project objects
  selectedProject: Object, // Currently selected project
  onSelectProject: Function, // Selection callback
  loading: Boolean       // Loading state
}
```

**Features:**
- Loading state indicator
- Empty state message
- Project highlighting
- Truncated text for long titles

### 3. StageDetails.jsx
**Main content component for stage management**

**Props:**
```javascript
{
  selectedProject: Object,   // Selected project
  uploads: Object,           // Upload data
  remarks: Object,           // Remark changes
  onRemarkChange: Function,  // Remark change handler
  onSubmitRemark: Function,  // Remark submit handler
  onFileView: Function,      // File view handler
  onDownload: Function,      // Download handler
  onDelete: Function        // Delete handler
}
```

**Features:**
- Project header with details
- 11-stage table
- Status icons and dropdowns
- Action buttons (View, Download, Save, Delete)

---

## 🎨 Features

### 1. Project Management
- ✅ Fetch projects assigned to logged-in mentor
- ✅ Display project title, domain, and description
- ✅ Select project to view details
- ✅ Visual feedback for selected project

### 2. Stage Management
- ✅ 11 predefined stages (Idea Presentation → Achievements)
- ✅ File upload tracking per stage
- ✅ Status management (Accepted, Needs Improvement, Rejected)
- ✅ Visual status indicators

### 3. File Operations
- ✅ **View**: Open files in modal iframe
- ✅ **Download**: Download files to device
- ✅ **Remark**: Add status feedback
- ✅ **Delete**: Remove files from storage

### 4. UI/UX
- ✅ Responsive layout (sidebar + main content)
- ✅ Dark theme sidebar
- ✅ Light theme main content
- ✅ Smooth transitions and hover effects
- ✅ Loading and empty states

---

## 🛠️ Setup Instructions

### 1. Database Setup

#### Create Tables (if not exists)
```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('mentor', 'mentee', 'admin', 'hod', 'project_coordinator')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  project_name TEXT,
  description TEXT,
  domain TEXT,
  mentor_id UUID REFERENCES users(id),
  mentor_email TEXT,
  created_by UUID REFERENCES users(id),
  team_members JSONB,
  deadline TIMESTAMP,
  status TEXT DEFAULT 'draft',
  avg_rating NUMERIC DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_projects_mentor_id ON projects(mentor_id);
```

#### Add Test Data
```bash
# Run setup_test_data.sql in Supabase SQL Editor
# This creates:
# - 2 mentor users
# - 2 mentee users
# - 7 test projects
# - Sample reviews
```

### 2. Environment Configuration

**File: `frontend/.env`**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Application Setup

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📖 Usage Guide

### For Mentors

#### 1. Login
1. Navigate to `/login`
2. Enter your mentor email
3. Click "Login"
4. Redirected to `/mentor-dashboard`

#### 2. View Projects
- Sidebar displays all assigned projects
- Each project shows title and domain
- Blue highlight indicates selected project

#### 3. Select a Project
1. Click any project in sidebar
2. Main content updates with project details
3. Stage table shows all 11 stages

#### 4. Review Submissions

**View File:**
1. Locate stage with uploaded file
2. Click green "View" button
3. File opens in modal
4. Click "Close" to exit

**Download File:**
1. Click blue "Download" button
2. File downloads to your device

**Add Remark:**
1. Select status from dropdown
2. Click yellow "Save Remark" button
3. Confirmation alert appears
4. Status icon updates

**Delete File:**
1. Click red "Delete" button
2. File removed from table
3. Row shows "-" in filename column

#### 5. Logout
- Click red "Logout" button in sidebar
- Redirected to `/login`

---

## 🔌 API Reference

### Supabase Queries

#### Fetch Projects
```javascript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('mentor_id', mentorId)
  .order('created_at', { ascending: false });
```

**Response:**
```javascript
[
  {
    id: "uuid",
    title: "Project Title",
    description: "Description",
    domain: "Domain",
    mentor_id: "mentor-uuid",
    created_at: "2025-01-01T00:00:00Z",
    // ... other fields
  }
]
```

### localStorage Schema

#### Current User
```javascript
localStorage.getItem('currentUser')
// Returns:
{
  "userId": "uuid",
  "role": "mentor",
  "email": "mentor@example.com",
  "name": "Mentor Name"
}
```

#### Uploads
```javascript
localStorage.getItem('uploads')
// Returns:
{
  "ideaPresentation": {
    "filename": "idea.pdf",
    "fileURL": "blob:...",
    "remark": "Accepted"
  },
  "progress1": {
    "filename": "progress1.pdf",
    "fileURL": "blob:...",
    "remark": "Needs Improvement"
  }
  // ... other stages
}
```

---

## 🐛 Troubleshooting

### Issue: Projects Not Loading

**Symptoms:**
- Sidebar shows "No projects assigned"
- Console shows errors

**Solutions:**
1. **Check user login:**
   ```javascript
   JSON.parse(localStorage.getItem('currentUser'))
   ```
2. **Verify projects in database:**
   ```sql
   SELECT * FROM projects WHERE mentor_id = 'your-mentor-id';
   ```
3. **Check Supabase connection:**
   - Verify `.env` file
   - Check browser console for errors
   - Restart dev server

### Issue: "No user logged in" Error

**Solution:**
```javascript
// Clear localStorage
localStorage.clear();
// Login again
```

### Issue: Files Not Showing

**Cause:** Files stored in localStorage are browser-specific

**Solution:**
- Upload files via mentee dashboard first
- Check localStorage:
  ```javascript
  JSON.parse(localStorage.getItem('uploads'))
  ```

### Issue: Supabase Connection Error

**Solutions:**
1. Verify environment variables
2. Check Supabase project status
3. Verify API keys are correct
4. Check network connectivity

---

## 🚀 Future Enhancements

### Short Term
- [ ] Add search/filter for projects
- [ ] Add pagination for many projects
- [ ] Add toast notifications (replace alerts)
- [ ] Add loading skeletons

### Medium Term
- [ ] Migrate files to Supabase Storage
- [ ] Add Supabase Authentication
- [ ] Add Row Level Security (RLS)
- [ ] Add project sorting options

### Long Term
- [ ] Add real-time updates (Supabase Realtime)
- [ ] Add analytics dashboard
- [ ] Add bulk operations
- [ ] Add export functionality
- [ ] Add mobile responsive design

---

## 📚 Additional Resources

### Documentation Files
- **MENTOR_DASHBOARD_UPDATE.md** - Detailed update summary
- **TESTING_GUIDE.md** - Comprehensive testing instructions
- **ARCHITECTURE.md** - Technical architecture details
- **QUICK_START.md** - 5-minute quick start guide
- **setup_test_data.sql** - Database test data script

### External Links
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✨ Added dynamic project loading from Supabase
- ✨ Created ProjectList component
- ✨ Created StageDetails component
- ♻️ Refactored MentorDashboard for modularity
- 📝 Added comprehensive documentation
- 🧪 Added test data setup script

### Version 1.0.0 (Previous)
- ✅ Basic mentor dashboard with static stages
- ✅ File operations (view, download, delete)
- ✅ Remark management
- ✅ localStorage integration

---

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the testing guide
3. Check browser console for errors
4. Verify database setup

---

## 📄 License

This project is part of the PR Review Platform.

---

**Last Updated:** 2025-10-09  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
