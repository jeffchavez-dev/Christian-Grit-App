'use client';
import { useEffect, useState } from 'react';

function scheduleLocalReminder(hour, minute, title, body) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-512.svg' });
    }
    scheduleLocalReminder(hour, minute, title, body); // reschedule daily
  }, delay);
}

export default function NotificationSetup() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      scheduleLocalReminder(6, 0,  '✝️ Morning Disciplines', 'Start your day with God — Read, Pray, Worship.');
      scheduleLocalReminder(20, 0, '🙏 Evening Prayer',      'End your day in prayer and reflection.');
      new Notification('✝️ Christian Grit', { body: 'Reminders set! God\'s mercies are new every morning.', icon: '/icon-512.svg' });
    }
  };

  if (permission === 'granted' || permission === 'denied') return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40">
      <div className="rounded-2xl p-4 border shadow-lg flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #F5E6C8, #EDD9AA)', borderColor: '#C4A060' }}>
        <span className="text-2xl flex-shrink-0">🔔</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">Enable Daily Reminders</p>
          <p className="text-xs text-muted">Morning & evening discipline reminders</p>
        </div>
        <button onClick={requestPermission}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
          style={{ background: '#7C5C3E' }}>
          Enable
        </button>
      </div>
    </div>
  );
}
