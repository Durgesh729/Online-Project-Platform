# Remark System - Flow Diagrams

## 📊 System Flow Overview

### 1. Mentor Adds/Updates Remark

```mermaid
graph TB
    A[Mentor logs into Dashboard] --> B[Selects Project]
    B --> C[Views Submission Table]
    C --> D[Clicks 'Save Remark' button]
    D --> E[Modal Opens with Textarea]
    E --> F{Existing Remark?}
    F -->|Yes| G[Pre-fill with existing remark]
    F -->|No| H[Empty textarea]
    G --> I[Mentor types/edits feedback]
    H --> I
    I --> J[Clicks 'Save Remark']
    J --> K[Frontend: Send POST to /api/remarks]
    K --> L[Backend: Validate submission exists]
    L --> M[Backend: Update submissions table]
    M --> N[Set remark field]
    N --> O[Set remark_updated_at timestamp]
    O --> P[Database: Trigger executes]
    P --> Q[Success Response to Frontend]
    Q --> R[Toast: 'Remark saved successfully']
    R --> S[Modal closes]
    S --> T[Table updates with new remark]
```

### 2. Mentee Views Remark (First Time)

```mermaid
graph TB
    A[Mentee logs into Dashboard] --> B[Selects Project]
    B --> C[Page loads submissions]
    C --> D[For each submission]
    D --> E{Has remark?}
    E -->|No| F[Remarks button disabled/gray]
    E -->|Yes| G[Check if unread]
    G --> H[Query remark_reads table]
    H --> I{Read record exists?}
    I -->|No| J[Mark as UNREAD]
    I -->|Yes| K{Read time > Updated time?}
    K -->|Yes| L[Mark as READ]
    K -->|No| J
    J --> M[Show blue pulsing dot]
    L --> N[No dot shown]
    M --> O[Mentee clicks Remarks button]
    N --> O
    O --> P[Modal opens with remark]
    P --> Q[Frontend: Send POST to /api/remarks/:id/read]
    Q --> R[Backend: Insert/Update remark_reads]
    R --> S[Set read_at timestamp]
    S --> T[Success response]
    T --> U[Remove blue dot from UI]
    U --> V[Update local state]
```

### 3. Complete Interaction Cycle

```mermaid
sequenceDiagram
    participant M as Mentor
    participant MD as Mentor Dashboard
    participant API as Backend API
    participant DB as Database
    participant MeD as Mentee Dashboard
    participant Me as Mentee
    
    Note over M,Me: Initial Remark Creation
    M->>MD: Opens project submission
    M->>MD: Clicks "Save Remark"
    MD->>M: Shows modal
    M->>MD: Types "Great work!"
    M->>MD: Clicks Save
    MD->>API: POST /api/remarks
    API->>DB: UPDATE submissions SET remark='Great work!', remark_updated_at=NOW()
    DB->>DB: Trigger updates timestamp
    DB->>API: Success
    API->>MD: Remark saved
    MD->>M: Toast: "Remark saved successfully"
    
    Note over M,Me: Mentee Views Remark
    Me->>MeD: Logs in
    MeD->>API: GET submissions
    API->>DB: SELECT * FROM submissions WHERE mentee_id=X
    DB->>API: Returns submissions
    API->>MeD: Submissions data
    MeD->>DB: Check unread status
    DB->>MeD: Is unread: TRUE
    MeD->>Me: Shows blue pulsing dot
    Me->>MeD: Clicks "Remarks"
    MeD->>Me: Shows modal with remark
    MeD->>API: POST /api/remarks/:id/read
    API->>DB: INSERT INTO remark_reads
    DB->>API: Success
    API->>MeD: Marked as read
    MeD->>Me: Blue dot disappears
    
    Note over M,Me: Mentor Updates Remark
    M->>MD: Opens same submission
    M->>MD: Clicks "Save Remark"
    MD->>M: Shows modal with "Great work!"
    M->>MD: Edits to "Excellent progress!"
    M->>MD: Clicks Save
    MD->>API: POST /api/remarks
    API->>DB: UPDATE submissions SET remark='Excellent progress!', remark_updated_at=NOW()
    DB->>API: Success
    API->>MD: Updated
    
    Note over M,Me: Mentee Sees Update
    Me->>MeD: Refreshes page
    MeD->>DB: Check unread status
    DB->>MeD: Is unread: TRUE (new timestamp)
    MeD->>Me: Blue dot appears again!
```

### 4. Database Trigger Flow

```mermaid
graph LR
    A[Mentor updates remark] --> B[UPDATE submissions]
    B --> C{remark value changed?}
    C -->|Yes| D[Trigger: update_remark_timestamp]
    C -->|No| E[No trigger action]
    D --> F[Set remark_updated_at = NOW]
    F --> G[Return updated row]
    G --> H[Backend receives success]
```

### 5. Unread Status Check Algorithm

```mermaid
graph TD
    A[Check if remark is unread] --> B{Remark exists and not empty?}
    B -->|No| C[Return FALSE - No remark]
    B -->|Yes| D[Query remark_reads table]
    D --> E{Read record exists?}
    E -->|No| F[Return TRUE - Never read]
    E -->|Yes| G[Compare timestamps]
    G --> H{read_at >= remark_updated_at?}
    H -->|Yes| I[Return FALSE - Already read]
    H -->|No| J[Return TRUE - Outdated read]
```

### 6. State Management (React)

```mermaid
graph TB
    A[Component Mounts] --> B[Initialize state]
    B --> C[unreadRemarks = empty object]
    C --> D[Fetch submissions]
    D --> E[For each submission with remark]
    E --> F[Check unread status]
    F --> G{Is unread?}
    G -->|Yes| H[Add to unreadRemarks state]
    G -->|No| I[Skip]
    H --> J[Render with blue dot]
    I --> K[Render without dot]
    J --> L[User clicks Remarks]
    K --> L
    L --> M[Open modal]
    M --> N[Mark as read API call]
    N --> O[Update unreadRemarks state]
    O --> P[Remove submission ID from object]
    P --> Q[Component re-renders]
    Q --> R[Blue dot disappears]
```

## 🎯 Key Decision Points

### When to Show Blue Dot?

```
IF (submission.remark IS NOT NULL AND submission.remark != '')
    AND (
        no read record exists
        OR read_at < remark_updated_at
    )
THEN show blue dot
ELSE hide blue dot
```

### When to Auto-Update Timestamp?

```
IF (NEW.remark IS DISTINCT FROM OLD.remark)
THEN NEW.remark_updated_at = NOW()
```

### When to Enable Remarks Button?

```
IF (submission exists AND submission.remark IS NOT NULL AND submission.remark != '')
THEN enable button (yellow)
ELSE disable button (gray)
```

## 📱 User Experience Flow

### Mentor Experience

```
1. Login → 2. Select Project → 3. View Submissions
                                        ↓
4. Click "Save Remark" → 5. Type Feedback → 6. Click Save
                                        ↓
7. See Success Toast → 8. Modal Closes → 9. Continue work
```

### Mentee Experience

```
1. Login → 2. Select Project → 3. See Blue Dot 🔵
                                        ↓
4. Click "Remarks" → 5. Read Feedback → 6. Close Modal
                                        ↓
7. Blue Dot Gone ✓ → 8. Continue work
```

## 🔄 Real-time Updates (Future Enhancement)

```mermaid
graph LR
    A[Mentor saves remark] --> B[Database updated]
    B --> C[Supabase Realtime]
    C --> D[Broadcast to subscribers]
    D --> E[Mentee dashboard listening]
    E --> F[Receive update event]
    F --> G[Refresh unread status]
    G --> H[Blue dot appears instantly]
```

## 🎨 Component Hierarchy

```
MenteeDashboard
├── Project Selector
├── Project Info Card
└── Submission Stages Grid
    └── For each stage:
        ├── Stage Card
        │   ├── Stage Header
        │   ├── File Info (if uploaded)
        │   │   ├── Filename
        │   │   ├── Upload Date
        │   │   └── Status Badge
        │   └── Action Buttons
        │       ├── View Button
        │       ├── Remarks Button
        │       │   └── Blue Dot (conditional)
        │       └── Delete Button
        └── Upload Area (if not uploaded)

Remark Modal (conditional)
├── Header
│   ├── Title
│   ├── Stage Label
│   └── Close Button
├── Body
│   └── Remark Content Card
│       ├── Icon
│       └── Feedback Text
└── Footer
    └── Close Button
```

## 🗂️ Data Flow

```
Database (Supabase)
    ↓
Backend API (Express.js)
    ↓ JSON
Frontend State (React useState)
    ↓
UI Components (JSX)
    ↓
User Interface (Browser)
```

---

**Visual Reference**: Use these diagrams to understand how the remark system works end-to-end.

**Note**: The mermaid diagrams above can be rendered in any markdown viewer that supports mermaid syntax (GitHub, GitLab, VS Code with extensions, etc.)
