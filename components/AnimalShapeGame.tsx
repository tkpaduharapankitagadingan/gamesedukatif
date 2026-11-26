'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface AnimalShapeGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
  shapeHint: string;
}

const ANIMALS: AnimalItem[] = [
  { id: '1', name: 'Kelinci', emoji: '🐰', shapeHint: 'Telinga Panjang' },
  { id: '2', name: 'Bebek', emoji: '🦆', shapeHint: 'Paruh Kuning' },
  { id: '3', name: 'Kupu-kupu', emoji: '🦋', shapeHint: 'Sayap Indah' },
  { id: '4', name: 'Siput', emoji: '🐌', shapeHint: 'Cangkang Bundar' },
];

export default function AnimalShapeGame({ childName, onBack, onCompleteRound }: AnimalShapeGameProps) {
  const totalRounds = 5;

  const getRandomAnimal = () => ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const getShuffledAnimals = () => [...ANIMALS].sort(() => Math.random() - 0.5);

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState<AnimalItem>(getRandomAnimal);
  const [options, setOptions] = useState<AnimalItem[]>(getShuffledAnimals);
  const [feedback, setFeedback] = useState('Cocokkan hewan dengan bentuk bayangannya!');
  const [isFinished, setIsFinished] = useState(false);

  const startNewRound = (roundIdx: number) => {
    if (roundIdx >= totalRounds) {
      setIsFinished(true);
      soundManager.playCelebration();
      soundManager.speak(`Hebat ${childName}! Kamu berhasil mencocokkan semua hewan di kebun.`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCompleteRound();
      return;
    }

    const randomAnimal = getRandomAnimal();
    setTargetAnimal(randomAnimal);
    setOptions(getShuffledAnimals());

    const promptText = `Mana hewan ${randomAnimal.name} yang bersembunyi?`;
    setFeedback(promptText);
    soundManager.speak(promptText);
  };

  const handleSelectAnimal = (selected: AnimalItem) => {
    if (selected.id === targetAnimal.id) {
      soundManager.playSuccess();
      soundManager.speak(`Benar! Itu adalah ${targetAnimal.name}! Pintar sekali!`);
      setScore((prev) => prev + 10);
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setFeedback(`🎉 Yeay! Itu ${targetAnimal.name}!`);

      setTimeout(() => {
        startNewRound(nextRound);
      }, 1200);
    } else {
      soundManager.playPop();
      soundManager.speak(`Itu ${selected.name}, ayo cari ${targetAnimal.name}!`);
      setFeedback(`❌ Ups! Itu ${selected.name}. Cari ${targetAnimal.name} ya!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-teal-400 to-emerald-500 flex flex-col p-4 sm:p-8">
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
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-sky-600 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Ulangi Suara</span>
        </button>
      </div>

      {/* Main Game Box */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            {/* Target Silhouette Hint */}
            <div className="mb-6 bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 inline-block">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 block mb-1">
                Cari Bayangan:
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
                <span className="text-6xl bg-slate-100 p-3 rounded-2xl border-2 border-dashed border-slate-400 shadow-inner">
                  👤
                </span>
                <div className="text-left">
                  <div className="text-2xl text-emerald-700 font-bold">{targetAnimal.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{targetAnimal.shapeHint}</div>
                </div>
              </div>
            </div>

            {/* Feedback Message */}
            <div className="text-lg sm:text-xl font-bold text-slate-700 mb-8 min-h-[3rem] flex items-center justify-center">
              {feedback}
            </div>

            {/* Animal Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {options.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSelectAnimal(animal)}
                  className="bg-sky-50 hover:bg-sky-100 border-4 border-sky-300 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <span className="text-6xl sm:text-7xl mb-3 group-hover:scale-110 transition-transform drop-shadow-md">
                    {animal.emoji}
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                    {animal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300 animate-fade-in">
            <div className="text-6xl mb-4">🐰</div>
            <h2 className="text-3xl font-extrabold text-sky-700 mb-2">Hore, Hebat Sekali!</h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil mencocokkan semua bentuk hewan!
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
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
