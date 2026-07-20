import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HallTransitionProps {
  isActive: boolean;
  hallType: "film" | "music" | "net" | "honor" | "drawer" | null;
  onComplete?: () => void;
}

type Phase =
  | "idle"
  | "dimming"
  | "door"
  | "lighting"
  | "personality"
  | "done";

/* ------------------------------------------------------------------ */
/*  Sound helpers (Web Audio API, no external files)                   */
/* ------------------------------------------------------------------ */

type SoundType =
  | "dim"
  | "light"
  | "click"
  | "cassette"
  | "modem"
  | "tick"
  | "curtain"
  | "pluck"
  | "lock"
  | "rumble";

function playTransitionSound(type: SoundType): void {
  try {
    const ctx = new AudioContext();

    switch (type) {
      case "dim": {
        // 80Hz sine, gain 0.08->0 over 400ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 80;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        break;
      }
      case "light": {
        // 200->400Hz sweep, gain 0->0.04->0 over 270ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.27);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.135);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.27);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.27);
        break;
      }
      case "click": {
        // 50ms white noise burst bandpass 2kHz
        const bufLen = Math.floor(ctx.sampleRate * 0.05);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        const bp = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = buf;
        bp.type = "bandpass";
        bp.frequency.value = 2000;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        src.connect(bp).connect(gain).connect(ctx.destination);
        src.start();
        break;
      }
      case "cassette": {
        // 30ms 150Hz triangle snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = 150;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
        break;
      }
      case "modem": {
        // highpass noise 3kHz, 180ms
        const bufLen = Math.floor(ctx.sampleRate * 0.18);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        const hp = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = buf;
        hp.type = "highpass";
        hp.frequency.value = 3000;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        src.connect(hp).connect(gain).connect(ctx.destination);
        src.start();
        break;
      }
      case "tick": {
        // 20ms 1kHz sine
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.02);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
        break;
      }
      case "curtain": {
        // 120->60Hz, gain 0.06, 200ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
      }
      case "pluck": {
        // 600Hz, gain 0.03, 15ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.015);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.015);
        break;
      }
      case "lock": {
        // metallic noise lowpass 500Hz, 100ms
        const bufLen = Math.floor(ctx.sampleRate * 0.1);
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        const lp = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = buf;
        lp.type = "lowpass";
        lp.frequency.value = 500;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        src.connect(lp).connect(gain).connect(ctx.destination);
        src.start();
        break;
      }
      case "rumble": {
        // 80Hz, gain 0.04, 150ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 80;
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        break;
      }
    }
  } catch {
    // silent fallback
  }
}

/* ------------------------------------------------------------------ */
/*  SVG sine wave path helper                                         */
/* ------------------------------------------------------------------ */

function buildSinePath(
  width: number,
  height: number,
  amplitude: number,
  cycles: number,
): string {
  const steps = 60;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * width;
    const y = height / 2 + Math.sin(t * cycles * Math.PI * 2) * amplitude;
    d += (i === 0 ? "M" : "L") + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/*  Film perforations helper                                           */
/* ------------------------------------------------------------------ */

function FilmPerforations() {
  const circles: React.JSX.Element[] = [];
  const count = 14;
  const r = 5;
  const gap = 22;
  const totalW = count * gap;
  for (let i = 0; i < count; i++) {
    circles.push(
      <circle
        key={i}
        cx={8 + i * gap}
        cy={10}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={1.2}
      />,
    );
  }
  return (
    <svg
      width={totalW + 16}
      height={20}
      viewBox={`0 0 ${totalW + 16} 20`}
      className="ht-film-strip-svg"
    >
      {circles}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Cassette shape helper                                              */
/* ------------------------------------------------------------------ */

function CassetteShape() {
  return (
    <svg width="80" height="48" viewBox="0 0 80 48" className="ht-cassette-svg">
      <rect
        x="2"
        y="2"
        width="76"
        height="44"
        rx="4"
        fill="none"
        stroke="rgba(180,170,150,0.7)"
        strokeWidth={1.5}
      />
      <rect
        x="18"
        y="12"
        width="16"
        height="16"
        rx="8"
        fill="none"
        stroke="rgba(180,170,150,0.6)"
        strokeWidth={1}
      />
      <rect
        x="46"
        y="12"
        width="16"
        height="16"
        rx="8"
        fill="none"
        stroke="rgba(180,170,150,0.6)"
        strokeWidth={1}
      />
      <rect
        x="26"
        y="36"
        width="28"
        height="4"
        rx="1"
        fill="rgba(180,170,150,0.35)"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Lock SVG helper                                                    */
/* ------------------------------------------------------------------ */

function LockShape() {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" className="ht-lock-svg">
      {/* shackle */}
      <path
        d="M14 24 V16 A10 10 0 0 1 34 16 V24"
        fill="none"
        stroke="rgba(184,134,61,0.75)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* body */}
      <rect
        x="8"
        y="24"
        width="32"
        height="26"
        rx="3"
        fill="rgba(184,134,61,0.15)"
        stroke="rgba(184,134,61,0.75)"
        strokeWidth={2}
      />
      {/* keyhole */}
      <circle cx="24" cy="35" r="3" fill="rgba(184,134,61,0.6)" />
      <rect x="23" y="36" width="2" height="6" rx="1" fill="rgba(184,134,61,0.6)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const HallTransition: React.FC<HallTransitionProps> = ({
  isActive,
  hallType,
  onComplete,
}) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lyricsRef = useRef<HTMLSpanElement>(null);
  const [lyricsText, setLyricsText] = useState("");

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /* -- schedule a helper -- */
  const schedule = useCallback(
    (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    },
    [],
  );

  /* -- typewriter effect for music lyrics -- */
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* -- start transition sequence -- */
  useEffect(() => {
    if (!isActive || !hallType) {
      // When deactivated, start fade-out
      if (visible) {
        setFadingOut(true);
        const id = setTimeout(() => {
          setVisible(false);
          setFadingOut(false);
          setPhase("idle");
          onComplete?.();
        }, 300);
        timersRef.current.push(id);
      }
      return;
    }

    // Reset state for new transition
    clearAllTimers();
    setVisible(true);
    setFadingOut(false);
    setLyricsText("");
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }

    /* ---- Phase sequence ---- */

    // dimming: 0-270ms
    setPhase("dimming");
    schedule(() => playTransitionSound("dim"), 0);

    // door: 270-480ms
    schedule(() => setPhase("door"), 270);

    // lighting: 480-750ms
    schedule(() => {
      setPhase("lighting");
      playTransitionSound("light");
    }, 480);

    // personality: 750-1500ms
    schedule(() => setPhase("personality"), 750);

    /* ---- Hall-specific sounds ---- */
    if (hallType === "film") {
      schedule(() => playTransitionSound("click"), 750 + 600);
    } else if (hallType === "music") {
      schedule(() => playTransitionSound("cassette"), 750 + 300);
    } else if (hallType === "net") {
      schedule(() => playTransitionSound("modem"), 750 + 150);
      schedule(() => playTransitionSound("tick"), 750 + 570);
    } else if (hallType === "honor") {
      schedule(() => playTransitionSound("curtain"), 750 + 150);
      schedule(() => playTransitionSound("pluck"), 750 + 540);
    } else if (hallType === "drawer") {
      schedule(() => playTransitionSound("lock"), 750 + 150);
      schedule(() => playTransitionSound("rumble"), 750 + 300);
    }

    /* ---- Music typewriter lyrics ---- */
    if (hallType === "music") {
      const lyric = "~ playing ~";
      let idx = 0;
      schedule(() => {
        typewriterRef.current = setInterval(() => {
          idx++;
          setLyricsText(lyric.slice(0, idx));
          if (idx >= lyric.length && typewriterRef.current) {
            clearInterval(typewriterRef.current);
            typewriterRef.current = null;
          }
        }, 60);
      }, 750 + 420);
    }

    // done: 1500ms
    schedule(() => {
      setPhase("done");
      setFadingOut(true);
      const id = setTimeout(() => {
        setVisible(false);
        setFadingOut(false);
        setPhase("idle");
        onComplete?.();
      }, 300);
      timersRef.current.push(id);
    }, 1500);

    return () => {
      clearAllTimers();
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
        typewriterRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, hallType]);

  if (!visible) return null;

  /* ---- Shared door SVG dimensions ---- */
  const doorW = 200;
  const doorH = 300;
  const doorStrokeLen = doorW * 2 + doorH * 3;
  const doorTotalLen = doorStrokeLen;

  return (
    <>
      <style>{HT_CSS}</style>
      <div
        className={`ht-overlay ${fadingOut ? "ht-overlay--fading" : ""}`}
        aria-hidden="true"
      >
        {/* ===== GLOBAL BASE LAYER ===== */}

        {/* Dimming: full black overlay */}
        <div
          className={`ht-dim-layer ${
            phase === "dimming" || phase === "door" || phase === "lighting" || phase === "personality"
              ? "ht-dim-layer--active"
              : ""
          }`}
        />

        {/* Door: SVG door/portal outline */}
        <div
          className={`ht-door-layer ${
            phase === "door" || phase === "lighting" || phase === "personality"
              ? "ht-door-layer--active"
              : ""
          }`}
        >
          <svg
            width={doorW + 4}
            height={doorH + 4}
            viewBox={`0 0 ${doorW + 4} ${doorH + 4}`}
            className="ht-door-svg"
          >
            {/* left edge */}
            <line
              x1="2"
              y1="2"
              x2="2"
              y2={doorH + 2}
              stroke="rgba(176,141,87,0.5)"
              strokeWidth={2}
              className="ht-door-line"
              style={{
                strokeDasharray: doorH,
                strokeDashoffset: doorH,
              }}
            />
            {/* right edge */}
            <line
              x1={doorW + 2}
              y1="2"
              x2={doorW + 2}
              y2={doorH + 2}
              stroke="rgba(176,141,87,0.5)"
              strokeWidth={2}
              className="ht-door-line"
              style={{
                strokeDasharray: doorH,
                strokeDashoffset: doorH,
              }}
            />
            {/* top frame */}
            <line
              x1="2"
              y1="2"
              x2={doorW + 2}
              y2="2"
              stroke="rgba(176,141,87,0.5)"
              strokeWidth={2}
              className="ht-door-line"
              style={{
                strokeDasharray: doorW,
                strokeDashoffset: doorW,
              }}
            />
          </svg>
        </div>

        {/* Lighting: warm radial glow */}
        <div
          className={`ht-light-layer ${
            phase === "lighting" || phase === "personality"
              ? "ht-light-layer--active"
              : ""
          }`}
        />

        {/* ===== HALL PERSONALITY LAYER ===== */}
        {phase === "personality" && hallType && (
          <div className="ht-personality-layer">
            <HallPersonality type={hallType} lyricsText={lyricsText} />
          </div>
        )}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Hall Personality Layer                                             */
/* ------------------------------------------------------------------ */

interface PersonalityProps {
  type: "film" | "music" | "net" | "honor" | "drawer";
  lyricsText: string;
}

const HallPersonality: React.FC<PersonalityProps> = ({ type, lyricsText }) => {
  switch (type) {
    case "film":
      return <FilmPersonality />;
    case "music":
      return <MusicPersonality lyricsText={lyricsText} />;
    case "net":
      return <NetPersonality />;
    case "honor":
      return <HonorPersonality />;
    case "drawer":
      return <DrawerPersonality />;
    default:
      return null;
  }
};

/* -- Film: CRT shutdown + static + film strip + snap -- */
const FilmPersonality: React.FC = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 0);
    const t2 = setTimeout(() => setStep(2), 200);
    const t3 = setTimeout(() => setStep(3), 400);
    const t4 = setTimeout(() => setStep(4), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className={`ht-film ht-film--s${step}`}>
      {/* CRT shutdown line */}
      <div className="ht-film-crt" />

      {/* Static / snow noise */}
      <div className="ht-film-static" />

      {/* Film strip perforations scroll */}
      <div className="ht-film-strip-wrap">
        <FilmPerforations />
      </div>

      {/* Snap: brief scale bump on the overlay (applied via CSS) */}
    </div>
  );
};

/* -- Music: wave convergence + cassette + rings + lyrics -- */
const MusicPersonality: React.FC<{ lyricsText: string }> = ({ lyricsText }) => {
  const waveW = 300;
  const waveH = 60;
  const path1 = buildSinePath(waveW, waveH, 18, 4);
  const path2 = buildSinePath(waveW, waveH, 18, 4);

  return (
    <div className="ht-music">
      {/* Wave convergence */}
      <svg
        width={waveW}
        height={waveH}
        viewBox={`0 0 ${waveW} ${waveH}`}
        className="ht-music-wave-wrap"
      >
        <path d={path1} fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth={1.5} className="ht-music-wave-left" />
        <path d={path2} fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth={1.5} className="ht-music-wave-right" />
      </svg>

      {/* Cassette insertion */}
      <div className="ht-music-cassette-wrap">
        <CassetteShape />
      </div>

      {/* Spectrum rings */}
      <div className="ht-music-rings">
        <div className="ht-music-ring ht-music-ring--1" />
        <div className="ht-music-ring ht-music-ring--2" />
        <div className="ht-music-ring ht-music-ring--3" />
      </div>

      {/* Lyrics typewriter */}
      <span className="ht-music-lyrics">{lyricsText}</span>
    </div>
  );
};

/* -- Net: minimize + NO CARRIER + progress + scanline -- */
const NetPersonality: React.FC = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 0);
    const t2 = setTimeout(() => setStep(2), 150);
    const t3 = setTimeout(() => setStep(3), 330);
    const t4 = setTimeout(() => setStep(4), 570);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className={`ht-net ht-net--s${step}`}>
      {/* Window minimize */}
      <div className="ht-net-window" />

      {/* NO CARRIER */}
      <div className="ht-net-carrier">NO CARRIER</div>

      {/* Progress bar */}
      <div className="ht-net-progress-track">
        <div className="ht-net-progress-bar" />
      </div>

      {/* Pixel refresh scanline */}
      <div className="ht-net-scanline" />
    </div>
  );
};

/* -- Honor: medals + curtain + top light + timeline -- */
const HonorPersonality: React.FC = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 0);
    const t2 = setTimeout(() => setStep(2), 150);
    const t3 = setTimeout(() => setStep(3), 360);
    const t4 = setTimeout(() => setStep(4), 570);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className={`ht-honor ht-honor--s${step}`}>
      {/* Medals darken */}
      <div className="ht-honor-medals">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`ht-honor-medal ${step >= 1 ? "ht-honor-medal--dark" : ""}`}
            style={{ animationDelay: `${i * 30}ms` }}
          />
        ))}
      </div>

      {/* Curtain open */}
      <div className="ht-honor-curtain-wrap">
        <div className="ht-honor-curtain ht-honor-curtain--left" />
        <div className="ht-honor-curtain ht-honor-curtain--right" />
      </div>

      {/* Top light reveal */}
      <div className="ht-honor-light" />

      {/* Timeline extends */}
      <div className="ht-honor-timeline-wrap">
        <div className="ht-honor-timeline-line" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ht-honor-timeline-dot"
            style={{ animationDelay: `${i * 42}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

/* -- Drawer: flashlight + lock + slide + lamp -- */
const DrawerPersonality: React.FC = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 0);
    const t2 = setTimeout(() => setStep(2), 150);
    const t3 = setTimeout(() => setStep(3), 300);
    const t4 = setTimeout(() => setStep(4), 570);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className={`ht-drawer ht-drawer--s${step}`}>
      {/* Flashlight spot */}
      <div className="ht-drawer-flashlight" />

      {/* Lock close */}
      <div className="ht-drawer-lock-wrap">
        <LockShape />
      </div>

      {/* Drawer slide */}
      <div className="ht-drawer-slide" />

      {/* Desk lamp glow */}
      <div className="ht-drawer-lamp" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  CSS — all keyframes & styles                                       */
/* ------------------------------------------------------------------ */

const HT_CSS = `
/* ---- Overlay base ---- */
.ht-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  pointer-events: none;
  overflow: hidden;
  background: transparent;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}
.ht-overlay--fading {
  opacity: 0;
}

/* ---- Dim layer (black overlay) ---- */
.ht-dim-layer {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  transition: opacity 270ms cubic-bezier(0.4, 0, 1, 1);
}
.ht-dim-layer--active {
  opacity: 1;
}

/* ---- Door layer ---- */
.ht-door-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 60ms ease-out;
}
.ht-door-layer--active {
  opacity: 1;
}
.ht-door-svg {
  overflow: visible;
}
.ht-door-line {
  animation: ht-door-draw 210ms ease-out forwards;
}
@keyframes ht-door-draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* ---- Light layer ---- */
.ht-light-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 30ms ease-out;
}
.ht-light-layer--active {
  opacity: 1;
}
.ht-light-layer--active::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,220,150,0.15) 0%, transparent 70%);
  animation: ht-light-expand 270ms ease-out forwards;
}
@keyframes ht-light-expand {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

/* ---- Personality layer wrapper ---- */
.ht-personality-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================================================
   FILM personality
   ========================================================= */

/* CRT shutdown line */
.ht-film-crt {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.85);
  transform: translateY(-50%) scaleY(0);
  animation: ht-film-crt-zoom 200ms ease-in-out forwards;
}
@keyframes ht-film-crt-zoom {
  0%   { transform: translateY(-50%) scaleY(0); }
  40%  { transform: translateY(-50%) scaleY(1); }
  100% { transform: translateY(-50%) scaleY(0); }
}

/* Static / snow noise */
.ht-film-static {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 160px;
  transform: translate(-50%, -50%);
  background: repeating-conic-gradient(
    rgba(255,255,255,0.12) 0%,
    rgba(0,0,0,0.08) 1.5%,
    rgba(255,255,255,0.06) 3%
  );
  opacity: 0;
  animation: ht-film-static-flicker 200ms ease-out 200ms forwards;
}
@keyframes ht-film-static-flicker {
  0%   { opacity: 0.9; }
  30%  { opacity: 0.3; }
  60%  { opacity: 0.8; }
  100% { opacity: 0; }
}

/* Film strip scroll */
.ht-film-strip-wrap {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  animation: ht-film-strip-scroll 200ms ease-in-out 400ms forwards;
  overflow: hidden;
  opacity: 0;
}
.ht-film-strip-svg {
  display: block;
  animation: ht-film-strip-move 200ms ease-in-out 400ms forwards;
}
@keyframes ht-film-strip-move {
  from { transform: translateX(-100%); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}

/* Snap: brief scale bump on whole film personality */
.ht-film--s4 {
  animation: ht-film-snap 80ms ease-out forwards;
}
@keyframes ht-film-snap {
  0%   { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* =========================================================
   MUSIC personality
   ========================================================= */

.ht-music {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Wave convergence */
.ht-music-wave-wrap {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  overflow: visible;
}
.ht-music-wave-left {
  stroke-dasharray: 600;
  stroke-dashoffset: 0;
  animation: ht-wave-converge-left 180ms ease-in-out forwards;
}
.ht-music-wave-right {
  stroke-dasharray: 600;
  stroke-dashoffset: 0;
  animation: ht-wave-converge-right 180ms ease-in-out forwards;
}
@keyframes ht-wave-converge-left {
  from { stroke-dashoffset: 0; transform: translateX(0); }
  to   { stroke-dashoffset: 300; transform: translateX(60px); }
}
@keyframes ht-wave-converge-right {
  from { stroke-dashoffset: 0; transform: translateX(0); }
  to   { stroke-dashoffset: 300; transform: translateX(-60px); }
}

/* Cassette slide in */
.ht-music-cassette-wrap {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translateX(40px);
  opacity: 0;
  animation: ht-cassette-in 200ms ease-out 180ms forwards;
}
.ht-cassette-svg {
  display: block;
}
@keyframes ht-cassette-in {
  to { transform: translateX(0); opacity: 1; }
}

/* Spectrum rings */
.ht-music-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.ht-music-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(180,220,255,0.5);
  transform: translate(-50%, -50%) scale(0);
  animation: ht-ring-pop 280ms ease-out forwards;
}
.ht-music-ring--1 {
  width: 60px; height: 60px;
  animation-delay: 0ms;
}
.ht-music-ring--2 {
  width: 100px; height: 100px;
  animation-delay: 80ms;
}
.ht-music-ring--3 {
  width: 140px; height: 140px;
  animation-delay: 160ms;
}
@keyframes ht-ring-pop {
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
  60%  { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

/* Lyrics typewriter */
.ht-music-lyrics {
  position: absolute;
  bottom: 28%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: rgba(200,220,255,0.7);
  letter-spacing: 2px;
  white-space: nowrap;
}

/* =========================================================
   NET personality
   ========================================================= */

.ht-net {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Window minimize */
.ht-net-window {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 200px;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  border: 1px solid rgba(0,255,100,0.25);
  animation: ht-net-minimize 150ms ease-in forwards;
}
@keyframes ht-net-minimize {
  to {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }
}

/* NO CARRIER text */
.ht-net-carrier {
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  color: rgba(0,255,100,0.85);
  opacity: 0;
  letter-spacing: 4px;
  animation: ht-net-carrier-flicker 180ms ease-out 150ms forwards;
}
@keyframes ht-net-carrier-flicker {
  0%   { opacity: 0.9; }
  20%  { opacity: 0; }
  40%  { opacity: 0.8; }
  60%  { opacity: 0.2; }
  80%  { opacity: 0.9; }
  100% { opacity: 0; }
}

/* Progress bar */
.ht-net-progress-track {
  position: absolute;
  top: 54%;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 8px;
  background: rgba(0,255,100,0.1);
  border: 1px solid rgba(0,255,100,0.25);
  overflow: hidden;
}
.ht-net-progress-bar {
  width: 0;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    rgba(0,255,100,0.6) 0px,
    rgba(0,255,100,0.3) 8px,
    rgba(0,255,100,0.6) 16px
  );
  animation: ht-net-progress-fill 240ms ease-in-out 330ms forwards;
}
@keyframes ht-net-progress-fill {
  to { width: 100%; }
}

/* Scanline */
.ht-net-scanline {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0,255,100,0.4);
  animation: ht-net-scanline-move 180ms linear 570ms forwards;
  opacity: 0;
}
@keyframes ht-net-scanline-move {
  0%   { top: 0; opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
}

/* =========================================================
   HONOR personality
   ========================================================= */

.ht-honor {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Medals */
.ht-honor-medals {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
}
.ht-honor-medal {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,215,0,0.7) 30%, rgba(184,134,11,0.5) 100%);
  box-shadow: 0 0 8px rgba(255,215,0,0.5), 0 0 20px rgba(255,215,0,0.2);
  transition: box-shadow 150ms ease-out, background 150ms ease-out;
}
.ht-honor-medal--dark {
  box-shadow: none;
  background: radial-gradient(circle, rgba(120,100,60,0.3) 30%, rgba(80,60,30,0.2) 100%);
}

/* Curtain */
.ht-honor-curtain-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 220px;
  overflow: hidden;
}
.ht-honor-curtain {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(120,20,20,0.7) 0px,
      rgba(100,15,15,0.8) 12px,
      rgba(80,10,10,0.6) 24px
    );
  transform: translateX(0);
}
.ht-honor-curtain--left {
  left: 0;
  animation: ht-curtain-open-left 210ms ease-in-out 150ms forwards;
}
.ht-honor-curtain--right {
  right: 0;
  animation: ht-curtain-open-right 210ms ease-in-out 150ms forwards;
}
@keyframes ht-curtain-open-left {
  to { transform: translateX(-100%); }
}
@keyframes ht-curtain-open-right {
  to { transform: translateX(100%); }
}

/* Top light reveal */
.ht-honor-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(180deg, rgba(255,220,150,0.12) 0%, transparent 100%);
  animation: ht-honor-light-down 180ms ease-out 360ms forwards;
}
@keyframes ht-honor-light-down {
  to { height: 60%; }
}

/* Timeline extends */
.ht-honor-timeline-wrap {
  position: absolute;
  bottom: 16%;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 120px;
}
.ht-honor-timeline-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, rgba(176,141,87,0.7), rgba(176,141,87,0.2));
  transform-origin: top center;
  transform: scaleY(0);
  animation: ht-timeline-grow 210ms ease-out 570ms forwards;
}
.ht-honor-timeline-dot {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(176,141,87,0.6);
  transform: translateX(-50%) scale(0);
  animation: ht-timeline-dot-pop 100ms ease-out forwards;
}
.ht-honor-timeline-dot:nth-child(2) { top: 20%; }
.ht-honor-timeline-dot:nth-child(3) { top: 40%; }
.ht-honor-timeline-dot:nth-child(4) { top: 60%; }
.ht-honor-timeline-dot:nth-child(5) { top: 80%; }
.ht-honor-timeline-dot:nth-child(6) { top: 100%; }
@keyframes ht-timeline-grow {
  to { transform: scaleY(1); }
}
@keyframes ht-timeline-dot-pop {
  to { transform: translateX(-50%) scale(1); }
}

/* =========================================================
   DRAWER personality
   ========================================================= */

.ht-drawer {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Flashlight spot */
.ht-drawer-flashlight {
  position: absolute;
  top: 40%;
  left: 45%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,230,170,0.3) 0%, transparent 70%);
  transform: scale(1);
  animation: ht-flashlight-out 150ms ease-out forwards;
}
@keyframes ht-flashlight-out {
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* Lock */
.ht-drawer-lock-wrap {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translateX(-50%) rotate(-45deg);
  opacity: 1;
  animation: ht-lock-close 150ms ease-in-out 150ms forwards;
}
.ht-lock-svg {
  display: block;
}
@keyframes ht-lock-close {
  50%  { transform: translateX(-50%) rotate(-45deg) scale(1.05); opacity: 1; }
  100% { transform: translateX(-50%) rotate(-45deg) scale(0.8); opacity: 0; }
}

/* Drawer slide */
.ht-drawer-slide {
  position: absolute;
  top: 50%;
  left: 0;
  width: 70%;
  height: 50%;
  background: linear-gradient(
    90deg,
    rgba(60,45,30,0.5) 0%,
    rgba(80,60,40,0.3) 100%
  );
  border-left: 2px solid rgba(120,90,50,0.5);
  border-bottom: 2px solid rgba(120,90,50,0.5);
  transform: translateX(100%);
  opacity: 0;
  animation: ht-drawer-slide-in 270ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 300ms forwards;
}
@keyframes ht-drawer-slide-in {
  to {
    transform: translateX(0);
    opacity: 0.9;
  }
}

/* Desk lamp glow */
.ht-drawer-lamp {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 60%;
  background: radial-gradient(
    ellipse at top left,
    rgba(255,220,150,0.08) 0%,
    transparent 70%
  );
  opacity: 0;
  animation: ht-lamp-glow 180ms ease-out 570ms forwards;
}
@keyframes ht-lamp-glow {
  to { opacity: 1; }
}

/* =========================================================
   prefers-reduced-motion fallback
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ht-overlay * {
    animation: none !important;
    transition: opacity 0.3s ease-out !important;
  }
}
`;

export default HallTransition;
