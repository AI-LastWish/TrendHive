import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "./server"; // Replace `require` with an ES module import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrendHive",
  description: "A Next.js app with a stunning layout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo with Link to Home */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="bg-white text-blue-600 font-bold text-xl rounded-full h-10 w-10 flex items-center justify-center">
            T
          </span>
          <h1 className="text-2xl font-semibold">TrendHive</h1>
        </Link>
        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-lg">
            <li>
              <Link
                href="/summary"
                className="hover:text-blue-300 transition duration-300"
              >
                Summary
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="flex justify-center space-x-4 mb-2">
          {/* Social Links */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition duration-300"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition duration-300"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition duration-300"
          >
            GitHub
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} TrendHive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
