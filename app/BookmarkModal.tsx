"use client";

import React from "react";
import { Bookmark, X, Trash2 } from "lucide-react";

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: any[];
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemove,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl shadow-2xl border p-6 overflow-hidden ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-stone-200 text-stone-800"
        }`}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-4 border-b border-stone-200/20">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-600" />
            <h2 className="font-serif text-lg font-medium tracking-wide">
              Ayat & Doa Tersimpan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-500/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Item Tersimpan */}
        <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 opacity-60 space-y-2">
              <Bookmark className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-sm">Belum ada ayat atau doa yang disimpan.</p>
              <p className="text-xs">
                Klik ikon bookmark pada kartu hasil pencarian untuk menyimpannya
                di sini.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all relative group ${
                  isDarkMode
                    ? "bg-slate-950/60 border-slate-800"
                    : "bg-stone-50 border-stone-200"
                }`}
              >
                <h3 className="font-semibold text-sm mb-1 text-amber-700 dark:text-amber-400">
                  {item.title}
                </h3>
                <p className="text-xs opacity-80 line-clamp-2 mb-3">
                  {item.quran?.text || item.doa?.meaning}
                </p>

                <div className="flex justify-between items-center text-[11px] opacity-60 border-t pt-2 border-stone-300/20">
                  <span>{item.quran?.surah || "Doa Pilihan"}</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Modal */}
        <div className="pt-4 border-t border-stone-200/25 text-center text-xs opacity-60">
          Disimpan secara lokal di peramban perangkatmu.
        </div>
      </div>
    </div>
  );
};
