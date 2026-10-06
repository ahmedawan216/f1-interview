import Link from "next/link";

const practiceModes = [
  {
    number: "01",
    title: "Full Mock",
    description: "A complete interview, shaped around your study plans.",
    duration: "ABOUT 5 MIN",
    href: "/app/practice/setup",
    available: true,
  },
  {
    number: "02",
    title: "Quick Practice",
    description: "A few focused questions when you have a spare moment.",
    duration: "COMING SOON",
    href: "#",
    available: false,
  },
  {
    number: "03",
    title: "Hard Questions",
    description: "Spend time with the questions that take more thought.",
    duration: "COMING SOON",
    href: "#",
    available: false,
  },
  {
    number: "04",
    title: "Weak Areas",
    description: "Return to the parts of your story you want to strengthen.",
    duration: "COMING SOON",
    href: "#",
    available: false,
  },
];

export default function PracticePage() {
  return (
    <div className="page-wrap practice-page">
      <section className="practice-hero">
        <div className="practice-heading">
          <p className="eyebrow">YOUR PRACTICE SPACE <span className="eyebrow-dot" /></p>
          <h1>A little practice<br /><em>goes a long way.</em></h1>
          <p className="page-intro">Practice the questions that matter, get comfortable under pressure, and learn what you want to tighten before the real conversation.</p>
          <Link className="button button-dark practice-primary-cta" href="/app/practice/setup">
            <svg className="marker marker-dashboard-cta" viewBox="0 0 150 42" aria-hidden="true"><path d="M5 27 C37 13 79 15 111 23 C127 27 139 25 146 17" /></svg>
            Start a full mock <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="practice-visual" aria-hidden="true">
          <img className="practice-illustration" src="/visuals/World-amico.svg" alt="" />
          <span className="practice-orbit practice-orbit-one" />
          <span className="practice-orbit practice-orbit-two" />
          <span className="practice-visual-index">F-1 / 01</span>
          <div className="practice-preview-card">
            <div className="practice-preview-top">
              <span><i /> LIVE PRACTICE</span>
              <span>04:12</span>
            </div>
            <div className="practice-preview-rule" />
            <p className="practice-preview-label">QUESTION 03</p>
            <p className="practice-preview-question">How will you fund your education?</p>
            <div className="practice-preview-answer">
              <span>YOUR ANSWER</span>
              <strong>My father will cover my tuition and living expenses.</strong>
            </div>
            <div className="practice-preview-followup">
              <span>FOLLOW-UP</span>
              <strong>What does your father do?</strong>
            </div>
            <div className="practice-preview-wave">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
          </div>
          <span className="practice-note">It remembers what you said.</span>
        </div>
      </section>

      <section className="practice-modes-section">
        <div className="practice-section-heading">
          <div className="practice-section-title-wrap">
            <p className="eyebrow">CHOOSE YOUR NEXT STEP</p>
            <h2>Practice with <em>purpose.</em><svg className="marker marker-purpose" viewBox="0 0 160 35" aria-hidden="true"><path d="M5 21 C40 9 80 10 113 18 C132 23 148 20 156 12" /></svg></h2>
          </div>
          <p>Start with the full mock. The focused modes will grow around the things real users need most.</p>
        </div>

        <div className="mode-list">
          {practiceModes.map((mode) => {
            const content = (
              <>
                <span className="mode-number">{mode.number}</span>
                <span className="mode-copy">
                  <span className="mode-title">{mode.title}</span>
                  <span className="mode-description">{mode.description}</span>
                </span>
                <span className={`mode-duration${mode.available ? " available" : ""}`}>{mode.duration}</span>
                <span className="mode-arrow" aria-hidden="true">{mode.available ? "↗" : "—"}</span>
              </>
            );

            return mode.available ? (
              <Link className="mode-card" href={mode.href} key={mode.number}>{content}</Link>
            ) : (
              <div className="mode-card mode-disabled" key={mode.number} aria-disabled="true">{content}</div>
            );
          })}
        </div>

        <div className="practice-footnote">
          <span>✳</span>
          <p>Your answers are yours. Take your time, and speak in your own words.</p>
          <span className="practice-footnote-rule" />
          <span className="practice-footnote-tag">F-1 ONLY · PRACTICE ONLY</span>
        </div>
      </section>
    </div>
  );
}
