import React from 'react'
import '@/css/global.scss'
import Head from 'next/head'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'

const ColorModeContext = React.createContext();

const readCookie = (key) => {
  if(process.browser) {
    const match = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
    return match ? match.pop() : undefined;
  }
  
  return undefined
}

const writeCookie = (key, value) => {
  document.cookie = `${key}=${value}`;
  return true;
}
const deleteCookie = key => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const darkModeCookieKey = '_darkMode'

const isDarkModeInitial = () => {
  const isDarkModeCookieValue = readCookie(darkModeCookieKey)
  const isMacDarkModeEnabled = process.browser && window?.matchMedia('(prefers-color-scheme: dark)').matches
  if(isDarkModeCookieValue === undefined && isMacDarkModeEnabled) {
    return true
  }
  
  return isDarkModeCookieValue
}

const ColorModeProvider = ({ children}) => {
  const [isDarkMode, toggleDarkMode] = React.useState(!!isDarkModeInitial());
  const prevDarkModeValue = React.useRef(isDarkMode)

  React.useLayoutEffect(() => {
    if(isDarkMode) {
      document.body.classList.add("dark")
      writeCookie(darkModeCookieKey, true)
      prevDarkModeValue.current = isDarkMode
    } else {
      if(prevDarkModeValue.current) {
        document.body.classList.remove("dark")
        writeCookie(darkModeCookieKey, false)
        prevDarkModeValue.current = isDarkMode
      } 
    }
  }, [isDarkMode])

  return (
    <ColorModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ColorModeContext.Provider>
  )
}

const useColor = () => {
  const { isDarkMode, toggleDarkMode } = React.useContext(ColorModeContext);
  return [isDarkMode, () => toggleDarkMode(prev => !prev)]
}

const ColorModeToggler = () => {
  const [isDarkMode, toggleDarkMode] = useColor()
  return (
    <div className="flex items-center justify-end mt-5">
      <div className="relative right-0 inline-block w-10 mr-2 align-middle select-none">
          <input onClick={() => toggleDarkMode()} type="checkbox" name="toggle" id="toggle" className="absolute block w-6 h-6 bg-white border-4 rounded-full outline-none appearance-none cursor-pointer toggle-checkbox" defaultChecked={isDarkMode}/>
          <label for="toggle" className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"></label>
      </div>
      <label htmlFor="toggle" className={'text-xs text-gray-700 dark:text-white'}>Dark Mode?</label>
    </div>
  )
}

export default function App({ Component, pageProps }) {

  return (
    <div className="antialiased">
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
      <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const readCookie = (key) => {
                  const match = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
                  return match ? match.pop() : '';
                }
                if(readCookie('_darkMode')) {
                  document.body.classList.add("dark")
                }
              })()
            `,
          }}
        ></script>
      <SectionContainer>
        <ColorModeProvider>
          <ColorModeToggler />
        </ColorModeProvider>
        <Header />
      </SectionContainer>
      <SectionContainer>
        <main>
          <Component {...pageProps} />
        </main>
      </SectionContainer>
    </div>
  )
}
