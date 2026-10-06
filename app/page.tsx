import Link from "next/link";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

const steps = [
  {
    number: "01",
    title: "Tell us your story",
    text: "A few details about your university, program, background, and funding.",
    href: "/app/practice/setup",
  },
  {
    number: "02",
    title: "Face the questions",
    text: "Practice one focused interview with questions that respond to what you actually say.",
    href: "#proof",
  },
  {
    number: "03",
    title: "Know what to work on",
    text: "Leave with clear feedback on clarity, specificity, and apparent inconsistencies.",
    href: "#report",
  },
];

export default function HomePage() {
  return (
    <main className="landing">
      <div className="landing-atmosphere" aria-hidden="true">
        <span className="atmosphere-shape atmosphere-shape-one" />
        <span className="atmosphere-shape atmosphere-shape-two" />
        <span className="atmosphere-line atmosphere-line-one" />
        <span className="atmosphere-line atmosphere-line-two" />
      </div>

      <header className="marketing-header">
        <Link className="wordmark" href="/" aria-label="F1 Interview home">
          <span className="brand-mark">f.</span>
          <span>F1 Interview</span>
        </Link>
        <nav aria-label="Main navigation" className="marketing-nav">
          <a href="#approach">How it works</a>
          <Link className="header-cta" href="/app/practice/setup">
            Start practicing <Arrow />
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A little more ready</p>
          <h1>Prepare before<br />they <em >ask.</em></h1>
          <p className="hero-description">
            Practice your U.S. F-1 visa interview with an interviewer that
            remembers your answers, asks thoughtful follow-ups, and helps you
            find what needs work before the real conversation.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark hero-button" href="/app/practice/setup">
              Start your free interview <Arrow />
            </Link>
            <span className="hero-note">About 5 minutes<br />No credit card</span>
          </div>
          <p className="hero-meta">F-1 student visa practice <i /> Practice only <i /> Your story, your words</p>
        </div>

        <div className="hero-art" aria-label="Preview of an interview that follows up on an answer">
          <img className="hero-visual hero-visual-globe" src="/visuals/World-amico.svg" alt="" aria-hidden="true" />
          <div className="art-grain" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-index">01 / 03</div>
          <div className="preview-card">
            <div className="preview-topline">
              <span><span className="live-dot" /> F-1 MOCK INTERVIEW</span>
              <span>04:18</span>
            </div>
            <div className="preview-rule" />
            <p className="preview-label">INTERVIEWER</p>
            <p className="preview-question">How will you fund your education?</p>
            <div className="preview-answer">
              <span className="answer-mark">YOU</span>
              <span>My father will cover my tuition and living expenses.</span>
            </div>
            <div className="preview-followup">
              <span className="followup-mark">FOLLOW-UP</span>
              <strong>What does your father do?</strong>
              <span className="followup-line" />
            </div>
            <div className="preview-voice">
              <span className="voice-label">LISTENING</span>
              <div className="voice-wave" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
              <span className="voice-time">00:18</span>
            </div>
          </div>
          <div className="floating-note">
            <span className="note-icon">✳</span>
            <span>It remembers<br />what you said.</span>
          </div>
          <div className="floating-voice">
            <span className="floating-voice-copy">VOICE PRACTICE</span>
            <div className="floating-voice-wave" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </div>
            
          </div>
          <div className="art-caption"><span>THE DIFFERENCE</span> The next question follows your answer.</div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Product principles">
        <span>F-1 ONLY</span>
        <i />
        <span>CONTEXT AWARE</span>
        <i />
        <span>ADAPTIVE FOLLOW-UPS</span>
        <i />
        <span>NO APPROVAL PREDICTIONS</span>
      </section>

      <section className="approach" id="approach">
        <div className="section-intro">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>Practice the conversation,<br /><em >not a memorized script.</em></h2>
          <p>
            The goal is simple: help you explain your actual plans clearly,
            calmly, and consistently when someone asks the unexpected.
          </p>
        </div>

        <div className="step-list">
          {steps.map((step) => (
            <Link className="step" href={step.href} key={step.number}>
              <span className="step-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <span className="step-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="proof-section" id="proof">
        <div className="proof-copy">
          <p className="eyebrow">THE PART THAT MATTERS</p>
          <h2>When your answer changes,<br /><em >the interview notices.</em></h2>
          <p>
            Good preparation is more than knowing common questions. Your
            answers need to make sense together. Practice helps you spot the
            places where your explanation becomes vague or inconsistent.
          </p>
        </div>

        <div className="followup-card">
          <div className="followup-card-top">
            <span>01 / YOUR ANSWER</span>
            <span>FUNDING</span>
          </div>
          <p>“My father is sponsoring my studies and will cover my expenses.”</p>
          <div className="followup-divider"><span>THE INTERVIEWER FOLLOWS UP</span></div>
          <div className="followup-question">
            <span className="mini-orb">f.</span>
            <strong>What does your father do for a living?</strong>
          </div>
          <div className="followup-footer"><span className="tiny-dot" /> Your answer shapes what comes next.</div>
        </div>
      </section>

      <section className="report-section" id="report">
        <div className="report-card">
          <div className="report-top">
            <span>YOUR PRACTICE REPORT</span>
            <span>F-1 · MOCK 01</span>
          </div>
          <div className="report-summary">
            <div>
              <p className="report-kicker">AFTER YOUR INTERVIEW</p>
              <h3>You have a solid foundation.</h3>
              <p>Now focus on making your answers more specific and connected to your study plans.</p>
            </div>
            <span className="report-mark">01</span>
          </div>
          <div className="report-rows">
            <div><span>Clarity</span><b>Strong</b></div>
            <div><span>Specificity</span><b className="review">Practice</b></div>
            <div><span>Consistency</span><b>Strong</b></div>
            <div><span>Communication</span><b>Strong</b></div>
          </div>
        </div>
        <div className="report-copy">
          <p className="eyebrow">AFTER THE PRACTICE</p>
          <h2>Leave knowing<br /><em >what to fix next.</em></h2>
          <p>
            No mysterious score. No prediction about your visa. Just useful
            observations from the conversation you actually had.
          </p>
          <Link className="text-link" href="/app/practice/setup">Try a free interview <Arrow /></Link>
        </div>
      </section>

      <section className="closing">
        <div className="closing-orbit" aria-hidden="true" />
        <p className="eyebrow">BEFORE THE REAL INTERVIEW</p>
        <h2>Make the moment<br /><em className="type-loop type-26">feel a little less unknown.</em></h2>
        <Link className="button button-light" href="/app/practice/setup">
          Start your free interview <Arrow />
        </Link>
        <p>Practice tool · Not legal advice · Not an official U.S. government simulator</p>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <Link className="wordmark" href="/">
            <span className="brand-mark">f.</span>
            <span>F1 Interview</span>
          </Link>
          <p>Practice clearly. Answer honestly. Be ready.</p>
        </div>
        <div className="footer-middle">
          <span className="footer-label">BUILT FOR THE MOMENT BEFORE</span>
          <span>Focused F-1 interview practice for students preparing for the real conversation.</span>
        </div>
        <div className="footer-meta">
          <span>F-1 ONLY</span>
          <span>Practice tool · Not legal advice</span>
          <span>© 2026 F1 Interview</span>
        </div>
      </footer>
    </main>
  );
}
