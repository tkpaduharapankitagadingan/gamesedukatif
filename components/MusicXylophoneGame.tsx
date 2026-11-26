'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Music, Play } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface MusicXylophoneGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface MusicalKey {
  id: number;
  solfege: string;
  note: string;
  freq: number;
  color: string;
  activeColor: string;
  emoji: string;
}

const KEYS: MusicalKey[] = [
  { id: 1, solfege: 'Do', note: '1', freq: 261.63, color: 'bg-rose-500 border-rose-700', activeColor: 'ring-4 ring-rose-300 scale-95', emoji: '🍓' },
  { id: 2, solfege: 'Re', note: '2', freq: 293.66, color: 'bg-orange-500 border-orange-700', activeColor: 'ring-4 ring-orange-300 scale-95', emoji: '🍊' },
  { id: 3, solfege: 'Mi', note: '3', freq: 329.63, color: 'bg-amber-400 border-amber-600', activeColor: 'ring-4 ring-amber-200 scale-95', emoji: '🍋' },
  { id: 4, solfege: 'Fa', note: '4', freq: 349.23, color: 'bg-emerald-500 border-emerald-700', activeColor: 'ring-4 ring-emerald-300 scale-95', emoji: '🍏' },
  { id: 5, solfege: 'Sol', note: '5', freq: 392.00, color: 'bg-teal-500 border-teal-700', activeColor: 'ring-4 ring-teal-300 scale-95', emoji: '🐬' },
  { id: 6, solfege: 'La', note: '6', freq: 440.00, color: 'bg-sky-500 border-sky-700', activeColor: 'ring-4 ring-sky-300 scale-95', emoji: '🦋' },
  { id: 7, solfege: 'Si', note: '7', freq: 493.88, color: 'bg-indigo-500 border-indigo-700', activeColor: 'ring-4 ring-indigo-300 scale-95', emoji: '🍇' },
  { id: 8, solfege: 'Do+', note: '1̇', freq: 523.25, color: 'bg-pink-500 border-pink-700', activeColor: 'ring-4 ring-pink-300 scale-95', emoji: '🌸' },
];

interface SongPattern {
  title: string;
  notes: number[]; // key IDs
  lyrics: string;
}

const SONGS: SongPattern[] = [
  {
    title: 'Tangga Nada Ceria (Do - Re - Mi)',
    notes: [1, 2, 3, 1],
    lyrics: 'Tekan nada: Do - Re - Mi - Do',
  },
  {
    title: 'Bintang Kecil (Bait Awal)',
    notes: [5, 6, 5, 3],
    lyrics: 'Tekan nada: Sol - La - Sol - Mi',
  },
  {
    title: 'Cicak di Dinding',
    notes: [5, 3, 5, 3],
    lyrics: 'Tekan nada: Sol - Mi - Sol - Mi',
  },
  {
    title: 'Pelangi Indah',
    notes: [1, 3, 5, 8],
    lyrics: 'Tekan nada: Do - Mi - Sol - Do Tinggi',
  },
];

export default function MusicXylophoneGame({
  childName,
  onBack,
  onCompleteRound,
}: MusicXylophoneGameProps) {
  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [songIdx, setSongIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [activeKeyId, setActiveKeyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('Ayo ikuti nada yang menyala di gambang musik!');
  const [isFinished, setIsFinished] = useState(false);

  const currentSong = SONGS[songIdx];
  const targetKeyId = currentSong ? currentSong.notes[stepIdx] : 1;

  const triggerKeyVisual = (id: number, freq: number) => {
    soundManager.playNote(freq, 0.55);
    setActiveKeyId(id);
    setTimeout(() => {
      setActiveKeyId((prev) => (prev === id ? null : prev));
    }, 280);
  };

  const playDemoSong = (song: SongPattern) => {
    song.notes.forEach((noteId, idx) => {
      const k = KEYS.find((item) => item.id === noteId);
      if (k) {
        setTimeout(() => {
          triggerKeyVisual(k.id, k.freq);
        }, idx * 450);
      }
    });
  };

  const handlePressKey = (key: MusicalKey) => {
    triggerKeyVisual(key.id, key.freq);

    if (mode === 'free') {
      setFeedback(`🎵 Nada ${key.solfege}! Merdu sekali suaranya!`);
      return;
    }

    // Guided melody mode
    if (key.id === targetKeyId) {
      const nextStep = stepIdx + 1;
      if (nextStep < currentSong.notes.length) {
        setStepIdx(nextStep);
        const nextKey = KEYS.find((k) => k.id === currentSong.notes[nextStep]);
        setFeedback(`🎵 Bagus! Sekarang tekan nada ${nextKey?.solfege}!`);
      } else {
        // Completed song!
        soundManager.playSuccess();
        setScore((prev) => prev + 25);
        const nextSongIdx = songIdx + 1;

        if (nextSongIdx >= SONGS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(`Hebat sekali ${childName}! Kamu pemusik cilik yang berbakat!`);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          soundManager.speak(`Lagu ${currentSong.title} selesai! Ayo lanjut lagu berikutnya!`);
          setFeedback(`🎉 Yeay! Lagu selesai! Lanjut lagu berikutnya...`);
          setTimeout(() => {
            setSongIdx(nextSongIdx);
            setStepIdx(0);
            setFeedback(SONGS[nextSongIdx].lyrics);
          }, 1200);
        }
      }
    } else {
      const targetKey = KEYS.find((k) => k.id === targetKeyId);
      setFeedback(`💡 Ayo tekan bilah warna nada ${targetKey?.solfege} (${targetKey?.emoji}) yang berkedip!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-fuchsia-500 to-amber-400 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-2 mb-6">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-2 bg-white/95 text-slate-700 hover:bg-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Portal Game</span>
        </button>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/95 rounded-2xl shadow-lg border-2 border-purple-200">
          <button
            onClick={() => {
              soundManager.playPop();
              setMode('guided');
              setFeedback('Ikuti nada yang berkedip untuk memainkan lagu!');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              mode === 'guided'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Tirukan Lagu ({songIdx + 1}/{SONGS.length})
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setMode('free');
              setFeedback('Mainkan gambang musik sesuka hatimu!');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
              mode === 'free'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎹 Main Bebas
          </button>
        </div>

        <button
          onClick={() => soundManager.speak(feedback)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-purple-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px]"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Suara</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-3">
              <Music className="w-4 h-4" />
              <span>KECERDASAN MUSIKAL · NADA & IRAMA</span>
            </div>

            {mode === 'guided' ? (
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
                  🎶 {currentSong.title}
                </h2>
                <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                  {currentSong.notes.map((nId, i) => {
                    const k = KEYS.find((item) => item.id === nId);
                    const isDone = i < stepIdx;
                    const isCurrent = i === stepIdx;
                    return (
                      <span
                        key={i}
                        className={`px-4 py-2 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all ${
                          isDone
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : isCurrent
                            ? 'bg-amber-200 border-amber-500 text-amber-950 scale-110 shadow-md animate-bounce'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {k?.solfege} {isDone ? '✓' : ''}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={() => playDemoSong(currentSong)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Dengarkan Contoh Lagu</span>
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">
                  🎹 Gambang Musik Ceria
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Sentuh bilah warna-warni di bawah untuk menciptakan musikmu sendiri!
                </p>
              </div>
            )}

            {/* Feedback Banner */}
            <div className="text-base sm:text-lg font-bold text-purple-900 bg-purple-50 border border-purple-200 rounded-2xl py-3 px-4 mb-6">
              {feedback}
            </div>

            {/* Xylophone Keys Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 items-end pt-2 pb-4">
              {KEYS.map((key) => {
                const isTarget = mode === 'guided' && key.id === targetKeyId;
                const isActive = activeKeyId === key.id;
                return (
                  <button
                    key={key.id}
                    onClick={() => handlePressKey(key)}
                    className={`${key.color} ${
                      isActive ? key.activeColor : ''
                    } ${
                      isTarget ? 'ring-4 ring-amber-300 animate-pulse' : ''
                    } text-white border-b-8 rounded-2xl py-6 sm:py-10 px-2 flex flex-col items-center justify-between shadow-xl hover:brightness-110 active:translate-y-1 transition-all cursor-pointer min-h-[120px] sm:min-h-[170px] relative`}
                  >
                    {isTarget && (
                      <span className="absolute -top-4 bg-amber-300 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                        TEKAN
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl">{key.emoji}</span>
                    <div className="my-2 w-3 h-3 rounded-full bg-white/60 shadow-inner" />
                    <div>
                      <div className="text-lg sm:text-xl font-extrabold tracking-tight">
                        {key.solfege}
                      </div>
                      <div className="text-xs opacity-85 font-bold tabular-nums">
                        Nada {key.note}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
              Pemusik Cilik Hebat!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil memainkan semua lagu di Gambang Musik Ceria! ({score} Poin)
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSongIdx(0);
                  setStepIdx(0);
                  setScore(0);
                  setIsFinished(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
              >
                Main Lagi 🔄
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all"
              >
                Pilih Game Lain 🏡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
