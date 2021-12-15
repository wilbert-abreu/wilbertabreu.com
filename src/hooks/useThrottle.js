import { useRef, useCallback } from 'react'


const useThrottle = (cb = () => {}, { throttle = 0 }) => {
    const isThrottled = useRef(false)
    const isNoThrottle = throttle === 'none'

    const throttledCB = () => {
        if(isNoThrottle || !isThrottled.current) {
            cb()
            if(!isNoThrottle) {
                isThrottled.current = true;
                setTimeout(() => {
                    isThrottled.current = false;
                }, throttle)
            }
        }
    }

    return throttledCB
}

export default useThrottle