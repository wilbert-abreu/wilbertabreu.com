import React from 'react'
import '@/css/global.scss'
import Head from 'next/head'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import { DarkModeProvider, DarkModeToggler } from '@/components/DarkModeEnabler'

export default function App({ Component, pageProps }) {
  return (
    <div className="antialiased h-full">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Head>
      <SectionContainer className="flex h-15 justify-between align-center">
        <div className="order-2 flex align-center">
          <DarkModeProvider>
            <DarkModeToggler />
          </DarkModeProvider>
        </div>
        
        <Header />
      </SectionContainer>
      <SectionContainer>
        <main>
          <Component {...pageProps} />
        </main>
      </SectionContainer>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-K1G6CMMTLG" />
      <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K1G6CMMTLG');
            `,
          }}
        ></script>
    </div>
  )
}
