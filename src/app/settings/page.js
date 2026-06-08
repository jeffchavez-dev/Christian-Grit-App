'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { getSettings, saveSetting } from '@/data/store';

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className="w-12 h-7 rounded-full relative transition-colors flex-shrink-0"
      style={{ background: value ? '#6C63FF' : '#2A2A3A' }}>
      <span className="absolute w-5 h-5 bg-white rounded-full top-1 transition-all"
        style={{ left: value ? '26px' : '4px' }} />
    </button>
  );
}

function Row({ icon, label, subtitle, right }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0">
      <span className="text-lg w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{label}</p>
        {subtitle && <p className="text-faint text-xs mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState(null);

  useEffect(() => { setS(getSettings()); }, []);

  const update = (key, val) => {
    saveSetting(key, val);
    setS(prev => ({ ...prev, [key]: val }));
  };

  if (!s) return null;

  return (
    <main className="min-h-screen pb-24 bg-bg">
      <h1 className="text-3xl font-bold px-6 pt-14 pb-4">Settings</h1>

      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">APPEARANCE</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden mb-4">
        <Row icon="🎉" label="Confetti Animation" right={<Toggle value={s.confetti} onChange={v => update('confetti', v)} />} />
        <Row icon="🔥" label="Streaks"             right={<Toggle value={s.streaks}  onChange={v => update('streaks', v)} />} />
        <Row icon="❌" label="Negative Streaks"    right={<Toggle value={s.negStreaks} onChange={v => update('negStreaks', v)} />} />
      </div>

      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">GENERAL</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden mb-4">
        <Row icon="⏰" label="Day Starts At" right={<span className="text-muted text-sm">{s.dayStartsAt} ›</span>} />
        <Row icon="📅" label="Week Starts On" right={<span className="text-muted text-sm">Sunday ›</span>} />
        <Row icon="⛪" label="Lord's Day Mode" subtitle="Show Sunday worship banner"
          right={<Toggle value={s.lordDayMode} onChange={v => update('lordDayMode', v)} />} />
        <Row icon="🔔" label="Sounds" right={<Toggle value={s.sounds} onChange={v => update('sounds', v)} />} />
      </div>

      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">PROFILE</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden mb-4">
        <Row icon="👤" label="Name" right={<span className="text-muted text-sm">{s.userName} ›</span>} />
      </div>

      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">CHRISTIAN TOOLS</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden mb-4">
        <Row icon="📖" label="Bible Reading Plan" right={<span className="text-muted text-sm">{s.readingPlan} ›</span>} />
        <Row icon="✝️" label="Catechism"           right={<span className="text-muted text-sm">{s.catechism} ›</span>} />
        <Row icon="👨‍👩‍👧" label="Family Worship Log" right={<span className="text-muted text-sm">›</span>} />
      </div>

      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">DATA</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden mb-4">
        <Row icon="📦" label="Archived Habits"    right={<span className="text-muted text-sm">›</span>} />
        <Row icon="🏆" label="Achievements"       right={<span className="text-muted text-sm">›</span>} />
        <Row icon="☁️" label="iCloud Sync"        right={<span className="text-muted text-sm">Coming Soon ›</span>} />
        <Row icon="📋" label="Export for Analysis" right={<span className="text-muted text-sm">›</span>} />
        <Row icon="🔄" label="Fresh Start"        right={<span className="text-muted text-sm">›</span>} />
        <div className="flex items-center gap-4 px-4 py-3.5">
          <span className="text-lg w-7 text-center">🗑️</span>
          <button onClick={() => { if(confirm('Delete all data? This cannot be undone.')) { localStorage.clear(); window.location.reload(); }}}
            className="text-red-400 text-sm font-medium">Delete All Data</button>
        </div>
      </div>

      <p className="text-center text-faint text-xs mt-2">Grit App for Christian v1.0.0</p>
      <p className="text-center text-faint text-xs mb-4">Built for the glory of God</p>

      <BottomNav />
    </main>
  );
}
