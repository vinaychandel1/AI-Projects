"use client";

import { useState, useEffect } from "react";

interface Job {
  id: string;
  title: string;
  company: { name: string };
  locationRaw: string | null;
  remoteType: string | null;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleIngest = async () => {
    setLoading(true);
    await fetch("/api/jobs/ingest", { method: "POST" });
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Board</h1>
        <button
          onClick={handleIngest}
          className="px-4 py-2 bg-black text-white rounded font-medium"
        >
          Ingest Mock Jobs
        </button>
      </div>

      {loading ? (
        <div>Loading jobs...</div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 border rounded shadow-sm bg-white">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-gray-600">{job.company.name}</p>
              <div className="text-sm text-gray-500 mt-2">
                {job.locationRaw} • {job.remoteType}
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p>No jobs found. Click "Ingest Mock Jobs" to start.</p>}
        </div>
      )}
    </div>
  );
}
