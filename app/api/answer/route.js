// Сүүлийн сонголтыг хийхэд танд мэдэгдэл илгээнэ.
//
// 1) ntfy (анхдагч, бүртгэлгүй): утсандаа "ntfy" апп суулгаад
//    доорх NTFY_TOPIC нэрээр "Subscribe" хийхэд л болно.
// 2) Telegram (заавал биш): Vercel → Settings → Environment Variables дээр
//    TELEGRAM_BOT_TOKEN болон TELEGRAM_CHAT_ID нэмбэл Telegram-аар ч ирнэ.

const NTFY_TOPIC = process.env.NTFY_TOPIC || "zahia-57f9007993e4";

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {}

  const answer = body.answer === "yes" ? "yes" : body.answer === "wait" ? "wait" : null;
  if (!answer) return Response.json({ ok: false }, { status: 400 });

  const time = new Date().toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" });
  const title = answer === "yes" ? "💗 Тэр ТИЙМ гэж хариуллаа!" : "🕊️ Тэр хугацаа хүслээ";
  const message =
    answer === "yes"
      ? `"${body.label || "Тийм, ярилцъя"}" товчийг дарлаа. Одоо түүнтэй тайван ярилцаарай ♡\n${time}`
      : `"${body.label || "Жаахан хугацаа хэрэгтэй"}" товчийг дарлаа. Түүнд зай, хугацаа өгөөрэй.\n${time}`;

  const jobs = [];

  if (NTFY_TOPIC) {
    jobs.push(
      fetch("https://ntfy.sh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: NTFY_TOPIC,
          title,
          message,
          tags: answer === "yes" ? ["heart", "tada"] : ["dove"],
          priority: 4,
        }),
      })
    );
  }

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    jobs.push(
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text: `${title}\n\n${message}` }),
      })
    );
  }

  await Promise.allSettled(jobs);
  return Response.json({ ok: true });
}