'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Puzzle } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface PatternTrainGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface TrainPuzzle {
  id: number;
  title: string;
  sequence: { emoji: string; label: string }[];
  missingIndex: number;
  answer: { emoji: string; label: string };
  options: { emoji: string; label: string }[];
  hint: string;
}

const PUZZLES: TrainPuzzle[] = [
  {
    id: 1,
    title: 'Pola Selang-Seling Buah',
    sequence: [
      { emoji: '🍎', label: 'Apel' },
      { emoji: '🍌', label: 'Pisang' },
      { emoji: '🍎', label: 'Apel' },
      { emoji: '❓', label: '?' },
    ],
    missingIndex: 3,
    answer: { emoji: '🍌', label: 'Pisang' },
    options: [
      { emoji: '🍌', label: 'Pisang' },
      { emoji: '🍎', label: 'Apel' },
      { emoji: '🍇', label: 'Anggur' },
    ],
    hint: 'Apel, Pisang, Apel... setelah Apel adalah Pisang!',
  },
  {
    id: 2,
    title: 'Pola Langit Cerah',
    sequence: [
      { emoji: '☀️', label: 'Matahari' },
      { emoji: '☁️', label: 'Awan' },
      { emoji: '☀️', label: 'Matahari' },
      { emoji: '❓', label: '?' },
    ],
    missingIndex: 3,
    answer: { emoji: '☁️', label: 'Awan' },
    options: [
      { emoji: '☀️', label: 'Matahari' },
      { emoji: '☁️', label: 'Awan' },
      { emoji: '🌙', label: 'Bulan' },
    ],
    hint: 'Matahari, Awan, Matahari... selanjutnya adalah Awan!',
  },
  {
    id: 3,
    title: 'Pola Warna Lingkaran',
    sequence: [
      { emoji: '🔴', label: 'Merah' },
      { emoji: '🔵', label: 'Biru' },
      { emoji: '🔴', label: 'Merah' },
      { emoji: '❓', label: '?' },
    ],
    missingIndex: 3,
    answer: { emoji: '🔵', label: 'Biru' },
    options: [
      { emoji: '🟢', label: 'Hijau' },
      { emoji: '🔴', label: 'Merah' },
      { emoji: '🔵', label: 'Biru' },
    ],
    hint: 'Merah, Biru, Merah... selanjutnya warna Biru!',
  },
  {
    id: 4,
    title: 'Pola Dua-Satu Taman',
    sequence: [
      { emoji: '🌻', label: 'Bunga' },
      { emoji: '🌻', label: 'Bunga' },
      { emoji: '🦋', label: 'Kupu-kupu' },
      { emoji: '🌻', label: 'Bunga' },
      { emoji: '🌻', label: 'Bunga' },
      { emoji: '❓', label: '?' },
    ],
    missingIndex: 5,
    answer: { emoji: '🦋', label: 'Kupu-kupu' },
    options: [
      { emoji: '🦋', label: 'Kupu-kupu' },
      { emoji: '🌻', label: 'Bunga' },
      { emoji: '🐝', label: 'Lebah' },
    ],
    hint: 'Bunga, Bunga, Kupu-kupu... Bunga, Bunga, lalu Kupu-kupu!',
  },
  {
    id: 5,
    title: 'Pola Hewan Sahabat',
    sequence: [
      { emoji: '🐰', label: 'Kelinci' },
      { emoji: '🦆', label: 'Bebek' },
      { emoji: '🐱', label: 'Kucing' },
      { emoji: '🐰', label: 'Kelinci' },
      { emoji: '🦆', label: 'Bebek' },
      { emoji: '❓', label: '?' },
    ],
    missingIndex: 5,
    answer: { emoji: '🐱', label: 'Kucing' },
    options: [
      { emoji: '🐰', label: 'Kelinci' },
      { emoji: '🐱', label: 'Kucing' },
      { emoji: '🦆', label: 'Bebek' },
    ],
    hint: 'Kelinci, Bebek, Kucing... setelah Bebek adalah Kucing!',
  },
];

export default function PatternTrainGame({
  childName,
  onBack,
  onCompleteRound,
}: PatternTrainGameProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [filledAnswer, setFilledAnswer] = useState<{ emoji: string; label: string } | null>(null);
  const [feedback, setFeedback] = useState(PUZZLES[0].hint);
  const [isFinished, setIsFinished] = useState(false);

  const currentPuzzle = PUZZLES[roundIdx];

  const handleChooseOption = (option: { emoji: string; label: string }) => {
    if (filledAnswer) return;

    if (option.label === currentPuzzle.answer.label) {
      soundManager.playSuccess();
      setFilledAnswer(option);
      setScore((prev) => prev + 10);
      soundManager.speak(`Tut tut! Benar sekali! Gerbong terisi dengan ${option.label}!`);
      setFeedback(`🚂 Tut-tuuut! Kereta siap berangkat membawa ${option.label}!`);

      setTimeout(() => {
        const nextIdx = roundIdx + 1;
        if (nextIdx >= PUZZLES.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Hebat sekali ${childName}! Semua kereta pola logika berhasil berangkat!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setRoundIdx(nextIdx);
          setFilledAnswer(null);
          setFeedback(PUZZLES[nextIdx].hint);
          soundManager.speak(PUZZLES[nextIdx].hint);
        }
      }, 1400);
    } else {
      soundManager.playPop();
      soundManager.speak(`Belum tepat. ${currentPuzzle.hint}`);
      setFeedback(`❌ Belum tepat. Perhatikan urutan gerbongnya: ${currentPuzzle.hint}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 via-amber-500 to-rose-500 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6">
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

        <div className="bg-white/95 px-5 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-center font-bold text-slate-800 tabular-nums text-sm sm:text-base">
          <span>Skor: {score} 🌟</span> · Kereta {roundIdx + 1}/{PUZZLES.length}
        </div>

        <button
          onClick={() => soundManager.speak(currentPuzzle.hint)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-orange-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px]"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Petunjuk</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-3">
              <Puzzle className="w-4 h-4" />
              <span>KECERDASAN LOGIKA MATEMATIKA · KERETA POLA</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
              🚂 {currentPuzzle.title}
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-600 mb-6">
              {feedback}
            </p>

            {/* Train Track & Cars Display */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 mb-8 overflow-x-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-max mx-auto">
                {/* Locomotive */}
                <div className="bg-rose-500 text-white rounded-2xl p-3 sm:p-4 border-b-4 border-rose-700 shadow-md flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl">🚂</span>
                  <span className="text-[10px] font-extrabold uppercase mt-1">Lokomotif</span>
                </div>

                {/* Cargo Cars */}
                {currentPuzzle.sequence.map((car, idx) => {
                  const isMissing = idx === currentPuzzle.missingIndex;
                  const displayItem = isMissing && filledAnswer ? filledAnswer : car;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-3 sm:p-4 border-4 min-w-[78px] sm:min-w-[96px] flex flex-col items-center justify-center transition-all ${
                        isMissing
                          ? filledAnswer
                            ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-lg'
                            : 'bg-white border-dashed border-orange-500 animate-pulse shadow-inner'
                          : 'bg-white border-amber-300 shadow-sm'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1">{displayItem.emoji}</span>
                      <span className="text-xs font-extrabold text-slate-700">
                        {displayItem.label}
                      </span>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Answer Choices */}
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Pilih Muatan untuk Gerbong Kosong (❓):
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {currentPuzzle.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChooseOption(opt)}
                  className="bg-orange-50 hover:bg-orange-100 border-4 border-orange-300 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer min-h-[120px]"
                >
                  <span className="text-5xl sm:text-6xl mb-2">{opt.emoji}</span>
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🚂</div>
            <h2 className="text-3xl font-extrabold text-orange-700 mb-2">
              Masinis Logika Hebat!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil melengkapi semua urutan gerbong Kereta Pola & Logika!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setRoundIdx(0);
                  setScore(0);
                  setFilledAnswer(null);
                  setIsFinished(false);
                  setFeedback(PUZZLES[0].hint);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
