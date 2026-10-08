export default function ProgressPage() {
  return (
    <div className="page-wrap placeholder-page progress-page">
      <div className="placeholder-heading-row">
        <div>
          <p className="eyebrow">A PLACE TO LOOK BACK</p>
          <h1>Your practice,<br /><em>taking shape.</em></h1>
          <p className="page-intro">After your first interview, you’ll find your practice sessions and reflections here.</p>
        </div>
        <img className="progress-books" src="/art/books.webp" alt="" aria-hidden="true" />
      </div>
      <ol className="growth-path" aria-label="How practice builds">
        <li className="is-now"><span className="growth-node">01</span><strong>First session</strong><span>Where it begins</span></li>
        <li><span className="growth-node">02</span><strong>Clearer answers</strong><span>You’ll see it here</span></li>
        <li><span className="growth-node">03</span><strong>Next practice</strong><span>Pick up where you left off</span></li>
      </ol>
      <div className="placeholder-card">
        <img className="placeholder-spark" src="/art/doodle-spark.webp" alt="" aria-hidden="true" />
        <div><span className="mode-title">Your first session is a good place to start.</span><span className="mode-description">Complete a full mock interview to create your first practice record.</span></div>
      </div>
    </div>
  );
}
