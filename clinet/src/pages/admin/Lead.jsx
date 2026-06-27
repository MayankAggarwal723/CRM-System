import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Users, Flag, Phone, LogIn, FileText, Settings, Search, Calendar, Bell,
  Sun, Moon, Plus, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Trash2, Filter, User, LogOut, CheckCircle2, XCircle,
} from "lucide-react";

// ─── shared nav (same paths as Dashboard / Employee) ───────────────────────
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
  total:     { icon: Users,        bg: "bg-blue-100",    color: "text-blue-600"    },
  new:       { icon: User,         bg: "bg-emerald-100", color: "text-emerald-600" },
  followup:  { icon: Phone,        bg: "bg-purple-100",  color: "text-purple-600"  },
  converted: { icon: CheckCircle2, bg: "bg-orange-100",  color: "text-orange-600"  },
  lost:      { icon: XCircle,      bg: "bg-red-100",     color: "text-red-600"     },
};
const defaultStats = [
  { label: "Total Leads", value: "0", change: "", icon: "total",     trend: "up"   },
  { label: "New Leads",   value: "0", change: "", icon: "new",       trend: "up"   },
  { label: "Follow-Ups",  value: "0", change: "", icon: "followup",  trend: "up"   },
  { label: "Converted",   value: "0", change: "", icon: "converted", trend: "up"   },
  { label: "Lost",        value: "0", change: "", icon: "lost",      trend: "down" },
];

// ─── status pill colors ─────────────────────────────────────────────────────
const statusStyles = {
  New:            "bg-blue-100 text-blue-700",
  Now:            "bg-blue-100 text-blue-700",
  "Follow-Up":    "bg-purple-100 text-purple-700",
  Converted:      "bg-emerald-100 text-emerald-700",
  "Lost/Closed":  "bg-red-100 text-red-700",
};
const defaultStatusStyle = "bg-slate-100 text-slate-600";

// ─── filter options ─────────────────────────────────────────────────────────
const STATUS_OPTIONS   = ["All", "New", "Now", "Follow-Up", "Converted", "Lost/Closed"];

const ROWS_OPTIONS     = [10, 25, 50];

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
export default function Lead() {
  const [theme,       setTheme]       = useState("light");
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState("All");
  const [source,      setSource]      = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All Employees");
  const [page,        setPage]        = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [admin,  setAdmin]  = useState({});
  const [stats,  setStats]  = useState([]);
  const [leads,  setLeads]  = useState([]);
  const SOURCE_OPTIONS = [
    "All",
    ...new Set(
        leads
        .map((lead) => lead.leadSource)
        .filter(Boolean)
    ),
    ];
  const [total,  setTotal]  = useState(0);
  const [loading, setLoading] = useState(true);

  // Mocked pagination page-count to match the design (1, 2, 3 … 8) until a
  // real /api/leads endpoint returns server-side total pages.
  const totalPages = Math.max(
    1,
    Math.ceil(total / rowsPerPage)
    );
  const prevDepsRef = useRef();

  useEffect(() => {
    let isActive = true;

    const fetchLeads = async () => {
      if (!isActive) return;
      setLoading(true);

      try {
        setAdmin({
          name: "Admin User",
          role: "Super Admin",
        });

        const response = await fetch(
            `http://localhost:5000/api/leads?page=${page}&limit=${rowsPerPage}`
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load leads"
                );
                }

            setLeads(result.data.leads || []);
            setTotal(result.data.total || 0);

        const statsData = result.data.stats || {};

        setStats([
        {
            label: "Total Leads",
            value: statsData.totalLeads,
            icon: "total",
            trend: "up",
            change: "Live"
        },
        {
            label: "New Leads",
            value: statsData.newLeads,
            icon: "new",
            trend: "up",
            change: "Live"
        },
        {
            label: "Follow-Ups",
            value: statsData.followUps,
            icon: "followup",
            trend: "up",
            change: "Live"
        },
        {
            label: "Converted",
            value: statsData.converted,
            icon: "converted",
            trend: "up",
            change: "Live"
        },
        {
            label: "Lost",
            value: statsData.lost,
            icon: "lost",
            trend: "down",
            change: "Live"
        }
        ]);

      } catch (err) {
        if (!isActive) return;
        console.error("Leads API Error:", err);

        setLeads([]);
        setStats([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    Promise.resolve().then(fetchLeads);

    // Reset to page 1 when filters change
    if (page !== 1 && (prevDepsRef.current &&
        (prevDepsRef.current.search !== search || prevDepsRef.current.status !== status ||
         prevDepsRef.current.source !== source || prevDepsRef.current.employeeFilter !== employeeFilter ||
         prevDepsRef.current.rowsPerPage !== rowsPerPage))) {
      setPage(1);
      return;
    }

    prevDepsRef.current = { search, status, source, employeeFilter, rowsPerPage };

    return () => {
      isActive = false;
    };
  }, [page, rowsPerPage, search, status, source, employeeFilter]);

    const filteredLeads = leads.filter((lead) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
        lead.customer?.toLowerCase().includes(searchValue)||
        lead.leadId?.toLowerCase().includes(searchValue) ||
        lead.phone?.includes(search);

    const matchesStatus =
        status === "All" || lead.status === status;

    const employeeName =
        lead.employee?.name || lead.employee;

    const matchesEmployee =
        employeeFilter === "All Employees" ||
        employeeName === employeeFilter;

    const matchesSource =
        source === "All" ||
        lead.leadSource === source;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesEmployee &&
        matchesSource
    );
    });
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end   = Math.min(page * rowsPerPage, total);
  const EMPLOYEE_OPTIONS = [
  "All Employees",
  ...new Set(
    leads
      .map((lead) => lead.employee?.name || lead.employee)
      .filter(Boolean)
  ),
];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar admin={admin} />

      <main className="flex-1 ml-45 overflow-y-auto">
        <div className="p-2 space-y-4">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Leads
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Dashboard <span className="mx-1">›</span>
                <span className="text-blue-600 font-medium">Leads</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search anything..." className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white" />
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {(stats.length > 0 ? stats : defaultStats).map(item => {
              const { icon: Icon, bg, color } = iconMap[item.icon] || iconMap.total;
              const trendColor = item.trend === "up" ? "text-emerald-600" : "text-red-500";
              const arrow = item.trend === "up" ? "↑" : "↓";
              const labelColor = item.label === "Lost" ? "text-red-600" : "text-slate-800";
              return (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${labelColor}`}>{item.label}</p>
                    <h2 className="text-2xl font-bold mt-0.5">{item.value}</h2>
                    <p className={`text-xs mt-1 ${trendColor}`}>{arrow} {item.change}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-8 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search anything..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400" />
              </div>
              <FilterSelect label="Status"      value={status} options={STATUS_OPTIONS} onChange={setStatus} />
              <FilterSelect label="Lead Source" value={source} options={SOURCE_OPTIONS} onChange={setSource} />
              <div className="relative">
                <select
                  value={employeeFilter}
                  onChange={e => setEmployeeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400"
                >
                  {EMPLOYEE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600">
                Jul 06,2026 - Jul 12,2026
                <Calendar className="w-4 h-4 text-slate-400" />
              </button>
              <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" /> Export
              </button>
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
                    <th className="px-5 py-3 font-semibold">Lead ID</th>
                    <th className="px-5 py-3 font-semibold">Customer Name</th>
                    <th className="px-5 py-3 font-semibold">Mobile Number</th>
                    <th className="px-5 py-3 font-semibold">Employee Name</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created On</th>
                    <th className="px-5 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-slate-100 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">No leads found.</td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, i) => (
                      <tr key={lead.leadId || i} className="text-left">
                        <td className="px-5 py-4 font-medium text-slate-700">{lead.leadId}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://i.pravatar.cc/64?u=${lead.leadId}`}
                              alt={lead.customer || "Customer"}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">{lead.customer}</p>
                              <p className="text-xs text-slate-400">{lead.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{lead.phone}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://i.pravatar.cc/64?u=${
                                    lead.employee?.name || lead.employee
                                    }${lead.leadId}`}
                              alt={lead.employee?.name || lead.employee}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <p className="font-medium text-slate-700">{lead.employee?.name || lead.employee}</p>
                              <p className="text-xs text-slate-400">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyles[lead.status] || defaultStatusStyle}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div>{lead.createdOn}</div>
                          <div className="text-xs text-slate-400">{lead.createdTime}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className={`font-medium ${lead.joinedColor}`}>{lead.joinedLabel}</div>
                          <div className="text-xs text-slate-400">{lead.joinedTime}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" title="View"   className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600   hover:bg-blue-50   transition-colors"><Eye    className="w-4 h-4" /></button>
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
                {total === 0 ? "No leads" : `Showing ${start} to ${end} of ${total} leads`}
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