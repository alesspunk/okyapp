import "./globals.css";

export const metadata = {
  title: "OKY Truth & Lie",
  description: "Mini juego multijugador de Two Truths & One Lie para sesiones en vivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
