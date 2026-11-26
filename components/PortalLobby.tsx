'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  Play,
  UserCheck,
  Edit3,
  Check,
  Star,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

export type PortalGameId =
  | 'kebun_pintar_hub'
  | 'fruit'
  | 'flower'
  | 'animal'
  | 'music'
  | 'alphabet'
  | 'memory'
  | 'pattern'
  | 'social';

export type IntelligenceCategory =
  | 'all'
  | 'naturalis'
  | 'musikal'
  | 'bahasa'
  | 'visual'
  | 'logika'
  | 'sosial';

interface PortalLobbyProps {
  childName: string;
  childAvatar: string;
  earnedStars: number;
  completedGames: Record<string, number>;
  onUpdateProfile: (name: string, avatar: string) => void;
  onLaunchGame: (gameId: PortalGameId) => void;
  onOpenStickers: () => void;
  onOpenCertificate: () => void;
}

const AVATARS = ['🦁', '🐰', '🐼', '🦊', '🐱', '🐨', '🐸', '🦄'];

const CATEGORIES: { id: IntelligenceCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'Semua Game', emoji: '🌟' },
  { id: 'naturalis', label: 'Kebun Pintar (Alam)', emoji: '🌿' },
  { id: 'musikal', label: 'Nada & Musik', emoji: '🎵' },
  { id: 'bahasa', label: 'Huruf & Bahasa', emoji: '📚' },
  { id: 'visual', label: 'Memori Visual', emoji: '🧠' },
  { id: 'logika', label: 'Logika & Pola', emoji: '🚂' },
  { id: 'sosial', label: 'Mandiri & Berbagi', emoji: '💖' },
];

interface GameCatalogItem {
  id: PortalGameId;
  title: string;
  subtitle: string;
  intelligenceLabel: string;
  category: IntelligenceCategory;
  emoji: string;
  badgeText: string;
  cardStyle: string;
  btnStyle: string;
  voiceIntro: string;
  subActivities?: { id: PortalGameId; label: string; emoji: string }[];
}

const GAME_CATALOG: GameCatalogItem[] = [
  {
    id: 'kebun_pintar_hub',
    title: 'Kebun Pintar Harapan Kita',
    subtitle: '3 Permainan: Panen Buah & Warna, Hitung Bunga, dan Tebak Bentuk Hewan.',
    intelligenceLabel: 'Kecerdasan Naturalis & Kognitif',
    category: 'naturalis',
    emoji: '🌻',
    badgeText: '3 Mini-Game di Dalam',
    cardStyle: 'border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-lime-50',
    btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    voiceIntro: 'Kebun Pintar Harapan Kita! Mari memanen buah, menghitung bunga, dan menebak hewan!',
    subActivities: [
      { id: 'fruit', label: 'Panen Buah', emoji: '🍎' },
      { id: 'flower', label: 'Hitung Bunga', emoji: '🌻' },
      { id: 'animal', label: 'Bentuk Hewan', emoji: '🐰' },
    ],
  },
  {
    id: 'music',
    title: 'Gambang & Piano Ceria',
    subtitle: 'Mainkan tangga nada Do-Re-Mi-Fa-Sol-La-Si-Do dan tirukan lagu anak Indonesia.',
    intelligenceLabel: 'Kecerdasan Musikal & Irama',
    category: 'musikal',
    emoji: '🎹',
    badgeText: 'Suara Musik Interaktif',
    cardStyle: 'border-purple-400 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50',
    btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
    voiceIntro: 'Gambang dan Piano Ceria! Ayo belajar tangga nada dan bermain musik!',
  },
  {
    id: 'alphabet',
    title: 'Petualangan Huruf & Suara',
    subtitle: 'Kenali bunyi huruf awal A sampai Z beserta gambar buah, benda, dan hewan lucu.',
    intelligenceLabel: 'Kecerdasan Bahasa & Linguistik',
    category: 'bahasa',
    emoji: '🔤',
    badgeText: 'Panduan Suara Indonesia',
    cardStyle: 'border-indigo-400 bg-gradient-to-br from-indigo-50 via-white to-sky-50',
    btnStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    voiceIntro: 'Petualangan Huruf dan Suara! Ayo belajar mengenal huruf awal dan membaca kata!',
  },
  {
    id: 'memory',
    title: 'Kartu Memori Pasangan',
    subtitle: 'Buka kartu yang tertutup dan temukan dua gambar kebun dan sekolah yang kembar.',
    intelligenceLabel: 'Kecerdasan Visual & Daya Ingat',
    category: 'visual',
    emoji: '🃏',
    badgeText: 'Latihan Konsentrasi',
    cardStyle: 'border-teal-400 bg-gradient-to-br from-teal-50 via-white to-cyan-50',
    btnStyle: 'bg-teal-600 hover:bg-teal-700 text-white',
    voiceIntro: 'Kartu Memori Pasangan! Ayo latih daya ingatmu mencari gambar yang sama!',
  },
  {
    id: 'pattern',
    title: 'Kereta Pola & Logika',
    subtitle: 'Lengkapi muatan gerbong kereta api sesuai urutan warna, bentuk, dan pola gambar.',
    intelligenceLabel: 'Kecerdasan Logika-Matematika',
    category: 'logika',
    emoji: '🚂',
    badgeText: 'Teka-Teki Gerbong',
    cardStyle: 'border-orange-400 bg-gradient-to-br from-orange-50 via-white to-amber-50',
    btnStyle: 'bg-orange-500 hover:bg-orange-600 text-white',
    voiceIntro: 'Kereta Pola dan Logika! Ayo lengkapi urutan gerbong agar keretanya berangkat!',
  },
  {
    id: 'social',
    title: 'Anak Mandiri & Berbagi',
    subtitle: 'Cerita interaktif memilih kebiasaan baik, merapikan mainan, cuci tangan, dan berbagi.',
    intelligenceLabel: 'Kecerdasan Sosial-Emosional',
    category: 'sosial',
    emoji: '🤝',
    badgeText: 'Karakter & Budi Pekerti',
    cardStyle: 'border-rose-400 bg-gradient-to-br from-rose-50 via-white to-pink-50',
    btnStyle: 'bg-rose-500 hover:bg-rose-600 text-white',
    voiceIntro: 'Anak Mandiri dan Berbagi! Ayo belajar kebiasaan anak hebat dan sopan santun!',
  },
];

export default function PortalLobby({
  childName,
  childAvatar,
  earnedStars,
  completedGames,
  onUpdateProfile,
  onLaunchGame,
  onOpenStickers,
  onOpenCertificate,
}: PortalLobbyProps) {
  const [selectedCategory, setSelectedCategory] = useState<IntelligenceCategory>('all');
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(childName);
  const [tempAvatar, setTempAvatar] = useState(childAvatar);

  const handleToggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playPop();
      soundManager.speak(`Halo ${childName}! Selamat datang di Portal Game Edukatif TK Paud Harapan Kita Gadingan!`);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = tempName.trim() || 'Adik Hebat';
    onUpdateProfile(cleaned, tempAvatar);
    setIsEditingProfile(false);
    soundManager.playSuccess();
    soundManager.speak(`Halo ${cleaned}! Ayo pilih permainan yang kamu sukai!`);
  };

  const filteredGames =
    selectedCategory === 'all'
      ? GAME_CATALOG
      : GAME_CATALOG.filter((g) => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 flex flex-col">
      {/* Sticky Top Portal Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-emerald-200 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-md shrink-0">
              🏫
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 truncate">
                games.tkpaduharapankitagadingan.sch.id
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                Portal Game APE TK Paud Harapan Kita
              </div>
            </div>
          </div>

          {/* Right Actions: Stars, Certificate, Sound */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenStickers();
              }}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold px-3.5 py-2.5 rounded-2xl shadow-sm transition-all min-h-[44px] cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 fill-amber-200" />
              <span className="tabular-nums text-sm sm:text-base">{earnedStars} 🌟</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                onOpenCertificate();
              }}
              className="hidden sm:flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-sm transition-all min-h-[44px] cursor-pointer whitespace-nowrap text-sm"
            >
              <Award className="w-5 h-5" />
              <span>Sertifikat Paud</span>
            </button>

            <button
              onClick={handleToggleSound}
              className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-2xl text-slate-700 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Pengaturan Suara"
            >
              {muted ? (
                <VolumeX className="w-6 h-6 text-rose-500" />
              ) : (
                <Volume2 className="w-6 h-6 text-emerald-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto w-full flex-1 px-4 sm:px-8 py-6 sm:py-8">
        {/* Hero Welcome & Persistent Child Profile Banner */}
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border-4 border-amber-300 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide mb-3 border border-white/30">
                PORTAL LAYANAN DIGITAL ANAK USIA DINI · 6 KECERDASAN MAJEMUK
              </div>
              <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight text-balance">
                Selamat Datang, {childAvatar} {childName}!
              </h1>
              <p className="text-emerald-50 text-sm sm:text-base font-medium leading-relaxed">
                Pilih permainan edukatif di bawah ini untuk melatih warna, angka, musik, huruf, daya ingat, pola logika, dan sikap mandiri bersama TK Paud Harapan Kita Gadingan.
              </p>
            </div>

            {/* Child Profile Card / Quick Edit */}
            <div className="bg-white/95 text-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-amber-300 w-full lg:w-auto min-w-[280px]">
              {!isEditingProfile ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                      {childAvatar}
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Profil Siswa Aktif
                      </span>
                      <span className="text-lg font-black text-emerald-800 block">
                        {childName}
                      </span>
                      <span className="text-xs font-bold text-amber-600 tabular-nums">
                        {earnedStars} Stiker Bintang Terkumpul
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playPop();
                      setTempName(childName);
                      setTempAvatar(childAvatar);
                      setIsEditingProfile(true);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-all cursor-pointer min-h-[44px]"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Ubah</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 mb-1">
                      Nama Anak / Siswa:
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Masukkan nama anak..."
                      maxLength={25}
                      className="w-full px-3 py-2 rounded-xl border-2 border-emerald-300 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-600 mb-1">
                      Pilih Karakter Teman:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {AVATARS.map((av) => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => setTempAvatar(av)}
                          className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                            tempAvatar === av
                              ? 'bg-amber-200 border-amber-500 scale-110'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer min-h-[40px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Profil Anak</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Intelligence Category Filter Bar */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Pilih Kategori Kecerdasan Anak
            </h2>
            <span className="text-xs font-bold text-slate-500 tabular-nums">
              Menampilkan {filteredGames.length} Modul Permainan
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer border-2 ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Games Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredGames.map((game) => {
            const playCount = completedGames[game.id] || 0;
            return (
              <div
                key={game.id}
                className={`${game.cardStyle} border-4 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Top Metadata Line (Zero-Pill Unboxed Text with Separator) */}
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 mb-4">
                    <span>{game.intelligenceLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 tabular-nums flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {playCount > 0 ? `${playCount}x Selesai` : game.badgeText}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <button
                      onClick={() => soundManager.speak(game.voiceIntro)}
                      className="w-20 h-20 rounded-3xl bg-white border-2 border-slate-200 shadow-inner flex items-center justify-center text-5xl shrink-0 hover:scale-105 transition-transform cursor-pointer"
                      title="Dengarkan penjelasan suara"
                    >
                      {game.emoji}
                    </button>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1 leading-snug">
                        {game.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {game.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Direct Sub-Activity Shortcuts for Kebun Pintar */}
                  {game.subActivities && (
                    <div className="mb-5 pt-3 border-t border-emerald-200/70">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-2">
                        Langsung Pilih Permainan Kebun Pintar:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {game.subActivities.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              soundManager.playPop();
                              soundManager.speak(sub.label);
                              onLaunchGame(sub.id);
                            }}
                            className="bg-white hover:bg-emerald-100 border-2 border-emerald-300 rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center shadow-sm transition-all cursor-pointer min-h-[60px]"
                          >
                            <span className="text-xl mb-0.5">{sub.emoji}</span>
                            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                              {sub.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Play Action */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      soundManager.playPop();
                      soundManager.speak(game.voiceIntro);
                      onLaunchGame(game.id);
                    }}
                    className={`flex-1 ${game.btnStyle} font-extrabold py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer min-h-[48px]`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>
                      {game.id === 'kebun_pintar_hub' ? 'Buka Kebun Pintar' : 'Main Sekarang'}
                    </span>
                  </button>

                  <button
                    onClick={() => soundManager.speak(game.voiceIntro)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 shadow-sm transition-all min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
                    aria-label="Dengarkan Suara"
                    title="Dengarkan Suara"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom Rewards & Official Certificate Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-1">
                Album Stiker Bintang & Sertifikat Kelulusan APE
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Kumpulkan stiker bintang emas dari setiap permainan dan cetak sertifikat kebanggaan resmi TK Paud Harapan Kita Gadingan!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenStickers();
              }}
              className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold py-3.5 px-5 rounded-2xl shadow transition-all text-sm cursor-pointer whitespace-nowrap min-h-[48px]"
            >
              🌟 Koleksi Stiker ({earnedStars})
            </button>
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenCertificate();
              }}
              className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow transition-all text-sm cursor-pointer whitespace-nowrap min-h-[48px]"
            >
              🎓 Cetak Sertifikat
            </button>
          </div>
        </section>
      </div>

      {/* Clean Kid-Friendly School Footer */}
      <footer className="bg-white/80 border-t border-emerald-200 py-5 px-4 text-center text-xs text-slate-500 font-semibold">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Portal Game Edukatif (APE) · <strong>TK Paud Harapan Kita Gadingan</strong>
          </div>
          <div className="flex items-center gap-2">
            <span>Situs Utama Sekolah:</span>
            <a
              href="https://tkpaduharapankitagadingan.sch.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-bold"
            >
              tkpaduharapankitagadingan.sch.id
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
