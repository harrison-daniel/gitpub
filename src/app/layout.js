import { Providers } from './providers';
import Navbar from './components/Navbar';
import './globals.css';
export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
