import SetupForm from "@/components/setup-form";

export default function SetupPage() {
  return (
    <div className="page-wrap setup-page">
      <div className="setup-heading">
        <p className="eyebrow">BEFORE WE BEGIN <span>·</span> ABOUT 2 MINUTES</p>
        <h1>Let’s start with<br /><em>your story.</em></h1>
        <p className="page-intro">A little context makes the practice feel more like your interview. Share what you’re comfortable with.</p>
      </div>
      <SetupForm />
    </div>
  );
}
