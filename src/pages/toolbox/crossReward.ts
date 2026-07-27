/**
 * 跨产品联动奖励系统
 *
 * 规则：在任一产品连续签到 7 天，送另一产品「体验卡」
 * - 通关清单连续 7 天 → 回血清单获得「通关勇士礼券」（+20 积分）
 * - 回血清单连续 7 天 → 通关清单获得「回血达人礼券」（+30 金币）
 *
 * 数据存储在 localStorage：cross_reward_cards
 */

export interface RewardCard {
  id: string;
  /** 可领取该卡的产品 */
  product: "quest" | "recharge";
  /** 触发该卡的产品 */
  source: "quest" | "recharge";
  /** 发放时间 */
  grantedAt: number;
  /** 是否已领取 */
  claimed: boolean;
  /** 领取时间 */
  claimedAt?: number;
  /** 奖励数量 */
  rewardAmount: number;
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  desc: string;
}

const CARDS_KEY = "cross_reward_cards";

/** 读取所有体验卡 */
function loadCards(): RewardCard[] {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存体验卡 */
function saveCards(cards: RewardCard[]): void {
  try {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  } catch { /* ignore */ }
}

/** 获取今日日期字符串 */
function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 读取通关清单的连续签到天数 */
function getQuestStreak(): number {
  try {
    const raw = localStorage.getItem("quest_log_streak");
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/** 读取回血清单的连续签到天数 */
function getRechargeStreak(): number {
  try {
    const raw = localStorage.getItem("recharge_checkin");
    if (raw) {
      const data = JSON.parse(raw);
      return data.streak || 0;
    }
  } catch { /* ignore */ }
  return 0;
}

/** 检查是否已为本周期发放过体验卡 */
function hasGrantedThisCycle(source: "quest" | "recharge", target: "quest" | "recharge", streak: number): boolean {
  const cards = loadCards();
  // 查找同一来源、同一目标、未领取且是最近发放的卡
  // 简单策略：如果已有未领取的同源同目标卡，不再重复发放
  return cards.some(c => c.source === source && c.product === target && !c.claimed);
}

/**
 * 检测并发放体验卡
 * @param source 当前产品标识
 * @returns 新发放的体验卡，若未触发则返回 null
 */
export function checkAndGrantCard(source: "quest" | "recharge"): RewardCard | null {
  const target = source === "quest" ? "recharge" : "quest";
  const streak = source === "quest" ? getQuestStreak() : getRechargeStreak();

  // 只在连续签到达到 7 天且是 7 的倍数时触发（7, 14, 21...）
  if (streak < 7 || streak % 7 !== 0) return null;

  // 避免重复发放
  if (hasGrantedThisCycle(source, target, streak)) return null;

  const isQuestTarget = target === "quest";
  const card: RewardCard = {
    id: `${source}-${streak}-${Date.now()}`,
    product: target,
    source,
    grantedAt: Date.now(),
    claimed: false,
    rewardAmount: isQuestTarget ? 30 : 20,
    title: isQuestTarget ? "回血达人礼券" : "通关勇士礼券",
    desc: isQuestTarget
      ? `来自「回血清单」的联动奖励，连续签到 ${streak} 天达成`
      : `来自「通关清单」的联动奖励，连续签到 ${streak} 天达成`,
  };

  const cards = loadCards();
  cards.push(card);
  saveCards(cards);
  return card;
}

/** 获取指定产品下未领取的体验卡 */
export function getPendingCards(product: "quest" | "recharge"): RewardCard[] {
  return loadCards().filter(c => c.product === product && !c.claimed);
}

/** 领取体验卡 */
export function claimCard(cardId: string): RewardCard | null {
  const cards = loadCards();
  const card = cards.find(c => c.id === cardId);
  if (!card || card.claimed) return null;

  card.claimed = true;
  card.claimedAt = Date.now();
  saveCards(cards);
  return card;
}

/** 获取已领取的体验卡数量（用于展示成就） */
export function getClaimedCount(product?: "quest" | "recharge"): number {
  const cards = loadCards();
  if (product) {
    return cards.filter(c => c.product === product && c.claimed).length;
  }
  return cards.filter(c => c.claimed).length;
}
