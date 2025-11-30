import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type Props = {
  jobId: string | number;
  job?: any;
  onAccepted?: (job: any) => void;
  initialAccepted?: boolean;
};

export default function AcceptJobButton({
  jobId,
  job,
  onAccepted,
  initialAccepted = false,
}: Props) {
  const { user } = useAuth?.() ?? { user: null };
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(initialAccepted);

  // only render button if user exists and role is 'officer'
  if (!user || user.role !== "officer") return null;

  const acceptJob = async () => {
    if (accepted) {
      toast("Job already accepted");
      return;
    }

    setLoading(true);
    try {
      // try server endpoint first (adjust as needed)
      const res = await fetch(`/api/jobs/${jobId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptedBy: user.id ?? user.username }),
      });

      if (res.ok) {
        const updated = await res.json();
        setAccepted(true);
        toast.success("Job accepted");
        onAccepted?.(updated);
        return;
      }

      // server returned non-ok -> throw to go to optimistic fallback
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Server rejected accept");
    } catch (err: any) {
      // optimistic fallback (works when backend is not implemented)
      const optimistic = {
        ...(job ?? {}),
        id: jobId,
        status: "accepted",
        acceptedBy: user.id ?? user.username,
      };
      setAccepted(true);
      onAccepted?.(optimistic);
      toast.success("Job accepted (local)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={acceptJob} disabled={loading || accepted} variant="outline" size="sm">
      {loading ? "Accepting..." : accepted ? "Accepted" : "Accept"}
    </Button>
  );
}