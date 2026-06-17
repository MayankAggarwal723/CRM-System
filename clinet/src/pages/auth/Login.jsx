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


const features = [
  { icon: ShieldCheck, label: "Secure", sub: "& Reliable" },
  { icon: Zap, label: "Fast", sub: "& Efficient" },
  { icon: BarChart3, label: "Real-time", sub: "Insights" },
  { icon: Users, label: "Team", sub: "Collaboration" },
];

// icon + two-line wordmark, side by side — used top-left on the dark panel
function BrandLockupCompact({ iconSize = "w-auto h-24", }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <img src="src/assets/logo.png" alt="YNRS logo" className={`${iconSize} object-contain`} />
    </div>
  );
}

// icon + name on one line, SOLUTIONS caption with dividers underneath — centered, used on the white panel
function BrandLockupCentered({ iconSize = "w-auto h-24",}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <img src="src/assets/logo.png" alt="YNRS logo" className={`${iconSize} object-contain`} />
      </div>
    
    </div>
  );
}

function RoleCard({ active, icon: Icon, title, onClick }) {
  return (
  <button
    type="button"
    role="radio"
    aria-checked={active}
    onClick={onClick}
    className={`flex items-center justify-between w-full rounded-xl border px-4 py-2.5 transition-all ${
      active
        ? "border-blue-500 bg-blue-50"
        : "border-slate-200 hover:border-slate-300"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          active
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <span className="font-semibold text-slate-800">
        {title}
      </span>
    </div>

    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        active
          ? "border-blue-600"
          : "border-slate-300"
      }`}
    >
      {active && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
      )}
    </div>
  </button>
);
}

export default function LoginSplitScreen() {
  const [role, setRole] = useState("employee");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ role, loginId, password, rememberMe });
    // call your login API here
  };

  return (
    <div className="min-h-screen max-w-8xl items-center justify-center" >
        <div className="flex w-auto justify-center" >
            <div className="hidden lg:flex relative overflow-hidden text-white px-12 py-5 flex-col"
        style={{
          backgroundImage: `url(${"src/assets/login-bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      > 
        <div className="relative justify-center w-1/2 z-10 mb-2">
          <BrandLockupCompact iconSize="w-50 h-20 items-center " nameSize="text-lg" />
        </div>

        <div className="relative z-10 mb-0 text-left">
            <h3 className="text-3xl font-semibold leading-tight text-left">
                Track Leads.
            </h3>

            <h3 className="text-3xl font-semibold leading-tight text-left">
                Manage Teams.
            </h3>

            <h3 className="text-3xl font-semibold leading-tight text-left text-blue-300">
                Grow Your Business.
            </h3>

            <div className="w-10 h-0.5 bg-blue-400 rounded-full my-1"></div>

            <p className="text-blue-100 max-w-md text-md leading-7 text-left">
                A complete solution to manage leads, follow-ups, calls,
                documents and team performance all in one place.
            </p>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <img
            src="src/assets/dashboard-mockup.png"
            alt="Product dashboard preview"
            className="w-[90%] max-w-md drop-shadow-2xl"
          />
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-3 text-xs">
          {features.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-blue-300" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">{label}</div>
                <div className="text-blue-200">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - login form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-6 py-5">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-2">
            <div className="mb-2">
              <BrandLockupCentered iconSize="w-50 h-20" nameSize="text-2xl" />
            </div>
            <h2 className="text-5xl font-bold text-[#0052FF] mt-3"> Welcome Back! 👋</h2>
            <p className="text-slate-500 mt-1">Please choose how you want to sign in</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-1" role="radiogroup" aria-label="Login as" >
            <RoleCard
              active={role === "employee"}
              icon={User}
              title="Employee"
              onClick={() => setRole("employee")}
            />
            <RoleCard
              active={role === "admin"}
              icon={ShieldCheck}
              title="Admin"
              onClick={() => setRole("admin")}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                    htmlFor="loginId"
                    className="block text-left text-sm font-semibold text-slate-700 mb-2"
                    >
                    {role === "admin" ? "Admin ID" : "Employee ID"}
                </label>
              <div className="mt-1.5 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  id="loginId"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Enter your ID or email"
                  className="w-full text-sm outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label
                    htmlFor="password"
                    className="block text-left text-sm font-semibold text-slate-700 mb-2"
                    >
                    Password
                </label>
              <div className="mt-1.5 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm outline-none bg-transparent"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <EyeOff className="w-4 h-4 text-slate-400" />
                    : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="
                        w-5 h-5
                        rounded
                        border-2 border-gray-300
                        bg-white
                        accent-blue-600
                        cursor-pointer
                    "
                />
                Remember Me
              </label>
              <button type="button" className="text-blue-600 font-medium">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              Login <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            By logging in, you agree to our{" "}
            <button type="button" className="text-blue-600 font-medium">Terms of Service</button>
            {" "}and{" "}
            <button type="button" className="text-blue-600 font-medium">Privacy Policy</button>.
          </p>

          <div className="text-center text-xs text-slate-400 mt-3 space-y-1">
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