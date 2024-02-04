import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/toaster';
import ModeToggle from './lib/ModeToggle';
import Link from 'next/link';
import Image from 'next/image';
import beerLight from '../../public/assets/images/mug.png';
import beerDark from '../../public/assets/images/beer-mug-dark8.png';
import SessionProvider from './components/SessionProvider';
import { auth } from './auth';
import { ThemeProviders } from './themeProviders';

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      userId: session.user.id,
    };
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <ThemeProviders>
            {/* backgorund Image */}
            <div>
              <div className='imgLight absolute  top-[2vh] -z-20 mx-auto h-[100vh]  w-[100vw] md:top-[4vh] '>
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
              <div className='imgDark absolute  top-[3.5vh] -z-20 h-[100vh] w-[100vw] md:top-[4.5vh] '>
                <Image
                  src={beerDark}
                  alt='Dark Theme Beer'
                  placeholder='empty'
                  className='imgDark '
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
            <div>
              <Link
                className='main-header flex justify-center pt-0.5 text-center font-serif text-7xl font-extrabold'
                href='/'>
                GitPub
              </Link>
            </div>
            <div>
              <ModeToggle />
            </div>
            <Navbar />
            {children}
            {/* <Providers>{children}</Providers> */}
            <Toaster />
          </ThemeProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
