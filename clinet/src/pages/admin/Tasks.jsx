import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Users, Flag, LogIn, FileText, Settings,
  Search, Bell, Sun, Moon, Plus, ChevronDown, ChevronLeft,
  ChevronRight, Eye, MoreVertical, X, User, LogOut, Calendar,
} from "lucide-react";

// ─── shared nav ──────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, path: "/admin/dashboard" },
  { label: "Employees",           icon: Users,      path: "/admin/employee"  },
  { label: "Leads",               icon: Flag,       path: "/admin/leads"     },
  { label: "Login / Logout Logs", icon: LogIn,      path: "/admin/logs"      },
  { label: "Task & Follow-ups",   icon: FileText,   path: "/admin/tasks"     },
  { label: "Settings",            icon: Settings,   path: "/admin/settings"  },
  { label: "Create Employee",     icon: Plus,       path: "/admin/CreateEmployee" },
];

// ─── mock data ────────────────────────────────────────────────────────────────
const mockTasks = [
  {
    id: "TSK-001", name: "Website Update",    department: "IT",
    assignedTo: "Rahul Sharma",  email: "rahul.sharma@ynrs.com",
    priority: "High",   dueDate: "12 Jul 2026", status: "Pending",
    createdDate: "10 Jul 2026",
    description: "Update the company website homepage design and fix responsive issues.",
    timeline: [
      { dot: "green",  time: "10 Jul 2026 10:30 AM", text: "Task assigned to Rahul Sharma" },
      { dot: "orange", time: "11 Jul 2026 11:15 AM", text: "Status changed to In Progress"  },
      { dot: "gray",   time: "",                     text: "Pending"                        },
    ],
  },
  {
    id: "TSK-002", name: "Recruitment Drive",  department: "HR",
    assignedTo: "Neha Singh",    email: "neha.singh@ynrs.com",
    priority: "Medium", dueDate: "15 Jul 2026", status: "In Progress",
    createdDate: "09 Jul 2026",
    description: "Coordinate recruitment drive for Q3 hiring plan.",
    timeline: [
      { dot: "green",  time: "09 Jul 2026 09:00 AM", text: "Task assigned to Neha Singh" },
      { dot: "orange", time: "10 Jul 2026 02:00 PM", text: "Status changed to In Progress" },
    ],
  },
  {
    id: "TSK-003", name: "Vendor Payment",     department: "Accounts",
    assignedTo: "Amit Kumar",    email: "amit.kumar@ynrs.com",
    priority: "High",   dueDate: "10 Jul 2026", status: "Completed",
    createdDate: "08 Jul 2026",
    description: "Process pending vendor payments for June invoices.",
    timeline: [
      { dot: "green",  time: "08 Jul 2026 10:00 AM", text: "Task assigned to Amit Kumar" },
      { dot: "green",  time: "10 Jul 2026 04:00 PM", text: "Task marked as Completed"    },
    ],
  },
  {
    id: "TSK-004", name: "Monthly Report",     department: "Operations",
    assignedTo: "Priya Patel",   email: "priya.patel@ynrs.com",
    priority: "Medium", dueDate: "18 Jul 2026", status: "In Progress",
    createdDate: "11 Jul 2026",
    description: "Prepare monthly operations performance report.",
    timeline: [
      { dot: "green",  time: "11 Jul 2026 08:30 AM", text: "Task assigned to Priya Patel" },
    ],
  },
  {
    id: "TSK-005", name: "System Backup",      department: "IT",
    assignedTo: "Vikram Joshi",  email: "vikram.joshi@ynrs.com",
    priority: "Low",    dueDate: "20 Jul 2026", status: "Pending",
    createdDate: "12 Jul 2026",
    description: "Perform full system backup and verify integrity.",
    timeline: [
      { dot: "green",  time: "12 Jul 2026 11:00 AM", text: "Task assigned to Vikram Joshi" },
    ],
  },
  {
    id: "TSK-006", name: "Client Meeting",     department: "Sales",
    assignedTo: "Kavya Reddy",   email: "kavya.reddy@ynrs.com",
    priority: "Medium", dueDate: "21 Jul 2026", status: "In Progress",
    createdDate: "12 Jul 2026",
    description: "Prepare presentation and attend client review meeting.",
    timeline: [
      { dot: "green",  time: "12 Jul 2026 09:00 AM", text: "Task assigned to Kavya Reddy" },
    ],
  },
  {
    id: "TSK-007", name: "Office Maintenance", department: "Support",
    assignedTo: "Suresh Mehta",  email: "suresh.mehta@ynrs.com",
    priority: "Low",    dueDate: "22 Jul 2026", status: "Pending",
    createdDate: "12 Jul 2026",
    description: "Schedule and oversee office maintenance activities.",
    timeline: [
      { dot: "green",  time: "12 Jul 2026 10:00 AM", text: "Task assigned to Suresh Mehta" },
    ],
  },
];

// ─── style maps ───────────────────────────────────────────────────────────────
const priorityStyles = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-orange-100 text-orange-500",
  Low:    "bg-green-100 text-green-600",
};
const deptStyles = {
  IT:         "bg-blue-50 text-blue-600 border border-blue-200",
  HR:         "bg-green-50 text-green-600 border border-green-200",
  Accounts:   "bg-purple-50 text-purple-600 border border-purple-200",
  Operations: "bg-orange-50 text-orange-500 border border-orange-200",
  Sales:      "bg-teal-50 text-teal-600 border border-teal-200",
  Support:    "bg-pink-50 text-pink-500 border border-pink-200",
};
const dotColor = { green: "bg-green-500", orange: "bg-orange-400", gray: "bg-slate-300" };

const DEPT_OPTIONS     = ["All", "IT", "HR", "Accounts", "Operations", "Sales", "Support"];
const STATUS_OPTIONS   = ["All", "Pending", "In Progress", "Completed"];
const EMPLOYEE_OPTIONS = ["All", "Rahul Sharma", "Neha Singh", "Amit Kumar", "Priya Patel", "Vikram Joshi", "Kavya Reddy", "Suresh Mehta"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const ROWS_OPTIONS     = [10, 25, 50];

// ─── helpers ──────────────────────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400"
      >
        {options.map(o => <option key={o} value={o}>{label}: {o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 text-sm rounded-lg font-medium ${p === current ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-screen w-[190px] bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="h-[55px] px-6 flex items-center border-b border-slate-100">
        <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
      </div>
      <div className="flex-1 px-1 py-5 overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={label} to={path}
                className={`flex items-center h-8 px-2 rounded-lg text-xs font-medium transition-all ${active ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="ml-2">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Admin User</h4>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
        <button type="button"
          className="w-full h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── assign task panel ────────────────────────────────────────────────────────
function AssignTaskPanel({ onClose }) {
  const [taskName,    setTaskName]    = useState("");
  const [description, setDescription] = useState("");
  const [dept,        setDept]        = useState("");
  const [employee,    setEmployee]    = useState("");
  const [priority,    setPriority]    = useState("");
  const [dueDate,     setDueDate]     = useState("");

  return (
    <div className="fixed top-0 right-0 h-screen w-[340px] bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl text-left">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800">Assign New Task</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Task Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)}
            placeholder="Enter task name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Enter task description" rows={4}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none" />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={dept} onChange={e => setDept(e.target.value)}
              className="appearance-none w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700">
              <option value="">Select department</option>
              {DEPT_OPTIONS.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Assign Employee */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Assign Employee <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={employee} onChange={e => setEmployee(e.target.value)}
              className="appearance-none w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700">
              <option value="">Select employee</option>
              {EMPLOYEE_OPTIONS.filter(e => e !== "All").map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={priority} onChange={e => setPriority(e.target.value)}
              className="appearance-none w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700">
              <option value="">Select priority</option>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700" />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100">
        <button type="button" onClick={onClose}
          className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
        <button type="button"
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          Assign Task
        </button>
      </div>
    </div>
  );
}

// ─── task details popup ───────────────────────────────────────────────────────
function TaskDetailsPopup({ task, onClose }) {
  return (
    <div className="absolute bottom-14 left-0 right-0 mx-10 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">Task Details</h3>
        <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-1 gap-y-0">
        {/* Left column */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500">Task ID</span>
            <span className="font-medium text-slate-800">{task.id}</span>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500">Task Name</span>
            <span className="font-medium text-slate-800">{task.name}</span>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500">Department</span>
            <span className="font-medium text-slate-800">{task.department}</span>
          </div>
          <div className="grid grid-cols-3 text-sm items-center">
            <span className="text-slate-500">Assigned To</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-xs">{task.assignedTo}</p>
                <p className="text-xs text-slate-400">{task.email}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 text-sm items-center">
            <span className="text-slate-500">Priority</span>
            <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500">Created Date</span>
            <span className="font-medium text-slate-800">{task.createdDate}</span>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500">Due Date</span>
            <span className="font-medium text-slate-800">{task.dueDate}</span>
          </div>
          <div className="grid grid-cols-3 text-sm items-center">
            <span className="text-slate-500">Status</span>
            <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              task.status === "Pending" ? "bg-orange-100 text-orange-500" :
              task.status === "Completed" ? "bg-green-100 text-green-600" :
              "bg-blue-50 text-blue-600"
            }`}>
              {task.status}
            </span>
          </div>
          <div className="text-sm">
            <p className="text-slate-500 mb-1">Description</p>
            <p className="text-slate-700 text-xs leading-relaxed">{task.description}</p>
          </div>

          {/* Activity Timeline */}
          <div className="text-sm">
            <p className="text-slate-500 mb-2">Activity Timeline</p>
            <div className="space-y-2">
              {task.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${dotColor[item.dot]}`} />
                  <div>
                    {item.time && <p className="text-xs text-slate-400">{item.time}</p>}
                    <p className="text-xs text-slate-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button type="button" onClick={onClose}
          className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function Tasks() {
  const [theme,      setTheme]      = useState("light");
  const [search,     setSearch]     = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [empFilter,  setEmpFilter]  = useState("All");
  const [page,       setPage]       = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedTask,    setSelectedTask]    = useState(null);

  const filtered = mockTasks.filter(t => {
    const matchSearch = search.trim() === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchDept   = deptFilter   === "All" || t.department === deptFilter;
    const matchStatus = statusFilter === "All" || t.status     === statusFilter;
    const matchEmp    = empFilter    === "All" || t.assignedTo === empFilter;
    return matchSearch && matchDept && matchStatus && matchEmp;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      {/* Assign Task overlay backdrop */}
      {showAssignPanel && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowAssignPanel(false)} />
      )}
      {showAssignPanel && <AssignTaskPanel onClose={() => setShowAssignPanel(false)} />}

      <main className="flex-1 ml-45 overflow-y-auto">
        <div className="p-2 space-y-4 relative text-left">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Task Management</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Dashboard <span className="mx-1">›</span>
                <span className="text-blue-600 font-medium">Task Management</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="relative p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              </button>
              <div className="flex items-center bg-slate-100 rounded-full p-1">
                <button type="button" onClick={() => setTheme("light")} className={`p-1.5 rounded-full ${theme === "light" ? "bg-white shadow text-amber-500" : "text-slate-400"}`}>
                  <Sun className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setTheme("dark")} className={`p-1.5 rounded-full ${theme === "dark" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>
                  <Moon className="w-4 h-4" />
                </button>
              </div>
              <button type="button"
                onClick={() => { setShowAssignPanel(true); setSelectedTask(null); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                <Plus className="w-4 h-4" /> Assign Task
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search task by name or ID..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white" />
            </div>
            <FilterSelect label="Department" value={deptFilter}   options={DEPT_OPTIONS}     onChange={setDeptFilter}   />
            <FilterSelect label="Status"     value={statusFilter} options={STATUS_OPTIONS}    onChange={setStatusFilter} />
            <FilterSelect label="Employee"   value={empFilter}    options={EMPLOYEE_OPTIONS}  onChange={setEmpFilter}    />
          </div>

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden relative">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-left">
                    <th className="px-5 py-3 font-semibold">Task ID</th>
                    <th className="px-5 py-3 font-semibold">Task Name</th>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Assigned To</th>
                    <th className="px-5 py-3 font-semibold">Priority</th>
                    <th className="px-5 py-3 font-semibold">Due Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">No tasks found.</td>
                    </tr>
                  ) : (
                    paginated.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-600 text-xs">{task.id}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{task.name}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded text-xs font-medium ${deptStyles[task.department] || "bg-slate-100 text-slate-600"}`}>
                            {task.department}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-slate-700 font-medium">{task.assignedTo}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{task.dueDate}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold ${
                            task.status === "Pending"     ? "bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full" :
                            task.status === "Completed"   ? "bg-green-100 text-green-600 px-2.5 py-1 rounded-full"  :
                            "text-blue-600 font-semibold"
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button type="button"
                              onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing 1 to {paginated.length} of {filtered.length} tasks
              </p>
              <Pagination current={page} total={totalPages} onChange={setPage} />
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Rows per page:
                <div className="relative">
                  <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                    className="appearance-none pl-2 pr-6 py-1 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none">
                    {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Task Details popup — sits inside table card, above footer */}
            {selectedTask && (
              <TaskDetailsPopup task={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}