import { useEffect } from "react";
import type { CSSProperties } from "react";
import { track } from "../utils/track";

/**
 * 伴龄 — 产品案例研究 (Product Case Study)
 *
 * 将个人项目重新包装为商业产品案例，
 * 包含市场分析、竞品对比、商业模式、技术架构、指标框架。
 */

const S = {
  page: {
    minHeight: "100vh",
    background: "#f8f6f1",
    color: "#2a2a2a",
    fontFamily: "'Noto Serif SC', 'Songti SC', serif",
    lineHeight: 1.8,
  } as CSSProperties,

  hero: {
    position: "relative" as const,
    overflow: "hidden",
    background: "linear-gradient(135deg, #1a2e1f 0%, #2d5f3f 50%, #1a3a2a 100%)",
    color: "#f5f0e6",
    padding: "80px 24px 100px",
  } as CSSProperties,

  heroInner: {
    maxWidth: 960,
    margin: "0 auto",
  } as CSSProperties,

  heroBadge: {
    display: "inline-block",
    padding: "5px 16px",
    border: "1px solid rgba(245,240,230,0.35)",
    borderRadius: 2,
    fontSize: 13,
    letterSpacing: "0.15em",
    color: "rgba(245,240,230,0.85)",
    marginBottom: 28,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  heroTitle: {
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: "0.04em",
    marginBottom: 12,
    lineHeight: 1.3,
  } as CSSProperties,

  heroSubtitle: {
    fontSize: 20,
    fontWeight: 400,
    color: "rgba(245,240,230,0.8)",
    marginBottom: 36,
    maxWidth: 640,
    lineHeight: 1.7,
  } as CSSProperties,

  heroMetrics: {
    display: "flex",
    gap: 48,
    flexWrap: "wrap" as const,
  } as CSSProperties,

  heroMetric: {
    display: "flex",
    flexDirection: "column" as const,
  } as CSSProperties,

  heroMetricNum: {
    fontSize: 36,
    fontWeight: 700,
    color: "#c4a35a",
    fontFamily: "'Georgia', serif",
  } as CSSProperties,

  heroMetricLabel: {
    fontSize: 13,
    color: "rgba(245,240,230,0.6)",
    marginTop: 4,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  section: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "72px 24px",
  } as CSSProperties,

  sectionTag: {
    display: "inline-block",
    fontSize: 12,
    letterSpacing: "0.2em",
    color: "#8b7355",
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 8,
    textTransform: "uppercase" as const,
  } as CSSProperties,

  sectionTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: "#1a2e1f",
    marginBottom: 32,
    letterSpacing: "0.03em",
  } as CSSProperties,

  card: {
    background: "#fffdf8",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: 32,
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  } as CSSProperties,

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  } as CSSProperties,

  statCard: {
    background: "#fffdf8",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: "24px 28px",
    textAlign: "left" as const,
  } as CSSProperties,

  statNum: {
    fontSize: 32,
    fontWeight: 700,
    color: "#2d5f3f",
    fontFamily: "'Georgia', serif",
    lineHeight: 1.2,
  } as CSSProperties,

  statLabel: {
    fontSize: 13,
    color: "#8b7355",
    marginTop: 6,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  statNote: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    borderBottom: "2px solid #2d5f3f",
    fontSize: 13,
    fontWeight: 600,
    color: "#1a2e1f",
    whiteSpace: "nowrap" as const,
  } as CSSProperties,

  td: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    color: "#444",
    verticalAlign: "top" as const,
  } as CSSProperties,

  painItem: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-start" as const,
  } as CSSProperties,

  painDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#c45a3a",
    marginTop: 10,
    flexShrink: 0,
  } as CSSProperties,

  personaCard: {
    background: "#fffdf8",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: 28,
    borderLeft: "3px solid #2d5f3f",
  } as CSSProperties,

  personaName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a2e1f",
    marginBottom: 4,
  } as CSSProperties,

  personaDesc: {
    fontSize: 14,
    color: "#666",
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 12,
    lineHeight: 1.7,
  } as CSSProperties,

  tag: {
    display: "inline-block",
    padding: "3px 10px",
    background: "rgba(45,95,63,0.08)",
    color: "#2d5f3f",
    borderRadius: 2,
    fontSize: 12,
    fontFamily: "'Noto Sans SC', sans-serif",
    marginRight: 6,
    marginBottom: 4,
  } as CSSProperties,

  archBox: {
    background: "#1a2e1f",
    color: "#f5f0e6",
    borderRadius: 4,
    padding: "16px 24px",
    textAlign: "center" as const,
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  archLayer: {
    marginBottom: 12,
  } as CSSProperties,

  archArrow: {
    textAlign: "center" as const,
    color: "#8b7355",
    fontSize: 18,
    marginBottom: 12,
  } as CSSProperties,

  roadmapLine: {
    display: "flex",
    gap: 0,
    overflowX: "auto" as const,
    paddingBottom: 8,
  } as CSSProperties,

  roadmapPhase: {
    flex: 1,
    minWidth: 200,
    padding: "0 16px",
    borderLeft: "2px solid #2d5f3f",
    position: "relative" as const,
  } as CSSProperties,

  roadmapDot: {
    position: "absolute" as const,
    left: -7,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#2d5f3f",
    border: "2px solid #f8f6f1",
  } as CSSProperties,

  roadmapPhaseTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a2e1f",
    marginBottom: 8,
    marginTop: 4,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  roadmapPhaseTime: {
    fontSize: 12,
    color: "#8b7355",
    marginBottom: 12,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  roadmapItem: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    fontFamily: "'Noto Sans SC', sans-serif",
    lineHeight: 1.6,
  } as CSSProperties,

  ctaBar: {
    background: "#1a2e1f",
    color: "#f5f0e6",
    padding: "56px 24px",
    textAlign: "center" as const,
  } as CSSProperties,

  ctaTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
  } as CSSProperties,

  ctaText: {
    fontSize: 15,
    color: "rgba(245,240,230,0.7)",
    marginBottom: 28,
    maxWidth: 480,
    margin: "0 auto 28px",
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  ctaBtn: {
    display: "inline-block",
    padding: "12px 36px",
    background: "#c4a35a",
    color: "#1a2e1f",
    textDecoration: "none",
    borderRadius: 2,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Noto Sans SC', sans-serif",
    transition: "opacity 0.2s",
  } as CSSProperties,

  bodyText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 1.9,
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 16,
  } as CSSProperties,

  highlightText: {
    fontSize: 16,
    color: "#2d5f3f",
    fontWeight: 600,
    lineHeight: 1.8,
    marginBottom: 20,
  } as CSSProperties,

  sourceNote: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
    fontFamily: "'Noto Sans SC', sans-serif",
    fontStyle: "italic" as const,
  } as CSSProperties,
};

export default function CaseStudyBanling() {
  useEffect(() => {
    track("case_study_view", { project: "banling" });
    document.title = "伴龄 · 产品案例研究 | AI 养老规划伴侣";
  }, []);

  return (
    <div style={S.page}>
      {/* ===================== Hero ===================== */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroBadge}>PRODUCT CASE STUDY · 产品案例研究</div>
          <h1 style={S.heroTitle}>伴龄</h1>
          <p style={S.heroSubtitle}>
            AI 驱动的养老规划伴侣 —— 用对话式 AI 降低养老规划的信息门槛，
            为 3.23 亿中国老年人提供个性化、可执行的退休生活方案。
          </p>
          <div style={S.heroMetrics}>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>9 万亿</span>
              <span style={S.heroMetricLabel}>银发经济市场规模 (2025)</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>3.23 亿</span>
              <span style={S.heroMetricLabel}>60 岁以上人口</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>20-46%</span>
              <span style={S.heroMetricLabel}>AI 养老细分年增速</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>4500 万</span>
              <span style={S.heroMetricLabel}>失能失智老人</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Executive Summary ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>EXECUTIVE SUMMARY</div>
        <h2 style={S.sectionTitle}>产品概要</h2>
        <div style={S.card}>
          <p style={S.bodyText}>
            <strong>伴龄</strong>是一款 AI 驱动的养老规划 PWA 应用，定位为"退休生活的 AI 导航员"。
            产品通过多轮对话渐进式收集用户信息（年龄段、关注点、财务状况），结合 AI 生成结构化养老规划报告，
            并提供养老金缺口计算、退休方案对比、目标设定等量化工具。
          </p>
          <p style={S.bodyText}>
            核心差异化在于：市场上养老工具多为简单计算器或信息门户，缺乏<strong>"对话式 AI 顾问"</strong>形态。
            伴龄填补了"智能养老规划导航员"这一空白，将复杂的养老政策、财务测算、健康管理
            通过自然语言交互降低至零门槛。
          </p>
          <div style={{ ...S.grid3, marginTop: 24 }}>
            <div style={S.statCard}>
              <div style={S.statNum}>5</div>
              <div style={S.statLabel}>核心功能模块</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>2</div>
              <div style={S.statLabel}>AI 大模型集成</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>PWA</div>
              <div style={S.statLabel}>可安装 · 离线可用</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>¥98-399</div>
              <div style={S.statLabel}>行业定价区间 / 年</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Market Opportunity ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>MARKET ANALYSIS · 市场分析</div>
        <h2 style={S.sectionTitle}>市场机会</h2>

        <div style={S.grid3}>
          <div style={S.statCard}>
            <div style={S.statNum}>9.8 万亿</div>
            <div style={S.statLabel}>银发经济规模 (2026 预测)</div>
            <div style={S.statNote}>中商产业研究院</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>30 万亿</div>
            <div style={S.statLabel}>2035 年预测规模</div>
            <div style={S.statNote}>约占 GDP 10%</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>7000 亿</div>
            <div style={S.statLabel}>AI 养老细分市场 (2025)</div>
            <div style={S.statNote}>同比增长 20%+</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>23.0%</div>
            <div style={S.statLabel}>60+ 人口占比</div>
            <div style={S.statNote}>3.23 亿人，民政部 2025 公报</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>79.25</div>
            <div style={S.statLabel}>人均预期寿命</div>
            <div style={S.statNote}>国家统计局</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>¥1.2 万</div>
            <div style={S.statLabel}>个人养老金年缴上限</div>
            <div style={S.statNote}>仅 22% 账户实际缴存</div>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a2e1f", marginBottom: 16 }}>
            政策红利驱动
          </h3>
          <div style={S.painItem}>
            <div style={S.painDot} />
            <div>
              <strong>国办发〔2024〕1 号</strong> —— 首个国家级银发经济专项政策，
              明确提出"智慧健康养老新业态"，鼓励 AI、可穿戴设备、服务机器人在养老场景应用。
            </div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2d5f3f" }} />
            <div>
              <strong>渐进式延迟退休</strong> —— 2025 年 1 月生效，逐步延迟至 65 岁（2039 年），
              重塑退休规划需求，延长了"规划窗口期"。
            </div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#c4a35a" }} />
            <div>
              <strong>八部委联合措施</strong>（2025.12）—— 培育养老服务经营主体，
              促进银发经济发展，鼓励市场化创新。
            </div>
          </div>
          <p style={S.sourceNote}>
            数据来源：民政部《2025 年度国家老龄事业发展公报》、中商产业研究院、HSBC Global Research
          </p>
        </div>
      </div>

      {/* ===================== Problem Statement ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>PROBLEM · 用户痛点</div>
        <h2 style={S.sectionTitle}>我们解决什么问题</h2>

        <div style={S.grid2}>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点一：失能照护困境
            </h3>
            <p style={S.bodyText}>
              全国 4500 万失能失智老人，月均护理费 ¥5,000-10,000+。
              长护险仅试点城市覆盖，家庭照护压力巨大。民政部定调为"必须优先解决"的问题。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点二：经济压力与收入保障不足
            </h3>
            <p style={S.bodyText}>
              基础养老金仅"保基本"；独生子女家庭养老支出高出 38%。
              个人养老金账户 70%+ 处于沉睡状态，仅 22% 实际缴存 —— 规划工具门槛过高是核心原因。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点三：数字鸿沟
            </h3>
            <p style={S.bodyText}>
              60-69 岁用户 7 日留存 53.2%，而 70+ 仅 31.7% —— 21.5 个百分点的留存断崖。
              "技术先进、服务滞后"是行业共识，现有产品适老化不足。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点四：信息不对称 / 规划难
            </h3>
            <p style={S.bodyText}>
              养老金融产品复杂度高，老年人接受率低于 30%。
              三支柱体系碎片化，无统一的"退休规划导航员"产品 —— 市场空白点。
            </p>
          </div>
        </div>
      </div>

      {/* ===================== Competitive Analysis ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>COMPETITIVE LANDSCAPE · 竞品分析</div>
        <h2 style={S.sectionTitle}>竞争格局</h2>

        <div style={S.card} style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>竞品</th>
                  <th style={S.th}>类型</th>
                  <th style={S.th}>核心功能</th>
                  <th style={S.th}>用户规模</th>
                  <th style={S.th}>定价</th>
                  <th style={S.th}>差异化缺口</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={S.td}><strong>老来健康</strong></td>
                  <td style={S.td}>B2C App</td>
                  <td style={S.td}>社保认证、慢病管理、在线问诊、社区</td>
                  <td style={S.td}>2.5 亿覆盖人口</td>
                  <td style={S.td}>¥128-398/年</td>
                  <td style={S.td}>无 AI 对话式规划</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>平安健康</strong></td>
                  <td style={S.td}>B2C App</td>
                  <td style={S.td}>AI 家庭医生、报告解读、保险联动</td>
                  <td style={S.td}>4.9 万内外部医生</td>
                  <td style={S.td}>会员订阅</td>
                  <td style={S.td}>偏医疗，非养老规划</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>百度福宝 + 小度</strong></td>
                  <td style={S.td}>硬件+云</td>
                  <td style={S.td}>智能屏陪伴、健康管理、免接听视频</td>
                  <td style={S.td}>10 万+ 户家庭</td>
                  <td style={S.td}>¥504-899 硬件</td>
                  <td style={S.td}>重硬件，轻规划深度</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>腾讯银发守护</strong></td>
                  <td style={S.td}>微信小程序</td>
                  <td style={S.td}>健康档案、紧急 SOS、在线问诊</td>
                  <td style={S.td}>3200 万+ 注册</td>
                  <td style={S.td}>免费</td>
                  <td style={S.td}>无 AI 规划能力</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>ElliQ</strong> (美国)</td>
                  <td style={S.td}>AI 陪伴机器人</td>
                  <td style={S.td}>主动对话、认知训练、健康追踪</td>
                  <td style={S.td}>海外市场</td>
                  <td style={S.td}>$249 + $50/月</td>
                  <td style={S.td}>重陪伴，非财务规划</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>泰康之家</strong></td>
                  <td style={S.td}>保险+养老社区</td>
                  <td style={S.td}>CCRC 社区、康复医院、保险闭环</td>
                  <td style={S.td}>2.2 万+ 入住</td>
                  <td style={S.td}>百万级保费</td>
                  <td style={S.td}>高净值专属，门槛极高</td>
                </tr>
                <tr style={{ background: "rgba(45,95,63,0.04)" }}>
                  <td style={S.td}><strong style={{ color: "#2d5f3f" }}>伴龄（本项目）</strong></td>
                  <td style={S.td}>B2C PWA</td>
                  <td style={S.td}>AI 对话式规划、结构化报告、养老金测算</td>
                  <td style={S.td}>产品 demo</td>
                  <td style={S.td}>Freemium 目标</td>
                  <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>
                    唯一专注"对话式 AI 养老规划"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20, borderLeft: "3px solid #c4a35a" }}>
          <p style={S.highlightText}>
            竞争定位：科技巨头（百度/阿里/腾讯）占据云平台和流量入口，
            保险巨头（泰康/平安）占据高端闭环，
            但<strong>"AI 对话式养老规划导航员"</strong>这一细分赛道尚无主导产品 —— 
            这正是伴龄的差异化机会。
          </p>
        </div>
      </div>

      {/* ===================== Business Model ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>BUSINESS MODEL · 商业模式</div>
        <h2 style={S.sectionTitle}>商业模式画布</h2>

        <div style={S.grid2}>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d5f3f", marginBottom: 12 }}>
              收入模式
            </h3>
            <div style={{ marginBottom: 12 }}>
              <span style={S.tag}>Freemium 订阅</span>
              <span style={S.tag}>B2B2C 渠道分成</span>
              <span style={S.tag}>保险导流佣金</span>
              <span style={S.tag}>适老化 API 授权</span>
            </div>
            <table style={S.table}>
              <thead>
                <tr><th style={S.th}>层级</th><th style={S.th}>定价</th><th style={S.th}>功能</th></tr>
              </thead>
              <tbody>
                <tr><td style={S.td}>免费版</td><td style={S.td}>¥0</td><td style={S.td}>基础对话、养老金计算器</td></tr>
                <tr><td style={S.td}>会员版</td><td style={S.td}>¥199/年</td><td style={S.td}>深度规划报告、方案对比、历史记录</td></tr>
                <tr><td style={S.td}>家庭版</td><td style={S.td}>¥399/年</td><td style={S.td}>多成员管理、子女远程查看、紧急联系</td></tr>
              </tbody>
            </table>
          </div>

          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d5f3f", marginBottom: 12 }}>
              单位经济模型
            </h3>
            <table style={S.table}>
              <tbody>
                <tr><td style={S.td}>目标 ARPU</td><td style={{ ...S.td, fontWeight: 600, color: "#2d5f3f" }}>¥199/年</td></tr>
                <tr><td style={S.td}>AI 调用成本 / 用户 / 月</td><td style={S.td}>¥0.8-1.5（DashScope）</td></tr>
                <tr><td style={S.td}>年 AI 成本</td><td style={S.td}>¥10-18</td></tr>
                <tr><td style={S.td}>毛利率</td><td style={{ ...S.td, fontWeight: 600, color: "#2d5f3f" }}>~91%</td></tr>
                <tr><td style={S.td}>免费→付费转化率（目标）</td><td style={S.td}>5-8%</td></tr>
                <tr><td style={S.td}>CAC（目标）</td><td style={S.td}>¥30-50（社群+内容营销）</td></tr>
                <tr><td style={S.td}>LTV / CAC</td><td style={{ ...S.td, fontWeight: 600, color: "#2d5f3f" }}>~4:1</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2d5f3f", marginBottom: 12 }}>
            代际消费模式
          </h3>
          <p style={S.bodyText}>
            养老产品的核心购买路径是<strong>"子女付费，父母使用"</strong> —— 这是市场上最主流的代际消费模式。
            伴龄的产品设计需同时服务两端：老年人端强调适老化交互（大字体、语音输入、极简流程），
            子女端提供远程查看、健康提醒、财务规划共享功能，形成双端价值闭环。
          </p>
        </div>
      </div>

      {/* ===================== User Personas ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>USER PERSONAS · 用户画像</div>
        <h2 style={S.sectionTitle}>目标用户</h2>

        <div style={S.grid2}>
          <div style={S.personaCard}>
            <div style={S.personaName}>王阿姨 · 62 岁，刚退休</div>
            <div style={S.personaDesc}>
              事业单位退休，月退休金 ¥4,500。身体健康，会使用微信和短视频。
              对"退休后怎么安排"感到迷茫，想了解养老金够不够、需要不需要买商业保险。
            </div>
            <div>
              <span style={S.tag}>60-64 岁主力人群</span>
              <span style={S.tag}>规划需求强</span>
              <span style={S.tag}>数字能力中等</span>
            </div>
          </div>
          <div style={S.personaCard}>
            <div style={S.personaName}>小李 · 35 岁，独生子女</div>
            <div style={S.personaDesc}>
              一线城市互联网从业者，父母 63 岁，在老家。担心父母养老问题，
              想帮父母做退休规划但缺乏专业知识，希望有工具能远程协助。
            </div>
            <div>
              <span style={S.tag}>代际付费者</span>
              <span style={S.tag}>远程关怀</span>
              <span style={S.tag}>决策者</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== Solution ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>SOLUTION · 解决方案</div>
        <h2 style={S.sectionTitle}>产品功能矩阵</h2>

        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>模块</th>
                <th style={S.th}>功能</th>
                <th style={S.th}>解决痛点</th>
                <th style={S.th}>技术实现</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.td}><strong>AI 对话规划</strong></td>
                <td style={S.td}>多轮渐进式对话收集信息，AI 顾问角色引导</td>
                <td style={S.td}>信息不对称 / 规划难</td>
                <td style={S.td}>DashScope deepseek-r1，温度 0.75</td>
              </tr>
              <tr>
                <td style={S.td}><strong>结构化报告</strong></td>
                <td style={S.td}>AI 生成洞察+量化指标+行动建议+摘要</td>
                <td style={S.td}>规划方案不清晰</td>
                <td style={S.td}>qwen-plus 模型，JSON 结构化输出</td>
              </tr>
              <tr>
                <td style={S.td}><strong>养老金计算器</strong></td>
                <td style={S.td}>7 参数滑动测算缺口、复利增长、总额</td>
                <td style={S.td}>经济压力 / 收入保障</td>
                <td style={S.td}>纯前端计算，实时反馈</td>
              </tr>
              <tr>
                <td style={S.td}><strong>退休方案对比</strong></td>
                <td style={S.td}>55/60/65 三档退休方案储蓄预测</td>
                <td style={S.td}>退休时点决策困难</td>
                <td style={S.td}>场景化对比引擎</td>
              </tr>
              <tr>
                <td style={S.td}><strong>每日健康贴士</strong></td>
                <td style={S.td}>基于天气+年龄的个性化健康建议</td>
                <td style={S.td}>日常健康管理缺引导</td>
                <td style={S.td}>wttr.in 天气 API + 规则引擎</td>
              </tr>
              <tr>
                <td style={S.td}><strong>行动采纳追踪</strong></td>
                <td style={S.td}>报告建议可采纳/取消，持久化记录</td>
                <td style={S.td}>规划落地难</td>
                <td style={S.td}>LocalStorage 状态管理</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Technical Architecture ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>TECHNICAL ARCHITECTURE · 技术架构</div>
        <h2 style={S.sectionTitle}>系统架构</h2>

        <div style={S.card}>
          <div style={S.archLayer}>
            <div style={S.archBox}>
              <strong>前端层</strong> · React 19 + TypeScript + Framer Motion<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>PWA 离线缓存 · 适老化交互 · 移动优先(max-width 480px)</span>
            </div>
          </div>
          <div style={S.archArrow}>↓</div>
          <div style={S.archLayer}>
            <div style={S.archBox}>
              <strong>API 网关层</strong> · Vercel Serverless Functions<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>/api/ai · 统一 AI 代理 · API Key 服务端管理 · CORS 控制</span>
            </div>
          </div>
          <div style={S.archArrow}>↓</div>
          <div style={S.archLayer}>
            <div style={{ ...S.archBox, background: "#2d5f3f" }}>
              <strong>AI 模型层</strong> · 阿里云 DashScope<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                deepseek-r1（对话规划）· qwen-plus（报告生成）· 温度/Token 动态调控
              </span>
            </div>
          </div>
          <div style={S.archArrow}>↓</div>
          <div style={S.archLayer}>
            <div style={{ ...S.archBox, background: "#8b7355" }}>
              <strong>数据层</strong> · LocalStorage + 外部 API<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                用户画像 / 报告历史 / 会话记录 · wttr.in 天气 · BigDataCloud 地理编码
              </span>
            </div>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2e1f", marginBottom: 12 }}>
            架构亮点
          </h3>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2d5f3f" }} />
            <div><strong>双模型策略</strong> —— 对话用 deepseek-r1（高温度 0.75，自然亲和），报告用 qwen-plus（低温度 0.5，结构严谨）</div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2d5f3f" }} />
            <div><strong>渐进式信息收集</strong> —— AI 每轮只问一个问题，3 轮后自动引导生成报告，降低认知负荷</div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2d5f3f" }} />
            <div><strong>JSON 结构化输出</strong> —— 报告强制 JSON 格式（insight + metrics + actions + summary），支持采纳追踪和导出</div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2d5f3f" }} />
            <div><strong>API Key 安全隔离</strong> —— 密钥仅存于 Vercel 环境变量，前端零暴露</div>
          </div>
        </div>
      </div>

      {/* ===================== Metrics ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>KEY METRICS · 指标框架</div>
        <h2 style={S.sectionTitle}>产品指标体系</h2>

        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>层级</th>
                <th style={S.th}>指标</th>
                <th style={S.th}>目标值</th>
                <th style={S.th}>行业基准</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.td} rowSpan={2}><strong>获客</strong></td>
                <td style={S.td}>注册转化率</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≥ 60%</td>
                <td style={S.td}>养老类 App 均值 40-50%</td>
              </tr>
              <tr>
                <td style={S.td}>首次价值实现时间</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≤ 2 分钟</td>
                <td style={S.td}>首次 AI 回复即产生价值</td>
              </tr>
              <tr>
                <td style={S.td} rowSpan={3}><strong>参与</strong></td>
                <td style={S.td}>DAU/MAU</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>20-30%</td>
                <td style={S.td}>银发 App 优秀线 20-30%</td>
              </tr>
              <tr>
                <td style={S.td}>报告生成完成率</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≥ 70%</td>
                <td style={S.td}>对话 4 轮后引导生成</td>
              </tr>
              <tr>
                <td style={S.td}>行动采纳率</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≥ 40%</td>
                <td style={S.td}>行业核心功能使用率 ~25%</td>
              </tr>
              <tr>
                <td style={S.td} rowSpan={2}><strong>留存</strong></td>
                <td style={S.td}>7 日留存（60-69 岁）</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≥ 40%</td>
                <td style={S.td}>行业均值 53.2%（该年龄段）</td>
              </tr>
              <tr>
                <td style={S.td}>7 日留存（70+ 岁）</td>
                <td style={{ ...S.td, color: "#c45a3a", fontWeight: 600 }}>≥ 35%</td>
                <td style={S.td}>行业均值仅 31.7%</td>
              </tr>
              <tr>
                <td style={S.td} rowSpan={2}><strong>商业</strong></td>
                <td style={S.td}>免费→付费转化</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>5-8%</td>
                <td style={S.td}>Freemium 行业 3-7%</td>
              </tr>
              <tr>
                <td style={S.td}>NPS</td>
                <td style={{ ...S.td, color: "#2d5f3f", fontWeight: 600 }}>≥ 30</td>
                <td style={S.td}>银发 App 目标 30+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Roadmap ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>ROADMAP · 产品路线图</div>
        <h2 style={S.sectionTitle}>发展规划</h2>

        <div style={S.card}>
          <div style={S.roadmapLine}>
            <div style={S.roadmapPhase}>
              <div style={S.roadmapDot} />
              <div style={S.roadmapPhaseTitle}>Phase 1 · MVP</div>
              <div style={S.roadmapPhaseTime}>已完成</div>
              <div style={S.roadmapItem}>AI 对话式养老规划</div>
              <div style={S.roadmapItem}>结构化报告生成</div>
              <div style={S.roadmapItem}>养老金缺口计算器</div>
              <div style={S.roadmapItem}>退休方案对比</div>
              <div style={S.roadmapItem}>PWA 安装 + 离线</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={S.roadmapDot} />
              <div style={S.roadmapPhaseTitle}>Phase 2 · 增长</div>
              <div style={S.roadmapPhaseTime}>3-6 个月</div>
              <div style={S.roadmapItem}>云端数据同步（Supabase）</div>
              <div style={S.roadmapItem}>家庭多成员管理</div>
              <div style={S.roadmapItem}>语音输入 / TTS 朗读</div>
              <div style={S.roadmapItem}>AI 流式响应</div>
              <div style={S.roadmapItem}>微信小程序版本</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={{ ...S.roadmapDot, background: "#c4a35a" }} />
              <div style={S.roadmapPhaseTitle}>Phase 3 · 商业化</div>
              <div style={S.roadmapPhaseTime}>6-12 个月</div>
              <div style={S.roadmapItem}>会员订阅体系</div>
              <div style={S.roadmapItem}>保险产品导流（佣金分成）</div>
              <div style={S.roadmapItem}>B2B2C 社区/机构合作</div>
              <div style={S.roadmapItem}>健康数据对接（可穿戴设备）</div>
              <div style={S.roadmapItem}>子女端远程关怀面板</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={{ ...S.roadmapDot, background: "#8b7355" }} />
              <div style={S.roadmapPhaseTitle}>Phase 4 · 生态</div>
              <div style={S.roadmapPhaseTime}>12-24 个月</div>
              <div style={S.roadmapItem}>养老机构 API 开放平台</div>
              <div style={S.roadmapItem}>适老化交互组件库（开源）</div>
              <div style={S.roadmapItem}>政府民生服务对接</div>
              <div style={S.roadmapItem}>长护险评估辅助</div>
              <div style={S.roadmapItem}>多模态健康监测</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== CTA ===================== */}
      <div style={S.ctaBar}>
        <h2 style={S.ctaTitle}>体验伴龄</h2>
        <p style={S.ctaText}>
          扫描二维码或在浏览器中打开，与 AI 养老顾问开启第一次对话。
        </p>
        <a
          href="/toolbox/banling"
          style={S.ctaBtn}
          onClick={() => track("case_study_cta", { project: "banling" })}
        >
          进入产品体验 →
        </a>
      </div>
    </div>
  );
}
