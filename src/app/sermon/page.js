'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BottomNav from '@/components/BottomNav';

function load(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const EMPTY_NOTE = { id: null, date: '', preacher: '', church: '', text: '', scripture: '', title: '' };

export default function SermonPage() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(null); // null = list view, object = edit/new
  const [viewNote, setViewNote] = useState(null);

  useEffect(() => { setNotes(load('grit_sermons', [])); }, []);

  const saveNote = () => {
    if (!form.scripture.trim() && !form.notes?.trim()) return;
    const updated = form.id
      ? notes.map(n => n.id === form.id ? { ...form } : n)
      : [{ ...form, id: Date.now(), date: form.date || format(new Date(), 'yyyy-MM-dd') }, ...notes];
    save('grit_sermons', updated);
    setNotes(updated);
    setForm(null);
  };

  const deleteNote = (id) => {
    if (!confirm('Delete this sermon note?')) return;
    const updated = notes.filter(n => n.id !== id);
    save('grit_sermons', updated);
    setNotes(updated);
    setViewNote(null);
  };

  // ── Form view ────────────────────────────────────────────────────────────
  if (form !== null) {
    return (
      <main className="min-h-screen pb-24 bg-bg">
        <div className="flex items-center gap-3 px-4 pt-14 pb-4">
          <button onClick={() => setForm(null)} className="text-primary font-semibold text-sm">‹ Back</button>
          <h1 className="text-xl font-bold text-ink font-serif flex-1 text-center">
            {form.id ? 'Edit Note' : 'New Sermon Note'}
          </h1>
          <button onClick={saveNote} className="text-primary font-bold text-sm">Save</button>
        </div>

        <div className="px-4 flex flex-col gap-3">
          <Field label="Date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))}
            type="date" placeholder={format(new Date(), 'yyyy-MM-dd')} />
          <Field label="Preacher" value={form.preacher} onChange={v => setForm(f => ({ ...f, preacher: v }))}
            placeholder="e.g. Pastor John" />
          <Field label="Church" value={form.church} onChange={v => setForm(f => ({ ...f, church: v }))}
            placeholder="e.g. First Baptist Church" />
          <Field label="Sermon Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))}
            placeholder="e.g. The Sovereignty of God" />
          <Field label="Scripture Text" value={form.scripture} onChange={v => setForm(f => ({ ...f, scripture: v }))}
            placeholder="e.g. Romans 8:28-30" />
          <div>
            <p className="text-[11px] font-bold text-muted tracking-widest mb-1 uppercase">Notes</p>
            <textarea
              className="w-full bg-surface border border-border rounded-xl p-3 text-ink text-sm resize-none outline-none focus:border-primary placeholder-faint"
              rows={10}
              placeholder="Write your sermon notes here…"
              style={{ fontFamily: 'Georgia, serif' }}
              value={form.notes ?? ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  // ── Detail view ──────────────────────────────────────────────────────────
  if (viewNote !== null) {
    const n = notes.find(x => x.id === viewNote);
    if (!n) { setViewNote(null); return null; }
    return (
      <main className="min-h-screen pb-24 bg-bg">
        <div className="flex items-center gap-3 px-4 pt-14 pb-4">
          <button onClick={() => setViewNote(null)} className="text-primary font-semibold text-sm">‹ Back</button>
          <h1 className="text-xl font-bold text-ink font-serif flex-1 text-center truncate">{n.title || 'Sermon Note'}</h1>
          <button onClick={() => setForm({ ...n })} className="text-primary font-bold text-sm">Edit</button>
        </div>

        <div className="px-4">
          <div className="bg-surface rounded-2xl p-4 border mb-4 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #F5E6C8, #EDD9AA)', borderColor: '#C4A060' }}>
            <p className="text-xs font-bold text-muted mb-1 uppercase">📜 Scripture</p>
            <p className="text-ink font-bold text-lg font-serif">{n.scripture || '—'}</p>
            {n.title && <p className="text-muted text-sm mt-1 italic">"{n.title}"</p>}
          </div>

          <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-faint">{n.preacher && `🎙 ${n.preacher}`}</span>
              <span className="text-faint">{n.church && `⛪ ${n.church}`}</span>
            </div>
            <div className="flex justify-between text-xs text-faint border-t border-border pt-2">
              <span>{n.date ? format(new Date(n.date + 'T00:00:00'), 'EEEE, MMMM d, yyyy') : ''}</span>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm mb-4">
            <p className="text-[11px] font-bold text-muted tracking-widest mb-3 uppercase">Notes</p>
            <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap font-serif">{n.notes || 'No notes recorded.'}</p>
          </div>

          <button onClick={() => deleteNote(n.id)}
            className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-semibold bg-red-50 hover:bg-red-100 transition-colors">
            Delete Note
          </button>
        </div>
        <BottomNav />
      </main>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pb-24 bg-bg">
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <div>
          <p className="text-xs font-bold text-faint tracking-widest uppercase">Lord's Day</p>
          <h1 className="text-3xl font-bold text-ink font-serif">Sermon Notes</h1>
        </div>
        <button onClick={() => setForm({ ...EMPTY_NOTE })}
          className="w-10 h-10 rounded-full bg-primary text-white text-2xl flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
          +
        </button>
      </div>

      <p className="text-center text-faint text-xs italic px-8 mb-4">
        "Preach the word; be ready in season and out of season." — 2 Tim 4:2
      </p>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center mt-20 gap-3">
          <span className="text-5xl">⛪</span>
          <p className="text-muted font-semibold">No sermon notes yet.</p>
          <p className="text-faint text-sm text-center px-8">Tap + to record notes from this Sunday's sermon.</p>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3">
          {notes.map(n => (
            <button key={n.id} onClick={() => setViewNote(n.id)}
              className="bg-surface rounded-2xl p-4 border border-border shadow-sm text-left hover:bg-surfaceAlt transition-colors w-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-bold text-ink font-serif text-base leading-snug">{n.title || 'Untitled Sermon'}</p>
                <span className="text-faint text-xs flex-shrink-0 mt-0.5">{n.date}</span>
              </div>
              {n.scripture && (
                <p className="text-primary text-xs font-bold mb-1">📜 {n.scripture}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-faint">
                {n.preacher && <span>🎙 {n.preacher}</span>}
                {n.church && <span>⛪ {n.church}</span>}
              </div>
              {n.notes && (
                <p className="text-muted text-xs mt-2 leading-relaxed line-clamp-2 italic font-serif">{n.notes}</p>
              )}
            </button>
          ))}
        </div>
      )}
      <BottomNav />
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-muted tracking-widest mb-1 uppercase">{label}</p>
      <input
        type={type}
        className="w-full bg-surface border border-border rounded-xl p-3 text-ink text-sm outline-none focus:border-primary placeholder-faint"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
