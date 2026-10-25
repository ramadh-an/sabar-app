import { NextResponse } from "next/server";

export const maxDuration = 30;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const SYSTEM_PROMPT = `Kamu adalah SABAR, sahabat spiritual digital yang paling ngertiin, sangat manusiawi, penuh empati, hangat, dan tidak menghakimi.

PENTING: Jangan gunakan bahasa robot, kaku, atau format template yang membosankan. Bicaralah seperti sahabat karib yang menenangkan, tulus, dan bijaksana secara islami.

Berikan respons yang mengalir natural dengan struktur yang merangkul hati:
1. **Pelukan & Empati**: Validasi perasaannya secara tulus dan mendalam, sesuaikan dengan apa yang dia ceritakan agar dia merasa didengar dan dipeluk secara emosional.
2. **Arahan & Mengingat Allah**: Ajak dia melihat sisi hikmahnya atau kenalkan pada Asmaul Husna yang relevan dengan keadaannya saat itu, jelaskan maknanya dengan lembut.
3. **Penawar dari Al-Qur'an & Sunnah**: Berikan 1 ayat Al-Qur'an atau hadis yang paling pas sebagai penyejuk batin beserta terjemahannya yang menyentuh.
4. **Langkah Tindakan & Doa**: Berikan saran ikhtiar nyata yang ringan dan menenangkan, tutup dengan doa pendek penenang hati (lengkap dengan teks Arab, latin, dan artinya).`;

const FALLBACK_REPLY = `1. **Pelukan & Empati**: Peluk jauh buat kamu ya... Mendengar cerita yang kamu bagikan, wajar banget kalau sekarang rasanya penat dan berat di dada. Tarik napas dalam-dalam, izinkan dirimu istirahat sebentar. Kamu udah hebat banget karena bertahan sejauh ini.

2. **Arahan & Mengingat Allah**: 
Ingatlah selalu kepada **Al-Wadud** (Maha Pencinta & Mengasihi) dan **As-Salam** (Maha Pemberi Kesejahteraan). Dia sangat tahu lelah yang sedang kamu simpan dalam diam.

3. **Penawar dari Al-Qur'an & Sunnah**: 
- *QS. Al-Baqarah: 286*
- "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya..."

4. **Langkah Tindakan & Doa**: 
- **Doa Pilihan**: رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي (Robbis rohlii shodrii wa yassirlii amrii — Ya Allah, lapangkanlah dadaku dan mudahkanlah urusanku).
- **Ikhtiar Kecil**: Ambil air wudu, minum segelas air hangat, lalu tumpahkan semua uneg-unegmu dalam sujud terakhir kepada-Nya. Allah Maha Mendengar.`;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { reply: "Ceritakan dulu apa yang kamu rasakan ya..." },
        { status: 400 },
      );
    }

    // Key hanya di server, JANGAN pakai NEXT_PUBLIC_
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY belum diset di environment variables!");
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `Seseorang sedang curhat kepadamu: "${text}"` }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
            // Hapus baris di bawah ini kalau muncul error 400 di log
            thinkingConfig: { thinkingLevel: "low" },
          },
        }),
      },
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("ERROR DARI GEMINI:", geminiRes.status, data?.error);
      throw new Error(data?.error?.message || `HTTP ${geminiRes.status}`);
    }

    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      console.warn("Gemini finishReason:", finishReason); // MAX_TOKENS = terpotong
    }

    // Gabungkan semua part teks (model baru bisa mengembalikan >1 part)
    const replyText = data.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!replyText) {
      console.error("Respon Gemini kosong:", JSON.stringify(data));
      throw new Error("Respon Gemini kosong atau diblokir.");
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("DETAIL ERROR API GEMINI:", error.message || error);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
