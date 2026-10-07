export default function ProfilePage() {
  return (
    <div className="page-wrap placeholder-page profile-page">
      <div className="placeholder-heading-row">
        <div>
          <p className="eyebrow">YOUR DETAILS</p>
          <h1>A space that’s<br /><em>yours.</em></h1>
          <p className="page-intro">Your profile and interview context will live here. For now, everything you need is in your practice setup.</p>
        </div>
        <div className="placeholder-art profile-art" aria-hidden="true">
          <img src="/visuals/World-amico.svg" alt="" />
          <span>YOUR CONTEXT<br />MATTERS.</span>
        </div>
      </div>
      <div className="placeholder-card">
        <span className="placeholder-spark">✳</span>
        <div><span className="mode-title">No account needed.</span><span className="mode-description">Your practice is ready whenever you are.</span></div>
      </div>
    </div>
  );
}
