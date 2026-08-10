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
    version: "v1.8",
    date: "2026-08",
    title: "视觉打磨与精简",
    type: "minor",
    changes: [
      "首页文字配色加深 + 字号放大优化，提升森林背景下的可读性",
      "导航栏等间隔分布，视觉节奏更均匀",
      "伴龄移除登录注册，直接进入页面降低使用门槛",
      "解忧杂货店去掉积分体系，回血清单登录注册移至「我的」页面",
      "移除签到积分面板（爱情公寓/疗愈室/伴龄），回归作品核心体验",
      "移除 playwright/puppeteer/sharp 重型依赖，修复 Vercel 构建失败",
    ],
  },
  {
    version: "v1.7",
    date: "2026-07-29",
    title: "管理员端升级",
    type: "minor",
    changes: [
      "新增产品迭代记录模块，记录完整演进历程",
      "集成 Hermes 自动评测系统，五维指标量化产品品质",
      "新增技术选型思考模块，展示架构决策背后的 trade-off",
      "回血清单完成记录扩展到 20 条，支持折叠展开默认显示 5 条",
    ],
  },
  {
    version: "v1.6",
    date: "2026-07-28",
    title: "积分体系与多媒体",
    type: "minor",
    changes: [
      "全产品积分打卡体系，6 款产品集成通用签到打卡面板",
      "周报替代日报，Vercel Cron 每周自动推送数据分析邮件",
      "支持上传视频 + 实况图，轮播图混排播放",
      "积分体系视觉弱化，融入作品风格不突兀",
    ],
  },
  {
    version: "v1.5",
    date: "2026-07-27",
    title: "PWA 与金币体系",
    type: "major",
    changes: [
      "8 个作品独立 PWA 配置 + 二维码扫码安装，可作为独立应用",
      "微信扫码检测 + 浏览器引导提示",
      "通关清单金币积分体系上线：完成任务发金币、每日签到、称号梯度",
      "跨产品联动体验卡：回血清单/通关清单连续打卡 7 天互送礼券",
      "单作品独立访问模式（solo=1），隐藏导航入口",
      "回血清单联系与反馈功能，留言直达管理员邮箱",
      "Capacitor Android 项目 + GitHub Actions APK 自动构建",
    ],
  },
  {
    version: "v1.4",
    date: "2026-07-26",
    title: "伴龄上线",
    type: "major",
    changes: [
      "「伴龄」AI 养老规划伴侣上线，5 Tab 底部导航结构",
      "AI 多轮对话生成个性化养老规划报告 + 行动建议采纳",
      "冥想语音引导：多段动态调度，呼吸/身体/正念交替穿插",
      "伴龄视觉风格统一为暖米色 + 棕褐色书籍式（直角卡片 + 衬线字体）",
      "漫游指南手机端白屏修复",
    ],
  },
  {
    version: "v1.3",
    date: "2026-07-03",
    title: "爱情公寓与全工具发布",
    type: "major",
    changes: [
      "「爱情公寓」上线：7 位 AI 房客 + 群聊 + @提及 + 接力回复",
      "「森林疗愈室」「回血清单」「解压馆」「时光博物馆」正式发布",
      "远程数据同步 via GitHub API，支持跨设备数据持久化",
      "爱情公寓角色获知现实时间，回答时间问题不再编造",
      "全站 7 个作品产品文档同步发布",
    ],
  },
  {
    version: "v1.2",
    date: "2026-07-02",
    title: "解忧杂货店与 PWA",
    type: "major",
    changes: [
      "「解忧杂货店」上线：AI 回信 + 四角色系统 + 打字机效果",
      "PWA 配置：独立安装 + 离线缓存 + Service Worker",
      "Footer 重构 + 导航栏森林晨雾视觉升级",
      "管理员面板图片上传组件（Base64 预览/拖拽/删除）",
      "系统调频接入 AI 模型 + LeafBook 目录页对页重构",
    ],
  },
  {
    version: "v1.1",
    date: "2026-07-01",
    title: "生活放映与物资管家",
    type: "major",
    changes: [
      "生活放映中六大模块上传功能 + 导航链接修复",
      "「物资管家」上线：保质期提醒 + 分类管理 + 三色状态标识 + 存放位置",
      "时代回响模块：复古报纸风格卡片 + CRUD + 图片上传",
      "「通关清单」初版：游戏化任务管理 + 智能拆解弹窗 + 难度分级",
      "时光博物馆 CRUD + AI 生成图片 + 胶片显影入场动画",
    ],
  },
  {
    version: "v1.0",
    date: "2026-06-29",
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