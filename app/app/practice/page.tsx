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
          <h1>A little practice<br /><em className="marked">goes a long way.<img className="marker-line" src="/art/marker-underline.webp" alt="" aria-hidden="true" /></em></h1>
          <p className="page-intro">Practice the questions that matter, get comfortable under pressure, and learn what you want to tighten before the real conversation.</p>
          <Link className="button button-dark practice-primary-cta" href="/app/practice/setup">
            Start a full mock <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="practice-visual" aria-hidden="true">
          <div className="practice-stage"><span className="practice-orbit practice-orbit-one" /><span className="practice-orbit practice-orbit-two" /></div>
          <div className="practice-preview-card">
            <div className="practice-preview-top">
              <span><i /> LIVE PRACTICE</span>
              <span>04:12</span>
            </div>
            <div className="practice-preview-rule" />
            <p className="practice-preview-label">QUESTION 03</p>
            <p className="practice-preview-question">How will you fund your education?</p>
            <div className="practice-preview-wave">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
          </div>
          <img className="practice-student" src="/art/student.svg" alt="" />
          <img className="practice-mic" src="/art/mic.svg" alt="" />
        </div>
      </section>

      <section className="practice-modes-section">
        <div className="practice-section-heading">
          <div className="practice-section-title-wrap">
            <p className="eyebrow">CHOOSE YOUR NEXT STEP</p>
            <h2>Practice with <em className="marked">purpose.</em><img className="marker-line" src="/art/marker-wave.webp" alt="" aria-hidden="true" /></h2>
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
