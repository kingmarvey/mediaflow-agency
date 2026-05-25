import { useState } from "react";

const STYLES = `
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 60px 20px; position: relative; overflow: hidden;
  }
  .auth-glow {
    position: absolute; top: -300px; right: -300px; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(224,92,39,.07) 0%, transparent 68%); pointer-events: none;
  }
  .signup-card {
    position: relative; z-index: 1; width: 100%; max-width: 520px;
    background: #111116; border: 1px solid #1E1E24; padding: 44px 44px;
  }
  .auth-logo {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: #F8F8F2; margin-bottom: 28px; display: block;
  }
  .auth-logo span { color: #E05C27; }

  /* Progress */
  .progress-bar { display: flex; align-items: center; gap: 0; margin-bottom: 32px; }
  .progress-step {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%; font-size: 12px; font-weight: 700;
    border: 2px solid #2A2A34; color: #6A6A76; transition: all .3s; flex-shrink: 0;
  }
  .progress-step.active { border-color: #E05C27; background: #E05C27; color: #F8F8F2; }
  .progress-step.done { border-color: #E05C27; background: rgba(224,92,39,.15); color: #E05C27; }
  .progress-line { flex: 1; height: 2px; background: #2A2A34; transition: background .3s; }
  .progress-line.done { background: #E05C27; }

  .step-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #F8F8F2; margin-bottom: 6px; letter-spacing: -.4px; }
  .step-sub { font-size: 13px; font-weight: 400; color: #8A8A96; margin-bottom: 24px; }

  /* Google btn */
  .google-btn {
    width: 100%; padding: 12px 20px; background: #fff; color: #1F1F1F;
    font-size: 14px; font-weight: 500; border: 1px solid #E0E0E0;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, box-shadow .2s; margin-bottom: 20px;
  }
  .google-btn:hover { background: #F8F8F8; box-shadow: 0 2px 8px rgba(0,0,0,.12); }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .auth-divider-line { flex: 1; height: 1px; background: #1E1E24; }
  .auth-divider-text { font-size: 11px; font-weight: 500; color: #6A6A76; letter-spacing: .08em; text-transform: uppercase; }

  /* Form */
  .signup-form { display: flex; flex-direction: column; gap: 14px; }
  .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .auth-group { display: flex; flex-direction: column; gap: 6px; }
  .auth-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; }
  .auth-input {
    width: 100%; padding: 11px 14px; background: #0A0A0C; border: 1px solid #2A2A34;
    color: #F8F8F2; font-size: 14px; font-weight: 400; outline: none; transition: border-color .2s;
    -webkit-appearance: none; appearance: none;
  }
  .auth-input::placeholder { color: #3A3A44; }
  .auth-input:focus { border-color: #E05C27; }
  .auth-select {
    width: 100%; padding: 11px 14px; background: #0A0A0C; border: 1px solid #2A2A34;
    color: #F8F8F2; font-size: 14px; font-weight: 400; outline: none; transition: border-color .2s;
    -webkit-appearance: none; appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8A96' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; padding-right: 38px;
  }
  .auth-select:focus { border-color: #E05C27; }
  .auth-select option { background: #111116; }

  /* Service pills */
  .pills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .pill {
    padding: 7px 14px; border: 1px solid #2A2A34; background: transparent;
    font-size: 13px; font-weight: 500; color: #8A8A96; border-radius: 100px;
    transition: all .2s; cursor: pointer;
  }
  .pill:hover { border-color: #E05C27; color: #F8F8F2; }
  .pill.selected { border-color: #E05C27; background: rgba(224,92,39,.12); color: #E05C27; }

  /* T&C */
  .tc-label {
    display: flex; align-items: flex-start; gap: 12px; cursor: pointer;
    font-size: 13px; font-weight: 400; color: #8A8A96; line-height: 1.6;
  }
  .tc-checkbox {
    width: 18px; height: 18px; border: 2px solid #2A2A34; background: transparent;
    flex-shrink: 0; cursor: pointer; accent-color: #E05C27; margin-top: 1px;
  }
  .tc-label a { color: #E05C27; font-weight: 500; }
  .tc-label a:hover { text-decoration: underline; }

  /* Password */
  .auth-input-wrap { position: relative; }
  .auth-input-wrap .auth-input { padding-right: 44px; }
  .eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: #6A6A76; font-size: 15px; padding: 2px; transition: color .2s;
  }
  .eye-btn:hover { color: #F8F8F2; }
  .pass-rules { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
  .pass-rule { font-size: 11px; font-weight: 400; color: #6A6A76; display: flex; align-items: center; gap: 6px; }
  .pass-rule.met { color: #E05C27; }
  .pass-rule::before { content: '○'; font-size: 9px; }
  .pass-rule.met::before { content: '●'; }

  /* Buttons */
  .auth-btn {
    width: 100%; padding: 13px; background: #E05C27; color: #F8F8F2;
    font-size: 14px; font-weight: 600; border: none; transition: background .2s; margin-top: 6px;
  }
  .auth-btn:hover { background: #F0723A; }
  .auth-btn:disabled { background: #2A2A34; color: #6A6A76; cursor: not-allowed; }

  .auth-back-link { font-size: 13px; font-weight: 500; color: #6A6A76; cursor: pointer; margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; transition: color .2s; }
  .auth-back-link:hover { color: #F8F8F2; }
  .auth-footer-text { font-size: 12px; font-weight: 400; color: #6A6A76; text-align: center; margin-top: 20px; }
  .auth-footer-text a { color: #E05C27; font-weight: 500; cursor: pointer; }
  .auth-footer-text a:hover { text-decoration: underline; }

  /* Success screen */
  .success-screen { text-align: center; padding: 16px 0; }
  .success-icon {
    width: 64px; height: 64px; background: rgba(224,92,39,.12); border: 1px solid rgba(224,92,39,.3);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin: 0 auto 24px;
  }
  .success-h { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #F8F8F2; margin-bottom: 10px; }
  .success-p { font-size: 14px; font-weight: 400; color: #8A8A96; line-height: 1.7; max-width: 320px; margin: 0 auto 28px; }
  .success-email-highlight { color: #E05C27; font-weight: 600; }

  .back-btn {
    position: fixed; top: 24px; left: 28px; z-index: 10;
    background: transparent; border: 1px solid #2A2A34; color: #8A8A96;
    padding: 8px 16px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;
    transition: all .2s;
  }
  .back-btn:hover { border-color: #E05C27; color: #F8F8F2; }

  @media (max-width: 560px) {
    .signup-card { padding: 32px 24px; }
    .form-row-2 { grid-template-columns: 1fr; }
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ALL_SERVICES = [
  "Social Media Management", "Video Production", "Graphic Design",
  "Photography", "Content Strategy", "Copywriting",
  "Analytics & Reporting", "Brand Audit",
];

const INDUSTRIES = [
  "Fashion & Apparel", "Food & Beverage", "Technology", "Fintech",
  "Real Estate", "Health & Wellness", "Hospitality", "E-commerce",
  "Entertainment", "Education", "Professional Services", "Other",
];

export default function SignupPage({ navigate }) {
  const [step, setStep] = useState(1);
  const [isGoogle, setIsGoogle] = useState(false);

  // Step 1 — brand info
  const [brand, setBrand] = useState({
    brandName: "", industry: "", adminName: "", email: "", website: "",
  });

  // Step 2 — services
  const [selectedServices, setSelectedServices] = useState([]);

  // Step 3 — agreement
  const [agreed, setAgreed] = useState(false);

  // Step 4 — password
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const setB = k => e => setBrand(f => ({ ...f, [k]: e.target.value }));
  const toggleService = s => setSelectedServices(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const step1Valid = brand.brandName.trim() && brand.industry && brand.adminName.trim() && brand.email.trim();
  const step2Valid = selectedServices.length > 0;
  const passRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passValid = Object.values(passRules).every(Boolean) && password === confirmPass;

  const handleGoogle = () => {
    setIsGoogle(true);
    setBrand(f => ({ ...f, adminName: "Your Name", email: "you@gmail.com", brandName: "Your Brand" }));
    setStep(2);
  };

  const handleStep3Submit = () => {
    if (isGoogle) {
      setStep(5);
    } else {
      setStep(4);
    }
  };

  const steps = [1, 2, 3, 4];
  const displayStep = isGoogle && step === 5 ? 4 : Math.min(step, 4);

  return (
    <>
      <style>{STYLES}</style>
      {step < 5 && (
        <button className="back-btn" onClick={() => step === 1 ? navigate("home") : setStep(s => s - 1)}>
          ← {step === 1 ? "Home" : "Back"}
        </button>
      )}
      <div className="auth-page">
        <div className="auth-glow" />
        <div className="signup-card">
          <span className="auth-logo">MEDIA<span>FLOW</span></span>

          {/* Progress */}
          {step < 5 && (
            <div className="progress-bar">
              {steps.map((s, i) => (
                <>
                  <div key={s} className={`progress-step${displayStep === s ? " active" : displayStep > s ? " done" : ""}`}>
                    {displayStep > s ? "✓" : s}
                  </div>
                  {i < steps.length - 1 && (
                    <div key={`line-${s}`} className={`progress-line${displayStep > s ? " done" : ""}`} />
                  )}
                </>
              ))}
            </div>
          )}

          {/* ── Step 1: Brand Info ── */}
          {step === 1 && (
            <>
              <h2 className="step-title">Tell us about your brand</h2>
              <p className="step-sub">We'll use this to personalise your experience.</p>

              <button className="google-btn" onClick={handleGoogle}>
                <GoogleIcon /> Continue with Google
              </button>
              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or fill in manually</span>
                <div className="auth-divider-line" />
              </div>

              <div className="signup-form">
                <div className="form-row-2">
                  <div className="auth-group">
                    <label className="auth-label">Brand / Business Name *</label>
                    <input className="auth-input" placeholder="e.g. AuraCo" value={brand.brandName} onChange={setB("brandName")} />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Industry *</label>
                    <select className="auth-select" value={brand.industry} onChange={setB("industry")}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="auth-group">
                    <label className="auth-label">Your Full Name *</label>
                    <input className="auth-input" placeholder="Admin name" value={brand.adminName} onChange={setB("adminName")} />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Work Email *</label>
                    <input className="auth-input" type="email" placeholder="you@brand.com" value={brand.email} onChange={setB("email")} />
                  </div>
                </div>
                <div className="auth-group">
                  <label className="auth-label">Website <span style={{ color: "#4A4A55", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <input className="auth-input" placeholder="https://yourbrand.com" value={brand.website} onChange={setB("website")} />
                </div>
                <button className="auth-btn" disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>

              <p className="auth-footer-text">
                Already have an account? <a onClick={() => navigate("login")}>Sign in</a>
              </p>
            </>
          )}

          {/* ── Step 2: Services ── */}
          {step === 2 && (
            <>
              <h2 className="step-title">What do you need from us?</h2>
              <p className="step-sub">Select all that apply — you can change this later.</p>
              <div className="pills-grid">
                {ALL_SERVICES.map(s => (
                  <button
                    key={s}
                    className={`pill${selectedServices.includes(s) ? " selected" : ""}`}
                    onClick={() => toggleService(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className="auth-btn" style={{ marginTop: 24 }} disabled={!step2Valid} onClick={() => setStep(3)}>
                Continue →
              </button>
              <div style={{ marginTop: 12 }}>
                <span className="auth-back-link" onClick={() => setStep(1)}>← Back</span>
              </div>
            </>
          )}

          {/* ── Step 3: Agreement ── */}
          {step === 3 && (
            <>
              <h2 className="step-title">Almost there</h2>
              <p className="step-sub">Review and agree to our terms before creating your account.</p>

              <div style={{ background: "#0A0A0C", border: "1px solid #1E1E24", padding: "18px", marginBottom: "20px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F8F8F2", marginBottom: 8 }}>{brand.brandName}</div>
                <div style={{ fontSize: 12, color: "#6A6A76", marginBottom: 4 }}>{brand.email}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {selectedServices.map(s => (
                    <span key={s} style={{ padding: "3px 10px", border: "1px solid #2A2A34", fontSize: 11, color: "#8A8A96" }}>{s}</span>
                  ))}
                </div>
              </div>

              <label className="tc-label">
                <input
                  type="checkbox" className="tc-checkbox"
                  checked={agreed} onChange={e => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to MediaFlow's{" "}
                  <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
                </span>
              </label>

              <button className="auth-btn" style={{ marginTop: 20 }} disabled={!agreed} onClick={handleStep3Submit}>
                Create Account →
              </button>
              <div style={{ marginTop: 12 }}>
                <span className="auth-back-link" onClick={() => setStep(2)}>← Back</span>
              </div>
            </>
          )}

          {/* ── Step 4: Set Password (non-Google only) ── */}
          {step === 4 && (
            <>
              <h2 className="step-title">Set your password</h2>
              <p className="step-sub">Choose a strong password to secure your account.</p>

              <div className="signup-form">
                <div className="auth-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input
                      className="auth-input" type={showPass ? "text" : "password"}
                      placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>{showPass ? "🙈" : "👁"}</button>
                  </div>
                  <div className="pass-rules">
                    <span className={`pass-rule${passRules.length ? " met" : ""}`}>At least 8 characters</span>
                    <span className={`pass-rule${passRules.upper ? " met" : ""}`}>One uppercase letter</span>
                    <span className={`pass-rule${passRules.number ? " met" : ""}`}>One number</span>
                  </div>
                </div>
                <div className="auth-group">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <input
                      className="auth-input" type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)}>{showConfirm ? "🙈" : "👁"}</button>
                  </div>
                  {confirmPass && !passValid && confirmPass.length > 0 && (
                    <span style={{ fontSize: 12, color: "#E05C27", marginTop: 4 }}>Passwords don't match</span>
                  )}
                </div>

                <button className="auth-btn" disabled={!passValid} onClick={() => setStep(5)}>
                  Complete Setup →
                </button>
              </div>
              <div style={{ marginTop: 12 }}>
                <span className="auth-back-link" onClick={() => setStep(3)}>← Back</span>
              </div>
            </>
          )}

          {/* ── Step 5: Email Sent ── */}
          {step === 5 && (
            <div className="success-screen">
              <div className="success-icon">✉️</div>
              <h2 className="success-h">Check your inbox</h2>
              <p className="success-p">
                We've sent a verification link to{" "}
                <span className="success-email-highlight">{brand.email}</span>.
                Click the link to activate your account.
              </p>
              <button className="auth-btn" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => navigate("login")}>
                Go to Login →
              </button>
              <p style={{ fontSize: 12, color: "#4A4A55", marginTop: 16 }}>
                Didn't receive it? Check your spam folder or{" "}
                <span style={{ color: "#E05C27", cursor: "pointer" }} onClick={() => setStep(5)}>resend email</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
