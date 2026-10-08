export default function ProfilePage() {
  return (
    <div className="page-wrap placeholder-page profile-page">
      <div className="placeholder-heading-row">
        <div>
          <p className="eyebrow">YOUR DETAILS</p>
          <h1>A space that’s<br /><em className="marked">yours.<img className="marker-line" src="/art/marker-underline.webp" alt="" aria-hidden="true" /></em></h1>
          <p className="page-intro">Your profile and interview context will live here. For now, everything you need is in your practice setup.</p>
        </div>
        <img className="profile-globe" src="/art/globe.svg" alt="" aria-hidden="true" />
      </div>
      <div className="placeholder-card">
        <img className="placeholder-spark" src="/art/doodle-spark.webp" alt="" aria-hidden="true" />
        <div><span className="mode-title">No account needed.</span><span className="mode-description">Your practice is ready whenever you are.</span></div>
      </div>
    </div>
  );
}
