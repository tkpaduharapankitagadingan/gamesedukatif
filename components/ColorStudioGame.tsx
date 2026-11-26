'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Palette } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface ColorStudioGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface ColorMixLevel {
  id: number;
  targetName: string;
  targetObject: string;
  targetEmoji: string;
  colorA: { name: string; hex: string; emoji: string };
  colorB: { name: string; hex: string; emoji: string };
  resultColor: { name: string; bgClass: string; borderClass: string; emoji: string };
  options: { name: string; bgClass: string; borderClass: string; emoji: string }[];
  question: string;
}

const LEVELS: ColorMixLevel[] = [
  {
    id: 1,
    targetName: 'Jingga (Oranye)',
    targetObject: 'Buah Jeruk Manis',
    targetEmoji: '🍊',
    colorA: { name: 'Merah', hex: 'bg-rose-500', emoji: '🔴' },
    colorB: { name: 'Kuning', hex: 'bg-yellow-400', emoji: '🟡' },
    resultColor: {
      name: 'Jingga',
      bgClass: 'bg-orange-400 text-white',
      borderClass: 'border-orange-600',
      emoji: '🟠',
    },
    options: [
      { name: 'Jingga', bgClass: 'bg-orange-400 text-white', borderClass: 'border-orange-600', emoji: '🟠' },
      { name: 'Ungu', bgClass: 'bg-purple-500 text-white', borderClass: 'border-purple-700', emoji: '🟣' },
      { name: 'Biru', bgClass: 'bg-sky-500 text-white', borderClass: 'border-sky-700', emoji: '🔵' },
    ],
    question: 'Jika cat Merah dicampur cat Kuning untuk mewarnai Jeruk, menjadi warna apa ya?',
  },
  {
    id: 2,
    targetName: 'Hijau Daun',
    targetObject: 'Daun Pohon Rindang',
    targetEmoji: '🌿',
    colorA: { name: 'Biru', hex: 'bg-sky-500', emoji: '🔵' },
    colorB: { name: 'Kuning', hex: 'bg-yellow-400', emoji: '🟡' },
    resultColor: {
      name: 'Hijau',
      bgClass: 'bg-emerald-500 text-white',
      borderClass: 'border-emerald-700',
      emoji: '🟢',
    },
    options: [
      { name: 'Merah', bgClass: 'bg-rose-500 text-white', borderClass: 'border-rose-700', emoji: '🔴' },
      { name: 'Hijau', bgClass: 'bg-emerald-500 text-white', borderClass: 'border-emerald-700', emoji: '🟢' },
      { name: 'Cokelat', bgClass: 'bg-amber-800 text-white', borderClass: 'border-amber-950', emoji: '🟤' },
    ],
    question: 'Jika cat Biru dicampur cat Kuning untuk mewarnai Daun, menjadi warna apa ya?',
  },
  {
    id: 3,
    targetName: 'Ungu Anggur',
    targetObject: 'Buah Anggur Segar',
    targetEmoji: '🍇',
    colorA: { name: 'Merah', hex: 'bg-rose-500', emoji: '🔴' },
    colorB: { name: 'Biru', hex: 'bg-sky-500', emoji: '🔵' },
    resultColor: {
      name: 'Ungu',
      bgClass: 'bg-purple-500 text-white',
      borderClass: 'border-purple-700',
      emoji: '🟣',
    },
    options: [
      { name: 'Ungu', bgClass: 'bg-purple-500 text-white', borderClass: 'border-purple-700', emoji: '🟣' },
      { name: 'Kuning', bgClass: 'bg-yellow-400 text-slate-900', borderClass: 'border-yellow-600', emoji: '🟡' },
      { name: 'Hijau', bgClass: 'bg-emerald-500 text-white', borderClass: 'border-emerald-700', emoji: '🟢' },
    ],
    question: 'Jika cat Merah dicampur cat Biru untuk mewarnai Anggur, menjadi warna apa ya?',
  },
  {
    id: 4,
    targetName: 'Merah Muda (Pink)',
    targetObject: 'Bunga Sakura Cantik',
    targetEmoji: '🌸',
    colorA: { name: 'Merah', hex: 'bg-rose-500', emoji: '🔴' },
    colorB: { name: 'Putih', hex: 'bg-white border border-slate-300', emoji: '⚪' },
    resultColor: {
      name: 'Merah Muda',
      bgClass: 'bg-pink-400 text-white',
      borderClass: 'border-pink-600',
      emoji: '🩷',
    },
    options: [
      { name: 'Hitam', bgClass: 'bg-slate-800 text-white', borderClass: 'border-slate-950', emoji: '⚫' },
      { name: 'Merah Muda', bgClass: 'bg-pink-400 text-white', borderClass: 'border-pink-600', emoji: '🩷' },
      { name: 'Jingga', bgClass: 'bg-orange-400 text-white', borderClass: 'border-orange-600', emoji: '🟠' },
    ],
    question: 'Jika cat Merah dicampur cat Putih untuk mewarnai Bunga, menjadi warna apa ya?',
  },
  {
    id: 5,
    targetName: 'Biru Muda Cerah',
    targetObject: 'Langit Pagi Cerah',
    targetEmoji: '☁️',
    colorA: { name: 'Biru Tua', hex: 'bg-blue-700', emoji: '🔵' },
    colorB: { name: 'Putih', hex: 'bg-white border border-slate-300', emoji: '⚪' },
    resultColor: {
      name: 'Biru Muda',
      bgClass: 'bg-sky-300 text-slate-900',
      borderClass: 'border-sky-500',
      emoji: '🩵',
    },
    options: [
      { name: 'Biru Muda', bgClass: 'bg-sky-300 text-slate-900', borderClass: 'border-sky-500', emoji: '🩵' },
      { name: 'Ungu', bgClass: 'bg-purple-500 text-white', borderClass: 'border-purple-700', emoji: '🟣' },
      { name: 'Merah', bgClass: 'bg-rose-500 text-white', borderClass: 'border-rose-700', emoji: '🔴' },
    ],
    question: 'Jika cat Biru Tua dicampur cat Putih untuk mewarnai Langit, menjadi warna apa ya?',
  },
];

export default function ColorStudioGame({
  childName,
  onBack,
  onCompleteRound,
}: ColorStudioGameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isPainted, setIsPainted] = useState(false);
  const [feedback, setFeedback] = useState(LEVELS[0].question);
  const [isFinished, setIsFinished] = useState(false);

  const current = LEVELS[idx];

  const handleSelectColor = (opt: ColorMixLevel['options'][0]) => {
    if (isPainted) return;

    if (opt.name === current.resultColor.name) {
      soundManager.playSuccess();
      setIsPainted(true);
      setScore((prev) => prev + 20);
      const msg = `Benar sekali! ${current.colorA.name} ditambah ${current.colorB.name} menjadi warna ${current.resultColor.name} untuk ${current.targetObject}!`;
      soundManager.speak(msg);
      setFeedback(`🎨 Yeay! ${msg}`);

      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= LEVELS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Wah hebat sekali ${childName}! Kamu pelukis dan ahli warna yang kreatif!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setIdx(nextIdx);
          setIsPainted(false);
          setFeedback(LEVELS[nextIdx].question);
          soundManager.speak(LEVELS[nextIdx].question);
        }
      }, 1600);
    } else {
      soundManager.playGentleTryAgain();
      soundManager.speak(
        `Itu warna ${opt.name}. Ayo coba pilih warna hasil campuran ${current.colorA.name} dan ${current.colorB.name}!`
      );
      setFeedback(
        `💡 Itu warna ${opt.name}. Coba tebak lagi warna untuk ${current.targetObject}!`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-500 via-pink-500 to-amber-400 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-2 bg-white/95 text-slate-700 hover:bg-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Portal Game</span>
        </button>

        <div className="bg-white/95 px-5 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-center font-bold text-slate-800 tabular-nums text-sm sm:text-base">
          <span>Skor Seni: {score} 🌟</span> · Kanvas {idx + 1}/{LEVELS.length}
        </div>

        <button
          onClick={() => soundManager.speak(current.question)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-pink-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px] cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Suara</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <Palette className="w-4 h-4" />
              <span>KECERDASAN SENI & KREATIVITAS · KANVAS CAMPUR WARNA</span>
            </div>

            {/* Canvas & Color Mixing Equation */}
            <div className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 mb-6">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Mewarnai Gambar: {current.targetObject}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${current.colorA.hex} shadow-md flex items-center justify-center text-3xl`}
                  >
                    {current.colorA.emoji}
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 mt-1">
                    {current.colorA.name}
                  </span>
                </div>

                <span className="text-3xl font-black text-slate-400">+</span>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${current.colorB.hex} shadow-md flex items-center justify-center text-3xl`}
                  >
                    {current.colorB.emoji}
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 mt-1">
                    {current.colorB.name}
                  </span>
                </div>

                <span className="text-3xl font-black text-slate-400">=</span>

                {/* Target Canvas Frame */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 flex flex-col items-center justify-center shadow-lg transition-all ${
                      isPainted
                        ? `${current.resultColor.bgClass} ${current.resultColor.borderClass} scale-110`
                        : 'bg-white border-dashed border-pink-400 animate-pulse'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">{current.targetEmoji}</span>
                  </div>
                  <span className="text-xs font-extrabold text-pink-700 mt-1">
                    {isPainted ? current.resultColor.name : 'Warna Apa?'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-700 mb-6 min-h-[2.5rem]">
              {feedback}
            </p>

            {/* Color Palette Options */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectColor(opt)}
                  className={`${opt.bgClass} ${opt.borderClass} border-b-8 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer min-h-[120px]`}
                >
                  <span className="text-4xl sm:text-5xl mb-2 drop-shadow">
                    {opt.emoji}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-3xl font-extrabold text-pink-700 mb-2">
              Pelukis Cilik Berbakat!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> pintar mencampur warna-warni indah di studio lukis!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setIdx(0);
                  setScore(0);
                  setIsPainted(false);
                  setIsFinished(false);
                  setFeedback(LEVELS[0].question);
                }}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Main Lagi 🔄
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all cursor-pointer"
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
