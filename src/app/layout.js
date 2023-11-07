import { Providers } from './providers';
import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/toaster';
import ModeToggle from './lib/ModeToggle';
import Background from './components/Background';

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div className=' mt-0.5 text-center font-serif text-7xl font-extrabold dark:text-amber-700'>
          GitPub
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
