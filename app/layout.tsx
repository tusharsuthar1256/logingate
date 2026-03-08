import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import CursorSpotlight from './(components)/CursorSpotlight';
import Script from 'next/script';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOGINGATE - Email Intelligence Shield",
  description: "Protect your platform with LOGINGATE's advanced fraud detection and email verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      theme: dark,
    }}>
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <head>
          <Script type="text/javascript" strategy="afterInteractive" id="microsoft-clarity">
            {` 
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vsnkdnvofb");
`}
          </Script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <CursorSpotlight />
        </body>
      </html>
    </ClerkProvider>
  );
}
