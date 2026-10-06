import type { Metadata } from 'next';
import './globals.css';
import { SentinelProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'VIT Campus Map | Vellore',
  description:
    'VIT Vellore campus map: SJT, PRP classrooms, hostels, gates, mess menus, and emergency navigation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen w-screen overflow-hidden bg-black text-slate-100 antialiased">
        <SentinelProvider>
          {children}
        </SentinelProvider>
      </body>
    </html>
  );
}
