import {
  MAX_INTERVIEW_TURNS,
  isInterviewContext,
  isInterviewReport,
  isInterviewTurn,
  isRecord,
  type InterviewContext,
  type InterviewSession,
} from "@/lib/interview-session";

// Bump when the stored shape changes; the previous single-session shape is migrated below.
const STORAGE_VERSION = 2;
const PREVIOUS_STORAGE_VERSION = 1;
export const SAVED_SESSION_KEY = "f1-interview-saved-session";
// Written by the setup form and read once to start a brand-new session.
export const SETUP_CONTEXT_KEY = "f1-interview-context";
export const START_NEW_SESSION_KEY = "f1-interview-start-new-session";
export const SETUP_DRAFT_KEY = "f1-interview-setup-draft";
export const SETUP_ACKNOWLEDGMENT_KEY = "f1-interview-setup-acknowledged";
const SETUP_DRAFT_VERSION = 1;
const SETUP_DRAFT_FIELDS: Array<keyof InterviewContext> = [
  "university",
  "program",
  "degree",
  "startTerm",
  "previousEducation",
  "whyProgram",
  "fundingMethod",
  "primarySponsor",
  "currentOccupation",
  "previousTravel",
  "anythingImportant",
];

const MAX_ELAPSED_SECONDS = 24 * 60 * 60;

export type SavedInterview = {
  session: InterviewSession;
  elapsedSeconds: number;
};

function isSavedInterview(value: unknown): value is SavedInterview {
  return isRecord(value)
    && isRestorableSession(value.session)
    && typeof value.elapsedSeconds === "number"
    && Number.isFinite(value.elapsedSeconds)
    && value.elapsedSeconds >= 0;
}

function migrateLegacySavedInterview(value: unknown): SavedInterview | null {
  if (!isRecord(value) || !isRecord(value.session)) return null;
  const legacySession = { ...value.session, id: "legacy", report: null };
  if (!isRestorableSession(legacySession)
    || typeof value.elapsedSeconds !== "number"
    || !Number.isFinite(value.elapsedSeconds)
    || value.elapsedSeconds < 0) return null;
  return {
    session: { ...legacySession, id: createInterviewId() },
    elapsedSeconds: Math.min(Math.floor(value.elapsedSeconds), MAX_ELAPSED_SECONDS),
  };
}

export function loadSetupDraft(): Partial<InterviewContext> | null {
  try {
    const raw = window.localStorage.getItem(SETUP_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== SETUP_DRAFT_VERSION || !isRecord(parsed.values)) {
      window.localStorage.removeItem(SETUP_DRAFT_KEY);
      return null;
    }

    const draft: Partial<InterviewContext> = {};
    for (const field of SETUP_DRAFT_FIELDS) {
      if (typeof parsed.values[field] === "string") {
        draft[field] = parsed.values[field];
      }
    }
    return draft;
  } catch {
    // Do not delete a user's draft when storage access itself fails.
    return null;
  }
}

export function saveSetupDraft(values: InterviewContext): boolean {
  try {
    window.localStorage.setItem(
      SETUP_DRAFT_KEY,
      JSON.stringify({ version: SETUP_DRAFT_VERSION, values }),
    );
    return true;
  } catch {
    // Report failure to the UI instead of silently implying the draft was saved.
    return false;
  }
}

export function loadSetupAcknowledgment(): boolean {
  try {
    return window.localStorage.getItem(SETUP_ACKNOWLEDGMENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveSetupAcknowledgment(acknowledged: boolean): boolean {
  try {
    window.localStorage.setItem(SETUP_ACKNOWLEDGMENT_KEY, String(acknowledged));
    return true;
  } catch {
    return false;
  }
}

export function clearSetupDraft() {
  try {
    window.localStorage.removeItem(SETUP_DRAFT_KEY);
    window.localStorage.removeItem(SETUP_ACKNOWLEDGMENT_KEY);
  } catch {
    // Storage unavailable.
  }
}

export function clearSetupContext() {
  try {
    window.sessionStorage.removeItem(SETUP_CONTEXT_KEY);
  } catch {
    // Storage unavailable.
  }
}

export function clearStartNewSessionFlag() {
  try {
    window.sessionStorage.removeItem(START_NEW_SESSION_KEY);
  } catch {
    // Storage unavailable.
  }
}

export function consumeStartNewSessionFlag() {
  try {
    const shouldStartNewSession = window.sessionStorage.getItem(START_NEW_SESSION_KEY) === "true";
    clearStartNewSessionFlag();
    return shouldStartNewSession;
  } catch {
    return false;
  }
}

function isValidDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function isRestorableSession(value: unknown): value is InterviewSession {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || !value.id) return false;
  if (!isInterviewContext(value.candidateContext)) return false;
  if (value.status !== "in-progress" && value.status !== "completed" && value.status !== "ended") return false;
  if (typeof value.startedAt !== "string" || !isValidDate(value.startedAt)) return false;
  if (typeof value.updatedAt !== "string" || !isValidDate(value.updatedAt)) return false;
  const turns: unknown = value.turns;
  if (!Array.isArray(turns) || turns.length > MAX_INTERVIEW_TURNS) return false;
  if (!turns.every(isInterviewTurn)) return false;
  if (value.report !== null && !isInterviewReport(value.report)) return false;
  // Only the most recent question can still be waiting for an answer.
  return turns.every((turn, index) => turn.candidateAnswer !== null || index === turns.length - 1);
}

export function loadSavedInterview(): SavedInterview | null {
  const saved = loadSavedInterviews();
  return saved.find(({ session }) => session.status === "in-progress") ?? saved[0] ?? null;
}

export function loadSavedInterviewById(id: string): SavedInterview | null {
  return loadSavedInterviews().find(({ session }) => session.id === id) ?? null;
}

export function loadSavedInterviews(): SavedInterview[] {
  try {
    const raw = window.localStorage.getItem(SAVED_SESSION_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      // Unreadable, invalid or outdated: drop it so it cannot linger or be mistaken for a live session.
      window.localStorage.removeItem(SAVED_SESSION_KEY);
      return [];
    }
    if (parsed.version === PREVIOUS_STORAGE_VERSION) {
      const migrated = migrateLegacySavedInterview(parsed);
      if (!migrated) {
        window.localStorage.removeItem(SAVED_SESSION_KEY);
        return [];
      }
      saveInterviews([migrated]);
      return [migrated];
    }
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.sessions)) {
      window.localStorage.removeItem(SAVED_SESSION_KEY);
      return [];
    }
    return parsed.sessions
      .filter(isSavedInterview)
      .map((saved) => ({
        ...saved,
        elapsedSeconds: Math.min(Math.floor(saved.elapsedSeconds), MAX_ELAPSED_SECONDS),
      }))
      .sort((first, second) => Date.parse(second.session.updatedAt) - Date.parse(first.session.updatedAt));
  } catch {
    try {
      window.localStorage.removeItem(SAVED_SESSION_KEY);
    } catch {
      // Storage unavailable; nothing more to do.
    }
    return [];
  }
}

export function createInterviewId() {
  return globalThis.crypto.randomUUID();
}

function saveInterviews(sessions: SavedInterview[]) {
  try {
    window.localStorage.setItem(
      SAVED_SESSION_KEY,
      JSON.stringify({ version: STORAGE_VERSION, sessions }),
    );
  } catch {
    // Storage full or blocked; the interview remains usable for this visit.
  }
}

export function saveInterview(session: InterviewSession, elapsedSeconds: number) {
  const saved = loadSavedInterviews();
  const updated = { session, elapsedSeconds: Math.max(0, Math.floor(elapsedSeconds)) };
  saveInterviews([updated, ...saved.filter((item) => item.session.id !== session.id)]);
}

export function clearSavedSession() {
  try {
    window.localStorage.removeItem(SAVED_SESSION_KEY);
  } catch {
    // Storage unavailable.
  }
}

export function clearAllPracticeData() {
  clearSavedSession();
  clearSetupDraft();
  clearSetupContext();
  clearStartNewSessionFlag();
}
