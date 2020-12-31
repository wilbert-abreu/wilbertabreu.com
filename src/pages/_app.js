import React from 'react'
import '@/css/global.scss'
import Head from 'next/head'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import MoonSvg from './moon.svg'
import SunSvg from './sun.svg'
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
  
  return isDarkModeCookieValue === 'true'
}

const ColorModeProvider = ({ children}) => {
  const [isDarkMode, toggleDarkMode] = React.useState(isDarkModeInitial());
  
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
  const onClick = React.useCallback(() => {
    toggleDarkMode()
  }, [])
  return (
    <button onClick={onClick} className="block px-5 py-2 mt-2 ml-auto bg-opacity-0 border-none appearance-none cursor-pointer focus:outline-none">
      <div className="relative w-12 h-2 duration-200 bg-gray-200 ease-only transition-bgColor rounded-2xl dark:bg-gray-600">
        <div className="absolute flex items-center justify-center w-6 h-6 duration-200 transform bg-white shadow-md ease-only transition-bgColorTransformBoxShadow rounded-xl dark:bg-gray-700 dark:shadow-lg dark:translate-x-7 -left-1 -top-2">
          <SunSvg className="opacity-100 transform translate-x-1.5 transition-opacity duration-200 w-3.5 h-3.5 fill-current text-transparent overflow-x-hidden overflow-y-hidden dark:opacity-0"/>
          <MoonSvg className="opacity-0 transform -translate-x-1.5 transition-opacity duration-200 w-3.5 h-3.5 fill-current text-transparent overflow-x-hidden overflow-y-hidden dark:opacity-100"/>
        </div>
      </div>
    </button> 
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
                  return match ? match.pop() : undefined;
                }
                
                if(readCookie('_darkMode') === 'true' || (readCookie('_darkMode') === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
