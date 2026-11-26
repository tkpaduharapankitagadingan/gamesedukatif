'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Heart } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface SocialHabitGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface HabitScenario {
  id: number;
  title: string;
  sceneEmoji: string;
  question: string;
  choices: {
    id: string;
    emoji: string;
    text: string;
    isGood: boolean;
    praise: string;
  }[];
}

const SCENARIOS: HabitScenario[] = [
  {
    id: 1,
    title: 'Setelah Selesai Bermain Mainan',
    sceneEmoji: '🧸',
    question: 'Mainan balok dan boneka berserakan di lantai setelah selesai bermain. Apa yang dilakukan anak hebat?',
    choices: [
      {
        id: 'a',
        emoji: '🧹',
        text: 'Merapikan kembali mainan ke dalam kotak tempatnya',
        isGood: true,
        praise: 'Hebat! Anak mandiri selalu merapikan mainannya kembali.',
      },
      {
        id: 'b',
        emoji: '🏃',
        text: 'Meninggalkan mainan tetap berantakan di lantai',
        isGood: false,
        praise: 'Kalau ditinggal berantakan nanti teman bisa tersandung. Ayo pilih sikap merapikan mainan ya!',
      },
    ],
  },
  {
    id: 2,
    title: 'Sebelum Makan Bersama di Sekolah',
    sceneEmoji: '🍱',
    question: 'Waktu istirahat makan bekal telah tiba! Sebelum makan, apa yang harus kita lakukan dulu?',
    choices: [
      {
        id: 'a',
        emoji: '🧼',
        text: 'Mencuci tangan dengan sabun dan berdoa sebelum makan',
        isGood: true,
        praise: 'Pintar sekali! Mencuci tangan dan berdoa membuat tubuh sehat dan berkah.',
      },
      {
        id: 'b',
        emoji: '🖐️',
        text: 'Langsung makan dengan tangan yang masih kotor',
        isGood: false,
        praise: 'Tangan yang kotor banyak kumannya. Kita harus cuci tangan dan berdoa dulu ya!',
      },
    ],
  },
  {
    id: 3,
    title: 'Bertemu Teman yang Ingin Ikut Bermain',
    sceneEmoji: '🎨',
    question: 'Temanmu di kelas ingin ikut menggambar tetapi lupa membawa krayon warna. Apa sikap anak baik?',
    choices: [
      {
        id: 'a',
        emoji: '🤝',
        text: 'Berbagi dan meminjamkan krayon warna dengan gembira',
        isGood: true,
        praise: 'Mulia sekali! Berbagi dengan teman membuat bermain jadi makin seru.',
      },
      {
        id: 'b',
        emoji: '😠',
        text: 'Menyembunyikan semua krayon sendiri',
        isGood: false,
        praise: 'Anak TK Harapan Kita suka berbagi dan menolong teman yang membutuhkan!',
      },
    ],
  },
  {
    id: 4,
    title: 'Saat Diberi Bantuan oleh Ibu Guru atau Orang Tua',
    sceneEmoji: '🎁',
    question: 'Ibu Guru membantu membukakan tutup botol minum milikmu. Kata ajaib apa yang kita ucapkan?',
    choices: [
      {
        id: 'a',
        emoji: '😊',
        text: 'Mengucapkan "Terima kasih, Ibu Guru!" dengan sopan',
        isGood: true,
        praise: 'Luar biasa! Mengucapkan terima kasih adalah kebiasaan anak yang sopan dan santun.',
      },
      {
        id: 'b',
        emoji: '😐',
        text: 'Diam saja dan langsung pergi berlari',
        isGood: false,
        praise: 'Jangan lupa ucapkan kata ajaib Terima Kasih kepada orang yang menolong kita ya!',
      },
    ],
  },
];

export default function SocialHabitGame({
  childName,
  onBack,
  onCompleteRound,
}: SocialHabitGameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Ayo pilih sikap anak mandiri, sopan, dan suka berbagi!');
  const [isFinished, setIsFinished] = useState(false);

  const current = SCENARIOS[idx];

  const handleSelectChoice = (choice: HabitScenario['choices'][0]) => {
    if (choice.isGood) {
      soundManager.playSuccess();
      soundManager.speak(choice.praise);
      setScore((prev) => prev + 25);
      setFeedback(`🎉 ${choice.praise}`);

      setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= SCENARIOS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Anak hebat ${childName}! Kamu adalah teladan anak mandiri dan berbudi pekerti luhur!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setIdx(nextIdx);
          setFeedback('Ayo pilih sikap baik berikutnya!');
          soundManager.speak(SCENARIOS[nextIdx].question);
        }
      }, 1700);
    } else {
      soundManager.playPop();
      soundManager.speak(choice.praise);
      setFeedback(`💡 ${choice.praise}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500 via-rose-400 to-amber-400 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-2 bg-white/95 text-slate-700 hover:bg-white px-4 py-2.5 rounded-2xl font-bold shadow-lg transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Portal Game</span>
        </button>

        <div className="bg-white/95 px-5 py-2 rounded-2xl shadow-lg border-2 border-amber-300 text-center font-bold text-slate-800 tabular-nums text-sm sm:text-base">
          <span>Budi Pekerti: {score} 🌟</span> · Cerita {idx + 1}/{SCENARIOS.length}
        </div>

        <button
          onClick={() => soundManager.speak(current.question)}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-rose-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px]"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Bacakan Cerita</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <Heart className="w-4 h-4" />
              <span>KECERDASAN SOSIAL EMOSIONAL · ANAK MANDIRI & BERBAGI</span>
            </div>

            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 mb-6">
              <div className="text-6xl mb-3">{current.sceneEmoji}</div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
                {current.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed">
                {current.question}
              </p>
            </div>

            <div className="text-sm sm:text-base font-bold text-rose-800 mb-6 min-h-[2.5rem] flex items-center justify-center">
              {feedback}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChoice(c)}
                  className="bg-white hover:bg-amber-50 border-4 border-rose-300 hover:border-amber-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[150px]"
                >
                  <span className="text-5xl mb-3">{c.emoji}</span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                    {c.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">💖</div>
            <h2 className="text-3xl font-extrabold text-rose-700 mb-2">
              Anak Mandiri & Baik Hati!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> telah memilih sikap anak yang sopan, mandiri, dan suka berbagi kepada teman!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIdx(0);
                  setScore(0);
                  setIsFinished(false);
                  setFeedback('Ayo pilih sikap anak mandiri, sopan, dan suka berbagi!');
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
