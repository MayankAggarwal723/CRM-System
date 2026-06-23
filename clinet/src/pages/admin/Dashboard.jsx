  import { useState, useEffect, } from "react";
  import { Link, useLocation } from "react-router-dom";
  import {
    LayoutGrid, Users, Flag, LogIn, FileText, Settings, Search, Calendar, Bell,
    Sun, Moon, Plus, ArrowRight, Activity, User, LogOut, Phone,
  } from "lucide-react";
  import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
  } from "recharts";
  import { getDashboardData } from "../../services/dashboardService";

  // ─── shared nav ────────────────────────────────────────────────────────────
  const navItems = [
    { label: "Dashboard",           icon: LayoutGrid, path: "/admin/dashboard" },
    { label: "Employees",           icon: Users,      path: "/admin/employee"  },
    { label: "Leads",               icon: Flag,       path: "/admin/lead"     },
    { label: "Login / Logout Logs", icon: LogIn,      path: "/admin/logs"      },
    { label: "Task & Follow-ups",   icon: FileText,   path: "/admin/tasks"     },
    { label: "Settings",            icon: Settings,   path: "/admin/settings"  },
    { label: "Create Employee",     icon: Plus,       path: "/admin/CreateEmployee" },
  ];

  // ─── stat icon map ──────────────────────────────────────────────────────────
  const iconMap = {
    users:    { icon: Users,    bg: "bg-blue-100",    color: "text-blue-600"    },
    activity: { icon: Activity, bg: "bg-emerald-100", color: "text-emerald-600" },
    leads:    { icon: User,     bg: "bg-purple-100",  color: "text-purple-600"  },
    calls:    { icon: Phone,    bg: "bg-orange-100",  color: "text-orange-600"  },
  };
  const defaultIconStyle = { icon: Users, bg: "bg-slate-100", color: "text-slate-500" };

  const defaultStats = [
    { label: "Total Employees",  value: "0", change: "", icon: "users"    },
    { label: "Active Today",     value: "0", change: "", icon: "activity" },
    { label: "Today's Leads",    value: "0", change: "", icon: "leads"    },
    { label: "Calls Made Today", value: "0", change: "", icon: "calls"    },
  ];

  // Chart skeleton — keeps axes visible when there's no real data yet
  const chartSkeleton = {
    week:  ["6 Jul","7 Jul","8 Jul","9 Jul","10 Jul","11 Jul","12 Jul"].map(l => ({ label: l, value: 0 })),
    month: ["Week 1","Week 2","Week 3","Week 4"].map(l => ({ label: l, value: 0 })),
    year:  ["Jan","Mar","May","Jul","Sep","Nov"].map(l => ({ label: l, value: 0 })),
  };

  const defaultLeadStatus = [
    { label: "New Leads",    value: 0, color: "#2563eb" },
    { label: "Connected",    value: 0, color: "#16a34a" },
    { label: "Follow-ups",   value: 0, color: "#c026d3" },
    { label: "Converted",    value: 0, color: "#f97316" },
    { label: "Lost / Closed",value: 0, color: "#ef4444" },
  ];

  const statusStyles = {
    New:         "bg-blue-100 text-blue-700",
    Contacted:   "bg-emerald-100 text-emerald-700",
    "Follow up": "bg-purple-100 text-purple-700",
    Converted:   "bg-orange-100 text-orange-700",
  };
  const defaultStatusStyle = "bg-slate-100 text-slate-600";

  const rankColors = [
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-red-100 text-red-600",
  ];
  const defaultRankColor = "bg-slate-100 text-slate-700";

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

  // ─── page ───────────────────────────────────────────────────────────────────
  export default function AdminDashboard() {
    const [range,      setRange]      = useState("week");
    const [theme,      setTheme]      = useState("light");
    const [admin,      setAdmin]      = useState({});
    const [stats, setStats] = useState(defaultStats);

    const [performers, setPerformers] = useState([
      {
        name: "No Data",
        leads: 0,
        pct: 0,
      },
    ]);

    const [recentLeads, setRecentLeads] = useState([
      {
        name: "No Leads Yet",
        phone: "-",
        status: "New",
        time: "-",
      },
    ]);

    const [leadStatus, setLeadStatus] = useState(defaultLeadStatus);

    const [chartData, setChartData] = useState(chartSkeleton.week);
    const [refreshing, setRefreshing] = useState(false);
    const [error,      setError]      = useState(null);

    useEffect(() => {
  const load = async () => {
    setRefreshing(true);

    try {
      const data = await getDashboardData(range);

      setAdmin(data.admin || {});
      setStats(data.stats || []);
      setPerformers(data.performers || []);
      setRecentLeads(data.recentLeads || []);
      setLeadStatus(data.leadStatus || []);
      setChartData(data.chartData || []);
      setError(null);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError("Couldn't load dashboard data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  load();
}, [range]);

    const totalLeads = leadStatus.reduce((sum, item) => sum + item.value, 0);
    const hasChartData = chartData.length > 0 && chartData.some(d => Number(d.value) > 0);
    const chartDisplayData = hasChartData ? chartData : (chartSkeleton[range] || chartSkeleton.week);

    return (
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        <Sidebar admin={admin} />

        <main className="flex-1 ml-45 overflow-y-auto">
          <div className="p-2 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 text-xs rounded-lg px-4 py-3 border border-red-100">{error}</div>
            )}

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium flex items-center gap-2">
                  Welcome back, {admin.name || "Admin"}! <span>👋</span>
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Here&rsquo;s what&rsquo;s happening with your team today.
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

            {/* Sub-header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500">Grow your business with better insights.</p>
                <button type="button" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                  View Reports <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium border border-slate-200 rounded-lg px-4 py-2 bg-white">
                Jul 06, 2026 - Jul 12, 2026 <Calendar className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(stats.length > 0 ? stats : defaultStats).map(item => {
                const { icon: Icon, bg, color } = iconMap[item.icon] || defaultIconStyle;
                const neg = typeof item.change === "string" && item.change.trim().startsWith("-");
                return (
                  <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
                      <p className={`text-xs mt-1 ${neg ? "text-red-500" : "text-emerald-600"}`}>{item.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-md text-slate-800">Lead Overview</h3>
                  <div className="flex items-center text-xs border border-slate-200 rounded-sm overflow-hidden">
                    {[{ key:"week",label:"This Week"},{ key:"month",label:"This Month"},{ key:"year",label:"This year"}].map(({ key, label }) => (
                      <button key={key} type="button" disabled={refreshing} onClick={() => setRange(key)}
                        className={`px-3 py-1 font-medium disabled:opacity-50 ${range === key ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-blue-600" /> New Leads</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-600" /> Connected</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-purple-600" /> Follow-ups</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-orange-500" /> Converted</span>
                </div>
                <div className={`h-74 transition-opacity ${refreshing ? "opacity-50" : ""}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDisplayData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                      <defs>
                        <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize:12, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:12, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5} fill="url(#leadFill)"
                        dot={{ r:4, fill:"#f97316", strokeWidth:0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-md text-slate-800 mb-4">Lead Status Distribution</h3>
                <div className="relative h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadStatus.length > 0 ? leadStatus : [{ label:"empty", value:1, color:"#e2e8f0" }]}
                        dataKey="value" nameKey="label"
                        startAngle={90} endAngle={-270}
                        innerRadius="65%" outerRadius="100%"
                        paddingAngle={leadStatus.length > 0 ? 2 : 0} strokeWidth={0}
                      >
                        {(leadStatus.length > 0 ? leadStatus : [{ label:"empty", color:"#e2e8f0" }]).map(entry => (
                          <Cell key={entry.label} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xs text-slate-500">Total Leads</div>
                    <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {(leadStatus.length > 0 ? leadStatus : defaultLeadStatus).map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Top Performers</h3>
                    <p className="text-xs text-slate-500">Best performing employees this week</p>
                  </div>
                  <button type="button" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {performers.map((p, i) => (
                    <div key={p.name + i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${rankColors[i] || defaultRankColor}`}>{i + 1}</div>
                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{p.name}</h4>
                          <p className="text-xs text-slate-500">Leads: {p.leads}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {p.pct != null ? `${p.pct}%` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Recent Leads</h3>
                    <p className="text-xs text-slate-500">Latest customer activities</p>
                  </div>
                  <button type="button" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {recentLeads.map((lead, i) => (
                    <div key={lead.name + i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.phone}</p>
                        </div>
                      </div>
                      <div className="flex justify-center w-40">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyles[lead.status] || defaultStatusStyle}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-xs text-slate-400">{lead.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }