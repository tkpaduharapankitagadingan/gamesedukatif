'use client';

import React from 'react';
import { ArrowLeft, Sparkles, Award } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface StickerBookProps {
  childName: string;
  earnedStars: number;
  onBack: () => void;
  onOpenCertificate: () => void;
}

const STICKER_COLLECTION = [
  { emoji: '🌟', name: 'Bintang Kebun' },
  { emoji: '🍎', name: 'Apel Manis' },
  { emoji: '🌻', name: 'Bunga Matahari' },
  { emoji: '🐰', name: 'Kelinci Ceria' },
  { emoji: '🎹', name: 'Nada Musik' },
  { emoji: '🔤', name: 'Pintar Huruf' },
  { emoji: '🃏', name: 'Ingatan Super' },
  { emoji: '🚂', name: 'Masinis Pola' },
  { emoji: '🤝', name: 'Anak Berbagi' },
  { emoji: '🦋', name: 'Kupu-Kupu' },
  { emoji: '🏆', name: 'Piala Emas' },
  { emoji: '🍌', name: 'Pisang Kuning' },
  { emoji: '🐘', name: 'Gajah Pintar' },
  { emoji: '🌈', name: 'Pelangi Indah' },
  { emoji: '☀️', name: 'Mentari Pagi' },
  { emoji: '🎨', name: 'Pelukis Cilik' },
  { emoji: '🐝', name: 'Lebah Rajin' },
  { emoji: '🍓', name: 'Stroberi Merah' },
  { emoji: '🐬', name: 'Lumba-Lumba' },
  { emoji: '🎓', name: 'Bintang Paud' },
  { emoji: '🚀', name: 'Roket Cita-Cita' },
  { emoji: '👑', name: 'Juara Harapan' },
  { emoji: '💎', name: 'Permata Hati' },
  { emoji: '💖', name: 'Anak Mandiri' },
];

export default function StickerBook({
  childName,
  earnedStars,
  onBack,
  onOpenCertificate,
}: StickerBookProps) {
  const maxSlots = STICKER_COLLECTION.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6">
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

        <div className="bg-white/95 px-6 py-2 rounded-2xl shadow-lg border-2 border-amber-400 text-center font-bold text-amber-800">
          <span>Album Stiker {childName}</span>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onOpenCertificate();
          }}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all text-xs sm:text-sm min-h-[44px] cursor-pointer"
        >
          <Award className="w-5 h-5" />
          <span className="hidden sm:inline">Sertifikat</span>
        </button>
      </div>

      {/* Main Sticker Album Box */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
          <div className="inline-block bg-amber-100 text-amber-800 font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm mb-3 border border-amber-300">
            ALBUM STIKER BINTANG EMAS · TK PAUD HARAPAN KITA GADINGAN
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400" />
            <span>Koleksi Stiker Kecerdasanmu</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base mb-6 font-medium">
            Adik <span className="font-bold text-slate-800">{childName}</span> sudah mengumpulkan{' '}
            <span className="font-extrabold text-amber-600 text-lg tabular-nums">{earnedStars}</span> dari {maxSlots} stiker bintang emas!
          </p>

          {/* Sticker Grid (24 slots) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 mb-8">
            {STICKER_COLLECTION.map((item, i) => {
              const isUnlocked = i < earnedStars;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playPop();
                      soundManager.speak(`Stiker ${item.name}!`);
                    }
                  }}
                  className={`h-24 sm:h-28 rounded-2xl border-4 flex flex-col items-center justify-center p-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-amber-50 to-yellow-200 border-amber-400 shadow-md transform hover:scale-105 cursor-pointer'
                      : 'bg-slate-100 border-slate-200 border-dashed opacity-50 cursor-default'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-amber-900 leading-tight">
                        {item.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl mb-1 text-slate-300">🔒</span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        Stiker #{i + 1}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              onBack();
            }}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-8 rounded-2xl shadow-lg transition-all text-base cursor-pointer"
          >
            Kembali ke Portal Game 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
