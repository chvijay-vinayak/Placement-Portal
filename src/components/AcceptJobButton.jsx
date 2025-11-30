import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const isPlacementOfficer = (user) => {
  const r = String(user?.role ?? '').toLowerCase().trim();
  return ['officer', 'placement officer', 'placement-officer', 'placement_officer'].includes(r);
};

export default function AcceptJobButton({ jobId, job, onAccepted, initialAccepted = false }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(
    initialAccepted || Boolean(job?.status === 'accepted' || job?.isAccepted || job?.acceptedBy)
  );

  useEffect(() => {
    setAccepted(initialAccepted || Boolean(job?.status === 'accepted' || job?.isAccepted || job?.acceptedBy));
  }, [job, initialAccepted]);

  // only visible to placement officer (robust check)
  if (!isPlacementOfficer(user)) return null;

  const acceptJob = async () => {
    if (accepted) {
      toast('Job already accepted');
      return;
    }

    setLoading(true);
    try {
      // backend endpoint (adjust if your API differs)
      const res = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedBy: user.id ?? user.username }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to accept job');
      }

      const updated = await res.json();
      setAccepted(true);
      toast.success('Job accepted');
      onAccepted?.(updated);
    } catch (err) {
      // optimistic fallback so UI works without a server
      const optimistic = { ...(job ?? {}), id: jobId, status: 'accepted', acceptedBy: user.id ?? user.username };
      setAccepted(true);
      toast.success('Job accepted (local)');
      onAccepted?.(optimistic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={acceptJob}
      disabled={loading || accepted}
      className="btn-accept"
      variant="default"
      size="sm"
    >
      {loading ? 'Accepting...' : accepted ? 'Accepted' : 'Accept'}
    </Button>
  );
}