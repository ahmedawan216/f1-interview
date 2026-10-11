import InterviewReportView from "@/components/interview-report";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterviewReportView sessionId={id} />;
}
