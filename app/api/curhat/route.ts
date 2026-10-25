import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const geminiApiKey =
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const groqApiKey =
      process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    let replyText = null;
    const promptText = `Kamu adalah SABAR, sahabat spiritual digital yang paling ngertiin, sangat manusiawi, penuh empati, hangat, dan tidak menghakimi. 
Seseorang sedang curhat kepadamu: "${text}".

PENTING: Jangan gunakan bahasa robot, kaku, atau format template yang membosankan. Bicaralah seperti sahabat karib yang menenangkan, tulus, dan bijaksana secara islami.

Berikan respons yang mengalir natural dengan struktur yang merangkul hati:
1. **Pelukan & Empati**: Validasi perasaannya secara tulus dan mendalam, sesuaikan dengan apa yang dia ceritakan agar dia merasa didengar dan dipeluk secara emosional.
2. **Arahan & Mengingat Allah**: Ajak dia melihat sisi hikmahnya atau kenalkan pada Asmaul Husna yang relevan dengan keadaannya saat itu, jelaskan maknanya dengan lembut.
3. **Penawar dari Al-Qur'an & Sunnah**: Berikan 1 ayat Al-Qur'an atau hadis yang paling pas sebagai penyejuk batin beserta terjemahannya yang menyentuh.
4. **Langkah Tindakan & Doa**: Berikan saran ikhtiar nyata yang ringan dan menenangkan, lalu tutup dengan doa pendek penenang hati (lengkap dengan teks Arab, latin, dan artinya).`;

    // 1. Coba Jalur Gemini
    if (geminiApiKey && !replyText) {
      const geminiModels = ["gemini-3.8-flash", "gemini-1.5-flash"];
      for (const model of geminiModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
              }),
            },
          );
          const data = await res.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            replyText = data.candidates[0].content.parts[0].text;
            break;
          }
        } catch (e) {
          // Lanjut ke model/jalur berikutnya
        }
      }
    }

    // 2. Coba Jalur Groq jika Gemini belum dapat
    if (groqApiKey && !replyText) {
      const groqModels = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
      for (const model of groqModels) {
        try {
          const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${groqApiKey}`,
              },
              body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: promptText }],
                temperature: 0.85,
              }),
            },
          );
          const data = await res.json();
          if (data.choices?.[0]?.message?.content) {
            replyText = data.choices[0].message.content;
            break;
          }
        } catch (e) {
          // Lanjut ke model berikutnya
        }
      }
    }

    // 3. JARING PENGAMAN: Jika AI eksternal sedang gangguan/high demand,
    // berikan respons natural darurat secara instan agar user tidak melihat error.
    if (!replyText) {
      replyText = `1. **Pelukan & Empati**: Peluk jauh buat kamu ya... Mendengar cerita "${text}", wajar banget kalau sekarang rasanya penat dan berat banget di dada. Tarik napas dalam-dalam, izinkan dirimu istirahat sebentar. Kamu udah hebat banget karena bertahan sejauh ini.

2. **Arahan & Mengingat Allah**: 
Ingatlah selalu kepada **Al-Wadud** (Maha Pencinta & Mengasihi) dan **As-Salam** (Maha Pemberi Kesejahteraan). Dia sangat tahu lelah yang sedang kamu simpan dalam diam.

3. **Penawar dari Al-Qur'an & Sunnah**: 
- *QS. Al-Baqarah: 286*
- "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya..."

4. **Langkah Tindakan & Doa**: 
- **Doa Pilihan**: رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي (Robbis rohlii shodrii wa yassirlii amrii — Ya Allah, lapangkanlah dadaku dan mudahkanlah urusanku).
- **Ikhtiar Kecil**: Ambil air wudu, minum segelas air hangat, laluumpahkan semua uneg-unegmu dalam sujud terakhir kepada-Nya. Allah Maha Mendengar.`;
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({
      reply: `1. **Pelukan & Empati**: Tarik napas sebentar ya... Apapun beban yang sedang kamu ceritakan, Allah tidak pernah tidur dan selalu memeluk hatimu.\n\n2. **Doa Penenang**: Cukup baca: *Hasbiallahu wa ni'mal wakil* (Cukuplah Allah menjadi tempat diri bagi kami, sebaik-baiknya pelindung).`,
    });
  }
}
