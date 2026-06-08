'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import { getDailyVerse, getDailyCatechism, getMcCheyneForDate } from '@/assets/catechism';
import { togglePassage, isPassageDone, getCatechismProgress, markMemorized, getPrayerEntries, addPrayerEntry } from '@/data/store';

const ACTS = ['adoration', 'confession', 'thanksgiving', 'supplication'];
const ACTS_LABELS = {
  adoration: '🙌 Adoration',
  confession: '💔 Confession',
  thanksgiving: '🙏 Thanksgiving',
  supplication: '📣 Supplication',
};

export default function ScripturePage() {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const verse = getDailyVerse(today);
  const catQ = getDailyCatechism(today);
  const plan = getMcCheyneForDate(today);

  const [passageDone, setPassageDone] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [memorized, setMemorized] = useState(false);
  const [prayerCat, setPrayerCat] = useState('adoration');
  const [prayerText, setPrayerText] = useState('');
  const [prayers, setPrayers] = useState([]);

  useEffect(() => {
    const prog = getCatechismProgress();
    setMemorized(!!prog[catQ.q]);
    const done = {};
    plan.passages.forEach(p => { done[p] = isPassageDone(dateStr, p); });
    setPassageDone(done);
    setPrayers(getPrayerEntries().filter(e => e.date === dateStr));
  }, []);

  const handleTogglePassage = (passage) => {
    togglePassage(dateStr, passage);
    setPassageDone(prev => ({ ...prev, [passage]: !prev[passage] }));
  };

  const handleSavePrayer = () => {
    if (!prayerText.trim()) return;
    const entry = addPrayerEntry({ body: prayerText.trim(), category: prayerCat });
    setPrayers(prev => [entry, ...prev]);
    setPrayerText('');
  };

  return (
    <main className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-6 pt-14 pb-2">
        <p className="text-xs font-bold text-faint tracking-widest uppercase">The Word & Prayer</p>
        <h1 className="text-3xl font-bold text-ink font-serif">Scripture</h1>
        <p className="text-muted text-sm mt-1">{format(today, 'EEEE, MMMM d')}</p>
      </div>

      {/* Verse of the Day */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mt-4 mb-2 uppercase">Verse of the Day</p>
      <div className="mx-4 rounded-2xl p-5 border mb-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #F5E6C8, #EDD9AA)', borderColor: '#C4A060' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📜</span>
          <p className="text-sm font-bold" style={{ color: '#7C5C3E' }}>{verse.ref}</p>
        </div>
        <p className="text-base italic leading-relaxed" style={{ color: '#4A3020', fontFamily: 'Georgia, serif' }}>
          "{verse.text}"
        </p>
      </div>

      {/* Bible Reading Plan */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Bible Reading — M'Cheyne Plan</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📖</span>
          <p className="text-muted text-sm font-bold">Day {plan.day}</p>
        </div>
        {plan.passages.map(p => (
          <button key={p} onClick={() => handleTogglePassage(p)}
            className="flex items-center gap-3 py-2.5 border-t border-border w-full text-left first:border-t-0 hover:bg-surfaceAlt rounded-lg px-1 transition-colors">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
              ${passageDone[p] ? 'text-white' : 'border-border'}`}
              style={{ background: passageDone[p] ? '#7C5C3E' : 'transparent', borderColor: passageDone[p] ? '#7C5C3E' : '#C9B99A' }}>
              {passageDone[p] ? '✓' : ''}
            </div>
            <span className={`text-sm font-semibold ${passageDone[p] ? 'text-faint line-through' : 'text-ink'}`}>{p}</span>
          </button>
        ))}
      </div>

      {/* Catechism */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">1689 Catechism — Daily Question</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        <div className="flex justify-between items-start gap-2 mb-3">
          <p className="text-ink font-semibold text-sm leading-relaxed font-serif">Q{catQ.q}. {catQ.question}</p>
          {memorized && <span className="text-base flex-shrink-0">⭐</span>}
        </div>
        {revealed ? (
          <>
            <p className="text-muted text-sm italic leading-relaxed mb-3 font-serif">{catQ.answer}</p>
            {!memorized ? (
              <button onClick={() => { markMemorized(catQ.q); setMemorized(true); }}
                className="w-full py-2 rounded-xl text-sm font-semibold border border-border bg-surfaceAlt text-muted hover:bg-border transition-colors">
                Mark as Memorized
              </button>
            ) : (
              <div className="w-full py-2 rounded-xl text-center text-sm font-semibold border"
                style={{ background: '#E8F5E9', borderColor: '#A5D6A7', color: '#4A7C4E' }}>
                ✓ Memorized — Well done, faithful servant
              </div>
            )}
          </>
        ) : (
          <button onClick={() => setRevealed(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 text-white shadow-sm"
            style={{ background: '#7C5C3E' }}>
            Reveal Answer
          </button>
        )}
      </div>

      {/* Prayer Journal */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Prayer Journal — ACTS</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {ACTS.map(c => (
            <button key={c} onClick={() => setPrayerCat(c)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
              style={{
                background: prayerCat === c ? '#7C5C3E' : '#EDE4D3',
                color: prayerCat === c ? '#fff' : '#7A6251',
                borderColor: prayerCat === c ? '#7C5C3E' : '#C9B99A',
              }}>
              {ACTS_LABELS[c]}
            </button>
          ))}
        </div>
        <textarea
          className="w-full bg-bg border border-border rounded-xl p-3 text-ink text-sm resize-none outline-none focus:border-primary mb-3 placeholder-faint"
          rows={3}
          placeholder={`Write your ${prayerCat} prayer…`}
          value={prayerText}
          onChange={e => setPrayerText(e.target.value)}
          style={{ fontFamily: 'Georgia, serif' }}
        />
        <button onClick={handleSavePrayer}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: '#7C5C3E' }}>
          🙏 Save Prayer
        </button>
        {prayers.slice(0, 3).map(e => (
          <div key={e.id} className="border-t border-border mt-3 pt-3">
            <p className="text-[10px] font-bold text-faint mb-1 uppercase">{ACTS_LABELS[e.category]}</p>
            <p className="text-muted text-sm leading-relaxed italic font-serif">{e.body}</p>
          </div>
        ))}
      </div>

      {/* Family Worship */}
      <p className="text-[11px] font-bold text-muted tracking-widest px-4 mb-2 uppercase">Family Worship</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border shadow-sm mb-4">
        {['📖  Read a passage aloud together', '🙏  Pray as a household', '🎵  Sing a Psalm or hymn'].map(item => (
          <p key={item} className="text-ink text-sm py-2 leading-relaxed border-b border-border last:border-b-0">{item}</p>
        ))}
        <p className="text-faint text-xs italic mt-3 font-serif">
          "As for me and my house, we will serve the LORD." — Joshua 24:15
        </p>
      </div>

      <BottomNav />
    </main>
  );
}
