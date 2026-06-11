import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  reload,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseReady } from "./firebase";

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
  .google-btn:disabled { opacity: .6; cursor: not-allowed; }

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

  /* Error */
  .auth-error {
    padding: 11px 14px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.22);
    font-size: 13px; color: #E05C27; line-height: 1.5;
  }

  .auth-back-link { font-size: 13px; font-weight: 500; color: #6A6A76; cursor: pointer; margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; transition: color .2s; }
  .auth-back-link:hover { color: #F8F8F2; }
  .auth-footer-text { font-size: 12px; font-weight: 400; color: #6A6A76; text-align: center; margin-top: 20px; }
  .auth-footer-text a { color: #E05C27; font-weight: 500; cursor: pointer; }
  .auth-footer-text a:hover { text-decoration: underline; }

  /* Verify / center screens */
  .center-screen { text-align: center; padding: 16px 0; }
  .screen-icon {
    width: 68px; height: 68px; background: rgba(224,92,39,.1); border: 1px solid rgba(224,92,39,.25);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin: 0 auto 24px;
  }
  .screen-h { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #F8F8F2; margin-bottom: 10px; }
  .screen-p { font-size: 14px; font-weight: 400; color: #8A8A96; line-height: 1.7; max-width: 340px; margin: 0 auto 28px; }
  .email-highlight { color: #E05C27; font-weight: 600; }
  .resend-text { font-size: 12px; color: #4A4A55; margin-top: 16px; }
  .resend-text button { background: none; border: none; color: #E05C27; font-size: 12px; padding: 0; cursor: pointer; }
  .resend-text button:hover { text-decoration: underline; }

  .not-configured {
    padding: 18px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.22);
    font-size: 13px; color: #E05C27; line-height: 1.6; margin-bottom: 20px;
  }

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

function firebaseError(code) {
  const map = {
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again in a few minutes.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
    "auth/requires-recent-login": "Session expired. Please refresh and try again.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// steps: 1=brand, 2=services, 3=agreement, 4=verify-email, 5=set-password
function progressInfo(step) {
  if (step === 1) return { active: 1, done: 0 };
  if (step === 2) return { active: 2, done: 1 };
  if (step === 3) return { active: 3, done: 2 };
  if (step === 4) return { active: null, done: 3 };
  return { active: 4, done: 3 };
}

export default function SignupPage({ navigate }) {
  const [step, setStep] = useState(1);
  const [isGoogle, setIsGoogle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempPass] = useState(() => btoa(Math.random().toString(36)).slice(0, 14) + "Aa1!");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [brand, setBrand] = useState({
    brandName: "", industry: "", adminName: "", email: "", website: "",
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [agreed, setAgreed] = useState(false);
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

  const saveBrandToStorage = (extraServices) => {
    localStorage.setItem("mf_brand", JSON.stringify({
      ...brand,
      services: extraServices || selectedServices,
    }));
  };

  // Google sign-up
  const handleGoogle = async () => {
    if (!isFirebaseReady) return;
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setBrand(f => ({
        ...f,
        adminName: user.displayName || "",
        email: user.email || "",
        brandName: f.brandName || (user.displayName ? user.displayName.split(" ")[0] + "'s Brand" : ""),
      }));
      setIsGoogle(true);
      setStep(2);
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // After T&C agreement
  const handleCreateAccount = async () => {
    if (!isFirebaseReady) return;
    setLoading(true);
    setError("");

    if (isGoogle) {
      saveBrandToStorage();
      navigate("dashboard");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, brand.email, tempPass);
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin,
        handleCodeInApp: false,
      });
      saveBrandToStorage();
      setStep(4);
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Check if email is verified when user clicks "I've verified"
  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError("");
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        setStep(5);
      } else {
        setError("Your email hasn't been verified yet. Check your inbox and click the link, then try again.");
      }
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResend = async () => {
    if (resendCooldown > 0 || !auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin,
        handleCodeInApp: false,
      });
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(v => {
          if (v <= 1) { clearInterval(timer); return 0; }
          return v - 1;
        });
      }, 1000);
    } catch (err) {
      setError(firebaseError(err.code));
    }
  };

  // Set password after email verification
  const handleSetPassword = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError("");
    try {
      await updatePassword(auth.currentUser, password);
      navigate("dashboard");
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === 1) navigate("home");
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else setStep(s => s - 1);
  };

  const { active, done } = progressInfo(step);

  return (
    <>
      <style>{STYLES}</style>
      <button className="back-btn" onClick={handleBack}>
        ← {step === 1 ? "Home" : "Back"}
      </button>
      <div className="auth-page">
        <div className="auth-glow" />
        <div className="signup-card">
          <span className="auth-logo">MEDIA<span>FLOW</span></span>

          <div className="progress-bar">
            {[1, 2, 3, 4].map((s, i) => (
              <div key={s} style={{ display: "contents" }}>
                <div className={`progress-step${active === s ? " active" : s <= done ? " done" : ""}`}>
                  {s <= done ? "✓" : s}
                </div>
                {i < 3 && <div className={`progress-line${s <= done ? " done" : ""}`} />}
              </div>
            ))}
          </div>

          {!isFirebaseReady && (
            <div className="not-configured">
              Firebase is not configured yet. Fill in your <strong>.env</strong> file with your Firebase project credentials to enable real authentication.
            </div>
          )}

          {/* ── Step 1: Brand Info ── */}
          {step === 1 && (
            <>
              <h2 className="step-title">Tell us about your brand</h2>
              <p className="step-sub">We'll use this to personalise your experience.</p>

              <button className="google-btn" onClick={handleGoogle} disabled={loading || !isFirebaseReady}>
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
                {error && <div className="auth-error">{error}</div>}
                <button className="auth-btn" disabled={!step1Valid || loading} onClick={() => { setError(""); setStep(2); }}>
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
              <button className="auth-btn" style={{ marginTop: 24 }} disabled={!step2Valid} onClick={() => { setError(""); setStep(3); }}>
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
              <p className="step-sub">Review your details and agree before we create your account.</p>

              <div style={{ background: "#0A0A0C", border: "1px solid #1E1E24", padding: "18px", marginBottom: "20px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F8F8F2", marginBottom: 4 }}>{brand.brandName}</div>
                <div style={{ fontSize: 12, color: "#6A6A76", marginBottom: 10 }}>{brand.email}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedServices.map(s => (
                    <span key={s} style={{ padding: "3px 10px", border: "1px solid #2A2A34", fontSize: 11, color: "#8A8A96" }}>{s}</span>
                  ))}
                </div>
              </div>

              <label className="tc-label">
                <input type="checkbox" className="tc-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span>
                  I agree to MediaFlow's{" "}
                  <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
                </span>
              </label>

              {error && <div className="auth-error" style={{ marginTop: 14 }}>{error}</div>}

              <button className="auth-btn" style={{ marginTop: 20 }} disabled={!agreed || loading} onClick={handleCreateAccount}>
                {loading ? "Creating account…" : "Create Account →"}
              </button>
              <div style={{ marginTop: 12 }}>
                <span className="auth-back-link" onClick={() => setStep(2)}>← Back</span>
              </div>
            </>
          )}

          {/* ── Step 4: Email Verification ── */}
          {step === 4 && (
            <div className="center-screen">
              <div className="screen-icon">✉️</div>
              <h2 className="screen-h">Verify your email</h2>
              <p className="screen-p">
                We've sent a verification link to{" "}
                <span className="email-highlight">{brand.email}</span>.
                Open the email and click the link, then come back here to continue.
              </p>

              {error && <div className="auth-error" style={{ textAlign: "left", marginBottom: 16 }}>{error}</div>}

              <button
                className="auth-btn"
                style={{ maxWidth: 320, margin: "0 auto" }}
                onClick={handleCheckVerification}
                disabled={loading}
              >
                {loading ? "Checking…" : "I've verified my email →"}
              </button>

              <p className="resend-text" style={{ marginTop: 18 }}>
                Didn't receive it? Check spam or{" "}
                <button onClick={handleResend} disabled={resendCooldown > 0}>
                  {resendCooldown > 0 ? `resend in ${resendCooldown}s` : "resend the email"}
                </button>
              </p>
            </div>
          )}

          {/* ── Step 5: Set Password ── */}
          {step === 5 && (
            <>
              <h2 className="step-title">Set your password</h2>
              <p className="step-sub">Email verified! Now choose a strong password to secure your account.</p>

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

                {error && <div className="auth-error">{error}</div>}

                <button className="auth-btn" disabled={!passValid || loading} onClick={handleSetPassword}>
                  {loading ? "Saving…" : "Complete Setup →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
