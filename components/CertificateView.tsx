'use client';

import React from 'react';
import { ArrowLeft, Award, Printer } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface CertificateViewProps {
  childName: string;
  earnedStars: number;
  onBack: () => void;
}

const INTELLIGENCE_BADGES = [
  { emoji: '🌿', title: 'Naturalis & Alam', desc: 'Kebun Pintar, Warna & Angka' },
  { emoji: '🎵', title: 'Musikal & Irama', desc: 'Gambang Nada Do-Re-Mi' },
  { emoji: '📚', title: 'Bahasa & Huruf', desc: 'Mengenal Huruf & Kosakata' },
  { emoji: '🧠', title: 'Visual & Memori', desc: 'Konsentrasi Pasangan Gambar' },
  { emoji: '🚂', title: 'Logika Matematika', desc: 'Urutan Pola & Penalaran' },
  { emoji: '💖', title: 'Sosial Emosional', desc: 'Anak Mandiri & Suka Berbagi' },
];

export default function CertificateView({
  childName,
  earnedStars,
  onBack,
}: CertificateViewProps) {
  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 print:hidden">
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

        <div className="bg-white/95 px-6 py-2 rounded-2xl shadow-lg border-2 border-sky-300 text-center font-bold text-sky-800">
          <span>Sertifikat Resmi Portal APE</span>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-5 py-2.5 rounded-2xl font-bold shadow-lg transition-all min-h-[44px] cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Certificate Card */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full text-center border-8 border-amber-400 relative overflow-hidden">
          {/* Decorative Corner Seals */}
          <div className="absolute top-4 left-4 text-3xl">🌿</div>
          <div className="absolute top-4 right-4 text-3xl">🌻</div>
          <div className="absolute bottom-4 left-4 text-3xl">🎵</div>
          <div className="absolute bottom-4 right-4 text-3xl">🚂</div>

          {/* School Header */}
          <div className="text-emerald-700 font-bold text-xs sm:text-sm tracking-widest uppercase mb-1">
            LAYANAN PENDIDIKAN DIGITAL ANAK USIA DINI
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 mb-1 tracking-tight">
            TK PAUD HARAPAN KITA GADINGAN
          </h1>
          <p className="text-xs text-slate-500 mb-5">
            Portal Edukasi: <span className="text-emerald-600 font-semibold">https://games.tkpaduharapankitagadingan.sch.id</span> · Situs Utama: <span className="text-emerald-600 font-semibold">https://tkpaduharapankitagadingan.sch.id</span>
          </p>

          <hr className="w-48 mx-auto border-2 border-amber-300 mb-6" />

          {/* Certificate Title */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-extrabold px-6 py-2 rounded-full text-xs sm:text-sm mb-4 border border-amber-300">
            <Award className="w-5 h-5 text-amber-600" />
            <span>SERTIFIKAT BINTANG KECERDASAN MAJEMUK (APE)</span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base mb-3 italic">
            Diberikan dengan penuh kebanggaan kepada siswa/siswi hebat:
          </p>

          {/* Recipient Name */}
          <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tracking-wide mb-5 py-3 px-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200 inline-block">
            {childName}
          </div>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-6 font-medium leading-relaxed">
            Telah aktif bermain dan belajar di <strong>Portal Mini Games Edukatif TK Paud Harapan Kita Gadingan</strong>, mengasah kemampuan kognitif, motorik, serta 6 kecerdasan anak usia dini dengan raihan{' '}
            <span className="font-extrabold text-amber-600 tabular-nums">{earnedStars} Stiker Bintang Emas</span>!
          </p>

          {/* 6 Multiple Intelligence Badges Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
            {INTELLIGENCE_BADGES.map((b, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2.5"
              >
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">{b.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-200 text-center">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-10">Orang Tua / Wali Murid</div>
              <div className="font-bold text-slate-800 border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
                ( .................................... )
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium mb-10">Kepala Sekolah & Pendidik</div>
              <div className="font-extrabold text-emerald-800 border-b border-emerald-600 pb-1 max-w-[220px] mx-auto">
                TK Paud Harapan Kita Gadingan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
