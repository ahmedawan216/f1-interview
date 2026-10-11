import { NextResponse } from "next/server";
import {
  MAX_INTERVIEW_TURNS,
  isInterviewContext,
  isInterviewTurn,
  isRecord,
  type InterviewReport,
  type InterviewSession,
} from "@/lib/interview-session";

function isReportSession(value: unknown): value is InterviewSession {
  if (!isRecord(value) || !Array.isArray(value.turns)) return false;
  const turns = value.turns;
  return isRecord(value)
    && typeof value.id === "string"
    && value.id.length > 0
    && isInterviewContext(value.candidateContext)
    && (value.status === "completed" || value.status === "ended")
    && turns.length > 0
    && turns.length <= MAX_INTERVIEW_TURNS
    && turns.every((turn, index) => isInterviewTurn(turn)
      && (typeof turn.candidateAnswer === "string"
        ? turn.candidateAnswer.trim().length > 0 && turn.candidateAnswer.length <= 5000
        : value.status === "ended" && index === turns.length - 1))
    && turns.some((turn) => typeof turn.candidateAnswer === "string" && turn.candidateAnswer.trim().length > 0)
    && typeof value.startedAt === "string"
    && typeof value.updatedAt === "string";
}

function isTextList(value: unknown, minimum: number, maximum: number): value is string[] {
  return Array.isArray(value)
    && value.length >= minimum
    && value.length <= maximum
    && value.every((item) => typeof item === "string" && item.trim().length > 0 && item.length <= 700);
}

function isGeneratedReport(value: unknown, expectedFeedbackCount: number): value is InterviewReport {
  if (!isRecord(value) || typeof value.overallAssessment !== "string" || !value.overallAssessment.trim()
    || value.overallAssessment.length > 1200
    || !isTextList(value.strengths, 1, 5)
    || !isTextList(value.areasToImprove, 1, 5)
    || !Array.isArray(value.answerFeedback)
    || value.answerFeedback.length !== expectedFeedbackCount
    || !value.answerFeedback.every((item) => isRecord(item)
      && typeof item.whatWorked === "string" && item.whatWorked.trim().length > 0 && item.whatWorked.length <= 700
      && typeof item.needsImprovement === "string" && item.needsImprovement.trim().length > 0 && item.needsImprovement.length <= 700
      && typeof item.suggestedAnswer === "string" && item.suggestedAnswer.trim().length > 0 && item.suggestedAnswer.length <= 1200)
    || !isRecord(value.followUpReadiness)
    || typeof value.followUpReadiness.assessment !== "string"
    || !value.followUpReadiness.assessment.trim()
    || value.followUpReadiness.assessment.length > 700
    || !isTextList(value.followUpReadiness.examples, 0, 3)
    || !isTextList(value.practicePriorities, 3, 3)
    || typeof value.nextPracticeRecommendation !== "string"
    || !value.nextPracticeRecommendation.trim()
    || value.nextPracticeRecommendation.length > 1200) return false;
  return true;
}

const systemPrompt = `You are an educational communication coach reviewing an F-1 visa interview practice session. Return only a JSON object with exactly these fields: {"overallAssessment":"...","strengths":["..."],"areasToImprove":["..."],"answerFeedback":[{"whatWorked":"...","needsImprovement":"...","suggestedAnswer":"..."}],"followUpReadiness":{"assessment":"...","examples":["..."]},"practicePriorities":["...","...","..."],"nextPracticeRecommendation":"..."}.
Give specific, supportive, honest feedback grounded only in the supplied candidate context and actual answers. Do not predict visa approval, provide legal advice, pretend to represent a government service, or invent personal facts, circumstances, or evidence. In suggestedAnswer, preserve the user's stated facts and uncertainty; improve clarity only. Never recommend lying, concealing relevant facts, or fabricating documents. Distinguish absent details from contradictions: only call something inconsistent when the supplied answers actually conflict, otherwise describe what information was missing. Focus strengths and improvement points on evidence in the session. Return exactly one feedback object per turn, in order. For partial interviews, clearly state that this is partial feedback and limit conclusions accordingly. If no follow-up questions occurred, say readiness could not be assessed and return an empty examples array. Include three concrete priorities and one focused next exercise.`;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 100_000) {
    return NextResponse.json({ error: "This interview is too large to review. Please shorten your answers and try again." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "We could not read this interview. Please try again." }, { status: 400 });
  }

  if (!isRecord(body) || !isReportSession(body.session)) {
    return NextResponse.json({ error: "A finished interview with at least one complete answer is required." }, { status: 400 });
  }
  const session = body.session;
  const answeredTurns = session.turns.filter((turn) => typeof turn.candidateAnswer === "string" && turn.candidateAnswer.trim());

  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    console.error("GROQ_API_KEY is not configured.");
    return NextResponse.json({ error: "Your report is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  let providerResponse: Response;
  try {
    providerResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.2,
        max_tokens: 5000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              completionStatus: session.status,
              candidateContext: session.candidateContext,
              turns: answeredTurns,
            }),
          },
        ],
      }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    console.error("Groq report request failed before receiving a response.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "We couldn’t generate your report right now. Please try again." }, { status: 502 });
  }

  if (!providerResponse.ok) {
    console.error("Groq report request returned an unsuccessful response.", { status: providerResponse.status });
    return NextResponse.json({ error: "We couldn’t generate your report right now. Please try again." }, { status: 502 });
  }

  let providerBody: unknown;
  try {
    providerBody = await providerResponse.json();
  } catch {
    console.error("Groq report response was not valid JSON.");
    return NextResponse.json({ error: "The report service returned an invalid response. Please retry." }, { status: 502 });
  }

  const content = isRecord(providerBody)
    && Array.isArray(providerBody.choices)
    && isRecord(providerBody.choices[0])
    && isRecord(providerBody.choices[0].message)
    ? providerBody.choices[0].message.content
    : null;
  let generated: unknown;
  try {
    generated = typeof content === "string" ? JSON.parse(content) : null;
  } catch {
    generated = null;
  }

  if (!isGeneratedReport(generated, answeredTurns.length)) {
    console.error("Groq report response did not match the required format.");
    return NextResponse.json({ error: "The report service returned an incomplete response. Please retry." }, { status: 502 });
  }

  const followUpExamples = answeredTurns
    .filter((turn) => turn.isFollowUp)
    .slice(0, 3)
    .map((turn) => `Question: ${turn.interviewerQuestion}\nAnswer: ${turn.candidateAnswer}`);

  return NextResponse.json({
    ...generated,
    followUpReadiness: {
      ...generated.followUpReadiness,
      assessment: followUpExamples.length > 0
        ? generated.followUpReadiness.assessment
        : "No follow-up questions were asked, so readiness could not be assessed from this session.",
      examples: followUpExamples,
    },
    answerFeedback: generated.answerFeedback.map((feedback, index) => ({
      ...feedback,
      question: answeredTurns[index].interviewerQuestion,
      answer: answeredTurns[index].candidateAnswer ?? "",
    })),
  } satisfies InterviewReport);
}