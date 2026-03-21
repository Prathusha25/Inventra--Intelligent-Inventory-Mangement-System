import { useState } from "react";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiTrash,
  HiPhone,
  HiEnvelope,
  HiMapPin,
} from "react-icons/hi2";

const mockSuppliers = [
  { id: 1, name: "TechParts Global Ltd.", contact: "John Smith", email: "john@techparts.com", phone: "+1-555-0101", location: "San Francisco, CA", products: 45, status: "Active" },
  { id: 2, name: "GadgetWorld Inc", contact: "Emily Davis", email: "emily@gadgetworld.com", phone: "+1-555-0102", location: "Austin, TX", products: 32, status: "Active" },
  { id: 3, name: "KeyTech Solutions", contact: "Mike Johnson", email: "mike@keytech.io", phone: "+1-555-0103", location: "Seattle, WA", products: 18, status: "Active" },
  { id: 4, name: "DisplayPro Ltd", contact: "Sarah Wilson", email: "sarah@displaypro.com", phone: "+1-555-0104", location: "New York, NY", products: 12, status: "Inactive" },
  { id: 5, name: "VisionTech", contact: "David Lee", email: "david@visiontech.com", phone: "+1-555-0105", location: "Chicago, IL", products: 27, status: "Active" },
  { id: 6, name: "SoundWave Audio", contact: "Lisa Chen", email: "lisa@soundwave.com", phone: "+1-555-0106", location: "Los Angeles, CA", products: 15, status: "Active" },
];

export default function Suppliers() {
  const [search, setSearch] = useState("");

  const filtered = mockSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Suppliers</h1>
          <p className="text-slate-400 mt-1">Manage your supplier relationships</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
          <HiPlus className="h-5 w-5" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white placeholder-slate-500 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>

      {/* Supplier cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5 hover:border-slate-700/60 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{supplier.name}</h3>
                <p className="text-sm text-slate-400">{supplier.contact}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  supplier.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-500/10 text-slate-400"
                }`}
              >
                {supplier.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <HiEnvelope className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <HiPhone className="h-4 w-4 flex-shrink-0" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <HiMapPin className="h-4 w-4 flex-shrink-0" />
                <span>{supplier.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
              <span className="text-sm text-slate-400">
                <span className="text-indigo-400 font-semibold">{supplier.products}</span>{" "}
                products supplied
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                  <HiPencilSquare className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
