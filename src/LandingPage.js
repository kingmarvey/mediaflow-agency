import { useState, useEffect } from "react";

const STYLES = `
  /* ── Layout ── */
  .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 28px; }
  section { padding: 110px 0; }

  .section-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: #E05C27; margin-bottom: 18px;
  }
  .section-label::before { content: ''; display: block; width: 24px; height: 1px; background: #E05C27; }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* ── Navbar ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 0; transition: background .3s, border-color .3s, padding .3s;
    border-bottom: 1px solid transparent;
  }
  .navbar.scrolled {
    background: rgba(10,10,12,.94); backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px); border-bottom-color: #1E1E24; padding: 13px 0;
  }
  .navbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #F8F8F2; letter-spacing: -0.5px; flex-shrink: 0; }
  .logo span { color: #E05C27; }
  .nav-links { display: flex; align-items: center; gap: 30px; list-style: none; }
  .nav-links a { font-size: 14px; font-weight: 500; color: #8A8A96; transition: color .2s; }
  .nav-links a:hover { color: #F8F8F2; }
  .nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .btn-login {
    padding: 9px 18px; background: transparent; color: #F8F8F2;
    font-size: 13px; font-weight: 500; border: 1px solid #2A2A34; transition: all .2s;
  }
  .btn-login:hover { border-color: #E05C27; color: #E05C27; }
  .btn-nav {
    padding: 9px 20px; background: #E05C27; color: #F8F8F2;
    font-size: 13px; font-weight: 600; border: none; transition: background .2s;
  }
  .btn-nav:hover { background: #F0723A; }
  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: #F8F8F2; }
  .mobile-menu { background: #111116; border-top: 1px solid #1E1E24; padding: 8px 28px 20px; }
  .mobile-menu a { display: block; padding: 13px 0; border-bottom: 1px solid #1E1E24; color: #F8F8F2; font-size: 15px; font-weight: 500; }
  .mobile-actions { display: flex; gap: 8px; margin-top: 14px; }
  .mobile-actions button { flex: 1; padding: 12px; font-size: 14px; font-weight: 600; border: none; }

  /* ── Hero ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    position: relative; padding: 130px 0 80px; overflow: hidden;
  }
  .hero-video {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; z-index: 0; pointer-events: none;
  }
  .hero-video-overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(135deg, rgba(10,10,12,.88) 0%, rgba(10,10,12,.72) 50%, rgba(10,10,12,.88) 100%);
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 2;
    background-image: linear-gradient(rgba(224,92,39,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(224,92,39,.022) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  .hero-glow {
    position: absolute; top: -260px; right: -260px; z-index: 3; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(224,92,39,.08) 0%, transparent 68%); pointer-events: none;
  }
  .hero-content { position: relative; z-index: 4; max-width: 740px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
    background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.2);
    font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #E05C27; margin-bottom: 26px;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #E05C27; animation: pulse 2s infinite; }
  .hero-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(48px, 7.2vw, 92px);
    font-weight: 800; line-height: 1.0; letter-spacing: -3px; color: #F8F8F2; margin-bottom: 22px;
  }
  .hero-headline em { font-style: normal; color: #E05C27; }
  .hero-sub { font-size: 16px; font-weight: 400; color: #8A8A96; line-height: 1.7; max-width: 460px; margin-bottom: 38px; }
  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 68px; }
  .btn-primary {
    padding: 14px 30px; background: #E05C27; color: #F8F8F2;
    font-size: 14px; font-weight: 600; border: none; transition: all .2s;
  }
  .btn-primary:hover { background: #F0723A; transform: translateY(-2px); }
  .btn-outline {
    padding: 13px 30px; background: transparent; color: #F8F8F2;
    font-size: 14px; font-weight: 500; border: 1px solid #2A2A34; transition: all .2s;
  }
  .btn-outline:hover { border-color: #E05C27; color: #E05C27; }
  .hero-stats { display: flex; border-top: 1px solid #1E1E24; padding-top: 40px; }
  .hero-stat { flex: 1; }
  .hero-stat + .hero-stat { padding-left: 32px; border-left: 1px solid #1E1E24; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 800; color: #F8F8F2; letter-spacing: -1.5px; line-height: 1; }
  .stat-num span { color: #E05C27; }
  .stat-label { font-size: 12px; font-weight: 400; color: #6A6A76; margin-top: 4px; }

  /* ── Ticker ── */
  .ticker { background: #E05C27; overflow: hidden; padding: 13px 0; white-space: nowrap; }
  .ticker-track { display: inline-flex; animation: marquee 30s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
  .ticker-item {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800;
    color: #F8F8F2; letter-spacing: .12em; text-transform: uppercase;
    padding: 0 26px; display: inline-flex; align-items: center; gap: 26px;
  }
  .ticker-item::after { content: '✦'; font-size: 8px; opacity: .6; }

  /* ── Services ── */
  .services { background: #0A0A0C; }
  .services-top { margin-bottom: 52px; }
  .services-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(26px, 3.6vw, 46px);
    font-weight: 800; line-height: 1.1; letter-spacing: -1px; color: #F8F8F2; max-width: 500px;
  }
  .services-headline em { font-style: normal; color: #E05C27; }
  .bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .bento-card {
    background: #111116; border: 1px solid #1E1E24; padding: 28px;
    transition: border-color .3s, transform .25s;
  }
  .bento-card:hover { border-color: rgba(224,92,39,.38); transform: translateY(-3px); }
  .bento-card.wide { grid-column: span 2; }
  .svc-num { font-size: 10px; font-weight: 600; color: rgba(224,92,39,.38); letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px; }
  .svc-icon {
    width: 42px; height: 42px; background: rgba(224,92,39,.08);
    border: 1px solid rgba(224,92,39,.18); display: flex;
    align-items: center; justify-content: center; font-size: 18px; margin-bottom: 16px;
  }
  .svc-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #F8F8F2; margin-bottom: 8px; }
  .svc-desc { font-size: 13px; font-weight: 400; color: #8A8A96; line-height: 1.65; }
  .svc-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
  .svc-tag { padding: 3px 9px; border: 1px solid #2A2A34; font-size: 10px; font-weight: 500; color: #6A6A76; }

  /* ── Testimonials ── */
  .testimonials { background: #0C0C10; }
  .testi-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 20px; }
  .testi-headline { font-family: 'Syne', sans-serif; font-size: clamp(24px, 3.2vw, 42px); font-weight: 800; letter-spacing: -1px; color: #F8F8F2; }
  .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .testi-card { background: #111116; border: 1px solid #1E1E24; padding: 26px; transition: border-color .3s; }
  .testi-card:hover { border-color: rgba(224,92,39,.28); }
  .stars { color: #E05C27; font-size: 12px; margin-bottom: 14px; letter-spacing: 1px; }
  .testi-quote { font-size: 13.5px; font-weight: 400; color: #C0C0CC; line-height: 1.78; margin-bottom: 22px; }
  .testi-author { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #E05C27 0%, #B83D12 100%);
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: #F8F8F2;
  }
  .author-name { font-weight: 600; font-size: 13px; color: #F8F8F2; }
  .author-role { font-size: 11px; font-weight: 400; color: #6A6A76; margin-top: 1px; }

  /* ── FAQ ── */
  .faq { background: #0A0A0C; }
  .faq-inner { display: grid; grid-template-columns: 1fr 1.65fr; gap: 80px; align-items: start; }
  .faq-sticky { position: sticky; top: 110px; }
  .faq-headline { font-family: 'Syne', sans-serif; font-size: clamp(24px, 3.2vw, 42px); font-weight: 800; letter-spacing: -1px; color: #F8F8F2; margin-bottom: 14px; }
  .faq-sub { font-size: 13px; font-weight: 400; color: #8A8A96; line-height: 1.7; margin-bottom: 26px; }
  .link-accent { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #E05C27; transition: gap .2s; }
  .link-accent:hover { gap: 13px; }
  .faq-list { display: flex; flex-direction: column; }
  .faq-item { border-bottom: 1px solid #1E1E24; }
  .faq-btn {
    width: 100%; padding: 22px 0; background: none; border: none;
    display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left;
  }
  .faq-q { font-size: 15px; font-weight: 500; color: #F8F8F2; transition: color .2s; }
  .faq-btn:hover .faq-q { color: #E05C27; }
  .faq-icon {
    flex-shrink: 0; width: 26px; height: 26px; border: 1px solid #2A2A34;
    display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 300;
    color: #E05C27; transition: transform .3s, background .2s; line-height: 1;
  }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: rgba(224,92,39,.1); }
  .faq-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
  .faq-item.open .faq-body { grid-template-rows: 1fr; }
  .faq-body-inner { overflow: hidden; }
  .faq-answer { font-size: 13.5px; font-weight: 400; color: #8A8A96; line-height: 1.78; padding-bottom: 20px; }

  /* ── Contact ── */
  .contact { background: #0C0C10; }
  .contact-inner { display: grid; grid-template-columns: 1fr 1.45fr; gap: 80px; align-items: start; }
  .contact-headline { font-family: 'Syne', sans-serif; font-size: clamp(24px, 3.2vw, 42px); font-weight: 800; letter-spacing: -1px; color: #F8F8F2; margin-bottom: 12px; }
  .contact-sub { font-size: 13px; font-weight: 400; color: #8A8A96; line-height: 1.7; margin-bottom: 34px; }
  .info-list { display: flex; flex-direction: column; gap: 16px; }
  .info-item { display: flex; align-items: flex-start; gap: 12px; }
  .info-icon { width: 36px; height: 36px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.18); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .info-label { font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; margin-bottom: 2px; }
  .info-val { font-size: 13px; font-weight: 400; color: #C8C8D4; }
  .contact-form { display: flex; flex-direction: column; gap: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 12px 14px; background: #111116; border: 1px solid #1E1E24;
    color: #F8F8F2; font-size: 14px; font-weight: 400; outline: none; transition: border-color .2s;
    -webkit-appearance: none; appearance: none;
  }
  .form-input::placeholder, .form-textarea::placeholder { color: #3A3A44; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #E05C27; }
  .form-textarea { resize: vertical; min-height: 110px; }
  .form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8A96' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; padding-right: 40px; cursor: pointer;
  }
  .form-select option { background: #111116; }
  .btn-submit { padding: 13px 28px; background: #E05C27; color: #F8F8F2; font-size: 14px; font-weight: 600; border: none; transition: all .2s; align-self: flex-start; }
  .btn-submit:hover { background: #F0723A; transform: translateY(-2px); }
  .btn-submit:disabled { background: #2A2A34; color: #6A6A76; cursor: not-allowed; transform: none; }
  .form-success { display: flex; align-items: flex-start; gap: 12px; padding: 18px; background: rgba(224,92,39,.08); border: 1px solid rgba(224,92,39,.22); }
  .success-check { width: 30px; height: 30px; background: #E05C27; color: #F8F8F2; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
  .success-title { font-weight: 600; font-size: 14px; color: #F8F8F2; margin-bottom: 3px; }
  .success-sub { font-size: 12px; font-weight: 400; color: #8A8A96; }

  /* ── Footer ── */
  .footer { background: #0A0A0C; border-top: 1px solid #1E1E24; padding: 64px 0 32px; }
  .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 44px; margin-bottom: 50px; }
  .f-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #F8F8F2; letter-spacing: -.5px; margin-bottom: 10px; }
  .f-logo span { color: #E05C27; }
  .f-desc { font-size: 13px; font-weight: 400; color: #6A6A76; line-height: 1.65; max-width: 240px; margin-bottom: 20px; }
  .f-socials { display: flex; gap: 8px; }
  .f-social { width: 34px; height: 34px; border: 1px solid #1E1E24; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #6A6A76; transition: all .2s; }
  .f-social:hover { border-color: #E05C27; color: #E05C27; }
  .f-col-title { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #F8F8F2; margin-bottom: 16px; }
  .f-links { display: flex; flex-direction: column; gap: 10px; list-style: none; }
  .f-links a { font-size: 13px; font-weight: 400; color: #6A6A76; transition: color .2s; }
  .f-links a:hover { color: #E05C27; }
  .footer-bottom { border-top: 1px solid #1E1E24; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .f-copy { font-size: 12px; font-weight: 400; color: #3A3A44; }
  .f-legal { display: flex; gap: 20px; }
  .f-legal a { font-size: 12px; font-weight: 400; color: #3A3A44; transition: color .2s; }
  .f-legal a:hover { color: #8A8A96; }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    section { padding: 80px 0; }
    .bento { grid-template-columns: 1fr 1fr; }
    .bento-card.wide { grid-column: span 2; }
    .testi-grid { grid-template-columns: 1fr 1fr; }
    .faq-inner { grid-template-columns: 1fr; gap: 44px; }
    .faq-sticky { position: static; }
    .contact-inner { grid-template-columns: 1fr; gap: 48px; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .nav-links, .btn-login, .btn-nav { display: none; }
    .hamburger { display: flex; }
    .hero-headline { letter-spacing: -2px; }
    .hero-stats { flex-direction: column; gap: 20px; }
    .hero-stat + .hero-stat { border-left: none; border-top: 1px solid #1E1E24; padding-left: 0; padding-top: 20px; }
    .bento { grid-template-columns: 1fr; }
    .bento-card.wide { grid-column: span 1; }
    .testi-grid { grid-template-columns: 1fr; }
    .testi-top { flex-direction: column; align-items: flex-start; }
    .form-row { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; }
  }
`;

/* ── Data ─────────────────────────────────────────────────────── */

const SERVICES = [
  {
    num: "01", icon: "📱", wide: true,
    title: "Social Media Management",
    desc: "Full ownership of your social presence — content, scheduling, engagement, and analytics.",
    tags: ["Instagram", "TikTok", "LinkedIn", "X", "YouTube"],
  },
  {
    num: "02", icon: "🎬",
    title: "Video Production",
    desc: "From concept to final cut — Reels, brand films, and ad campaigns built to stop the scroll.",
    tags: ["Reels", "Brand Films", "Ads", "YouTube"],
  },
  {
    num: "03", icon: "🎨",
    title: "Graphic Design",
    desc: "Identities, ad creatives, and motion graphics that make your brand unforgettable.",
    tags: ["Branding", "Ad Creatives", "Motion"],
  },
  {
    num: "04", icon: "✍️", wide: true,
    title: "Content Strategy & Copywriting",
    desc: "Blogs, captions, scripts, and content calendars — words that convert attention into action.",
    tags: ["Blog", "Captions", "Scripts", "Email", "Ad Copy"],
  },
  {
    num: "05", icon: "📷",
    title: "Photography",
    desc: "Professional brand, product, and lifestyle photography that tells your story.",
    tags: ["Brand", "Product", "Lifestyle", "Editorial"],
  },
  {
    num: "06", icon: "📊",
    title: "Analytics & Reporting",
    desc: "Monthly dashboards that show exactly what's working — and where to push next.",
    tags: ["Reports", "KPIs", "Growth"],
  },
  {
    num: "07", icon: "🔍",
    title: "Brand Audit",
    desc: "A full diagnostic of your brand position and the clear roadmap forward.",
    tags: ["Analysis", "Strategy"],
  },
];

const TESTIMONIALS = [
  {
    quote: "Our Instagram engagement tripled in 90 days. They don't just manage accounts — they build communities.",
    name: "Aisha Kolade", role: "CMO, UrbanThread Lagos", initials: "AK",
  },
  {
    quote: "Cinema-level brand film delivered in two weeks. Our CEO cried — in a good way.",
    name: "James Osei", role: "Founder, AuraCo", initials: "JO",
  },
  {
    quote: "MediaFlow gave us a system. Now everything just runs without us lifting a finger.",
    name: "Sandra Adeyemi", role: "Marketing Director, Prestige Group", initials: "SA",
  },
  {
    quote: "Email revenue up 41% in month one after they rewrote our sequences. Case closed.",
    name: "Tunde Obileye", role: "CEO, GrowthBridge", initials: "TO",
  },
  {
    quote: "The content doesn't feel outsourced — it feels like us. That's rare.",
    name: "Ngozi Eze", role: "Brand Manager, Lumé Skincare", initials: "NE",
  },
  {
    quote: "Best investment we made this year. Full stop.",
    name: "Emeka Nwosu", role: "Founder, Lagos Creative Hub", initials: "EN",
  },
];

const FAQS = [
  {
    q: "How does the outsourcing process work?",
    a: "Discovery call first. We build a custom strategy, assemble your team, and handle execution — you stay informed without the overwhelm.",
  },
  {
    q: "Do I retain creative control?",
    a: "Yes. You approve everything before it goes live. We're an extension of your team, not a replacement.",
  },
  {
    q: "What industries do you work with?",
    a: "Fashion, e-commerce, fintech, hospitality, real estate, FMCG, and more. We adapt to your industry from day one.",
  },
  {
    q: "How long before we see results?",
    a: "Most clients see engagement growth in 60–90 days. Revenue-tied goals typically take 3–6 months.",
  },
  {
    q: "What are your pricing structures?",
    a: "Monthly retainers for ongoing work, or project packages for one-off needs. We'll send a tailored quote within 24 hours.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, always. Client confidentiality is non-negotiable for us.",
  },
];

const TICKER = [
  "Social Media", "Video Production", "Brand Strategy", "Graphic Design",
  "Photography", "Copywriting", "Growth Marketing", "Analytics", "Brand Audits",
];

function smooth(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

/* ── Navbar ───────────────────────────────────────────────────── */

function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = (id) => { smooth(id); setOpen(false); };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <div className="logo" onClick={() => smooth("home")} style={{ cursor: "pointer" }}>
            MEDIA<span>FLOW</span>
          </div>
          <ul className="nav-links">
            {[["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); nav(id); }}>{label}</a></li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="btn-login" onClick={() => navigate("login")}>Login</button>
            <button className="btn-nav" onClick={() => navigate("signup")}>Get Started →</button>
          </div>
          <button className="hamburger" onClick={() => setOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          {[["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); nav(id); }}>{label}</a>
          ))}
          <div className="mobile-actions">
            <button style={{ background: "transparent", color: "#F8F8F2", border: "1px solid #2A2A34" }} onClick={() => { navigate("login"); setOpen(false); }}>Login</button>
            <button style={{ background: "#E05C27", color: "#F8F8F2" }} onClick={() => { navigate("signup"); setOpen(false); }}>Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */

function Hero({ navigate }) {
  return (
    <>
      <section className="hero" id="home">
        {/* ↓ Replace the src URL with your own video file. Keep it short, looping, and ideally under 10 MB for performance. */}
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-woman-working-on-a-creative-project-in-a-studio-3166/1080p.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><span className="badge-dot" /> Your Media Partner</div>
            <h1 className="hero-headline">
              We handle<br />your media.<br />You chase<br /><em>your goals.</em>
            </h1>
            <p className="hero-sub">
              Strategy, content, production — all under one roof. You focus on growth.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => navigate("signup")}>Get Started</button>
              <button className="btn-outline" onClick={() => smooth("services")}>See What We Do →</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-num">500<span>+</span></div>
                <div className="stat-label">Brands Served</div>
              </div>
              <div className="hero-stat">
                <div className="stat-num">98<span>%</span></div>
                <div className="stat-label">Client Retention</div>
              </div>
              <div className="hero-stat">
                <div className="stat-num">50<span>M+</span></div>
                <div className="stat-label">Content Impressions</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => <span className="ticker-item" key={i}>{item}</span>)}
        </div>
      </div>
    </>
  );
}

/* ── Services ─────────────────────────────────────────────────── */

function WhatWeDo() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-top">
          <div className="section-label">What We Do</div>
          <h2 className="services-headline">Everything your brand<br />needs to <em>dominate</em></h2>
        </div>
        <div className="bento">
          {SERVICES.map(s => (
            <div key={s.num} className={`bento-card${s.wide ? " wide" : ""}`}>
              <div className="svc-num">{s.num}</div>
              <div className="svc-icon">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-tags">{s.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────────── */

function Testimonials({ navigate }) {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testi-top">
          <div>
            <div className="section-label">Client Stories</div>
            <h2 className="testi-headline">Trusted by<br />ambitious brands</h2>
          </div>
          <button className="btn-outline" onClick={() => navigate("signup")}>Become a Client</button>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-author">
                <div className="avatar">{t.initials}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────── */

function FAQ({ navigate }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-inner">
          <div className="faq-sticky">
            <div className="section-label">FAQ</div>
            <h2 className="faq-headline">Questions<br />we get<br />a lot</h2>
            <p className="faq-sub">Still have questions? We'll reply within 2 hours.</p>
            <span className="link-accent" onClick={() => smooth("contact")} style={{ cursor: "pointer" }}>Ask us directly →</span>
          </div>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div key={i} className={`faq-item${openIdx === i ? " open" : ""}`}>
                <button className="faq-btn" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-body">
                  <div className="faq-body-inner">
                    <p className="faq-answer">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Contact ──────────────────────────────────────────────────── */

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && form.email.trim() && form.message.trim();

  const submit = e => {
    e.preventDefault();
    if (!valid) return;
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1400);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-inner">
          <div>
            <div className="section-label">Get in Touch</div>
            <h2 className="contact-headline">Let's build<br />something great</h2>
            <p className="contact-sub">Tell us your project. We respond within 24 hours.</p>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div><div className="info-label">Email</div><div className="info-val">hello@mediaflow.agency</div></div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div><div className="info-label">Phone / WhatsApp</div><div className="info-val">+234 800 000 0000</div></div>
              </div>
              <div className="info-item">
                <div className="info-icon">⏰</div>
                <div><div className="info-label">Response Time</div><div className="info-val">Within 2 hours, business days</div></div>
              </div>
            </div>
          </div>
          {sent ? (
            <div className="form-success">
              <div className="success-check">✓</div>
              <div>
                <div className="success-title">Message received!</div>
                <div className="success-sub">We'll be in touch within 24 hours.</div>
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={set("name")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" placeholder="you@brand.com" value={form.email} onChange={set("email")} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Your brand" value={form.company} onChange={set("company")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Service</label>
                  <select className="form-select" value={form.service} onChange={set("service")}>
                    <option value="">Select a service</option>
                    <option>Social Media Management</option>
                    <option>Video Production</option>
                    <option>Graphic Design</option>
                    <option>Photography</option>
                    <option>Content Strategy & Copywriting</option>
                    <option>Full-Service Package</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-textarea" placeholder="What are your goals and timeline?" value={form.message} onChange={set("message")} required />
              </div>
              <button className="btn-submit" type="submit" disabled={!valid || sending}>
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="f-logo">MEDIA<span>FLOW</span></div>
            <p className="f-desc">Full-service media outsourcing for brands that refuse to blend in.</p>
            <div className="f-socials">
              {[["X","𝕏"],["LI","in"],["IG","IG"],["YT","YT"]].map(([label, icon]) => (
                <a key={label} href="#" className="f-social" aria-label={label}>{icon}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="f-col-title">Quick Links</div>
            <ul className="f-links">
              {[["home","Home"],["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); smooth(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="f-col-title">Services</div>
            <ul className="f-links">
              {["Social Media","Video Production","Graphic Design","Photography","Copywriting","Analytics"].map(s => (
                <li key={s}><a href="#services" onClick={e => { e.preventDefault(); smooth("services"); }}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="f-col-title">Account</div>
            <ul className="f-links">
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("login"); }}>Login</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("signup"); }}>Get Started</a></li>
              <li><a href="mailto:hello@mediaflow.agency">hello@mediaflow.agency</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="f-copy">© 2025 MediaFlow. All rights reserved.</span>
          <div className="f-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Export ───────────────────────────────────────────────────── */

export default function LandingPage({ navigate }) {
  return (
    <>
      <style>{STYLES}</style>
      <Navbar navigate={navigate} />
      <main>
        <Hero navigate={navigate} />
        <WhatWeDo />
        <Testimonials navigate={navigate} />
        <FAQ navigate={navigate} />
        <Contact />
      </main>
      <Footer navigate={navigate} />
    </>
  );
}
