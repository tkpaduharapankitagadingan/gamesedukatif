'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Recycle } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface EcoSortGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

type BinType = 'organik' | 'plastik' | 'kertas';

interface TrashItem {
  id: number;
  name: string;
  emoji: string;
  bin: BinType;
  hint: string;
}

const ITEMS: TrashItem[] = [
  {
    id: 1,
    name: 'Kulit Pisang',
    emoji: '🍌',
    bin: 'organik',
    hint: 'Kulit pisang berasal dari tumbuhan dan bisa menjadi pupuk kompos (Sampah Organik).',
  },
  {
    id: 2,
    name: 'Botol Minum Plastik',
    emoji: '🧴',
    bin: 'plastik',
    hint: 'Botol plastik bisa didaur ulang di tempat Sampah Plastik.',
  },
  {
    id: 3,
    name: 'Kardus Bekas Mainan',
    emoji: '📦',
    bin: 'kertas',
    hint: 'Kardus terbuat dari serat kertas, masukkan ke tempat Sampah Kertas!',
  },
  {
    id: 4,
    name: 'Daun Kering Taman',
    emoji: '🍂',
    bin: 'organik',
    hint: 'Daun kering yang gugur di taman termasuk Sampah Organik.',
  },
  {
    id: 5,
    name: 'Kertas Gambar Bekas',
    emoji: '📄',
    bin: 'kertas',
    hint: 'Kertas bekas bisa didaur ulang di tempat Sampah Kertas.',
  },
];

const BINS: {
  id: BinType;
  title: string;
  subtitle: string;
  emoji: string;
  colorClass: string;
}[] = [
  {
    id: 'organik',
    title: 'Tong Hijau (Organik)',
    subtitle: 'Sisa Buah & Daun',
    emoji: '🌿',
    colorClass: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white',
  },
  {
    id: 'kertas',
    title: 'Tong Biru (Kertas)',
    subtitle: 'Kertas & Kardus',
    emoji: '📘',
    colorClass: 'bg-sky-500 hover:bg-sky-600 border-sky-700 text-white',
  },
  {
    id: 'plastik',
    title: 'Tong Kuning (Plastik)',
    subtitle: 'Botol & Kemasan',
    emoji: '♻️',
    colorClass: 'bg-amber-400 hover:bg-amber-500 border-amber-600 text-amber-950',
  },
];

export default function EcoSortGame({
  childName,
  onBack,
  onCompleteRound,
}: EcoSortGameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(
    'Ayo masukkan sampah ke dalam tong warna yang tepat agar sekolah kita bersih!'
  );
  const [isFinished, setIsFinished] = useState(false);

  const current = ITEMS[idx];

  const handleSelectBin = (binId: BinType) => {
    if (binId === current.bin) {
      soundManager.playSuccess();
      setScore((prev) => prev + 20);
      const praise = `Benar sekali! ${current.name} masuk ke tong ${binId}!`;
      soundManager.speak(praise);
      setFeedback(`🎉 ${praise}`);

      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= ITEMS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Luar biasa ${childName}! Taman sekolah TK Harapan Kita kini bersih dan asri!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setIdx(nextIdx);
          const nextMsg = `Ke mana kita membuang ${ITEMS[nextIdx].name}?`;
          setFeedback(nextMsg);
          soundManager.speak(nextMsg);
        }
      }, 1400);
    } else {
      soundManager.playGentleTryAgain();
      soundManager.speak(current.hint);
      setFeedback(`💡 ${current.hint}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-500 via-emerald-500 to-teal-600 flex flex-col p-4 sm:p-8">
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
          <span>Skor Bersih: {score} 🌟</span> · Benda {idx + 1}/{ITEMS.length}
        </div>

        <button
          onClick={() => soundManager.speak(current.hint)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-emerald-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px] cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Petunjuk</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-900 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <Recycle className="w-4 h-4" />
              <span>KECERDASAN EKOLOGI & LINGKUNGAN · PILAH SAMPAH</span>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 mb-6 max-w-md mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                Masukkan ke Tong yang Tepat:
              </span>
              <div className="text-6xl sm:text-7xl my-2 animate-bounce">
                {current.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                {current.name}
              </h2>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-700 mb-6 min-h-[2.5rem]">
              {feedback}
            </p>

            {/* 3 Colored Recycling Bins */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BINS.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => handleSelectBin(bin.id)}
                  className={`${bin.colorClass} border-b-8 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer min-h-[140px]`}
                >
                  <span className="text-4xl sm:text-5xl mb-2">{bin.emoji}</span>
                  <span className="font-extrabold text-base sm:text-lg">
                    {bin.title}
                  </span>
                  <span className="text-xs font-bold opacity-90 mt-0.5">
                    {bin.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">
              Duta Lingkungan Cilik!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> pintar memilah sampah dan menjaga kebersihan taman sekolah!
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
                  setIsFinished(false);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer"
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
