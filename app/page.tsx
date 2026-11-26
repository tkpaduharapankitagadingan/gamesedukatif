'use client';

import React, { useState, useEffect } from 'react';
import PortalLobby, {
  PortalGameId,
  DailyChallengeTask,
  GAME_CATALOG,
} from '@/components/PortalLobby';
import GameHub from '@/components/GameHub';
import FruitHarvestGame from '@/components/FruitHarvestGame';
import FlowerCountGame from '@/components/FlowerCountGame';
import AnimalShapeGame from '@/components/AnimalShapeGame';
import MusicXylophoneGame from '@/components/MusicXylophoneGame';
import AlphabetSafariGame from '@/components/AlphabetSafariGame';
import MemoryCardGame from '@/components/MemoryCardGame';
import PatternTrainGame from '@/components/PatternTrainGame';
import SocialHabitGame from '@/components/SocialHabitGame';
import ColorStudioGame from '@/components/ColorStudioGame';
import ProfessionMatchGame from '@/components/ProfessionMatchGame';
import MazeAdventureGame from '@/components/MazeAdventureGame';
import EcoSortGame from '@/components/EcoSortGame';
import StickerBook from '@/components/StickerBook';
import CertificateView from '@/components/CertificateView';
import { soundManager } from '@/lib/audio';
import confetti from 'canvas-confetti';

type ViewState =
  | 'portal'
  | 'kebun_pintar_hub'
  | 'fruit'
  | 'flower'
  | 'animal'
  | 'music'
  | 'alphabet'
  | 'memory'
  | 'pattern'
  | 'social'
  | 'color_studio'
  | 'profession'
  | 'maze'
  | 'eco_sort'
  | 'stickers'
  | 'certificate';

const STORAGE_KEY = 'tk_harapan_kita_portal_profile_v2';

interface SavedProfile {
  childName: string;
  childAvatar: string;
  earnedStars: number;
  completedGames: Record<string, number>;
  dailyChallenge?: DailyChallengeTask;
}

function getTodayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

function createDailyChallenge(seedIndex?: number): DailyChallengeTask {
  const todayKey = getTodayDateKey();
  // Deterministic daily index unless randomized by "Tantangan Baru"
  const dayNum =
    typeof seedIndex === 'number'
      ? seedIndex
      : todayKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const chosen = GAME_CATALOG[dayNum % GAME_CATALOG.length];
  const targetCount = (dayNum % 2) + 1; // 1 or 2 times

  return {
    dateKey: todayKey,
    gameId: chosen.id,
    gameTitle: chosen.title,
    gameEmoji: chosen.emoji,
    description: `Mainkan "${chosen.title}" sebanyak ${targetCount} kali hari ini!`,
    targetCount,
    currentCount: 0,
    rewardStars: 3,
    completed: false,
  };
}

export default function Page() {
  const [view, setView] = useState<ViewState>('portal');

  const [childName, setChildName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedProfile>;
          if (parsed.childName) return parsed.childName;
        }
      } catch {
        // ignore storage errors
      }
    }
    return 'Adik Hebat';
  });

  const [childAvatar, setChildAvatar] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedProfile>;
          if (parsed.childAvatar) return parsed.childAvatar;
        }
      } catch {
        // ignore storage errors
      }
    }
    return '🦁';
  });

  const [earnedStars, setEarnedStars] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedProfile>;
          if (typeof parsed.earnedStars === 'number') return parsed.earnedStars;
        }
      } catch {
        // ignore storage errors
      }
    }
    return 3;
  });

  const [completedGames, setCompletedGames] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedProfile>;
          if (parsed.completedGames && typeof parsed.completedGames === 'object') {
            return parsed.completedGames;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return {};
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeTask>(() => {
    const todayKey = getTodayDateKey();
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedProfile>;
          if (parsed.dailyChallenge && parsed.dailyChallenge.dateKey === todayKey) {
            return parsed.dailyChallenge;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return createDailyChallenge();
  });

  // Persist profile and daily challenge automatically to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload: SavedProfile = {
        childName,
        childAvatar,
        earnedStars,
        completedGames,
        dailyChallenge,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [childName, childAvatar, earnedStars, completedGames, dailyChallenge]);

  const handleUpdateProfile = (name: string, avatar: string) => {
    setChildName(name);
    setChildAvatar(avatar);
  };

  const handleGenerateNewChallenge = () => {
    const randomIdx = Math.floor(Math.random() * 1000);
    const nextChallenge = createDailyChallenge(randomIdx);
    setDailyChallenge(nextChallenge);
    soundManager.speak(`Tantangan baru: ${nextChallenge.description}`);
  };

  const handleCompleteGame = (gameKey: PortalGameId) => {
    let bonusStarsToAward = 0;

    // Check if completed game matches the active Daily Challenge
    setDailyChallenge((prev) => {
      const isKebunSubGame =
        prev.gameId === 'kebun_pintar_hub' &&
        (gameKey === 'fruit' || gameKey === 'flower' || gameKey === 'animal');
      const matchesChallenge = prev.gameId === gameKey || isKebunSubGame;

      if (!prev.completed && matchesChallenge) {
        const nextCount = prev.currentCount + 1;
        const nowComplete = nextCount >= prev.targetCount;
        if (nowComplete) {
          bonusStarsToAward = prev.rewardStars;
          setTimeout(() => {
            soundManager.playCelebration();
            soundManager.speak(
              `Hore! Tantangan Harian selesai! Kamu mendapat bonus ${prev.rewardStars} bintang emas!`
            );
            confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
          }, 600);
        }
        return {
          ...prev,
          currentCount: nextCount,
          completed: nowComplete,
        };
      }
      return prev;
    });

    setEarnedStars((prev) => Math.min(prev + 1 + bonusStarsToAward, 24));

    setCompletedGames((prev) => {
      const next = { ...prev, [gameKey]: (prev[gameKey] || 0) + 1 };
      if (gameKey === 'fruit' || gameKey === 'flower' || gameKey === 'animal') {
        next.kebun_pintar_hub = (prev.kebun_pintar_hub || 0) + 1;
      }
      return next;
    });
  };

  const handleLaunchGame = (gameId: PortalGameId) => {
    setView(gameId);
  };

  return (
    <main className="min-h-screen font-sans select-none antialiased">
      {view === 'portal' && (
        <PortalLobby
          childName={childName}
          childAvatar={childAvatar}
          earnedStars={earnedStars}
          completedGames={completedGames}
          dailyChallenge={dailyChallenge}
          onUpdateProfile={handleUpdateProfile}
          onLaunchGame={handleLaunchGame}
          onGenerateNewChallenge={handleGenerateNewChallenge}
          onOpenStickers={() => setView('stickers')}
          onOpenCertificate={() => setView('certificate')}
        />
      )}

      {view === 'kebun_pintar_hub' && (
        <GameHub
          childName={childName}
          earnedStars={earnedStars}
          onSelectGame={(gameId) => {
            if (gameId === 'fruit') setView('fruit');
            if (gameId === 'flower') setView('flower');
            if (gameId === 'animal') setView('animal');
          }}
          onBackToTitle={() => setView('portal')}
          onOpenStickers={() => setView('stickers')}
          onOpenCertificate={() => setView('certificate')}
        />
      )}

      {view === 'fruit' && (
        <FruitHarvestGame
          childName={childName}
          onBack={() => setView('kebun_pintar_hub')}
          onCompleteRound={() => handleCompleteGame('fruit')}
        />
      )}

      {view === 'flower' && (
        <FlowerCountGame
          childName={childName}
          onBack={() => setView('kebun_pintar_hub')}
          onCompleteRound={() => handleCompleteGame('flower')}
        />
      )}

      {view === 'animal' && (
        <AnimalShapeGame
          childName={childName}
          onBack={() => setView('kebun_pintar_hub')}
          onCompleteRound={() => handleCompleteGame('animal')}
        />
      )}

      {view === 'music' && (
        <MusicXylophoneGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('music')}
        />
      )}

      {view === 'alphabet' && (
        <AlphabetSafariGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('alphabet')}
        />
      )}

      {view === 'memory' && (
        <MemoryCardGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('memory')}
        />
      )}

      {view === 'pattern' && (
        <PatternTrainGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('pattern')}
        />
      )}

      {view === 'social' && (
        <SocialHabitGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('social')}
        />
      )}

      {view === 'color_studio' && (
        <ColorStudioGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('color_studio')}
        />
      )}

      {view === 'profession' && (
        <ProfessionMatchGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('profession')}
        />
      )}

      {view === 'maze' && (
        <MazeAdventureGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('maze')}
        />
      )}

      {view === 'eco_sort' && (
        <EcoSortGame
          childName={childName}
          onBack={() => setView('portal')}
          onCompleteRound={() => handleCompleteGame('eco_sort')}
        />
      )}

      {view === 'stickers' && (
        <StickerBook
          childName={childName}
          earnedStars={earnedStars}
          onBack={() => setView('portal')}
          onOpenCertificate={() => setView('certificate')}
        />
      )}

      {view === 'certificate' && (
        <CertificateView
          childName={childName}
          earnedStars={earnedStars}
          onBack={() => setView('portal')}
        />
      )}
    </main>
  );
}
