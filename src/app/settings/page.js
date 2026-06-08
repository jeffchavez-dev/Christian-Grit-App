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

function Row({ icon, label, subtitle, right, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0 w-full text-left transition-colors
        ${onClick ? 'hover:bg-surfaceAlt active:bg-border cursor-pointer' : ''}`}>
      <span className="text-lg w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-ink text-sm font-medium">{label}</p>
        {subtitle && <p className="text-faint text-xs mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </Tag>
  );
}

// Simple modal for picking from a list
function PickerModal({ title, options, current, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-end z-50" onClick={onClose}>
      <div className="bg-bg w-full rounded-t-3xl p-6 pb-10 border-t border-border" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-bold text-ink font-serif mb-4">{title}</h2>
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onSelect(opt.value); onClose(); }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all flex-shrink-0
                ${current === opt.value ? 'border-primary bg-amber-50' : 'border-border bg-surface hover:bg-surfaceAlt'}`}>
              <span className="text-ink text-sm font-medium">{opt.label}</span>
              {current === opt.value && <span className="text-primary font-bold">✓</span>}
            </button>
          ))}
        </div>
        <button className="w-full py-3 mt-4 text-muted text-sm font-semibold" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// Text input modal
function InputModal({ title, placeholder, current, onSave, onClose }) {
  const [val, setVal] = useState(current ?? '');
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-end z-50" onClick={onClose}>
      <div className="bg-bg w-full rounded-t-3xl p-6 pb-10 border-t border-border" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-bold text-ink font-serif mb-4">{title}</h2>
        <input autoFocus
          className="w-full bg-surface border border-border rounded-xl p-3 text-ink text-base outline-none focus:border-primary mb-4 placeholder-faint"
          placeholder={placeholder}
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <button className="w-full py-3 rounded-xl font-bold text-white shadow-sm hover:opacity-90 mb-2"
          style={{ background: '#7C5C3E' }}
          onClick={() => { onSave(val.trim()); onClose(); }}>
          Save
        </button>
        <button className="w-full py-2 text-muted text-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// Info modal for coming-soon features
function InfoModal({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 px-6" onClick={onClose}>
      <div className="bg-bg rounded-2xl p-6 border border-border shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-ink font-serif mb-2">{title}</h2>
        <p className="text-muted text-sm leading-relaxed mb-5">{message}</p>
        <button className="w-full py-2.5 rounded-xl font-bold text-white"
          style={{ background: '#7C5C3E' }} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [modal, setModal] = useState(null); // { type, ...props }

  useEffect(() => { setS(getSettings()); }, []);
  const update = (key, val) => { saveSetting(key, val); setS(prev => ({ ...prev, [key]: val })); };
  const close = () => setModal(null);

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
        <button onClick={() => setModal({ type: 'input', title: 'Your Name', placeholder: 'Enter your name', key: 'userName' })}
          className="mt-2 text-xs font-semibold px-3 py-1 rounded-full border"
          style={{ color: '#7C5C3E', borderColor: '#C4A060' }}>
          Edit Name
        </button>
      </div>

      {/* Appearance */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Appearance</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="🎉" label="Confetti on Completion" right={<Toggle value={s.confetti}   onChange={v => update('confetti', v)} />} />
        <Row icon="🔥" label="Show Streaks"           right={<Toggle value={s.streaks}    onChange={v => update('streaks', v)} />} />
        <Row icon="📉" label="Negative Streaks"       right={<Toggle value={s.negStreaks} onChange={v => update('negStreaks', v)} />} />
      </div>

      {/* General */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">General</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="⏰" label="Day Starts At" subtitle="When your new day begins"
          right={<span className="text-primary text-sm font-bold">{s.dayStartsAt} ›</span>}
          onClick={() => setModal({ type: 'picker', title: 'Day Starts At', key: 'dayStartsAt',
            options: Array.from({ length: 24 }, (_, i) => {
              const h = String(i).padStart(2, '0');
              return { value: `${h}:00`, label: `${h}:00` };
            }) })} />
        <Row icon="📅" label="Week Starts On"
          right={<span className="text-primary text-sm font-bold">{s.weekStartsOn ?? 'Sunday'} ›</span>}
          onClick={() => setModal({ type: 'picker', title: 'Week Starts On', key: 'weekStartsOn',
            options: ['Sunday','Monday'].map(v => ({ label: v, value: v })) })} />
        <Row icon="⛪" label="Lord's Day Mode" subtitle="Show Sunday worship banner"
          right={<Toggle value={s.lordDayMode} onChange={v => update('lordDayMode', v)} />} />
        <Row icon="🔔" label="Sounds" right={<Toggle value={s.sounds} onChange={v => update('sounds', v)} />} />
      </div>

      {/* Christian Tools */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Christian Tools</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="📜" label="Bible Reading Plan"
          right={<span className="text-primary text-sm font-bold">{s.readingPlan} ›</span>}
          onClick={() => setModal({ type: 'picker', title: 'Bible Reading Plan', key: 'readingPlan',
            options: ["M'Cheyne", 'Horner', 'Chronological', 'NT in 90 Days'].map(v => ({ label: v, value: v })) })} />
        <Row icon="✝️" label="Catechism"
          right={<span className="text-primary text-sm font-bold">{s.catechism} ›</span>}
          onClick={() => setModal({ type: 'picker', title: 'Catechism', key: 'catechism',
            options: ['1689 LBC', 'Westminster Shorter', 'Westminster Larger', 'Heidelberg'].map(v => ({ label: v, value: v })) })} />
        <Row icon="👨‍👩‍👧" label="Family Worship"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => setModal({ type: 'info', title: 'Family Worship Log', message: 'Track your household devotions — Scripture reading, prayer, and singing together. Full family worship log coming soon.' })} />
        <Row icon="🧎" label="Prayer Reminders"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => setModal({ type: 'info', title: 'Prayer Reminders', message: 'Set daily reminders for morning and evening prayer. Notification support coming soon.' })} />
      </div>

      {/* Data */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Data</p>
      <div className="bg-surface rounded-2xl mx-4 border border-border overflow-hidden shadow-sm mb-4">
        <Row icon="🌿" label="Archived Disciplines"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => setModal({ type: 'info', title: 'Archived Disciplines', message: 'Disciplines you have archived will appear here. You can restore them at any time.' })} />
        <Row icon="🏅" label="Achievements"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => setModal({ type: 'info', title: 'Achievements', message: 'Milestone achievements for streaks, memorized catechism questions, and completed Bible readings. Coming soon.' })} />
        <Row icon="☁️" label="Sync"
          right={<span className="text-muted text-sm font-medium">Coming Soon ›</span>}
          onClick={() => setModal({ type: 'info', title: 'Cloud Sync', message: 'Sync your disciplines and progress across devices. iCloud and account-based sync coming soon.' })} />
        <Row icon="📋" label="Export Journal"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => {
            const data = { habits: localStorage.getItem('grit_habits'), completions: localStorage.getItem('grit_completions'), prayers: localStorage.getItem('grit_prayers') };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'christian-grit-export.json'; a.click();
          }} />
        <Row icon="🔄" label="Fresh Start" subtitle="Clear history, keep disciplines"
          right={<span className="text-primary text-sm font-bold">›</span>}
          onClick={() => { if (confirm('Clear all completion history? Your disciplines will remain.')) { localStorage.removeItem('grit_completions'); localStorage.removeItem('grit_prayers'); localStorage.removeItem('grit_reading'); localStorage.removeItem('grit_catechism'); window.location.reload(); } }} />
        <Row icon="🗑️" label="Delete All Data"
          right={<span className="text-red-500 text-sm font-bold">›</span>}
          onClick={() => { if (confirm('Delete ALL data permanently? This cannot be undone.')) { localStorage.clear(); window.location.reload(); } }} />
      </div>

      <div className="text-center pb-6">
        <p className="text-faint text-xs">Christian Grit v1.0.0</p>
        <p className="text-faint text-xs italic mt-1">"Whatever you do, do all to the glory of God." — 1 Cor 10:31</p>
      </div>

      {/* Modals */}
      {modal?.type === 'picker' && (
        <PickerModal
          title={modal.title}
          options={modal.options}
          current={s[modal.key]}
          onSelect={v => update(modal.key, v)}
          onClose={close}
        />
      )}
      {modal?.type === 'input' && (
        <InputModal
          title={modal.title}
          placeholder={modal.placeholder}
          current={s[modal.key]}
          onSave={v => { if (v) update(modal.key, v); }}
          onClose={close}
        />
      )}
      {modal?.type === 'info' && (
        <InfoModal title={modal.title} message={modal.message} onClose={close} />
      )}

      <BottomNav />
    </main>
  );
}
