"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Music,
  CloudRain,
  SkipForward,
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";

// --- 1. AMBIENT SOUND & NASHEED PLAYER ---
export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<"rain" | "nasheed">("rain");

  const playlist = [
    {
      title: "Nasheed Taweel Alshawq - Ahmed Bukhatir",
      src: "/nasheed-taweel.mp3",
    },
    {
      title: "Nasheed - I Rise Motivational",
      src: "/nasheed-motivational.mp3",
    },
    { title: "Nasheed - Ya Quluban", src: "/nasheed-yaquluban.mp3" },
    {
      title: "Nasheed - Wedding Muhammad Al Muqit",
      src: "/nasheed-wedding.mp3",
    },
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioTagRef = useRef<HTMLAudioElement | null>(null);

  const stopAllAudio = () => {
    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop();
      noiseSourceRef.current.disconnect();
      noiseSourceRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (audioTagRef.current) {
      audioTagRef.current.pause();
      audioTagRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const playRain = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.15;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(0);
    noiseSourceRef.current = whiteNoise;
    setIsPlaying(true);
  };

  const playNasheed = () => {
    if (!audioTagRef.current) return;
    audioTagRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((e) => {
        console.log("Nasheed play error:", e);
      });
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAllAudio();
    } else {
      if (soundType === "rain") {
        playRain();
      } else {
        playNasheed();
      }
    }
  };

  const switchSoundType = (type: "rain" | "nasheed") => {
    stopAllAudio();
    setSoundType(type);
    setTimeout(() => {
      if (type === "rain") {
        playRain();
      } else {
        playNasheed();
      }
    }, 100);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setSoundType("nasheed");
    stopAllAudio();
    setTimeout(() => {
      if (audioTagRef.current) {
        audioTagRef.current.load();
        playNasheed();
      }
    }, 150);
  };

  useEffect(() => {
    const audioEl = audioTagRef.current;
    if (!audioEl) return;

    const handleEnded = () => {
      nextTrack();
    };

    audioEl.addEventListener("ended", handleEnded);
    return () => {
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <audio
        ref={audioTagRef}
        src={playlist[currentTrackIndex].src}
        preload="auto"
      />

      {/* Kontrol Pemilih Audio (Hujan / Nasheed / Skip) */}
      <div className="bg-[#191916]/90 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-orange-500/30 flex items-center gap-1">
        <button
          onClick={() => switchSoundType("rain")}
          className={`p-2 rounded-full transition cursor-pointer ${
            soundType === "rain"
              ? "bg-orange-600 text-white"
              : "text-stone-400 hover:text-stone-100"
          }`}
          title="Suara Hujan"
        >
          <CloudRain className="w-4 h-4" />
        </button>
        <button
          onClick={() => switchSoundType("nasheed")}
          className={`p-2 rounded-full transition cursor-pointer ${
            soundType === "nasheed"
              ? "bg-orange-600 text-white"
              : "text-stone-400 hover:text-stone-100"
          }`}
          title="Nasheed Pilihan"
        >
          <Music className="w-4 h-4" />
        </button>

        {soundType === "nasheed" && (
          <button
            onClick={nextTrack}
            className="p-2 rounded-full transition cursor-pointer text-stone-400 hover:text-stone-100 hover:bg-orange-600/50"
            title="Putar Nasheed Selanjutnya"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tombol Utama Play / Pause Audio */}
      <button
        onClick={toggleSound}
        className="flex items-center gap-2 bg-[#191916]/95 backdrop-blur-md text-orange-200 px-4 py-3 rounded-full shadow-xl border border-orange-500/40 hover:bg-[#252520] transition-all cursor-pointer"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse text-orange-400" />
        ) : (
          <VolumeX className="w-5 h-5 text-stone-400" />
        )}
        <span className="text-xs font-medium max-w-[120px] truncate">
          {isPlaying
            ? soundType === "rain"
              ? "Suara Hujan"
              : playlist[currentTrackIndex].title
            : "Putar Audio"}
        </span>
      </button>
    </div>
  );
};

// --- 2. SHARE CARD MODAL ---
export interface ProblemItem {
  id: number;
  title: string;
  asmaulHusna: {
    arabic: string;
    meaning: string;
  };
  quran: {
    surah: string;
    text: string;
  };
  hadith: {
    text: string;
    source: string;
  };
  doa: {
    arabic: string;
    latin: string;
    meaning: string;
  };
  solution: string[];
}

interface ShareCardModalProps {
  item: ProblemItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const shareText = `🕊️ Pesan dari SABAR:\n\n"${item.title}"\n\n✨ Mengingat Allah:\n${item.asmaulHusna.arabic}\n${item.asmaulHusna.meaning}\n\n📖 ${item.quran.surah}:\n"${item.quran.text}"\n\n📜 Hadist:\n"${item.hadith.text}" (${item.hadith.source})\n\n🤲 Doa Pilihan:\n${item.doa.arabic}\n(${item.doa.latin})\nArtinya: "${item.doa.meaning}"\n\n💡 Langkah Ikhtiar:\n${item.solution.map((step, i) => `${i + 1}.${step}`).join("\n")}\n\nSemoga kamu menemukan ketenangan batin & solusi spiritualmu dengan SABAR, semoga Allah selalu menjaga kamu yaa!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#191916] border border-orange-500/30 w-full max-w-lg rounded-3xl p-6 text-stone-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 transition cursor-pointer p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-serif font-medium text-orange-400 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" /> Bagikan Ketukan Jiwa
        </h3>

        {/* Preview Kartu */}
        <div className="bg-black/30 border border-white/[0.08] rounded-2xl p-5 mb-5 text-sm space-y-4 shadow-inner">
          <div className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold flex items-center gap-1.5">
            <Sparkles size={12} /> Sobat sabar! ini ya? yang kamu cari...
          </div>
          <p className="font-semibold text-stone-100 text-base">{item.title}</p>

          <div className="text-xs text-stone-300">
            <span className="text-orange-300 font-medium">
              Mengingat Allah:
            </span>{" "}
            {item.asmaulHusna.arabic} ({item.asmaulHusna.meaning})
          </div>

          <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            <p className="italic text-stone-300 text-xs mb-1.5">
              "{item.quran.text}"
            </p>
            <p className="text-right text-[11px] text-orange-400 font-medium">
              ({item.quran.surah})
            </p>
          </div>

          {/* Doa Pilihan */}
          <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.05] space-y-2">
            <p className="text-xs font-semibold text-orange-300">
              Doa Pilihan:
            </p>
            <p className="text-xl text-right text-stone-100 leading-loose font-serif">
              {item.doa.arabic}
            </p>
            <p className="text-xs font-medium text-stone-300">
              {item.doa.latin}
            </p>
            <p className="text-xs text-stone-400 italic">
              Artinya: "{item.doa.meaning}"
            </p>
          </div>

          {/* Langkah Ikhtiar */}
          <div className="text-xs text-stone-300 space-y-1.5">
            <span className="text-orange-300 font-medium">
              Langkah Ikhtiar:
            </span>
            <ul className="list-disc list-inside space-y-1 text-stone-400">
              {item.solution.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-orange-600/20"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Berhasil Disalin ke Clipboard!" : "Salin Kartu & Teks"}
          </button>
        </div>
      </div>
    </div>
  );
};
