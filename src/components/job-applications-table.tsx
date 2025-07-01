"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2, Save } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const statusOptions = ["Applied", "Interview", "Offer", "Rejected"];
const remoteOptions = ["Remote", "On-site", "Hybrid"];

const emptyRow = {
  company: "",
  position: "",
  location: "",
  experienceRequired: "",
  remoteOrOnsite: "Remote",
  dateApplied: format(new Date(), "yyyy-MM-dd"),
  applicationSource: "",
  jobDescription: "",
  status: "Applied",
  notes: "",
};

export default function JobApplicationsTable({ jobs, onChange }: { jobs: any[], onChange: () => void }) {
  const [editingRows, setEditingRows] = useState<{ [id: string]: any }>({});
  const [newRow, setNewRow] = useState<any>(emptyRow);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEdit = (id: string, field: string, value: string) => {
    setEditingRows((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleNewRowChange = (field: string, value: string) => {
    setNewRow((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id: string) => {
    setSaving(id);
    const row = editingRows[id];
    await fetch("/api/job-applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...row, id }),
    });
    setSaving(null);
    setEditingRows((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    onChange();
  };

  const handleSaveNew = async () => {
    setSaving("new");
    await fetch("/api/job-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRow, dateApplied: new Date(newRow.dateApplied).toISOString() }),
    });
    setSaving(null);
    setNewRow(emptyRow);
    onChange();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    setDeleting(id);
    await fetch("/api/job-applications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    onChange();
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-zinc-800 text-zinc-300">
          <tr>
            <th className="px-2 py-2 max-w-[120px] whitespace-pre-line break-words">Company</th>
            <th className="px-2 py-2 max-w-[120px] whitespace-pre-line break-words">Position</th>
            <th className="px-2 py-2 max-w-[120px] whitespace-pre-line break-words">Location</th>
            <th className="px-2 py-2 max-w-[80px] whitespace-pre-line break-words">Exp</th>
            <th className="px-2 py-2 max-w-[100px] whitespace-pre-line break-words">Remote/On-site</th>
            <th className="px-2 py-2 max-w-[110px] whitespace-pre-line break-words">Date Applied</th>
            <th className="px-2 py-2 max-w-[120px] whitespace-pre-line break-words">Source</th>
            <th className="px-2 py-2 max-w-[100px] whitespace-pre-line break-words">Status</th>
            <th className="px-2 py-2 max-w-[80px] whitespace-pre-line break-words">Days Ago</th>
            <th className="px-2 py-2 max-w-[140px] whitespace-pre-line break-words">Notes</th>
            <th className="px-2 py-2 max-w-[80px] whitespace-pre-line break-words">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* New Row */}
          <tr className="border-t border-zinc-800 bg-zinc-800">
            {Object.keys(emptyRow).map((field) =>
              field === "remoteOrOnsite" ? (
                <td key={field} className="px-2 py-1 max-w-[100px] whitespace-pre-line break-words">
                  <select
                    className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    value={newRow[field]}
                    onChange={e => handleNewRowChange(field, e.target.value)}
                  >
                    {remoteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
              ) : field === "status" ? (
                <td key={field} className="px-2 py-1 max-w-[100px] whitespace-pre-line break-words">
                  <select
                    className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    value={newRow[field]}
                    onChange={e => handleNewRowChange(field, e.target.value)}
                  >
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
              ) : field === "dateApplied" ? (
                <td key={field} className="px-2 py-1 max-w-[110px] whitespace-pre-line break-words">
                  <input
                    type="date"
                    className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    value={newRow[field]}
                    onChange={e => handleNewRowChange(field, e.target.value)}
                  />
                </td>
              ) : (
                <td key={field} className="px-2 py-1 max-w-[120px] whitespace-pre-line break-words">
                  <input
                    className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    value={newRow[field]}
                    onChange={e => handleNewRowChange(field, e.target.value)}
                  />
                </td>
              )
            )}
            <td className="px-2 py-1 flex gap-2">
              <Button variant="default" size="icon" onClick={handleSaveNew} disabled={saving === "new"}>
                <Save size={16}/>
              </Button>
            </td>
          </tr>
          {/* Existing Rows */}
          {jobs.length === 0 ? (
            <tr><td colSpan={11} className="text-center py-8 text-zinc-300">No applications yet.</td></tr>
          ) : jobs.map(job => {
            const isEditing = !!editingRows[job.id];
            const row = isEditing ? editingRows[job.id] : job;
            return (
              <tr key={job.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors text-zinc-100">
                {Object.keys(emptyRow).map((field) =>
                  field === "remoteOrOnsite" ? (
                    <td key={field} className="px-2 py-1">
                      {isEditing ? (
                        <select
                          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          value={row[field]}
                          onChange={e => handleEdit(job.id, field, e.target.value)}
                        >
                          {remoteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : row[field]}
                    </td>
                  ) : field === "status" ? (
                    <td key={field} className="px-2 py-1">
                      {isEditing ? (
                        <select
                          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          value={row[field]}
                          onChange={e => handleEdit(job.id, field, e.target.value)}
                        >
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : row[field]}
                    </td>
                  ) : field === "dateApplied" ? (
                    <td key={field} className="px-2 py-1">
                      {isEditing ? (
                        <input
                          type="date"
                          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          value={format(new Date(row[field]), "yyyy-MM-dd")}
                          onChange={e => handleEdit(job.id, field, e.target.value)}
                        />
                      ) : format(new Date(row[field]), "yyyy-MM-dd")}
                    </td>
                  ) : field === "notes" ? (
                    <td key={field} className="px-2 py-1">
                      {isEditing ? (
                        <input
                          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          value={row[field] || ""}
                          onChange={e => handleEdit(job.id, field, e.target.value)}
                        />
                      ) : (row[field] || "")}
                    </td>
                  ) : (
                    <td key={field} className="px-2 py-1">
                      {isEditing ? (
                        <input
                          className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded px-2 py-1 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          value={row[field]}
                          onChange={e => handleEdit(job.id, field, e.target.value)}
                        />
                      ) : row[field]}
                    </td>
                  )
                )}
                <td className="px-2 py-1 flex gap-2">
                  {isEditing ? (
                    <Button variant="default" size="icon" onClick={() => handleSave(job.id)} disabled={saving === job.id}>
                      <Save size={16}/>
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" onClick={() => setEditingRows(prev => ({ ...prev, [job.id]: { ...job } }))}>
                      Edit
                    </Button>
                  )}
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(job.id)} disabled={deleting === job.id}>
                    <Trash2 size={16}/>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}