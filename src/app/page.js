'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import {
  getHabits, createHabit, deleteHabit,
  toggleCompletion, getStatusForDate, getStreak, getNegStreak,
} from '@/data/store';

const ICONS = ['📖','🙏','✝️','⛪','🎵','📝','🏃','💪','🛏️','⏰','📚','✉️','🌿','☀️','🌙','👨‍👩‍👧','🔇','🍎','💧','🧠'];
const COLORS = ['#6C63FF','#42A5F5','#F5A623','#4CAF50','#E53935','#AB47BC','#26C6DA','#FF7043','#78909C','#8D6E63'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function WeekStrip({ selected, onSelect }) {
  const weekStart = startOfWeek(selected, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  return (
    <div className="flex justify-around bg-surface rounded-2xl mx-4 mb-4 px-2 py-3">
      {days.map((day, i) => {
        const sel = format(day,'yyyy-MM-dd') === format(selected,'yyyy-MM-dd');
        const tod = isToday(day);
        return (
          <button key={i} onClick={() => onSelect(day)} className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-bold tracking-wider ${sel ? 'text-primary' : 'text-faint'}`}>
              {DAY_LABELS[i].toUpperCase()}
            </span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
              ${sel ? 'bg-primary text-white' : tod ? 'border border-primary text-white' : 'text-muted'}`}>
              {format(day,'d')}
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
    <div className={`flex items-center gap-3 bg-surface rounded-2xl p-4 mx-4 mb-3 border transition-all
      ${done ? 'border-opacity-40' : 'border-border'}`}
      style={{ borderColor: done ? habit.color + '66' : undefined }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: habit.color + '22' }}>
        {habit.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base truncate ${done || skipped ? 'text-muted' : 'text-white'}`}>
          {habit.name}
        </p>
        <p className="text-xs text-faint mt-0.5">Every day</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {streak > 0 && (
          <span className="bg-surfaceAlt rounded-lg px-2 py-0.5 text-xs font-bold text-gold">🔥{streak}</span>
        )}
        {negStreak > 0 && !done && (
          <span className="bg-red-900/30 rounded-lg px-2 py-0.5 text-xs font-bold text-red-400">-{negStreak}</span>
        )}
        <button
          onClick={() => onToggle(habit.id)}
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all font-bold text-base"
          style={{
            borderColor: habit.color,
            background: done ? habit.color : 'transparent',
            color: done ? '#fff' : skipped ? '#555570' : '#8888AA',
          }}>
          {done ? '✓' : skipped ? '→' : '+'}
        </button>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📖');
  const [color, setColor] = useState('#6C63FF');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={onClose}>
      <div className="bg-surface w-full rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <h2 className="text-xl font-bold mb-4">New Habit</h2>
        <input
          autoFocus
          className="w-full bg-surfaceAlt border border-border rounded-xl p-3 text-white text-base mb-4 outline-none focus:border-primary"
          placeholder="Habit name…"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <p className="text-[11px] font-semibold text-muted tracking-widest mb-2">ICON</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {ICONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              className={`w-10 h-10 rounded-xl bg-surfaceAlt text-xl flex items-center justify-center border-2 transition-all
                ${icon === ic ? 'border-primary' : 'border-transparent'}`}>
              {ic}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-semibold text-muted tracking-widest mb-2">COLOR</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{ background: c, borderColor: color === c ? '#fff' : 'transparent' }} />
          ))}
        </div>
        <button
          className="w-full py-3 rounded-xl font-bold text-white mb-2 transition-opacity hover:opacity-90"
          style={{ background: color }}
          onClick={() => { if (name.trim()) { onSave({ name: name.trim(), icon, color, days: [0,1,2,3,4,5,6] }); onClose(); } }}>
          Add Habit
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
    const s = {}; const st = {}; const ng = {};
    h.forEach(hab => {
      s[hab.id] = getStatusForDate(hab.id, selected);
      st[hab.id] = getStreak(hab.id);
      ng[hab.id] = getNegStreak(hab.id);
    });
    setStatuses(s); setStreaks(st); setNegStreaks(ng);
  }, [selected]);

  useEffect(() => { reload(); }, [reload]);

  const handleToggle = (id) => {
    toggleCompletion(id, selected);
    reload();
  };

  const handleAdd = (data) => { createHabit(data); reload(); };
  const handleDelete = (id) => { if (confirm('Delete this habit?')) { deleteHabit(id); reload(); } };

  const isSunday = selected.getDay() === 0;
  const completed = habits.filter(h => statuses[h.id] === 'completed').length;
  const dateLabel = isToday(selected) ? 'Today' : format(selected, 'EEE, MMM d');

  return (
    <main className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <h1 className="text-3xl font-bold">{dateLabel}</h1>
        <div className="flex items-center gap-3">
          <span className="text-muted font-semibold">{completed}/{habits.length}</span>
          <button onClick={() => setShowAdd(true)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xl text-white font-light">+</button>
        </div>
      </div>

      {/* Lord's Day */}
      {isSunday && (
        <div className="mx-4 mb-3 bg-primaryDim rounded-xl py-2 text-center text-sm font-semibold text-white">
          ⛪ Lord's Day — Worship, Rest, Family
        </div>
      )}

      <WeekStrip selected={selected} onSelect={setSelected} />

      {habits.length === 0 ? (
        <div className="flex flex-col items-center mt-20 gap-2">
          <p className="text-muted font-semibold">No habits yet.</p>
          <p className="text-faint text-sm">Tap + to add your first habit.</p>
        </div>
      ) : (
        habits.map(h => (
          <HabitRow key={h.id} habit={h}
            status={statuses[h.id]} streak={streaks[h.id]} negStreak={negStreaks[h.id]}
            onToggle={handleToggle} onDelete={handleDelete} />
        ))
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      <BottomNav />
    </main>
  );
}
