'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, RotateCcw, Grid } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface MemoryCardGameProps {
  childName: string;
  onBack: () => void;
  onCompleteRound: () => void;
}

interface CardTile {
  uid: number;
  pairId: string;
  name: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const PAIRS = [
  { pairId: 'apple', name: 'Apel', emoji: '🍎' },
  { pairId: 'sunflower', name: 'Bunga Matahari', emoji: '🌻' },
  { pairId: 'rabbit', name: 'Kelinci', emoji: '🐰' },
  { pairId: 'butterfly', name: 'Kupu-kupu', emoji: '🦋' },
  { pairId: 'star', name: 'Bintang', emoji: '⭐' },
  { pairId: 'rainbow', name: 'Pelangi', emoji: '🌈' },
];

function createDeck(): CardTile[] {
  const doubled = [...PAIRS, ...PAIRS];
  return doubled
    .sort(() => Math.random() - 0.5)
    .map((item, idx) => ({
      uid: idx,
      pairId: item.pairId,
      name: item.name,
      emoji: item.emoji,
      flipped: false,
      matched: false,
    }));
}

export default function MemoryCardGame({
  childName,
  onBack,
  onCompleteRound,
}: MemoryCardGameProps) {
  const [cards, setCards] = useState<CardTile[]>(createDeck);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [feedback, setFeedback] = useState('Buka 2 kartu dan cari pasangan gambar yang sama!');
  const [isFinished, setIsFinished] = useState(false);

  const handleCardTap = (index: number) => {
    if (isLocked) return;
    const tapped = cards[index];
    if (tapped.flipped || tapped.matched) return;

    soundManager.playPop();

    const updated = cards.map((c, idx) =>
      idx === index ? { ...c, flipped: true } : c
    );
    setCards(updated);

    const nextSelected = [...selectedIndices, index];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setIsLocked(true);
      setMovesCount((m) => m + 1);
      const [firstIdx, secondIdx] = nextSelected;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        soundManager.playSuccess();
        soundManager.speak(`Cocok! Pasangan ${firstCard.name}!`);
        setFeedback(`🎉 Hore! Kamu menemukan pasangan ${firstCard.name}!`);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, matched: true } : c
            )
          );
          setSelectedIndices([]);
          setIsLocked(false);

          const nextMatches = matchesCount + 1;
          setMatchesCount(nextMatches);

          if (nextMatches >= PAIRS.length) {
            setIsFinished(true);
            soundManager.playCelebration();
            soundManager.speak(
              `Wah hebat sekali ${childName}! Daya ingatmu sangat tajam!`
            );
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            onCompleteRound();
          }
        }, 550);
      } else {
        // Not a match
        setFeedback(`Belum sama (${firstCard.name} & ${secondCard.name}). Ayo ingat posisinya!`);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setSelectedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    setCards(createDeck());
    setSelectedIndices([]);
    setMatchesCount(0);
    setMovesCount(0);
    setIsLocked(false);
    setIsFinished(false);
    setFeedback('Kartu sudah diacak! Ayo cari pasangannya lagi!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 via-emerald-500 to-lime-500 flex flex-col p-4 sm:p-8">
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
          <span>Pasangan: {matchesCount}/{PAIRS.length} 🌟</span> · Langkah: {movesCount}
        </div>

        <button
          onClick={handleRestart}
          className="bg-white/95 p-3 rounded-2xl shadow-lg text-emerald-700 hover:bg-white transition-all flex items-center gap-1 font-bold text-xs min-h-[44px]"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="hidden sm:inline">Acak Ulang</span>
        </button>
      </div>

      {/* Main Arena */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {!isFinished ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 w-full text-center border-4 border-amber-300">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-xs font-extrabold mb-3">
              <Grid className="w-4 h-4" />
              <span>KECERDASAN VISUAL & DAYA INGAT · KARTU MEMORI</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-5">
              <p className="text-base sm:text-lg font-bold text-slate-700">
                {feedback}
              </p>
              <button
                onClick={() => soundManager.speak(feedback)}
                className="p-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100"
                aria-label="Bacakan"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* 4x3 Card Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
              {cards.map((card, index) => {
                const isRevealed = card.flipped || card.matched;
                return (
                  <button
                    key={card.uid}
                    onClick={() => handleCardTap(index)}
                    className={`h-24 sm:h-28 rounded-2xl border-4 flex flex-col items-center justify-center shadow-md transition-all transform duration-150 cursor-pointer ${
                      card.matched
                        ? 'bg-emerald-100 border-emerald-400 scale-95'
                        : isRevealed
                        ? 'bg-amber-50 border-amber-400 scale-105 shadow-xl'
                        : 'bg-gradient-to-b from-teal-500 to-emerald-600 border-teal-700 hover:scale-105 active:scale-95 text-white'
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <span className="text-4xl sm:text-5xl mb-1">{card.emoji}</span>
                        <span className="text-[11px] font-extrabold text-slate-700">
                          {card.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl">🌿</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">
                          Buka
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-extrabold text-teal-700 mb-2">
              Daya Ingat Super!
            </h2>
            <p className="text-slate-600 text-base mb-6 font-medium">
              Adik <span className="font-bold text-slate-800">{childName}</span> berhasil mencocokkan semua 6 pasang kartu memori dalam {movesCount} langkah!
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-500 mb-6 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              <Sparkles className="w-7 h-7 fill-amber-400" />
              <span>+1 Stiker Bintang Emas!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
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
