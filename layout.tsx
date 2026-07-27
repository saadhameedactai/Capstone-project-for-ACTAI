import "./globals.css";

export const metadata = {
  title: "PrimeCampus Admissions",
  description: "HSSC Part 1 admission portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <header className="bg-navy text-paper px-6 py-4 flex items-center justify-between">
          <span className="font-display text-xl tracking-wide">PrimeCampus</span>
          <span className="text-sm text-brass">HSSC Admissions Portal</span>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
