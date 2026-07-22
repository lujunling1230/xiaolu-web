import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAdminGuard } from "../../hooks/useAdminGuard";

/**
 * 物资管家 · Inventory Prophet
 *
 * 三Tab导航：入库登记 / 库存列表 / AI管家
 * 萌宠手帐 + 蓝色玻璃 + 彩色便签融合风格
 */

/* ============================================================
   类型定义
   ============================================================ */
const UNITS = ["瓶", "盒", "袋", "罐", "箱", "个", "支"] as const;
const LOCATIONS = ["冰箱", "浴室", "储物间", "厨房", "客厅", "卧室"] as const;

type Unit = (typeof UNITS)[number];
type Location = (typeof LOCATIONS)[number];

interface InventoryItem {
  id: string;
  name: string;
  count: number;
  unit: Unit;
  expiryDate: string; // YYYY-MM-DD
  location: Location;
}

type Status = "expired" | "expiring" | "sufficient";
type FilterKey = "all" | Status;
type TabKey = "inbound" | "inventory" | "ai";

interface FormState {
  name: string;
  count: number;
  unit: Unit;
  expiryDate: string;
  location: Location;
}

interface RecognizedCandidate {
  id: string;
  name: string;
  confidence: number; // 0-100
  unit?: string;
  count?: number;
  selected: boolean;
  expiryDate?: string;
  location?: string;
}

/* ============================================================
   常量与工具
   ============================================================ */
const STORAGE_KEY = "inventory_items";
const NEAR_THRESHOLD = 30; // 临期阈值（天）

/** 轻量 class 拼接 */
function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** 生成唯一 id（兼容无 crypto.randomUUID 的环境） */
function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 从 localStorage 读取物品列表 */
function loadItems(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as InventoryItem[];
  } catch {
    return [];
  }
}

/** 计算某到期日距今的天数（负值=已过期） */
function daysUntil(dateStr: string, today: Date): number {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return Infinity;
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

/** 根据天数判定状态 */
function toStatus(days: number): Status {
  if (days < 0) return "expired";
  if (days <= NEAR_THRESHOLD) return "expiring";
  return "sufficient";
}

/** 友好的相对时间文案 */
function relativeHint(days: number): string {
  if (days < 0) return `已过期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天到期";
  return `还剩 ${days} 天`;
}

/** 获取库存状态（用于样式绑定） */
function getStockStatus(daysLeft: number): "expired" | "warning" | "safe" {
  if (daysLeft <= 0) return "expired";
  if (daysLeft <= 30) return "warning";
  return "safe";
}

/** 状态颜色常量 */
const STATUS_COLORS = {
  expired: "#E53935",
  warning: "#FF9800",
  safe: "#81C784",
} as const;

/* ============================================================
   Tab 主题配置
   ============================================================ */
const TAB_CONFIG: Record<
  TabKey,
  {
    label: string;
    emoji: string;
    color: string;
    gradient: string;
    border: string;
    ring: string;
    lightBg: string;
  }
> = {
  inbound: {
    label: "入库登记",
    emoji: "📦",
    color: "#6B9BD1",
    gradient: "from-[#6B9BD1] to-[#8BB5E0]",
    border: "border-[#B4D4EE]/50",
    ring: "focus:ring-[#B4D4EE]/30",
    lightBg: "bg-[#F0F7FF]/60",
  },
  inventory: {
    label: "库存列表",
    emoji: "📋",
    color: "#7AB87A",
    gradient: "from-[#7AB87A] to-[#9BCF9B]",
    border: "border-[#A8D5A2]/50",
    ring: "focus:ring-[#A8D5A2]/30",
    lightBg: "bg-[#F0FFF0]/60",
  },
  ai: {
    label: "AI管家",
    emoji: "🤖",
    color: "#E070A0",
    gradient: "from-[#E070A0] to-[#E899B8]",
    border: "border-[#F8C8DC]/50",
    ring: "focus:ring-[#F8C8DC]/30",
    lightBg: "bg-[#FFF0F5]/60",
  },
};

/* ============================================================
   胶囊配置
   ============================================================ */
const PILLS: {
  key: Status;
  label: string;
  emoji: string;
  dot: string;
  active: string;
  idle: string;
}[] = [
  {
    key: "expired",
    label: "已过期",
    emoji: "🔴",
    dot: "bg-red-400",
    active: "bg-red-50 border-red-300 text-red-600",
    idle: "bg-white/60 border-white/60 text-gray-600 hover:border-red-200",
  },
  {
    key: "expiring",
    label: "临期·30天内",
    emoji: "🟠",
    dot: "bg-amber-400",
    active: "bg-amber-50 border-amber-300 text-amber-700",
    idle: "bg-white/60 border-white/60 text-gray-600 hover:border-amber-200",
  },
  {
    key: "sufficient",
    label: "库存充足",
    emoji: "🟢",
    dot: "bg-emerald-400",
    active: "bg-emerald-50 border-emerald-300 text-emerald-700",
    idle: "bg-white/60 border-white/60 text-gray-600 hover:border-emerald-200",
  },
];

const VL_MODEL = "qwen-vl-plus";
const VL_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const _VL_API_KEY = "sk-ws-H.EMIDEPD.99KW.MEUCIFKj_RNhEpPBBXnpRLNoN9YrqKrpnP8CWD2nnG9gbONOAiEAhKjGJeLvxkepCGn8rIPBiSUk_8LhvRGYDorqwVLM_i8";

interface VLItem {
  name: string;
  count?: number;
  unit?: string;
  expiryDate?: string;
  location?: string;
  confidence?: number;
}

async function recognizeWithVL(base64Image: string): Promise<VLItem[] | null> {
  try {
    // 优先尝试 Vercel 代理（部署在 Vercel 时可用）
    let response = await fetch("/api/ai-vl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image }),
    });

    // 代理不可用时直接调 DashScope（GitHub Pages 部署）
    if (!response.ok) {
      response = await fetch(VL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${_VL_API_KEY}`,
        },
        body: JSON.stringify({
          model: VL_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: '识别图片中的物品，返回JSON数组。每个物品包含：name（名称，必填）、count（数量，数字）、unit（单位，如瓶/盒/袋/罐/箱/个/支）、expiryDate（到期日，YYYY-MM-DD格式，如不确定可留空）、location（存放位置，如冰箱/浴室/储物间/厨房/客厅/卧室）、confidence（置信度0-100）。只返回JSON数组，不要其他文字。',
                },
                { type: "image_url", image_url: { url: base64Image } },
              ],
            },
          ],
          response_format: { type: "json_object" },
        }),
      });
    }

    if (!response.ok) return null;
    const data = await response.json();

    // Vercel 代理返回 { content: "..." }，DashScope 直接返回 { choices: [...] }
    const content = data?.content || data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed as VLItem[];
    if (parsed.items && Array.isArray(parsed.items)) return parsed.items as VLItem[];
    return null;
  } catch {
    return null;
  }
}

/* ============================================================
   装饰 SVG 组件
   ============================================================ */
const StarDecoration: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "#6B9BD1",
}) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.82 19.02L12 16.18L7.18 19.02L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FlowerDecoration: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "#E070A0",
}) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle cx="10" cy="6" r="3" fill={color} fillOpacity="0.2" />
    <circle cx="6" cy="12" r="3" fill={color} fillOpacity="0.2" />
    <circle cx="14" cy="12" r="3" fill={color} fillOpacity="0.2" />
    <circle cx="10" cy="10" r="2.5" fill={color} fillOpacity="0.35" />
  </svg>
);

const DotDecoration: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "#7AB87A",
}) => (
  <svg
    className={className}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <circle cx="8" cy="8" r="2.5" fill={color} fillOpacity="0.3" />
    <circle cx="22" cy="12" r="1.5" fill={color} fillOpacity="0.2" />
    <circle cx="14" cy="24" r="2" fill={color} fillOpacity="0.25" />
    <circle cx="26" cy="26" r="1.5" fill={color} fillOpacity="0.2" />
  </svg>
);

/* ============================================================
   编辑弹窗组件
   ============================================================ */
const EditModal: React.FC<{
  item: InventoryItem;
  onSave: (item: InventoryItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState<FormState>({
    name: item.name,
    count: item.count,
    unit: item.unit,
    expiryDate: item.expiryDate,
    location: item.location,
  });

  const canSave =
    form.name.trim().length > 0 &&
    form.count >= 1 &&
    form.expiryDate.length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      ...item,
      name: form.name.trim(),
      count: form.count,
      unit: form.unit,
      expiryDate: form.expiryDate,
      location: form.location,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[#A8D5A2]/40 bg-white/80 p-6 shadow-2xl shadow-pink-100/20 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.1)" }}
      >
        <h3
          className="mb-5 text-lg font-semibold text-gray-800"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          ✏️ 编辑物品
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              物品名称
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#7AB87A]/50 focus:bg-white focus:ring-2 focus:ring-[#A8D5A2]/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                数量
              </label>
              <input
                type="number"
                min={1}
                value={form.count}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    count: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#7AB87A]/50 focus:bg-white focus:ring-2 focus:ring-[#A8D5A2]/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                单位
              </label>
              <select
                value={form.unit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unit: e.target.value as Unit }))
                }
                className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#7AB87A]/50 focus:bg-white focus:ring-2 focus:ring-[#A8D5A2]/30"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              到期日
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiryDate: e.target.value }))
              }
              className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#7AB87A]/50 focus:bg-white focus:ring-2 focus:ring-[#A8D5A2]/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              存放位置
            </label>
            <select
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value as Location }))
              }
              className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#7AB87A]/50 focus:bg-white focus:ring-2 focus:ring-[#A8D5A2]/30"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#E8E0F0]/80 py-2.5 text-sm text-gray-600 transition-all hover:bg-gray-50/80 active:scale-95"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className="flex-1 rounded-full bg-gradient-to-r from-[#7AB87A] to-[#9BCF9B] py-2.5 text-sm font-medium text-white shadow-md shadow-green-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   拍照引导弹窗
   ============================================================ */
const PhotoGuideModal: React.FC<{
  onClose: () => void;
  onStart: () => void;
}> = ({ onClose, onStart }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-[#B4D4EE]/40 bg-white/80 p-6 shadow-2xl shadow-pink-100/20 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.1)" }}
      >
        <h3
          className="mb-4 text-lg font-semibold text-gray-800"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          📷 拍照识别物品
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-center gap-3 rounded-xl bg-[#F0F7FF]/60 px-3 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1]/15 text-xs text-[#6B9BD1]">
              ✓
            </span>
            拍得清 —— 保持画面清晰，避免模糊
          </p>
          <p className="flex items-center gap-3 rounded-xl bg-[#F0F7FF]/60 px-3 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1]/15 text-xs text-[#6B9BD1]">
              ✓
            </span>
            平铺摆放 —— 物品尽量平铺，减少重叠
          </p>
          <p className="flex items-center gap-3 rounded-xl bg-[#F0F7FF]/60 px-3 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1]/15 text-xs text-[#6B9BD1]">
              ✓
            </span>
            光线充足 —— 在明亮环境下拍摄
          </p>
          <p className="flex items-center gap-3 rounded-xl bg-[#F0F7FF]/60 px-3 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1]/15 text-xs text-[#6B9BD1]">
              ✓
            </span>
            靠近拍摄 —— 让物品占据画面主要部分
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#E8E0F0]/80 py-2.5 text-sm text-gray-600 transition-all hover:bg-gray-50/80 active:scale-95"
          >
            取消
          </button>
          <button
            onClick={onStart}
            className="flex-1 rounded-full bg-gradient-to-r from-[#6B9BD1] to-[#8BB5E0] py-2.5 text-sm font-medium text-white shadow-md shadow-blue-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            开始拍照
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   拍照确认弹窗
   ============================================================ */
const PhotoConfirmModal: React.FC<{
  photoUrl: string;
  candidates: RecognizedCandidate[];
  onClose: () => void;
  onConfirm: (items: RecognizedCandidate[]) => void;
  onRetake: () => void;
  onUpdateCandidate: (id: string, patch: Partial<RecognizedCandidate>) => void;
}> = ({ photoUrl, candidates, onClose, onConfirm, onRetake, onUpdateCandidate }) => {
  const selected = candidates.filter((c) => c.selected);

  const confidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return (
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
          可信
        </span>
      );
    }
    if (confidence >= 50) {
      return (
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
          待确认
        </span>
      );
    }
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
        不确定
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#B4D4EE]/40 bg-white/80 p-6 shadow-2xl shadow-pink-100/20 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.1)" }}
      >
        <h3
          className="mb-4 text-lg font-semibold text-gray-800"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          📷 识别结果
        </h3>

        <div className="mb-4 flex justify-center">
          <img
            src={photoUrl}
            alt="识别照片"
            className="max-h-[200px] rounded-2xl object-contain border border-[#E8E0F0]/40"
          />
        </div>

        <div className="space-y-4">
          {candidates.map((c) => (
            <div
              key={c.id}
              className={cn(
                "rounded-2xl border p-4 transition-all",
                c.selected
                  ? "border-[#6B9BD1]/40 bg-[#F0F7FF]/50"
                  : "border-[#E8E0F0]/40 bg-white/40"
              )}
              style={
                c.selected
                  ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }
                  : undefined
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={c.selected}
                    onChange={(e) =>
                      onUpdateCandidate(c.id, { selected: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#6B9BD1]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    选中入库
                  </span>
                </label>
                {confidenceBadge(c.confidence)}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    物品名称
                  </label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) =>
                      onUpdateCandidate(c.id, { name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      数量
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={c.count ?? 1}
                      onChange={(e) =>
                        onUpdateCandidate(c.id, {
                          count: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      单位
                    </label>
                    <select
                      value={c.unit ?? "瓶"}
                      onChange={(e) =>
                        onUpdateCandidate(c.id, { unit: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      到期日
                    </label>
                    <input
                      type="date"
                      value={c.expiryDate ?? ""}
                      onChange={(e) =>
                        onUpdateCandidate(c.id, { expiryDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      存放位置
                    </label>
                    <select
                      value={c.location ?? "冰箱"}
                      onChange={(e) =>
                        onUpdateCandidate(c.id, { location: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 rounded-xl border border-[#E8E0F0]/80 py-2.5 text-sm text-gray-600 transition-all hover:bg-gray-50/80 active:scale-95"
          >
            重新拍照
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            className="flex-1 rounded-full bg-gradient-to-r from-[#6B9BD1] to-[#8BB5E0] py-2.5 text-sm font-medium text-white shadow-md shadow-blue-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            确认入库 ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const InventoryPage: React.FC = () => {
  const { isAdmin: adminMode, verifyAdmin, AdminGuardUI } = useAdminGuard();
  const [items, setItems] = useState<InventoryItem[]>(() => loadItems());
  const [filter, setFilter] = useState<FilterKey>("all");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("inbound");
  const [searchParams] = useSearchParams();
  const fromQuery = searchParams.get("from") === "full" ? "?from=full" : "";

  const [form, setForm] = useState<FormState>({
    name: "",
    count: 1,
    unit: "瓶",
    expiryDate: "",
    location: "冰箱",
  });

  /* AI管家问答 */
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  /* 入库成功提示 */
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  /* 叮~声效 */
  const playDing = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      /* 静默 */
    }
  };

  const [photoGuideOpen, setPhotoGuideOpen] = useState(false);
  const [photoConfirmOpen, setPhotoConfirmOpen] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedCandidate[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 数据变更即持久化 */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* 写入失败（隐私模式等）则静默忽略 */
    }
  }, [items]);

  /** 当天零点，避免跨天比较偏差 */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* —— 统计 —— */
  const stats = useMemo(() => {
    let expired = 0;
    let expiring = 0;
    let sufficient = 0;
    items.forEach((it) => {
      const s = toStatus(daysUntil(it.expiryDate, today));
      if (s === "expired") expired++;
      else if (s === "expiring") expiring++;
      else sufficient++;
    });
    return { expired, expiring, sufficient };
  }, [items, today]);

  /* —— 过滤后列表 —— */
  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter(
      (it) => toStatus(daysUntil(it.expiryDate, today)) === filter
    );
  }, [items, filter, today]);

  /* —— AI 管家小贴士 —— */
  const aiTips = useMemo(() => {
    if (items.length === 0) return [];

    const sorted = [...items]
      .map((it) => ({ ...it, days: daysUntil(it.expiryDate, today) }))
      .sort((a, b) => a.days - b.days);

    const tips: { id: string; emoji: string; text: string; urgent: boolean; itemId: string }[] = [];
    const usedNames = new Set<string>();

    // 第一优先：<=7 天的物品，逐条生成提示
    for (const it of sorted) {
      if (tips.length >= 3) break;
      if (it.days > 7) continue;
      if (usedNames.has(it.name)) continue;
      usedNames.add(it.name);

      if (it.days < 0) {
        tips.push({
          id: `tip-${it.id}`,
          emoji: "🚨",
          text: `${it.name}已过期 ${Math.abs(it.days)} 天，建议尽快处理或丢弃。`,
          urgent: true,
          itemId: it.id,
        });
      } else if (it.days === 0) {
        tips.push({
          id: `tip-${it.id}`,
          emoji: "⏰",
          text: `${it.name}今天到期，请尽快使用！`,
          urgent: true,
          itemId: it.id,
        });
      } else if (it.days <= 3) {
        tips.push({
          id: `tip-${it.id}`,
          emoji: "🔥",
          text: `${it.name}仅剩 ${it.days} 天，建议优先使用。`,
          urgent: true,
          itemId: it.id,
        });
      } else {
        tips.push({
          id: `tip-${it.id}`,
          emoji: "📌",
          text: `${it.name}将在 ${it.days} 天后过期，建议近期安排使用。`,
          urgent: true,
          itemId: it.id,
        });
      }
    }

    // 第二优先：如果不足 3 条，检查是否有同类高频物品可补货提示
    if (tips.length < 3) {
      const nameCount = new Map<string, number>();
      for (const it of items) {
        nameCount.set(it.name, (nameCount.get(it.name) || 0) + 1);
      }
      for (const [name, count] of nameCount) {
        if (tips.length >= 3) break;
        if (count >= 2 && !usedNames.has(name)) {
          tips.push({
            id: `tip-restock-${name}`,
            emoji: "🛒",
            text: `检测到您常备${name}（当前 ${count} 件），库存充足时别忘了及时补货。`,
            urgent: false,
            itemId: "",
          });
        }
      }
    }

    // 第三优先：还不足 3 条，从 >7 天的物品中挑最近的
    if (tips.length < 3) {
      for (const it of sorted) {
        if (tips.length >= 3) break;
        if (it.days <= 7 || usedNames.has(it.name)) continue;
        usedNames.add(it.name);
        tips.push({
          id: `tip-${it.id}`,
          emoji: "💡",
          text: `${it.name}还剩 ${it.days} 天到期，状态良好。`,
          urgent: false,
          itemId: it.id,
        });
      }
    }

    return tips;
  }, [items, today]);

  /* —— 表单校验 —— */
  const canAdd =
    form.name.trim().length > 0 &&
    form.count >= 1 &&
    form.expiryDate.length > 0;

  /* —— 入库 —— */
  const handleAdd = () => {
    if (!canAdd) return;
    const newItem: InventoryItem = {
      id: genId(),
      name: form.name.trim(),
      count: form.count,
      unit: form.unit,
      expiryDate: form.expiryDate,
      location: form.location,
    };
    setItems((prev) => [newItem, ...prev]);
    // 仅清空名称，保留数量/单位/位置便于连续入库
    setForm((f) => ({ ...f, name: "" }));
    playDing();
    showToast(`✅ ${newItem.name} 入库成功！`);
  };

  /* —— 编辑保存 —— */
  const handleEditSave = (updatedItem: InventoryItem) => {
    verifyAdmin(() => {
      setItems((prev) =>
        prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
      );
      setEditingItem(null);
    });
  };

  /* —— 删除（带淡出动画） —— */
  const handleDelete = (id: string) => {
    verifyAdmin(() => {
      setDeletingIds((prev) => new Set(prev).add(id));
      window.setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== id));
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 300);
    });
  };

  /* —— 拍照识别 handlers —— */
  const handlePhotoClick = () => {
    setPhotoGuideOpen(true);
  };

  const handleStartPhoto = () => {
    // 移动端要求 click() 必须在用户手势中同步触发，
    // 若先 setState 导致重渲染，安全策略会阻止后续 click()
    fileInputRef.current?.click();
    setPhotoGuideOpen(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      setPhotoPreviewUrl(base64);
      setIsRecognizing(true);
      setPhotoConfirmOpen(true);

      const results = await recognizeWithVL(base64);
      setIsRecognizing(false);

      if (results && results.length > 0) {
        const candidates: RecognizedCandidate[] = results.map((r) => ({
          id: genId(),
          name: r.name || "未知物品",
          confidence: Math.min(100, Math.max(0, r.confidence ?? 50)),
          count: r.count ?? 1,
          unit: UNITS.includes(r.unit as Unit) ? r.unit : "瓶",
          expiryDate: r.expiryDate && /^\d{4}-\d{2}-\d{2}$/.test(r.expiryDate)
            ? r.expiryDate
            : "",
          location: LOCATIONS.includes(r.location as Location)
            ? r.location
            : "冰箱",
          selected: true,
        }));
        setRecognizedItems(candidates);
      } else {
        setRecognizedItems([
          {
            id: genId(),
            name: "未知物品",
            confidence: 0,
            count: 1,
            unit: "瓶",
            expiryDate: "",
            location: "冰箱",
            selected: false,
          },
        ]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handlePhotoConfirm = (selected: RecognizedCandidate[]) => {
    const validUnit = (u?: string): Unit =>
      UNITS.includes(u as Unit) ? (u as Unit) : "瓶";
    const validLocation = (l?: string): Location =>
      LOCATIONS.includes(l as Location) ? (l as Location) : "冰箱";

    const newItems: InventoryItem[] = selected
      .filter((c) => c.name.trim().length > 0 && (c.count ?? 0) >= 1)
      .map((c) => ({
        id: genId(),
        name: c.name.trim(),
        count: c.count ?? 1,
        unit: validUnit(c.unit),
        expiryDate: c.expiryDate || new Date().toISOString().slice(0, 10),
        location: validLocation(c.location),
      }));

    if (newItems.length > 0) {
      setItems((prev) => [...newItems, ...prev]);
    }

    setPhotoConfirmOpen(false);
    setRecognizedItems([]);
    setPhotoPreviewUrl("");
  };

  const handleRetake = () => {
    setPhotoConfirmOpen(false);
    setRecognizedItems([]);
    setPhotoPreviewUrl("");
    setPhotoGuideOpen(true);
  };

  const handleUpdateCandidate = (
    id: string,
    patch: Partial<RecognizedCandidate>
  ) => {
    setRecognizedItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  /* —— AI管家库存问答 —— */
  const getAnswer = (q: string): string => {
    // 1. 有什么库存 / 有哪些物品
    if (
      /有什[么吗]|哪些|[有存]货|库存/.test(q) &&
      !/在哪|位置|过期|到期/.test(q)
    ) {
      if (items.length === 0) {
        return "🌸 当前还没有任何物品哦~ 快去「入库登记」添加吧！";
      }
      const list = items
        .map((it) => `• ${it.name}（${it.count}${it.unit}）`)
        .join("\n");
      return `📦 您当前共有 ${items.length} 件物品：\n${list}`;
    }
    // 2. xxx在哪 / xxx位置
    if (/在哪|位置|放[在到哪]|存放/.test(q)) {
      const keyword = q.replace(/[在哪位置放到哪存放\?？]/g, "").trim();
      const found = items.filter((it) =>
        it.name.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found.length === 0) {
        return `🔍 没有找到「${keyword}」呢，确认一下名称是否正确？`;
      }
      if (found.length === 1) {
        const it = found[0];
        const d = daysUntil(it.expiryDate, today);
        return `📍 ${it.name} 放在「${it.location}」，还有 ${it.count}${it.unit}，${d > 0 ? `剩余 ${d} 天到期` : d === 0 ? "今天到期" : `已过期 ${Math.abs(d)} 天`}。`;
      }
      const locs = found.map((it) => `• ${it.name} → ${it.location}`).join("\n");
      return `📍 找到 ${found.length} 个相关物品：\n${locs}`;
    }
    // 3. xxx过期 / xxx到期 / 还有多久
    if (/过期|到期|多久|剩[余下几]/.test(q)) {
      const keyword = q
        .replace(/[过期到多久剩余下几\?？天]/g, "")
        .trim();
      const found = items.filter((it) =>
        it.name.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found.length === 0) {
        return `🔍 没有找到「${keyword}」的到期信息呢。`;
      }
      const details = found
        .map((it) => {
          const d = daysUntil(it.expiryDate, today);
          const hint =
            d < 0
              ? `⚠️ 已过期 ${Math.abs(d)} 天`
              : d === 0
                ? "⏰ 今天到期"
                : d <= 7
                  ? `🔥 仅剩 ${d} 天`
                  : `💡 还有 ${d} 天`;
          return `• ${it.name}：${it.expiryDate}，${hint}`;
        })
        .join("\n");
      return details;
    }
    // 4. 快过期 / 临期
    if (/快过期|临期|要到期|即将/.test(q)) {
      const near = items.filter((it) => {
        const d = daysUntil(it.expiryDate, today);
        return d >= 0 && d <= 7;
      });
      if (near.length === 0) {
        return "✅ 太棒了！最近7天内没有临期物品~";
      }
      const list = near
        .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
        .map((it) => {
          const d = daysUntil(it.expiryDate, today);
          return `• ${it.name}（${it.location}）：${d === 0 ? "今天到期" : `还剩 ${d} 天`}`;
        })
        .join("\n");
      return `⏰ 最近7天内即将过期的物品：\n${list}`;
    }
    // 5. 已过期
    if (/已过期|过期.*[了没]|坏.*[了掉]/.test(q)) {
      const expired = items.filter(
        (it) => daysUntil(it.expiryDate, today) < 0
      );
      if (expired.length === 0) {
        return "✅ 目前没有已过期物品，继续保持！";
      }
      const list = expired
        .map((it) => {
          const d = Math.abs(daysUntil(it.expiryDate, today));
          return `• ${it.name}（${it.location}）：已过期 ${d} 天`;
        })
        .join("\n");
      return `🚨 已过期物品（请尽快处理）：\n${list}`;
    }
    // 默认
    return '💬 我可以帮您查库存哦！试试问：\n• "有什么库存？"\n• "牛奶在哪里？"\n• "洗衣液还有多久过期？"\n• "有什么快过期了？"';
  };

  const askAI = async (q: string) => {
    if (!q.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setChatInput("");

    // 尝试调用 API，失败则回退到本地规则
    try {
      const inventoryData = items.map((it) => ({
        name: it.name,
        count: it.count,
        unit: it.unit,
        expiryDate: it.expiryDate,
        location: it.location,
        daysLeft: daysUntil(it.expiryDate, today),
      }));

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, inventoryData }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setChatHistory((prev) => [...prev, { role: "ai", text: data.reply }]);
          return;
        }
      }
    } catch {
      /* API 不可用，回退本地 */
    }

    // 本地规则兜底
    const answer = getAnswer(q);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "ai", text: answer }]);
    }, 400);
  };

  const handleChat = () => {
    askAI(chatInput);
  };

  const tabTheme = TAB_CONFIG[activeTab];

  return (
    <div className="inventory-page relative min-h-screen overflow-x-hidden text-gray-800"
      style={{
        background: "linear-gradient(135deg, #F0F7FF 0%, #F8F0FF 50%, #FFF0F5 100%)",
      }}
    >
      {/* 编辑弹窗 */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleEditSave}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* 拍照引导弹窗 */}
      {photoGuideOpen && (
        <PhotoGuideModal
          onClose={() => setPhotoGuideOpen(false)}
          onStart={handleStartPhoto}
        />
      )}

      {/* 拍照确认弹窗 */}
      {photoConfirmOpen && (
        <PhotoConfirmModal
          photoUrl={photoPreviewUrl}
          candidates={recognizedItems}
          onClose={() => {
            setPhotoConfirmOpen(false);
            setRecognizedItems([]);
            setPhotoPreviewUrl("");
          }}
          onConfirm={handlePhotoConfirm}
          onRetake={handleRetake}
          onUpdateCandidate={handleUpdateCandidate}
        />
      )}

      {/* SVG 手绘装饰 */}
      <StarDecoration className="pointer-events-none absolute left-4 top-20" color="#6B9BD1" />
      <FlowerDecoration className="pointer-events-none absolute right-6 top-28" color="#E070A0" />
      <DotDecoration className="pointer-events-none absolute left-6 bottom-32" color="#7AB87A" />
      <StarDecoration className="pointer-events-none absolute right-4 bottom-40" color="#E070A0" />
      <DotDecoration className="pointer-events-none absolute right-16 top-16" color="#6B9BD1" />
      <FlowerDecoration className="pointer-events-none absolute left-16 top-48" color="#7AB87A" />

      {/* —— 顶栏 —— */}
      <header className="relative z-10 border-b border-white/40 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link
            to={`/mickey${fromQuery}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-all hover:text-[#6B9BD1] hover:translate-x-[-2px]"
          >
            <span>←</span>
            <span>作品集</span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(107,155,209,0.2)]"
              style={{ backgroundColor: "#6B9BD1" }}
            />
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
              Inventory Prophet
            </span>
          </div>
        </div>
      </header>

      {/* —— 标题区 —— */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-4 pt-6">
        <h1
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          物资管家
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          资源管理与反浪费 · 把每一件物品用在它最好的时候
        </p>
      </div>

      {/* —— Tab 内容区 —— */}
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-28">
        {/* ====== 入库登记 Tab ====== */}
        <div
          className={cn(
            "transition-all duration-500",
            activeTab === "inbound"
              ? "opacity-100 translate-y-0"
              : "pointer-events-none absolute inset-x-5 opacity-0 -translate-y-4"
          )}
        >
          {/* 入库登记卡片 */}
          <section
            className="rounded-3xl border border-[#B4D4EE]/50 bg-white/70 p-5 backdrop-blur-md"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 30px rgba(107,155,209,0.08)",
            }}
          >
            <h2
              className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1]/15 text-sm">
                📦
              </span>
              入库登记
            </h2>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={isRecognizing}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#B4D4EE]/60 bg-[#F0F7FF]/40 py-3.5 text-sm text-[#6B9BD1] transition-all hover:border-[#6B9BD1]/60 hover:bg-[#6B9BD1]/5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-base">📷</span>
              {isRecognizing ? "识别中..." : "拍照识别物品"}
            </button>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  物品名称
                </label>
                <input
                  type="text"
                  value={form.name}
                  placeholder="如：洗衣液"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    数量
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.count}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        count: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    单位
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit: e.target.value as Unit }))
                    }
                    className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  到期日
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  存放位置
                </label>
                <select
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      location: e.target.value as Location,
                    }))
                  }
                  className="w-full rounded-xl border border-[#E8E0F0]/60 bg-white/50 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[#6B9BD1]/50 focus:bg-white focus:ring-2 focus:ring-[#B4D4EE]/30"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd}
                className="w-full rounded-full bg-gradient-to-r from-[#6B9BD1] to-[#8BB5E0] py-3 text-sm font-medium text-white shadow-md shadow-blue-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✨ 确认入库
              </button>
            </div>
          </section>
        </div>

        {/* ====== 库存列表 Tab ====== */}
        <div
          className={cn(
            "transition-all duration-500",
            activeTab === "inventory"
              ? "opacity-100 translate-y-0"
              : "pointer-events-none absolute inset-x-5 opacity-0 -translate-y-4"
          )}
        >
          {/* 状态胶囊筛选器 */}
          <section className="mb-4 flex flex-wrap items-center gap-2.5">
            {PILLS.map((p) => {
              const count = stats[p.key];
              const isActive = filter === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() =>
                    setFilter((prev) => (prev === p.key ? "all" : p.key))
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all hover:shadow-sm active:scale-95",
                    isActive ? p.active : p.idle
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", p.dot)} />
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                  <span className="font-semibold">{count}</span>
                </button>
              );
            })}
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="self-center text-xs text-gray-400 transition-all hover:text-gray-600 hover:translate-x-[-2px]"
              >
                显示全部
              </button>
            )}
          </section>

          {/* 库存卡片列表 */}
          <section
            className="rounded-3xl border border-[#A8D5A2]/50 bg-white/70 p-5 backdrop-blur-md"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 30px rgba(122,184,122,0.08)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-base font-semibold text-gray-800"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                📋 库存列表
              </h2>
              <span className="text-xs text-gray-400">
                共 {filtered.length} 件
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">🌱</div>
                <p className="text-sm text-gray-400">
                  {items.length === 0
                    ? "还没有任何物品，先去入库吧~"
                    : "当前筛选下没有物品。"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((it) => {
                  const d = daysUntil(it.expiryDate, today);
                  const status = getStockStatus(d);
                  const statusColor = STATUS_COLORS[status];
                  return (
                    <div
                      key={it.id}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border border-[#E8E0F0]/40 bg-white/60 p-4 transition-all duration-300",
                        deletingIds.has(it.id) && "opacity-0 scale-95"
                      )}
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                        borderLeftWidth: 4,
                        borderLeftColor: statusColor,
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "truncate text-sm font-semibold",
                              status === "expired"
                                ? "text-red-600"
                                : "text-gray-800"
                            )}
                          >
                            {it.name}
                          </span>
                          {status === "expired" && (
                            <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
                              已过期
                            </span>
                          )}
                          {status === "warning" && (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                              临期
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span>
                            数量: {it.count} {it.unit}
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: statusColor }}
                          >
                            到期: {it.expiryDate}
                          </span>
                          <span className="text-gray-400">
                            ({relativeHint(d)})
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center rounded-full bg-[#F0F7FF]/80 px-2 py-0.5 text-[11px] text-[#6B9BD1]">
                            📍 {it.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(it)}
                          className="rounded-lg bg-[#F0F7FF]/80 px-3 py-1 text-xs text-[#6B9BD1] transition-all hover:bg-[#6B9BD1]/15 active:scale-95"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(it.id)}
                          className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-400 transition-all hover:bg-red-100 active:scale-95"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ====== AI管家 Tab ====== */}
        <div
          className={cn(
            "transition-all duration-500",
            activeTab === "ai"
              ? "opacity-100 translate-y-0"
              : "pointer-events-none absolute inset-x-5 opacity-0 -translate-y-4"
          )}
        >
          {/* 统计数字 */}
          <section className="mb-4 grid grid-cols-4 gap-2.5">
            {[
              {
                label: "总物品",
                value: items.length,
                color: "#6B9BD1",
                bg: "bg-[#F0F7FF]/60",
              },
              {
                label: "充足",
                value: stats.sufficient,
                color: "#7AB87A",
                bg: "bg-[#F0FFF0]/60",
              },
              {
                label: "临期",
                value: stats.expiring,
                color: "#FF9800",
                bg: "bg-amber-50/60",
              },
              {
                label: "过期",
                value: stats.expired,
                color: "#E53935",
                bg: "bg-red-50/60",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col items-center rounded-2xl border border-white/50 p-3 backdrop-blur-sm",
                  s.bg
                )}
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: s.color, fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {s.value}
                </span>
                <span className="mt-0.5 text-[10px] text-gray-500">
                  {s.label}
                </span>
              </div>
            ))}
          </section>

          {/* AI管家问答 */}
          <section
            className="mb-4 rounded-3xl border border-[#F8C8DC]/50 bg-white/70 p-5 backdrop-blur-md"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 30px rgba(224,112,160,0.08)",
            }}
          >
            <h2
              className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E070A0]/15 text-sm">
                💬
              </span>
              问问AI管家
            </h2>

            {/* 聊天记录 */}
            <div className="mb-3 max-h-60 space-y-2.5 overflow-y-auto">
              {chatHistory.length === 0 && (
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] whitespace-pre-line rounded-2xl bg-[#F8F0FF]/60 px-3.5 py-2 text-sm leading-relaxed text-gray-700">
                      你好呀~ 我是AI管家小助手 🌸 请问有什么可以帮助你的？
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400">
                    试试点击下面的问题：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "有什么库存？",
                      "有什么快过期了？",
                      "已过期的有哪些？",
                      "牛奶在哪里？",
                      "洗衣液还有多久过期？",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => askAI(q)}
                        className="rounded-full border border-[#F8C8DC]/60 bg-[#FFF0F5]/50 px-3 py-1.5 text-xs text-[#C85A8A] transition-all hover:bg-[#F8C8DC]/40 hover:shadow-sm active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[#E070A0]/15 text-gray-700"
                        : "bg-[#F8F0FF]/60 text-gray-700"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* 猜你还想问 */}
              {chatHistory.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] text-gray-400">
                    ✨ 猜你还想问
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const suggestions: string[] = [];
                      const expired = items.filter(
                        (it) => daysUntil(it.expiryDate, today) < 0
                      );
                      const near = items.filter((it) => {
                        const d = daysUntil(it.expiryDate, today);
                        return d >= 0 && d <= 7;
                      });
                      if (expired.length > 0) suggestions.push("已过期的有哪些？");
                      if (near.length > 0) suggestions.push("有什么快过期了？");
                      if (items.length > 0) suggestions.push("有什么库存？");
                      if (items.length > 0) {
                        const randomItem =
                          items[Math.floor(Math.random() * items.length)];
                        suggestions.push(`${randomItem.name}在哪里？`);
                      }
                      // 去重后取前3个
                      const unique = [...new Set(suggestions)].slice(0, 3);
                      return unique;
                    })().map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => askAI(q)}
                        className="rounded-full border border-[#F8C8DC]/60 bg-[#FFF0F5]/50 px-3 py-1.5 text-xs text-[#C85A8A] transition-all hover:bg-[#F8C8DC]/40 hover:shadow-sm active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 输入框 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                placeholder="问点什么..."
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleChat();
                }}
                className="flex-1 rounded-xl border border-[#e4e0d8] bg-white/60 px-3 py-2 text-sm outline-none transition-all focus:border-[#E070A0]/40 focus:bg-white focus:ring-1 focus:ring-[#E070A0]/15"
              />
              <button
                type="button"
                onClick={handleChat}
                disabled={!chatInput.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E070A0] text-sm text-white shadow-sm transition-all hover:bg-[#C85A8A] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </section>

          {/* AI小贴士列表 */}
          <section
            className="rounded-3xl border border-[#F8C8DC]/50 bg-white/70 p-5 backdrop-blur-md"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 30px rgba(224,112,160,0.08)",
            }}
          >
            <h2
              className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E070A0]/15 text-sm">
                🤖
              </span>
              AI 管家小贴士
            </h2>

            {aiTips.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mb-3 text-4xl">🌸</div>
                <p className="text-sm text-gray-400">
                  暂无物品。先入库，我来帮您规划~
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiTips.map((tip) => (
                  <div
                    key={tip.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border border-white/50 p-3.5 backdrop-blur-sm transition-all",
                      tip.urgent
                        ? "bg-amber-50/60"
                        : "bg-[#F8F0FF]/40"
                    )}
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    <span className="mt-0.5 shrink-0 text-lg leading-none">
                      {tip.emoji}
                    </span>
                    <p
                      className={cn(
                        "flex-1 text-sm leading-relaxed",
                        tip.urgent ? "text-amber-800" : "text-gray-600"
                      )}
                    >
                      {tip.text}
                    </p>
                    {tip.itemId && (
                      <button
                        type="button"
                        onClick={() => handleDelete(tip.itemId)}
                        className={cn(
                          "shrink-0 self-center rounded-full border px-3 py-1 text-xs transition-all active:scale-95",
                          tip.urgent
                            ? "border-amber-300/60 text-amber-600 hover:bg-amber-100"
                            : "border-[#A8D5A2]/60 text-[#7AB87A] hover:bg-[#F0FFF0]"
                        )}
                      >
                        {tip.urgent ? "消耗" : "移除"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* —— 底部固定导航栏 —— */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-4">
          {(Object.keys(TAB_CONFIG) as TabKey[]).map((tab) => {
            const config = TAB_CONFIG[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex flex-1 flex-col items-center gap-1 py-2 transition-all active:scale-95"
              >
                {/* 图标区 */}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all",
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-400"
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: config.color,
                          boxShadow: `0 4px 12px ${config.color}40`,
                        }
                      : undefined
                  }
                >
                  {config.emoji}
                </span>
                {/* 文字 */}
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors",
                    isActive ? "" : "text-gray-400"
                  )}
                  style={isActive ? { color: config.color } : undefined}
                >
                  {config.label}
                </span>
                {/* 指示点 */}
                <span
                  className={cn(
                    "h-1 w-1 rounded-full transition-all",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                  style={isActive ? { backgroundColor: config.color } : undefined}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* 浮动管理员入口 */}
      <button
        onClick={() => verifyAdmin(() => {})}
        title={adminMode ? "管理面板" : "管理员登录"}
        className="fixed z-30 flex items-center justify-center rounded-full border border-white/40 transition-all hover:scale-105 active:scale-95"
        style={{
          bottom: 80,
          right: 20,
          width: 44,
          height: 44,
          background: adminMode
            ? "rgba(224,112,160,0.25)"
            : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          fontSize: 18,
        }}
      >
        {adminMode ? "⚙" : "🔒"}
      </button>

      <AdminGuardUI />

      {/* 入库成功提示 */}
      {toast && (
        <div
          className="fixed left-1/2 top-16 z-50 -translate-x-1/2 animate-bounce rounded-2xl border border-white/50 bg-white/80 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-md"
          style={{ animationDuration: "0.5s", animationIterationCount: "1" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
