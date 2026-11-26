'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, BookOpen } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface AlphabetSafariGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface VocabCard {
  letter: string;
  word: string;
  emoji: string;
  sentence: string;
  color: string;
}

const VOCAB_BANK: VocabCard[] = [
  { letter: 'A', word: 'Apel', emoji: '🍎', sentence: 'A untuk Apel merah yang manis', color: 'bg-rose-50 border-rose-400 text-rose-800' },
  { letter: 'B', word: 'Bola', emoji: '⚽', sentence: 'B untuk Bola bundar di lapangan', color: 'bg-sky-50 border-sky-400 text-sky-800' },
  { letter: 'G', word: 'Gajah', emoji: '🐘', sentence: 'G untuk Gajah bertelinga lebar', color: 'bg-indigo-50 border-indigo-400 text-indigo-800' },
  { letter: 'I', word: 'Ikan', emoji: '🐟', sentence: 'I untuk Ikan yang berenang di air', color: 'bg-cyan-50 border-cyan-400 text-cyan-800' },
  { letter: 'K', word: 'Kelinci', emoji: '🐰', sentence: 'K untuk Kelinci yang suka wortel', color: 'bg-emerald-50 border-emerald-400 text-emerald-800' },
  { letter: 'M', word: 'Matahari', emoji: '☀️', sentence: 'M untuk Matahari bersinar terang', color: 'bg-amber-50 border-amber-400 text-amber-800' },
  { letter: 'P', word: 'Pisang', emoji: '🍌', sentence: 'P untuk Pisang warna kuning', color: 'bg-yellow-50 border-yellow-400 text-yellow-800' },
  { letter: 'S', word: 'Sapi', emoji: '🐮', sentence: 'S untuk Sapi penghasil susu sehat', color: 'bg-orange-50 border-orange-400 text-orange-800' },
];

export default function AlphabetSafariGame({
  childName,
  onBack,
  onCompleteRound,
}: AlphabetSafariGameProps) {
  const totalRounds = 5;

  const generateRoundData = () => {
    const shuffled = [...VOCAB_BANK].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
    return { target, choices };
  };

  const [initialData] = useState(generateRoundData);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetCard, setTargetCard] = useState<VocabCard>(initialData.target);
  const [options, setOptions] = useState<VocabCard[]>(initialData.choices);
  const [feedback, setFeedback] = useState(
    `Manakah huruf awal untuk kata "${initialData.target.word}"?`
  );
  const [isFinished, setIsFinished] = useState(false);

  const startNewRound = (roundIdx: number) => {
    if (roundIdx >= totalRounds) {
      setIsFinished(true);
      soundManager.playCelebration();
      soundManager.speak(`Pintar sekali ${childName}! Kamu hebat mengenal huruf dan kata!`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCompleteRound();
      return;
    }

    const { target, choices } = generateRoundData();
    setTargetCard(target);
    setOptions(choices);
    const prompt = `Cari huruf "${target.letter}" untuk kata "${target.word}"!`;
    setFeedback(prompt);
    soundManager.speak(prompt);
  };

  const handleSelectOption = (item: VocabCard) => {
    if (item.letter === targetCard.letter) {
      soundManager.playSuccess();
      soundManager.speak(`Benar! Huruf ${item.letter}. ${item.sentence}.`);
      setScore((prev) => prev + 10);
      const next = currentRound + 1;
      setCurrentRound(next);
      setFeedback(`🎉 Benar! ${item.letter} — ${item.word}!`);

      setTimeout(() => {
        startNewRound(next);
      }, 1500);
    } else {
      soundManager.playPop();
      soundManager.speak(
        `Itu huruf ${item.letter} untuk ${item.word}. Ayo cari huruf ${targetCard.letter} untuk ${targetCard.word}!`
      );
      setFeedback(`❌ Itu huruf ${item.letter} (${item.word}). Cari huruf ${targetCard.letter} ya!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-indigo-500 to-teal-400 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between mb-6">
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
          <span>Skor: {score} 🌟</span> · Ronde {Math.min(currentRound + 1, totalRounds)}/{totalRounds}
        </div>

        <button
          onClick={() => soundManager.speak(`${targetCard.sentence}. Cari huruf ${targetCard.letter}!`)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-indigo-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px]"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Dengar Kata</span>
        </button>
      </div>

      {/* Main Game Box */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <BookOpen className="w-4 h-4" />
              <span>KECERDASAN BAHASA · MENGENAL HURUF & SUARA</span>
            </div>

            {/* Target Word Card */}
            <div className="mb-6 bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-5 max-w-md mx-auto">
              <div className="text-6xl sm:text-7xl mb-2 animate-bounce">{targetCard.emoji}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-wide">
                <span className="text-indigo-600 underline decoration-4 underline-offset-4">
                  {targetCard.word[0]}
                </span>
                {targetCard.word.slice(1)}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {targetCard.sentence}
              </p>
            </div>

            {/* Feedback Message */}
            <div className="text-base sm:text-xl font-bold text-slate-700 mb-6 min-h-[2.5rem] flex items-center justify-center">
              {feedback}
            </div>

            {/* Letter Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {options.map((item) => (
                <button
                  key={item.letter}
                  onClick={() => handleSelectOption(item)}
                  className={`${item.color} border-4 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group min-h-[130px]`}
                >
                  <span className="text-5xl sm:text-6xl font-black mb-1 group-hover:scale-110 transition-transform">
                    {item.letter}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold opacity-80 flex items-center gap-1">
                    <span>{item.emoji}</span>
                    <span>{item.word}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
              Juara Huruf & Bahasa!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> pintar mengenal huruf awal dan kosakata Bahasa Indonesia!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setCurrentRound(0);
                  setScore(0);
                  setIsFinished(false);
                  startNewRound(0);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
