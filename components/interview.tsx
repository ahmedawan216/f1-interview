"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MAX_INTERVIEW_TURNS,
  type InterviewContext,
  type InterviewSession,
  type InterviewTurn,
  type NextInterviewQuestion,
} from "@/lib/interview-session";

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function Interview() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");

  async function requestNextQuestion(currentSession: InterviewSession) {
    setThinking(true);
    setError("");

    try {
      const response = await fetch("/api/interview/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: currentSession }),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error("The interviewer returned an invalid response. Please try again.");
      }
      if (!response.ok) {
        const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
          ? result.error
          : "The interviewer could not respond. Please try again.";
        throw new Error(message);
      }
      if (
        typeof result !== "object"
        || result === null
        || !("question" in result)
        || typeof result.question !== "string"
        || !("isFollowUp" in result)
        || typeof result.isFollowUp !== "boolean"
        || !("interviewComplete" in result)
        || typeof result.interviewComplete !== "boolean"
        || (!result.interviewComplete && !result.question.trim())
      ) {
        throw new Error("The interviewer returned an invalid response. Please try again.");
      }

      const next = result as NextInterviewQuestion;
      const updatedAt = new Date().toISOString();
      setSession((current) => {
        if (!current || current.status !== "in-progress" || current.updatedAt !== currentSession.updatedAt) return current;
        if (next.interviewComplete) {
          return { ...current, status: "completed", updatedAt };
        }
        const turn: InterviewTurn = {
          interviewerQuestion: next.question,
          candidateAnswer: null,
          isFollowUp: next.isFollowUp,
          askedAt: updatedAt,
        };
        return { ...current, turns: [...current.turns, turn], updatedAt };
      });
      setAnswer("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The interviewer could not respond. Please try again.");
    } finally {
      setThinking(false);
    }
  }

  useEffect(() => {
    const storedContext = window.sessionStorage.getItem("f1-interview-context");
    if (!storedContext) {
      router.replace("/app/practice/setup");
      return;
    }

    try {
      const candidateContext = JSON.parse(storedContext) as InterviewContext;
      const startedAt = new Date().toISOString();
      const initialSession: InterviewSession = {
        candidateContext,
        status: "in-progress",
        turns: [],
        startedAt,
        updatedAt: startedAt,
      };
      setSession(initialSession);
      void requestNextQuestion(initialSession);
    } catch {
      router.replace("/app/practice/setup");
    }
  }, [router]);

  useEffect(() => {
    if (session?.status !== "in-progress") return;
    const interval = window.setInterval(() => setElapsed((time) => time + 1), 1000);
    return () => window.clearInterval(interval);
  }, [session?.status]);

  function submitAnswer() {
    if (!answer.trim() || thinking || !session) return;
    const answeredAt = new Date().toISOString();
    const answeredSession: InterviewSession = {
      ...session,
      updatedAt: answeredAt,
      turns: session.turns.map((turn, index) =>
        index === session.turns.length - 1
          ? { ...turn, candidateAnswer: answer.trim(), answeredAt }
          : turn
      ),
    };
    setSession(answeredSession);
    void requestNextQuestion(answeredSession);
  }

  if (!session) return null;

  const questionIndex = session.turns.length - 1;
  const currentTurn = session.turns[questionIndex];

  if (session.status !== "in-progress") {
    return (
      <section className="interview-screen interview-finished">
        <Link className="wordmark interview-brand" href="/app/practice"><span className="brand-mark">f.</span><span>F1 Interview</span></Link>
        <div className="finished-card">
          <img className="finished-plane" src="/art/plane.svg" alt="" aria-hidden="true" />
          <p className="eyebrow">SESSION COMPLETE</p>
          <h1>You showed up.<br /><em className="marked">That’s a good start.<img className="marker-line" src="/art/marker-underline.webp" alt="" aria-hidden="true" /></em></h1>
          <p className="page-intro">You spent {formatTime(elapsed)} practicing. Take a moment to notice what felt clear — and what you’d like to explore next.</p>
          <Link className="button button-dark" href="/app/practice">Back to your practice <span aria-hidden="true">→</span></Link>
        </div>
        <p className="interview-disclaimer">Practice only · Not legal advice · Not an official U.S. government simulator</p>
      </section>
    );
  }

  return (
    <section className="interview-screen">
      <header className="interview-header">
        <Link className="wordmark interview-brand" href="/app/practice"><span className="brand-mark">f.</span><span>F1 Interview</span></Link>
        <div className="interview-session-label"><span className="live-dot" /> F-1 MOCK INTERVIEW</div>
        <div className="interview-timer"><span className="timer-dot" /> {formatTime(elapsed)}</div>
      </header>

      <div className="interview-body">
        <div className="interview-progress">
          <span>YOUR INTERVIEW</span>
          <span>{String(Math.max(session.turns.length, 1)).padStart(2, "0")} <i>/</i> {String(MAX_INTERVIEW_TURNS).padStart(2, "0")}</span>
        </div>
        <div className="interview-progress-track"><span style={{ width: `${(session.turns.length / MAX_INTERVIEW_TURNS) * 100}%` }} /></div>

        <div className="interviewer">
          <div className={`interviewer-orb${thinking ? " is-thinking" : ""}`}>
            <span className="orb-inner">f.</span>
            <span className="orb-ring" />
          </div>
          <div className="interviewer-state"><span className={`state-dot${thinking ? " thinking" : ""}`} />{thinking ? "Taking a moment" : "Your interviewer"}</div>
        </div>

        <div className="question-block" aria-live="polite">
          <p className="eyebrow">{thinking ? "ONE MOMENT" : "QUESTION"} <span>·</span> {String(Math.max(session.turns.length, 1)).padStart(2, "0")}</p>
          <h1 key={questionIndex}>{thinking ? "Thank you. Let me think about that." : currentTurn?.interviewerQuestion ?? "The interviewer is unavailable right now."}</h1>
        </div>

        <div className={`listening-card${thinking ? " processing" : ""}`}>
          <div className="listening-indicator">
            <img className="listening-mic" src="/art/mic.svg" alt="" aria-hidden="true" />
            <span>{thinking ? "Reflecting on your response" : "Listening to your response"}</span>
          </div>
          <div className="listening-wave" aria-hidden="true">
            {[12, 20, 14, 28, 16, 32, 22, 36, 18, 27, 14, 22, 31, 16, 25, 12, 19, 30, 16, 24, 12, 18, 29, 14, 21, 12, 26, 16, 31, 18, 23, 12, 20, 28, 14, 22, 12].map((height, index) => (
              <i key={index} style={{ height: `${height}px`, animationDelay: `${index * 35}ms` }} />
            ))}
          </div>
        </div>

        <label className="response-label" htmlFor="response">YOUR RESPONSE <span>· TAKE YOUR TIME</span></label>
        <textarea id="response" className="response-area" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Gather your thoughts here, or answer out loud…" disabled={thinking || !currentTurn} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="interview-actions">
          <button className="end-interview" type="button" onClick={() => setSession((current) => current ? { ...current, status: "ended", updatedAt: new Date().toISOString() } : current)}>End interview <span aria-hidden="true">↗</span></button>
          {error && currentTurn?.candidateAnswer !== null ? (
            <button className="button button-dark submit-answer" type="button" disabled={thinking} onClick={() => void requestNextQuestion(session)}>Retry question <span aria-hidden="true">→</span></button>
          ) : (
            <button className="button button-dark submit-answer" type="button" disabled={!answer.trim() || thinking || !currentTurn} onClick={submitAnswer}>{thinking ? "One moment…" : "Submit response"} <span aria-hidden="true">→</span></button>
          )}
        </div>
      </div>
      <footer className="interview-footer"><span>There’s no perfect answer. Just your answer.</span><span>PRACTICE ONLY · NOT LEGAL ADVICE</span></footer>
    </section>
  );
}
