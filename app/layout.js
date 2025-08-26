import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar"; // Import the new Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BITS Pilani | Hostel Complaints",
  description: "Register and track hostel-related complaints.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <Toaster position="top-center" />
          <Navbar />
          {/* Add padding-top to push content below the fixed navbar */}
          <main className="pt-24 container mx-auto px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}