'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import { getDailyVerse, getDailyCatechism, getMcCheyneForDate } from '@/assets/catechism';
import { togglePassage, isPassageDone, getCatechismProgress, markMemorized, getPrayerEntries, addPrayerEntry } from '@/data/store';

const ACTS = ['adoration','confession','thanksgiving','supplication'];
const ACTS_LABELS = { adoration:'🙌 Adoration', confession:'💔 Confession', thanksgiving:'🙏 Thanksgiving', supplication:'📣 Supplication' };

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

  const handleMemorize = () => {
    markMemorized(catQ.q);
    setMemorized(true);
  };

  const handleSavePrayer = () => {
    if (!prayerText.trim()) return;
    const entry = addPrayerEntry({ body: prayerText.trim(), category: prayerCat });
    setPrayers(prev => [entry, ...prev]);
    setPrayerText('');
  };

  return (
    <main className="min-h-screen pb-24 bg-bg">
      <div className="px-6 pt-14 pb-2">
        <h1 className="text-3xl font-bold">Scripture</h1>
        <p className="text-muted text-sm mt-1">{format(today, 'EEEE, MMMM d')}</p>
      </div>

      {/* Verse of the Day */}
      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mt-4 mb-2">VERSE OF THE DAY</p>
      <div className="mx-4 rounded-2xl p-4 border mb-4" style={{ background: 'rgba(61,56,128,0.3)', borderColor: '#3D3880' }}>
        <p className="text-primary text-sm font-bold mb-2">{verse.ref}</p>
        <p className="text-white text-sm italic leading-relaxed">"{verse.text}"</p>
      </div>

      {/* Bible Reading Plan */}
      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">BIBLE READING — M'CHEYNE PLAN</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border mb-4">
        <p className="text-muted text-sm font-bold mb-3">M'Cheyne — Day {plan.day}</p>
        {plan.passages.map(p => (
          <button key={p} onClick={() => handleTogglePassage(p)}
            className="flex items-center gap-3 py-2 border-t border-border w-full text-left first:border-t-0">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
              ${passageDone[p] ? 'bg-primary border-primary text-white' : 'border-border'}`}>
              {passageDone[p] ? '✓' : ''}
            </div>
            <span className={`text-sm font-medium ${passageDone[p] ? 'text-faint line-through' : 'text-white'}`}>{p}</span>
          </button>
        ))}
      </div>

      {/* Catechism */}
      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">1689 CATECHISM — DAILY QUESTION</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border mb-4">
        <div className="flex justify-between items-start gap-2 mb-3">
          <p className="text-white font-semibold text-sm leading-relaxed">Q{catQ.q}. {catQ.question}</p>
          {memorized && <span className="text-base flex-shrink-0">⭐</span>}
        </div>
        {revealed ? (
          <>
            <p className="text-muted text-sm italic leading-relaxed mb-3">{catQ.answer}</p>
            {!memorized && (
              <button onClick={handleMemorize}
                className="w-full py-2 rounded-xl bg-surfaceAlt text-muted text-sm font-semibold hover:bg-primary/20 transition-colors">
                Mark as Memorized
              </button>
            )}
            {memorized && (
              <div className="w-full py-2 rounded-xl text-center text-green-400 text-sm font-semibold" style={{ background: 'rgba(76,175,80,0.15)' }}>
                ✓ Memorized
              </div>
            )}
          </>
        ) : (
          <button onClick={() => setRevealed(true)}
            className="w-full py-2 rounded-xl bg-primaryDim text-primary text-sm font-semibold hover:opacity-90 transition-opacity">
            Reveal Answer
          </button>
        )}
      </div>

      {/* Prayer Journal */}
      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">PRAYER JOURNAL (ACTS)</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border mb-4">
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {ACTS.map(c => (
            <button key={c} onClick={() => setPrayerCat(c)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ background: prayerCat === c ? '#6C63FF' : '#22222E', color: '#fff' }}>
              {ACTS_LABELS[c]}
            </button>
          ))}
        </div>
        <textarea
          className="w-full bg-surfaceAlt border border-border rounded-xl p-3 text-white text-sm resize-none outline-none focus:border-primary mb-3"
          rows={3}
          placeholder={`Write your ${prayerCat} prayer…`}
          value={prayerText}
          onChange={e => setPrayerText(e.target.value)}
        />
        <button onClick={handleSavePrayer}
          className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity">
          Save Prayer
        </button>
        {prayers.slice(0,3).map(e => (
          <div key={e.id} className="border-t border-border mt-3 pt-3">
            <p className="text-[10px] font-bold text-faint mb-1">{ACTS_LABELS[e.category]}</p>
            <p className="text-muted text-sm leading-relaxed">{e.body}</p>
          </div>
        ))}
      </div>

      {/* Family Worship */}
      <p className="text-[11px] font-semibold text-muted tracking-widest px-4 mb-2">FAMILY WORSHIP</p>
      <div className="bg-surface rounded-2xl mx-4 p-4 border border-border mb-4">
        {['📖 Read a passage aloud together','🙏 Pray as a household','🎵 Sing a Psalm or hymn'].map(item => (
          <p key={item} className="text-white text-sm py-1.5 leading-relaxed">{item}</p>
        ))}
        <p className="text-faint text-xs italic mt-2">"As for me and my house, we will serve the LORD." — Josh 24:15</p>
      </div>

      <BottomNav />
    </main>
  );
}
