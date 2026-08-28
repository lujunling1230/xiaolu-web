import { useEffect } from "react";
import type { CSSProperties } from "react";
import { track } from "../utils/track";

/**
 * Hermes 评测系统 — 产品案例研究 (Product Case Study)
 *
 * 定位：AI 产品评测平台，专注网站级端到端评测
 * 差异化：从 LLM 输出评测升级到完整产品体验评测
 */

const S = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f3",
    color: "#2a2a2a",
    fontFamily: "'Noto Serif SC', 'Songti SC', serif",
    lineHeight: 1.8,
  } as CSSProperties,

  hero: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0d1117 0%, #1a2b3c 50%, #0d1a2d 100%)",
    color: "#e8e6e1",
    padding: "80px 24px 100px",
  } as CSSProperties,

  heroInner: {
    maxWidth: 960,
    margin: "0 auto",
  } as CSSProperties,

  heroBadge: {
    display: "inline-block",
    padding: "5px 16px",
    border: "1px solid rgba(232,230,225,0.3)",
    borderRadius: 2,
    fontSize: 13,
    letterSpacing: "0.15em",
    color: "rgba(232,230,225,0.8)",
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
    color: "rgba(232,230,225,0.75)",
    marginBottom: 36,
    maxWidth: 660,
    lineHeight: 1.7,
  } as CSSProperties,

  heroMetrics: {
    display: "flex",
    gap: 48,
    flexWrap: "wrap",
  } as CSSProperties,

  heroMetric: {
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,

  heroMetricNum: {
    fontSize: 36,
    fontWeight: 700,
    color: "#58a6ff",
    fontFamily: "'Georgia', serif",
  } as CSSProperties,

  heroMetricLabel: {
    fontSize: 13,
    color: "rgba(232,230,225,0.55)",
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
    color: "#6b7280",
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 8,
    textTransform: "uppercase",
  } as CSSProperties,

  sectionTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 32,
    letterSpacing: "0.03em",
  } as CSSProperties,

  card: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: 32,
    marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
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
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: "24px 28px",
  } as CSSProperties,

  statNum: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1a6b54",
    fontFamily: "'Georgia', serif",
    lineHeight: 1.2,
  } as CSSProperties,

  statLabel: {
    fontSize: 13,
    color: "#6b7280",
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
    borderCollapse: "collapse",
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  th: {
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: "2px solid #1a6b54",
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
  } as CSSProperties,

  td: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    color: "#444",
    verticalAlign: "top",
  } as CSSProperties,

  painItem: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  } as CSSProperties,

  painDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#c45a3a",
    marginTop: 10,
    flexShrink: 0,
  } as CSSProperties,

  tag: {
    display: "inline-block",
    padding: "3px 10px",
    background: "rgba(26,107,84,0.08)",
    color: "#1a6b54",
    borderRadius: 2,
    fontSize: 12,
    fontFamily: "'Noto Sans SC', sans-serif",
    marginRight: 6,
    marginBottom: 4,
  } as CSSProperties,

  archBox: {
    background: "#0d1117",
    color: "#e8e6e1",
    borderRadius: 4,
    padding: "16px 24px",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  archArrow: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 18,
    marginBottom: 12,
  } as CSSProperties,

  roadmapLine: {
    display: "flex",
    gap: 0,
    overflowX: "auto",
    paddingBottom: 8,
  } as CSSProperties,

  roadmapPhase: {
    flex: 1,
    minWidth: 200,
    padding: "0 16px",
    borderLeft: "2px solid #1a6b54",
    position: "relative",
  } as CSSProperties,

  roadmapDot: {
    position: "absolute",
    left: -7,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#1a6b54",
    border: "2px solid #f5f5f3",
  } as CSSProperties,

  ctaBar: {
    background: "#0d1117",
    color: "#e8e6e1",
    padding: "56px 24px",
    textAlign: "center",
  } as CSSProperties,

  ctaTitle: { fontSize: 24, fontWeight: 700, marginBottom: 16 } as CSSProperties,

  ctaText: {
    fontSize: 15,
    color: "rgba(232,230,225,0.6)",
    marginBottom: 28,
    maxWidth: 480,
    margin: "0 auto 28px",
    fontFamily: "'Noto Sans SC', sans-serif",
  } as CSSProperties,

  ctaBtn: {
    display: "inline-block",
    padding: "12px 36px",
    background: "#58a6ff",
    color: "#0d1117",
    textDecoration: "none",
    borderRadius: 2,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Noto Sans SC', sans-serif",
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
    color: "#1a6b54",
    fontWeight: 600,
    lineHeight: 1.8,
    marginBottom: 20,
  } as CSSProperties,

  sourceNote: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
    fontFamily: "'Noto Sans SC', sans-serif",
    fontStyle: "italic",
  } as CSSProperties,

  dimensionBar: {
    height: 28,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Noto Sans SC', sans-serif",
    marginBottom: 8,
  } as CSSProperties,
};

export default function CaseStudyHermes() {
  useEffect(() => {
    track("case_study_view", { project: "hermes" });
    document.title = "Hermes 评测系统 · 产品案例研究 | AI 产品评测平台";
  }, []);

  const dimensions = [
    { name: "功能性", weight: 25, color: "#1a6b54", subs: "完整性 30% · 正确性 30% · 易用性 20% · 创新性 20%" },
    { name: "AI 能力", weight: 25, color: "#2563eb", subs: "准确性 40% · 有用性 30% · 流畅性 20% · 安全性 10%" },
    { name: "视觉交互", weight: 20, color: "#7c3aed", subs: "美观度 30% · 流畅性 30% · 响应速度 20% · 兼容性 20%" },
    { name: "性能", weight: 15, color: "#d97706", subs: "加载速度 40% · 响应时间 30% · 稳定性 20% · 资源占用 10%" },
    { name: "情感体验", weight: 15, color: "#c45a3a", subs: "满意度 40% · 品牌一致性 30% · 情感共鸣 20% · 忠诚度 10%" },
  ];

  return (
    <div style={S.page}>
      {/* ===================== Hero ===================== */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroBadge}>PRODUCT CASE STUDY · 产品案例研究</div>
          <h1 style={S.heroTitle}>Hermes 评测系统</h1>
          <p style={S.heroSubtitle}>
            AI 驱动的网站产品评测平台 —— 从 LLM 输出评测升级到端到端产品体验评测，
            覆盖功能性、AI 能力、视觉交互、性能、情感体验五大维度，20 项子指标。
          </p>
          <div style={S.heroMetrics}>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>$24 亿</span>
              <span style={S.heroMetricLabel}>LLM 评测市场规模 (2025)</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>25.6%</span>
              <span style={S.heroMetricLabel}>市场年复合增长率</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>18% → 60%</span>
              <span style={S.heroMetricLabel}>企业采用率 (2025→2028)</span>
            </div>
            <div style={S.heroMetric}>
              <span style={S.heroMetricNum}>93%</span>
              <span style={S.heroMetricLabel}>团队困于 LLM 评测难题</span>
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
            <strong>Hermes 评测系统</strong>是一个 AI 驱动的网站产品评测平台，采用三层架构：
            前端 SSE 实时评测面板 + Vercel Serverless API + Python 多 Agent 评测框架。
            系统对 AI 产品的 5 大维度、20 项子指标进行自动化评测，生成 S-D 等级评分与优化建议。
          </p>
          <p style={S.bodyText}>
            核心差异化：现有 LLM 评测工具（Braintrust / LangSmith / DeepEval）聚焦于
            <strong>模型输出质量</strong>（faithfulness / relevancy / toxicity），
            而 Hermes 聚焦于<strong>完整产品体验</strong> —— 不仅测 AI 回答好不好，
            更测页面能不能打开、交互流不流畅、用户感受不感受得到温度。
            这填补了"模型评测"与"产品评测"之间的空白。
          </p>
          <div style={{ ...S.grid3, marginTop: 24 }}>
            <div style={S.statCard}>
              <div style={S.statNum}>5 维 20 项</div>
              <div style={S.statLabel}>评测指标体系</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>3 层</div>
              <div style={S.statLabel}>系统架构（前端+API+Python）</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>SSE</div>
              <div style={S.statLabel}>实时流式评测结果推送</div>
            </div>
            <div style={S.statCard}>
              <div style={S.statNum}>3 Agent</div>
              <div style={S.statLabel}>Python 多智能体协作</div>
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
            <div style={S.statNum}>$24 亿</div>
            <div style={S.statLabel}>LLM 评测平台市场 (2025)</div>
            <div style={S.statNote}>Dataintelo</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>$187 亿</div>
            <div style={S.statLabel}>2034 年预测规模</div>
            <div style={S.statNote}>CAGR 25.6%</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>$92.6 亿</div>
            <div style={S.statLabel}>LLM 可观测性市场 (2030)</div>
            <div style={S.statNote}>The Business Research Company</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>57%</div>
            <div style={S.statLabel}>团队已在生产环境运行 AI Agent</div>
            <div style={S.statNote}>LangChain 2026 调研</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>89% vs 52%</div>
            <div style={S.statLabel}>可观测性采用率 vs 系统评测率</div>
            <div style={S.statNote}>37 个百分点差距 = 市场空白</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>63%</div>
            <div style={S.statLabel}>多步任务初始失败率</div>
            <div style={S.statNote}>Patronus AI 2026</div>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
            增长驱动力
          </h3>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#1a6b54" }} />
            <div>
              <strong>EU AI Act 合规压力</strong> —— 2026 年 8 月高风险 AI 系统须通过风险管理和评测认证，
              违规罚款高达 €3500 万或全球营业额 7%。企业被迫引入评测工具。
            </div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2563eb" }} />
            <div>
              <strong>Agent 评测需求爆发</strong> —— 市场从"评测单个 LLM 输出"转向"评测完整 Agent 轨迹"。
              MLPerf 2026.7 新增首个 Agent 推理基准，Claw-Eval 推出 300 任务 9 类别评测集。
            </div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#d97706" }} />
            <div>
              <strong>行业并购验证赛道</strong> —— Langfuse 被 ClickHouse 收购（2026.1），
              Arize 被 Dynatrace 以 $9.15 亿收购（2026），TruLens 被 Snowflake 收购。
              大厂用并购验证了评测平台的市场价值。
            </div>
          </div>
          <p style={S.sourceNote}>
            数据来源：Dataintelo, The Business Research Company, Gartner, LangChain State of Agent Engineering Survey 2026, Patronus AI
          </p>
        </div>
      </div>

      {/* ===================== Problem Statement ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>PROBLEM · 企业痛点</div>
        <h2 style={S.sectionTitle}>我们解决什么问题</h2>

        <div style={S.grid2}>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点一：评测-生产鸿沟
            </h3>
            <p style={S.bodyText}>
              89% 的团队有可观测性，但仅 52% 有系统评测流程 —— 37 个百分点的差距。
              Demo 阶段效果惊艳，上线后语义错误频发（幻觉策略、语气漂移、检索失败），
              传统 APM 指标（延迟/错误率/可用性）无法捕获。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点二：LLM-as-Judge 可靠性危机
            </h3>
            <p style={S.bodyText}>
              93% 的团队在 LLM 评判器实现上遇到困难：评分不一致、系统性偏差
              （位置偏差 / 冗长偏差 / 自我增强偏差）、规模化成本高昂。
              单次评测 $0.02-0.10，10 万次/天的评测账单从 $3 万到 $30 万/月不等。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点三：多业务单元治理缺失
            </h3>
            <p style={S.bodyText}>
              合同审查助手需要引用准确性和保密性评分；客服助手需要拒绝正确性和政策合规性；
              研发助手需要科学忠实度。单一评测团队无法覆盖所有业务线需求，
              各团队独立构建评测标准，缺乏统一治理框架。
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c45a3a", marginBottom: 12 }}>
              痛点四：闭环反馈断裂
            </h3>
            <p style={S.bodyText}>
              评测发现失败后，"聚类相似失败 → 生成摘要 → 路由工单 → 回归测试"的闭环基本靠人工。
              现有平台止步于"输出分数"，从"发现问题"到"问题变成回归测试"之间仍是巨大空白。
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
                  <th style={S.th}>核心能力</th>
                  <th style={S.th}>定价</th>
                  <th style={S.th}>融资/规模</th>
                  <th style={S.th}>差异化缺口</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={S.td}><strong>Braintrust</strong></td>
                  <td style={S.td}>商业 SaaS</td>
                  <td style={S.td}>版本化数据集、自动/人工评分、CI 回归门</td>
                  <td style={S.td}>$249/月 + 用量</td>
                  <td style={S.td}>$121M, 估值 $8 亿</td>
                  <td style={S.td}>聚焦模型输出，非产品体验</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>LangSmith</strong></td>
                  <td style={S.td}>商业 SaaS</td>
                  <td style={S.td}>全链路追踪、LLM-as-Judge、失败聚类</td>
                  <td style={S.td}>$39/座/月</td>
                  <td style={S.td}>LangChain 生态</td>
                  <td style={S.td}>绑定 LangChain 框架</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>Langfuse</strong></td>
                  <td style={S.td}>开源+托管</td>
                  <td style={S.td}>OTel 原生追踪、100+ 集成、人工标注</td>
                  <td style={S.td}>免费/$29/$199</td>
                  <td style={S.td}>32.7K ⭐, 被 ClickHouse 收购</td>
                  <td style={S.td}>自建导向，非产品评测</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>Arize Phoenix</strong></td>
                  <td style={S.td}>开源+企业</td>
                  <td style={S.td}>OTel 追踪、RAG 质量图、漂移检测</td>
                  <td style={S.td}>免费/$50 月</td>
                  <td style={S.td}>$131M, $9.15 亿被收购</td>
                  <td style={S.td}>偏 ML 可观测性</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>DeepEval</strong></td>
                  <td style={S.td}>开源框架</td>
                  <td style={S.td}>pytest 风格、60+ 指标、14 研究指标</td>
                  <td style={S.td}>免费 / 企业版</td>
                  <td style={S.td}>12.6K ⭐, $2.2M 种子</td>
                  <td style={S.td}>代码级测试，非产品级</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>Promptfoo</strong></td>
                  <td style={S.td}>开源工具</td>
                  <td style={S.td}>YAML+CLI 评测、红队安全测试</td>
                  <td style={S.td}>免费 (MIT)</td>
                  <td style={S.td}>开源社区</td>
                  <td style={S.td}>聚焦 Prompt 对比</td>
                </tr>
                <tr>
                  <td style={S.td}><strong>EleutherAI Harness</strong></td>
                  <td style={S.td}>学术开源</td>
                  <td style={S.td}>60+ 学术基准、HF 排行榜后端</td>
                  <td style={S.td}>免费</td>
                  <td style={S.td}>学术界标准</td>
                  <td style={S.td}>纯学术评测，非商用</td>
                </tr>
                <tr style={{ background: "rgba(26,107,84,0.04)" }}>
                  <td style={S.td}><strong style={{ color: "#1a6b54" }}>Hermes（本项目）</strong></td>
                  <td style={S.td}>自建平台</td>
                  <td style={S.td}>5 维 20 项产品评测、SSE 实时流、多 Agent</td>
                  <td style={S.td}>自建</td>
                  <td style={S.td}>产品 demo</td>
                  <td style={{ ...S.td, color: "#1a6b54", fontWeight: 600 }}>
                    唯一专注"网站级端到端产品评测"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20, borderLeft: "3px solid #58a6ff" }}>
          <p style={S.highlightText}>
            竞争定位：现有评测工具分为三层 —— 模型输出评测（DeepEval/Promptfoo）、
            链路追踪可观测（Langfuse/LangSmith/Braintrust）、学术基准（EleutherAI/MLPerf）。
            但<strong>"网站级端到端产品评测"</strong>（AI 能力 + 功能 + 视觉 + 性能 + 情感）
            这一维度尚无成熟产品 —— Hermes 的差异化机会。
          </p>
        </div>
      </div>

      {/* ===================== Evaluation Framework ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>EVALUATION FRAMEWORK · 评测体系</div>
        <h2 style={S.sectionTitle}>五维二十项指标体系</h2>

        <div style={S.card}>
          {dimensions.map((d) => (
            <div key={d.name}>
              <div
                style={{
                  ...S.dimensionBar,
                  background: d.color,
                  width: `${d.weight * 3.5}%`,
                  minWidth: 120,
                }}
              >
                {d.name} · 权重 {d.weight}%
              </div>
              <p style={{ ...S.bodyText, fontSize: 13, color: "#888", marginBottom: 16, marginLeft: 4 }}>
                {d.subs}
              </p>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 4 }}>
            <p style={{ ...S.bodyText, marginBottom: 0, fontSize: 14 }}>
              <strong>等级体系：</strong>
              S (≥90 卓越) · A (≥80 优秀) · B (≥70 良好) · C (≥60 合格) · D (&lt;60 待改进)
            </p>
          </div>
        </div>
      </div>

      {/* ===================== Business Model ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>BUSINESS MODEL · 商业模式</div>
        <h2 style={S.sectionTitle}>商业模式画布</h2>

        <div style={S.grid2}>
          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a6b54", marginBottom: 12 }}>
              收入模式
            </h3>
            <div style={{ marginBottom: 12 }}>
              <span style={S.tag}>SaaS 订阅</span>
              <span style={S.tag}>按评测次数计费</span>
              <span style={S.tag}>企业私有化部署</span>
              <span style={S.tag}>评测咨询</span>
            </div>
            <table style={S.table}>
              <thead>
                <tr><th style={S.th}>层级</th><th style={S.th}>定价</th><th style={S.th}>功能</th></tr>
              </thead>
              <tbody>
                <tr><td style={S.td}>免费版</td><td style={S.td}>¥0</td><td style={S.td}>5 次/月基础评测、公开报告</td></tr>
                <tr><td style={S.td}>团队版</td><td style={S.td}>¥299/月</td><td style={S.td}>500 次/月、趋势追踪、API 接入</td></tr>
                <tr><td style={S.td}>企业版</td><td style={S.td}>定制</td><td style={S.td}>私有化部署、自定义指标、SLA 保障</td></tr>
              </tbody>
            </table>
          </div>

          <div style={S.card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a6b54", marginBottom: 12 }}>
              单位经济模型
            </h3>
            <table style={S.table}>
              <tbody>
                <tr><td style={S.td}>目标 ARPU</td><td style={{ ...S.td, fontWeight: 600, color: "#1a6b54" }}>¥299/月</td></tr>
                <tr><td style={S.td}>单次评测 AI 成本</td><td style={S.td}>¥0.15-0.50（API 调用）</td></tr>
                <tr><td style={S.td}>月均成本 / 付费用户</td><td style={S.td}>¥30-75</td></tr>
                <tr><td style={S.td}>毛利率</td><td style={{ ...S.td, fontWeight: 600, color: "#1a6b54" }}>~75-85%</td></tr>
                <tr><td style={S.td}>免费→付费转化率（目标）</td><td style={S.td}>3-5%</td></tr>
                <tr><td style={S.td}>CAC（目标）</td><td style={S.td}>¥200-400（技术内容+社区）</td></tr>
                <tr><td style={S.td}>LTV / CAC</td><td style={{ ...S.td, fontWeight: 600, color: "#1a6b54" }}>~3:1</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a6b54", marginBottom: 12 }}>
            市场定价对标
          </h3>
          <table style={S.table}>
            <thead>
              <tr><th style={S.th}>竞品</th><th style={S.th}>定价</th><th style={S.th}>对标分析</th></tr>
            </thead>
            <tbody>
              <tr><td style={S.td}>Braintrust Teams</td><td style={S.td}>$249/月 (~¥1,800)</td><td style={S.td}>含 5 万次评分 + 用量</td></tr>
              <tr><td style={S.td}>LangSmith Plus</td><td style={S.td}>$39/座/月 (~¥280)</td><td style={S.td}>按座位计费</td></tr>
              <tr><td style={S.td}>Langfuse Pro</td><td style={S.td}>$199/月 (~¥1,440)</td><td style={S.td}>托管云服务</td></tr>
              <tr><td style={S.td}><strong>Hermes（目标）</strong></td><td style={S.td}>¥299/月</td><td style={S.td}>中国市场定价，性价比优势</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Technical Architecture ===================== */}
      <div style={S.section}>
        <div style={S.sectionTag}>TECHNICAL ARCHITECTURE · 技术架构</div>
        <h2 style={S.sectionTitle}>三层系统架构</h2>

        <div style={S.card}>
          <div style={{ marginBottom: 20 }}>
            <div style={S.archBox}>
              <strong>第一层 · 前端评测面板</strong> — React 19 + TypeScript + Framer Motion<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                SSE 流式接收评测进度 · 实时进度条 + 增量结果展示 · 3 Tab（概览/方法/趋势）· localStorage 持久化
              </span>
            </div>
          </div>
          <div style={S.archArrow}>↓ Server-Sent Events (SSE)</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...S.archBox, background: "#1a3a2d" }}>
              <strong>第二层 · API 评测引擎</strong> — Vercel Serverless Function<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                POST /api/hermes-eval · 5 个 AI 接口调用 + 4 个页面可访问性检测 ·
                启发式评分算法（长度/关键词/字段/响应时间/情感词）· 20s 超时控制
              </span>
            </div>
          </div>
          <div style={S.archArrow}>↓ HTTP / asyncio</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...S.archBox, background: "#2563eb" }}>
              <strong>第三层 · Python 多 Agent 框架</strong> — asyncio + aiohttp<br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>
                Agent 编排框架（Sequential/Parallel/Conditional 三种工作流）·
                3 Agent 协作：UserSimulationAgent + AICapabilityAgent → QualityReviewAgent ·
                Playwright 浏览器自动化 · HTML 报告生成
              </span>
            </div>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            评测工作流
          </h3>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#1a6b54" }} />
            <div><strong>Phase 1 · 并行</strong> — 用户模拟 Agent（浏览器交互测试）与 AI 能力 Agent（API 质量测试）同时执行</div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#2563eb" }} />
            <div><strong>Phase 2 · 串行</strong> — 质量审查 Agent 基于前两个 Agent 的结果进行综合评审</div>
          </div>
          <div style={S.painItem}>
            <div style={{ ...S.painDot, background: "#d97706" }} />
            <div><strong>Phase 3 · 聚合</strong> — WebsiteMetricsCalculator 将所有数据聚合为 5 维评分 + 等级 + 优化建议</div>
          </div>
        </div>

        <div style={S.card} style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            评分算法（启发式）
          </h3>
          <table style={S.table}>
            <thead>
              <tr><th style={S.th}>维度</th><th style={S.th}>算法</th></tr>
            </thead>
            <tbody>
              <tr><td style={S.td}>AI 能力</td><td style={S.td}>基础 60 + 长度检查(+10) + 关键词匹配(+15) + 必填字段(+15) + 响应时间(+5)</td></tr>
              <tr><td style={S.td}>功能性</td><td style={S.td}>基础 50 + 成功(+30) + 有效 JSON(+15) + 无错误(+5)</td></tr>
              <tr><td style={S.td}>性能</td><td style={S.td}>&lt;2s→98 · &lt;5s→88 · &lt;10s→75 · &lt;20s→60 · else→40</td></tr>
              <tr><td style={S.td}>情感体验</td><td style={S.td}>基础 70 + 暖词检测(+4/词, max+16) + 语气检查(+8) + 长度适宜(+6)</td></tr>
              <tr><td style={S.td}>视觉交互</td><td style={S.td}>页面可访问→85 · 不可访问→50（服务端限制）</td></tr>
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
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, marginTop: 4, fontFamily: "'Noto Sans SC', sans-serif" }}>Phase 1 · MVP</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, fontFamily: "'Noto Sans SC', sans-serif" }}>已完成</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>5 维 20 项指标体系</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>SSE 实时评测面板</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>Python 3 Agent 框架</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>启发式评分算法</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={S.roadmapDot} />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, marginTop: 4, fontFamily: "'Noto Sans SC', sans-serif" }}>Phase 2 · 评测升级</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, fontFamily: "'Noto Sans SC', sans-serif" }}>3-6 个月</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>LLM-as-Judge 语义评测</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>Python 与 API 统一评分层</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>自定义评测用例</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>CI/CD 集成（GitHub Actions）</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={{ ...S.roadmapDot, background: "#58a6ff" }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, marginTop: 4, fontFamily: "'Noto Sans SC', sans-serif" }}>Phase 3 · 商业化</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, fontFamily: "'Noto Sans SC', sans-serif" }}>6-12 个月</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>SaaS 订阅平台</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>任意 URL 评测（非限自有产品）</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>评测报告 PDF 导出</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>竞争品对比分析</div>
            </div>
            <div style={S.roadmapPhase}>
              <div style={{ ...S.roadmapDot, background: "#6b7280" }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, marginTop: 4, fontFamily: "'Noto Sans SC', sans-serif" }}>Phase 4 · 生态</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, fontFamily: "'Noto Sans SC', sans-serif" }}>12-24 个月</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>行业评测基准库</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>评测 SDK 开放</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>EU AI Act 合规报告</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>Agent 轨迹评测</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== CTA ===================== */}
      <div style={S.ctaBar}>
        <h2 style={S.ctaTitle}>体验 Hermes 评测</h2>
        <p style={S.ctaText}>
          一键启动评测，观看 AI 实时检测 5 大维度的产品表现。
        </p>
        <a
          href="/zhiyong"
          style={S.ctaBtn}
          onClick={() => track("case_study_cta", { project: "hermes" })}
        >
          进入评测系统 →
        </a>
      </div>
    </div>
  );
}
