import { Construction } from "lucide-react";

export default function ComingSoon({ title = "This page" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <Construction className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">This section is still being built. Check back soon.</p>
      </div>
    </div>
  );
}