import Navbar from './components/Navbar';
import './globals.css';
// import { Toaster } from './components/ui/toaster';
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
  title: 'GitPub',
  description: 'Brewery Locator and Journal',
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b45309' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  // interactiveWidget: 'resizes-visual',
};

export default async function RootLayout({ children }) {
  // const session = getServerSession();
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
      <body>
        <SessionProvider session={session}>
          <ThemeProviders>
            {/* backgorund Image */}
            <div>
              <div className='imgLight absolute top-[2vh] -z-20 mx-auto h-[100vh] w-[100vw] md:top-[4vh]'>
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
              <div className='imgDark absolute top-[3.5vh] -z-20 h-[100vh] w-[100vw] md:top-[4.5vh]'>
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
            {children}

            <Toaster />
          </ThemeProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
