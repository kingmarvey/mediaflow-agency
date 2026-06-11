import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseReady } from "./firebase";

const STYLES = `
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 40px 20px; position: relative; overflow: hidden;
  }
  .auth-glow {
    position: absolute; top: -300px; right: -300px; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(224,92,39,.07) 0%, transparent 68%); pointer-events: none;
  }
  .auth-glow-2 {
    position: absolute; bottom: -200px; left: -200px; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(224,92,39,.04) 0%, transparent 68%); pointer-events: none;
  }
  .auth-card {
    position: relative; z-index: 1; width: 100%; max-width: 440px;
    background: #111116; border: 1px solid #1E1E24; padding: 44px 40px;
  }
  .auth-logo {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    color: #F8F8F2; margin-bottom: 32px; display: block;
  }
  .auth-logo span { color: #E05C27; }
  .auth-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #F8F8F2; margin-bottom: 6px; letter-spacing: -.5px; }
  .auth-sub { font-size: 13px; font-weight: 400; color: #8A8A96; margin-bottom: 28px; }
  .auth-sub a { color: #E05C27; font-weight: 500; cursor: pointer; }
  .auth-sub a:hover { text-decoration: underline; }

  .google-btn {
    width: 100%; padding: 12px 20px; background: #fff; color: #1F1F1F;
    font-size: 14px; font-weight: 500; border: 1px solid #E0E0E0;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, box-shadow .2s; margin-bottom: 24px;
  }
  .google-btn:hover { background: #F8F8F8; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
  .google-btn:disabled { opacity: .6; cursor: not-allowed; }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .auth-divider-line { flex: 1; height: 1px; background: #1E1E24; }
  .auth-divider-text { font-size: 11px; font-weight: 500; color: #6A6A76; letter-spacing: .08em; text-transform: uppercase; }

  .auth-form { display: flex; flex-direction: column; gap: 14px; }
  .auth-group { display: flex; flex-direction: column; gap: 6px; }
  .auth-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; }
  .auth-input {
    width: 100%; padding: 12px 14px; background: #0A0A0C; border: 1px solid #2A2A34;
    color: #F8F8F2; font-size: 14px; font-weight: 400; outline: none; transition: border-color .2s;
  }
  .auth-input::placeholder { color: #3A3A44; }
  .auth-input:focus { border-color: #E05C27; }
  .auth-input-wrap { position: relative; }
  .auth-input-wrap .auth-input { padding-right: 44px; }
  .eye-btn {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: #6A6A76; font-size: 16px; padding: 2px; transition: color .2s;
  }
  .eye-btn:hover { color: #F8F8F2; }
  .forgot-link {
    font-size: 12px; font-weight: 500; color: #E05C27; cursor: pointer;
    align-self: flex-end; margin-top: -6px; background: none; border: none; padding: 0;
  }
  .forgot-link:hover { text-decoration: underline; }

  .auth-btn {
    width: 100%; padding: 13px; background: #E05C27; color: #F8F8F2;
    font-size: 14px; font-weight: 600; border: none; transition: background .2s; margin-top: 4px;
  }
  .auth-btn:hover { background: #F0723A; }
  .auth-btn:disabled { background: #2A2A34; color: #6A6A76; cursor: not-allowed; }

  .auth-error {
    padding: 10px 14px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.22);
    font-size: 13px; color: #E05C27; line-height: 1.5;
  }
  .auth-success {
    padding: 10px 14px; background: rgba(52,211,153,.08); border: 1px solid rgba(52,211,153,.22);
    font-size: 13px; color: #34d399; line-height: 1.5;
  }
  .not-configured {
    padding: 11px 14px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.22);
    font-size: 13px; color: #E05C27; line-height: 1.6; margin-bottom: 20px;
  }

  .auth-footer-text { font-size: 12px; font-weight: 400; color: #6A6A76; text-align: center; margin-top: 20px; }
  .auth-footer-text a { color: #E05C27; font-weight: 500; cursor: pointer; }
  .auth-footer-text a:hover { text-decoration: underline; }

  .back-btn {
    position: fixed; top: 24px; left: 28px; z-index: 10;
    background: transparent; border: 1px solid #2A2A34; color: #8A8A96;
    padding: 8px 16px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;
    transition: all .2s;
  }
  .back-btn:hover { border-color: #E05C27; color: #F8F8F2; }

  @media (max-width: 480px) {
    .auth-card { padding: 32px 24px; }
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

function firebaseError(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later or reset your password.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const valid = email.trim() && password.length >= 6;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!valid || !isFirebaseReady) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        await auth.signOut();
        setError("Please verify your email before signing in. Check your inbox for the verification link.");
        return;
      }
      navigate("dashboard");
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isFirebaseReady) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("dashboard");
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address above first, then click Forgot password.");
      return;
    }
    if (!isFirebaseReady) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Password reset email sent — check your inbox.");
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <button className="back-btn" onClick={() => navigate("home")}>← Back</button>
      <div className="auth-page">
        <div className="auth-glow" />
        <div className="auth-glow-2" />
        <div className="auth-card">
          <span className="auth-logo">MEDIA<span>FLOW</span></span>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            New here?{" "}
            <a onClick={() => navigate("signup")}>Create an account</a>
          </p>

          {!isFirebaseReady && (
            <div className="not-configured">
              Firebase is not configured yet. Add your Firebase credentials to the <strong>.env</strong> file to enable login.
            </div>
          )}

          <button className="google-btn" onClick={handleGoogle} disabled={loading || !isFirebaseReady}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-group">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input" type="email" placeholder="you@brand.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            <div className="auth-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="button" className="forgot-link" onClick={handleForgotPassword} disabled={loading}>
              Forgot password?
            </button>

            {error && <div className="auth-error">{error}</div>}
            {successMsg && <div className="auth-success">{successMsg}</div>}

            <button className="auth-btn" type="submit" disabled={!valid || loading || !isFirebaseReady}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <a onClick={() => navigate("signup")}>Get started free</a>
          </p>
        </div>
      </div>
    </>
  );
}
