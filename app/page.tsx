"use client";

import { useState, useEffect } from "react";
import { problemsData } from "../src/data";
import { AmbientSoundPlayer, ShareCardModal } from "./SabarFeatures";
import {
  Share2,
  Moon,
  Sun,
  Search,
  ArrowUpRight,
  Heart,
  Compass,
  BookOpen,
  Sparkles,
  Bookmark,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import { CurhatSection } from "./CurhatModel";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // State untuk Fitur Bookmark & Detail Modal Pop-up
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] =
    useState<boolean>(false);
  const [activeBookmarkDetail, setActiveBookmarkDetail] = useState<any>(null);

  // Load data tersimpan dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const saved = localStorage.getItem("sabar_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal memuat data favorit:", e);
      }
    }
  }, []);

  // Fungsi Toggle Simpan / Hapus Bookmark
  const toggleBookmark = (problem: any) => {
    let updated;
    if (favorites.some((fav) => fav.id === problem.id)) {
      updated = favorites.filter((fav) => fav.id !== problem.id);
    } else {
      updated = [...favorites, problem];
    }
    setFavorites(updated);
    localStorage.setItem("sabar_favorites", JSON.stringify(updated));
  };

  const quickTags = ["Rezeki", "Overthinking", "Hutang", "Kerjaan", "Keluarga"];

  const filteredProblems = problemsData.filter((problem) =>
    problem.keyword.some((kw) =>
      kw.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <main
      className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#11110f] text-[#f5f1eb]"
          : "bg-[#f8f6f2] text-[#24221f]"
      }`}
    >
      {/* Minimal warm background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className={`absolute -top-48 right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl ${
            isDarkMode ? "bg-orange-500/[0.07]" : "bg-orange-300/20"
          }`}
        />
        <div
          className={`absolute top-[34rem] left-[-10rem] h-[24rem] w-[24rem] rounded-full blur-3xl ${
            isDarkMode ? "bg-orange-600/[0.04]" : "bg-amber-200/20"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-5 sm:px-8 md:py-8">
        {/* Navigation */}
        <header className="flex items-center justify-between border-b border-black/[0.06] pb-5 dark:border-white/[0.08]">
          <a
            href="#"
            className="group flex items-center gap-3"
            aria-label="SABAR beranda"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                isDarkMode
                  ? "bg-orange-500 text-[#17120e]"
                  : "bg-[#e96b2c] text-white"
              }`}
            >
              <Compass size={21} strokeWidth={1.8} />
            </span>
            <span>
              <span
                className={`block text-lg font-semibold tracking-[0.16em] ${
                  isDarkMode ? "text-[#fff7ed]" : "text-[#28231e]"
                }`}
              >
                SABAR
              </span>
              <span
                className={`hidden text-[10px] tracking-[0.12em] sm:block ${
                  isDarkMode ? "text-stone-400" : "text-stone-500"
                }`}
              >
                RUANG UNTUK KEMBALI
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-2 rounded-full px-3 py-2 text-xs sm:flex ${
                isDarkMode
                  ? "bg-white/[0.04] text-stone-400"
                  : "bg-white/70 text-stone-500"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Qur'an & Sunnah
            </span>

            {/* Tombol Akses Bookmark Tersimpan */}
            <button
              onClick={() => setIsBookmarkModalOpen(true)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                isDarkMode
                  ? "border-white/10 bg-white/[0.05] text-orange-200 hover:bg-white/10"
                  : "border-black/[0.07] bg-white/80 text-stone-700 shadow-sm hover:bg-white"
              }`}
            >
              <Bookmark size={15} className="text-orange-500 fill-orange-500" />
              <span className="hidden sm:inline">Tersimpan</span>
              <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[10px]">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                isDarkMode
                  ? "border-white/10 bg-white/[0.05] text-orange-200 hover:bg-white/10"
                  : "border-black/[0.07] bg-white/80 text-stone-600 shadow-sm hover:bg-white"
              }`}
              aria-label={
                isDarkMode ? "Aktifkan mode terang" : "Aktifkan mode malam"
              }
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
              <span className="hidden sm:inline">
                {isDarkMode ? "Mode terang" : "Mode malam"}
              </span>
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-3xl pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
          <div
            className={`mx-auto mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-medium tracking-wide ${
              isDarkMode
                ? "border-orange-400/20 bg-orange-400/[0.07] text-orange-200"
                : "border-orange-200 bg-orange-50 text-orange-800"
            }`}
          >
            <Sparkles size={13} />
            SAHABAT ARAH BERDASARKAN AL-QUR’AN & SUNNAH
          </div>

          <h1
            className={`text-4xl font-medium leading-[1.12] tracking-[-0.045em] sm:text-6xl ${
              isDarkMode ? "text-[#f7f1e9]" : "text-[#27231f]"
            }`}
          >
            Sedang mencari{" "}
            <span className="font-serif italic text-[#e96b2c]">arah?</span>
          </h1>
          <p
            className={`mx-auto mt-5 max-w-xl text-sm leading-7 sm:text-base ${
              isDarkMode ? "text-stone-400" : "text-stone-600"
            }`}
          >
            Saat hidup terasa berat, berhenti sejenak. Kembali kepada Allah.
            Temukan petunjuk dari Al-Qur’an dan Sunnah, lalu mulai dari satu
            langkah.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-2xl text-left">
            <label
              htmlFor="sabar-search"
              className={`mb-2.5 block pl-1 text-xs font-medium ${
                isDarkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              APA YANG SEDANG MERISAUKAN HATIMU HARI INI?
            </label>
            <div
              className={`group flex items-center gap-3 rounded-2xl border p-2 transition-all focus-within:ring-4 ${
                isDarkMode
                  ? "border-white/10 bg-[#1b1a17] focus-within:border-orange-400/50 focus-within:ring-orange-500/10"
                  : "border-stone-200 bg-white shadow-[0_12px_35px_rgba(42,30,18,0.055)] focus-within:border-orange-300 focus-within:ring-orange-500/10"
              }`}
            >
              <Search
                className={`ml-3 shrink-0 ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}
                size={19}
              />
              <input
                id="sabar-search"
                type="text"
                placeholder="Contoh: rezeki, rasa takut, hutang..."
                className={`min-w-0 flex-1 bg-transparent py-3 text-sm outline-none sm:text-base ${
                  isDarkMode
                    ? "text-stone-100 placeholder:text-stone-600"
                    : "text-stone-800 placeholder:text-stone-400"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-stone-400 hover:bg-white/5"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  Hapus
                </button>
              )}
              <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#e96b2c] text-white sm:flex">
                <ArrowUpRight size={18} />
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span
                className={`mr-1 text-xs ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}
              >
                Coba mulai dari
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className={`rounded-full border px-3.5 py-2 text-xs transition-all cursor-pointer ${
                    isDarkMode
                      ? "border-white/[0.08] bg-white/[0.035] text-stone-300 hover:border-orange-400/30 hover:bg-orange-400/[0.08] hover:text-orange-200"
                      : "border-stone-200/80 bg-white/70 text-stone-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Curhat section */}
        <section className="mx-auto max-w-4xl pb-10">
          <div
            className={`mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] ${
              isDarkMode ? "text-stone-500" : "text-stone-400"
            }`}
          >
            <span
              className={`h-px flex-1 ${isDarkMode ? "bg-white/10" : "bg-stone-200"}`}
            />
            <span>Atau mulai dengan bercerita</span>
            <span
              className={`h-px flex-1 ${isDarkMode ? "bg-white/10" : "bg-stone-200"}`}
            />
          </div>
          <div
            className={`rounded-2xl border p-1 ${
              isDarkMode
                ? "border-white/[0.07] bg-white/[0.025]"
                : "border-stone-200/80 bg-white/60"
            }`}
          >
            <CurhatSection isDarkMode={isDarkMode} />
          </div>
        </section>

        {/* Search results */}
        {searchQuery.length > 0 && (
          <section className="mx-auto max-w-4xl space-y-5 pb-16 pt-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-medium uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-orange-300" : "text-orange-700"
                  }`}
                >
                  HASIL PENCARIAN
                </p>
                <h2
                  className={`mt-1 text-xl font-medium tracking-tight ${
                    isDarkMode ? "text-stone-100" : "text-stone-800"
                  }`}
                >
                  Petunjuk untuk “{searchQuery}”
                </h2>
              </div>
              <span
                className={`text-xs ${isDarkMode ? "text-stone-500" : "text-stone-400"}`}
              >
                {filteredProblems.length} hasil
              </span>
            </div>

            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => {
                const isBookmarked = favorites.some(
                  (fav) => fav.id === problem.id,
                );

                return (
                  <article
                    key={problem.id}
                    className={`overflow-hidden rounded-2xl border transition-colors ${
                      isDarkMode
                        ? "border-white/[0.08] bg-[#191916]"
                        : "border-stone-200/90 bg-white shadow-[0_8px_28px_rgba(42,30,18,0.035)]"
                    }`}
                  >
                    <div
                      className={`border-b px-5 py-5 sm:px-7 ${
                        isDarkMode
                          ? "border-white/[0.07] bg-white/[0.02]"
                          : "border-stone-100 bg-[#fffdfa]"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                            isDarkMode
                              ? "bg-orange-400/10 text-orange-300"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          <Compass size={15} />
                        </span>
                        <span
                          className={`text-[11px] font-medium uppercase tracking-[0.13em] ${
                            isDarkMode ? "text-stone-500" : "text-stone-400"
                          }`}
                        >
                          RUANG REFLEKSI
                        </span>
                      </div>
                      <h2
                        className={`text-xl font-semibold tracking-tight sm:text-2xl ${
                          isDarkMode ? "text-stone-100" : "text-stone-800"
                        }`}
                      >
                        {problem.title}
                      </h2>
                    </div>

                    <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                      <section>
                        <p
                          className={`mb-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                            isDarkMode ? "text-orange-300" : "text-orange-800"
                          }`}
                        >
                          Mengingat Allah
                        </p>
                        <p
                          className={`text-2xl font-medium ${
                            isDarkMode ? "text-[#f5e8d9]" : "text-stone-800"
                          }`}
                        >
                          {problem.asmaulHusna.arabic}
                        </p>
                        <p
                          className={`mt-1 text-sm ${
                            isDarkMode ? "text-stone-400" : "text-stone-500"
                          }`}
                        >
                          {problem.asmaulHusna.meaning}
                        </p>
                      </section>

                      <section
                        className={`rounded-xl border p-4 sm:p-5 ${
                          isDarkMode
                            ? "border-white/[0.07] bg-black/10"
                            : "border-stone-100 bg-[#faf8f4]"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <BookOpen
                            size={15}
                            className={
                              isDarkMode ? "text-orange-300" : "text-orange-700"
                            }
                          />
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                              isDarkMode ? "text-stone-300" : "text-stone-600"
                            }`}
                          >
                            {problem.quran.surah}
                          </p>
                        </div>
                        <p
                          className={`text-sm leading-7 sm:text-base ${
                            isDarkMode ? "text-stone-200" : "text-stone-700"
                          }`}
                        >
                          “{problem.quran.text}”
                        </p>
                      </section>

                      <section
                        className={`rounded-xl border p-4 sm:p-5 ${
                          isDarkMode
                            ? "border-white/[0.07] bg-black/10"
                            : "border-stone-100 bg-[#faf8f4]"
                        }`}
                      >
                        <p
                          className={`mb-3 text-xs font-semibold uppercase tracking-[0.1em] ${
                            isDarkMode ? "text-stone-300" : "text-stone-600"
                          }`}
                        >
                          Hadits
                        </p>
                        <p
                          className={`text-sm leading-7 sm:text-base ${
                            isDarkMode ? "text-stone-200" : "text-stone-700"
                          }`}
                        >
                          “{problem.hadith.text}”
                        </p>
                        <p
                          className={`mt-3 text-xs font-medium ${
                            isDarkMode ? "text-stone-500" : "text-stone-500"
                          }`}
                        >
                          — {problem.hadith.source}
                        </p>
                      </section>

                      <section>
                        <p
                          className={`mb-3 text-xs font-semibold uppercase tracking-[0.12em] ${
                            isDarkMode ? "text-orange-300" : "text-orange-800"
                          }`}
                        >
                          Doa yang dianjurkan
                        </p>
                        <p
                          className={`mb-4 text-right text-2xl leading-[2.2] ${
                            isDarkMode ? "text-[#f5e8d9]" : "text-stone-800"
                          }`}
                        >
                          {problem.doa.arabic}
                        </p>
                        <p
                          className={`text-sm leading-6 ${
                            isDarkMode ? "text-stone-300" : "text-stone-600"
                          }`}
                        >
                          {problem.doa.latin}
                        </p>
                        <p
                          className={`mt-2 text-sm italic leading-6 ${
                            isDarkMode ? "text-stone-400" : "text-stone-500"
                          }`}
                        >
                          Artinya: “{problem.doa.meaning}”
                        </p>
                      </section>

                      <section>
                        <p
                          className={`mb-3 text-xs font-semibold uppercase tracking-[0.12em] ${
                            isDarkMode ? "text-orange-300" : "text-orange-800"
                          }`}
                        >
                          Langkah praktis · Ikhtiar
                        </p>
                        <ul
                          className={`space-y-3 text-sm leading-6 ${
                            isDarkMode ? "text-stone-300" : "text-stone-700"
                          }`}
                        >
                          {problem.solution.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span
                                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                                  isDarkMode ? "bg-orange-400" : "bg-[#e96b2c]"
                                }`}
                              />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      {/* Tombol Aksi di Kartu */}
                      <div
                        className={`flex items-center justify-end gap-3 border-t pt-5 ${
                          isDarkMode
                            ? "border-white/[0.08]"
                            : "border-stone-100"
                        }`}
                      >
                        <button
                          onClick={() => toggleBookmark(problem)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                            isBookmarked
                              ? "border-orange-500 bg-orange-500 text-white"
                              : isDarkMode
                                ? "border-white/10 bg-white/[0.03] text-stone-300 hover:bg-white/10"
                                : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          <Bookmark
                            size={15}
                            className={isBookmarked ? "fill-white" : ""}
                          />
                          {isBookmarked ? "Tersimpan" : "Simpan ayat"}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProblem(problem);
                            setIsShareOpen(true);
                          }}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                            isDarkMode
                              ? "border-orange-400/20 bg-orange-400/[0.07] text-orange-200 hover:bg-orange-400/[0.13]"
                              : "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100"
                          }`}
                        >
                          <Share2 size={15} /> Bagikan pesan ini
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div
                className={`rounded-2xl border px-6 py-12 text-center ${
                  isDarkMode
                    ? "border-white/[0.08] bg-white/[0.02]"
                    : "border-stone-200 bg-white/70"
                }`}
              >
                <Search
                  size={24}
                  className={`mx-auto mb-4 ${
                    isDarkMode ? "text-stone-600" : "text-stone-400"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-stone-200" : "text-stone-700"
                  }`}
                >
                  Belum ada catatan yang cocok.
                </p>
                <p
                  className={`mt-2 text-sm ${
                    isDarkMode ? "text-stone-500" : "text-stone-500"
                  }`}
                >
                  Coba kata kunci yang lebih umum, atau ceritakan keadaanmu
                  melalui fitur Curhat.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer
          className={`mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 border-t py-6 text-center text-xs sm:flex-row sm:text-left ${
            isDarkMode
              ? "border-white/[0.08] text-stone-500"
              : "border-stone-200 text-stone-500"
          }`}
        >
          <p className="flex items-center gap-2">
            <Heart size={13} className="text-[#e96b2c]" />
            <span>SABAR · Sahabat Arah Berdasarkan Al-Qur’an & Sunnah.</span>
          </p>
          <p>Semoga Allah selalu jaga kamu, yaa.</p>
        </footer>
      </div>

      {/* Modal Daftar Bookmark Tersimpan */}
      {isBookmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={`w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl shadow-2xl border p-6 overflow-hidden ${
              isDarkMode
                ? "bg-[#191916] border-white/10 text-stone-100"
                : "bg-white border-stone-200 text-stone-800"
            }`}
          >
            {/* Header Modal */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-300/20">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <Bookmark size={16} className="fill-orange-500" />
                </span>
                <h2 className="font-serif text-lg font-medium tracking-wide">
                  Ayat & Doa Tersimpan
                </h2>
              </div>
              <button
                onClick={() => setIsBookmarkModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-500/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* List Item Tersimpan */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1">
              {favorites.length === 0 ? (
                <div className="text-center py-12 opacity-60 space-y-2">
                  <Bookmark
                    size={36}
                    className="mx-auto stroke-1 text-orange-500"
                  />
                  <p className="text-sm font-medium">
                    Belum ada ayat atau doa yang disimpan.
                  </p>
                  <p className="text-xs">
                    Klik tombol "Simpan ayat" pada kartu hasil pencarian untuk
                    menyimpannya di sini.
                  </p>
                </div>
              ) : (
                favorites.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveBookmarkDetail(item);
                    }}
                    className={`p-4 rounded-2xl border transition-all relative group cursor-pointer hover:border-orange-500/50 flex items-center justify-between gap-4 ${
                      isDarkMode
                        ? "bg-black/20 border-white/[0.08]"
                        : "bg-[#faf8f4] border-stone-200/80"
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-sm mb-1 text-orange-600 dark:text-orange-300">
                        {item.title}
                      </h3>
                      <p className="text-xs opacity-80 line-clamp-1 mb-2">
                        "{item.quran?.text || item.doa?.meaning}"
                      </p>
                      <span className="text-[11px] opacity-60">
                        {item.quran?.surah || "Doa Pilihan"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(item);
                        }}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-stone-300/20 text-center text-[11px] opacity-50">
              Klik salah satu untuk langsung membaca isinya secara penuh.
            </div>
          </div>
        </div>
      )}

      {/* Modal Pop-up Detail Isi Ayat Tersimpan (Dilengkapi Tombol Bagikan) */}
      {activeBookmarkDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl shadow-2xl border p-6 md:p-8 overflow-hidden ${
              isDarkMode
                ? "bg-[#191916] border-white/10 text-stone-100"
                : "bg-white border-stone-200 text-stone-800"
            }`}
          >
            {/* Header Detail Modal */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-300/20">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-orange-500">
                  TERSIMPAN DI PERANGKATMU
                </span>
                <h2 className="font-serif text-xl font-semibold mt-0.5">
                  {activeBookmarkDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveBookmarkDetail(null)}
                className="p-2 rounded-full hover:bg-stone-500/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Konten Detail Lengkap */}
            <div className="flex-grow overflow-y-auto py-6 space-y-6 pr-2">
              {/* Mengingat Allah */}
              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Mengingat Allah
                </p>
                <p className="text-2xl font-medium">
                  {activeBookmarkDetail.asmaulHusna.arabic}
                </p>
                <p className="text-sm opacity-70">
                  {activeBookmarkDetail.asmaulHusna.meaning}
                </p>
              </section>

              {/* Qur'an */}
              <section
                className={`p-4 rounded-2xl border ${isDarkMode ? "border-white/[0.07] bg-black/20" : "border-stone-200 bg-[#faf8f4]"}`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  {activeBookmarkDetail.quran.surah}
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                  “{activeBookmarkDetail.quran.text}”
                </p>
              </section>

              {/* Doa */}
              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Doa yang Dianjurkan
                </p>
                <p className="mb-3 text-right text-2xl leading-[2.2]">
                  {activeBookmarkDetail.doa.arabic}
                </p>
                <p className="text-sm leading-relaxed">
                  {activeBookmarkDetail.doa.latin}
                </p>
                <p className="mt-1 text-sm italic opacity-70">
                  Artinya: “{activeBookmarkDetail.doa.meaning}”
                </p>
              </section>

              {/* Ikhtiar */}
              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Langkah Praktis · Ikhtiar
                </p>
                <ul className="space-y-2 text-sm">
                  {activeBookmarkDetail.solution.map(
                    (step: string, idx: number) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        <span>{step}</span>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            </div>

            {/* Footer Detail Modal dengan Tombol Bagikan & Tutup */}
            <div className="pt-4 border-t border-stone-300/20 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedProblem(activeBookmarkDetail);
                  setIsShareOpen(true);
                }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                  isDarkMode
                    ? "border-orange-400/20 bg-orange-400/[0.07] text-orange-200 hover:bg-orange-400/[0.13]"
                    : "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100"
                }`}
              >
                <Share2 size={15} /> Bagikan pesan ini
              </button>

              <button
                onClick={() => setActiveBookmarkDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <ShareCardModal
        item={selectedProblem}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <AmbientSoundPlayer />
    </main>
  );
}
