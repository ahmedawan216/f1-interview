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
      <div className="page-heading">
        <p className="eyebrow">YOUR PRACTICE SPACE</p>
        <h1>A little practice<br /><em>goes a long way.</em></h1>
        <p className="page-intro">Choose a place to begin. You can take it one question at a time.</p>
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
      <p className="practice-footnote"><span>✳</span> Your answers are yours. Take your time, and speak in your own words.</p>
    </div>
  );
}
