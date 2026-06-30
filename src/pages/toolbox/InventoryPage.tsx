import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
const UNITS = ["瓶", "盒", "袋"] as const;
const LOCATIONS = ["冰箱", "浴室", "储物间"] as const;

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

/* ============================================================
   胶囊配置
   ============================================================ */
const PILLS: {
  key: Status;
  label: string;
  dot: string;
  active: string;
  idle: string;
}[] = [
  {
    key: "expired",
    label: "已过期",
    dot: "bg-red-400",
    active: "bg-red-50 border-red-300 text-red-600",
    idle: "bg-white border-gray-200 text-gray-600 hover:border-red-200",
  },
  {
    key: "expiring",
    label: "临期 · 30 天内",
    dot: "bg-amber-400",
    active: "bg-amber-50 border-amber-300 text-amber-700",
    idle: "bg-white border-gray-200 text-gray-600 hover:border-amber-200",
  },
  {
    key: "sufficient",
    label: "库存充足",
    dot: "bg-emerald-400",
    active: "bg-emerald-50 border-emerald-300 text-emerald-700",
    idle: "bg-white border-gray-200 text-gray-600 hover:border-emerald-200",
  },
];

/* ============================================================
   组件
   ============================================================ */
const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => loadItems());
  const [filter, setFilter] = useState<FilterKey>("all");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
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

  /* —— 删除（带淡出动画） —— */
  const handleDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  const earliestDays = earliest
    ? daysUntil(earliest.expiryDate, today)
    : Infinity;

  return (
    <div className="inventory-page min-h-screen bg-gray-50 text-gray-800">
      {/* —— 顶栏 —— */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to={`/toolbox${fromQuery}`}
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

          {/* 今日消耗建议 */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="h-1 w-4 rounded-full bg-amber-400" />
              今日消耗建议
            </h2>

            {earliest ? (
              <div>
                <p className="text-sm leading-relaxed text-gray-600">
                  您的「
                  <span className="font-medium text-gray-900">
                    {earliest.name}
                  </span>
                  」
                  {relativeHint(earliestDays)}
                  ，建议今天使用！
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(earliest.id)}
                  className="mt-3 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                >
                  标记已用完
                </button>
              </div>
            ) : (
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
                      const expired = d < 0;
                      const expiring = d >= 0 && d <= NEAR_THRESHOLD;
                      return (
                        <tr
                          key={it.id}
                          className={cn(
                            "border-b border-gray-50 transition-opacity duration-300",
                            deletingIds.has(it.id) && "opacity-0"
                          )}
                        >
                          <td
                            className={cn(
                              "border-l-4 px-5 py-3",
                              expired
                                ? "border-l-red-400"
                                : expiring
                                ? "border-l-amber-300"
                                : "border-l-transparent"
                            )}
                          >
                            <span
                              className={cn(
                                "font-medium",
                                expired ? "text-red-600" : "text-gray-800"
                              )}
                            >
                              {it.name}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {it.count} {it.unit}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={cn(
                                expired
                                  ? "text-red-500"
                                  : expiring
                                  ? "text-amber-600"
                                  : "text-gray-600"
                              )}
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
    </div>
  );
};

export default InventoryPage;
