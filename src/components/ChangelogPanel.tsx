import { motion } from "framer-motion";

/* ============================================================
 * ChangelogPanel — 产品迭代记录
 * 记录产品从零到一的完整演进历程
 * ============================================================ */

interface ChangelogPanelProps {
  onClose: () => void;
}

interface VersionEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

const changelog: VersionEntry[] = [
  {
    version: "v1.6",
    date: "2026-07",
    title: "管理员端升级",
    type: "minor",
    changes: [
      "新增产品迭代记录模块，记录完整演进历程",
      "集成 Hermes 自动评测系统，五维指标量化产品品质",
      "新增技术选型思考模块，展示架构决策背后的 trade-off",
      "全站作品实现账号数据独立，用户数据按账户隔离存储",
    ],
  },
  {
    version: "v1.5",
    date: "2026-06",
    title: "数据体系完善",
    type: "minor",
    changes: [
      "本地账号系统上线，支持注册/登录/数据隔离",
      "全站埋点分析看板，PV / UV / 漏斗 / 趋势实时监控",
      "Service Worker 离线缓存策略优化，NetworkFirst 导航策略",
      "联系与反馈功能上线，用户留言直达管理员邮箱",
    ],
  },
  {
    version: "v1.4",
    date: "2026-05",
    title: "伴龄与回血清单上线",
    type: "major",
    changes: [
      "「伴龄」AI 养老规划伴侣上线，5 个 Tab 导航结构",
      "「回血清单」上线，100 件小事 + 心情标签 + 最小行动建议",
      "回血清单支持折叠/展开历史记录，完成记录不再限制数量",
      "伴龄支持 AI 多轮对话生成个性化养老规划报告",
    ],
  },
  {
    version: "v1.3",
    date: "2026-04",
    title: "解忧杂货店与漫游指南",
    type: "major",
    changes: [
      "「解忧杂货店」上线，浪矢爷爷 AI 回信体验",
      "「漫游指南」上线，省份地图 + 正向/反向推荐双模式",
      "漫游指南胶片风格 UI，雨后黄昏城市剪影主题",
      "物资管家新增拍照识别入库功能 + 入库成功音效反馈",
    ],
  },
  {
    version: "v1.2",
    date: "2026-03",
    title: "通关清单与物资管家",
    type: "major",
    changes: [
      "「通关清单」上线，游戏化任务管理 + 等级经验值系统",
      "「物资管家」上线，保质期提醒 + 分类管理 + 本地持久化",
      "致用页改为单页滚动，玄关 → 项目集 → 工具间 → 书房",
      "筑基、致用、闲情独立页面直通，无需经过小鹿书局中转",
    ],
  },
  {
    version: "v1.1",
    date: "2026-02",
    title: "疗愈模块上线",
    type: "major",
    changes: [
      "「森林疗愈室」上线，呼吸引导 + 冥想计时 + 白噪音",
      "「爱情公寓」AI 朋友圈上线，多角色单聊 + 群聊 + 朋友圈",
      "蝴蝶光标、动态背景、风铃等沉浸式交互元素",
      "疗愈室支持情绪日记 + AI 共情评语",
    ],
  },
  {
    version: "v1.0",
    date: "2026-01",
    title: "小鹿网站初版上线",
    type: "major",
    changes: [
      "个人作品集网站 www.xiaoluweb.com 正式上线",
      "小鹿书局（筑基 / 致用 / 闲情）三板块架构",
      "项目集 LeafBook 支持作品展示与详情查看",
      "Vercel 部署 + Supabase 数据存储 + 全站 HTTPS",
    ],
  },
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  major: { label: "大版本", color: "#8b7355", bg: "rgba(139,115,85,0.08)" },
  minor: { label: "功能更新", color: "#6b8f71", bg: "rgba(107,143,113,0.08)" },
  patch: { label: "修复", color: "#a8a39b", bg: "rgba(168,163,155,0.08)" },
};

const ChangelogPanel: React.FC<ChangelogPanelProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          background: "#f5f0e6",
          width: "100%",
          maxWidth: 720,
          maxHeight: "88vh",
          overflow: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: "28px 32px 20px",
            borderBottom: "1px solid #d5cfc4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#f5f0e6",
            zIndex: 1,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: '"Noto Serif SC", Georgia, serif',
                fontSize: 20,
                color: "#4a4038",
                letterSpacing: "0.06em",
              }}
            >
              产品迭代记录
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a8a39b" }}>
              记录每一次打磨与成长的痕迹
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a8a39b",
              fontSize: 22,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 时间线 */}
        <div style={{ padding: "28px 32px 40px" }}>
          <div style={{ position: "relative" }}>
            {/* 时间线竖线 */}
            <div
              style={{
                position: "absolute",
                left: 11,
                top: 8,
                bottom: 8,
                width: 2,
                background: "#d5cfc4",
              }}
            />

            {changelog.map((entry, idx) => {
              const config = typeConfig[entry.type];
              return (
                <motion.div
                  key={entry.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  style={{
                    position: "relative",
                    paddingLeft: 36,
                    marginBottom: idx < changelog.length - 1 ? 32 : 0,
                  }}
                >
                  {/* 时间线圆点 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 6,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: config.color,
                      border: "3px solid #f5f0e6",
                      boxShadow: `0 0 0 1px ${config.color}`,
                    }}
                  />

                  {/* 版本标签 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Noto Serif SC", Georgia, serif',
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#4a4038",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {entry.version}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        background: config.bg,
                        color: config.color,
                        border: `1px solid ${config.color}20`,
                      }}
                    >
                      {config.label}
                    </span>
                    <span style={{ fontSize: 12, color: "#a8a39b" }}>
                      {entry.date}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#8b7355",
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* 变更列表 */}
                  <ul
                    style={{
                      margin: 0,
                      padding: "0 0 0 16px",
                      listStyle: "none",
                    }}
                  >
                    {entry.changes.map((change, ci) => (
                      <li
                        key={ci}
                        style={{
                          position: "relative",
                          paddingLeft: 14,
                          marginBottom: 4,
                          fontSize: 13,
                          color: "#5c5348",
                          lineHeight: 1.7,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 9,
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#c4b99a",
                          }}
                        />
                        {change}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChangelogPanel;