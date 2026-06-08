'use client';
import { useState } from 'react';
import { supabase, signInAnonymously, getCurrentUser, pushSync, pullSync } from '@/lib/supabase';

const SYNC_KEYS = ['grit_habits','grit_completions','grit_prayers','grit_reading','grit_catechism','grit_settings','grit_sermons'];

function collectData() {
  const out = {};
  SYNC_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) out[k] = v; });
  return out;
}

function applyData(data) {
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
}

export default function SyncButton() {
  const [status, setStatus] = useState('idle'); // idle | syncing | done | error | disabled

  if (!supabase) return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surfaceAlt border border-border text-xs text-faint">
      ☁️ Sync not configured
    </div>
  );

  const handleSync = async () => {
    setStatus('syncing');
    try {
      let user = await getCurrentUser();
      if (!user) user = await signInAnonymously();
      if (!user) { setStatus('error'); return; }

      const remote = await pullSync(user.id);
      const local = collectData();

      if (remote) {
        const remoteData = JSON.parse(remote.payload);
        const localTime = parseInt(localStorage.getItem('grit_last_sync') ?? '0');
        const remoteTime = new Date(remote.updated_at).getTime();

        if (remoteTime > localTime) {
          // Remote is newer — merge completions (union), prefer remote habits
          const merged = { ...remoteData };
          // Merge completions: union of both
          try {
            const lc = JSON.parse(local.grit_completions || '{}');
            const rc = JSON.parse(remoteData.grit_completions || '{}');
            merged.grit_completions = JSON.stringify({ ...rc, ...lc });
          } catch {}
          applyData(merged);
        }
      }

      await pushSync(user.id, local);
      localStorage.setItem('grit_last_sync', Date.now().toString());
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button onClick={handleSync} disabled={status === 'syncing'}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all"
      style={{
        background: status === 'done' ? '#E8F5E9' : status === 'error' ? '#FFEBEE' : '#EDE4D3',
        borderColor: status === 'done' ? '#A5D6A7' : status === 'error' ? '#FFCDD2' : '#C9B99A',
        color: status === 'done' ? '#4A7C4E' : status === 'error' ? '#C62828' : '#7C5C3E',
      }}>
      <span>{status === 'syncing' ? '⏳' : status === 'done' ? '✓' : status === 'error' ? '✗' : '☁️'}</span>
      <span>{status === 'syncing' ? 'Syncing…' : status === 'done' ? 'Synced' : status === 'error' ? 'Sync failed' : 'Sync'}</span>
    </button>
  );
}
