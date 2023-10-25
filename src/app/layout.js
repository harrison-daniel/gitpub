import { Providers } from './providers';
import Navbar from './components/Navbar';
import './globals.css';
import { Toaster } from './components/ui/toaster';

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div className='mb-2 mt-6 text-center font-serif text-7xl font-extrabold md:mb-0'>
          GitPub
        </div>

        <Navbar />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
