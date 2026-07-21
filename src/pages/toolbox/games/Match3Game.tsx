import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 消散 · Dissolve
 *
 * 经典三消游戏 —— 8x8 棋盘，6 种马卡龙色方块。
 * 点击选中 → 点击相邻方块交换 → 三消消除 → 下落填充 → 连锁反应。
 * 关卡制，localStorage 持久化。
 */

/* ============================================================
   常量
   ============================================================ */
const ROWS = 8;
const COLS = 8;
const NUM_TYPES = 6;

const COLORS = [
  "#F4C2C2", // soft pink
  "#C2D4F4", // soft blue
  "#C2E8D4", // soft green
  "#F4E8C2", // soft yellow
  "#D4C2F4", // soft purple
  "#F4D4C2", // soft orange
];

const STORAGE_KEY = "game_level_xiaoxiaole";
const BADGE_STORAGE_KEY = "match3_badges";

const CELL_SIZE = 48;       // px per cell
const GAP = 4;               // gap between cells
const ANIM_MATCH = 280;      // ms: match disappear animation
const ANIM_FALL = 200;       // ms: fall / slide-in animation
const ANIM_SWAP = 180;       // ms: swap animation
const BASE_SCORE = 10;
const STAR2_RATIO = 0.6;    // remaining moves / total moves > this = 2 stars
const STAR3_RATIO = 0.8;     // > this = 3 stars

/* ============================================================
   Web Audio 弹出音效
   ============================================================ */
const playPopSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    /* 静音 */
  }
};

/* ============================================================
   类型
   ============================================================ */
type Board = (number | null)[][];     // 0-5 = tile type, null = empty
type Pos = { r: number; c: number };

/* ============================================================
   辅助函数
   ============================================================ */
const randType = (): number => Math.floor(Math.random() * NUM_TYPES);

/** 创建空棋盘 */
const emptyBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null) as (number | null)[]);

/** 填充棋盘，保证初始无匹配 */
const fillBoard = (board: Board): Board => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let t: number;
      do {
        t = randType();
      } while (wouldMatch(board, r, c, t));
      board[r][c] = t;
    }
  }
  return board;
};

/** 在 (r,c) 放置 type 是否会立即形成匹配（用于初始化） */
const wouldMatch = (board: Board, r: number, c: number, type: number): boolean => {
  // 水平
  if (c >= 2 && board[r][c - 1] === type && board[r][c - 2] === type) return true;
  // 垂直
  if (r >= 2 && board[r - 1][c] === type && board[r - 2][c] === type) return true;
  return false;
};

/** 查找所有匹配位置 */
const findMatches = (board: Board): Set<string> => {
  const matched = new Set<string>();

  // 水平扫描
  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS) {
      const t = board[r][c];
      if (t === null) { c++; continue; }
      let end = c + 1;
      while (end < COLS && board[r][end] === t) end++;
      if (end - c >= 3) {
        for (let i = c; i < end; i++) matched.add(`${r},${i}`);
      }
      c = end;
    }
  }

  // 垂直扫描
  for (let c = 0; c < COLS; c++) {
    let r = 0;
    while (r < ROWS) {
      const t = board[r][c];
      if (t === null) { r++; continue; }
      let end = r + 1;
      while (end < ROWS && board[end][c] === t) end++;
      if (end - r >= 3) {
        for (let i = r; i < end; i++) matched.add(`${i},${c}`);
      }
      r = end;
    }
  }

  return matched;
};

/** 深拷贝棋盘 */
const cloneBoard = (b: Board): Board => b.map((row) => [...row]);

/** 判断两个位置是否相邻 */
const isAdjacent = (a: Pos, b: Pos): boolean => {
  return (Math.abs(a.r - b.r) + Math.abs(a.c - b.c)) === 1;
};

/** 下落 + 填充新方块，返回 { newBoard, fallMap } */
const applyGravity = (board: Board): { board: Board; fallMap: Map<string, { fromR: number }> } => {
  const newBoard = emptyBoard();
  const fallMap = new Map<string, { fromR: number }>();

  for (let c = 0; c < COLS; c++) {
    let writeRow = ROWS - 1;
    // 从底部向上收集非空方块
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] !== null) {
        const type = board[r][c]!;
        newBoard[writeRow][c] = type;
        if (r !== writeRow) {
          fallMap.set(`${writeRow},${c}`, { fromR: r });
        }
        writeRow--;
      }
    }
    // 顶部填充新方块
    for (let r = writeRow; r >= 0; r--) {
      newBoard[r][c] = randType();
      fallMap.set(`${r},${c}`, { fromR: r - (writeRow + 1) });
    }
  }

  return { board: newBoard, fallMap };
};

/* ============================================================
   10关系统
   ============================================================ */
interface LevelConfig {
  target: number;
  moves: number;
  hasRock: boolean;
  hasIce: boolean;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { target: 500,  moves: 30, hasRock: false, hasIce: false }, // 关卡1
  { target: 800,  moves: 30, hasRock: true,  hasIce: false }, // 关卡2
  { target: 1200, moves: 28, hasRock: false, hasIce: false }, // 关卡3
  { target: 1500, moves: 28, hasRock: false, hasIce: true  }, // 关卡4
  { target: 2000, moves: 25, hasRock: false, hasIce: false }, // 关卡5
  { target: 2500, moves: 25, hasRock: true,  hasIce: true  }, // 关卡6
  { target: 3000, moves: 22, hasRock: false, hasIce: false }, // 关卡7
  { target: 3500, moves: 22, hasRock: true,  hasIce: true  }, // 关卡8 更多障碍
  { target: 4000, moves: 20, hasRock: false, hasIce: false }, // 关卡9
  { target: 5000, moves: 18, hasRock: true,  hasIce: true  }, // 关卡10 全部条件
  { target: 6000, moves: 18, hasRock: false, hasIce: false }, // 关卡11
  { target: 7000, moves: 17, hasRock: true,  hasIce: false }, // 关卡12
  { target: 8000, moves: 17, hasRock: false, hasIce: true  }, // 关卡13
  { target: 9000, moves: 16, hasRock: true,  hasIce: true  }, // 关卡14
  { target: 10000, moves: 15, hasRock: false, hasIce: false }, // 关卡15
  { target: 11000, moves: 15, hasRock: true,  hasIce: false }, // 关卡16
  { target: 12000, moves: 14, hasRock: false, hasIce: true  }, // 关卡17
  { target: 13000, moves: 14, hasRock: true,  hasIce: true  }, // 关卡18
  { target: 14000, moves: 13, hasRock: false, hasIce: false }, // 关卡19
  { target: 15000, moves: 12, hasRock: true,  hasIce: true  }, // 关卡20 终极挑战
];

const MAX_UNLOCKED_LEVEL = 20;

const getLevelConfig = (level: number): LevelConfig => {
  if (level <= MAX_UNLOCKED_LEVEL) return LEVEL_CONFIGS[level - 1];
  // 超过10关的动态生成
  return {
    target: 5000 + (level - 10) * 1000,
    moves: Math.max(15, 18 - (level - 10)),
    hasRock: true,
    hasIce: true,
  };
};

/** 计算关卡数据（兼容旧版调用） */
const levelTarget = (level: number) => getLevelConfig(level).target;
const levelMoves = (level: number) => getLevelConfig(level).moves;

/* ============================================================
   徽章系统
   ============================================================ */
const loadBadges = (): number[] => {
  try {
    const raw = localStorage.getItem(BADGE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
};

const saveBadges = (badges: number[]) => {
  try {
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges));
  } catch { /* ignore */ }
};

const BADGE_NAMES: Record<number, string> = {
  1: "初入消散",
  2: "障碍克星",
  3: "千分达人",
  4: "破冰先锋",
  5: "双千突破",
  6: "全面挑战",
  7: "三千高地",
  8: "障碍大师",
  9: "四千精英",
  10: "消散之王",
};

const MATCH3_BADGE_NAMES = [
  "初入消界", "碎石破障", "渐入佳境", "破冰而行",
  "中流击水", "双障齐克", "势如破竹", "无坚不摧",
  "炉火纯青", "登峰造极", "神之一手", "石破天惊",
  "冰雪消融", "双管齐下", "行云流水", "一石二鸟",
  "冰消瓦解", "坚壁清野", "纵横捭阖", "万物归零"
];

/** 从 localStorage 读取关卡 */
const loadLevel = (): number => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Math.min(MAX_UNLOCKED_LEVEL, Math.max(1, parseInt(v, 10) || 1)) : 1;
  } catch {
    return 1;
  }
};

/** 保存关卡到 localStorage */
const saveLevel = (level: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(level));
  } catch {
    /* ignore */
  }
};

/* ============================================================
   组件
   ============================================================ */
const Match3Game: React.FC = () => {
  /* ---------- state ---------- */
  const [level, setLevel] = useState(loadLevel);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(() => levelMoves(loadLevel()));
  const [board, setBoard] = useState<Board>(() => {
    const b = emptyBoard();
    return fillBoard(b);
  });
  const [selected, setSelected] = useState<Pos | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [fallMap, setFallMap] = useState<Map<string, { fromR: number }>>(new Map());
  const [animating, setAnimating] = useState(false);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [stars, setStars] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<number[]>(() => loadBadges());
  const [badgeNotify, setBadgeNotify] = useState<{ level: number; name: string } | null>(null);

  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalMovesRef = useRef(moves);

  /* ---------- 初始化关卡 ---------- */
  const initLevel = useCallback(
    (lvl: number) => {
      const b = emptyBoard();
      const filled = fillBoard(b);
      const mvs = levelMoves(lvl);
      totalMovesRef.current = mvs;
      setBoard(filled);
      setScore(0);
      setMoves(mvs);
      setSelected(null);
      setMatched(new Set());
      setFallMap(new Map());
      setAnimating(false);
      setGameState("playing");
      setStars(0);
    },
    []
  );

  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  /* ---------- 清理定时器 ---------- */
  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  /* ---------- 核心逻辑：处理交换后的一系列操作 ---------- */
  const processBoardAndCheckEnd = useCallback(
    (b: Board, cascade: number, remainingMoves: number, currentScore: number) => {
      const m = findMatches(b);

      if (m.size === 0) {
        // 无更多匹配，回合结束 → 检查胜负
        setAnimating(false);
        setMatched(new Set());
        setFallMap(new Map());
        const target = levelTarget(level);
        if (currentScore >= target) {
          setGameState("won");
          const ratio = remainingMoves / totalMovesRef.current;
          if (ratio >= STAR3_RATIO) setStars(3);
          else if (ratio >= STAR2_RATIO) setStars(2);
          else setStars(1);
          // 保存下一关解锁
          if (level < MAX_UNLOCKED_LEVEL) saveLevel(level + 1);
          // 徽章：首次通关
          const badges = loadBadges();
          if (level <= MAX_UNLOCKED_LEVEL && !badges.includes(level)) {
            badges.push(level);
            saveBadges(badges);
            setEarnedBadges([...badges]);
            setBadgeNotify({ level, name: BADGE_NAMES[level] || `关卡${level}` });
            setTimeout(() => setBadgeNotify(null), 3000);
          }
        } else if (remainingMoves <= 0) {
          setGameState("lost");
        }
        return;
      }

      playPopSound();

      // 标记匹配 → 播放消除动画
      setMatched(m);
      const newBoard = cloneBoard(b);
      m.forEach((key) => {
        const [r, c] = key.split(",").map(Number);
        newBoard[r][c] = null;
      });

      // 计算得分
      const points = m.size * BASE_SCORE * (cascade + 1);
      const newScore = currentScore + points;
      setScore(newScore);

      // 消除动画结束后执行下落
      const timer1 = setTimeout(() => {
        setMatched(new Set());
        const { board: afterFall, fallMap: fm } = applyGravity(newBoard);
        setBoard(afterFall);
        setFallMap(fm);

        // 下落动画结束后检查连锁
        const timer2 = setTimeout(() => {
          setFallMap(new Map());
          processBoardAndCheckEnd(afterFall, cascade + 1, remainingMoves, newScore);
        }, ANIM_FALL);

        animTimerRef.current = timer2;
      }, ANIM_MATCH);

      animTimerRef.current = timer1;
    },
    [level]
  );

  /* ---------- 点击方块 ---------- */
  const onCellClick = useCallback(
    (r: number, c: number) => {
      if (animating || gameState !== "playing") return;
      if (board[r][c] === null) return;

      if (selected === null) {
        setSelected({ r, c });
        return;
      }

      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }

      if (!isAdjacent(selected, { r, c })) {
        setSelected({ r, c });
        return;
      }

      // 交换
      const newBoard = cloneBoard(board);
      const tmp = newBoard[selected.r][selected.c];
      newBoard[selected.r][selected.c] = newBoard[r][c];
      newBoard[r][c] = tmp;

      const m = findMatches(newBoard);
      if (m.size === 0) {
        // 无匹配 → 换回来
        setSelected(null);
        return;
      }

      // 有匹配：执行交换
      setAnimating(true);
      setSelected(null);
      setBoard(newBoard);

      const newMoves = moves - 1;
      setMoves(newMoves);

      // 延迟开始匹配处理
      const timer = setTimeout(() => {
        processBoardAndCheckEnd(newBoard, 0, newMoves, score);
      }, ANIM_SWAP);
      animTimerRef.current = timer;
    },
    [board, selected, animating, gameState, processBoardAndCheckEnd, moves, score]
  );

  /* ---------- 重新开始当前关 ---------- */
  const restart = () => {
    initLevel(level);
  };

  /* ---------- 下一关 ---------- */
  const nextLevel = () => {
    if (level < MAX_UNLOCKED_LEVEL) {
      setLevel(level + 1);
    }
  };

  /* ---------- 重试 ---------- */
  const retry = () => {
    initLevel(level);
  };

  /* ---------- 尺寸计算 ---------- */
  const boardWidth = COLS * (CELL_SIZE + GAP) - GAP;
  const boardHeight = ROWS * (CELL_SIZE + GAP) - GAP;

  /* ---------- 渲染 ---------- */
  const target = levelTarget(level);

  return (
    <div style={styles.page}>
      {/* 顶部信息栏 */}
      <div style={styles.topBar}>
        <div style={styles.topItem}>
          <span style={styles.topLabel}>关卡</span>
          <span style={styles.topValue}>{level}</span>
        </div>
        <div style={styles.topItem}>
          <span style={styles.topLabel}>得分</span>
          <span style={styles.topValue}>{score}</span>
        </div>
        <div style={styles.topItem}>
          <span style={styles.topLabel}>目标</span>
          <span style={styles.topValue}>{target}</span>
        </div>
        <div style={styles.topItem}>
          <span style={styles.topLabel}>剩余步数</span>
          <span style={styles.topValue}>{moves}</span>
        </div>
        <div style={styles.topItem}>
          <span style={styles.topLabel}>徽章</span>
          <span style={{ ...styles.topValue, color: "#f5c842" }}>&#9733; {earnedBadges.length}/{MAX_UNLOCKED_LEVEL}</span>
        </div>
      </div>

      {/* 分数进度条 */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.min(100, (score / target) * 100)}%`,
          }}
        />
      </div>

      {/* 游戏棋盘 */}
      <div
        style={{
          ...styles.boardWrapper,
          width: boardWidth + 24,
          height: boardHeight + 24,
        }}
      >
        <div
          style={{
            ...styles.board,
            width: boardWidth,
            height: boardHeight,
            position: "relative",
          }}
        >
          {board.map((row, r) =>
            row.map((type, c) => {
              if (type === null) return null;

              const key = `${r},${c}`;
              const isSelected = selected !== null && selected.r === r && selected.c === c;
              const isMatched = matched.has(key);
              const fall = fallMap.get(key);
              const isFalling = fall !== undefined;

              return (
                <div
                  key={key}
                  onClick={() => onCellClick(r, c)}
                  style={{
                    ...styles.cell,
                    position: "absolute",
                    left: c * (CELL_SIZE + GAP),
                    top: isFalling && fall
                      ? fall.fromR * (CELL_SIZE + GAP)
                      : r * (CELL_SIZE + GAP),
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: COLORS[type],
                    transform: isMatched
                      ? "scale(0)"
                      : isSelected
                      ? "scale(1.12)"
                      : "scale(1)",
                    opacity: isMatched ? 0 : 1,
                    boxShadow: isSelected
                      ? `0 0 0 3px rgba(212, 138, 154, 0.7), 0 4px 12px -4px rgba(0,0,0,0.15)`
                      : "0 4px 12px -4px rgba(0,0,0,0.15)",
                    transition: [
                      "top",
                      "left",
                      "transform",
                      "opacity",
                      "background-color",
                      "box-shadow",
                    ]
                      .map((p) => `${p} ${isFalling ? ANIM_FALL : isMatched ? ANIM_MATCH : 120}ms ${isFalling || isMatched ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease"}`)
                      .join(", "),
                    cursor: animating || gameState !== "playing" ? "default" : "pointer",
                  }}
                >
                  {/* 小装饰：方块内部高光 */}
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      width: "40%",
                      height: "30%",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.35)",
                      filter: "blur(2px)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <button style={styles.restartBtn} onClick={restart}>
        重新开始
      </button>

      {/* 徽章获得通知 */}
      {badgeNotify && (
        <div style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 20px",
          borderRadius: 20,
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          boxShadow: "0 4px 16px rgba(255,215,0,0.4)",
          zIndex: 200,
          animation: "m3-badge-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          &#9733; 获得徽章：{badgeNotify.name}！
        </div>
      )}

      {/* 关卡完成遮罩 */}
      {gameState === "won" && (
        <div style={{ ...styles.overlay, position: "relative" }}>
          <button className="sr-overlay-close" onClick={() => {
            if (level < MAX_UNLOCKED_LEVEL) {
              nextLevel();
            } else {
              restart();
            }
          }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 20, color: "#aaa", cursor: "pointer", lineHeight: 1, zIndex: 101 }}>&times;</button>
          <div style={styles.overlayCard}>
            <div style={styles.overlayTitle}>关卡完成</div>
            <div style={styles.starsRow}>
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  style={{
                    ...styles.star,
                    opacity: s <= stars ? 1 : 0.25,
                    transform: s <= stars ? "scale(1)" : "scale(0.8)",
                    transition: `all 0.4s ${s * 0.15}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <div style={styles.overlayScore}>得分：{score}</div>
            <div style={styles.overlayMoves}>剩余步数：{moves}</div>
            {/* 当前关卡徽章 */}
            {earnedBadges.includes(level) && (
              <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 12px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.15))",
                  border: "1px solid rgba(255,215,0,0.3)",
                  color: "#f5c842",
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  &#9733; {BADGE_NAMES[level] || `关卡${level}`}
                </span>
              </div>
            )}
            {/* 徽章墙 */}
            {earnedBadges.length > 0 && (
              <div style={{ marginTop: 12, width: '100%', maxWidth: 400, maxHeight: 280, overflowY: 'auto' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#5a4a52', textAlign: 'center', marginBottom: 8 }}>
                  徽章墙 ({earnedBadges.length}/20)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {MATCH3_BADGE_NAMES.map((name, i) => {
                    const earned = earnedBadges.includes(i + 1);
                    return (
                      <div key={i} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 2, padding: 4, opacity: earned ? 1 : 0.4,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: earned ? '#FFD700' : '#e0e0e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: '#fff', fontWeight: 700,
                        }}>
                          {earned ? '★' : '🔒'}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: earned ? '#5a4a52' : '#aaa', textAlign: 'center' }}>
                          {name}
                        </span>
                        <span style={{ fontSize: 9, color: '#aaa' }}>第{i+1}关</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div style={styles.overlayBtns}>
              <button style={styles.overlayBtn} onClick={restart}>
                再玩一次
              </button>
              {level < MAX_UNLOCKED_LEVEL && (
                <button
                  style={{ ...styles.overlayBtn, ...styles.overlayBtnPrimary }}
                  onClick={nextLevel}
                >
                  下一关 →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 游戏失败遮罩 */}
      {gameState === "lost" && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div style={styles.overlayTitle}>步数用尽</div>
            <div style={styles.overlayScore}>得分：{score} / {target}</div>
            <div style={styles.overlayBtns}>
              <button style={styles.overlayBtnPrimary} onClick={retry}>
                再试一次
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全局 CSS-in-JS 样式 */}
      <style>{`
        .m3-page, .m3-page * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        @keyframes m3-badge-pop {
          0% { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(-10px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   样式对象
   ============================================================ */
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "24px 16px 80px",
    background:
      "radial-gradient(120% 80% at 50% 0%, #fdf6f8 0%, #f7f3f5 50%, #f0eaef 100%)",
    fontFamily: '"Noto Sans SC", system-ui, sans-serif',
    color: "#5a4a52",
    userSelect: "none",
    WebkitUserSelect: "none",
  },

  /* 顶部信息栏 */
  topBar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
    marginBottom: "12px",
    width: "100%",
    maxWidth: "420px",
  },
  topItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "2px",
  },
  topLabel: {
    fontSize: "12px",
    color: "#a898a0",
    letterSpacing: "0.04em",
  },
  topValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#6b5560",
  },

  /* 进度条 */
  progressBar: {
    width: "100%",
    maxWidth: "420px",
    height: "6px",
    borderRadius: "3px",
    background: "#ece4e8",
    marginBottom: "20px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    background: "linear-gradient(90deg, #F4C2C2, #D4C2F4, #C2D4F4)",
    transition: "width 0.4s ease",
  },

  /* 棋盘外框 */
  boardWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    border: "1px solid #ece4e8",
    borderRadius: "18px",
    boxShadow: "0 10px 30px -14px rgba(150,120,140,0.2)",
    padding: "12px",
    marginBottom: "20px",
  },

  /* 棋盘 */
  board: {
    overflow: "hidden",
  },

  /* 单元格 */
  cell: {
    borderRadius: "10px",
    willChange: "transform, opacity, top",
    overflow: "hidden",
  },

  /* 重新开始按钮 */
  restartBtn: {
    padding: "10px 32px",
    borderRadius: "24px",
    border: "1px solid #ece4e8",
    background: "#fff",
    color: "#9a8a92",
    fontSize: "14px",
    fontFamily: '"Noto Sans SC", system-ui, sans-serif',
    cursor: "pointer",
    transition: "all 0.25s ease",
    letterSpacing: "0.04em",
    boxShadow: "0 4px 14px -6px rgba(150,120,140,0.2)",
  },

  /* 遮罩层 */
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(90, 74, 82, 0.45)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    zIndex: 100,
  },

  overlayCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "36px 40px",
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 20px 50px -12px rgba(90,74,82,0.3)",
    minWidth: "260px",
  },

  overlayTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#6b5560",
    marginBottom: "16px",
    letterSpacing: "0.06em",
  },

  starsRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },

  star: {
    fontSize: "36px",
    color: "#f5c842",
    lineHeight: 1,
    textShadow: "0 2px 8px rgba(245, 200, 66, 0.4)",
  },

  overlayScore: {
    fontSize: "15px",
    color: "#a898a0",
    marginBottom: "6px",
  },

  overlayMoves: {
    fontSize: "14px",
    color: "#b8a8b0",
    marginBottom: "20px",
  },

  overlayBtns: {
    display: "flex",
    gap: "12px",
  },

  overlayBtn: {
    padding: "10px 24px",
    borderRadius: "20px",
    border: "1px solid #ece4e8",
    background: "#fff",
    color: "#9a8a92",
    fontSize: "14px",
    fontFamily: '"Noto Sans SC", system-ui, sans-serif',
    cursor: "pointer",
    transition: "all 0.25s ease",
    letterSpacing: "0.04em",
  },

  overlayBtnPrimary: {
    background: "linear-gradient(135deg, #F4C2C2, #D4C2F4)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
  },
};

export default Match3Game;
