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

export type InterviewSession = {
  candidateContext: InterviewContext;
  status: InterviewStatus;
  turns: InterviewTurn[];
  startedAt: string;
  updatedAt: string;
};

export type NextInterviewQuestion = {
  question: string;
  isFollowUp: boolean;
  interviewComplete: boolean;
};
