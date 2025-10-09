# 🎨 Mentor Dashboard - Visual Guide

> **Visual diagrams and flowcharts for understanding the system**

---

## 📱 User Interface Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                         MENTOR DASHBOARD                               │
├──────────────────┬─────────────────────────────────────────────────────┤
│                  │                                                     │
│  SIDEBAR (20%)   │           MAIN CONTENT (80%)                        │
│  Dark Theme      │           Light Theme                               │
│  ──────────────  │           ─────────────                             │
│                  │                                                     │
│  ┌────────────┐  │  ┌─────────────────────────────────────────────┐  │
│  │  Mentor    │  │  │  AI-Powered Customer Support Chatbot        │  │
│  │ Dashboard  │  │  │  An intelligent chatbot using NLP...        │  │
│  └────────────┘  │  │  🏷️ Artificial Intelligence                 │  │
│                  │  └─────────────────────────────────────────────┘  │
│  ┌────────────┐  │                                                     │
│  │ 📊 AI      │  │  Uploaded Files Overview                            │
│  │ Chatbot    │  │  ┌──────────────────────────────────────────────┐ │
│  │ 🔹 AI      │◄─┼──┤ Section        │ File  │ Status │ Actions   │ │
│  └────────────┘  │  ├──────────────────────────────────────────────┤ │
│                  │  │ Idea Present.  │  -    │   ▼    │     -     │ │
│  ┌────────────┐  │  │ Progress 1     │  -    │   ▼    │     -     │ │
│  │ 📊 E-Comm  │  │  │ Progress 2     │ file  │   ▼    │ [Actions] │ │
│  │ 🔹 Web Dev │  │  │ Phase 1 Report │  -    │   ▼    │     -     │ │
│  └────────────┘  │  │ Progress 3     │  -    │   ▼    │     -     │ │
│                  │  │ Progress 4     │  -    │   ▼    │     -     │ │
│  ┌────────────┐  │  │ Final Report   │  -    │   ▼    │     -     │ │
│  │ 📊 Fitness │  │  │ Final Demo     │  -    │   ▼    │     -     │ │
│  │ 🔹 Mobile  │  │  │ Final PPT      │  -    │   ▼    │     -     │ │
│  └────────────┘  │  │ Codebook       │  -    │   ▼    │     -     │ │
│                  │  │ Achievements   │  -    │   ▼    │     -     │ │
│  ┌────────────┐  │  └──────────────────────────────────────────────┘ │
│  │ 🚪 Logout  │  │                                                     │
│  └────────────┘  │  Action Buttons:                                    │
│                  │  [View 👁️] [Download ⬇️] [Save 💾] [Delete 🗑️]    │
└──────────────────┴─────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

```
START
  │
  ▼
┌─────────────────┐
│  Login Page     │
│  Enter Email    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate User   │
│ (Supabase)      │
└────────┬────────┘
         │
         ├─── ❌ Not Found ──→ Show Error
         │
         ▼ ✅ Found
┌─────────────────┐
│ Store in        │
│ localStorage    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Navigate to     │
│ /mentor-dash    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fetch Projects  │
│ (Supabase)      │
└────────┬────────┘
         │
         ├─── ❌ Error ──→ Show Error
         │
         ▼ ✅ Success
┌─────────────────┐
│ Display Projects│
│ in Sidebar      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Selects    │
│ a Project       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Show Stages &   │
│ Files Table     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Actions:   │
│ View/Download/  │
│ Remark/Delete   │
└────────┬────────┘
         │
         ▼
       END
```

---

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MentorDashboard.jsx                      │
│                   (Container Component)                     │
│                                                             │
│  State:                                                     │
│  • projects[]        ← from Supabase                       │
│  • selectedProject   ← user selection                      │
│  • uploads{}         ← from localStorage                   │
│  • viewFile          ← modal state                         │
│  • remarks{}         ← temp changes                        │
│  • loading           ← fetch state                         │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  ProjectList.jsx     │  │  StageDetails.jsx        │   │
│  │  (Presentational)    │  │  (Presentational)        │   │
│  │                      │  │                          │   │
│  │  Props:              │  │  Props:                  │   │
│  │  • projects          │  │  • selectedProject       │   │
│  │  • selectedProject   │  │  • uploads               │   │
│  │  • onSelectProject   │  │  • remarks               │   │
│  │  • loading           │  │  • onRemarkChange        │   │
│  │                      │  │  • onSubmitRemark        │   │
│  │  Renders:            │  │  • onFileView            │   │
│  │  • Loading state     │  │  • onDownload            │   │
│  │  • Empty state       │  │  • onDelete              │   │
│  │  • Project list      │  │                          │   │
│  │  • Highlight active  │  │  Renders:                │   │
│  │                      │  │  • Project header        │   │
│  └──────────────────────┘  │  • Empty state           │   │
│                            │  • Stages table          │   │
│                            │  • Action buttons        │   │
│                            └──────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              File View Modal                         │ │
│  │              (Conditional Render)                    │ │
│  │                                                      │ │
│  │  • Shows when viewFile is set                       │ │
│  │  • Displays file in iframe                          │ │
│  │  • Close button to dismiss                          │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│  Supabase    │
│  Database    │
└──────┬───────┘
       │
       │ SELECT * FROM projects
       │ WHERE mentor_id = ?
       │
       ▼
┌──────────────┐
│ MentorDash   │
│ useEffect()  │
└──────┬───────┘
       │
       │ setProjects(data)
       │
       ▼
┌──────────────┐
│ ProjectList  │
│ Component    │
└──────┬───────┘
       │
       │ User clicks project
       │
       ▼
┌──────────────┐
│ MentorDash   │
│ handleSelect │
└──────┬───────┘
       │
       │ setSelectedProject(project)
       │
       ▼
┌──────────────┐
│ StageDetails │
│ Component    │
└──────┬───────┘
       │
       │ User clicks action
       │
       ▼
┌──────────────┐
│ MentorDash   │
│ handler()    │
└──────┬───────┘
       │
       │ Update localStorage
       │
       ▼
┌──────────────┐
│ localStorage │
│ (uploads)    │
└──────────────┘
```

---

## 🗄️ Database Schema Diagram

```
┌─────────────────────────────────────────┐
│              users                      │
├─────────────────────────────────────────┤
│ id (PK)          UUID                   │
│ email            TEXT UNIQUE            │
│ name             TEXT                   │
│ role             TEXT                   │
│ created_at       TIMESTAMP              │
└─────────────┬───────────────────────────┘
              │
              │ 1:N relationship
              │
              ▼
┌─────────────────────────────────────────┐
│            projects                     │
├─────────────────────────────────────────┤
│ id (PK)          UUID                   │
│ title            TEXT                   │
│ project_name     TEXT                   │
│ description      TEXT                   │
│ domain           TEXT                   │
│ mentor_id (FK)   UUID ──────────────────┼──► users.id
│ mentor_email     TEXT                   │
│ created_by (FK)  UUID ──────────────────┼──► users.id
│ team_members     JSONB                  │
│ deadline         TIMESTAMP              │
│ status           TEXT                   │
│ avg_rating       NUMERIC                │
│ ratings_count    INTEGER                │
│ created_at       TIMESTAMP              │
│ updated_at       TIMESTAMP              │
└─────────────┬───────────────────────────┘
              │
              │ 1:N relationship
              │
              ▼
┌─────────────────────────────────────────┐
│            reviews                      │
├─────────────────────────────────────────┤
│ id (PK)          UUID                   │
│ project_id (FK)  UUID ──────────────────┼──► projects.id
│ reviewer_id (FK) UUID ──────────────────┼──► users.id
│ rating           INTEGER                │
│ comment          TEXT                   │
│ created_at       TIMESTAMP              │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Palette Visual

```
SIDEBAR (Dark Theme)
┌─────────────────────────────────┐
│ Background: #111827 (gray-900)  │ ████████████
│ Items:      #374151 (gray-700)  │ ████████████
│ Hover:      #4B5563 (gray-600)  │ ████████████
│ Selected:   #2563EB (blue-600)  │ ████████████
│ Logout:     #DC2626 (red-600)   │ ████████████
└─────────────────────────────────┘

MAIN CONTENT (Light Theme)
┌─────────────────────────────────┐
│ Background: #FFFFFF (white)     │ ░░░░░░░░░░░░
│ Text:       #111827 (gray-900)  │ ████████████
│ Secondary:  #6B7280 (gray-500)  │ ████████████
│ Header:     #E5E7EB (gray-200)  │ ░░░░░░░░░░░░
│ Border:     #D1D5DB (gray-300)  │ ░░░░░░░░░░░░
└─────────────────────────────────┘

ACTION BUTTONS
┌─────────────────────────────────┐
│ View:       #22C55E (green-500) │ ████████████
│ Download:   #3B82F6 (blue-500)  │ ████████████
│ Remark:     #EAB308 (yellow-500)│ ████████████
│ Delete:     #EF4444 (red-500)   │ ████████████
└─────────────────────────────────┘

STATUS ICONS
┌─────────────────────────────────┐
│ Accepted:   #22C55E (green-500) │ ✅
│ Needs Work: #EAB308 (yellow-500)│ ⚠️
│ Rejected:   #EF4444 (red-500)   │ ❌
│ Pending:    #6B7280 (gray-500)  │ 📤
└─────────────────────────────────┘
```

---

## 🔀 State Transitions

```
LOADING STATE
┌─────────────┐
│  Loading... │
└──────┬──────┘
       │
       ▼
PROJECTS LOADED
┌─────────────┐
│ Project 1   │
│ Project 2   │
│ Project 3   │
└──────┬──────┘
       │ User clicks
       ▼
PROJECT SELECTED
┌─────────────┐
│ ✓ Project 1 │ ← Highlighted
│   Project 2 │
│   Project 3 │
└──────┬──────┘
       │
       ▼
STAGES DISPLAYED
┌─────────────────────────────┐
│ Project: AI Chatbot         │
│ ┌─────────────────────────┐ │
│ │ Stage Table             │ │
│ │ - Idea Presentation     │ │
│ │ - Progress 1-4          │ │
│ │ - Final Report          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

```
DESKTOP (Default)
┌────────────────────────────────────────┐
│ [Sidebar 20%] [Main Content 80%]      │
└────────────────────────────────────────┘

TABLET (Recommended Future)
┌────────────────────────────────────────┐
│ [Sidebar 30%] [Main Content 70%]      │
└────────────────────────────────────────┘

MOBILE (Recommended Future)
┌────────────────────────────────────────┐
│ [Hamburger Menu]                       │
│ [Main Content 100%]                    │
│                                        │
│ Sidebar slides in from left            │
└────────────────────────────────────────┘
```

---

## 🔄 File Operation Flows

### VIEW FILE
```
User clicks "View"
       │
       ▼
Get fileURL from uploads[section]
       │
       ▼
setViewFile(fileURL)
       │
       ▼
Modal opens
┌──────────────────┐
│ ┌──────────────┐ │
│ │   [Close]    │ │
│ ├──────────────┤ │
│ │              │ │
│ │   <iframe>   │ │
│ │   File View  │ │
│ │              │ │
│ └──────────────┘ │
└──────────────────┘
       │
       ▼
User clicks "Close"
       │
       ▼
setViewFile(null)
       │
       ▼
Modal closes
```

### SAVE REMARK
```
User selects status
       │
       ▼
handleRemarkChange(section, event)
       │
       ▼
Update remarks state
       │
       ▼
User clicks "Save Remark"
       │
       ▼
submitRemark(section)
       │
       ▼
Merge into uploads[section]
       │
       ▼
Save to localStorage
       │
       ▼
Show alert ✅
       │
       ▼
Icon updates
```

---

## 🎯 Component Interaction Map

```
                    ┌─────────────────┐
                    │   Supabase DB   │
                    └────────┬────────┘
                             │
                             │ fetch
                             ▼
┌────────────────────────────────────────────────────┐
│              MentorDashboard                       │
│                                                    │
│  ┌──────────────┐         ┌──────────────┐       │
│  │ ProjectList  │◄────────┤ StageDetails │       │
│  │              │ project │              │       │
│  │              │ selected│              │       │
│  └──────┬───────┘         └──────▲───────┘       │
│         │                        │                │
│         │ onClick                │ handlers       │
│         │                        │                │
│         ▼                        │                │
│  handleSelectProject()           │                │
│         │                        │                │
│         └────────────────────────┘                │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │         File View Modal                  │    │
│  │         (Conditional)                    │    │
│  └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
                             │
                             │ save
                             ▼
                    ┌─────────────────┐
                    │  localStorage   │
                    └─────────────────┘
```

---

## 📊 Performance Flow

```
Page Load
    │
    ├─ Parse HTML/CSS/JS          ~100ms
    │
    ├─ React Hydration            ~50ms
    │
    ├─ Component Mount            ~10ms
    │
    ├─ Fetch Projects (Supabase)  ~200-300ms
    │  │
    │  ├─ Network Request
    │  ├─ Database Query
    │  └─ Response Parse
    │
    ├─ Render ProjectList         ~20ms
    │
    └─ Ready for Interaction      ✅

User Interaction
    │
    ├─ Click Project              ~0ms (instant)
    │
    ├─ Update State               ~5ms
    │
    ├─ Re-render StageDetails     ~20ms
    │
    └─ Display Complete           ✅

File Operations
    │
    ├─ View File                  ~10ms (modal)
    ├─ Download File              ~50ms (browser)
    ├─ Save Remark                ~5ms (localStorage)
    └─ Delete File                ~5ms (localStorage)
```

---

## 🎨 UI States Visual

### Empty State
```
┌─────────────────────────────────────┐
│                                     │
│           📤                        │
│                                     │
│   No projects assigned to you yet.  │
│                                     │
└─────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────┐
│                                     │
│           ⏳                        │
│                                     │
│       Loading projects...           │
│                                     │
└─────────────────────────────────────┘
```

### Loaded State
```
┌─────────────────────────────────────┐
│  📊 AI Chatbot                      │
│  🔹 Artificial Intelligence         │
│                                     │
│  📊 E-Commerce Platform             │
│  🔹 Web Development                 │
│                                     │
│  📊 Fitness Tracker                 │
│  🔹 Mobile Development              │
└─────────────────────────────────────┘
```

---

**This visual guide complements the technical documentation with diagrams and flowcharts.**

For detailed implementation, see:
- ARCHITECTURE.md
- README_MENTOR_DASHBOARD.md
- MENTOR_DASHBOARD_UPDATE.md
