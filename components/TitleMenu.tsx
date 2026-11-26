'type client';

import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Award, BookOpen, Heart, Play } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface TitleMenuProps {
  onStart: (childName: string) => void;
  earnedStars: number;
  onOpenStickers: () => void;
  onOpenCertificate: () => void;
}

export default function TitleMenu({ onStart, earnedStars, onOpenStickers, onOpenCertificate }: TitleMenuProps) {
  const [name, setName] = useState('');
  const [muted, setMuted] = useState(soundManager.isMuted());

  const handleToggleSound = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    soundManager.setMuted(newMuted);
    if (!newMuted) {
      soundManager.playPop();
      soundManager.speak('Selamat datang di Kebun Pintar Harapan Kita!');
    }
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    const childName = name.trim() || 'Anak Hebat';
    soundManager.speak(`Halo ${childName}, mari kita bermain dan belajar bersama!`);
    onStart(childName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-emerald-300 to-emerald-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Floating Background Elements */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce duration-1000 opacity-80 pointer-events-none">🍎</div>
      <div className="absolute top-20 right-16 text-6xl animate-pulse opacity-80 pointer-events-none">🦋</div>
      <div className="absolute bottom-12 left-16 text-6xl animate-bounce duration-700 opacity-80 pointer-events-none">🌻</div>
      <div className="absolute bottom-20 right-20 text-6xl animate-pulse opacity-80 pointer-events-none">🐰</div>

      {/* Top Header / Sound Toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <button
          onClick={handleToggleSound}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-slate-700 hover:bg-white transition-all transform hover:scale-105"
          aria-label="Toggle Sound"
        >
          {muted ? <VolumeX className="w-6 h-6 text-rose-500" /> : <Volume2 className="w-6 h-6 text-emerald-600" />}
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 max-w-xl w-full text-center border-4 border-amber-300 relative z-10 my-auto">
        {/* School Badge / Header */}
        <div className="inline-block bg-amber-100 text-amber-800 font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-3 tracking-wide border border-amber-300 shadow-sm">
          TK PAUD HARAPAN KITA GADINGAN
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-emerald-700 mb-2 tracking-tight flex items-center justify-center gap-2">
          <span>🌿</span> Kebun Pintar <span>🌻</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mb-6 font-medium">
          Alat Permainan Edukatif (APE) Interaktif untuk Mengembangkan Kognitif & Motorik Anak
        </p>

        {/* Input Form for Child Name */}
        <form onSubmit={handleStartGame} className="space-y-4 mb-6">
          <div className="text-left">
            <label htmlFor="childName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Masukkan Nama Adik / Siswa:
            </label>
            <input
              id="childName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi atau Siska..."
              className="w-full px-4 py-3 text-lg rounded-2xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal"
              maxLength={25}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 text-xl tracking-wide cursor-pointer"
          >
            <Play className="w-7 h-7 fill-current" />
            <span>Mulai Petualangan!</span>
          </button>
        </form>

        {/* Quick Stats / Navigation Links */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenStickers();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-2xl font-bold text-sm border border-amber-200 transition-all shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Koleksi Stiker ({earnedStars} 🌟)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onOpenCertificate();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-2xl font-bold text-sm border border-sky-200 transition-all shadow-sm"
          >
            <Award className="w-5 h-5 text-sky-600" />
            <span>Sertifikat Paud</span>
          </button>
        </div>

        {/* School Footer */}
        <div className="mt-6 text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
          <span>Layanan Digital Resmi</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://tkpaduharapankitagadingan.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline font-semibold"
          >
            tkpaduharapankitagadingan.sch.id
          </a>
        </div>
      </div>
    </div>
  );
}
