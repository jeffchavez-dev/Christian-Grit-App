'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { getSettings, saveSetting } from '@/data/store';

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className="w-12 h-7 rounded-full relative transition-all flex-shrink-0 shadow-inner"
      style={{ background: value ? '#7C5C3E' : '#C9B99A' }}>
      <span className="absolute w-5 h-5 bg-white rounded-full top-1 transition-all shadow-sm"
        style={{ left: value ? '26px' : '4px' }} />
    </button>
  );
}

function Row({ icon, label, subtitle, right }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0">
      <span className="text-lg w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-ink text-sm font-medium">{label}</p>
        {subtitle && <p className="text-faint text-xs mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState(null);
  useEffect(() => { setS(getSettings()); }, []);
  const update = (key, val) => { saveSetting(key, val); setS(prev => ({ ...prev, [key]: val })); };
  if (!s) return null;

  return (
    <main className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <p className="text-xs font-bold text-faint tracking-widest uppercase">Preferences</p>
        <h1 className="text-3xl font-bold text-ink font-serif">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 mb-5 rounded-2xl p-5 border shadow-sm text-center"
        style={{ background: 'linear-gradient(135deg, #F5E6C8, #EDD9AA)', borderColor: '#C4A060' }}>
        <div className="text-4xl mb-2">✝️</div>
        <p className="font-bold text-lg font-serif" style={{ color: '#4A3020' }}>{s.userName}</p>
        <p className="text-sm italic" style={{ color: '#7C5C3E' }}>"For the glory of God"</p>
      </div>

      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Appearance</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="🎉" label="Confetti on Completion" right={<Toggle value={s.confetti}   onChange={v => update('confetti', v)} />} />
        <Row icon="🔥" label="Show Streaks"           right={<Toggle value={s.streaks}    onChange={v => update('streaks', v)} />} />
        <Row icon="📉" label="Negative Streaks"       right={<Toggle value={s.negStreaks} onChange={v => update('negStreaks', v)} />} />
      </div>

      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">General</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="⏰" label="Day Starts At"  right={<span className="text-muted text-sm font-medium">{s.dayStartsAt} ›</span>} />
        <Row icon="📅" label="Week Starts On" right={<span className="text-muted text-sm font-medium">Sunday ›</span>} />
        <Row icon="⛪" label="Lord's Day Mode" subtitle="Show Sunday worship banner"
          right={<Toggle value={s.lordDayMode} onChange={v => update('lordDayMode', v)} />} />
        <Row icon="🔔" label="Sounds"         right={<Toggle value={s.sounds}    onChange={v => update('sounds', v)} />} />
      </div>

      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Christian Tools</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="📜" label="Bible Reading Plan" right={<span className="text-muted text-sm font-medium">{s.readingPlan} ›</span>} />
        <Row icon="✝️" label="Catechism"          right={<span className="text-muted text-sm font-medium">{s.catechism} ›</span>} />
        <Row icon="👨‍👩‍👧" label="Family Worship"   right={<span className="text-muted text-sm font-medium">›</span>} />
        <Row icon="🧎" label="Prayer Reminders"   right={<span className="text-muted text-sm font-medium">›</span>} />
      </div>

      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Data</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="🌿" label="Archived Disciplines" right={<span className="text-muted text-sm font-medium">›</span>} />
        <Row icon="🏅" label="Achievements"         right={<span className="text-muted text-sm font-medium">›</span>} />
        <Row icon="☁️" label="Sync"                 right={<span className="text-muted text-sm font-medium">Coming Soon ›</span>} />
        <Row icon="📋" label="Export Journal"       right={<span className="text-muted text-sm font-medium">›</span>} />
        <Row icon="🔄" label="Fresh Start"          right={<span className="text-muted text-sm font-medium">›</span>} />
        <div className="flex items-center gap-4 px-4 py-3.5">
          <span className="text-lg w-7 text-center">🗑️</span>
          <button
            onClick={() => { if (confirm('Delete all data? This cannot be undone.')) { localStorage.clear(); window.location.reload(); } }}
            className="text-red-600 text-sm font-semibold hover:text-red-800 transition-colors">
            Delete All Data
          </button>
        </div>
      </div>

      <div className="text-center pb-6">
        <p className="text-faint text-xs">Christian Grit v1.0.0</p>
        <p className="text-faint text-xs italic mt-1">"Whatever you do, do all to the glory of God." — 1 Cor 10:31</p>
      </div>

      <BottomNav />
    </main>
  );
}
