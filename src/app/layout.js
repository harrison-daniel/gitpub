import { Providers } from './providers';
import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/toaster';
import ModeToggle from './lib/ModeToggle';
import Background from './components/Background';
import Link from 'next/link';

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Link
          className='main-header mt-0.5 flex justify-center text-center font-serif text-7xl font-extrabold'
          href='/'>
          GitPub
        </Link>
        <ModeToggle />
        <Background />
        <Navbar />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
