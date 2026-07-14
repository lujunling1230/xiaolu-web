import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAdminGuard } from "../../hooks/useAdminGuard";

/**
 * 物资管家 · Inventory Prophet
 *
 * 专业库存管理应用 —— SaaS 紧凑布局。
 * 左侧：入库登记表单 + 今日消耗建议（智慧规划）。
 * 右侧：状态胶囊仪表盘 + 库存列表表格。
 * 数据持久化于 localStorage（key: inventory_items）。
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
    idle: "bg-white border-gray-200 text-gray-600 hover:border-red-200",
  },
  {
    key: "expiring",
    label: "临期·30天内",
    emoji: "🟠",
    dot: "bg-amber-400",
    active: "bg-amber-50 border-amber-300 text-amber-700",
    idle: "bg-white border-gray-200 text-gray-600 hover:border-amber-200",
  },
  {
    key: "sufficient",
    label: "库存充足",
    emoji: "🟢",
    dot: "bg-emerald-400",
    active: "bg-emerald-50 border-emerald-300 text-emerald-700",
    idle: "bg-white border-gray-200 text-gray-600 hover:border-emerald-200",
  },
];

const VL_API_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const VL_MODEL = "qwen-vl-plus";
const _VL_API_KEY = "sk-ws-H.EMIDEPD.99KW.MEUCIFKj_RNhEpPBBXnpRLNoN9YrqKrpnP8CWD2nnG9gbONOAiEAhKjGJeLvxkepCGn8rIPBiSUk_8LhvRGYDorqwVLM_i8";
function getApiKey(): string { return _VL_API_KEY; }

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
    const response = await fetch(`${VL_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({
        model: VL_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: '识别图片中的物品，返回JSON数组。每个物品包含：name（名称，必填）、count（数量，数字）、unit（单位，如瓶/盒/袋/罐/箱/个/支）、expiryDate（到期日，YYYY-MM-DD格式，如不确定可留空）、location（存放位置，如冰箱/浴室/储物间/厨房/客厅/卧室）、confidence（置信度0-100）。只返回JSON数组，不要其他文字。格式示例：[{"name":"牛奶","count":2,"unit":"瓶","expiryDate":"2025-08-15","location":"冰箱","confidence":95}]',
              },
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800">编辑物品</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500">物品名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">数量</label>
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
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">单位</label>
              <select
                value={form.unit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unit: e.target.value as Unit }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
            <label className="mb-1 block text-xs text-gray-500">到期日</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiryDate: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">存放位置</label>
            <select
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value as Location }))
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className="flex-1 rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          📷 拍照识别物品
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            拍得清 —— 保持画面清晰，避免模糊
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            平铺摆放 —— 物品尽量平铺，减少重叠
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            光线充足 —— 在明亮环境下拍摄
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            靠近拍摄 —— 让物品占据画面主要部分
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={onStart}
            className="flex-1 rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a]"
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
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
          可信
        </span>
      );
    }
    if (confidence >= 50) {
      return (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
          待确认
        </span>
      );
    }
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
        不确定
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          📷 识别结果
        </h3>

        <div className="mb-4 flex justify-center">
          <img
            src={photoUrl}
            alt="识别照片"
            className="max-h-[200px] rounded-lg object-contain"
          />
        </div>

        <div className="space-y-4">
          {candidates.map((c) => (
            <div
              key={c.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                c.selected
                  ? "border-[#5d8a6a] bg-green-50/50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={c.selected}
                    onChange={(e) =>
                      onUpdateCandidate(c.id, { selected: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#5d8a6a]"
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
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"
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
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            重新拍照
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            className="flex-1 rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50"
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
  // 透传来源标记：完整版入口进来时，回工具箱仍带 from=full
  const [searchParams] = useSearchParams();
  const fromQuery = searchParams.get("from") === "full" ? "?from=full" : "";
  const [form, setForm] = useState<FormState>({
    name: "",
    count: 1,
    unit: "瓶",
    expiryDate: "",
    location: "冰箱",
  });

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

  /* —— 最早过期物品（智慧规划） —— */
  const earliest = useMemo<InventoryItem | null>(() => {
    if (items.length === 0) return null;
    return [...items].sort((a, b) =>
      a.expiryDate.localeCompare(b.expiryDate)
    )[0];
  }, [items]);

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

  const earliestDays = earliest
    ? daysUntil(earliest.expiryDate, today)
    : Infinity;

  /* —— 拍照识别 handlers —— */
  const handlePhotoClick = () => {
    setPhotoGuideOpen(true);
  };

  const handleStartPhoto = () => {
    setPhotoGuideOpen(false);
    fileInputRef.current?.click();
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

  return (
    <div className="inventory-page min-h-screen bg-gray-50 text-gray-800">
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

      {/* —— 顶栏 —— */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to={`/mickey${fromQuery}`}
            className="text-sm text-gray-500 transition-colors hover:text-[#5d8a6a]"
          >
            ← 妙妙工具箱
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5d8a6a]" />
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
              Inventory Prophet
            </span>
          </div>
        </div>
      </header>

      {/* —— 标题区 —— */}
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <h1 className="text-2xl font-semibold text-gray-900">物资管家</h1>
        <p className="mt-1 text-sm text-gray-500">
          资源管理与反浪费 · 把每一件物品用在它最好的时候
        </p>
      </div>

      {/* —— 主网格：左侧操作 + 右侧数据 —— */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* ============ 左侧 ============ */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          {/* 入库登记 */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="h-1 w-4 rounded-full bg-[#5d8a6a]" />
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
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 transition-colors hover:border-[#5d8a6a] hover:text-[#5d8a6a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRecognizing ? "识别中..." : "📷 拍照识别物品"}
            </button>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  物品名称
                </label>
                <input
                  type="text"
                  value={form.name}
                  placeholder="如：洗衣液"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"
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
                    value={form.count}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        count: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    单位
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit: e.target.value as Unit }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"
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
                <label className="mb-1 block text-xs text-gray-500">
                  到期日
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"
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
                className="w-full rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                确认入库
              </button>
            </div>
          </section>

          {/* 赏味期限建议 */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="h-1 w-4 rounded-full bg-amber-400" />
              赏味期限
            </h2>

            {earliest ? (() => {
              const isUrgent = earliestDays <= 30;
              return (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "12px 0"
                }}>
                  <p style={{
                    fontSize: 12, fontWeight: 500, textAlign: "center",
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: 20, padding: "6px 14px",
                    color: isUrgent ? "#D46B4D" : "#557C55",
                  }}>
                    {isUrgent ? "🔥" : "🍃"}&nbsp;
                    {isUrgent ? "赏味期限将至，宜趁鲜启用。" : "余量丰盈，且容它静候时光。"}
                  </p>
                  <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center" }}>
                    {earliest.name} · {earliest.count}{earliest.unit}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(earliest.id)}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: "6px 18px",
                      border: `1.5px solid ${isUrgent ? "#D46B4D" : "#557C55"}`,
                      borderRadius: 999, background: "transparent",
                      color: isUrgent ? "#D46B4D" : "#557C55",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {isUrgent ? "立即消耗" : "留着以后"}
                  </button>
                </div>
              );
            })() : (
              <p className="text-sm text-gray-400">
                暂无物品。先在上方入库，我来帮你规划。
              </p>
            )}
          </section>
        </aside>

        {/* ============ 右侧 ============ */}
        <main className="min-w-0 space-y-6">
          {/* 仪表盘胶囊 */}
          <section className="flex flex-wrap items-center gap-3">
            {PILLS.map((p) => {
              const count = stats[p.key];
              const active = filter === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setFilter((prev) => (prev === p.key ? "all" : p.key))}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                    active ? p.active : p.idle
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", p.dot)} />
                  <span>{p.emoji}</span>
                  {p.label}
                  <span className="font-semibold">{count}</span>
                </button>
              );
            })}
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="self-center text-xs text-gray-400 transition-colors hover:text-gray-600"
              >
                显示全部
              </button>
            )}
          </section>

          {/* 库存列表 */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-700">
                库存列表
              </h2>
              <span className="text-xs text-gray-400">
                共 {filtered.length} 件
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-400">
                  {items.length === 0
                    ? "还没有任何物品，去左侧入库吧。"
                    : "当前筛选下没有物品。"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <th className="px-5 py-3 font-medium">物品</th>
                      <th className="px-5 py-3 font-medium">数量</th>
                      <th className="px-5 py-3 font-medium">到期日</th>
                      <th className="px-5 py-3 font-medium">存放位置</th>
                      <th className="px-5 py-3 text-right font-medium">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((it) => {
                      const d = daysUntil(it.expiryDate, today);
                      const status = getStockStatus(d);
                      const statusColor = STATUS_COLORS[status];
                      return (
                        <tr
                          key={it.id}
                          className={cn(
                            "border-b border-gray-50 transition-opacity duration-300 stock-item",
                            deletingIds.has(it.id) && "opacity-0"
                          )}
                          style={{ borderLeft: `4px solid ${statusColor}` }}
                        >
                          <td className="px-5 py-3">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span
                                className={cn(
                                  "font-medium",
                                  status === "expired" ? "text-red-600" : "text-gray-800"
                                )}
                              >
                                {it.name}
                              </span>
                              {status === "expired" && (
                                <span style={{
                                  fontSize: 10, padding: "2px 6px",
                                  borderRadius: 999, background: "rgba(229,57,53,0.1)",
                                  color: "#E53935", fontWeight: 500
                                }}>
                                  已过期
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {it.count} {it.unit}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              style={{ color: statusColor, fontWeight: 500 }}
                            >
                              {it.expiryDate}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              ({relativeHint(d)})
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {it.location}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setEditingItem(it)}
                              className="mr-3 text-xs text-gray-400 transition-colors hover:text-[#5d8a6a]"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(it.id)}
                              className="text-xs text-gray-400 transition-colors hover:text-red-500"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* 浮动管理员入口 🔒 */}
      <button
        onClick={() => verifyAdmin(() => {})}
        title={adminMode ? "管理面板" : "管理员登录"}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 20,
          width: 44, height: 44, border: "none", borderRadius: "50%",
          background: adminMode ? "rgba(141,154,139,0.3)" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}
      >
        {adminMode ? "⚙" : "🔒"}
      </button>

      <AdminGuardUI />
    </div>
  );
};

export default InventoryPage;
