'use client';

import React from 'react';
import { ArrowLeft, Award, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface GameHubProps {
  childName: string;
  earnedStars: number;
  onSelectGame: (gameId: 'fruit' | 'flower' | 'animal') => void;
  onBackToTitle: () => void;
  onOpenStickers: () => void;
  onOpenCertificate: () => void;
}

export default function GameHub({
  childName,
  earnedStars,
  onSelectGame,
  onBackToTitle,
  onOpenStickers,
  onOpenCertificate,
}: GameHubProps) {
  const [muted, setMuted] = React.useState(soundManager.isMuted());

  const handleToggleSound = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <button
          onClick={() => {
            soundManager.playPop();
            onBackToTitle();
          }}
          className="flex items-center gap-2 bg-white/95 text-slate-700 hover:bg-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Portal Game Utama</span>
        </button>

        <div className="bg-white/95 px-6 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-center">
          <span className="text-xs text-slate-500 block font-semibold">Pemain Kebun Pintar:</span>
          <span className="text-emerald-700 font-extrabold text-lg">{childName}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenStickers();
            }}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg transition-all min-h-[44px] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-amber-300" />
            <span className="tabular-nums">{earnedStars} 🌟</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="bg-white/95 p-3 rounded-2xl shadow-lg text-slate-700 hover:bg-white transition-all min-h-[44px] cursor-pointer"
            aria-label="Toggle Sound"
          >
            {muted ? <VolumeX className="w-6 h-6 text-rose-500" /> : <Volume2 className="w-6 h-6 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Main Hub Area */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold mb-2 tracking-wide border border-white/30">
            MODUL KECERDASAN NATURALIS · TK PAUD HARAPAN KITA GADINGAN
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-md">
            🌿 APE Kebun Pintar 🌻
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg max-w-lg mx-auto font-medium">
            Ayo pilih 3 permainan seru di Kebun Pintar untuk melatih warna, hitung angka, dan bentuk bersama Bu Guru!
          </p>
        </div>

        {/* 3 Mini-Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          {/* Game 1: Panen Buah */}
          <button
            onClick={() => {
              soundManager.playPop();
              soundManager.speak('Panen Buah dan Warna');
              onSelectGame('fruit');
            }}
            className="bg-white hover:bg-rose-50 border-4 border-rose-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-24 h-24 bg-rose-100 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              🍎
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">
              Panen Buah & Warna
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Petik buah dan masukkan ke keranjang dengan warna yang sama!
            </p>
            <div className="mt-4 bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl group-hover:bg-rose-600 shadow-sm">
              Mulai Main 🚀
            </div>
          </button>

          {/* Game 2: Hitung Bunga */}
          <button
            onClick={() => {
              soundManager.playPop();
              soundManager.speak('Hitung Bunga dan Angka');
              onSelectGame('flower');
            }}
            className="bg-white hover:bg-amber-50 border-4 border-amber-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              🌻
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
              Hitung Bunga & Angka
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Hitung jumlah bunga di kebun dan pilih angka yang benar!
            </p>
            <div className="mt-4 bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl group-hover:bg-amber-600 shadow-sm">
              Mulai Main 🚀
            </div>
          </button>

          {/* Game 3: Tebak Bentuk Hewan */}
          <button
            onClick={() => {
              soundManager.playPop();
              soundManager.speak('Tebak Bentuk Hewan Kebun');
              onSelectGame('animal');
            }}
            className="bg-white hover:bg-sky-50 border-4 border-sky-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-24 h-24 bg-sky-100 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              🐰
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
              Tebak Bentuk Hewan
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Cocokkan hewan lucu dengan bayangan bentuknya di kebun!
            </p>
            <div className="mt-4 bg-sky-500 text-white font-bold text-xs px-4 py-2 rounded-xl group-hover:bg-sky-600 shadow-sm">
              Mulai Main 🚀
            </div>
          </button>
        </div>

        {/* Certificate Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onOpenCertificate();
          }}
          className="bg-white/90 hover:bg-white text-emerald-800 font-extrabold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 border-2 border-emerald-300 cursor-pointer"
        >
          <Award className="w-6 h-6 text-emerald-600" />
          <span>Lihat Sertifikat & Penghargaan TK Paud</span>
        </button>
      </div>
    </div>
  );
}
