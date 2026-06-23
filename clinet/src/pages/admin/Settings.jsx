import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Users, Flag, LogIn, FileText, Settings, Search, Calendar, Bell,
  Sun, Moon, Plus, User, LogOut, Building2, Mail, PhoneCall, MapPin, Clock,
  CalendarDays, UserCog, Lock,
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

// ─── reusable field components ────────────────────────────────────────────────
function FieldRow({ icon: Icon, label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-6">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1 text-left">{label}</label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-800"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-slate-600 w-36 shrink-0">{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white"
      />
    </div>
  );
}

function CheckOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
      />
      {label}
    </label>
  );
}

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange(label)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      {label}
    </label>
  );
}

// ─── sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ admin }) {
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
              <Link
                key={label}
                to={path}
                className={`
                  flex items-center h-8 px-2 rounded-lg text-xs font-medium transition-all
                  ${active ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}
                `}
              >
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
            <h4 className="text-sm font-semibold text-slate-800">{admin?.name || "Admin User"}</h4>
            <p className="text-xs text-slate-500">{admin?.role || "Super Admin"}</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [theme, setTheme] = useState("light");

  // General Settings
  const [companyName,    setCompanyName]    = useState("");
  const [companyEmail,   setCompanyEmail]   = useState("");
  const [companyPhone,   setCompanyPhone]   = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [timezone,       setTimezone]       = useState("");
  const [dateFormat,     setDateFormat]     = useState("");

  // Account Settings
  const [adminName,    setAdminName]    = useState("");
  const [email,        setEmail]        = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,      setNewPassword]      = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");

  // Notification Settings
  const [notifications, setNotifications] = useState({
    newLead:          false,
    followUpReminder: false,
    employeeLogin:    false,
    employeeLogout:   false,
    overdueFollowUp:  false,
    marketingUpdates: false,
  });

  const toggleNotification = (key) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  // Appearance
  const [appearance, setAppearance] = useState("Light Mode");

  const admin = { name: "Admin User", role: "Super Admin" };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar admin={admin} />

      <main className="flex-1 ml-45 overflow-y-auto">
        <div className="p-2 space-y-4">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-left">Settings</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Dashboard <span className="mx-1">›</span>
                <span className="text-blue-600 font-medium">Settings</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white"
                />
              </div>
              <button type="button" className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Calendar className="w-[18px] h-[18px]" />
              </button>
              <button type="button" className="relative p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <div className="flex items-center bg-slate-100 rounded-full p-1">
                <button type="button" onClick={() => setTheme("light")} className={`p-1.5 rounded-full ${theme === "light" ? "bg-white shadow text-amber-500" : "text-slate-400"}`}>
                  <Sun className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setTheme("dark")} className={`p-1.5 rounded-full ${theme === "dark" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>
                  <Moon className="w-4 h-4" />
                </button>
              </div>
              <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                <Plus className="w-4 h-4" /> Create Employee
              </button>
            </div>
          </div>

          {/* ── General Settings ─────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="mb-5 text-left">
              <h3 className="text-base font-semibold text-slate-800">General Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage your company information and system preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              <FieldRow icon={Building2}   label="Company Name"    value={companyName}    onChange={setCompanyName}    placeholder="" />
              <FieldRow icon={Mail}        label="Company Email"   value={companyEmail}   onChange={setCompanyEmail}   placeholder="" />
              <FieldRow icon={PhoneCall}   label="Company Phone"   value={companyPhone}   onChange={setCompanyPhone}   placeholder="" />
              <FieldRow icon={MapPin}      label="Company Address" value={companyAddress} onChange={setCompanyAddress} placeholder="" />
              <FieldRow icon={Clock}       label="Timezone"        value={timezone}       onChange={setTimezone}       placeholder="" />
              <FieldRow icon={CalendarDays}label="Date Format"     value={dateFormat}     onChange={setDateFormat}     placeholder="" />
            </div>

            <div className="flex justify-end mt-6">
              <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
                Save Changes
              </button>
            </div>
          </div>

          {/* ── Account Settings + Change Password ───────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Account Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-slate-800">Account Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage your admin account details and password.</p>
              </div>

              <div className="space-y-4">
                <FieldRow icon={UserCog}   label="Admin Name"     value={adminName}    onChange={setAdminName}    />
                <FieldRow icon={Mail}      label="Email"          value={email}        onChange={setEmail}        type="email" />
                <FieldRow icon={PhoneCall} label="Mobile Number"  value={mobileNumber} onChange={setMobileNumber} />
              </div>

              <div className="flex justify-end mt-6">
                <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-4 h-4 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-800">Change Password</h3>
              </div>

              <div className="space-y-4">
                <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} />
                <PasswordField label="New Password"     value={newPassword}     onChange={setNewPassword}     />
                <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
              </div>

              <div className="flex justify-end mt-6">
                <button type="button" className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-all">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* ── Notification Settings ─────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-slate-800">Notification Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose what notification you want to receive</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
              <CheckOption label="New lead assigned"      checked={notifications.newLead}          onChange={() => toggleNotification("newLead")}          />
              <CheckOption label="Follow-up reminder"     checked={notifications.followUpReminder} onChange={() => toggleNotification("followUpReminder")} />
              <CheckOption label="Employee login alert"   checked={notifications.employeeLogin}    onChange={() => toggleNotification("employeeLogin")}    />
              <CheckOption label="Employee Logout alert"  checked={notifications.employeeLogout}   onChange={() => toggleNotification("employeeLogout")}   />
              <CheckOption label="Overdue Follow-up alert"checked={notifications.overdueFollowUp}  onChange={() => toggleNotification("overdueFollowUp")}  />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <CheckOption
                label={
                  <span>
                    <span className="font-medium text-slate-700">Marketing & System Updates</span>
                    <span className="block text-xs text-slate-400">Receive occasional updates and announcements</span>
                  </span>
                }
                checked={notifications.marketingUpdates}
                onChange={() => toggleNotification("marketingUpdates")}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
                Save Preferences
              </button>
            </div>
          </div>

          {/* ── Appearance Settings ───────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-slate-800">Appearance Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize the appearance of the applications</p>
            </div>

            <div className="flex flex-wrap gap-8">
              <RadioOption label="Light Mode"     checked={appearance === "Light Mode"}     onChange={setAppearance} />
              <RadioOption label="Dark Mode"      checked={appearance === "Dark Mode"}      onChange={setAppearance} />
              <RadioOption label="System Default" checked={appearance === "System Default"} onChange={setAppearance} />
            </div>

            <div className="flex justify-end mt-6">
              <button type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all">
                Save Appearance
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}