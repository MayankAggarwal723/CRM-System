import { useState } from "react";
import {
  User,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  BarChart3,
  Users,
} from "lucide-react";

// ----- Brand components -----
function BrandLockupCompact() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm">
        <span className="text-2xl font-black text-white tracking-tight">Y</span>
      </div>
      <div>
        <div className="text-lg font-bold text-white tracking-tight leading-none">
          YNRS
        </div>
        <div className="text-[10px] font-medium text-blue-200/70 tracking-[0.15em] uppercase">
          Business Solutions
        </div>
      </div>
    </div>
  );
}

function BrandLockupCentered() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600">
          <span className="text-2xl font-black text-white tracking-tight">Y</span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 tracking-tight leading-none">
            YNRS
          </div>
          <div className="text-[10px] font-medium text-slate-400 tracking-[0.15em] uppercase">
            Business Solutions
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Role Card -----
function RoleCard({ active, icon: Icon, title, desc, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`relative text-left rounded-2xl border p-5 transition-all w-full ${
        active
          ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span
        className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all ${
          active ? "border-blue-600 bg-blue-600" : "border-slate-300"
        }`}
      />
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${
          active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-semibold text-slate-900 text-sm">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
    </button>
  );
}

// ----- Feature badge (left panel footer) -----
function FeatureBadge({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-300" />
      </div>
      <div className="leading-tight">
        <div className="text-xs font-semibold text-white">{label}</div>
        <div className="text-[11px] text-blue-200/80">{sub}</div>
      </div>
    </div>
  );
}

// ----- MAIN COMPONENT -----
export default function LoginSplitScreen() {
  const [role, setRole] = useState("employee");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ role, loginId, password, rememberMe });
  };

  // Dashboard mockup data (exactly as described)
  const stats = [
    { label: "Total Leads", value: "1,250" },
    { label: "Follow-ups", value: "320" },
    { label: "Calls", value: "86" },
    { label: "Conversion", value: "28%" },
  ];

  const leadOverview = [
    { label: "Total Leads", value: "1,250" },
    { label: "Employees", value: "320" },
    { label: "Reports", value: "86" },
    { label: "Settings", value: "28%" },
  ];

  const upcomingFollowup = {
    name: "Ruth Varma",
    dateTime: "12 May, 11:00 AM",
    employee: "Amal Matra",
    status: "Active",
    phone: "12 May, 12:00 PM", // as per design – could be a phone number but they wrote date
    email: "amal@example.com",
    location: "New York",
    meetingNotes: [
      "Amal Matra",
      "Ruth Varma",
      "Sarah Smith",
      "John Doe",
      "Jane Doe",
      "Sarah Smith",
      "John Doe",
      "Jane Doe",
    ],
  };

  const features = [
    { icon: ShieldCheck, label: "Secure", sub: "& Reliable" },
    { icon: Zap, label: "Fast", sub: "& Efficient" },
    { icon: BarChart3, label: "Real-time", sub: "Insights" },
    { icon: Users, label: "Team", sub: "Collaboration" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="flex w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* ===== LEFT PANEL ===== */}
        <div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white px-10 py-10 flex-col min-h-[800px]"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%231a1a2e"/%3E%3Ccircle cx="50" cy="50" r="40" fill="%232d2d44" opacity="0.4"/%3E%3C/svg%3E')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1f]/95 via-[#1a1a2e]/90 to-[#16213e]/95" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="mb-8">
              <BrandLockupCompact />
            </div>

            {/* Headline */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold leading-[1.15]">Track Leads.</h1>
              <h1 className="text-4xl font-bold leading-[1.15]">Manage Teams.</h1>
              <h1 className="text-4xl font-bold leading-[1.15] text-blue-400">
                Grow Your Business.
              </h1>
              <div className="w-12 h-1 bg-blue-400 rounded-full my-5" />
              <p className="text-blue-200/90 text-sm max-w-md leading-relaxed">
                A complete solution to manage leads, follow-ups, calls, documents
                and team performance all in one place.
              </p>
            </div>

            {/* Dashboard Mockup */}
            <div className="flex-1 flex items-center justify-center min-h-0 mb-6">
              <div className="w-full max-w-md bg-[#1e1e32]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-5 shadow-2xl">
                {/* Mockup header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-[10px] text-white/30 tracking-widest uppercase">
                    Dashboard
                  </span>
                  <span className="w-14" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-white/40 tracking-wide">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leads Overview row */}
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5 mb-4">
                  <span className="text-xs text-white/60">Leads Overview</span>
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    {leadOverview.map((item) => (
                      <span key={item.label}>
                        <span className="font-bold">{item.value}</span> {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Upcoming Follow-ups - single detailed entry */}
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-white/70">
                      Upcoming Follow-ups
                    </span>
                    <span className="text-[10px] text-blue-400">View all</span>
                  </div>
                  <div className="space-y-1 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">Lead Name:</span>
                      <span className="font-medium text-white/90">
                        {upcomingFollowup.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Date & Time:</span>
                      <span>{upcomingFollowup.dateTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Employee:</span>
                      <span>{upcomingFollowup.employee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Status:</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[9px] font-medium">
                        {upcomingFollowup.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Phone Number:</span>
                      <span>{upcomingFollowup.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Email:</span>
                      <span className="text-blue-300">{upcomingFollowup.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Location:</span>
                      <span>{upcomingFollowup.location}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Meeting Notes:</span>
                      <div className="mt-1 max-h-20 overflow-y-auto notes-scroll pr-1 flex flex-wrap gap-1">
                        {upcomingFollowup.meetingNotes.map((note, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/70"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features footer */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {features.map((f) => (
                <FeatureBadge key={f.label} {...f} />
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center text-center mb-7">
              <BrandLockupCentered />
              <h2 className="text-2xl font-bold text-slate-900 mt-4">
                Welcome Back! 👋
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Please choose how you want to sign in
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-700 mb-3">Login as</p>
            <div
              className="grid grid-cols-2 gap-3 mb-6"
              role="radiogroup"
              aria-label="Login as"
            >
              <RoleCard
                active={role === "employee"}
                icon={User}
                title="Employee"
                desc="Login to access your employee account"
                onClick={() => setRole("employee")}
              />
              <RoleCard
                active={role === "admin"}
                icon={ShieldCheck}
                title="Admin"
                desc="Login to access admin dashboard"
                onClick={() => setRole("admin")}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="loginId" className="text-sm font-semibold text-slate-700">
                  Employee ID / Email / Admin ID
                </label>
                <div className="mt-1.5 flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    id="loginId"
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter your ID or email"
                    className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-1.5 flex items-center gap-2.5 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0"
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Login <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-500">
              By logging in, you agree to our{" "}
              <button type="button" className="text-blue-600 font-medium hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-blue-600 font-medium hover:underline">
                Privacy Policy
              </button>
              .
            </p>

            <div className="text-center text-xs text-slate-400 mt-8 space-y-1.5">
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Your data is safe and protected with enterprise-grade security.
              </p>
              <p>© {new Date().getFullYear()} YNRS Business Solutions. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}