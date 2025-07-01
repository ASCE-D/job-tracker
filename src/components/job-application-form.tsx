"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

const statusOptions = ["Applied", "Interview", "Offer", "Rejected"];
const remoteOptions = ["Remote", "On-site", "Hybrid"];

export default function JobApplicationForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    experienceRequired: "",
    remoteOrOnsite: "Remote",
    dateApplied: new Date(),
    applicationSource: "",
    jobDescription: "",
    status: "Applied",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleDate = (date: Date) => {
    setForm({ ...form, dateApplied: date });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dateApplied: form.dateApplied.toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to add application");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Company *</Label>
          <Input name="company" value={form.company} onChange={handleChange} required />
        </div>
        <div>
          <Label>Position *</Label>
          <Input name="position" value={form.position} onChange={handleChange} required />
        </div>
        <div>
          <Label>Location *</Label>
          <Input name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <Label>Experience Required *</Label>
          <Input name="experienceRequired" value={form.experienceRequired} onChange={handleChange} required />
        </div>
        <div>
          <Label>Remote/On-site *</Label>
          <Select value={form.remoteOrOnsite} onValueChange={v => handleSelect("remoteOrOnsite", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {remoteOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date Applied *</Label>
          <Calendar mode="single" selected={form.dateApplied} onSelect={handleDate} className="w-full" />
          <div className="text-xs mt-1">{format(form.dateApplied, "yyyy-MM-dd")}</div>
        </div>
        <div>
          <Label>Application Source *</Label>
          <Input name="applicationSource" value={form.applicationSource} onChange={handleChange} required />
        </div>
        <div>
          <Label>Status *</Label>
          <Select value={form.status} onValueChange={v => handleSelect("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Job Description *</Label>
        <Textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} required rows={3} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? "Adding..." : "Add Application"}</Button>
    </form>
  );
} 