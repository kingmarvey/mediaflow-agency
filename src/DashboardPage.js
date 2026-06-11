import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const STYLES = `
  .dash-page { min-height: 100vh; background: #0A0A0C; display: flex; flex-direction: column; }

  .dash-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,10,12,.94); border-bottom: 1px solid #1E1E24;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    padding: 0 32px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .dash-logo { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #F8F8F2; letter-spacing: -.3px; }
  .dash-logo span { color: #E05C27; }
  .dash-header-right { display: flex; align-items: center; gap: 16px; }
  .dash-user-email { font-size: 13px; font-weight: 400; color: #6A6A76; }
  .dash-signout-btn {
    padding: 7px 16px; background: transparent; border: 1px solid #2A2A34;
    color: #8A8A96; font-size: 13px; font-weight: 500; transition: all .2s;
  }
  .dash-signout-btn:hover { border-color: #E05C27; color: #F8F8F2; }

  .dash-body { flex: 1; max-width: 1100px; width: 100%; margin: 0 auto; padding: 52px 28px; }

  .dash-brand-tag {
    display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px;
    background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.2);
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: #E05C27; margin-bottom: 20px;
  }
  .dash-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #E05C27; }
  .dash-welcome-h { font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 800; color: #F8F8F2; letter-spacing: -.8px; margin-bottom: 8px; }
  .dash-welcome-sub { font-size: 14px; font-weight: 400; color: #8A8A96; line-height: 1.7; margin-bottom: 44px; max-width: 480px; }

  .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 44px; }
  .dash-stat-card { background: #111116; border: 1px solid #1E1E24; padding: 24px 22px; }
  .dash-stat-label { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #4A4A55; margin-bottom: 10px; }
  .dash-stat-val { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: #F8F8F2; line-height: 1; margin-bottom: 4px; }
  .dash-stat-val.accent { color: #E05C27; }
  .dash-stat-sub { font-size: 12px; font-weight: 400; color: #6A6A76; }

  .dash-section-title { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #6A6A76; margin-bottom: 14px; }

  .dash-services-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
  .dash-service-pill {
    padding: 6px 14px; border: 1px solid rgba(224,92,39,.22);
    background: rgba(224,92,39,.06); font-size: 12px; font-weight: 500;
    color: #E05C27; border-radius: 100px;
  }

  .dash-coming {
    border: 1px dashed #2A2A34; padding: 44px 32px; display: flex; align-items: center;
    justify-content: center; flex-direction: column; gap: 10px; text-align: center;
  }
  .dash-coming-icon { font-size: 32px; margin-bottom: 4px; }
  .dash-coming-h { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #F8F8F2; }
  .dash-coming-p { font-size: 13px; font-weight: 400; color: #6A6A76; max-width: 360px; line-height: 1.7; }

  @media (max-width: 640px) {
    .dash-stats { grid-template-columns: 1fr 1fr; }
    .dash-header { padding: 0 16px; }
    .dash-user-email { display: none; }
  }
`;

export default function DashboardPage({ navigate, user }) {
  const brand = JSON.parse(localStorage.getItem("mf_brand") || "{}");
  const displayName = brand.brandName || user?.displayName || "there";
  const email = user?.email || brand.email || "";
  const services = brand.services || [];
  const industry = brand.industry || "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } finally {
      localStorage.removeItem("mf_brand");
      navigate("home");
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="dash-page">
        <header className="dash-header">
          <span className="dash-logo">MEDIA<span>FLOW</span></span>
          <div className="dash-header-right">
            <span className="dash-user-email">{email}</span>
            <button className="dash-signout-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </header>

        <div className="dash-body">
          <div className="dash-brand-tag">
            <span className="dash-tag-dot" /> Account Active
          </div>
          <h1 className="dash-welcome-h">Welcome, {displayName}.</h1>
          <p className="dash-welcome-sub">
            Your MediaFlow account is set up. Your dedicated team will be in touch within 24 hours to kick things off.
          </p>

          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-label">Services</div>
              <div className="dash-stat-val">{services.length}</div>
              <div className="dash-stat-sub">Active services</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Status</div>
              <div className="dash-stat-val accent" style={{ fontSize: 18, paddingTop: 6 }}>Active</div>
              <div className="dash-stat-sub">Onboarding in progress</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-label">Industry</div>
              <div className="dash-stat-val" style={{ fontSize: 16, paddingTop: 6 }}>{industry || "—"}</div>
              <div className="dash-stat-sub">Your sector</div>
            </div>
          </div>

          {services.length > 0 && (
            <>
              <p className="dash-section-title">Your selected services</p>
              <div className="dash-services-row">
                {services.map(s => <span key={s} className="dash-service-pill">{s}</span>)}
              </div>
            </>
          )}

          <div className="dash-coming">
            <div className="dash-coming-icon">🚀</div>
            <h2 className="dash-coming-h">Full dashboard coming soon</h2>
            <p className="dash-coming-p">
              Analytics, content calendar, campaign reports, team communication, and more — all in one place.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
