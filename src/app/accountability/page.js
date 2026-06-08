'use client';
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import { getHabits, getCompletions, getStreak } from '@/data/store';

function buildShareData() {
  const habits = getHabits();
  const comps = getCompletions();
  const today = new Date();

  const habitStats = habits.map(h => {
    const streak = getStreak(h.id);
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = format(subDays(today, 6 - i), 'yyyy-MM-dd');
      return comps[`${h.id}_${d}`] === 'completed' ? '✓' : '✗';
    });
    return { name: h.name, icon: h.icon, streak, last7 };
  });

  const completedToday = habits.filter(h =>
    comps[`${h.id}_${format(today, 'yyyy-MM-dd')}`] === 'completed'
  ).length;

  return {
    date: format(today, 'MMMM d, yyyy'),
    completedToday,
    total: habits.length,
    habits: habitStats,
  };
}

function buildShareText(data, name) {
  const lines = [
    `✝️ ${name}'s Disciplines — ${data.date}`,
    `Today: ${data.completedToday}/${data.total} completed`,
    '',
    ...data.habits.map(h => `${h.icon} ${h.name} — 🔥${h.streak} streak — ${h.last7.join(' ')}`),
    '',
    '"Train yourself for godliness." — 1 Tim 4:7',
    'christian-grit-app.vercel.app',
  ];
  return lines.join('\n');
}

function buildShareURL(data) {
  const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
  return `${window.location.origin}/accountability/view?d=${encoded}`;
}

export default function AccountabilityPage() {
  const [data, setData] = useState(null);
  const [name, setName] = useState('Christian');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(buildShareData());
    const s = localStorage.getItem('grit_settings');
    if (s) { try { setName(JSON.parse(s).userName ?? 'Christian'); } catch {} }
  }, []);

  const shareText = data ? buildShareText(data, name) : '';
  const shareURL = data && typeof window !== 'undefined' ? buildShareURL(data) : '';

  const copyText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Disciplines', text: shareText, url: shareURL });
    } else copyText();
  };

  if (!data) return null;

  return (
    <main className="min-h-screen pb-24 bg-bg">
      <div className="px-6 pt-14 pb-4">
        <p className="text-xs font-bold text-faint tracking-widest uppercase">Accountability</p>
        <h1 className="text-3xl font-bold text-ink font-serif">Share Progress</h1>
      </div>

      <p className="text-center text-faint text-xs italic px-8 mb-4">
        "Iron sharpens iron, and one man sharpens another." — Prov 27:17
      </p>

      {/* Summary card */}
      <div className="mx-4 rounded-2xl p-5 border shadow-sm mb-4"
        style={{ background: 'linear-gradient(135deg, #F5E6C8, #EDD9AA)', borderColor: '#C4A060' }}>
        <p className="font-bold text-xl font-serif text-ink mb-1">{name}'s Disciplines</p>
        <p className="text-muted text-sm mb-3">{data.date}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/60 rounded-xl p-3 text-center border border-amber-200">
            <p className="text-2xl font-bold text-ink">{data.completedToday}/{data.total}</p>
            <p className="text-xs text-muted font-semibold">Today</p>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 text-center border border-amber-200">
            <p className="text-2xl font-bold text-ink">{data.habits.reduce((a,h) => Math.max(a, h.streak), 0)}</p>
            <p className="text-xs text-muted font-semibold">Best Streak 🔥</p>
          </div>
        </div>
      </div>

      {/* Per-habit grid */}
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-3 uppercase">Last 7 Days</p>
        <div className="flex items-center gap-1 mb-2 pl-32">
          {['S','M','T','W','T','F','S'].map((d,i) => (
            <span key={i} className="w-7 text-center text-[10px] font-bold text-faint">{d}</span>
          ))}
        </div>
        {data.habits.map((h, i) => (
          <div key={i} className="flex items-center gap-1 mb-2">
            <span className="w-32 text-xs text-ink font-medium truncate">{h.icon} {h.name}</span>
            {h.last7.map((s, j) => (
              <div key={j} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: s === '✓' ? '#7C5C3E22' : '#F5EFE6',
                  color: s === '✓' ? '#7C5C3E' : '#C9B99A',
                  border: `1.5px solid ${s === '✓' ? '#7C5C3E66' : '#C9B99A'}`,
                }}>
                {s}
              </div>
            ))}
            <span className="ml-1 text-xs text-gold font-bold">🔥{h.streak}</span>
          </div>
        ))}
      </div>

      {/* Share text preview */}
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-2 uppercase">Share Message</p>
        <pre className="text-xs text-ink font-serif leading-relaxed whitespace-pre-wrap">{shareText}</pre>
      </div>

      {/* Action buttons */}
      <div className="px-4 flex flex-col gap-3">
        <button onClick={shareNative}
          className="w-full py-3.5 rounded-2xl font-bold text-white shadow-md text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ background: '#7C5C3E' }}>
          <span>📤</span> Share with Accountability Partner
        </button>
        <button onClick={copyText}
          className="w-full py-3 rounded-2xl font-semibold border text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: copied ? '#E8F5E9' : '#EDE4D3',
            borderColor: copied ? '#A5D6A7' : '#C9B99A',
            color: copied ? '#4A7C4E' : '#7C5C3E',
          }}>
          <span>{copied ? '✓' : '📋'}</span>
          {copied ? 'Copied to clipboard!' : 'Copy as Text'}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
