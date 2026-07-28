import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../lib/api";

type View = "Month" | "Week" | "Day";

type Task = {
  id: number;
  title: string;
  status: string;
  project_id: number;
  created_at: string;
};

// Dec 2024 calendar: Dec 1 = Sunday, 5 weeks (35 cells), 4 trailing Jan days

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayCell {
  date: number;
  month: "prev" | "current" | "next";
  isToday?: boolean;
  isWeekend?: boolean;
}

function buildMonthGrid(): DayCell[] {
  // Dec 2024: starts Sunday (0), 31 days
  // No leading days, 4 trailing Jan days
  const cells: DayCell[] = [];
  for (let d = 1; d <= 31; d++) {
    const dow = (d - 1) % 7; // 0=Sun for d=1
    cells.push({
      date: d,
      month: "current",
      isToday: d === 14,
      isWeekend: dow === 0 || dow === 6,
    });
  }
  // Jan 1-4
  for (let d = 1; d <= 4; d++) {
    const dow = (31 + d - 1) % 7;
    cells.push({ date: d, month: "next", isWeekend: dow === 0 || dow === 6 });
  }
  return cells;
}

const MONTH_CELLS = buildMonthGrid();

interface EventPill {
  day: number;
  color: string;
  label: string;
}

const WEEK_HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8..20

interface WeekTask {
  day: number; // 0=Sun(Dec9)..6=Sat(Dec15) → 0=Dec9, 1=Dec10 etc.
  startHour: number;
  duration: number; // hours
  label: string;
  color: string;
}

const WEEK_DAYS = ["Dec 9", "Dec 10", "Dec 11", "Dec 12", "Dec 13", "Dec 14", "Dec 15"];
const WEEK_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_COLORS: Record<string, string> = {
  todo: "#F59E0B",
  in_progress: "var(--color-accent)",
  done: "#22C55E",
};

function getStatusColor(status: string) {
  return STATUS_COLORS[status.toLowerCase()] || "#8B5CF6";
}

export default function CalendarPage() {
  const [view, setView] = useState<View>("Month");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api
      .get<Task[]>("/tasks")
      .then((data) => setTasks(data))
      .catch(console.error);
  }, []);

  const eventMap = useMemo(() => {
    const pills: EventPill[] = tasks.map((t) => {
      const d = new Date(t.created_at);
      return {
        day: d.getDate(),
        color: getStatusColor(t.status),
        label: t.title,
      };
    });

    return pills.reduce<Record<number, EventPill[]>>((acc, pill) => {
      acc[pill.day] = acc[pill.day] ? [...acc[pill.day], pill] : [pill];
      return acc;
    }, {});
  }, [tasks]);

  const weekTasks = useMemo(() => {
    return tasks.map((t) => {
      const d = new Date(t.created_at);
      const day = d.getDay(); // 0=Sun..6=Sat
      const startHour = Math.max(8, Math.min(20, d.getHours()));
      return {
        day,
        startHour,
        duration: 1, // Default to 1 hr
        label: t.title,
        color: getStatusColor(t.status),
      } as WeekTask;
    });
  }, [tasks]);

  const dayTasks = useMemo(() => {
    return tasks.map((t) => {
      const d = new Date(t.created_at);
      const startHour = Math.max(8, Math.min(20, d.getHours()));
      const timeStr = `${startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour}:00 ${startHour >= 12 ? "PM" : "AM"}`;
      return {
        time: timeStr,
        startH: startHour,
        duration: 1,
        durationStr: "1h",
        label: t.title,
        color: getStatusColor(t.status),
      };
    });
  }, [tasks]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-foreground text-2xl font-semibold">Calendar</h1>

        <div className="flex items-center gap-2">
          {/* Month nav */}
          <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl px-1 py-1">
            <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground/80 hover:bg-white/[0.06] rounded-lg transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-muted-foreground text-sm font-medium px-2">December 2024</span>
            <button className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground/80 hover:bg-white/[0.06] rounded-lg transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Today */}
          <button className="bg-secondary border border-border text-muted-foreground hover:text-foreground/80 hover:bg-white/[0.07] text-sm px-3 py-2 rounded-xl transition-colors">
            Today
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-secondary border border-border rounded-xl p-1 gap-0.5">
            {(["Month", "Week", "Day"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  view === v
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar view */}
      {view === "Month" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.05]">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-3 text-center text-muted-foreground text-xs font-medium">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {MONTH_CELLS.map((cell, i) => {
              const events = cell.month === "current" ? eventMap[cell.date] || [] : [];
              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-2 border-b border-r border-white/[0.04] transition-colors cursor-pointer ${
                    cell.month !== "current" ? "opacity-30" : ""
                  } ${cell.isWeekend && cell.month === "current" ? "bg-white/[0.008]" : ""} hover:bg-white/[0.03]`}
                >
                  <div className="flex items-center mb-1">
                    <span
                      className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                        cell.isToday
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground/80"
                      }`}
                    >
                      {cell.date}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {events.map((ev, ei) => (
                      <div
                        key={ei}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium truncate"
                        style={{ background: `${ev.color}22`, color: ev.color }}
                      >
                        {ev.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "Week" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Day headers */}
          <div className="grid border-b border-white/[0.05]" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
            <div className="py-3" />
            {WEEK_DAYS.map((d, i) => (
              <div key={d} className={`py-3 text-center border-l border-white/[0.04] ${i === 5 ? "bg-accent/5" : ""}`}>
                <p className="text-muted-foreground text-xs">{WEEK_DAY_LABELS[i]}</p>
                <p className={`text-sm font-medium mt-0.5 ${i === 5 ? "text-accent" : "text-muted-foreground"}`}>{d.split(" ")[1]}</p>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="overflow-y-auto max-h-[480px]">
            <div className="relative grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
              {/* Hour labels */}
              <div>
                {WEEK_HOURS.map((h) => (
                  <div key={h} style={{ height: 60 }} className="flex items-start pt-1 pr-2 justify-end">
                    <span className="text-foreground/25 text-xs">{h > 12 ? `${h - 12}PM` : h === 12 ? "12PM" : `${h}AM`}</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {WEEK_DAYS.map((d, dayIdx) => (
                <div key={d} className={`relative border-l border-white/[0.04] ${dayIdx === 5 ? "bg-accent/[0.02]" : ""}`}>
                  {WEEK_HOURS.map((h) => (
                    <div key={h} style={{ height: 60 }} className="border-b border-white/[0.03]" />
                  ))}
                  {/* Tasks */}
                  {weekTasks
                    .filter((t) => t.day === dayIdx)
                    .map((t, ti) => (
                      <div
                        key={ti}
                        className="absolute left-1 right-1 rounded-lg px-2 py-1.5 text-xs font-medium overflow-hidden"
                        style={{
                          top: (t.startHour - 8) * 60,
                          height: t.duration * 60 - 4,
                          background: `${t.color}22`,
                          borderLeft: `2px solid ${t.color}`,
                          color: t.color,
                        }}
                      >
                        {t.label}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "Day" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Time grid */}
          <div className="col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <p className="text-foreground font-semibold">Saturday, December 14</p>
              <p className="text-muted-foreground text-sm mt-0.5">Today</p>
            </div>
            <div className="overflow-y-auto max-h-[480px]">
              <div className="relative" style={{ display: "grid", gridTemplateColumns: "60px 1fr" }}>
                <div>
                  {WEEK_HOURS.map((h) => (
                    <div key={h} className="flex items-start pt-1 pr-2 justify-end" style={{ height: 70 }}>
                      <span className="text-foreground/25 text-xs">{h > 12 ? `${h - 12}PM` : h === 12 ? "12PM" : `${h}AM`}</span>
                    </div>
                  ))}
                </div>
                <div className="relative border-l border-white/[0.04]">
                  {WEEK_HOURS.map((h) => (
                    <div key={h} className="border-b border-white/[0.03]" style={{ height: 70 }} />
                  ))}
                  {/* Tasks */}
                  {dayTasks.map((t, i) => (
                    <div
                      key={i}
                      className="absolute left-2 right-2 rounded-xl px-3 py-2 overflow-hidden"
                      style={{
                        top: (t.startH - 8) * 70,
                        height: t.duration * 70 - 4,
                        background: `${t.color}18`,
                        borderLeft: `3px solid ${t.color}`,
                      }}
                    >
                      <p className="text-xs font-semibold" style={{ color: t.color }}>
                        {t.label}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {t.startH > 12 ? `${t.startH - 12}` : t.startH === 0 ? 12 : t.startH}:00 {t.startH >= 12 ? "PM" : "AM"} · {t.duration}h
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Task list sidebar */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-foreground text-sm font-semibold mb-4">Tasks</h3>
            <div className="space-y-3">
              {dayTasks.map((t, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="w-1 h-full rounded-full mt-1 shrink-0 self-stretch"
                    style={{ background: t.color, minHeight: 32 }}
                  />
                  <div>
                    <p className="text-foreground/80 text-sm font-medium">{t.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {t.time} · {t.durationStr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
