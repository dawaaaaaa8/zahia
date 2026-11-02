# Zuwhun Ariungereld 💌

Next.js дээр хийсэн жижиг захидлын вебсайт.

## Локал дээр ажиллуулах
```bash
npm install
npm run dev
# http://localhost:3000
```

## Vercel дээр байршуулах

**Арга 1 — Vercel CLI (хамгийн хурдан):**
```bash
npm i -g vercel
vercel          # анх удаа: нэвтэрч, асуултуудад Enter дарна
vercel --prod   # бэлэн линк гарна
```

**Арга 2 — GitHub-аар:**
1. Энэ фолдерыг GitHub repo болгож push хийнэ
2. vercel.com → Add New → Project → repo-гоо сонгоно → Deploy
3. Гарсан `xxx.vercel.app` линкийг илгээнэ

Текстүүдийг өөрчлөх бол `app/page.js` доторх `SCENES` массивыг засна.
