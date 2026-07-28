# CloudTask Pro Platform Architecture

```text
CloudTask Pro Platform
│
├── Public Website
├── Authentication
├── Workspace (Organization)
├── Teams
├── Projects
├── Tasks
├── Files
├── Calendar
├── Analytics
├── Notifications
├── Billing
├── Settings
└── Admin Portal
```

---

## 1. PUBLIC WEBSITE
**Everyone can access**
- Landing Page
- Pricing
- About
- Documentation
- Contact
- Privacy Policy
- Terms
- Login
- Register

*Guest cannot access Dashboard.*

---

## 2. AUTHENTICATION
**Guest**
↓
**Register**
↓
**Email Verification**
↓
**Login**
↓
**Dashboard**

**Features:**
- Register
- Login
- Logout
- Forgot Password
- Reset Password
- Email Verification
- JWT Authentication
- Refresh Token

---

## 3. USER TYPES
There are only 3 Global Roles:
1. **Guest**
2. **User**
3. **System Admin**

*Everything else is inside a Workspace.*

---

## 4. WORKSPACE (Organization)
Every logged-in user can create ONE workspace.

**Example:**
Prii Technologies
↓
Workspace

**Inside Workspace:**
```text
Workspace
│
├── Members
├── Teams
├── Projects
├── Billing
├── Analytics
└── Settings
```

**Owner becomes Workspace Owner**

### Workspace Roles

#### **Workspace Owner**
**Can:**
- ✅ Edit Workspace
- ✅ Delete Workspace
- ✅ Invite Members
- ✅ Remove Members
- ✅ Create Teams
- ✅ Delete Teams
- ✅ Create Projects
- ✅ Billing
- ✅ Subscription
- ✅ Change Roles
- ✅ Analytics
- ✅ Settings

**Cannot:**
- ❌ Access System Admin Panel

#### **Workspace Admin**
**Can:**
- ✅ Invite Members
- ✅ Remove Members
- ✅ Manage Teams
- ✅ Manage Projects
- ✅ Analytics
- ✅ Files
- ✅ Calendar

**Cannot:**
- ❌ Delete Workspace
- ❌ Billing
- ❌ Subscription

#### **Member**
**Can:**
- ✅ Join Projects
- ✅ Update Tasks
- ✅ Comment
- ✅ Upload Files
- ✅ View Calendar

**Cannot:**
- ❌ Invite Members
- ❌ Billing
- ❌ Delete Projects

---

## 5. TEAMS
Workspace
↓
Create Team

**Examples:**
- Frontend Team
- Backend Team
- Design Team
- Marketing Team

**Each Team has:**
- Manager
- Members

#### **Team Manager**
**Can:** Assign Tasks, Manage Team, View Reports, Invite to Team, Approve Tasks
**Cannot:** Workspace Billing, Workspace Settings

#### **Team Member**
**Can:** View Team, Update Assigned Tasks, Comment, Upload Files

---

## 6. PROJECTS
Inside Workspace
Workspace
↓
Projects
↓
Website | Mobile App | Admin Portal

**Project contains:**
- Tasks
- Files
- Members
- Calendar
- Activity
- Settings

### Project Roles

#### **Project Manager**
**Can:** Create Tasks, Delete Tasks, Assign Members, Move Tasks, Close Sprint, View Analytics, Upload Files
**Cannot:** Workspace Billing, Workspace Settings

#### **Developer**
**Can:** Update Assigned Tasks, Comment, Upload Files, View Calendar
**Cannot:** Delete Project, Invite Members

#### **Viewer**
**Can:** Read Only

---

## 7. TASKS
**Lifecycle:**
Todo
↓
In Progress
↓
Review
↓
Testing
↓
Done
↓
Archived

**Task contains:**
Title, Description, Priority, Assignee, Deadline, Comments, Files, Labels, Activity

---

## 8. FILES
Inside Project
**Can Upload:** Images, PDF, Word, Excel, ZIP, Videos

**Permissions:**
- **Owner**: Upload, Delete, Rename, Share
- **Member**: Upload, Download
- **Viewer**: Download

---

## 9. CALENDAR
**Shows:** Task Due Dates, Meetings, Sprint End, Deadlines

---

## 10. ANALYTICS
*Available only in Pro*
**Charts:** Task Completion, Projects, Productivity, Members, Deadlines, Weekly Reports, Monthly Reports

---

## 11. NOTIFICATIONS
**Examples:** Task Assigned, Task Completed, Comment Added, Member Invited, Payment Success, Subscription Expiring

---

## 12. ACTIVITY
**Every action:** Login, Project Created, Task Created, Task Deleted, Member Invited, Role Changed, Payment Done

---

## 13. BILLING
- Current Plan
- Payment History
- Invoices (Future)
- Upgrade
- Cancel Plan

---

## 14. PLANS

### **FREE** (₹0)
- 1 Workspace
- 2 Projects
- 10 Tasks / Project
- 3 Members
- 100 MB Storage
- Basic Dashboard, Kanban, Calendar, Notifications
- **NO**: Analytics, Files >100MB, API Keys, Integrations

### **PRO** (₹499/month)
- Unlimited Projects
- Unlimited Tasks
- Unlimited Members
- 20 GB Storage
- Analytics, Files, API Keys, Integrations
- Priority Support, Activity Logs

### **ENTERPRISE**
- Unlimited Everything
- SSO, Audit Logs
- Unlimited Storage
- Custom Branding
- Priority SLA, Dedicated Support
- No Razorpay, Contact Sales

---

## 15. RAZORPAY FLOW
Dashboard
↓
Upgrade
↓
Pricing
↓
Choose Pro
↓
Create Order
↓
Razorpay Checkout
↓
Payment Success
↓
Verify Signature
↓
Save Payment
↓
Activate Subscription
↓
Dashboard Updated

**Database:** `payments`, `subscriptions`

---

## 16. ADMIN PANEL
**Only System Admin**

**Can Access:** Dashboard, Users, Workspaces, Projects, Payments, Subscriptions, Revenue, Plans, Audit Logs, System Logs, Feature Flags, Health, Storage

---

## 17. COMPLETE USER FLOW
```text
Guest
│
├── Landing
├── Pricing
├── About
├── Docs
└── Register
        │
        ▼
Email Verification
        │
        ▼
Login
        │
        ▼
Dashboard
        │
        ▼
Create Workspace
        │
        ▼
Become Workspace Owner
        │
        ▼
Create Team
        │
        ▼
Invite Members
        │
        ▼
Assign Workspace Roles
        │
        ▼
Create Project
        │
        ▼
Assign Project Manager
        │
        ▼
Create Tasks
        │
        ▼
Assign Developers
        │
        ▼
Task Lifecycle
        │
        ▼
Analytics
        │
        ▼
Upgrade to Pro
        │
        ▼
Razorpay Checkout
        │
        ▼
Payment Verified
        │
        ▼
Premium Features Unlocked
```

---

## 18. FEATURE ACCESS MATRIX

| Feature | Guest | Free | Pro | Workspace Owner | Workspace Admin | Team Manager | Member | System Admin |
|---|---|---|---|---|---|---|---|---|
| Register/Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Workspace | ❌ | ✅ (1) | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Invite Members | ❌ | 3 Max | Unlimited | ✅ | ✅ | Team Only | ❌ | ✅ |
| Create Teams | ❌ | 2 | Unlimited | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create Projects | ❌ | 2 | Unlimited | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create Tasks | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Assigned Only | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | View | ✅ |
| File Upload | ❌ | 100MB | 20GB | ✅ | ✅ | ✅ | ✅ | ✅ |
| API Keys | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Billing | ❌ | Own | Own | ✅ | ❌ | ❌ | ❌ | ✅ |
| System Logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
