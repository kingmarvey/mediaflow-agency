import { useState } from "react";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

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

export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (to) => {
    setPage(to);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <style>{BASE_FONTS}</style>
      <style>{BASE_STYLES}</style>
      {page === "home"   && <LandingPage navigate={navigate} />}
      {page === "login"  && <LoginPage   navigate={navigate} />}
      {page === "signup" && <SignupPage  navigate={navigate} />}
    </>
  );
}
