'use client';
import { format } from 'date-fns';

const DEFAULT_HABITS = [
  { id: 1, name: 'Read Bible',       icon: '📖', color: '#42A5F5', days: [0,1,2,3,4,5,6] },
  { id: 2, name: 'Pray',             icon: '🙏', color: '#6C63FF', days: [0,1,2,3,4,5,6] },
  { id: 3, name: 'Family Worship',   icon: '👨‍👩‍👧', color: '#F5A623', days: [0,1,2,3,4,5,6] },
  { id: 4, name: 'Make your Bed',    icon: '🛏️', color: '#AB47BC', days: [0,1,2,3,4,5,6] },
  { id: 5, name: 'Wake Up on Time',  icon: '⏰', color: '#F5A623', days: [0,1,2,3,4,5,6] },
];

function load(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, val) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
}

// ─── Habits ──────────────────────────────────────────────────────────────────
export function getHabits() {
  const habits = load('grit_habits', null);
  if (!habits) { save('grit_habits', DEFAULT_HABITS); return DEFAULT_HABITS; }
  return habits;
}

export function saveHabits(habits) { save('grit_habits', habits); }

export function createHabit(habit) {
  const habits = getHabits();
  const newHabit = { ...habit, id: Date.now() };
  saveHabits([...habits, newHabit]);
  return newHabit;
}

export function deleteHabit(id) {
  saveHabits(getHabits().filter(h => h.id !== id));
  const comps = load('grit_completions', {});
  Object.keys(comps).forEach(k => { if (k.startsWith(`${id}_`)) delete comps[k]; });
  save('grit_completions', comps);
}

// ─── Completions ─────────────────────────────────────────────────────────────
function completionKey(habitId, date) {
  return `${habitId}_${format(date, 'yyyy-MM-dd')}`;
}

export function getCompletions() { return load('grit_completions', {}); }

export function toggleCompletion(habitId, date) {
  const comps = getCompletions();
  const key = completionKey(habitId, date);
  const cur = comps[key];
  if (!cur)                   comps[key] = 'completed';
  else if (cur === 'completed') comps[key] = 'skipped';
  else                          delete comps[key];
  save('grit_completions', comps);
  return comps[key] ?? null;
}

export function getStatusForDate(habitId, date) {
  return getCompletions()[completionKey(habitId, date)] ?? null;
}

export function getStreak(habitId) {
  const comps = getCompletions();
  let streak = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = `${habitId}_${format(d, 'yyyy-MM-dd')}`;
    if (comps[key] === 'completed') streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export function getNegStreak(habitId) {
  const comps = getCompletions();
  let streak = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = `${habitId}_${format(d, 'yyyy-MM-dd')}`;
    if (!comps[key] || comps[key] === 'skipped') streak++;
    else break;
  }
  return streak;
}

// ─── Catechism ────────────────────────────────────────────────────────────────
export function getCatechismProgress() { return load('grit_catechism', {}); }
export function markMemorized(qNum) {
  const p = getCatechismProgress();
  p[qNum] = true;
  save('grit_catechism', p);
}

// ─── Bible Reading ────────────────────────────────────────────────────────────
export function getReadingLog() { return load('grit_reading', {}); }
export function togglePassage(dateStr, passage) {
  const log = getReadingLog();
  const key = `${dateStr}_${passage}`;
  if (log[key]) delete log[key]; else log[key] = true;
  save('grit_reading', log);
  return !!log[key];
}
export function isPassageDone(dateStr, passage) {
  return !!getReadingLog()[`${dateStr}_${passage}`];
}

// ─── Prayer ───────────────────────────────────────────────────────────────────
export function getPrayerEntries() { return load('grit_prayers', []); }
export function addPrayerEntry(entry) {
  const entries = getPrayerEntries();
  const newEntry = { ...entry, id: Date.now(), date: format(new Date(), 'yyyy-MM-dd') };
  save('grit_prayers', [newEntry, ...entries]);
  return newEntry;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  userName: 'Christian',
  streaks: true,
  negStreaks: true,
  confetti: true,
  sounds: true,
  lordDayMode: true,
  dayStartsAt: '04:00',
  readingPlan: "M'Cheyne",
  catechism: '1689 LBC',
};
export function getSettings() { return { ...DEFAULT_SETTINGS, ...load('grit_settings', {}) }; }
export function saveSetting(key, value) {
  const s = getSettings(); s[key] = value; save('grit_settings', s);
}
