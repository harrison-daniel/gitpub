import Navbar from './components/Navbar';
import './globals.css';
import backgroundBeerMug from '../../public/assets/images/mug.png';
import Image from 'next/image';
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'gitpub',
  description: 'Brewery Locator and Journal',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      {/* <body className={inter.className}> */}
      <body>
        <div className='flex justify-center'>
          <Image
            alt='beermug with foam'
            src={backgroundBeerMug}
            quality={100}
            priority
            position='center'
            // height={810}
            style={{
              position: 'absolute',
              sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
              zIndex: '-10',
              opacity: '0.85',
              top: '6rem',
            }}
          />
        </div>
        <div className='mx-auto max-w-3xl '>
          <Navbar />
          <div className='mt-8'>{children}</div>
        </div>
      </body>
    </html>
  );
}
