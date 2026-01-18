const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'src/app/globals.css');
const styles = `
/* --- PROJECT DETAIL (PD) STYLES --- */
.pd-main {
  background-color: #050505;
  color: white;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

.pd-loading, .pd-error {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #050505;
  color: white;
  gap: 1.5rem;
}

.pd-loader {
  width: 40px; height: 40px;
  border: 3px solid rgba(118, 40, 229, 0.2);
  border-top-color: #7628E5;
  border-radius: 50%;
  animation: pd-spin 1s linear infinite;
}

@keyframes pd-spin { to { transform: rotate(360deg); } }

/* Nav */
.pd-nav {
  position: fixed;
  top: 0; width: 100%;
  z-index: 1000;
  background: rgba(5, 5, 5, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.pd-nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pd-nav-back {
  background: transparent; border: none; color: rgba(255,255,255,0.6);
  font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em;
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  transition: 0.3s;
}

.pd-nav-back:hover { color: #7628E5; transform: translateX(-5px); }

.pd-nav-brand { display: flex; align-items: center; gap: 15px; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; }
.pd-nav-logo { width: 28px; height: 28px; object-fit: contain; }

.pd-visit-btn {
  background: #7628E5; color: white; border-radius: 999px;
  padding: 0.6rem 1.5rem; font-weight: 700; font-size: 0.75rem;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 4px 15px rgba(118, 40, 229, 0.3);
  transition: 0.3s;
}

.pd-visit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(118, 40, 229, 0.5); }

/* Side Nav */
.pd-side-nav {
  position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%);
  z-index: 500; display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-end;
}

.pd-dot-wrap {
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 15px; transition: 0.3s;
}

.pd-dot-label {
  font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4); opacity: 0; transform: translateX(10px); transition: 0.3s;
}

.pd-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); transition: 0.3s;
}

.pd-dot-wrap.active .pd-dot { background: #7628E5; transform: scale(1.5); box-shadow: 0 0 15px #7628E5; }
.pd-dot-wrap.active .pd-dot-label, .pd-dot-wrap:hover .pd-dot-label { opacity: 1; transform: translateX(0); }

/* Hero */
.pd-hero { padding: 12rem 0 8rem; position: relative; }
.pd-hero-glow {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 100%; height: 60%;
  background: radial-gradient(circle at center, rgba(118, 40, 229, 0.15), transparent 70%);
  z-index: 0;
}

.pd-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 1; }
.pd-tag { display: inline-flex; align-items: center; gap: 8px; font-weight: 900; font-size: 0.75rem; letter-spacing: 0.2em; color: #7628E5; margin-bottom: 1.5rem; }
.pd-title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 2rem; }
.pd-pitch { font-size: 1.4rem; opacity: 0.6; max-width: 800px; line-height: 1.5; }

/* Sections */
.pd-section { padding: 8rem 0; }
.pd-section-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem; }
.pd-section-title.centered { text-align: center; }

.pd-grid-half { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
.pd-grid-half.reversed { direction: rtl; }
.pd-grid-half.reversed > * { direction: ltr; }

.pd-markdown { font-size: 1.1rem; line-height: 1.7; opacity: 0.8; }
.pd-markdown p { margin-bottom: 1.5rem; }

.pd-meta-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
  padding: 3rem; border-radius: 32px; backdrop-filter: blur(10px);
}
.pd-meta-card h3 { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.15em; color: #7628E5; margin-bottom: 2rem; }
.pd-tech-list { display: flex; flex-wrap: wrap; gap: 10px; }
.pd-tech-pill { background: rgba(118, 40, 229, 0.1); border: 1px solid rgba(118, 40, 229, 0.2); color: white; padding: 6px 15px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }

/* SNAKE PATH JOURNEY */
.pd-snake-wrap { position: relative; max-width: 900px; margin: 4rem auto 0; padding: 4rem 0; }
.pd-snake-line { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100%; height: 100%; z-index: 0; opacity: 0.3; }

.pd-phase-item { display: flex; align-items: center; margin-bottom: 6rem; position: relative; z-index: 1; }
.pd-phase-item.left { justify-content: flex-start; padding-right: 50%; }
.pd-phase-item.right { justify-content: flex-end; padding-left: 50%; text-align: right; }

.pd-phase-content {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  padding: 2.5rem; border-radius: 24px; backdrop-filter: blur(10px); width: 100%;
  transition: 0.3s;
}
.pd-phase-item:hover .pd-phase-content { border-color: #7628E5; transform: translateY(-5px); }

.pd-phase-header { display: flex; align-items: center; gap: 15px; margin-bottom: 1rem; }
.pd-phase-item.right .pd-phase-header { flex-direction: row-reverse; }

.pd-phase-num { font-size: 0.8rem; font-weight: 900; color: #7628E5; opacity: 0.5; }
.pd-phase-content h3 { font-size: 1.25rem; font-weight: 800; }
.pd-phase-content p { font-size: 0.95rem; opacity: 0.6; line-height: 1.6; }

.pd-phase-dot {
  position: absolute; left: 50%; transform: translateX(-50%);
  width: 14px; height: 14px; border-radius: 50%; background: #7628E5;
  box-shadow: 0 0 15px #7628E5; z-index: 2;
}

/* Gallery */
.gallery-dark { background: #000; }
.pd-gallery-carousel { border-radius: 40px; overflow: hidden; background: #080808; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 50px 100px rgba(0,0,0,0.5); }
.pd-gallery-main { height: 70vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pd-gallery-img { max-width: 90%; max-height: 85%; object-fit: contain; }

.pd-gallery-nav {
  position: absolute; top: 50%; transform: translateY(-50%); width: 60px; height: 60px;
  border-radius: 50%; background: rgba(118, 40, 229, 0.1); border: 1px solid rgba(118, 40, 229, 0.2);
  color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
}
.pd-gallery-nav:hover { background: #7628E5; border-color: #7628E5; }
.pd-gallery-nav.prev { left: 40px; }
.pd-gallery-nav.next { right: 40px; }

.pd-gallery-thumbs { padding: 2rem; display: flex; justify-content: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.03); }
.pd-thumb-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; cursor: pointer; transition: 0.3s; }
.pd-thumb-dot.active { background: #7628E5; transform: scale(1.5); }

/* Outcome */
.pd-outcome-card {
  background: rgba(118, 40, 229, 0.05); border: 1px solid rgba(118, 40, 229, 0.2);
  padding: 4rem; border-radius: 40px; text-align: center;
}
.pd-outcome-val { font-size: 5rem; font-weight: 900; margin: 1rem 0; color: white; }
.pd-outcome-label { font-size: 0.8rem; font-weight: 800; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.2em; }

.pd-footer { padding: 6rem 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
.pd-scroll-top { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 1rem 2.5rem; border-radius: 999px; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.3s; }
.pd-scroll-top:hover { border-color: #7628E5; color: #7628E5; }

@media (max-width: 1024px) {
  .pd-grid-half { grid-template-columns: 1fr; gap: 3rem; }
  .pd-grid-half.reversed { direction: ltr; }
  .pd-nav-content { padding: 1.2rem 2rem; }
  .pd-side-nav { display: none; }
  .pd-nav-back span { display: none; }
  .pd-phase-item { padding: 0 !important; margin-bottom: 4rem; }
  .pd-phase-dot { display: none; }
  .pd-snake-line { display: none; }
}
`;

fs.appendFileSync(targetPath, styles);
console.log('Appended PD styles to globals.css');
