"use client";

import React, { useState } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Plus } from "lucide-react";

export default function IndustriesPage() {
  const [search, setSearch] = useState("");

  const items = [
  {
    "q": "Fashion & Lifestyle Retail",
    "cat": "Apparel",
    "route": "/industries/fashion",
    "status": "PUBLISHED",
    "updated": "2026-03-16"
  },
  {
    "q": "Supermarket & Groceries",
    "cat": "FMCG",
    "route": "/industries/grocery",
    "status": "PUBLISHED",
    "updated": "2026-03-12"
  },
  {
    "q": "Electronics & Hardware",
    "cat": "Consumer Tech",
    "route": "/industries/electronics",
    "status": "PUBLISHED",
    "updated": "2026-03-07"
  },
  {
    "q": "Pharmacy & Healthcare",
    "cat": "Health",
    "route": "/industries/pharmacy",
    "status": "DRAFT",
    "updated": "2026-03-02"
  }
];

  const filtered = items.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <PageHeader
        title="Industries"
        subtitle="Configure vertical industry landing pages, proofs, and workflow breakdowns."
        breadcrumbs={[{ label: "Website" }, { label: "Industries" }]}
        badge={items.length}
        actions={
          <button
            onClick={() => alert("Add entry dialog")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        }
      />

      {/* Toolbar */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Title / Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] text-xs">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAFBFD] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-900">{item.q}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.cat}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{item.route}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{item.updated}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
