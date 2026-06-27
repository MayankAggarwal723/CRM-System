import { X, Phone, Calendar } from "lucide-react";

export default function LeadDetailsModal({
  isOpen,
  onClose,
  lead,
}) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Lead Details
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Summary */}
        <div className="px-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>

              <div>
                <h4 className="font-semibold text-slate-800">
                  {lead.leadId}
                </h4>

                <p className="text-xs text-slate-500">
                  {lead.createdOn}
                </p>
              </div>

            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="font-semibold text-blue-600">
                {lead.status}
              </p>
            </div>

          </div>

          <hr className="my-5" />

          {/* Customer */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <img
                src={`https://i.pravatar.cc/100?u=${lead.leadId}`}
                alt=""
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold text-slate-800">
                  {lead.customer}
                </h3>

                <p className="text-sm text-slate-500">
                  Lead ID: {lead.leadId}
                </p>
              </div>

            </div>

            <div className="text-right">
              <p className="font-medium text-slate-700">
                {lead.phone}
              </p>

              <p className="text-sm text-slate-500">
                {lead.location}
              </p>
            </div>

          </div>

          {/* Details */}
          <div className="mt-8 space-y-6">

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Employee</span>
              <span className="font-semibold text-slate-800">
                {lead.employee}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Lead Source</span>
              <span className="font-semibold text-slate-800">
                {lead.leadSource}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Status</span>

              <span>
                <span className="inline-flex px-3 py-1 rounded-lg bg-purple-100 text-purple-600 text-sm font-semibold">
                  {lead.status}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Email</span>
              <span className="font-semibold text-slate-800">
                {lead.email}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Notes</span>

              <div className="bg-slate-100 rounded-lg p-3 text-sm text-slate-700">
                {lead.note || "Customer interested in demo and pricing details."}
              </div>
            </div>

            <div className="grid grid-cols-2">
              <span className="text-slate-500">Next Follow-Up</span>

              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4" />
                {lead.followUpDate || "15 Jul 2026, 11:00 AM"}
              </div>
            </div>

            <div className="grid grid-cols-2 pb-6">
              <span className="text-slate-500">Tags</span>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-sm">
                  Interested
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-100 text-sm">
                  Product Demo
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}