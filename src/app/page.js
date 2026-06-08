'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import {
  getHabits, createHabit, deleteHabit,
  toggleCompletion, getStatusForDate, getStreak, getNegStreak,
} from '@/data/store';

const ICONS = ['📖','🙏','✝️','⛪','🎵','✍️','🏃','🛏️','⏰','📚','🌿','☀️','🌙','👨‍👩‍👧','🍎','💧','🧎','🕯️','📜','⚔️'];
const COLORS = ['#7C5C3E','#A07850','#4A7C4E','#5C7A8C','#8C5C4A','#7A6E3E','#6B4E7A','#4E6B7A','#7A4E4E','#5E7A5E'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function WeekStrip({ selected, onSelect }) {
  const weekStart = startOfWeek(selected, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  return (
    <div className="flex justify-around bg-surface rounded-2xl mx-4 mb-4 px-2 py-3 border border-border shadow-sm">
      {days.map((day, i) => {
        const sel = format(day, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd');
        const tod = isToday(day);
        return (
          <button key={i} onClick={() => onSelect(day)} className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-bold tracking-wider ${sel ? 'text-primary' : 'text-faint'}`}>
              {DAY_LABELS[i].slice(0, 3).toUpperCase()}
            </span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${sel
                ? 'bg-primary text-white shadow-sm'
                : tod
                ? 'border-2 border-primary text-primary'
                : 'text-muted'}`}>
              {format(day, 'd')}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function HabitRow({ habit, status, streak, negStreak, onToggle, onDelete }) {
  const done = status === 'completed';
  const skipped = status === 'skipped';
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 mx-4 mb-3 border transition-all shadow-sm
        ${done ? 'bg-surfaceAlt' : 'bg-surface'}`}
      style={{ borderColor: done ? habit.color + 'AA' : '#C9B99A' }}
      onContextMenu={e => { e.preventDefault(); onDelete(habit.id); }}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
        style={{ background: habit.color + '22', border: `1.5px solid ${habit.color}44` }}>
        {habit.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base truncate ${done ? 'text-muted line-through' : 'text-ink'}`}>
          {habit.name}
        </p>
        <p className="text-xs text-faint mt-0.5">Every day</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {streak > 0 && (
          <span className="bg-amber-100 border border-amber-300 rounded-lg px-2 py-0.5 text-xs font-bold text-amber-800">
            🔥 {streak}
          </span>
        )}
        {negStreak > 0 && !done && (
          <span className="bg-red-100 border border-red-200 rounded-lg px-2 py-0.5 text-xs font-bold text-red-700">
            -{negStreak}
          </span>
        )}
        <button
          onClick={() => onToggle(habit.id)}
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all font-bold text-base shadow-sm"
          style={{
            borderColor: habit.color,
            background: done ? habit.color : 'white',
            color: done ? '#fff' : habit.color,
          }}>
          {done ? '✓' : skipped ? '→' : ''}
        </button>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📖');
  const [color, setColor] = useState('#7C5C3E');

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-end z-50" onClick={onClose}>
      <div className="bg-bg w-full rounded-t-3xl p-6 pb-10 border-t border-border shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <h2 className="text-xl font-bold text-ink mb-4 font-serif">New Discipline</h2>

        <input
          autoFocus
          className="w-full bg-surface border border-border rounded-xl p-3 text-ink text-base mb-4 outline-none focus:border-primary placeholder-faint"
          placeholder="e.g. Read Bible, Pray, Fast…"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <p className="text-[11px] font-bold text-muted tracking-widest mb-2">ICON</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {ICONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              className={`w-10 h-10 rounded-xl bg-surface text-xl flex items-center justify-center border-2 transition-all
                ${icon === ic ? 'border-primary bg-surfaceAlt' : 'border-transparent'}`}>
              {ic}
            </button>
          ))}
        </div>

        <p className="text-[11px] font-bold text-muted tracking-widest mb-2">COLOR</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all shadow-sm"
              style={{ background: c, borderColor: color === c ? '#2C1A0E' : 'transparent' }} />
          ))}
        </div>

        <button
          className="w-full py-3 rounded-xl font-bold text-white mb-2 shadow-md transition-opacity hover:opacity-90"
          style={{ background: color }}
          onClick={() => {
            if (name.trim()) { onSave({ name: name.trim(), icon, color, days: [0,1,2,3,4,5,6] }); onClose(); }
          }}>
          Add Discipline
        </button>
        <button className="w-full py-2 text-muted text-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const [selected, setSelected] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [streaks, setStreaks] = useState({});
  const [negStreaks, setNegStreaks] = useState({});
  const [showAdd, setShowAdd] = useState(false);

  const reload = useCallback(() => {
    const h = getHabits();
    setHabits(h);
    const s = {}, st = {}, ng = {};
    h.forEach(hab => {
      s[hab.id] = getStatusForDate(hab.id, selected);
      st[hab.id] = getStreak(hab.id);
      ng[hab.id] = getNegStreak(hab.id);
    });
    setStatuses(s); setStreaks(st); setNegStreaks(ng);
  }, [selected]);

  useEffect(() => { reload(); }, [reload]);

  const isSunday = selected.getDay() === 0;
  const completed = habits.filter(h => statuses[h.id] === 'completed').length;
  const dateLabel = isToday(selected) ? 'Today' : format(selected, 'EEE, MMM d');

  return (
    <main className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <div>
          <p className="text-xs font-bold text-faint tracking-widest uppercase">Daily Disciplines</p>
          <h1 className="text-3xl font-bold text-ink font-serif">{dateLabel}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface border border-border rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-sm font-bold text-primary">{completed}</span>
            <span className="text-sm text-faint">/{habits.length}</span>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-2xl text-white shadow-md hover:opacity-90 transition-opacity">
            +
          </button>
        </div>
      </div>

      {/* Lord's Day banner */}
      {isSunday && (
        <div className="mx-4 mb-3 rounded-xl py-2.5 px-4 text-center text-sm font-semibold border shadow-sm"
          style={{ background: '#F5E6C8', borderColor: '#C4A060', color: '#7C5C3E' }}>
          ⛪ Lord's Day — Worship · Rest · Family Worship
        </div>
      )}

      <WeekStrip selected={selected} onSelect={setSelected} />

      {/* Quote */}
      <p className="text-center text-faint text-xs italic px-8 mb-4">
        "Train yourself for godliness." — 1 Tim 4:7
      </p>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center mt-20 gap-2">
          <span className="text-4xl">✝️</span>
          <p className="text-muted font-semibold">No disciplines yet.</p>
          <p className="text-faint text-sm">Tap + to begin your walk.</p>
        </div>
      ) : (
        habits.map(h => (
          <HabitRow key={h.id} habit={h}
            status={statuses[h.id]} streak={streaks[h.id]} negStreak={negStreaks[h.id]}
            onToggle={id => { toggleCompletion(id, selected); reload(); }}
            onDelete={id => { if (confirm('Remove this discipline?')) { deleteHabit(id); reload(); } }}
          />
        ))
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={d => { createHabit(d); reload(); }} />}
      <BottomNav />
    </main>
  );
}
