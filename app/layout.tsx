import "./globals.css";
import Footer from "@/ui/footer/Footer";
import Navbar from "@/ui/navbar/Navbar";
import {Roboto}  from "next/font/google";
import Provider from "@/wrappers/Provider";

const poppins = Roboto({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // multiple weights
});


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
          <Provider>
          <Navbar />
          <main className={`w-full min-h-screen bg-gradient-to-t from-violet-700 to-indigo-800`}>{children}</main>
          <Footer />
          </Provider>
      </body>
    </html>
  );
}