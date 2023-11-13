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

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div>
          <Link
            className='main-header mt-0.5 flex justify-center text-center font-serif text-7xl font-extrabold'
            href='/'>
            GitPub
          </Link>
        </div>
        <ModeToggle />
        <Background />
        <Navbar />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
