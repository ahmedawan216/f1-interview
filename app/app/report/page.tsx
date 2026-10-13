"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSavedInterviews, type SavedInterview } from "@/lib/interview-storage";

export default function LatestReportPage() {
  const [latest, setLatest] = useState<SavedInterview | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reports = loadSavedInterviews().filter(
      ({ session }) => session.status !== "in-progress" && session.report !== null,
    );
    setLatest(reports[0] ?? null);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <section className="page-wrap report-page" aria-busy="true"><p className="eyebrow">YOUR PRACTICE REPORT</p><h1>Finding your latest report…</h1></section>;
  }

  if (!latest) {
    return (
      <section className="page-wrap report-page">
        <p className="eyebrow">YOUR PRACTICE REPORT</p>
        <h1>Your next step starts with a practice.</h1>
        <p className="page-intro">When you finish an interview and its report is ready, you’ll find it here. Reports are saved only in this browser.</p>
        <Link className="button button-dark report-primary-action" href="/app/practice/setup">Start a practice <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  return (
    <section className="page-wrap report-page">
      <p className="eyebrow">MOST RECENT REPORT</p>
      <h1>Your last practice,<br /><em className="marked">ready to revisit.</em></h1>
      <p className="page-intro">Review the feedback from your latest completed practice session. Reports stay in this browser until you clear your practice data.</p>
      <div className="recent-practice-list">
        <Link className="recent-practice-item" href={`/app/practice/results/${encodeURIComponent(latest.session.id)}`}>
          <span className="recent-practice-date">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(latest.session.startedAt))}</span>
          <span className="recent-practice-copy">
            <strong>{latest.session.candidateContext.university || "F-1 practice"}</strong>
            <span>{latest.session.status === "completed" ? "Completed interview" : "Partial interview"} · {latest.session.turns.filter((turn) => turn.candidateAnswer?.trim()).length} answers</span>
          </span>
          <span className="recent-practice-link">Open report <span aria-hidden="true">→</span></span>
        </Link>
      </div>
      <p className="report-privacy-note">This report is stored on this device and browser. It is educational practice feedback, not legal advice or a prediction of any visa decision.</p>
    </section>
  );
}
