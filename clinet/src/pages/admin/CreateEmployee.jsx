import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, Flag, Phone, LogIn, FileText, Settings,
  Search, Calendar, Bell, Sun, Moon, Plus, User, LogOut,
  Upload, Eye, EyeOff, ChevronDown, Info,
} from "lucide-react";

// ─── shared nav ──────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, path: "/admin/dashboard" },
  { label: "Employees",           icon: Users,      path: "/admin/employee"  },
  { label: "Leads",               icon: Flag,       path: "/admin/leads"     },
  { label: "Call Details",        icon: Phone,      path: "/admin/calls"     },
  { label: "Login / Logout Logs", icon: LogIn,      path: "/admin/logs"      },
  { label: "Task & Follow-ups",   icon: FileText,   path: "/admin/tasks"     },
  { label: "Settings",            icon: Settings,   path: "/admin/settings"  },
];

// ─── section header ───────────────────────────────────────────────────────────
function SectionHeader({ number, title, color = "bg-blue-600" }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-7 h-7 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
        {number}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    </div>
  );
}

// ─── field wrappers ───────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="text-left">
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-800 placeholder-slate-400";
const selectCls = "appearance-none w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white text-slate-700 cursor-pointer";

function SelectField({ label, required, options, value, onChange }) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </Field>
  );
}

// ─── document upload box ──────────────────────────────────────────────────────
function DocUpload({ label, required }) {
  const [file, setFile] = useState(null);
  const ref = useRef();
  return (
    <div className="text-left">
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        onClick={() => ref.current.click()}
        className="border border-dashed border-slate-300 rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Upload className="w-5 h-5 text-blue-500 mb-1" />
        <span className="text-xs font-medium text-slate-600">{file ? file.name : "Upload"}</span>
        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF</span>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
          onChange={e => setFile(e.target.files[0])} />
      </div>
    </div>
  );
}

// ─── sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
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

        {/* Create Employee button */}
        <button
          type="button"
          onClick={() => navigate("/admin/employee/add")}
          className="mt-4 w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Create Employee</span>
        </button>
      </div>
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function AddEmployee() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const photoRef = useRef();

  // ── 1. Personal Information ────────────────────────────────────────────────
  const [photoPreview, setPhotoPreview] = useState(null);
  const [employeeId,   setEmployeeId]   = useState("");
  const [fullName,     setFullName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [contactNo,    setContactNo]    = useState("");
  const [dob,          setDob]          = useState("");
  const [gender,       setGender]       = useState("");
  const [maritalStatus,setMaritalStatus]= useState("");
  const [nationality,  setNationality]  = useState("");
  const [address,      setAddress]      = useState("");
  const [city,         setCity]         = useState("");
  const [state,        setState]        = useState("");
  const [pinCode,      setPinCode]      = useState("");

  // ── 2. Job Information ─────────────────────────────────────────────────────
  const [department,      setDepartment]      = useState("");
  const [role,            setRole]            = useState("");
  const [reportingManager,setReportingManager]= useState("");
  const [dateOfJoining,   setDateOfJoining]   = useState("");
  const [employmentType,  setEmploymentType]  = useState("");
  const [salary,          setSalary]          = useState("");
  const [experience,      setExperience]      = useState("");
  const [empStatus,       setEmpStatus]       = useState("Active");

  // ── 3. Login Credentials ───────────────────────────────────────────────────
  const [loginId,          setLoginId]          = useState("");
  const [password,         setPassword]         = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [showPassword,     setShowPassword]     = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [forceChange,      setForceChange]      = useState(true);
  const [sendCredentials,  setSendCredentials]  = useState(true);
  const [tempPassword,     setTempPassword]     = useState(false);

  // ── 4. Account Details ─────────────────────────────────────────────────────
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode,      setIfscCode]      = useState("");
  const [bankName,      setBankName]      = useState("");
  const [bankPhone,     setBankPhone]     = useState("");

  // ── 5. Emergency Contact ───────────────────────────────────────────────────
  const [ecName,         setEcName]         = useState("");
  const [ecRelationship, setEcRelationship] = useState("");
  const [ecContact,      setEcContact]      = useState("");
  const [ecAlternate,    setEcAlternate]    = useState("");
  const [ecAddress,      setEcAddress]      = useState("");

  // ── 7. Additional Information ──────────────────────────────────────────────
  const [qualification, setQualification] = useState("");
  const [skills,        setSkills]        = useState("");
  const [notes,         setNotes]         = useState("");

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    // wire to POST /api/employees when backend is ready
    console.log("Submit employee form");
    navigate("/admin/employee");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 ml-45 overflow-y-auto">
        <div className="p-2 space-y-4">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-800">Add Employee</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Dashboard <span className="mx-1">›</span>
                <Link to="/admin/employee" className="hover:text-slate-600">Employees</Link>
                <span className="mx-1">›</span>
                <span className="text-blue-600 font-medium">Add Employee</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search anything..."
                  className="pl-9 pr-4 py-2 w-56 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white" />
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
              <button type="button" onClick={handleSubmit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                <User className="w-4 h-4" /> Save Employee
              </button>
            </div>
          </div>

          {/* ── 1. Personal Information ──────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="1" title="Personal Information" color="bg-blue-600" />

            <div className="flex gap-6">
              {/* Photo upload */}
              <div className="text-left shrink-0">
                <p className="text-xs font-medium text-slate-600 mb-1">Employee Photo</p>
                <div
                  onClick={() => photoRef.current.click()}
                  className="w-44 h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-600">Upload Photo</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max. 2MB)</span>
                    </>
                  )}
                  <input ref={photoRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handlePhotoChange} />
                </div>
              </div>

              {/* Rest of personal info */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Field label="Employee ID" required>
                  <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)}
                    placeholder="Enter employee ID" className={inputCls} />
                </Field>
                <Field label="Full Name" required>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Enter full name" className={inputCls} />
                </Field>
                <Field label="Email" required>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email address" className={inputCls} />
                </Field>
                <Field label="Contact Number" required>
                  <input type="text" value={contactNo} onChange={e => setContactNo(e.target.value)}
                    placeholder="Enter contact number" className={inputCls} />
                </Field>
                <Field label="Date of Birth" required>
                  <div className="relative">
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} />
                  </div>
                </Field>
                <SelectField label="Gender" required value={gender} onChange={setGender}
                  options={["Male", "Female", "Other"]} />
                <SelectField label="Marital Status" value={maritalStatus} onChange={setMaritalStatus}
                  options={["Single", "Married", "Divorced", "Widowed"]} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <SelectField label="Nationality" value={nationality} onChange={setNationality}
                options={["Indian", "American", "British", "Other"]} />
              <Field label="Address" required>
                <textarea value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Enter full address" rows={2}
                  className={`${inputCls} resize-none`} />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <Field label="City" required>
                <input type="text" value={city} onChange={e => setCity(e.target.value)}
                  placeholder="Enter city" className={inputCls} />
              </Field>
              <SelectField label="State" required value={state} onChange={setState}
                options={["Delhi","Maharashtra","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","Other"]} />
              <Field label="PIN Code" required>
                <input type="text" value={pinCode} onChange={e => setPinCode(e.target.value)}
                  placeholder="Enter PIN code" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* ── 2. Job Information ───────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="2" title="Job Information" color="bg-green-600" />
            <div className="grid grid-cols-4 gap-4">
              <SelectField label="Department" required value={department} onChange={setDepartment}
                options={["IT","HR","Accounts","Operations","Sales","Support"]} />
              <SelectField label="Role / Designation" required value={role} onChange={setRole}
                options={["Manager","Team Lead","Sales Executive","Developer","HR Executive","Support Agent"]} />
              <SelectField label="Reporting Manager" value={reportingManager} onChange={setReportingManager}
                options={["Rahul Sharma","Neha Singh","Amit Kumar"]} />
              <Field label="Date of Joining" required>
                <input type="date" value={dateOfJoining} onChange={e => setDateOfJoining(e.target.value)} className={inputCls} />
              </Field>
              <SelectField label="Employment Type" required value={employmentType} onChange={setEmploymentType}
                options={["Full-Time","Part-Time","Contract","Internship"]} />
              <Field label="Salary / CTC" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input type="text" value={salary} onChange={e => setSalary(e.target.value)}
                    placeholder="Enter salary" className={`${inputCls} pl-7`} />
                </div>
              </Field>
              <Field label="Experience (Years)">
                <input type="text" value={experience} onChange={e => setExperience(e.target.value)}
                  placeholder="Enter experience" className={inputCls} />
              </Field>
              <div className="text-left">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select value={empStatus} onChange={e => setEmpStatus(e.target.value)} className={selectCls}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 pointer-events-none" />
                  {/* shift text right to make room for dot */}
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Login Credentials ─────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number={<Lock />} title="Login Credentials" color="bg-purple-100" />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Employee ID (Login)" required>
                <input type="text" value={loginId} onChange={e => setLoginId(e.target.value)}
                  placeholder="Enter employee ID (will be used for login)" className={inputCls} />
              </Field>
              <Field label="Password" required>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                    className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" required>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password"
                    className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={forceChange} onChange={e => setForceChange(e.target.checked)}
                  className="w-4 h-4 accent-blue-600" />
                Force password change on first login
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={sendCredentials} onChange={e => setSendCredentials(e.target.checked)}
                  className="w-4 h-4 accent-blue-600" />
                Send login credentials to email
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" checked={tempPassword} onChange={e => setTempPassword(e.target.checked)}
                  className="w-4 h-4 accent-blue-600" />
                Temporary password
              </label>
            </div>

            <div className="flex items-center gap-2 mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-xs text-blue-600">Employee ID will be used to login into the system.</span>
            </div>
          </div>

          {/* ── 4. Account Details ───────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="4" title="Account Details" color="bg-orange-500" />
            <div className="grid grid-cols-4 gap-4">
              <Field label="Account Holder Name" required>
                <input type="text" value={accountHolder} onChange={e => setAccountHolder(e.target.value)}
                  placeholder="Enter account holder name" className={inputCls} />
              </Field>
              <Field label="Account Number" required>
                <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}
                  placeholder="Enter account number" className={inputCls} />
              </Field>
              <Field label="IFSC Code" required>
                <input type="text" value={ifscCode} onChange={e => setIfscCode(e.target.value)}
                  placeholder="Enter IFSC code" className={inputCls} />
              </Field>
              <Field label="Bank Name" required>
                <input type="text" value={bankName} onChange={e => setBankName(e.target.value)}
                  placeholder="Enter bank name" className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <Field label="Phone Number">
                <input type="text" value={bankPhone} onChange={e => setBankPhone(e.target.value)}
                  placeholder="Enter registered phone number" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* ── 5. Emergency Contact ─────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="5" title="Emergency Contact" color="bg-red-500" />
            <div className="grid grid-cols-4 gap-4">
              <Field label="Contact Person Name" required>
                <input type="text" value={ecName} onChange={e => setEcName(e.target.value)}
                  placeholder="Enter contact person name" className={inputCls} />
              </Field>
              <Field label="Relationship" required>
                <input type="text" value={ecRelationship} onChange={e => setEcRelationship(e.target.value)}
                  placeholder="e.g. Father, Mother, Spouse" className={inputCls} />
              </Field>
              <Field label="Contact Number" required>
                <input type="text" value={ecContact} onChange={e => setEcContact(e.target.value)}
                  placeholder="Enter contact number" className={inputCls} />
              </Field>
              <Field label="Alternate Number">
                <input type="text" value={ecAlternate} onChange={e => setEcAlternate(e.target.value)}
                  placeholder="Enter alternate number" className={inputCls} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Address">
                <textarea value={ecAddress} onChange={e => setEcAddress(e.target.value)}
                  placeholder="Enter address" rows={2}
                  className={`${inputCls} resize-none`} />
              </Field>
            </div>
          </div>

          {/* ── 6. Documents ─────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="6" title="Documents" color="bg-indigo-600" />
            <div className="grid grid-cols-6 gap-4">
              <DocUpload label="Aadhaar Card"      required />
              <DocUpload label="PAN Card"           required />
              <DocUpload label="Offer Letter"       required />
              <DocUpload label="Employee Agreement" required />
              <DocUpload label="Address Proof"      />
              <DocUpload label="Other Document"     />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">Maximum file size: 5MB per file. Allowed formats: JPG, PNG, PDF.</span>
            </div>
          </div>

          {/* ── 7. Additional Information ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <SectionHeader number="7" title="Additional Information" color="bg-teal-600" />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Qualification">
                <input type="text" value={qualification} onChange={e => setQualification(e.target.value)}
                  placeholder="Enter qualification" className={inputCls} />
              </Field>
              <Field label="Skills">
                <input type="text" value={skills} onChange={e => setSkills(e.target.value)}
                  placeholder="Enter skills (comma separated)" className={inputCls} />
              </Field>
              <Field label="Notes">
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Enter any notes about employee" rows={2}
                  className={`${inputCls} resize-none`} />
              </Field>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-end gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4">
            <button type="button" onClick={() => navigate("/admin/employee")}
              className="px-6 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
              <User className="w-4 h-4" /> Save Employee
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}