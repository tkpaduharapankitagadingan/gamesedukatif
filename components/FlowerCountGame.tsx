'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface FlowerCountGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

export default function FlowerCountGame({ childName, onBack, onCompleteRound }: FlowerCountGameProps) {
  const totalRounds = 5;

  const getRandomCount = () => Math.floor(Math.random() * 5) + 1;
  const getShuffledNums = () => [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetCount, setTargetCount] = useState<number>(getRandomCount);
  const [options, setOptions] = useState<number[]>(getShuffledNums);
  const [feedback, setFeedback] = useState('Hitung berapa jumlah bunga di kebun!');
  const [isFinished, setIsFinished] = useState(false);

  const startNewRound = (roundIdx: number) => {
    if (roundIdx >= totalRounds) {
      setIsFinished(true);
      soundManager.playCelebration();
      soundManager.speak(`Hebat ${childName}! Kamu pintar menghitung bunga di kebun.`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCompleteRound();
      return;
    }

    setTargetCount(getRandomCount());
    setOptions(getShuffledNums());

    const promptText = `Berapa jumlah bunga di kebun? Ayo hitung bersama!`;
    setFeedback(promptText);
    soundManager.speak(promptText);
  };

  const handleSelectNumber = (num: number) => {
    if (num === targetCount) {
      soundManager.playSuccess();
      soundManager.speak(`Benar! Jumlahnya ada ${targetCount}. Pintar sekali!`);
      setScore((prev) => prev + 10);
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setFeedback(`🎉 Yeay! Benar, ada ${targetCount} bunga!`);

      setTimeout(() => {
        startNewRound(nextRound);
      }, 1300);
    } else {
      soundManager.playPop();
      soundManager.speak(`Belum tepat. Coba hitung lagi bunganya satu per satu!`);
      setFeedback(`❌ Belum tepat. Coba hitung lagi ya!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 via-orange-400 to-yellow-500 flex flex-col p-4 sm:p-8">
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
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-amber-600 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Ulangi Suara</span>
        </button>
      </div>

      {/* Main Game Box */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            {/* Feedback Message */}
            <div className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
              {feedback}
            </div>

            {/* Flowers Display Area */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-8 flex flex-wrap items-center justify-center gap-4 min-h-[140px]">
              {Array.from({ length: targetCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-white rounded-2xl border-2 border-amber-300 shadow-md flex items-center justify-center text-5xl animate-bounce duration-1000"
                >
                  🌻
                </div>
              ))}
            </div>

            {/* Number Options Grid */}
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              {options.map((num) => (
                <button
                  key={num}
                  onClick={() => handleSelectNumber(num)}
                  className="bg-gradient-to-b from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-4 border-amber-400 rounded-2xl py-4 sm:py-6 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-3xl sm:text-4xl font-extrabold text-amber-900"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300 animate-fade-in">
            <div className="text-6xl mb-4">🌻</div>
            <h2 className="text-3xl font-extrabold text-amber-700 mb-2">Hebat, Pintar Menghitung!</h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil menghitung semua bunga di kebun!
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
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
