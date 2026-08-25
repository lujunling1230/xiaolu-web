import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoamingGuide } from "./RoamingGuideContext";
import { useUserAuth } from "../../../context/UserAuthContext";
import { userGetItem, userSetItem } from "../../../utils/userStorage";
import type { City } from "./types";

interface ProfileData {
  avatar: string;
  nickname: string;
  bio: string;
  travelStyle: string;
}

const TRAVEL_STYLES = ["慢游", "打卡", "美食", "摄影", "文化", "户外"];

export default function ProfilePage() {
  const { cities, stats } = useRoamingGuide();
  const { isLoggedIn, username } = useUserAuth();

  const [profile, setProfile] = useState<ProfileData>(() =>
    userGetItem<ProfileData>("rg_profile", {
      avatar: "",
      nickname: username || "",
      bio: "",
      travelStyle: "",
    }) ?? {
      avatar: "",
      nickname: username || "",
      bio: "",
      travelStyle: "",
    }
  );
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editStyle, setEditStyle] = useState(profile.travelStyle);
  const fileRef = useRef<HTMLInputElement>(null);

  const visitedCities = cities.filter(c => c.status === "visited");
  const wantCities = cities.filter(c => c.status === "want_to_go");

  const handleSave = useCallback(() => {
    const next = {
      ...profile,
      nickname: editNickname.trim() || username || "",
      bio: editBio.trim(),
      travelStyle: editStyle,
    };
    setProfile(next);
    userSetItem("rg_profile", next);
    setEditing(false);
  }, [profile, editNickname, editBio, editStyle, username]);

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      alert("头像文件不能超过 512KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const next = { ...profile, avatar: result };
      setProfile(next);
      userSetItem("rg_profile", next);
    };
    reader.readAsDataURL(file);
  }, [profile]);

  const displayName = profile.nickname || username || "旅人";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .rg-profile-wrap {
          max-width: 860px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          font-family: 'PingFang SC', system-ui, sans-serif;
        }

        /* ===== 个人信息卡片 ===== */
        .rg-profile-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 20px;
          padding: 32px 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(90,74,58,0.06);
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .rg-avatar {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          flex-shrink: 0;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .rg-avatar:hover { transform: scale(1.05); }
        .rg-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(244,211,94,0.3);
        }
        .rg-avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #F4D35E, #7BA89E);
          border: 3px solid rgba(255,255,255,0.4);
          font-family: 'Noto Serif SC', serif;
        }
        .rg-avatar-mask {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          font-size: 11px;
          color: #fff;
        }
        .rg-avatar:hover .rg-avatar-mask { opacity: 1; }

        .rg-profile-info { flex: 1; min-width: 0; }
        .rg-profile-name {
          font-size: 20px;
          font-weight: 600;
          color: #5A4A3A;
          margin: 0 0 4px;
          font-family: 'Noto Serif SC', serif;
          letter-spacing: 1px;
        }
        .rg-profile-bio {
          font-size: 13px;
          color: #B0A898;
          line-height: 1.6;
          margin: 0 0 8px;
        }
        .rg-profile-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .rg-profile-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(244,211,94,0.15);
          color: #8B7355;
          border: 1px solid rgba(244,211,94,0.2);
        }

        .rg-edit-btn {
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid rgba(90,74,58,0.15);
          background: rgba(255,255,255,0.5);
          color: #5A4A3A;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          flex-shrink: 0;
        }
        .rg-edit-btn:hover {
          background: rgba(244,211,94,0.15);
          border-color: rgba(244,211,94,0.3);
        }

        /* ===== 统计行 ===== */
        .rg-profile-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .rg-stat-item {
          flex: 1;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 14px;
          padding: 16px 14px;
          text-align: center;
        }
        .rg-stat-num {
          font-size: 24px;
          font-weight: 600;
          color: #5A4A3A;
          font-family: 'Noto Serif SC', serif;
        }
        .rg-stat-label {
          font-size: 11px;
          color: #B0A898;
          margin-top: 2px;
        }

        /* ===== 航线区域 ===== */
        .rg-routes-section {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 20px;
          padding: 28px 24px 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(90,74,58,0.06);
        }
        .rg-routes-title {
          font-size: 16px;
          font-weight: 600;
          color: #5A4A3A;
          margin: 0 0 4px;
          font-family: 'Noto Serif SC', serif;
          letter-spacing: 2px;
        }
        .rg-routes-subtitle {
          font-size: 12px;
          color: #B0A898;
          margin: 0 0 24px;
        }

        /* SVG 航线画布 */
        .rg-routes-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        /* 城市卡片在航线上 */
        .rg-route-city {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .rg-route-city:hover { transform: translateY(-4px); }
        .rg-route-city-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        .rg-route-city-name {
          font-size: 11px;
          color: #5A4A3A;
          text-align: center;
          margin-top: 4px;
          font-weight: 500;
        }

        /* 空状态 */
        .rg-empty-routes {
          text-align: center;
          padding: 40px 20px;
        }
        .rg-empty-icon { font-size: 40px; margin-bottom: 8px; opacity: 0.4; }
        .rg-empty-text {
          font-size: 13px;
          color: #B0A898;
          line-height: 1.6;
        }

        /* ===== 编辑弹窗 ===== */
        .rg-edit-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(30,30,30,0.4);
        }
        .rg-edit-modal {
          background: #faf8f5;
          border-radius: 16px;
          padding: 28px 24px;
          width: 90%;
          max-width: 360px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
        }
        .rg-edit-title {
          font-size: 16px;
          font-weight: 600;
          color: #4a4038;
          margin: 0 0 20px;
          text-align: center;
          font-family: 'Noto Serif SC', serif;
        }
        .rg-edit-field { margin-bottom: 16px; }
        .rg-edit-label {
          font-size: 12px;
          color: #9a8a7a;
          margin-bottom: 6px;
        }
        .rg-edit-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e0ddd5;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #4a4038;
          box-sizing: border-box;
          font-family: inherit;
        }
        .rg-edit-input:focus { border-color: #c4a96a; }
        .rg-style-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .rg-style-chip {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1.5px solid #e0ddd5;
          background: #fff;
          font-size: 12px;
          color: #9a8a7a;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .rg-style-chip.selected {
          background: rgba(244,211,94,0.15);
          border-color: #F4D35E;
          color: #8B7355;
        }
        .rg-edit-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .rg-edit-actions button {
          flex: 1;
          padding: 10px 0;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .rg-btn-cancel { background: #f0ede5; color: #9a8a7a; }
        .rg-btn-save {
          background: linear-gradient(135deg, #F4D35E, #c4a96a);
          color: #fff;
          font-weight: 500;
        }

        /* ===== 未登录提示 ===== */
        .rg-login-prompt {
          text-align: center;
          padding: 60px 20px;
        }
        .rg-login-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
        .rg-login-text {
          font-size: 14px;
          color: #B0A898;
          line-height: 1.8;
        }

        @media (max-width: 600px) {
          .rg-profile-card { flex-direction: column; text-align: center; padding: 24px 20px; }
          .rg-profile-stats { flex-wrap: wrap; }
          .rg-stat-item { min-width: calc(50% - 6px); }
        }
      `}</style>

      <div className="rg-profile-wrap">
        {isLoggedIn ? (
          <>
            {/* 个人信息卡片 */}
            <div className="rg-profile-card">
              <div className="rg-avatar" onClick={() => fileRef.current?.click()}>
                {profile.avatar ? (
                  <img className="rg-avatar-img" src={profile.avatar} alt="头像" />
                ) : (
                  <div className="rg-avatar-fallback">{avatarLetter}</div>
                )}
                <div className="rg-avatar-mask">更换</div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
              </div>

              <div className="rg-profile-info">
                <h2 className="rg-profile-name">{displayName}</h2>
                {profile.bio ? <p className="rg-profile-bio">{profile.bio}</p> : <p className="rg-profile-bio">还没有个人简介</p>}
                <div className="rg-profile-tags">
                  {profile.travelStyle && <span className="rg-profile-tag">{profile.travelStyle}</span>}
                  <span className="rg-profile-tag">{visitedCities.length} 城足迹</span>
                  <span className="rg-profile-tag">{stats.provinces} 省</span>
                </div>
              </div>

              <button className="rg-edit-btn" onClick={() => { setEditNickname(profile.nickname); setEditBio(profile.bio); setEditStyle(profile.travelStyle); setEditing(true); }}>
                编辑资料
              </button>
            </div>

            {/* 统计 */}
            <div className="rg-profile-stats">
              <div className="rg-stat-item">
                <div className="rg-stat-num">{visitedCities.length}</div>
                <div className="rg-stat-label">已去城市</div>
              </div>
              <div className="rg-stat-item">
                <div className="rg-stat-num">{wantCities.length}</div>
                <div className="rg-stat-label">想去城市</div>
              </div>
              <div className="rg-stat-item">
                <div className="rg-stat-num">{stats.provinces}</div>
                <div className="rg-stat-label">足迹省份</div>
              </div>
              <div className="rg-stat-item">
                <div className="rg-stat-num">{stats.days}</div>
                <div className="rg-stat-label">旅途天数</div>
              </div>
            </div>

            {/* 航线展示 */}
            <div className="rg-routes-section">
              <h3 className="rg-routes-title">我的航线</h3>
              <p className="rg-routes-subtitle">飞机划过天际，串联起每一段旅程的记忆</p>

              {visitedCities.length > 0 ? (
                <FlightRoutes cities={visitedCities} />
              ) : (
                <div className="rg-empty-routes">
                  <div className="rg-empty-icon">✈️</div>
                  <p className="rg-empty-text">还没有去过的城市<br />在地图上点亮第一座城吧</p>
                </div>
              )}
            </div>

            {/* 想去城市 */}
            {wantCities.length > 0 && (
              <div className="rg-routes-section">
                <h3 className="rg-routes-title">心愿航线</h3>
                <p className="rg-routes-subtitle">那些还没抵达，但已在心里的远方</p>
                <FlightRoutes cities={wantCities} dashed />
              </div>
            )}
          </>
        ) : (
          <div className="rg-login-prompt">
            <div className="rg-login-icon">🧳</div>
            <p className="rg-login-text">
              登录后可设置头像、昵称和个人信息<br />
              查看你的专属航线足迹
            </p>
          </div>
        )}

        {/* 编辑弹窗 */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="rg-edit-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(false)}
            >
              <motion.div
                className="rg-edit-modal"
                initial={{ scale: 0.92, y: 24, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.92, y: 24, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={e => e.stopPropagation()}
              >
                <h3 className="rg-edit-title">编辑个人资料</h3>

                <div className="rg-edit-field">
                  <div className="rg-edit-label">昵称</div>
                  <input className="rg-edit-input" value={editNickname} onChange={e => setEditNickname(e.target.value)} maxLength={20} placeholder="给自己起个名字" />
                </div>

                <div className="rg-edit-field">
                  <div className="rg-edit-label">个人简介</div>
                  <textarea className="rg-edit-input" value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={100} rows={2} placeholder="一句话介绍自己" style={{ resize: "none" }} />
                </div>

                <div className="rg-edit-field">
                  <div className="rg-edit-label">旅行风格</div>
                  <div className="rg-style-grid">
                    {TRAVEL_STYLES.map(s => (
                      <button key={s} className={`rg-style-chip ${editStyle === s ? "selected" : ""}`} onClick={() => setEditStyle(editStyle === s ? "" : s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rg-edit-actions">
                  <button className="rg-btn-cancel" onClick={() => setEditing(false)}>取消</button>
                  <button className="rg-btn-save" onClick={handleSave}>保存</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ===== 航线可视化组件 ===== */
function FlightRoutes({ cities, dashed = false }: { cities: City[]; dashed?: boolean }) {
  if (cities.length === 0) return null;

  const CARD_W = 72;
  const CARD_H = 72;
  const CARD_GAP = 28;
  const ROW_H = 140;
  const MAX_PER_ROW = 6;

  const rows: City[][] = [];
  for (let i = 0; i < cities.length; i += MAX_PER_ROW) {
    rows.push(cities.slice(i, i + MAX_PER_ROW));
  }

  const rowWidth = (cards: number) => cards * CARD_W + (cards - 1) * CARD_GAP;
  const svgWidth = Math.max(...rows.map(r => rowWidth(r.length)), 200);
  const svgHeight = rows.length * ROW_H + 20;

  const getCardPos = (rowIdx: number, colIdx: number) => ({
    x: colIdx * (CARD_W + CARD_GAP),
    y: rowIdx * ROW_H + 20,
  });

  const getPlanePos = (rowIdx: number, colIdx: number, _cardsInRow: number) => {
    const cardPos = getCardPos(rowIdx, colIdx);
    return {
      x: cardPos.x + CARD_W / 2,
      y: cardPos.y - 22,
    };
  };

  return (
    <svg className="rg-routes-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ minHeight: svgHeight }}>
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4D35E" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#7BA89E" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F4D35E" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="routeGradDash" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B0A898" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B0A898" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 航线 + 城市 */}
      {rows.map((row, rowIdx) => {
        const w = rowWidth(row.length);
        return (
          <g key={rowIdx}>
            {/* 连接航线 */}
            {row.length > 1 && (
              <path
                d={`M ${getPlanePos(rowIdx, 0, row.length).x} ${getPlanePos(rowIdx, 0, row.length).y}
                    Q ${w / 2} ${getPlanePos(rowIdx, 0, row.length).y - 30},
                      ${getPlanePos(rowIdx, row.length - 1, row.length).x} ${getPlanePos(rowIdx, row.length - 1, row.length).y}`}
                fill="none"
                stroke={dashed ? "url(#routeGradDash)" : "url(#routeGrad)"}
                strokeWidth="2"
                strokeDasharray={dashed ? "5 4" : undefined}
                strokeLinecap="round"
              />
            )}

            {/* 飞机图标 */}
            {row.map((_, colIdx) => {
              const pos = getPlanePos(rowIdx, colIdx, row.length);
              if (colIdx === 0 && row.length === 1) return null;
              return (
                <g key={`plane-${rowIdx}-${colIdx}`} transform={`translate(${pos.x - 10}, ${pos.y - 10})`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                      fill={dashed ? "#B0A898" : "#7BA89E"}
                      opacity="0.8"
                    />
                  </svg>
                </g>
              );
            })}

            {/* 城市卡片 */}
            {row.map((city, colIdx) => {
              const pos = getCardPos(rowIdx, colIdx);
              const firstImage = city.images?.find(u => !u.startsWith("data:video") && !/\.(mp4|mov|webm)(\?.*)?$/i.test(u)) || city.images?.[0] || "";
              return (
                <foreignObject key={`card-${rowIdx}-${colIdx}`} x={pos.x} y={pos.y} width={CARD_W} height={CARD_H + 20}>
                  <div className="rg-route-city">
                    <div style={{ width: CARD_W, height: CARD_H, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 8px rgba(90,74,58,0.1)" }}>
                      {firstImage ? (
                        <img className="rg-route-city-img" src={firstImage} alt={city.name} loading="lazy" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #F5F3EE, #E8E0D5)", fontSize: 24, color: "#B0A898" }}>
                          🏙️
                        </div>
                      )}
                    </div>
                    <div className="rg-route-city-name">{city.name.replace(/市$/, "")}</div>
                  </div>
                </foreignObject>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
