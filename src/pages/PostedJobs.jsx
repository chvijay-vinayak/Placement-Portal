import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AcceptJobButton from '@/components/AcceptJobButton';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PostedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/jobs'); // adjust endpoint
        if (!res.ok) throw new Error('Failed to load jobs');
        const data = await res.json();
        if (mounted) setJobs(data);
      } catch (err) {
        toast.error(err?.message || 'Could not load jobs');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Accept handler: replace by id or _id (supports different backend shapes)
  const handleAccepted = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => {
        const jid = j.id ?? j._id;
        const uid = updatedJob.id ?? updatedJob._id;
        if (jid === uid) return { ...j, ...updatedJob };
        return j;
      })
    );
  };

  // debug logs to help verify why accept button may not appear
  useEffect(() => {
    console.log('PostedJobs mounted/updated - user:', user);
  }, [user]);

  useEffect(() => {
    console.log('PostedJobs jobs:', jobs);
  }, [jobs]);

  if (loading) return <div className="p-6">Loading jobs…</div>;
  if (!jobs.length) return <div className="p-6">No jobs posted yet.</div>;

  return (
    <div className="p-6 grid gap-4">
      <div className="col-span-full text-sm text-muted-foreground mb-2">
        Logged in: {user ? `${user.username} (${user.role})` : 'not logged in'} — Jobs: {jobs.length}
      </div>
      {jobs.map((job) => {
        // normalize different backend shapes
        const isAccepted =
          job.status === 'accepted' || job.isAccepted === true || Boolean(job.acceptedBy) || job.status === 'taken';

        // only placement officer (role "officer") may accept
        const canAccept = Boolean(user && user.role === 'officer');

        return (
          <Card key={job.id ?? job._id} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{job.title ?? job.jobTitle ?? 'Untitled'}</h3>
              <p className="text-sm text-muted-foreground">{job.company ?? job.employer ?? ''}</p>
              <p className="text-sm">{job.status ?? (isAccepted ? 'accepted' : 'open')}</p>
            </div>
            <div>
              {isAccepted ? (
                <div className="text-sm text-success">Accepted</div>
              ) : canAccept ? (
                <AcceptJobButton
                  jobId={job.id ?? job._id}
                  job={job}
                  initialAccepted={isAccepted}
                  onAccepted={handleAccepted}
                />
              ) : user ? (
                <div className="text-sm text-muted-foreground">Only placement officers can accept</div>
              ) : (
                <div className="text-sm text-muted-foreground">Login as placement officer to accept</div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}