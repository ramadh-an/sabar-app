"use client";

import { useState } from "react";
import {
  MessageSquareHeart,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface CurhatSectionProps {
  isDarkMode: boolean;
}

export const CurhatSection: React.FC<CurhatSectionProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputCurhat, setInputCurhat] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCurhatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputCurhat.trim();
    if (!text) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/curhat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(
          data.error ||
            "Maaf, sepertinya ada kendala saat meresapi curhatanmu. Coba ceritakan lagi ya.",
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setAiResponse(
        "Terjadi kesalahan koneksi. Ingatlah bahwa Allah selalu mendengarkan setiap bisikan hatimu.",
      );
    } finally {
      setLoading(false);
    }
  };

  const muted = isDarkMode ? "text-stone-400" : "text-stone-500";

  const iconStyle = isDarkMode
    ? "bg-orange-400/10 text-orange-300"
    : "bg-orange-50 text-orange-700";

  const panelStyle = isDarkMode
    ? "border-white/[0.08] bg-[#191916] text-[#f5f1eb]"
    : "border-stone-200/90 bg-white text-[#24221f]";

  return (
    <div className="my-2">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
            isDarkMode
              ? "border-white/[0.07] bg-[#191916] hover:border-orange-400/25 hover:bg-[#201e1a]"
              : "border-stone-200/90 bg-white hover:border-orange-200 hover:bg-[#fffdfa]"
          }`}
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${iconStyle}`}
          >
            <MessageSquareHeart className="h-5 w-5" strokeWidth={1.8} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              Sini, cerita...
              <Sparkles className="h-3.5 w-3.5 text-[#e96b2c]" />
            </span>
            <span className={`mt-1 block text-xs leading-5 ${muted}`}>
              Curhat bebas dengan ruang aman. Ceritakan apa saja, dan semoga
              hati terasa lebih ringan setelahnya.
            </span>
          </span>

          <ChevronDown className="h-4 w-4 shrink-0 text-[#e96b2c] transition-transform group-hover:translate-y-0.5" />
        </button>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border shadow-[0_8px_28px_rgba(42,30,18,0.035)] transition-all duration-300 ${panelStyle}`}
        >
          <div
            className={`flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-7 ${
              isDarkMode
                ? "border-white/[0.07] bg-white/[0.02]"
                : "border-stone-100 bg-[#fffdfa]"
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
              >
                <MessageSquareHeart className="h-5 w-5" strokeWidth={1.8} />
              </span>

              <div className="pt-0.5">
                <h3
                  className={`text-lg font-semibold tracking-tight ${
                    isDarkMode ? "text-stone-100" : "text-stone-800"
                  }`}
                >
                  Sini, cerita...
                </h3>
                <p className={`mt-1 max-w-xl text-xs leading-5 ${muted}`}>
                  Ruang aman untuk mencurahkan isi hati. Ceritakan apa saja
                  secara bebas. Semoga setelahnya, hati terasa lebih ringan dan
                  damai.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setAiResponse(null);
                setInputCurhat("");
              }}
              className={`shrink-0 rounded-lg p-2 transition-colors ${
                isDarkMode
                  ? "text-stone-400 hover:bg-white/[0.06] hover:text-stone-100"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`}
              title="Tutup sesi curhat"
              aria-label="Tutup sesi curhat"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 sm:p-7">
            {!aiResponse ? (
              <form onSubmit={handleCurhatSubmit} className="space-y-4">
                <label
                  htmlFor="curhat-message"
                  className={`block text-xs font-medium tracking-wide ${muted}`}
                >
                  APA YANG SEDANG ADA DI PIKIRANMU?
                </label>

                <textarea
                  id="curhat-message"
                  rows={4}
                  value={inputCurhat}
                  onChange={(e) => setInputCurhat(e.target.value)}
                  placeholder="Aku baru saja kehilangan orang terdekat, rasanya berat banget dan bingung harus gimana..."
                  className={`w-full resize-y rounded-xl border px-4 py-3.5 text-sm leading-6 outline-none transition-all focus:ring-4 ${
                    isDarkMode
                      ? "border-white/[0.09] bg-[#11110f] text-stone-100 placeholder:text-stone-600 focus:border-orange-400/50 focus:ring-orange-500/10"
                      : "border-stone-200 bg-[#faf8f4] text-stone-800 placeholder:text-stone-400 focus:border-orange-300 focus:ring-orange-500/10"
                  }`}
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`flex items-start gap-1.5 text-[11px] leading-5 ${muted}`}
                  >
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Curhatanmu bersifat 100% anonim, privat, dan tidak disimpan
                    untuk publik.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !inputCurhat.trim()}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e96b2c] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#d85b20] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sedang memproses...
                      </>
                    ) : (
                      <>
                        Kirim cerita
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div
                  className={`whitespace-pre-line rounded-xl border p-4 text-sm leading-7 sm:p-5 ${
                    isDarkMode
                      ? "border-orange-400/15 bg-orange-400/[0.04] text-stone-200"
                      : "border-orange-100 bg-[#fff8f2] text-stone-700"
                  }`}
                >
                  {aiResponse}
                </div>

                <div
                  className={`flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between ${
                    isDarkMode ? "border-white/[0.08]" : "border-stone-100"
                  }`}
                >
                  <p className={`text-xs leading-5 ${muted}`}>
                    Luangkan waktu untuk membaca dan mencerna respons ini.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setAiResponse(null);
                      setInputCurhat("");
                    }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors ${
                      isDarkMode
                        ? "border-white/[0.09] text-stone-300 hover:bg-white/[0.05]"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Cerita hal lain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
