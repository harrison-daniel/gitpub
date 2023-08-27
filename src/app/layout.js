import Navbar from "./components/Navbar";
import "./globals.css";
import backgroundBeerMug from "../../public/assets/images/mug.png";
import Image from "next/image";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "gitpub",
  description: "Brewery Locator and Journal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <div>
          <Image
            alt="beermug with foam"
            src={backgroundBeerMug}
            // placeholder="blur"
            quality={100}
            fill
            sizes="100vh"
            priority
            style={{
              objectFit: "contain",
              // objectPosition: "center",
              zIndex: "-10",
              opacity: "0.85",
              top: "3.2rem",
            }}
          />
        </div>
        <div className=" ">
          <div className="mx-auto max-w-3xl ">
            <Navbar />
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
