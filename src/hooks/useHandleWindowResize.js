import { useRef, useCallback, useEffect, useState } from 'react'
import useIsMounted from './useIsMounted'
import useThrottle from './useThrottle'

const getWidth = () => window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth;

const useHandleWindowResize = ({ cb = () => {}, throttle = 'none' }) => {
    const isMounted = useIsMounted();
    const [width, setWidth] = useState(() => getWidth());
    const setDeviceWidth = useCallback(() => setWidth(() => getWidth()), [])

    const handleWindowResize = useThrottle(useCallback(() => {
        setDeviceWidth()
        cb()
    }, []), { throttle })

    useEffect(() => {
        if(isMounted) {
            window.addEventListener('resize', handleWindowResize);
        }

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [isMounted]);

    return width
}

export default useHandleWindowResize