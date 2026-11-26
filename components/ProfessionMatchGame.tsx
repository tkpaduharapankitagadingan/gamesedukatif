'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Briefcase } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface ProfessionMatchGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface ProfessionQuest {
  id: number;
  roleName: string;
  roleEmoji: string;
  description: string;
  correctTool: { name: string; emoji: string };
  options: { name: string; emoji: string }[];
}

const QUESTS: ProfessionQuest[] = [
  {
    id: 1,
    roleName: 'Pemadam Kebakaran',
    roleEmoji: '🧑‍🚒',
    description: 'Aku bertugas memadamkan api dan menolong warga. Kendaraan apa yang aku kendarai?',
    correctTool: { name: 'Mobil Pemadam', emoji: '🚒' },
    options: [
      { name: 'Mobil Pemadam', emoji: '🚒' },
      { name: 'Perahu Layar', emoji: '⛵' },
      { name: 'Sepeda Roda Tiga', emoji: '🚲' },
    ],
  },
  {
    id: 2,
    roleName: 'Ibu & Bapak Guru',
    roleEmoji: '👩‍🏫',
    description: 'Aku mengajar anak-anak membaca, bernyanyi, dan bermain di sekolah. Benda apa yang aku gunakan?',
    correctTool: { name: 'Buku & Papan Tulis', emoji: '📚' },
    options: [
      { name: 'Cangkul Sawah', emoji: '⛏️' },
      { name: 'Buku & Papan Tulis', emoji: '📚' },
      { name: 'Jaring Ikan', emoji: '🥅' },
    ],
  },
  {
    id: 3,
    roleName: 'Dokter Kesehatan',
    roleEmoji: '👩‍⚕️',
    description: 'Aku memeriksa dan mengobati anak-anak supaya kembali sehat dan kuat. Di mana tempatku bekerja?',
    correctTool: { name: 'Rumah Sakit / Klinik', emoji: '🏥' },
    options: [
      { name: 'Rumah Sakit / Klinik', emoji: '🏥' },
      { name: 'Stasiun Kereta', emoji: '🚉' },
      { name: 'Kebun Binatang', emoji: '🎪' },
    ],
  },
  {
    id: 4,
    roleName: 'Koki / Juru Masak',
    roleEmoji: '🧑‍🍳',
    description: 'Aku memasak makanan sehat dan lezat di dapur. Alat apa yang aku pakai untuk memasak?',
    correctTool: { name: 'Wajan & Spatula', emoji: '🍳' },
    options: [
      { name: 'Teleskop Bintang', emoji: '🔭' },
      { name: 'Bola Sepak', emoji: '⚽' },
      { name: 'Wajan & Spatula', emoji: '🍳' },
    ],
  },
  {
    id: 5,
    roleName: 'Pilot Pesawat',
    roleEmoji: '🧑‍✈️',
    description: 'Aku menerbangkan penumpang tinggi di atas awan menuju kota lain. Apa yang aku kemudikan?',
    correctTool: { name: 'Pesawat Terbang', emoji: '✈️' },
    options: [
      { name: 'Pesawat Terbang', emoji: '✈️' },
      { name: 'Traktor Kebun', emoji: '🚜' },
      { name: 'Kereta Api', emoji: '🚂' },
    ],
  },
];

export default function ProfessionMatchGame({
  childName,
  onBack,
  onCompleteRound,
}: ProfessionMatchGameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(QUESTS[0].description);
  const [isFinished, setIsFinished] = useState(false);

  const current = QUESTS[idx];

  const handleSelectTool = (opt: { name: string; emoji: string }) => {
    if (opt.name === current.correctTool.name) {
      soundManager.playSuccess();
      setScore((prev) => prev + 20);
      const praise = `Benar sekali! ${current.roleName} menggunakan ${opt.name}!`;
      soundManager.speak(praise);
      setFeedback(`🎉 ${praise}`);

      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= QUESTS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Hebat sekali ${childName}! Kamu mengenal berbagai profesi dan cita-cita mulia!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setIdx(nextIdx);
          setFeedback(QUESTS[nextIdx].description);
          soundManager.speak(
            `${QUESTS[nextIdx].roleName}. ${QUESTS[nextIdx].description}`
          );
        }
      }, 1500);
    } else {
      soundManager.playGentleTryAgain();
      soundManager.speak(
        `Itu ${opt.name}. Ayo pilih yang cocok untuk ${current.roleName}!`
      );
      setFeedback(
        `💡 Itu ${opt.name}. Coba pilih pasangan yang tepat untuk ${current.roleName}!`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-500 via-sky-500 to-blue-600 flex flex-col p-4 sm:p-8">
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
          <span>Skor: {score} 🌟</span> · Profesi {idx + 1}/{QUESTS.length}
        </div>

        <button
          onClick={() =>
            soundManager.speak(`${current.roleName}. ${current.description}`)
          }
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-sky-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px] cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Suara</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <Briefcase className="w-4 h-4" />
              <span>KECERDASAN PENGETAHUAN UMUM · MENGENAL PROFESI & CITA-CITA</span>
            </div>

            <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 mb-6 max-w-xl mx-auto">
              <div className="text-6xl sm:text-7xl mb-2 animate-bounce">
                {current.roleEmoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
                {current.roleName}
              </h2>
              <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed">
                &ldquo;{current.description}&rdquo;
              </p>
            </div>

            <div className="text-sm sm:text-base font-bold text-sky-800 mb-6 min-h-[2rem]">
              {feedback}
            </div>

            {/* Tool Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectTool(opt)}
                  className="bg-white hover:bg-amber-50 border-4 border-sky-300 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer min-h-[130px]"
                >
                  <span className="text-5xl sm:text-6xl mb-2">{opt.emoji}</span>
                  <span className="font-extrabold text-slate-800 text-base">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🧑‍🚀</div>
            <h2 className="text-3xl font-extrabold text-sky-700 mb-2">
              Cita-Cita Anak Hebat!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> pintar mengenal berbagai profesi dan alat kerjanya!
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
                  setFeedback(QUESTS[0].description);
                }}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer"
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
