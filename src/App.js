import { useState, useEffect } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
`;

const STYLES = `
  /* ── Reset ── */
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0A0A0C; }
  ::-webkit-scrollbar-thumb { background: #D4FF00; border-radius: 3px; }

  /* ── Base ── */
  body {
    font-family: 'Space Grotesk', sans-serif;
    background: #0A0A0C;
    color: #F8F8F2;
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* ── Layout ── */
  .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 28px; }
  section { padding: 120px 0; }

  /* ── Label ── */
  .section-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: #D4FF00; margin-bottom: 22px;
  }
  .section-label::before {
    content: ''; display: block; width: 28px; height: 1px; background: #D4FF00;
  }

  /* ── Keyframes ── */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* ── Navbar ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 22px 0;
    transition: background .3s, border-color .3s, padding .3s;
    border-bottom: 1px solid transparent;
  }
  .navbar.scrolled {
    background: rgba(10,10,12,.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom-color: #1E1E24;
    padding: 15px 0;
  }
  .navbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .logo {
    font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 800;
    color: #F8F8F2; text-decoration: none; letter-spacing: -0.5px;
  }
  .logo span { color: #D4FF00; }
  .nav-links { display: flex; align-items: center; gap: 34px; list-style: none; }
  .nav-links a {
    font-size: 14px; font-weight: 500; color: #8A8A96;
    text-decoration: none; transition: color .2s; letter-spacing: .01em;
  }
  .nav-links a:hover { color: #F8F8F2; }
  .btn-nav {
    padding: 10px 22px; background: #D4FF00; color: #0A0A0C;
    font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700;
    border: none; cursor: pointer; transition: background .2s; white-space: nowrap;
    letter-spacing: .02em;
  }
  .btn-nav:hover { background: #eeff55; }
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .hamburger span { display: block; width: 22px; height: 2px; background: #F8F8F2; }
  .mobile-menu {
    background: #111116; border-top: 1px solid #1E1E24; padding: 12px 28px 20px;
  }
  .mobile-menu a {
    display: block; padding: 14px 0; border-bottom: 1px solid #1E1E24;
    color: #F8F8F2; text-decoration: none; font-size: 16px; font-weight: 500;
  }

  /* ── Hero ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    position: relative; padding: 130px 0 90px; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(212,255,0,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,255,0,.025) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  .hero-glow {
    position: absolute; top: -280px; right: -280px; z-index: 0;
    width: 760px; height: 760px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,255,0,.07) 0%, transparent 68%);
    pointer-events: none;
  }
  .hero-glow-2 {
    position: absolute; bottom: -200px; left: -200px; z-index: 0;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(100,80,255,.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 780px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 7px 15px; background: rgba(212,255,0,.08);
    border: 1px solid rgba(212,255,0,.2);
    font-size: 11px; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; color: #D4FF00; margin-bottom: 30px;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #D4FF00; animation: pulse 2s infinite; }
  .hero-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(50px, 7.5vw, 96px);
    font-weight: 800; line-height: 1.0; letter-spacing: -3px;
    color: #F8F8F2; margin-bottom: 26px;
  }
  .hero-headline em { font-style: normal; color: #D4FF00; }
  .hero-sub {
    font-size: 18px; font-weight: 400; color: #8A8A96;
    line-height: 1.75; max-width: 540px; margin-bottom: 46px;
  }
  .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 76px; }
  .btn-primary {
    padding: 16px 34px; background: #D4FF00; color: #0A0A0C;
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    border: none; cursor: pointer; transition: all .2s;
    letter-spacing: .02em; text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { background: #eeff55; transform: translateY(-2px); }
  .btn-outline {
    padding: 15px 34px; background: transparent; color: #F8F8F2;
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600;
    border: 1px solid #2A2A34; cursor: pointer; transition: all .2s;
    letter-spacing: .02em; text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { border-color: #D4FF00; color: #D4FF00; }
  .hero-stats { display: flex; border-top: 1px solid #1E1E24; padding-top: 44px; }
  .hero-stat { flex: 1; }
  .hero-stat + .hero-stat { padding-left: 36px; border-left: 1px solid #1E1E24; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
    color: #F8F8F2; letter-spacing: -1.5px; line-height: 1;
  }
  .stat-num span { color: #D4FF00; }
  .stat-label { font-size: 13px; color: #6A6A76; margin-top: 5px; }

  /* ── Ticker ── */
  .ticker { background: #D4FF00; overflow: hidden; padding: 15px 0; white-space: nowrap; }
  .ticker-track { display: inline-flex; animation: marquee 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
  .ticker-item {
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800;
    color: #0A0A0C; letter-spacing: .1em; text-transform: uppercase;
    padding: 0 28px; display: inline-flex; align-items: center; gap: 28px;
  }
  .ticker-item::after { content: '✦'; font-size: 9px; opacity: .5; }

  /* ── Services ── */
  .services { background: #0A0A0C; }
  .services-top { margin-bottom: 60px; }
  .services-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(30px, 4vw, 52px);
    font-weight: 800; line-height: 1.08; letter-spacing: -1.2px; color: #F8F8F2; max-width: 560px;
  }
  .services-headline em { font-style: normal; color: #D4FF00; }
  .bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .bento-card {
    background: #111116; border: 1px solid #1E1E24;
    padding: 34px; position: relative; overflow: hidden;
    transition: border-color .3s, transform .25s;
  }
  .bento-card:hover { border-color: rgba(212,255,0,.35); transform: translateY(-3px); }
  .bento-card::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 85% 15%, rgba(212,255,0,.03) 0%, transparent 55%);
    pointer-events: none;
  }
  .bento-card.wide { grid-column: span 2; }
  .svc-num {
    font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
    color: rgba(212,255,0,.35); letter-spacing: .18em; text-transform: uppercase; margin-bottom: 18px;
  }
  .svc-icon {
    width: 46px; height: 46px; background: rgba(212,255,0,.09);
    border: 1px solid rgba(212,255,0,.18); display: flex;
    align-items: center; justify-content: center; font-size: 20px; margin-bottom: 22px;
  }
  .svc-title {
    font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 800;
    color: #F8F8F2; margin-bottom: 10px; letter-spacing: -.3px;
  }
  .svc-desc { font-size: 14px; color: #8A8A96; line-height: 1.72; }
  .svc-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 22px; }
  .svc-tag {
    padding: 4px 10px; border: 1px solid #2A2A34;
    font-size: 11px; color: #6A6A76; font-weight: 500; letter-spacing: .04em;
  }

  /* ── Testimonials ── */
  .testimonials { background: #0C0C10; }
  .testi-top {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 56px; flex-wrap: wrap; gap: 24px;
  }
  .testi-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(26px, 3.5vw, 46px);
    font-weight: 800; letter-spacing: -1px; color: #F8F8F2;
  }
  .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .testi-card {
    background: #111116; border: 1px solid #1E1E24; padding: 30px;
    transition: border-color .3s;
  }
  .testi-card:hover { border-color: rgba(212,255,0,.28); }
  .stars { color: #D4FF00; font-size: 13px; margin-bottom: 18px; letter-spacing: 1px; }
  .testi-quote {
    font-size: 14.5px; color: #C8C8D4; line-height: 1.82; margin-bottom: 26px;
  }
  .testi-quote::before { content: '“'; }
  .testi-quote::after { content: '”'; }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .avatar {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #D4FF00 0%, #8CC800 100%);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; color: #0A0A0C;
  }
  .author-name { font-weight: 700; font-size: 14px; color: #F8F8F2; }
  .author-role { font-size: 12px; color: #6A6A76; margin-top: 2px; }

  /* ── FAQ ── */
  .faq { background: #0A0A0C; }
  .faq-inner { display: grid; grid-template-columns: 1fr 1.65fr; gap: 88px; align-items: start; }
  .faq-sticky { position: sticky; top: 120px; }
  .faq-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(26px, 3.5vw, 46px);
    font-weight: 800; letter-spacing: -1px; color: #F8F8F2; margin-bottom: 18px;
  }
  .faq-sub { font-size: 15px; color: #8A8A96; line-height: 1.72; margin-bottom: 34px; }
  .link-accent {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 700; color: #D4FF00;
    text-decoration: none; transition: gap .2s;
  }
  .link-accent:hover { gap: 14px; }
  .faq-list { display: flex; flex-direction: column; }
  .faq-item { border-bottom: 1px solid #1E1E24; }
  .faq-btn {
    width: 100%; padding: 24px 0; background: none; border: none;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; text-align: left; gap: 16px;
  }
  .faq-q {
    font-size: 16px; font-weight: 600; color: #F8F8F2;
    letter-spacing: -.1px; transition: color .2s;
  }
  .faq-btn:hover .faq-q { color: #D4FF00; }
  .faq-icon {
    flex-shrink: 0; width: 28px; height: 28px; border: 1px solid #2A2A34;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 300; color: #D4FF00;
    transition: transform .3s, background .2s; line-height: 1;
  }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: rgba(212,255,0,.1); }
  .faq-body {
    display: grid; grid-template-rows: 0fr;
    transition: grid-template-rows .35s ease;
  }
  .faq-item.open .faq-body { grid-template-rows: 1fr; }
  .faq-body-inner { overflow: hidden; }
  .faq-answer { font-size: 15px; color: #8A8A96; line-height: 1.8; padding-bottom: 24px; }

  /* ── Contact ── */
  .contact { background: #0C0C10; }
  .contact-inner { display: grid; grid-template-columns: 1fr 1.45fr; gap: 80px; align-items: start; }
  .contact-headline {
    font-family: 'Syne', sans-serif; font-size: clamp(26px, 3.5vw, 44px);
    font-weight: 800; letter-spacing: -1px; color: #F8F8F2; margin-bottom: 18px;
  }
  .contact-sub { font-size: 15px; color: #8A8A96; line-height: 1.72; margin-bottom: 40px; }
  .info-list { display: flex; flex-direction: column; gap: 20px; }
  .info-item { display: flex; align-items: flex-start; gap: 14px; }
  .info-icon {
    width: 38px; height: 38px; background: rgba(212,255,0,.08);
    border: 1px solid rgba(212,255,0,.18); display: flex;
    align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .info-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; margin-bottom: 3px; }
  .info-val { font-size: 14px; color: #C8C8D4; }
  .contact-form { display: flex; flex-direction: column; gap: 18px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6A6A76; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 13px 15px;
    background: #111116; border: 1px solid #1E1E24;
    color: #F8F8F2; font-family: 'Space Grotesk', sans-serif;
    font-size: 15px; outline: none; transition: border-color .2s;
    -webkit-appearance: none; appearance: none;
  }
  .form-input::placeholder, .form-textarea::placeholder { color: #3A3A44; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #D4FF00; }
  .form-textarea { resize: vertical; min-height: 118px; }
  .form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8A96' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 42px; cursor: pointer;
  }
  .form-select option { background: #111116; }
  .btn-submit {
    padding: 15px 34px; background: #D4FF00; color: #0A0A0C;
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    border: none; cursor: pointer; transition: all .2s;
    align-self: flex-start; letter-spacing: .02em;
  }
  .btn-submit:hover { background: #eeff55; transform: translateY(-2px); }
  .btn-submit:disabled { background: #2A2A34; color: #6A6A76; cursor: not-allowed; transform: none; }
  .form-success {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 20px; background: rgba(212,255,0,.08);
    border: 1px solid rgba(212,255,0,.22);
  }
  .success-check {
    width: 32px; height: 32px; background: #D4FF00; color: #0A0A0C;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; flex-shrink: 0;
  }
  .success-title { font-weight: 700; color: #F8F8F2; margin-bottom: 4px; }
  .success-sub { font-size: 14px; color: #8A8A96; }

  /* ── Footer ── */
  .footer { background: #0A0A0C; border-top: 1px solid #1E1E24; padding: 72px 0 36px; }
  .footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 60px; }
  .f-logo { font-family: 'Syne', sans-serif; font-size: 23px; font-weight: 800; color: #F8F8F2; letter-spacing: -.5px; margin-bottom: 12px; }
  .f-logo span { color: #D4FF00; }
  .f-desc { font-size: 14px; color: #6A6A76; line-height: 1.7; max-width: 250px; margin-bottom: 24px; }
  .f-socials { display: flex; gap: 8px; }
  .f-social {
    width: 36px; height: 36px; border: 1px solid #1E1E24;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #6A6A76; text-decoration: none;
    transition: all .2s;
  }
  .f-social:hover { border-color: #D4FF00; color: #D4FF00; }
  .f-col-title { font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #F8F8F2; margin-bottom: 18px; }
  .f-links { display: flex; flex-direction: column; gap: 11px; list-style: none; }
  .f-links a { font-size: 14px; color: #6A6A76; text-decoration: none; transition: color .2s; }
  .f-links a:hover { color: #D4FF00; }
  .footer-bottom {
    border-top: 1px solid #1E1E24; padding-top: 28px;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;
  }
  .f-copy { font-size: 13px; color: #3A3A44; }
  .f-legal { display: flex; gap: 22px; }
  .f-legal a { font-size: 13px; color: #3A3A44; text-decoration: none; transition: color .2s; }
  .f-legal a:hover { color: #8A8A96; }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    section { padding: 80px 0; }
    .bento { grid-template-columns: 1fr 1fr; }
    .bento-card.wide { grid-column: span 2; }
    .testi-grid { grid-template-columns: 1fr 1fr; }
    .faq-inner { grid-template-columns: 1fr; gap: 48px; }
    .faq-sticky { position: static; }
    .contact-inner { grid-template-columns: 1fr; gap: 52px; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .nav-links { display: none; }
    .btn-nav { display: none; }
    .hamburger { display: flex; }
    .hero-headline { letter-spacing: -2px; }
    .hero-stats { flex-direction: column; gap: 24px; }
    .hero-stat + .hero-stat { border-left: none; border-top: 1px solid #1E1E24; padding-left: 0; padding-top: 24px; }
    .bento { grid-template-columns: 1fr; }
    .bento-card.wide { grid-column: span 1; }
    .testi-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .testi-top { flex-direction: column; align-items: flex-start; }
    .footer-top { grid-template-columns: 1fr; }
  }
`;

/* ── Data ─────────────────────────────────────────────────────── */

const SERVICES = [
  {
    num: "01", icon: "📱", wide: true,
    title: "Social Media Management",
    desc: "We take full ownership of your social presence — strategy, content creation, scheduling, community engagement, and monthly analytics. Your audience grows. You focus on the business.",
    tags: ["Instagram", "TikTok", "LinkedIn", "X (Twitter)", "YouTube", "Facebook"],
  },
  {
    num: "02", icon: "🎬",
    title: "Video Production",
    desc: "From concept to final cut — short-form Reels and TikToks to long-form brand films and ad campaigns. Built to stop the scroll.",
    tags: ["Reels", "Brand Films", "Ads", "YouTube"],
  },
  {
    num: "03", icon: "🎨",
    title: "Graphic Design",
    desc: "Visual identities, ad creatives, and motion graphics that make your brand instantly recognizable anywhere it shows up.",
    tags: ["Branding", "Ad Creatives", "Motion", "UI"],
  },
  {
    num: "04", icon: "✍️", wide: true,
    title: "Content Strategy & Copywriting",
    desc: "We craft the words and the plan — blogs, captions, email sequences, ad copy, and full content calendars. Strategy-led writing that converts attention into action.",
    tags: ["Blog", "Captions", "Scripts", "Email", "Ad Copy"],
  },
  {
    num: "05", icon: "📊",
    title: "Analytics & Reporting",
    desc: "Clear, monthly data dashboards — so you always know what's working, what's not, and where to push next.",
    tags: ["Reports", "KPIs", "Growth"],
  },
  {
    num: "06", icon: "🔍",
    title: "Brand Audit",
    desc: "A full diagnostic of where your brand stands right now — and the roadmap to where it should be.",
    tags: ["Competitive Analysis", "Strategy"],
  },
];

const TESTIMONIALS = [
  {
    quote: "Since partnering with MediaFlow, our Instagram engagement tripled within 90 days. They don't just manage accounts — they build communities.",
    name: "Aisha Kolade", role: "CMO, UrbanThread Lagos", initials: "AK",
  },
  {
    quote: "The video team delivered our brand film in two weeks. Cinema-level quality. Our CEO cried — in a good way.",
    name: "James Osei", role: "Founder, AuraCo", initials: "JO",
  },
  {
    quote: "We were drowning in content requests. MediaFlow stepped in and gave us a system — now everything just runs.",
    name: "Sandra Adeyemi", role: "Marketing Director, Prestige Group", initials: "SA",
  },
  {
    quote: "Their copywriting team rewrote our entire email sequence. Revenue from email went up 41% in the first month.",
    name: "Tunde Obileye", role: "CEO, GrowthBridge", initials: "TO",
  },
  {
    quote: "Finally, an agency that actually understands our audience. The content doesn't feel outsourced — it feels authentic.",
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
    a: "We start with a discovery call to understand your brand, goals, and current challenges. We then build a custom strategy, assemble your dedicated team, and handle execution — keeping you informed without pulling you into the day-to-day.",
  },
  {
    q: "Do I retain creative control?",
    a: "Absolutely. We work as an extension of your team, not a replacement. You approve all content before it goes live, and every decision aligns with your brand voice and direction.",
  },
  {
    q: "What industries do you work with?",
    a: "We work across fashion, e-commerce, fintech, hospitality, real estate, FMCG, and professional services — among others. Our teams are briefed on your industry before work begins.",
  },
  {
    q: "How long before we see results?",
    a: "Most clients see measurable improvement in engagement and reach within 60–90 days. For revenue-tied goals like lead generation, we set realistic 3–6 month benchmarks upfront.",
  },
  {
    q: "What are your pricing structures?",
    a: "We offer monthly retainers for ongoing management and project packages for one-off work. Pricing depends on scope and service mix. Book a call and we'll have a tailored quote within 24 hours.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. We take confidentiality seriously and are happy to sign an NDA before any sensitive information is shared. Client trust is non-negotiable for us.",
  },
];

const TICKER = [
  "Social Media Management", "Video Production", "Brand Strategy",
  "Graphic Design", "Content Writing", "Growth Marketing",
  "Analytics & Reporting", "Brand Audits", "Email Marketing",
];

/* ── Helpers ──────────────────────────────────────────────────── */

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ── Navbar ───────────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = (id) => { scrollTo(id); setOpen(false); };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo("home"); }}>
            MEDIA<span>FLOW</span>
          </a>
          <ul className="nav-links">
            {[["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id,label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={e => { e.preventDefault(); nav(id); }}>{label}</a>
              </li>
            ))}
          </ul>
          <button className="btn-nav" onClick={() => nav("contact")}>Start a Project →</button>
          <button className="hamburger" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          {[["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id,label]) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); nav(id); }}>{label}</a>
          ))}
          <div style={{ paddingTop: 16 }}>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => nav("contact")}>
              Start a Project →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */

function Hero() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow-2" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              Your Media Partner
            </div>
            <h1 className="hero-headline">
              We handle<br />
              your media.<br />
              You chase<br />
              <em>your goals.</em>
            </h1>
            <p className="hero-sub">
              Full-service media outsourcing and social media management for ambitious brands.
              Strategy, content, production — all under one roof.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => scrollTo("contact")}>
                Start a Project
              </button>
              <button className="btn-outline" onClick={() => scrollTo("services")}>
                See What We Do →
              </button>
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
          {[...TICKER, ...TICKER].map((item, i) => (
            <span className="ticker-item" key={i}>{item}</span>
          ))}
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
          <h2 className="services-headline">
            Everything your brand<br />needs to <em>dominate</em>
          </h2>
        </div>
        <div className="bento">
          {SERVICES.map(s => (
            <div key={s.num} className={`bento-card${s.wide ? " wide" : ""}`}>
              <div className="svc-num">{s.num}</div>
              <div className="svc-icon">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-tags">
                {s.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────────── */

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="testi-top">
          <div>
            <div className="section-label">Client Stories</div>
            <h2 className="testi-headline">Trusted by<br />ambitious brands</h2>
          </div>
          <button className="btn-outline" style={{ alignSelf: "flex-end" }} onClick={() => scrollTo("contact")}>
            Become a Client
          </button>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testi-card">
              <div className="stars">{"★★★★★"}</div>
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

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-inner">
          <div className="faq-sticky">
            <div className="section-label">FAQ</div>
            <h2 className="faq-headline">Questions<br />we get<br />a lot</h2>
            <p className="faq-sub">
              Can't find what you're looking for? A team member will respond within 2 hours.
            </p>
            <a href="#contact" className="link-accent" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>
              Ask us directly →
            </a>
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
    setTimeout(() => { setSent(true); setSending(false); }, 1500);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-inner">
          <div>
            <div className="section-label">Get in Touch</div>
            <h2 className="contact-headline">Let's build<br />something<br />great together</h2>
            <p className="contact-sub">
              Tell us about your project and we'll respond within 24 hours with a tailored proposal.
            </p>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-val">hello@mediaflow.agency</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <div className="info-label">Phone / WhatsApp</div>
                  <div className="info-val">+234 800 000 0000</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">⏰</div>
                <div>
                  <div className="info-label">Response Time</div>
                  <div className="info-val">Within 2 hours on business days</div>
                </div>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="form-success">
              <div className="success-check">✓</div>
              <div>
                <div className="success-title">Message received!</div>
                <div className="success-sub">We'll be in touch within 24 hours with next steps.</div>
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input className="form-input" placeholder="Ade Okonkwo" value={form.name} onChange={set("name")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" placeholder="ade@brand.com" value={form.email} onChange={set("email")} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Your brand or agency" value={form.company} onChange={set("company")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Needed</label>
                  <select className="form-select" value={form.service} onChange={set("service")}>
                    <option value="">Select a service</option>
                    <option>Social Media Management</option>
                    <option>Video Production</option>
                    <option>Graphic Design</option>
                    <option>Content Strategy & Copywriting</option>
                    <option>Full-Service Package</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tell us about your project *</label>
                <textarea className="form-textarea" placeholder="What are your goals? What's your timeline? Any context helps..." value={form.message} onChange={set("message")} required />
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

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="f-logo">MEDIA<span>FLOW</span></div>
            <p className="f-desc">Full-service media outsourcing and social media management for brands that refuse to blend in.</p>
            <div className="f-socials">
              {[["X","𝕏"],["LI","in"],["IG","IG"],["YT","YT"]].map(([label, icon]) => (
                <a key={label} href="#" className="f-social" aria-label={label}>{icon}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="f-col-title">Quick Links</div>
            <ul className="f-links">
              {[["home","Home"],["services","Services"],["testimonials","Work"],["faq","FAQ"],["contact","Contact"]].map(([id,label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="f-col-title">Services</div>
            <ul className="f-links">
              {["Social Media Management","Video Production","Graphic Design","Copywriting","Analytics","Brand Audits"].map(s => (
                <li key={s}><a href="#services" onClick={e => { e.preventDefault(); scrollTo("services"); }}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="f-col-title">Contact</div>
            <ul className="f-links">
              <li><a href="mailto:hello@mediaflow.agency">hello@mediaflow.agency</a></li>
              <li><a href="tel:+2348000000000">+234 800 000 0000</a></li>
              <li style={{ color: "#3A3A44", fontSize: 13, lineHeight: 1.65, cursor: "default" }}>Lagos, Nigeria &amp;<br />Remote Worldwide</li>
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

/* ── App ──────────────────────────────────────────────────────── */

export default function App() {
  return (
    <>
      <style>{FONTS}</style>
      <style>{STYLES}</style>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
