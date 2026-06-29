import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Calendar, Activity, FileText,
  FolderOpen, Clock, BarChart2, ShieldCheck, HelpCircle, Settings,
  LogOut, Search, Bell, ChevronDown, CalendarDays, CheckCircle2,
  AlertCircle, ArrowRight, Link2, UserCircle, ClipboardCheck, User,
} from "lucide-react";
import { getEmployeeDashboard } from "../../services/employeeDashboardService";

// ─── constants ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",      icon: LayoutDashboard, path:"/employee/EmployeeDashboard"},
  { label: "My Tasks",       icon: ClipboardList, path: "/employee/EmployeeTasks" },
  { label: "Schedule",       icon: Calendar,      path: "/employee/schedule"  },
  { label: "Activities",     icon: Activity,      path: "/employee/activities"},
  { label: "Calendar",       icon: CalendarDays,  path: "/employee/calendar"  },
  { label: "Documents",      icon: FileText,      path: "/employee/documents" },
  { label: "Help & Support", icon: HelpCircle,    path: "/employee/help"      },
  { label: "Settings",       icon: Settings,      path: "/employee/settings"  },
];

const STATUS_STYLES = {
  Meeting:      { badge: "bg-blue-100 text-blue-700",    border: "border-l-blue-500"   },
  "In Progress":{ badge: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-400" },
  Scheduled:    { badge: "bg-indigo-100 text-indigo-700", border: "border-l-indigo-500" },
  Pending:      { badge: "bg-orange-100 text-orange-600", border: "border-l-orange-400" },
  Completed:    { badge: "bg-green-100 text-green-700",   border: "border-l-green-500"  },
};

const ACTIVITY_ICON_STYLES = {
  task:     { bg: "bg-green-100",  icon: CheckCircle2,   color: "text-green-600"  },
  meeting:  { bg: "bg-blue-100",   icon: Calendar,       color: "text-blue-600"   },
  document: { bg: "bg-indigo-100", icon: FileText,       color: "text-indigo-600" },
  leave:    { bg: "bg-orange-100", icon: User,           color: "text-orange-500" },
  update:   { bg: "bg-teal-100",   icon: ClipboardCheck, color: "text-teal-600"   },
};

const QUICK_LINK_STYLES = [
  { title: "My Tasks",  icon: ClipboardList, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", path: "/employee/EmployeeTasks"     },
  { title: "Schedule",  icon: CalendarDays,  iconBg: "bg-purple-100", iconColor: "text-purple-600", path: "/employee/schedule"  },
  { title: "Projects",  icon: FolderOpen,    iconBg: "bg-green-100",  iconColor: "text-green-600",  path: "/employee/projects"  },
  { title: "Timesheet", icon: Clock,         iconBg: "bg-orange-100", iconColor: "text-orange-500", path: "/employee/timesheet" },
  { title: "Documents", icon: FileText,      iconBg: "bg-blue-100",   iconColor: "text-blue-600",   path: "/employee/documents" },
  { title: "Calendar",  icon: Calendar,      iconBg: "bg-blue-100",   iconColor: "text-blue-600",   path: "/employee/calendar"  },
  { title: "Reports",   icon: BarChart2,     iconBg: "bg-green-100",  iconColor: "text-green-600",  path: "/employee/reports"   },
  { title: "Approvals", icon: ShieldCheck,   iconBg: "bg-amber-100",  iconColor: "text-amber-600",  path: "/employee/approvals" },
  { title: "Profile",   icon: UserCircle,    iconBg: "bg-purple-100", iconColor: "text-purple-600", path: "/employee/profile"   },
];

const DEFAULT_DATA = {
  employee:      { name: "—", role: "—", profileImage: null },
  summary:       { todaySchedule: 0, monthTasks: 0, totalTasks: 0, completed: 0, overdue: 0 },
  todaySchedule: [],
  upcoming:      [],
  recentActivity:[],
  quickLinks:    [],
};

// ─── sub-components ───────────────────────────────────────────────────────────
function SummaryCard({ title, value, subtitle, linkLabel, linkColor, iconBg, iconColor, icon: Icon, border }) {
  return (
    <div className={`bg-white rounded-[18px] border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow border-t-4 ${border}`}>
      <div className="flex items-start justify-between">
        <div className="text-left">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="text-4xl font-semibold text-slate-700 mt-1">{String(value).padStart(2, "0")}</h2>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <button type="button" className={`text-sm font-semibold flex items-center gap-1 ${linkColor} hover:opacity-80 transition-opacity`}>
        {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ScheduleRow({ time, title, subtitle, status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Scheduled;
  return (
    <div className={`flex items-center gap-3 pl-3 border-l-4 ${style.border} py-2`}>
      <div className="w-16 shrink-0">
        <span className="text-xs font-semibold text-slate-500">{time}</span>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-400 truncate">{subtitle}</p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.badge}`}>
        {status}
      </span>
    </div>
  );
}

function UpcomingRow({ date, month, title, department, type, time }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex flex-col items-center justify-center shrink-0">
        <span className="text-sm font-bold text-slate-700 leading-none">{date}</span>
        <span className="text-[10px] text-slate-400 leading-none mt-0.5">{month}</span>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-400">{department} • {type}</p>
      </div>
      <span className="text-xs font-semibold text-blue-600 shrink-0">{time}</span>
    </div>
  );
}

function ActivityRow({ iconType, message, time }) {
  const style = ACTIVITY_ICON_STYLES[iconType] || ACTIVITY_ICON_STYLES.task;
  const Icon = style.icon;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${style.color}`} />
      </div>
      <p className="flex-1 text-sm text-slate-700 min-w-0 truncate text-left">{message}</p>
      <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{time}</span>
    </div>
  );
}

function QuickLinkButton({ title, icon: Icon, iconBg, iconColor, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <span className="text-xs font-medium text-slate-600">{title}</span>
    </button>
  );
}

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
                }`}
              >
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
            {employee?.profileImage
              ? <img src={employee.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
              : <User className="w-4 h-4 text-blue-600" />
            }
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-slate-800 truncate">{employee?.name || "Employee"}</p>
            <p className="text-xs text-slate-400 truncate">{employee?.role || "—"}</p>
          </div>
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
function Header({ collapsed, employee }) {
  return (
    <header className={`fixed top-0 right-0 h-[60px] bg-white border-b border-gray-200 flex items-center gap-4 px-5 z-30 transition-all duration-300 ${collapsed ? "left-0" : "left-[200px]"}`}>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search anything..."
            className="w-full pl-9 pr-20 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-slate-50 placeholder-slate-400" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
            Ctrl + /
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button type="button" className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
        </button>
        <button type="button" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <CalendarDays className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            {employee?.profileImage
              ? <img src={employee.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
              : <User className="w-4 h-4 text-blue-600" />
            }
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [data,      setData]      = useState(DEFAULT_DATA);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const res = await getEmployeeDashboard();
        if (isActive) { setData(res); setError(null); }
      } catch (err) {
        console.error("Employee dashboard error:", err);
        if (isActive) setError(null);
      }
    };
    load();
    return () => { isActive = false; };
  }, []);

  const { employee, summary, todaySchedule, upcoming, recentActivity } = data;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const mainLeft = collapsed ? "left-0" : "left-[200px]";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        collapsed={collapsed}
        employee={employee}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        navigate={navigate}
      />
      <Header collapsed={collapsed} setCollapsed={setCollapsed} employee={employee} />

      <main className={`fixed top-[60px] right-0 bottom-0 overflow-y-auto transition-all duration-300 ${mainLeft}`}>
        <div className="p-5 space-y-5 max-w-[1400px]">

          {error && (
            <div className="bg-red-50 text-red-700 text-xs rounded-xl px-4 py-3 border border-red-100">{error}</div>
          )}

          {/* ── Welcome ─────────────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-slate-800">
                {employee?.name || "Employee"} 👋
              </h2>
              <p className="text-sm text-slate-500 mt-1">Here's what's happening with your work today.</p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">{dateStr}</span>
            </div>
          </div>

          {/* ── Summary Cards ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <SummaryCard title="Today's Schedule" value={summary.todaySchedule}
              subtitle="Tasks & Meetings"   linkLabel="View Today"
              linkColor="text-blue-600"    border="border-t-blue-500"
              iconBg="bg-blue-100"         iconColor="text-blue-600"  icon={CalendarDays}   />
            <SummaryCard title="This Month's Tasks" value={summary.monthTasks}
              subtitle="Scheduled Tasks"   linkLabel="View This Month"
              linkColor="text-green-600"   border="border-t-green-500"
              iconBg="bg-green-100"        iconColor="text-green-600" icon={ClipboardList}  />
            <SummaryCard title="Total Tasks"      value={summary.totalTasks}
              subtitle="All Assigned Tasks" linkLabel="View All"
              linkColor="text-purple-600"  border="border-t-purple-500"
              iconBg="bg-purple-100"       iconColor="text-purple-600" icon={ClipboardCheck} />
            <SummaryCard title="Completed"        value={summary.completed}
              subtitle="Tasks Completed"   linkLabel="View Completed"
              linkColor="text-amber-600"   border="border-t-amber-500"
              iconBg="bg-amber-100"        iconColor="text-amber-600" icon={CheckCircle2}   />
            <SummaryCard title="Overdue"          value={summary.overdue}
              subtitle="Tasks Overdue"     linkLabel="View Overdue"
              linkColor="text-red-600"     border="border-t-red-500"
              iconBg="bg-red-100"          iconColor="text-red-600"   icon={AlertCircle}    />
          </div>

          {/* ── Three Cards Row ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Today's Schedule */}
            <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-800">Today's Schedule</h3>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-2">
                {todaySchedule.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No schedule for today.</p>
                ) : (
                  todaySchedule.map(item => (
                    <ScheduleRow key={item.id} time={item.time} title={item.title}
                      subtitle={`${item.type} • ${item.department}`} status={item.status} />
                  ))
                )}
              </div>
              {todaySchedule.length > 0 && (
                <p className="text-xs text-slate-400 mt-4 text-left">
                  You have <span className="text-blue-600 font-semibold">{todaySchedule.length}</span> items scheduled for today.
                </p>
              )}
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-Semibold text-slate-800">Upcoming Schedule</h3>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-1 divide-y divide-slate-50">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No upcoming items.</p>
                ) : (
                  upcoming.map(item => {
                    const [day, month] = item.date.split(" ");
                    return (
                      <UpcomingRow key={item.id} date={day} month={month}
                        title={item.title} department={item.department}
                        type={item.type} time={item.time} />
                    );
                  })
                )}
              </div>
              {upcoming.length > 0 && (
                <p className="text-xs text-slate-400 mt-3 text-left">
                  You have <span className="text-blue-600 font-semibold">{upcoming.length}</span> upcoming items.
                </p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-Semibold text-slate-800">Recent Activity</h3>
                </div>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-1 divide-y divide-slate-50">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No recent activity.</p>
                ) : (
                  recentActivity.map(item => (
                    <ActivityRow key={item.id} iconType={item.icon}
                      message={item.message} time={item.time} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Quick Links ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-[18px] border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-Semibold text-slate-800">Quick Links</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-3">
              {QUICK_LINK_STYLES.map(link => (
                <QuickLinkButton key={link.title} title={link.title}
                  icon={link.icon} iconBg={link.iconBg} iconColor={link.iconColor}
                  onClick={() => navigate(link.path)} />
              ))}
            </div>
          </div>

          {/* ── Info Banner ─────────────────────────────────────────────── */}
          <div className="bg-blue-600 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">i</span>
            </div>
            <p className="text-sm text-white font-small">
              All your tasks and schedules are updated in real-time. Stay organized and productive!
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}