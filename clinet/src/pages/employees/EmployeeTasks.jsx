import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Calendar, Activity, FileText,
  HelpCircle, Settings, LogOut, Search, Bell, ChevronDown, CalendarDays,
  User, CheckCircle2, AlertCircle, Clock, Eye, X, Trash2,
  RefreshCcw, ChevronLeft, ChevronRight, Plus,
} from "lucide-react";
import { getMyTasksData, updateTask } from "../../services/Employee_Tasks";

// ─── nav ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",      icon: LayoutDashboard, path:" /employee/EmployeeDashboard"},
  { label: "My Tasks",       icon: ClipboardList, path: "/employee/EmployeeTasks"     },
  { label: "Schedule",       icon: Calendar,      path: "/employee/schedule"  },
  { label: "Activities",     icon: Activity,      path: "/employee/activities"},
  { label: "Calendar",       icon: CalendarDays,  path: "/employee/calendar"  },
  { label: "Documents",      icon: FileText,      path: "/employee/documents" },
  { label: "Help & Support", icon: HelpCircle,    path: "/employee/help"      },
  { label: "Settings",       icon: Settings,      path: "/employee/settings"  },
];

// ─── style maps ───────────────────────────────────────────────────────────────
const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-orange-100 text-orange-500",
  Low:    "bg-green-100 text-green-600",
};

const STATUS_STYLES = {
  "In Progress": "bg-blue-100 text-blue-700",
  Completed:     "bg-green-100 text-green-700",
  Pending:       "bg-orange-100 text-orange-500",
  Overdue:       "bg-red-100 text-red-600",
};

const STATUS_OPTIONS = ["In Progress", "Completed", "Pending", "Overdue"];
const ROWS_OPTIONS   = [10, 25, 50];

// ─── mock data (replaced by API when /employee/tasks is ready) ────────────────
const MOCK_TASKS = [
  { id: "TSK-001", name: "Website Homepage Redesign", priority: "High",   dueDate: "15 Jul 2026", status: "In Progress", assignedBy: "Admin", department: "IT Department", createdDate: "01 Jul 2026", description: "Redesign the landing page of the website as per the new UI/UX requirements.", workUpdate: "Worked on the hero section and completed the responsive layout for tablet devices.", attachments: [{ id: 1, name: "homepage-design.png", size: "2.4 MB" }] },
  { id: "TSK-002", name: "Fix Login Issues",          priority: "High",   dueDate: "10 Jul 2026", status: "Completed",   assignedBy: "Admin", department: "IT Department", createdDate: "05 Jul 2026", description: "Fix the login issues reported by multiple users.",                                           workUpdate: "", attachments: [] },
  { id: "TSK-003", name: "Setup New CRM Module",      priority: "Medium", dueDate: "20 Jul 2026", status: "In Progress", assignedBy: "Admin", department: "IT Department", createdDate: "08 Jul 2026", description: "Setup the new CRM module for the sales team.",                                              workUpdate: "", attachments: [] },
  { id: "TSK-004", name: "Database Optimization",     priority: "Medium", dueDate: "18 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "09 Jul 2026", description: "Optimize the database queries for better performance.",                                     workUpdate: "", attachments: [] },
  { id: "TSK-005", name: "API Integration",           priority: "Low",    dueDate: "25 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "10 Jul 2026", description: "Integrate the payment gateway API.",                                                       workUpdate: "", attachments: [] },
  { id: "TSK-006", name: "Create User Manual",        priority: "Low",    dueDate: "30 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "10 Jul 2026", description: "Create a user manual for the new CRM system.",                                             workUpdate: "", attachments: [] },
  { id: "TSK-007", name: "UI Bug Fixes",              priority: "High",   dueDate: "12 Jul 2026", status: "Overdue",     assignedBy: "Admin", department: "IT Department", createdDate: "06 Jul 2026", description: "Fix the UI bugs reported in the latest sprint.",                                           workUpdate: "", attachments: [] },
  { id: "TSK-008", name: "Server Migration",          priority: "Medium", dueDate: "22 Jul 2026", status: "In Progress", assignedBy: "Admin", department: "IT Department", createdDate: "11 Jul 2026", description: "Migrate the server to the new cloud infrastructure.",                                      workUpdate: "", attachments: [] },
  { id: "TSK-009", name: "Security Audit",            priority: "High",   dueDate: "28 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "11 Jul 2026", description: "Perform a complete security audit of the system.",                                         workUpdate: "", attachments: [] },
  { id: "TSK-010", name: "Mobile App Testing",        priority: "Medium", dueDate: "27 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "12 Jul 2026", description: "Test the mobile app on different devices.",                                                workUpdate: "", attachments: [] },
  { id: "TSK-011", name: "Report Generation",         priority: "Low",    dueDate: "29 Jul 2026", status: "Pending",     assignedBy: "Admin", department: "IT Department", createdDate: "12 Jul 2026", description: "Generate monthly reports for the management.",                                             workUpdate: "", attachments: [] },
  { id: "TSK-012", name: "Code Review",               priority: "Medium", dueDate: "14 Jul 2026", status: "Completed",   assignedBy: "Admin", department: "IT Department", createdDate: "13 Jul 2026", description: "Review the code for the new feature branch.",                                              workUpdate: "", attachments: [] },
];

const MOCK_STATS = { totalTasks: 12, pending: 4, inProgress: 5, overdue: 3 };

// ─── sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, employee, activeNav, setActiveNav, navigate }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ${collapsed ? "w-0 overflow-hidden" : "w-[200px]"}`}>
      <div className="h-[60px] px-5 flex items-center border-b border-slate-100 shrink-0">
        <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.label;
            return (
              <button key={item.label} type="button"
                onClick={() => { setActiveNav(item.label); navigate(item.path); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-t border-gray-100 p-4 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-slate-800 truncate">{employee?.name || "Employee"}</p>
            <p className="text-xs text-slate-400 truncate">{employee?.role || "—"}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
        <button type="button"
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── header ───────────────────────────────────────────────────────────────────
function Header({ collapsed, setCollapsed, employee }) {
  return (
    <header className={`fixed top-0 right-0 h-[60px] bg-white border-b border-gray-200 flex items-center gap-4 px-5 z-30 transition-all duration-300 ${collapsed ? "left-0" : "left-[200px]"}`}>
      <button type="button" onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search anything..."
            className="w-full pl-9 pr-20 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-slate-50 placeholder-slate-400" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">Ctrl + /</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button type="button" className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
        </button>
        <button type="button" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <CalendarDays className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-none">{employee?.name || "Employee"}</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">{employee?.role || "—"}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}

// ─── task detail panel ────────────────────────────────────────────────────────
function TaskDetailPanel({ task, onClose, onSave }) {
  const [activeTab,      setActiveTab]     = useState("overview");
  const [selectedStatus, setSelectedStatus]= useState(task.status);
  const [workUpdate,     setWorkUpdate]    = useState(task.workUpdate || "");
  const [attachments,    setAttachments]   = useState(task.attachments || []);
  const [saving,         setSaving]        = useState(false);
  const uploadRef = useRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newFile = { id: Date.now(), name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` };
    setAttachments(prev => [...prev, newFile]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(task.id, { status: selectedStatus, workUpdate, attachments });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black/10 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-screen w-[320px] bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl">

        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-slate-800">Task Details</h2>
          <button type="button" onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          <button type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}>
            Overview
          </button>
          <button type="button"
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "activity"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}>
            Activity
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {activeTab === "overview" ? (
            <div className="p-5 space-y-5">

              {/* Task Information */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <ClipboardList className="w-3 h-3 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-600">Task Information</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Task ID",      value: task.id },
                    { label: "Task Name",    value: task.name },
                    { label: "Assigned By",  value: task.assignedBy },
                    { label: "Department",   value: task.department },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="text-slate-400 w-28 shrink-0">{label}</span>
                      <span className="font-semibold text-slate-800 text-left">{value}</span>
                    </div>
                  ))}

                  <div className="flex gap-2 text-sm items-center">
                    <span className="text-slate-400 w-28 shrink-0">Priority</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>

                  {[
                    { label: "Created Date", value: task.createdDate },
                    { label: "Due Date",     value: task.dueDate },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="text-slate-400 w-28 shrink-0">{label}</span>
                      <span className="font-semibold text-slate-800">{value}</span>
                    </div>
                  ))}

                  <div className="flex gap-2 text-sm">
                    <span className="text-slate-400 w-28 shrink-0">Description</span>
                    <span className="text-slate-600 text-xs leading-relaxed text-left">{task.description}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Update Status */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <RefreshCcw className="w-3 h-3 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-600">Update Status</h4>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      className="appearance-none w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Today's Work Update */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="w-3 h-3 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-600">Today's Work Update</h4>
                </div>
                <textarea
                  value={workUpdate}
                  onChange={e => setWorkUpdate(e.target.value)}
                  placeholder="Describe what you worked on today..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* Attachments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-bold text-slate-800">Attachments</h4>
                </div>

                <div className="space-y-2 mb-3">
                  {attachments.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{file.size}</p>
                      </div>
                      <button type="button" onClick={() => removeAttachment(file.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button type="button"
                  onClick={() => uploadRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-blue-300 rounded-lg text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                  <Plus className="w-4 h-4" /> Upload Attachment
                </button>
                <input ref={uploadRef} type="file" className="hidden" onChange={handleFileUpload} />
              </div>

            </div>
          ) : (
            <div className="p-5 text-center text-slate-400 text-sm py-16">
              No activity recorded yet.
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function MyTasks() {
  const navigate     = useNavigate();
  const [collapsed,  setCollapsed]  = useState(false);
  const [activeNav,  setActiveNav]  = useState("My Tasks");

  const [employee,   setEmployee]   = useState({ name: "—", role: "—" });
  const [tasks,      setTasks]      = useState([]);
  const [stats,      setStats]      = useState(MOCK_STATS);
  const [error,      setError]      = useState(null);

  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [page,       setPage]       = useState(1);
  const [rowsPerPage,setRowsPerPage]= useState(10);

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const data = await getMyTasksData({ page, rowsPerPage, search, status: statusFilter, priority: priorityFilter });
        if (!isActive) return;
        setEmployee(data.employee || { name: "—", role: "—" });
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setStats(data.stats || MOCK_STATS);
        setError(null);
      } catch (err) {
        console.error("My Tasks API error:", err);
        if (!isActive) return;
        // Fall back to mock data while API is being built
        setTasks(MOCK_TASKS);
        setStats(MOCK_STATS);
        setError(null);
      }
    };
    load();
    return () => { isActive = false; };
  }, [page, rowsPerPage, search, statusFilter, priorityFilter]);

  // Client-side filtering on mock data
  const filteredTasks = tasks.filter(t => {
    const matchSearch   = search.trim() === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = statusFilter   === "All Status"   || t.status   === statusFilter;
    const matchPriority = priorityFilter === "All Priority" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / rowsPerPage));
  const start      = (page - 1) * rowsPerPage;
  const paginated  = filteredTasks.slice(start, start + rowsPerPage);
  const showStart  = filteredTasks.length === 0 ? 0 : start + 1;
  const showEnd    = Math.min(start + rowsPerPage, filteredTasks.length);

  const handleSaveTask = async (taskId, data) => {
    try {
      await updateTask(taskId, data);
    } catch {
      // update local state as fallback
    }
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: data.status, workUpdate: data.workUpdate, attachments: data.attachments } : t));
  };

  const mainLeft = collapsed ? "left-0" : "left-[200px]";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar collapsed={collapsed} employee={employee} activeNav={activeNav} setActiveNav={setActiveNav} navigate={navigate} />
      <Header collapsed={collapsed} setCollapsed={setCollapsed} employee={employee} />

      <main className={`fixed top-[60px] right-0 bottom-0 overflow-y-auto transition-all duration-300 ${mainLeft}`}>
        <div className="p-5 space-y-5">

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <button type="button" onClick={() => navigate("/employees/dashboard")} className="hover:text-slate-600">Dashboard</button>
            <span>›</span>
            <span className="font-semibold text-slate-700">My Tasks</span>
          </div>

          {/* Title + filters */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
              <p className="text-sm text-slate-400 mt-0.5">View and update your assigned tasks.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search task..." value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 pr-4 py-2 w-48 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer outline-none focus:border-blue-400">
                  <option value="All Status">All Status</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer outline-none focus:border-blue-400">
                  <option value="All Priority">All Priority</option>
                  {["High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <CalendarDays className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500">Total Tasks</p>
                <h2 className="text-3xl font-bold text-slate-800">{String(stats.totalTasks).padStart(2, "0")}</h2>
                <p className="text-xs text-slate-400">All Assigned Tasks</p>
              </div>
            </div>
            {/* Pending */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500">Pending</p>
                <h2 className="text-3xl font-bold text-slate-800">{String(stats.pending).padStart(2, "0")}</h2>
                <p className="text-xs text-slate-400">Tasks Pending</p>
              </div>
            </div>
            {/* In Progress */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500">In Progress</p>
                <h2 className="text-3xl font-bold text-slate-800">{String(stats.inProgress).padStart(2, "0")}</h2>
                <p className="text-xs text-slate-400">Tasks In Progress</p>
              </div>
            </div>
            {/* Overdue */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500">Overdue</p>
                <h2 className="text-3xl font-bold text-slate-800">{String(stats.overdue).padStart(2, "0")}</h2>
                <p className="text-xs text-slate-400">Tasks Overdue</p>
              </div>
            </div>
          </div>

          {/* Task table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-slate-500 text-left">
                    <th className="px-5 py-4 font-semibold">Task ID</th>
                    <th className="px-5 py-4 font-semibold">Task Name</th>
                    <th className="px-5 py-4 font-semibold">Priority</th>
                    <th className="px-5 py-4 font-semibold">Due Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400">No tasks found.</td>
                    </tr>
                  ) : (
                    paginated.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-slate-500 text-left">{task.id}</td>
                        <td className="px-5 py-4 font-medium text-slate-800 text-left">{task.name}</td>
                        <td className="px-5 py-4 text-left">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLES[task.priority] || "bg-slate-100 text-slate-600"}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-left">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {task.dueDate}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-left">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[task.status] || "bg-slate-100 text-slate-600"}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-left">
                          <button type="button"
                            onClick={() => setSelectedTask(task)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors font-medium">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
              <p className="text-sm text-slate-500">
                {filteredTasks.length === 0 ? "No tasks" : `Showing ${showStart} to ${showEnd} of ${filteredTasks.length} tasks`}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded-lg font-medium ${p === page ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Rows per page:
                <div className="relative">
                  <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                    className="appearance-none pl-2 pr-6 py-1 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-blue-400">
                    {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Task Detail Panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}