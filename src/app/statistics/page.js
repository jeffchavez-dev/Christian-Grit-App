'use client';
import { useState, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfYear } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import { getHabits, getCompletions } from '@/data/store';

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }

function RecordCard({ value, label, icon }) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <span className="text-3xl font-bold text-ink font-serif">{value}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-[10px] font-bold text-muted tracking-wider uppercase">{label}</p>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-end justify-center" style={{ height: 88 }}>
            <div className="w-full rounded-t-lg transition-all"
              style={{
                height: `${Math.max(4, (d.value / max) * 88)}px`,
                background: `linear-gradient(to top, #7C5C3E, #A07850)`,
                opacity: 0.5 + (d.value / max) * 0.5,
              }} />
          </div>
          <span className="text-[9px] font-semibold text-faint uppercase">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatisticsPage() {
  const [habits, setHabits] = useState([]);
  const [comps, setComps] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();

  useEffect(() => { setHabits(getHabits()); setComps(getCompletions()); }, []);

  const completionsByDate = {};
  Object.entries(comps).forEach(([key, status]) => {
    if (status === 'completed') {
      const date = key.split('_').slice(1).join('_');
      completionsByDate[date] = (completionsByDate[date] ?? 0) + 1;
    }
  });

  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    if ((completionsByDate[d] ?? 0) > 0) currentStreak++;
    else if (i === 0) continue;
    else break;
  }

  let bestStreak = 0, temp = 0;
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    if ((completionsByDate[d] ?? 0) > 0) { temp++; bestStreak = Math.max(bestStreak, temp); }
    else temp = 0;
  }

  const completedLast30 = Array.from({ length: 30 }, (_, i) =>
    completionsByDate[format(subDays(today, i), 'yyyy-MM-dd')] ?? 0
  ).reduce((a, b) => a + b, 0);

  const successRate = habits.length > 0
    ? Math.round((completedLast30 / (habits.length * 30)) * 100) : 0;

  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    const count = completionsByDate[format(d, 'yyyy-MM-dd')] ?? 0;
    return { label: format(d, 'EEE').slice(0, 2), value: habits.length > 0 ? Math.round((count / habits.length) * 100) : 0 };
  });

  const weekStart = startOfWeek(subDays(today, weekOffset * 7), { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const yearStart = startOfYear(today);
  const allDays = eachDayOfInterval({ start: yearStart, end: today });
  const weeks = [];
  let week = [];
  const pad = allDays[0].getDay();
  for (let i = 0; i < pad; i++) week.push(null);
  for (const d of allDays) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) weeks.push(week);

  return (
    <main className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <p className="text-xs font-bold text-faint tracking-widest uppercase">Your Walk</p>
        <h1 className="text-3xl font-bold text-ink font-serif">Growth</h1>
      </div>

      {/* Records */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Records — Last 30 Days</p>
      <div className="grid grid-cols-2 gap-3 px-4 mb-5">
        <RecordCard value={currentStreak}    label="Day Streak"    icon="🔥" />
        <RecordCard value={bestStreak}       label="Best Streak"   icon="🏅" />
        <RecordCard value={completedLast30}  label="Completed"     icon="✅" />
        <RecordCard value={`${successRate}%`} label="Faithfulness" icon="✝️" />
      </div>

      {/* Weekly grid */}
      <div className="flex justify-between items-center px-4 mb-2">
        <p className="text-[11px] font-bold text-muted tracking-widest uppercase">
          {format(weekStart, 'MMM d')} – {format(endOfWeek(weekStart, { weekStartsOn: 0 }), 'MMM d')}
        </p>
        <div className="flex gap-4">
          <button className="text-muted text-xl font-bold" onClick={() => setWeekOffset(w => w + 1)}>‹</button>
          <button className="text-muted text-xl font-bold" onClick={() => setWeekOffset(w => Math.max(0, w - 1))}>›</button>
        </div>
      </div>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-5">
        <div className="flex items-center gap-1 mb-3">
          <span className="flex-[2] text-[10px] text-faint"> </span>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <span key={i} className="w-6 text-center text-[10px] font-bold text-faint">{d}</span>
          ))}
        </div>
        {habits.slice(0, 5).map(h => (
          <div key={h.id} className="flex items-center gap-1 mb-2">
            <span className="flex-[2] text-xs text-ink truncate font-medium">{h.icon} {h.name}</span>
            {weekDays.map((d, di) => {
              const key = `${h.id}_${format(d, 'yyyy-MM-dd')}`;
              const done = comps[key] === 'completed';
              return (
                <div key={di} className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all"
                  style={{
                    borderColor: done ? h.color : '#C9B99A',
                    background: done ? h.color + '33' : 'transparent',
                    color: h.color,
                  }}>
                  {done ? '✓' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">{today.getFullYear()} — Annual Record</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-5 overflow-x-auto">
        <div className="flex gap-0.5">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {w.map((d, di) => {
                if (!d) return <div key={di} className="w-2.5 h-2.5" />;
                const count = completionsByDate[format(d, 'yyyy-MM-dd')] ?? 0;
                const op = count === 0 ? 0.1 : Math.min(1, 0.25 + count * 0.3);
                return (
                  <div key={di} className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: `rgba(124,92,62,${op})` }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Daily Faithfulness — Last 7 Days</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-5">
        <BarChart data={barData} />
      </div>

      {/* Motivational quote */}
      <p className="text-center text-faint text-xs italic px-8 mb-4">
        "His mercies are new every morning." — Lam 3:23
      </p>

      <BottomNav />
    </main>
  );
}
