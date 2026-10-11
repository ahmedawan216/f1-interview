"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isInterviewReport, type InterviewReport, type InterviewSession } from "@/lib/interview-session";
import { loadSavedInterviewById, saveInterview, type SavedInterview } from "@/lib/interview-storage";

function canGenerateReport(session: InterviewSession) {
  return session.status !== "in-progress"
    && session.turns.some((turn) => typeof turn.candidateAnswer === "string" && turn.candidateAnswer.trim())
    && (session.status === "ended" || session.turns.every((turn) => typeof turn.candidateAnswer === "string" && turn.candidateAnswer.trim()));
}

export default function InterviewReportView({ sessionId }: { sessionId: string }) {
  const [saved, setSaved] = useState<SavedInterview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const requestInFlight = useRef(false);
  const report: InterviewReport | null = saved?.session.report ?? null;

  useEffect(() => {
    setSaved(loadSavedInterviewById(sessionId));
  }, [sessionId]);

  useEffect(() => {
    if (!saved || report || !canGenerateReport(saved.session) || requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setError("");

    void (async () => {
      try {
        const response = await fetch("/api/interview/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session: saved.session }),
        });
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          throw new Error("We couldn’t read the report response. Please retry.");
        }
        if (!response.ok) {
          const message = typeof body === "object" && body !== null && "error" in body && typeof body.error === "string"
            ? body.error
            : "We couldn’t generate your report. Please retry.";
          throw new Error(message);
        }
        if (!isInterviewReport(body)) throw new Error("The report was incomplete. Please retry.");

        const updatedSession = { ...saved.session, report: body, updatedAt: new Date().toISOString() };
        const updatedSaved = { ...saved, session: updatedSession };
        saveInterview(updatedSession, saved.elapsedSeconds);
        setSaved(updatedSaved);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "We couldn’t generate your report. Please retry.");
      } finally {
        requestInFlight.current = false;
        setLoading(false);
      }
    })();
  }, [report, retryCount, saved]);

  if (!saved) {
    return (
      <section className="page-wrap report-page">
        <p className="eyebrow">PRACTICE REPORT</p>
        <h1>This report isn’t available in this browser.</h1>
        <p className="page-intro">Saved practice stays on the device and browser where it was created. It may have been cleared or opened somewhere else.</p>
        <Link className="button button-dark report-primary-action" href="/app/practice/setup">Start a new practice <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  if (saved.session.status === "in-progress") {
    return (
      <section className="page-wrap report-page">
        <p className="eyebrow">SESSION NOT COMPLETE</p>
        <h1>Your interview is still in progress.</h1>
        <p className="page-intro">No completed report is available yet. Continue this interview or start a separate practice; this session will remain saved.</p>
        <div className="report-actions">
          <Link className="button button-dark" href="/app/practice/interview">Return to interview <span aria-hidden="true">→</span></Link>
          <Link className="report-text-link" href="/app/practice/setup">Start a new practice</Link>
        </div>
      </section>
    );
  }

  if (!canGenerateReport(saved.session)) {
    return (
      <section className="page-wrap report-page">
        <p className="eyebrow">SESSION ENDED EARLY</p>
        <h1>There isn’t enough interview to review yet.</h1>
        <p className="page-intro">This session ended before a complete answer was saved, so we haven’t created a report or treated it as a completed interview.</p>
        <Link className="button button-dark report-primary-action" href="/app/practice/setup">Start a new practice <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="page-wrap report-page">
        <p className="eyebrow">YOUR PRACTICE REPORT</p>
        <h1>{loading ? "Putting your feedback together." : "Your report is ready to retry."}</h1>
        {loading ? (
          <div className="report-loading" role="status"><span className="report-spinner" /> Reviewing your answers against this practice session…</div>
        ) : (
          <>
            <p className="page-intro" role="alert">{error || "We couldn’t generate your report right now."} Your interview is saved, and you can safely retry.</p>
            <button className="button button-dark report-primary-action" type="button" disabled={requestInFlight.current} onClick={() => setRetryCount((count) => count + 1)}>Retry report <span aria-hidden="true">↻</span></button>
          </>
        )}
        <p className="report-privacy-note">Your answers and setup context are sent to Groq to generate feedback. The report is saved in this browser.</p>
      </section>
    );
  }

  const isPartial = saved.session.status === "ended";
  const answeredTurns = saved.session.turns.filter((turn) => typeof turn.candidateAnswer === "string" && turn.candidateAnswer.trim());
  const followUps = answeredTurns.filter((turn) => turn.isFollowUp);

  return (
    <article className="page-wrap report-page">
      <header className="report-page-heading">
        <div>
          <p className="eyebrow">{isPartial ? "PARTIAL PRACTICE REPORT" : "YOUR PRACTICE REPORT"}</p>
          <h1>What to keep.<br /><em className="marked">What to strengthen.</em></h1>
          <p className="page-intro">Based on the answers you gave in this session. This is educational practice feedback, not legal advice or a prediction about any visa decision.</p>
        </div>
        <Link className="report-text-link" href="/app/practice/setup">Start a new practice <span aria-hidden="true">→</span></Link>
      </header>

      {isPartial && <p className="report-partial-banner">This interview ended early. The observations below are partial and do not represent a completed interview.</p>}

      <section className="report-overview" aria-labelledby="report-overall-heading">
        <p className="eyebrow">OVERALL ASSESSMENT</p>
        <h2 id="report-overall-heading">{report.overallAssessment}</h2>
      </section>

      <section className="report-observations">
        <div>
          <p className="eyebrow">WHAT CAME THROUGH</p>
          <h2>Strengths</h2>
          <ul>{report.strengths.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
        <div>
          <p className="eyebrow">WHAT NEEDS MORE WORK</p>
          <h2>Areas to improve</h2>
          <ul>{report.areasToImprove.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="report-followups">
        <p className="eyebrow">FOLLOW-UP READINESS</p>
        <h2>{report.followUpReadiness.assessment}</h2>
        {followUps.length === 0 ? (
          <p>No follow-up questions were asked in this session, so readiness could not be assessed from follow-up examples.</p>
        ) : report.followUpReadiness.examples.length === 0 ? (
          <p>{report.followUpReadiness.assessment}</p>
        ) : (
          <ul>{report.followUpReadiness.examples.map((item, index) => <li key={index}>{item}</li>)}</ul>
        )}
      </section>

      <section className="report-answer-section">
        <div className="report-section-heading">
          <p className="eyebrow">ANSWER BY ANSWER</p>
          <h2>The conversation, closely.</h2>
        </div>
        {report.answerFeedback.map((item, index) => (
          <article className="answer-feedback" key={`${index}-${item.question}`}>
            <p className="answer-feedback-number">{String(index + 1).padStart(2, "0")}{answeredTurns[index]?.isFollowUp ? " · FOLLOW-UP" : " · QUESTION"}</p>
            <h3>{item.question}</h3>
            <div className="answer-feedback-answer"><span>YOUR ANSWER</span><p>{item.answer}</p></div>
            <div className="answer-feedback-grid">
              <div><h4>What worked</h4><p>{item.whatWorked}</p></div>
              <div><h4>What to improve</h4><p>{item.needsImprovement}</p></div>
            </div>
            <div className="suggested-answer"><h4>A clearer way to express the same facts</h4><p>{item.suggestedAnswer}</p></div>
          </article>
        ))}
      </section>

      <section className="report-next-steps">
        <div>
          <p className="eyebrow">PRACTICE PRIORITIES</p>
          <h2>Three useful next moves.</h2>
          <ol>{report.practicePriorities.map((item, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
        </div>
        <div className="report-recommendation">
          <p className="eyebrow">YOUR NEXT EXERCISE</p>
          <h2>Try this next.</h2>
          <p>{report.nextPracticeRecommendation}</p>
          <Link className="button button-dark" href="/app/practice/setup">Start another practice <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <footer className="report-disclaimer">Practice feedback only · Not legal advice · Not an official U.S. government service · Saved in this browser</footer>
    </article>
  );
}