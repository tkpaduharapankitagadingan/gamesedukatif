'use client';

import React, { useState, useEffect } from 'react';
import PortalLobby, { PortalGameId } from '@/components/PortalLobby';
import GameHub from '@/components/GameHub';
import FruitHarvestGame from '@/components/FruitHarvestGame';
import FlowerCountGame from '@/components/FlowerCountGame';
import AnimalShapeGame from '@/components/AnimalShapeGame';
import MusicXylophoneGame from '@/components/MusicXylophoneGame';
import AlphabetSafariGame from '@/components/AlphabetSafariGame';
import MemoryCardGame from '@/components/MemoryCardGame';
import PatternTrainGame from '@/components/PatternTrainGame';
import SocialHabitGame from '@/components/SocialHabitGame';
import StickerBook from '@/components/StickerBook';
import CertificateView from '@/components/CertificateView';

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
  | 'stickers'
  | 'certificate';

const STORAGE_KEY = 'tk_harapan_kita_portal_profile_v1';

interface SavedProfile {
  childName: string;
  childAvatar: string;
  earnedStars: number;
  completedGames: Record<string, number>;
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

  // Persist profile automatically to localStorage whenever primitives update
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload: SavedProfile = {
        childName,
        childAvatar,
        earnedStars,
        completedGames,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [childName, childAvatar, earnedStars, completedGames]);

  const handleUpdateProfile = (name: string, avatar: string) => {
    setChildName(name);
    setChildAvatar(avatar);
  };

  const handleCompleteGame = (gameKey: string) => {
    setEarnedStars((prev) => Math.min(prev + 1, 24));
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
          onUpdateProfile={handleUpdateProfile}
          onLaunchGame={handleLaunchGame}
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
