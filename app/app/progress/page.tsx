export default function ProgressPage() {
  return (
    <div className="page-wrap placeholder-page progress-page">
      <div className="placeholder-heading-row">
        <div>
          <p className="eyebrow">A PLACE TO LOOK BACK</p>
          <h1>Your practice,<br /><em>taking shape.</em></h1>
          <p className="page-intro">After your first interview, you’ll find your practice sessions and reflections here.</p>
        </div>
        <div className="placeholder-art progress-art" aria-hidden="true">
          <img src="/visuals/6885305.jpg" alt="" />
          <span>ONE SESSION<br />AT A TIME.</span>
        </div>
      </div>
      <div className="placeholder-card">
        <span className="placeholder-spark">01</span>
        <div><span className="mode-title">Your first session is a good place to start.</span><span className="mode-description">Complete a full mock interview to create your first practice record.</span></div>
      </div>
    </div>
  );
}
