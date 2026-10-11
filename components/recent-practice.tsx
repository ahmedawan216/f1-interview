"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSavedInterviews, type SavedInterview } from "@/lib/interview-storage";

export default function RecentPractice() {
  const [sessions, setSessions] = useState<SavedInterview[]>([]);

  useEffect(() => {
    setSessions(loadSavedInterviews().filter(({ session }) => session.status !== "in-progress" && session.turns.length > 0));
  }, []);

  if (sessions.length === 0) return null;

  return (
    <section className="recent-practice" aria-labelledby="recent-practice-heading">
      <div className="practice-section-heading">
        <div className="practice-section-title-wrap">
          <p className="eyebrow">SAVED ON THIS DEVICE</p>
          <h2 id="recent-practice-heading">Recent practice.</h2>
        </div>
        <p>Reports stay in this browser until you clear your practice data.</p>
      </div>
      <div className="recent-practice-list">
        {sessions.map(({ session }) => (
          <Link className="recent-practice-item" href={`/app/practice/results/${encodeURIComponent(session.id)}`} key={session.id}>
            <span className="recent-practice-date">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(session.startedAt))}</span>
            <span className="recent-practice-copy">
              <strong>{session.candidateContext.university || "F-1 practice"}</strong>
              <span>{session.status === "completed" ? "Completed interview" : "Partial interview"} · {session.turns.length} {session.turns.length === 1 ? "answer" : "answers"}</span>
            </span>
            <span className="recent-practice-link">Open report <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
