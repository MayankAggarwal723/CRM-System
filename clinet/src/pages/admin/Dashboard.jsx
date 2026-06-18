import { useState, useEffect, useRef } from "react";
import {
  LayoutGrid, Users, Flag, Phone, LogIn, FileText, Settings, Search, Calendar, Bell, Sun,
  Moon, Plus, ArrowRight, Activity, User, LogOut,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getDashboardData } from "../../services/dashboardService";
// Adjust this path to wherever your real logo file lives.

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Employees", icon: Users },
  { label: "Leads", icon: Flag },
  { label: "Call Details", icon: Phone },
  { label: "Login / Logout Logs", icon: LogIn },
  { label: "Task & Follow-ups", icon: FileText },
  { label: "Settings", icon: Settings },
];

// Stat cards come back from the API as data, but a React icon component can't
// travel over JSON. The backend sends a short key string instead (e.g. "users")
// and this map turns that key into the actual icon + colors.
const iconMap = {
  users: { icon: Users, bg: "bg-blue-100", color: "text-blue-600" },
  activity: { icon: Activity, bg: "bg-emerald-100", color: "text-emerald-600" },
  leads: { icon: User, bg: "bg-purple-100", color: "text-purple-600" },
  calls: { icon: Phone, bg: "bg-orange-100", color: "text-orange-600" },
};
const defaultIconStyle = { icon: Users, bg: "bg-slate-100", color: "text-slate-500" };

// Shown in place of real data until the API has something — same four
// slots as the real dashboard, just zeroed out instead of a "no data" message.
const defaultStats = [
  { label: "Total Employees", value: "0", change: "", icon: "users" },
  { label: "Active Today", value: "0", change: "", icon: "activity" },
  { label: "Today's Leads", value: "0", change: "", icon: "leads" },
  { label: "Calls Made Today", value: "0", change: "", icon: "calls" },
];

const statusStyles = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-emerald-100 text-emerald-700",
  "Follow up": "bg-purple-100 text-purple-700",
  Converted: "bg-orange-100 text-orange-700",
};
const defaultStatusStyle = "bg-slate-100 text-slate-600";

const rankColors = [
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-red-100 text-red-600",
];
const defaultRankColor = "bg-slate-100 text-slate-700";

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [range, setRange] = useState("week");
  const [theme, setTheme] = useState("light");

  const [admin, setAdmin] = useState({});
  const [stats, setStats] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true); // full-page loader, first load only
  const [refreshing, setRefreshing] = useState(false); // lightweight, range changes
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const load = async () => {
      if (isFirstLoad.current) setLoading(true);
      else setRefreshing(true);

      try {
        const data = await getDashboardData(range);
        setAdmin(data.admin || {});
        setStats(data.stats || []);
        setPerformers(data.performers || []);
        setRecentLeads(data.recentLeads || []);
        setLeadStatus(data.leadStatus || []);
        setChartData(data.chartData || []);
        setError(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
        isFirstLoad.current = false;
      }
    };

    load();
  }, [range]);

  const totalLeads = leadStatus.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-60 h-screen flex-col bg-white border-r border-slate-200 z-50">
        <div className="px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src="../../../logo.png" alt="Company Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon }) => {
              const active = activeNav === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveNav(label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{admin.name || "Admin"}</h4>
              <p className="text-xs text-slate-500">{admin.role || "Super Admin"}</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-60 overflow-y-auto">
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                Welcome back, {admin.name || "Admin"}! <span>👋</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Here&rsquo;s what&rsquo;s happening with your team today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-9 pr-4 py-2.5 w-56 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-400 bg-white"
                />
              </div>

              <button type="button" className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Calendar">
                <Calendar className="w-[18px] h-[18px]" />
              </button>

              <button type="button" className="relative p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Notifications">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              <div className="flex items-center bg-slate-100 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-1.5 rounded-full ${theme === "light" ? "bg-white shadow text-amber-500" : "text-slate-400"}`}
                  aria-label="Light theme"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-1.5 rounded-full ${theme === "dark" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}
                  aria-label="Dark theme"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>

              <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
                <Plus className="w-4 h-4" />
                Create Employee
              </button>
            </div>
          </div>

          {/* Sub header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-500">Grow your business with better insights.</p>
              <button type="button" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
                View Reports <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium border border-slate-200 rounded-xl px-4 py-2 bg-white">
              Jul 06, 2026 - Jul 12, 2026
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(stats.length > 0 ? stats : defaultStats).map((item) => {
              const { icon: Icon, bg, color } = iconMap[item.icon] || defaultIconStyle;
              const isNegative = typeof item.change === "string" && item.change.trim().startsWith("-");
              return (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
                    <p className={`text-xs mt-1 ${isNegative ? "text-red-500" : "text-emerald-600"}`}>{item.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts row */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead overview */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-lg text-slate-800 text-left">Lead Overview</h3>
                <div className="flex items-center text-sm border border-slate-200 rounded-lg overflow-hidden">
                  {[
                    { key: "week", label: "This Week" },
                    { key: "month", label: "This Month" },
                    { key: "year", label: "This year" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      disabled={refreshing}
                      onClick={() => setRange(key)}
                      className={`px-3 py-1.5 font-medium disabled:opacity-50 ${
                        range === key ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
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

              <div className={`h-64 transition-opacity ${refreshing ? "opacity-50" : ""}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      fill="url(#leadFill)"
                      dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lead status distribution */}
            <div>
              <h3 className="font-semibold text-lg text-slate-800 text-left">Lead Status Distribution</h3>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatus}
                      dataKey="value"
                      nameKey="label"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius="65%"
                      outerRadius="100%"
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {leadStatus.map((entry) => (
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
                {leadStatus.map((item) => (
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

          {/* Bottom Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 text-left">Top Performers</h3>
                  <p className="text-xs text-slate-500">Best performing employees this week</p>
                </div>
                <button type="button" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {performers.map((p, i) => (
                  <div key={p.name + i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${rankColors[i] || defaultRankColor}`}>
                        {i + 1}
                      </div>
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{p.name}</h4>
                        <p className="text-xs text-slate-500">Leads: {p.leads}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {p.pct != null ? `${p.pct}%` : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 text-left">Recent Leads</h3>
                  <p className="text-xs text-slate-500">Latest customer activities</p>
                </div>
                <button type="button" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {recentLeads.map((lead, i) => (
                  <div key={lead.name + i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800 text-left">{lead.name}</p>
                        <p className="text-xs text-slate-500 text-left">{lead.phone}</p>
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