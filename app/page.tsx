import Link from "next/link";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function HomePage() {
  return (
    <main className="landing">
      <header className="marketing-header">
        <Link className="wordmark" href="/" aria-label="F1 Interview home">
          <span className="brand-mark">f.</span>
          <span>F1 Interview</span>
        </Link>
        <nav aria-label="Main navigation" className="marketing-nav">
          <a href="#approach">Our approach</a>
          <Link className="header-cta" href="/app/practice/setup">
            Start practicing <Arrow />
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> A little more ready</p>
          <h1>Prepare before<br />they <em>ask.</em></h1>
          <p className="hero-description">
            A thoughtful space to practice your F-1 visa interview. Work through
            realistic questions, follow-ups that respond to your answers, and
            the parts of your story that deserve a little more attention.
          </p>
          <Link className="button button-dark hero-button" href="/app/practice/setup">
            Start your free interview <span aria-hidden="true">→</span>
          </Link>
          <p className="hero-meta">F-1 student visa practice <i /> ~5 minutes <i /> No credit card</p>
        </div>

        <div className="hero-art" aria-label="Preview of a practice interview">
          <div className="art-grain" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="preview-card">
            <div className="preview-topline">
              <span><span className="live-dot" /> PRACTICE SESSION</span>
              <span>01 — 08</span>
            </div>
            <div className="preview-rule" />
            <p className="preview-label">YOUR INTERVIEWER</p>
            <p className="preview-question">Why did you choose this particular program?</p>
            <div className="preview-bottom">
              <span className="waveform" aria-hidden="true">
                {[16, 28, 19, 34, 24, 40, 23, 31, 17, 27, 13, 22, 31, 17, 26, 12, 20].map((height, index) => (
                  <i key={index} style={{ height: `${height}px` }} />
                ))}
              </span>
              <span>Take a moment. There’s no rush.</span>
            </div>
          </div>
          <div className="art-caption"><span>01</span> A practice that feels like the real thing.</div>
          <div className="floating-note"><span className="note-icon">✳</span><span>Built around<br />your story</span></div>
        </div>
      </section>

      <section className="approach" id="approach">
        <p className="approach-kicker">A steadier kind of preparation</p>
        <div className="approach-copy">
          <h2>Not a script to memorize.<br /><em>A story you can stand behind.</em></h2>
          <p>
            Your answers should sound like you. Practice the questions that
            matter, find your footing, and walk in feeling more prepared —
            not more rehearsed.
          </p>
        </div>
        <div className="approach-detail">
          <span>01 / 03</span>
          <span className="detail-line" />
          <span>YOUR PRACTICE, AT YOUR PACE</span>
        </div>
      </section>

      <footer className="landing-footer">
        <Link className="wordmark" href="/">
          <span className="brand-mark">f.</span>
          <span>F1 Interview</span>
        </Link>
        <p>This is a practice tool, not legal advice and not an official U.S. government simulator.</p>
        <span className="footer-year">Made for the moment before.</span>
      </footer>
    </main>
  );
}
