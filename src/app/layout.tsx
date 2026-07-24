import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Better Than Yesterday - Đánh Dấu Nỗ Lực Mỗi Ngày',
  description: 'Ứng dụng theo dõi thói quen tốt, loại bỏ thói quen xấu (vệ sinh cá nhân sáng/tối, thể dục, học tập, nấu ăn) giúp bạn tốt hơn 1% mỗi ngày.',
  keywords: ['habit tracker', 'effort tracker', 'skincare routine', 'gym routine', 'supabase', 'kỷ luật bản thân'],
  authors: [{ name: 'Better Than Yesterday' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased selection:bg-amber-500 selection:text-white bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
