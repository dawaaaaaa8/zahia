import "./globals.css";

export const metadata = {
  title: "Зөвхөн Ариунгэрэлд 💌",
  description: "Чамд нэг жижигхэн зүйл бэлдсэн юм аа...",
  openGraph: {
    title: "Зөвхөн Ариунгэрэлд 💌",
    description: "Чамд нэг жижигхэн зүйл бэлдсэн юм аа...",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffc9d6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}