import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseReady } from "./firebase";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";

const BASE_FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
`;

const BASE_STYLES = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0A0A0C; }
  ::-webkit-scrollbar-thumb { background: #E05C27; border-radius: 3px; }
  body {
    font-family: 'Poppins', sans-serif;
    background: #0A0A0C;
    color: #F8F8F2;
    overflow-x: hidden;
    line-height: 1.6;
  }
  a { text-decoration: none; color: inherit; }
  button { font-family: 'Poppins', sans-serif; cursor: pointer; }
  input, select, textarea { font-family: 'Poppins', sans-serif; }
`;

const LOADER_STYLES = `
  .app-loader {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0A0A0C;
  }
  .app-loader-logo {
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #F8F8F2;
    letter-spacing: -.4px; opacity: 0; animation: fadeIn .5s ease .1s forwards;
  }
  .app-loader-logo span { color: #E05C27; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default function App() {
  const [page, setPage] = useState("home");
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseReady);

  useEffect(() => {
    if (!isFirebaseReady) return;
    const unsub = onAuthStateChanged(auth, user => {
      setAuthUser(user);
      setAuthLoading(false);
      if (user && user.emailVerified) {
        setPage("dashboard");
      }
    });
    return unsub;
  }, []);

  const navigate = to => {
    setPage(to);
    window.scrollTo(0, 0);
  };

  if (authLoading) {
    return (
      <>
        <style>{BASE_FONTS}</style>
        <style>{LOADER_STYLES}</style>
        <div className="app-loader">
          <div className="app-loader-logo">MEDIA<span>FLOW</span></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{BASE_FONTS}</style>
      <style>{BASE_STYLES}</style>
      {page === "home"      && <LandingPage  navigate={navigate} />}
      {page === "login"     && <LoginPage    navigate={navigate} />}
      {page === "signup"    && <SignupPage   navigate={navigate} />}
      {page === "dashboard" && <DashboardPage navigate={navigate} user={authUser} />}
    </>
  );
}
