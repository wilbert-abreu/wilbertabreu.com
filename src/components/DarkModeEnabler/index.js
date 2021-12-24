import MoonSvg from './moon.svg'
import SunSvg from './sun.svg'

const DarkModeContext = React.createContext();

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
  const isDarkModeCookieValue = process.browser ? readCookie(darkModeCookieKey) : global.cookies[darkModeCookieKey]
  const isMacDarkModeEnabled = process.browser && window?.matchMedia('(prefers-color-scheme: dark)').matches

  if(isDarkModeCookieValue === undefined && isMacDarkModeEnabled) {
    return true
  }
  
  return isDarkModeCookieValue === 'true'
}

export const DarkModeProvider = ({ children}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(isDarkModeInitial());
  const toggleDarkMode = () => setIsDarkMode(prev => !prev)

  React.useEffect(() => {
    const darkModeMediaQuery = window?.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addEventListener('change', (mediaQueryTest) => {
      if(mediaQueryTest.matches) {
        setIsDarkMode(true)
      } else {
        setIsDarkMode(false)
      }
    });
  }, [])
  React.useLayoutEffect(() => {
    if(isDarkMode) {
      document.body.classList.add("dark")
      writeCookie(darkModeCookieKey, true)
    } else {
        document.body.classList.remove("dark")
        writeCookie(darkModeCookieKey, false)
    }
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode
      }}
    >
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
      {children}
    </DarkModeContext.Provider>
  )
}

const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  return [isDarkMode, toggleDarkMode]
}

export const DarkModeToggler = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()
  const onClick = React.useCallback(() => {
    toggleDarkMode()
  }, [])
  return (
    <button onClick={onClick} className="block px-5 py-2 mt-2 pr-0 mr-0 ml-auto bg-opacity-0 border-none appearance-none cursor-pointer tapHighlightColor-none focus:outline-none">
      <div className="relative w-12 h-2 duration-200 bg-gray-200 ease-only transition-bgColor rounded-2xl dark:bg-gray-600">
        <div className="absolute flex items-center justify-center w-6 h-6 duration-200 transform bg-white shadow-md ease-only transition-bgColorTransformBoxShadow rounded-xl dark:bg-gray-700 dark:shadow-lg dark:translate-x-7 -left-1 -top-2">
          <SunSvg className="opacity-100 transform translate-x-1.5 transition-opacity duration-200 w-3.5 h-3.5 fill-current text-transparent overflow-x-hidden overflow-y-hidden dark:opacity-0"/>
          <MoonSvg className="opacity-0 transform -translate-x-1.5 transition-opacity duration-200 w-3.5 h-3.5 fill-current text-transparent overflow-x-hidden overflow-y-hidden dark:opacity-100"/>
        </div>
      </div>
    </button> 
  )
}