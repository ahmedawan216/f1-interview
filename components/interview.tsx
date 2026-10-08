"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const questions = [
  "Good morning. What is the purpose of your trip to the United States?",
  "Why did you choose this particular university?",
  "What interests you most about your program of study?",
  "How do you plan to fund your education?",
  "What are your plans after you complete your studies?",
  "How does this program connect to your previous education?",
];

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function Interview() {
  const [elapsed, setElapsed] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (ended) return;
    const interval = window.setInterval(() => setElapsed((time) => time + 1), 1000);
    return () => window.clearInterval(interval);
  }, [ended]);

  function submitAnswer() {
    if (!answer.trim() || thinking) return;
    setThinking(true);
    window.setTimeout(() => {
      if (questionIndex === questions.length - 1) {
        setEnded(true);
        setThinking(false);
        return;
      }
      setQuestionIndex(questionIndex + 1);
      setAnswer("");
      setThinking(false);
    }, 1300);
  }

  if (ended) {
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
          <span>{String(questionIndex + 1).padStart(2, "0")} <i>/</i> {String(questions.length).padStart(2, "0")}</span>
        </div>
        <div className="interview-progress-track"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>

        <div className="interviewer">
          <div className={`interviewer-orb${thinking ? " is-thinking" : ""}`}>
            <span className="orb-inner">f.</span>
            <span className="orb-ring" />
          </div>
          <div className="interviewer-state"><span className={`state-dot${thinking ? " thinking" : ""}`} />{thinking ? "Taking a moment" : "Your interviewer"}</div>
        </div>

        <div className="question-block" aria-live="polite">
          <p className="eyebrow">{thinking ? "ONE MOMENT" : "QUESTION"} <span>·</span> {String(questionIndex + 1).padStart(2, "0")}</p>
          <h1 key={questionIndex}>{thinking ? "Thank you. Let me think about that." : questions[questionIndex]}</h1>
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
        <textarea id="response" className="response-area" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Gather your thoughts here, or answer out loud…" disabled={thinking} />
        <div className="interview-actions">
          <button className="end-interview" type="button" onClick={() => setEnded(true)}>End interview <span aria-hidden="true">↗</span></button>
          <button className="button button-dark submit-answer" type="button" disabled={!answer.trim() || thinking} onClick={submitAnswer}>{thinking ? "One moment…" : "Submit response"} <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <footer className="interview-footer"><span>There’s no perfect answer. Just your answer.</span><span>PRACTICE ONLY · NOT LEGAL ADVICE</span></footer>
    </section>
  );
}
