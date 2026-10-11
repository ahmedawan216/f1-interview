export type InterviewContext = {
  university: string;
  program: string;
  degree: string;
  startTerm: string;
  previousEducation: string;
  whyProgram: string;
  fundingMethod: string;
  primarySponsor: string;
  currentOccupation: string;
  previousTravel: string;
  anythingImportant: string;
};

export type InterviewStatus = "in-progress" | "completed" | "ended";

export const MAX_INTERVIEW_TURNS = 8;

export type InterviewTurn = {
  interviewerQuestion: string;
  candidateAnswer: string | null;
  isFollowUp: boolean;
  askedAt: string;
  answeredAt?: string;
};

export type AnswerFeedback = {
  question: string;
  answer: string;
  whatWorked: string;
  needsImprovement: string;
  suggestedAnswer: string;
};

export type InterviewReport = {
  overallAssessment: string;
  strengths: string[];
  areasToImprove: string[];
  answerFeedback: AnswerFeedback[];
  followUpReadiness: {
    assessment: string;
    examples: string[];
  };
  practicePriorities: [string, string, string];
  nextPracticeRecommendation: string;
};

export type InterviewSession = {
  id: string;
  candidateContext: InterviewContext;
  status: InterviewStatus;
  turns: InterviewTurn[];
  report: InterviewReport | null;
  startedAt: string;
  updatedAt: string;
};

export type NextInterviewQuestion = {
  question: string;
  isFollowUp: boolean;
  interviewComplete: boolean;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isInterviewContext(value: unknown): value is InterviewContext {
  return isRecord(value)
    && ["university", "program", "degree", "startTerm", "previousEducation", "whyProgram", "fundingMethod", "primarySponsor", "currentOccupation", "previousTravel", "anythingImportant"]
      .every((key) => typeof value[key] === "string");
}

export function isInterviewTurn(value: unknown): value is InterviewTurn {
  return isRecord(value)
    && typeof value.interviewerQuestion === "string"
    && (typeof value.candidateAnswer === "string" || value.candidateAnswer === null)
    && typeof value.isFollowUp === "boolean"
    && typeof value.askedAt === "string"
    && (value.answeredAt === undefined || typeof value.answeredAt === "string");
}

export function isInterviewReport(value: unknown): value is InterviewReport {
  return isRecord(value)
    && typeof value.overallAssessment === "string"
    && Array.isArray(value.strengths)
    && value.strengths.every((item) => typeof item === "string")
    && Array.isArray(value.areasToImprove)
    && value.areasToImprove.every((item) => typeof item === "string")
    && Array.isArray(value.answerFeedback)
    && value.answerFeedback.every((item) => isRecord(item)
      && typeof item.question === "string"
      && typeof item.answer === "string"
      && typeof item.whatWorked === "string"
      && typeof item.needsImprovement === "string"
      && typeof item.suggestedAnswer === "string")
    && isRecord(value.followUpReadiness)
    && typeof value.followUpReadiness.assessment === "string"
    && Array.isArray(value.followUpReadiness.examples)
    && value.followUpReadiness.examples.every((item) => typeof item === "string")
    && Array.isArray(value.practicePriorities)
    && value.practicePriorities.length === 3
    && value.practicePriorities.every((item) => typeof item === "string")
    && typeof value.nextPracticeRecommendation === "string";
}
