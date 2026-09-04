import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vitrin",
  description: "Commerce & Landing Page OS untuk kreator dan UMKM Indonesia."
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
