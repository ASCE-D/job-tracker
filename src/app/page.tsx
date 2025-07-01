"use client";
import { useEffect, useState } from "react";
import JobApplicationsTable from "../components/job-applications-table";

export default function Home() {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch("/api/job-applications");
    const data = await res.json();
    setJobApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-black text-foreground p-6 sm:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Job Applications</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : (
        <JobApplicationsTable jobs={jobApplications} onChange={fetchJobs} />
      )}
    </main>
  );
}
