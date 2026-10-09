"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { InterviewContext } from "@/lib/interview-session";
export type { InterviewContext } from "@/lib/interview-session";

export default function SetupForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const context = Object.fromEntries(formData.entries()) as InterviewContext;
    try {
      window.sessionStorage.setItem("f1-interview-context", JSON.stringify(context));
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
          <label className="form-field full-field"><span>University <b>*</b></span><input name="university" placeholder="Where will you be studying?" required /></label>
          <label className="form-field"><span>Program of study <b>*</b></span><input name="program" placeholder="e.g. Environmental Engineering" required /></label>
          <label className="form-field"><span>Degree <b>*</b></span>
            <select name="degree" defaultValue="" required>
              <option value="" disabled>Select a degree</option>
              <option>Bachelor’s</option><option>Master’s</option><option>Doctorate / PhD</option><option>Associate’s</option><option>Other</option>
            </select>
          </label>
          <label className="form-field"><span>Start term <b>*</b></span>
            <select name="startTerm" defaultValue="" required>
              <option value="" disabled>Select a term</option>
              <option>Fall</option><option>Spring</option><option>Summer</option><option>Winter</option>
            </select>
          </label>
          <label className="form-field"><span>Previous education <b>*</b></span><input name="previousEducation" placeholder="Your most recent qualification" required /></label>
          <label className="form-field full-field"><span>Why this program? <b>*</b></span><textarea name="whyProgram" placeholder="What drew you to this course of study?" rows={3} required /></label>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading"><span>02</span><div><h2>Funding your studies</h2><p>There’s no one right answer — just your situation.</p></div></div>
        <div className="form-grid">
          <label className="form-field"><span>Funding method <b>*</b></span>
            <select name="fundingMethod" defaultValue="" required>
              <option value="" disabled>Select a funding source</option>
              <option>Personal or family savings</option><option>Scholarship or grant</option><option>Education loan</option><option>University funding</option><option>A combination of sources</option><option>Other</option>
            </select>
          </label>
          <label className="form-field"><span>Primary sponsor <b>*</b></span><input name="primarySponsor" placeholder="Who is supporting your studies?" required /></label>
        </div>
      </div>

      <details className="optional-section">
        <summary><span>03</span><span className="optional-title">A little more about you</span><span className="optional-hint">OPTIONAL <b>+</b></span></summary>
        <div className="form-grid optional-grid">
          <label className="form-field"><span>Current occupation</span><input name="currentOccupation" placeholder="What do you do currently?" /></label>
          <label className="form-field"><span>Previous U.S. travel</span><input name="previousTravel" placeholder="Have you visited the U.S. before?" /></label>
          <label className="form-field full-field"><span>Anything else important?</span><textarea name="anythingImportant" placeholder="Anything you’d like your interviewer to know?" rows={3} /></label>
        </div>
      </details>

      <div className="form-submit-row">
        <p><img src="/art/doodle-spark.webp" alt="" aria-hidden="true" /> Your information stays in this browser for this practice session.</p>
        <button className="button button-dark" type="submit">Continue to your interview <span aria-hidden="true">→</span></button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
