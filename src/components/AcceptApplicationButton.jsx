import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const isPlacementOfficer = (user) => {
  const r = String(user?.role ?? '').toLowerCase().trim();
  return ['officer', 'placement officer', 'placement-officer', 'placement_officer'].includes(r);
};

export default function AcceptApplicationButton({ applicationId, application, onUpdated }) {
  const { user } = useAuth();
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const accepted = application?.status === 'accepted' || application?.status === 'hired';
  const rejected = application?.status === 'rejected';

  if (!isPlacementOfficer(user)) return null;

  const acceptApplication = async () => {
    if (accepted) {
      toast('Application already accepted');
      return;
    }

    setLoadingAccept(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedBy: user.id ?? user.username }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to accept application');
      }

      const updated = await res.json();
      toast.success('Application accepted');
      onUpdated?.(updated);
    } catch (err) {
      // optimistic fallback
      const optimistic = { ...(application ?? {}), id: applicationId, status: 'accepted', acceptedBy: user.id ?? user.username };
      toast.success('Application accepted (local)');
      onUpdated?.(optimistic);
    } finally {
      setLoadingAccept(false);
    }
  };

  const rejectApplication = async () => {
    if (rejected) {
      toast('Application already rejected');
      return;
    }

    setLoadingReject(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedBy: user.id ?? user.username }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to reject application');
      }

      const updated = await res.json();
      toast('Application rejected');
      onUpdated?.(updated);
    } catch (err) {
      // optimistic fallback
      const optimistic = { ...(application ?? {}), id: applicationId, status: 'rejected', rejectedBy: user.id ?? user.username };
      toast('Application rejected (local)');
      onUpdated?.(optimistic);
    } finally {
      setLoadingReject(false);
    }
  };

  // if already accepted or rejected show badge
  if (accepted) {
    return (
      <Button disabled className="btn-accept" size="sm">
        Accepted
      </Button>
    );
  }

  if (rejected) {
    return (
      <Button disabled className="btn-reject" size="sm">
        Rejected
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={acceptApplication} disabled={loadingAccept} className="btn-accept" size="sm">
        {loadingAccept ? 'Accepting...' : 'Accept'}
      </Button>
      <Button onClick={rejectApplication} disabled={loadingReject} className="btn-reject !bg-red-600 !text-white px-3 py-1 rounded-md hover:!bg-red-700" size="sm">
        {loadingReject ? 'Rejecting...' : 'Reject'}
      </Button>
    </div>
  );
}
