"use client";

import { useState } from "react";
import { clearAllPracticeData } from "@/lib/interview-storage";

export default function ClearPracticeData() {
  const [state, setState] = useState<"idle" | "confirm" | "cleared">("idle");

  return (
    <div className="placeholder-card clear-data-card">
      <div>
        <span className="mode-title">Clear saved practice</span>
        <span className="mode-description">
          {state === "cleared"
            ? "Done. Your setup details, answers, and reports have been removed from this browser."
            : "Your setup details, answers, and reports are saved in this browser. Remove them any time."}
        </span>
      </div>
      {state === "idle" && (
        <button className="button clear-data-button" type="button" onClick={() => setState("confirm")}>Clear data</button>
      )}
      {state === "confirm" && (
        <button
          className="button clear-data-button is-confirm"
          type="button"
          onClick={() => {
            clearAllPracticeData();
            setState("cleared");
          }}
        >
          Yes, clear it
        </button>
      )}
    </div>
  );
}
