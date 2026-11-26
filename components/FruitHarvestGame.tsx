'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface FruitHarvestGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface FruitItem {
  id: string;
  name: string;
  emoji: string;
  colorName: string;
  bgColor: string;
}

const FRUITS: FruitItem[] = [
  { id: '1', name: 'Apel Merah', emoji: '🍎', colorName: 'Merah', bgColor: 'bg-rose-100 border-rose-400' },
  { id: '2', name: 'Pisang Kuning', emoji: '🍌', colorName: 'Kuning', bgColor: 'bg-amber-100 border-amber-400' },
  { id: '3', name: 'Jeruk Jingga', emoji: '🍊', colorName: 'Jingga', bgColor: 'bg-orange-100 border-orange-400' },
  { id: '4', name: 'Anggur Ungu', emoji: '🍇', colorName: 'Ungu', bgColor: 'bg-purple-100 border-purple-400' },
];

export default function FruitHarvestGame({ childName, onBack, onCompleteRound }: FruitHarvestGameProps) {
  const totalRounds = 5;

  const getRandomFruit = () => FRUITS[Math.floor(Math.random() * FRUITS.length)];
  const getShuffledOptions = () => [...FRUITS].sort(() => Math.random() - 0.5);

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetFruit, setTargetFruit] = useState<FruitItem>(getRandomFruit);
  const [options, setOptions] = useState<FruitItem[]>(getShuffledOptions);
  const [feedback, setFeedback] = useState('Ayo petik buah sesuai warna keranjang!');
  const [isFinished, setIsFinished] = useState(false);

  const startNewRound = (roundIdx: number) => {
    if (roundIdx >= totalRounds) {
      setIsFinished(true);
      soundManager.playCelebration();
      soundManager.speak(`Luar biasa ${childName}! Kamu berhasil memanen semua buah di kebun!`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCompleteRound();
      return;
    }

    const randomFruit = getRandomFruit();
    setTargetFruit(randomFruit);
    setOptions(getShuffledOptions());

    const promptText = `Cari buah ${randomFruit.name} warna ${randomFruit.colorName}!`;
    setFeedback(promptText);
    soundManager.speak(promptText);
  };

  const handleSelectFruit = (selected: FruitItem) => {
    if (selected.id === targetFruit.id) {
      soundManager.playSuccess();
      soundManager.speak('Benar sekali! Pintar!');
      setScore((prev) => prev + 10);
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setFeedback('🎉 Yeay! Benar!');

      setTimeout(() => {
        startNewRound(nextRound);
      }, 1200);
    } else {
      soundManager.playPop();
      soundManager.speak(`Itu ${selected.name}, ayo cari ${targetFruit.name}!`);
      setFeedback(`❌ Ups! Itu ${selected.name}. Cari ${targetFruit.name} ya!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-400 via-pink-400 to-amber-400 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-2 bg-white/95 text-slate-700 hover:bg-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Keluar</span>
        </button>

        <div className="bg-white/95 px-6 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-center font-bold text-slate-800">
          <span>Skor: {score} 🌟</span> (Ronde {Math.min(currentRound + 1, totalRounds)}/{totalRounds})
        </div>

        <button
          onClick={() => soundManager.speak(feedback)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-rose-600 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Ulangi Suara</span>
        </button>
      </div>

      {/* Main Game Box */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            {/* Target Banner */}
            <div className="mb-6 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 inline-block">
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-600 block mb-1">
                Keranjang Hari Ini:
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
                <span className="text-5xl">{targetFruit.emoji}</span>
                <span>Cari: {targetFruit.name}</span>
              </div>
            </div>

            {/* Feedback Message */}
            <div className="text-lg sm:text-xl font-bold text-slate-700 mb-8 min-h-[3rem] flex items-center justify-center">
              {feedback}
            </div>

            {/* Fruit Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {options.map((fruit) => (
                <button
                  key={fruit.id}
                  onClick={() => handleSelectFruit(fruit)}
                  className={`${fruit.bgColor} border-4 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group`}
                >
                  <span className="text-6xl sm:text-7xl mb-3 group-hover:scale-110 transition-transform drop-shadow-md">
                    {fruit.emoji}
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                    {fruit.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300 animate-fade-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">Hore, Hebat Sekali!</h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil menyelesaikan Panen Buah dan mendapatkan stiker bintang emas!
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
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
