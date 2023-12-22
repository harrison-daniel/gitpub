import { Providers } from './providers';
import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/toaster';
import ModeToggle from './lib/ModeToggle';
// import Background from './components/Background';
import Link from 'next/link';
import Image from 'next/image';
import beerLight from '../../public/assets/images/mug.png';
import beerDark from '../../public/assets/images/beer-mug-dark8.png';
import SessionProvider from './components/SessionProvider';
// import { getServerSession } from 'next-auth/next';
import { auth } from './auth';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export default async function RootLayout({ children }) {
  // const session = await getServerSession();
  const session = await auth();

  return (
    <html lang='en'>
      <body>
        <SessionProvider session={session}>
          {/* backgorund Image */}
          <div className='absolute  right-0 top-0 -z-10   h-[100vh] w-[100vw] '>
            <div className='imgLight absolute  top-[50px]  -z-20 h-full w-full '>
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
            <div className='imgDark absolute  top-[34px] -z-20  h-full  w-full '>
              <Image
                src={beerDark}
                alt='Dark Theme Beer'
                placeholder='empty'
                className='imgDark '
                quality={75}
                priority
                sizes='100 '
                fill
                style={{
                  objectFit: 'contain ',
                }}
              />
            </div>
          </div>
          <div>
            <Link
              className='main-header mt-0.5 flex justify-center text-center font-serif text-7xl font-extrabold'
              href='/'>
              GitPub
            </Link>
          </div>
          <div className=''>
            <ModeToggle />
          </div>
          {/* <Background /> */}
          <Navbar />
          <Providers>{children}</Providers>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
