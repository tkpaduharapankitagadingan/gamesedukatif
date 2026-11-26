'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface MazeAdventureGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface MazeLevel {
  id: number;
  title: string;
  heroName: string;
  heroEmoji: string;
  goalName: string;
  goalEmoji: string;
  obstacleEmoji: string;
  // 3x3 grid: 'S' = Start, 'G' = Goal, 'X' = Obstacle, '.' = Open path
  grid: string[][];
  startPos: [number, number];
  goalPos: [number, number];
}

const LEVELS: MazeLevel[] = [
  {
    id: 1,
    title: 'Kelinci Mencari Wortel Segar',
    heroName: 'Kelinci',
    heroEmoji: '🐰',
    goalName: 'Wortel',
    goalEmoji: '🥕',
    obstacleEmoji: '🪨',
    grid: [
      ['S', '.', 'X'],
      ['X', '.', '.'],
      ['X', 'X', 'G'],
    ],
    startPos: [0, 0],
    goalPos: [2, 2],
  },
  {
    id: 2,
    title: 'Lebah Menuju Bunga Matahari',
    heroName: 'Lebah Madu',
    heroEmoji: '🐝',
    goalName: 'Bunga Matahari',
    goalEmoji: '🌻',
    obstacleEmoji: '🌧️',
    grid: [
      ['S', 'X', 'G'],
      ['.', '.', '.'],
      ['.', 'X', 'X'],
    ],
    startPos: [0, 0],
    goalPos: [0, 2],
  },
  {
    id: 3,
    title: 'Bebek Pulang ke Kolam Air',
    heroName: 'Bebek Kecil',
    heroEmoji: '🦆',
    goalName: 'Kolam Air',
    goalEmoji: '🏞️',
    obstacleEmoji: '🪵',
    grid: [
      ['X', '.', 'G'],
      ['.', '.', 'X'],
      ['S', 'X', 'X'],
    ],
    startPos: [2, 0],
    goalPos: [0, 2],
  },
];

export default function MazeAdventureGame({
  childName,
  onBack,
  onCompleteRound,
}: MazeAdventureGameProps) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [pos, setPos] = useState<[number, number]>(LEVELS[0].startPos);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(
    'Tekan panah arah atau sentuh kotak jalan untuk mengantar Kelinci ke Wortel!'
  );
  const [isFinished, setIsFinished] = useState(false);

  const current = LEVELS[levelIdx];

  const moveHero = (nextRow: number, nextCol: number) => {
    if (nextRow < 0 || nextRow >= 3 || nextCol < 0 || nextCol >= 3) {
      soundManager.playGentleTryAgain();
      setFeedback('Ups, itu batas taman! Ayo pilih arah jalan yang terbuka.');
      return;
    }

    const cell = current.grid[nextRow][nextCol];
    if (cell === 'X') {
      soundManager.playGentleTryAgain();
      soundManager.speak('Jalannya terhalang! Ayo lewat jalan rumput yang hijau.');
      setFeedback('🚧 Jalannya terhalang! Ayo pilih kotak jalan rumput yang terbuka.');
      return;
    }

    soundManager.playPop();
    setPos([nextRow, nextCol]);

    if (nextRow === current.goalPos[0] && nextCol === current.goalPos[1]) {
      soundManager.playSuccess();
      setScore((prev) => prev + 25);
      const winMsg = `Hore! ${current.heroName} berhasil sampai ke ${current.goalName}!`;
      soundManager.speak(winMsg);
      setFeedback(`🎉 ${winMsg}`);

      setTimeout(() => {
        const nextIdx = levelIdx + 1;
        if (nextIdx >= LEVELS.length) {
          setIsFinished(true);
          soundManager.playCelebration();
          soundManager.speak(
            `Luar biasa ${childName}! Kamu penjelajah labirin cilik yang cerdas!`
          );
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onCompleteRound();
        } else {
          setLevelIdx(nextIdx);
          setPos(LEVELS[nextIdx].startPos);
          const nextPrompt = `Sekarang bantu ${LEVELS[nextIdx].heroName} menuju ${LEVELS[nextIdx].goalName}!`;
          setFeedback(nextPrompt);
          soundManager.speak(nextPrompt);
        }
      }, 1300);
    } else {
      setFeedback(`Langkah bagus! Terus maju menuju ${current.goalName} (${current.goalEmoji})!`);
    }
  };

  const handleTileTap = (r: number, c: number) => {
    const [curR, curC] = pos;
    const dist = Math.abs(r - curR) + Math.abs(c - curC);
    if (dist === 1) {
      moveHero(r, c);
    } else if (dist > 1) {
      soundManager.playGentleTryAgain();
      setFeedback('Sentuh kotak yang berada tepat di sebelah teman hewanmu ya!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 via-green-500 to-teal-600 flex flex-col p-4 sm:p-8">
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
          <span>Skor: {score} 🌟</span> · Peta {levelIdx + 1}/{LEVELS.length}
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            setPos(current.startPos);
            setFeedback('Posisi diulang dari awal! Ayo melangkah lagi.');
          }}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-emerald-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px] cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="hidden sm:inline">Ulang Peta</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-3">
              <Compass className="w-4 h-4" />
              <span>KECERDASAN SPASIAL & MOTORIK · LABIRIN PETUALANG CILIK</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1">
              {current.heroEmoji} {current.title} {current.goalEmoji}
            </h2>

            <div className="flex items-center justify-center gap-2 mb-5">
              <p className="text-sm sm:text-base font-bold text-slate-600">
                {feedback}
              </p>
              <button
                onClick={() => soundManager.speak(feedback)}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                aria-label="Suara"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
              {/* 3x3 Interactive Maze Board */}
              <div className="grid grid-cols-3 gap-2.5 bg-emerald-100 p-3.5 rounded-3xl border-4 border-emerald-300 shadow-inner max-w-[300px] mx-auto w-full">
                {current.grid.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isHeroHere = pos[0] === rIdx && pos[1] === cIdx;
                    const isGoal =
                      current.goalPos[0] === rIdx && current.goalPos[1] === cIdx;
                    const isObstacle = cell === 'X';
                    const isAdjacent =
                      Math.abs(rIdx - pos[0]) + Math.abs(cIdx - pos[1]) === 1 &&
                      !isObstacle;

                    return (
                      <button
                        key={`${rIdx}-${cIdx}`}
                        onClick={() => handleTileTap(rIdx, cIdx)}
                        className={`h-20 sm:h-24 rounded-2xl border-4 flex flex-col items-center justify-center text-3xl sm:text-4xl transition-all ${
                          isHeroHere
                            ? 'bg-amber-200 border-amber-500 scale-105 shadow-lg'
                            : isObstacle
                            ? 'bg-slate-200 border-slate-300 opacity-80 cursor-not-allowed'
                            : isGoal
                            ? 'bg-rose-100 border-rose-400 animate-pulse cursor-pointer'
                            : isAdjacent
                            ? 'bg-white border-emerald-400 hover:bg-emerald-50 cursor-pointer shadow-sm'
                            : 'bg-white/80 border-emerald-200'
                        }`}
                      >
                        {isHeroHere ? (
                          <span className="animate-bounce">{current.heroEmoji}</span>
                        ) : isGoal ? (
                          <span>{current.goalEmoji}</span>
                        ) : isObstacle ? (
                          <span>{current.obstacleEmoji}</span>
                        ) : isAdjacent ? (
                          <span className="text-sm font-extrabold text-emerald-600">
                            🐾 Jalan
                          </span>
                        ) : (
                          <span className="text-lg opacity-30">🌱</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Large Kid-Friendly D-Pad Controls */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Tombol Kemudi Langkah:
                </span>
                <div className="grid grid-cols-3 gap-2.5 w-48">
                  <div />
                  <button
                    onClick={() => moveHero(pos[0] - 1, pos[1])}
                    className="h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer"
                    aria-label="Atas"
                  >
                    <ArrowUp className="w-7 h-7" />
                  </button>
                  <div />

                  <button
                    onClick={() => moveHero(pos[0], pos[1] - 1)}
                    className="h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer"
                    aria-label="Kiri"
                  >
                    <ArrowLeft className="w-7 h-7" />
                  </button>
                  <div className="h-14 bg-amber-100 border-2 border-amber-300 rounded-2xl flex items-center justify-center text-2xl">
                    {current.heroEmoji}
                  </div>
                  <button
                    onClick={() => moveHero(pos[0], pos[1] + 1)}
                    className="h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer"
                    aria-label="Kanan"
                  >
                    <ArrowRight className="w-7 h-7" />
                  </button>

                  <div />
                  <button
                    onClick={() => moveHero(pos[0] + 1, pos[1])}
                    className="h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl shadow-md flex items-center justify-center cursor-pointer"
                    aria-label="Bawah"
                  >
                    <ArrowDown className="w-7 h-7" />
                  </button>
                  <div />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🧭</div>
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-2">
              Penjelajah Cilik Hebat!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil menuntun semua hewan melewati labirin taman!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setLevelIdx(0);
                  setPos(LEVELS[0].startPos);
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
