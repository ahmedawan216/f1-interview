"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { InterviewContext } from "@/lib/interview-session";
import {
  SETUP_CONTEXT_KEY,
  START_NEW_SESSION_KEY,
  loadSetupAcknowledgment,
  loadSetupDraft,
  saveSetupAcknowledgment,
  saveSetupDraft,
} from "@/lib/interview-storage";
export type { InterviewContext } from "@/lib/interview-session";

const EMPTY_CONTEXT: InterviewContext = {
  university: "",
  program: "",
  degree: "",
  startTerm: "",
  previousEducation: "",
  whyProgram: "",
  fundingMethod: "",
  primarySponsor: "",
  currentOccupation: "",
  previousTravel: "",
  anythingImportant: "",
};

export default function SetupForm() {
  const router = useRouter();
  const [context, setContext] = useState<InterviewContext>(EMPTY_CONTEXT);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [draftSaveFailed, setDraftSaveFailed] = useState(false);
  // False in the server HTML and until React has hydrated. If scripts never load, this stays false.
  const [ready, setReady] = useState(false);
  const contextRef = useRef(EMPTY_CONTEXT);
  const userEditedRef = useRef(false);

  useEffect(() => {
    setReady(true);
    // Do not let late draft restoration overwrite anything the user typed during hydration.
    if (userEditedRef.current) return;
    const savedDraft = loadSetupDraft();
    const restoredContext = savedDraft ? { ...EMPTY_CONTEXT, ...savedDraft } : EMPTY_CONTEXT;
    contextRef.current = restoredContext;
    setContext(restoredContext);
    setAcknowledged(loadSetupAcknowledgment());
  }, []);

  function updateField(field: keyof InterviewContext, value: string) {
    userEditedRef.current = true;
    const updatedContext = { ...contextRef.current, [field]: value };
    contextRef.current = updatedContext;
    setContext(updatedContext);
    setDraftSaveFailed(!saveSetupDraft(updatedContext));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.sessionStorage.setItem(SETUP_CONTEXT_KEY, JSON.stringify(contextRef.current));
      window.sessionStorage.setItem(START_NEW_SESSION_KEY, "true");
      router.push("/app/practice/interview");
    } catch {
      setError("We couldn’t save your answers in this browser. Please check your browser storage settings and try again.");
    }
  }

  return (
    <form className="setup-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-heading"><span>01</span><div><h2>Your study plans</h2><p>The details behind your next chapter.</p></div></div>
        <div className="form-grid">
          <label className="form-field full-field"><span>University <b>*</b></span><input name="university" value={context.university} onChange={(event) => updateField("university", event.currentTarget.value)} placeholder="Where will you be studying?" required /></label>
          <label className="form-field"><span>Program of study <b>*</b></span><input name="program" value={context.program} onChange={(event) => updateField("program", event.currentTarget.value)} placeholder="e.g. Environmental Engineering" required /></label>
          <label className="form-field"><span>Degree <b>*</b></span>
            <select name="degree" value={context.degree} onChange={(event) => updateField("degree", event.currentTarget.value)} required>
              <option value="" disabled>Select a degree</option>
              <option>Bachelor’s</option><option>Master’s</option><option>Doctorate / PhD</option><option>Associate’s</option><option>Other</option>
            </select>
          </label>
          <label className="form-field"><span>Start term <b>*</b></span>
            <select name="startTerm" value={context.startTerm} onChange={(event) => updateField("startTerm", event.currentTarget.value)} required>
              <option value="" disabled>Select a term</option>
              <option>Fall</option><option>Spring</option><option>Summer</option><option>Winter</option>
            </select>
          </label>
          <label className="form-field"><span>Previous education <b>*</b></span><input name="previousEducation" value={context.previousEducation} onChange={(event) => updateField("previousEducation", event.currentTarget.value)} placeholder="Your most recent qualification" required /></label>
          <label className="form-field full-field"><span>Why this program? <b>*</b></span><textarea name="whyProgram" value={context.whyProgram} onChange={(event) => updateField("whyProgram", event.currentTarget.value)} placeholder="What drew you to this course of study?" rows={3} required /></label>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading"><span>02</span><div><h2>Funding your studies</h2><p>There’s no one right answer — just your situation.</p></div></div>
        <div className="form-grid">
          <label className="form-field"><span>Funding method <b>*</b></span>
            <select name="fundingMethod" value={context.fundingMethod} onChange={(event) => updateField("fundingMethod", event.currentTarget.value)} required>
              <option value="" disabled>Select a funding source</option>
              <option>Personal or family savings</option><option>Scholarship or grant</option><option>Education loan</option><option>University funding</option><option>A combination of sources</option><option>Other</option>
            </select>
          </label>
          <label className="form-field"><span>Primary sponsor <b>*</b></span><input name="primarySponsor" value={context.primarySponsor} onChange={(event) => updateField("primarySponsor", event.currentTarget.value)} placeholder="Who is supporting your studies?" required /></label>
        </div>
      </div>

      <details className="optional-section">
        <summary><span>03</span><span className="optional-title">A little more about you</span><span className="optional-hint">OPTIONAL <b>+</b></span></summary>
        <div className="form-grid optional-grid">
          <label className="form-field"><span>Current occupation</span><input name="currentOccupation" value={context.currentOccupation} onChange={(event) => updateField("currentOccupation", event.currentTarget.value)} placeholder="What do you do currently?" /></label>
          <label className="form-field"><span>Previous U.S. travel</span><input name="previousTravel" value={context.previousTravel} onChange={(event) => updateField("previousTravel", event.currentTarget.value)} placeholder="Have you visited the U.S. before?" /></label>
          <label className="form-field full-field"><span>Anything else important?</span><textarea name="anythingImportant" value={context.anythingImportant} onChange={(event) => updateField("anythingImportant", event.currentTarget.value)} placeholder="Anything you’d like your interviewer to know?" rows={3} /></label>
        </div>
      </details>

      <p className="setup-before-note">Before you begin: Take a moment to gather your thoughts about your university, study plans, previous education, and how you&apos;ll fund your studies. Your answers will help personalize your practice interview.</p>
      <div className="form-submit-row">
        <p className="setup-privacy-note">Practice only; not legal advice or a government service. Your setup, answers, and reports are saved in this browser, and interview content is also sent to Groq to generate questions and feedback. Avoid entering account numbers or other highly sensitive details; clear saved data from Profile.</p>
        <label className="setup-data-acknowledgment"><input type="checkbox" required checked={acknowledged} onInvalid={() => setError("Please acknowledge how your practice data is stored and processed before continuing.")} onChange={(event) => { const next = event.currentTarget.checked; setAcknowledged(next); setError(""); if (!saveSetupAcknowledgment(next)) setDraftSaveFailed(true); }} /><span>I understand this practice text is saved in my browser and sent to Groq for generation.</span></label>
        <button className="button button-dark" type="submit" disabled={!ready}>Continue to your interview <span aria-hidden="true">→</span></button>
      </div>
      {!ready && <p className="form-error setup-js-warning" role="status">This page’s scripts haven’t loaded, so your answers aren’t being saved and Continue is turned off. Reload the page; if this keeps happening, try another browser or turn off extensions that block scripts.</p>}
      {draftSaveFailed && <p className="form-error" role="alert">Your browser could not save this draft. Keep this tab open and check your browser storage settings before refreshing.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
