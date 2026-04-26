import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "Nipun — 3D Developer Portfolio",
  description:
    "Data Science Student | Frontend Developer | AI Explorer. An immersive 3D portfolio experience showcasing GitHub projects, LeetCode stats, and more.",
  keywords: ["Nipun", "Portfolio", "Developer", "Data Science", "AI", "Next.js", "3D"],
  authors: [{ name: "Nipun" }],
  openGraph: {
    title: "Nipun — 3D Developer Portfolio",
    description: "An immersive 3D developer portfolio with live GitHub and LeetCode data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nipun — 3D Developer Portfolio",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable} ${inter.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          background: "#030712",
          color: "#f9fafb",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  )
}
