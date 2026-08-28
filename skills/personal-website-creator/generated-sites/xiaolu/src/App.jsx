import { useEffect, useRef, useState } from "react";
import { content } from "./content.js";

const DOODLES = [
  { cls: "cloud cloud-left" },
  { cls: "cloud cloud-right" },
  { cls: "star star-left", text: "\u2605" },
  { cls: "star star-right", text: "\u2605" },
  { cls: "heart heart-left", text: "\u2665" },
  { cls: "heart heart-right", text: "\u2665" },
  { cls: "flower" },
  { cls: "curl curl-left" },
  { cls: "curl curl-right" },
  { cls: "desk-line" },
  { cls: "cat" },
  { cls: "person" },
];

function useScrollReveal() {
  useEffect(() => {
    document.body.classList.add("motion-ready");
    const targets = document.querySelectorAll(
      ".hero-copy, .section, .section-heading, .work-card, .note-card, .contact-card, .doodle"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      document.body.classList.remove("motion-ready");
    };
  }, []);
}

function useCustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ring = document.querySelector(".cursor-ring");
    const dot = document.querySelector(".cursor-dot");
    if (!ring || !dot) return;
    let rx = -100, ry = -100, dx = -100, dy = -100;
    let raf = 0;
    const onMove = (e) => {
      dx = e.clientX;
      dy = e.clientY;
    };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest("a, button, .work-card, .note-card, .contact-card")) {
        document.body.classList.add("cursor-hot");
      } else {
        document.body.classList.remove("cursor-hot");
      }
    };
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);
}

function ClickSpark({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      ctx.scale(dpr, dpr);
    };
    resize();

    const colors = ["#ff7048", "#91cdf7", "#cfe66d", "#ffd465", "#ffd4ea"];
    const onClick = (e) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 3 + Math.random() * 4,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.022;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    parent.addEventListener("click", onClick);
    window.addEventListener("resize", resize);
    return () => {
      parent.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);

  return (
    <div className="click-spark">
      <canvas ref={canvasRef} />
    </div>
  );
}

function WorkCard({ work, index }) {
  const canvasRef = useRef(null);
  const num = String(index + 1).padStart(2, "0");
  return (
    <article className={`work-card work-card-${work.color}`}>
      <ClickSpark canvasRef={canvasRef} />
      <div className="work-visual">
        <span className="work-number">{num}</span>
        <div className="browser-mock">
          <span />
          <span />
          <span />
          {work.image ? (
            <img src={work.image} alt={work.title} />
          ) : (
            <strong>{work.title}</strong>
          )}
        </div>
        <span className="work-shape" />
      </div>
      <div className="work-content">
        <p>{work.type}</p>
        <h3>{work.title}</h3>
        <span className="work-year">{work.year}</span>
        <p className="work-description">{work.description}</p>
        <p className="work-detail">{work.detail}</p>
        <div className="tag-list">
          {work.tags.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>
        {work.link && (
          <a
            href={work.link}
            target="_blank"
            rel="noopener noreferrer"
            className="work-link"
          >
            访问作品 →
          </a>
        )}
      </div>
    </article>
  );
}

export default function App() {
  useScrollReveal();
  useCustomCursor();
  const { hero, workSection, works, aboutSection, about, skills, experiences, contact, footer } = content;

  return (
    <>
      <div className="grain-layer" />
      <div className="cursor-ring" />
      <div className="cursor-dot" />

      <header className="site-header">
        <nav className="nav-group">
          <a href="#works">Work</a>
          <a href="#about">About</a>
        </nav>
        <a href="#top" className="brand">{hero.brand}</a>
        <nav className="nav-group">
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="doodle-stage">
            {DOODLES.map((d, i) => (
              <span key={i} className={`doodle ${d.cls}`}>
                {d.text || ""}
              </span>
            ))}
          </div>
          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>
              {hero.name}
              <span>{hero.introLine1}</span>
            </h1>
            <div className="hero-actions">
              <a href="#works" className="primary-button">See Work</a>
              <p>
                {hero.introLine2}
                <span>{hero.introLine3}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="works">
          <div className="section-heading">
            <p>{workSection.eyebrow}</p>
            <h2>{workSection.title}</h2>
          </div>
          <div className="work-grid">
            {works.map((work, i) => (
              <WorkCard key={i} work={work} index={i} />
            ))}
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-heading">
            <p>{aboutSection.eyebrow}</p>
            <h2>{aboutSection.title}</h2>
          </div>
          <div className="about-layout">
            <div className="note-card intro-card">
              <span className="pin" />
              <div className="profile-stamp">
                <img src={about.profileImage} alt={about.profileAlt} />
                <div>
                  <span>ABOUT</span>
                  <h3>{about.name}</h3>
                </div>
              </div>
              <p>{about.body}</p>
              <div className="skill-cloud">
                {skills.map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
            <div className="note-card experience-card">
              <span className="pin" />
              <h3>Experience</h3>
              <div className="timeline">
                {experiences.map((exp, i) => (
                  <div className="timeline-item" key={i}>
                    <div>
                      <strong>{exp.role}</strong>
                      <span>{exp.company}</span>
                    </div>
                    <p>{exp.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-card">
            <h2>{contact.title}</h2>
            <div className="contact-list">
              {contact.items.map((item, i) => (
                <a key={i} href={item.href}>
                  <span>{item.label}</span>
                  {item.value}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">{footer}</footer>
    </>
  );
}
