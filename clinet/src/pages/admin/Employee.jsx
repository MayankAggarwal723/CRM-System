import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Users, Flag, Phone, LogIn, FileText, Settings, Search, Calendar, Bell,
  Sun, Moon, Plus, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Pencil, Trash2, Filter, User, LogOut, Activity,
} from "lucide-react";

// ─── shared nav (same paths as Dashboard) ──────────────────────────────────
const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, path: "/admin/dashboard" },
  { label: "Employees",           icon: Users,      path: "/admin/employee"  },
  { label: "Leads",               icon: Flag,       path: "/admin/leads"     },
  { label: "Login / Logout Logs", icon: LogIn,      path: "/admin/logs"      },
  { label: "Task & Follow-ups",   icon: FileText,   path: "/admin/tasks"     },
  { label: "Create Employee",     icon: Plus,       path: "/admin/CreateEmployee" },
  { label: "Settings",            icon: Settings,   path: "/admin/settings"  },
];

// ─── stat icon map ──────────────────────────────────────────────────────────
const iconMap = {
  users:    { icon: Users,    bg: "bg-blue-100",    color: "text-blue-600"    },
  activity: { icon: Activity, bg: "bg-emerald-100", color: "text-emerald-600" },
  inactive: { icon: User,     bg: "bg-purple-100",  color: "text-purple-600"  },
  new:      { icon: Phone,    bg: "bg-orange-100",  color: "text-orange-500"  },
};
const defaultStats = [
  { label: "Total Employees",    value: "0", change: "", icon: "users"    },
  { label: "Active Today",       value: "0", change: "", icon: "activity" },
  { label: "Inactive Employees", value: "0", change: "", icon: "inactive" },
  { label: "New This Month",     value: "0", change: "", icon: "new"      },
];

// ─── filter options ─────────────────────────────────────────────────────────
const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const ROLE_OPTIONS   = ["All", "Sales Executive", "Manager", "Team Lead", "Support"];
const DEPT_OPTIONS   = ["All", "Sales", "HR", "Tech", "Support"];
const SORT_OPTIONS   = ["Newest", "Oldest", "Name A-Z", "Name Z-A"];
const ROWS_OPTIONS   = [10, 25, 50];

// ─── tiny helpers ────────────────────────────────────────────────────────────
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

function StatusBadge({ status }) {
  const active = status === "Active";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
      active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {status}
    </span>
  );
}

function Pagination({ current, total, onChange }) {
  const pages = total <= 6
    ? Array.from({ length: total }, (_, i) => i + 1)
    : [1, 2, 3, ...(current > 4 ? ["..."] : []), ...(current > 3 && current < total - 2 ? [current] : []), "...", total];
  const unique = [...new Map(pages.map((p, i) => [i, p])).values()];

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {unique.map((p, i) =>
        p === "..." ? (
          <span key={`d${i}`} className="px-1 text-slate-400 text-sm">...</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 text-sm rounded-lg font-medium ${
              p === current ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

  // ─── sidebar (shared layout) ────────────────────────────────────────────────
  function Sidebar({ admin }) {
    const location = useLocation();
    return (
      <aside className="fixed left-0 top-0 h-screen w-[190px] bg-white border-r border-slate-200 flex flex-col z-50">

    {/* Logo */}
    <div className="h-[55px] px-6 flex items-center border-b border-slate-100">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-8 object-contain"
      />
    </div>

    {/* Navigation */}
    <div className="flex-1 px-1 py-5 overflow-y-auto">

      <nav className="space-y-2">

        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;

          return (
            <Link
              key={label}
              to={path}
              className={`
                flex items-center
                h-8
                px-2
                rounded-lg
                text-xs
                font-medium
                transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />

              <span className="ml-2">
                {label}
              </span>
            </Link>
          );
        })}

      </nav>

    </div>

    {/* User Section */}
    <div className="border-t border-slate-100 p-4">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {admin.name || "Admin User"}
          </h4>

          <p className="text-xs text-slate-500">
            {admin.role || "Super Admin"}
          </p>
        </div>

      </div>

      <button
        type="button"
        className="
          w-full
          h-8
          bg-red-500
          hover:bg-red-600
          text-white
          rounded-lg
          text-xs
          font-medium
          flex
          items-center
          justify-center
          gap-2
          transition-all
        "
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

    </div>

  </aside>  
    );
  }

// ─── page ────────────────────────────────────────────────────────────────────
export default function Employee() {
  const [theme,       setTheme]       = useState("light");
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState("All");
  const [role,        setRole]        = useState("All");
  const [dept,        setDept]        = useState("All");
  const [sortBy,      setSortBy]      = useState("Newest");
  const [page,        setPage]        = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [admin,     setAdmin]     = useState({});
  const [stats,     setStats]     = useState([]);
  const [employees, setEmployees] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const prevDepsRef = useRef();

  useEffect(() => {
    let isActive = true;

    const fetchEmployees = async () => {
      if (!isActive) return;
      setLoading(true);

      try {
  setAdmin({
    name: "Admin User",
    role: "Super Admin",
  });

  const employeeData = [
  {
    employeeId: "EMP001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Sales Executive",
    department: "Sales",
    status: "Active",
    joinedOn: "10 Jul 2025",
    lastLogin: "2 mins ago",
  },
  {
    employeeId: "EMP002",
    name: "Aman Verma",
    email: "aman@example.com",
    role: "Manager",
    department: "Sales",
    status: "Active",
    joinedOn: "15 Jul 2025",
    lastLogin: "10 mins ago",
  },
  {
    employeeId: "EMP003",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "HR Executive",
    department: "HR",
    status: "Inactive",
    joinedOn: "22 Jul 2025",
    lastLogin: "Yesterday",
  },
];

const employeeList = Array.isArray(employeeData)
  ? employeeData
  : [];

setEmployees(employeeList);

const totalEmployees = employeeList.length;

const activeEmployees = employeeList.filter(
  emp => emp.status === "Active"
).length;

const inactiveEmployees = employeeList.filter(
  emp => emp.status === "Inactive"
).length;

const totalDepartments = new Set(
  employeeList.map(emp => emp.department)
).size;

setStats([
  {
    label: "Total Employees",
    value: totalEmployees || 0,
    icon: "users",
  },
  {
    label: "Active Employees",
    value: activeEmployees || 0,
    icon: "activity",
  },
  {
    label: "Inactive Employees",
    value: inactiveEmployees || 0,
    icon: "inactive",
  },
  {
    label: "Departments",
    value: totalDepartments || 0,
    icon: "new",
  },
]);

setTotal(totalEmployees);


  setError(null);
} catch (err) {
        if (!isActive) return;
        console.error("Employees API Error:", err);
        setError("Couldn't load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    Promise.resolve().then(fetchEmployees);

    // Reset to page 1 when filters change
    if (page !== 1 && (prevDepsRef.current && 
        (prevDepsRef.current.search !== search || prevDepsRef.current.status !== status || 
         prevDepsRef.current.role !== role || prevDepsRef.current.dept !== dept || 
         prevDepsRef.current.sortBy !== sortBy || prevDepsRef.current.rowsPerPage !== rowsPerPage))) {
      setPage(1);
      return;
    }

    prevDepsRef.current = { search, status, role, dept, sortBy, rowsPerPage };

    return () => {
      isActive = false;
    };
  }, [page, rowsPerPage, search, status, role, dept, sortBy]);

  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end   = Math.min(page * rowsPerPage, total);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar admin={admin} />

      <main className="flex-1 ml-45 overflow-y-auto">
        <div className="p-2 space-y-4">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Employees
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Dashboard <span className="mx-1">›</span>
                <span className="text-blue-600 font-medium">Employees</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search anything..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white" />
              </div>
              <button type="button" className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><Calendar className="w-[18px] h-[18px]" /></button>
              <button type="button" className="relative p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <div className="flex items-center bg-slate-100 rounded-full p-1">
                <button type="button" onClick={() => setTheme("light")} className={`p-1.5 rounded-full ${theme === "light" ? "bg-white shadow text-amber-500" : "text-slate-400"}`}><Sun className="w-4 h-4" /></button>
                <button type="button" onClick={() => setTheme("dark")}  className={`p-1.5 rounded-full ${theme === "dark"  ? "bg-white shadow text-slate-700" : "text-slate-400"}`}><Moon className="w-4 h-4" /></button>
              </div>
              <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                <Plus className="w-4 h-4" /> Create Employee
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(stats.length > 0 ? stats : defaultStats).map(item => {
              const { icon: Icon, bg, color } = iconMap[item.icon] || iconMap.users;
              return (
                <div
                  key={item.label}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.label}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-1">
                      {item?.value ?? 0}
                    </h2>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-100">{error}</div>
          )}

          {/* Table card */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl overflow-hidden">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search anything..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400" />
              </div>
              <FilterSelect label="Status"     value={status} options={STATUS_OPTIONS} onChange={setStatus} />
              <FilterSelect label="Role"       value={role}   options={ROLE_OPTIONS}   onChange={setRole}   />
              <FilterSelect label="Department" value={dept}   options={DEPT_OPTIONS}   onChange={setDept}   />
              <FilterSelect label="Sort by"    value={sortBy} options={SORT_OPTIONS}   onChange={setSortBy} />
              <button
                  type="button"
                  onClick={() => setPage(1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-left">
                    <th className="px-5 py-3 font-semibold">Employee ID</th>
                    <th className="px-5 py-3 font-semibold">Employee Name</th>
                    <th className="px-5 py-3 font-semibold">Role / Department</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Joined On</th>
                    <th className="px-5 py-3 font-semibold">Last Login</th>
                    <th className="px-5 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-slate-100 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400">No employees found.</td>
                    </tr>
                  ) : (
                    employees.map((emp, i) => (
                      <tr key={emp.id || i} className=" text-left">
                        <td className="px-5 py-4 font-mono text-slate-500 text-xs text-left">{emp.employeeId}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {emp.avatar ? (
                              <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-blue-600" />  
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{emp.name}</p>
                              <p className="text-xs text-slate-400">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-700">{emp.role}</p>
                          <p className="text-xs text-slate-400">{emp.department}</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={emp.status} /></td>
                        <td className="px-5 py-4 text-slate-600">{emp.joinedOn}</td>
                        <td className={`px-5 py-4 font-medium ${emp.lastLoginLabel === "yesterday" ? "text-orange-500" : "text-emerald-600"}`}>
                          {emp.lastLogin}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" title="View"   className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600   hover:bg-blue-50   transition-colors"><Eye    className="w-4 h-4" /></button>
                            <button type="button" title="Edit"   className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600  hover:bg-amber-50  transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button type="button" title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600    hover:bg-red-50    transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                {total === 0 ? "No employees" : `Showing ${start} to ${end} of ${total} employees`}
              </p>
              <Pagination current={page} total={totalPages} onChange={setPage} />
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Rows per page:
                <div className="relative">
                  <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}
                    className="appearance-none pl-2 pr-6 py-1 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-400">
                    {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}