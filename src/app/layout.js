import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/sonner';

import ModeToggle from './lib/ModeToggle';
import Link from 'next/link';
import Image from 'next/image';
import beerLight from '../../public/assets/images/mug.png';
import beerDark from '../../public/assets/images/beer-mug-dark8.png';
import SessionProvider from './components/SessionProvider';
import { auth } from './auth';
import { ThemeProviders } from './themeProviders';

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ),
  title: 'GitPub',
  description: 'Brewery Locator and Journal',
  openGraph: {
    title: 'GitPub',
    description: 'Discover and track your favorite breweries',
    images: [{ url: '/assets/images/icon-512.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary',
    title: 'GitPub',
    description: 'Discover and track your favorite breweries',
    images: ['/assets/images/icon-512.png'],
  },
  icons: {
    icon: [
      {
        url: '/assets/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/assets/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [{ url: '/assets/images/apple-touch-icon.png' }],
    shortcut: '/assets/images/icon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b45309' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default async function RootLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      id: session.user.id,
    };
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex h-[100dvh] flex-col overflow-hidden'>
        <SessionProvider session={session}>
          <ThemeProviders>
            <div>
              <div className='imgLight fixed top-[2vh] -z-20 mx-auto h-[100dvh] w-[100vw] md:top-[4vh]'>
                <Image
                  src={beerLight}
                  alt='Light Theme Beer'
                  className='imgLight'
                  placeholder='empty'
                  quality={75}
                  priority
                  fill
                  sizes='100% '
                  style={{
                    objectFit: 'contain ',
                  }}
                />
              </div>
              <div className='imgDark fixed top-[3.5vh] -z-20 h-[100dvh] w-[100vw] md:top-[4.5vh]'>
                <Image
                  src={beerDark}
                  alt='Dark Theme Beer'
                  placeholder='empty'
                  className='imgDark'
                  quality={75}
                  priority
                  sizes='100% '
                  fill
                  style={{
                    objectFit: 'contain ',
                  }}
                />
              </div>
            </div>
            <div className='main-header mx-auto flex justify-center'>
              <Link
                className='pt-0.5 text-center font-serif text-7xl font-extrabold'
                href='/'>
                GitPub
              </Link>
            </div>
            <div>
              <ModeToggle />
            </div>
            <Navbar />
            <main className='flex-1 overflow-y-auto'>
              {children}
            </main>

            <Toaster />
          </ThemeProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
