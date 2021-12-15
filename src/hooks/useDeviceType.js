import { useMemo } from "react";
import useHandleWindowResize from './useHandleWindowResize'
import UAParser from 'ua-parser-js'

const useDeviceType = ({ defaultSSRDeviceType = 'desktop', throttle = 0 } = {}) => {
    if(typeof window === 'undefined') {
        const defaultDeviceType = global.deviceType || defaultSSRDeviceType
        if(['mobile', 'tablet', 'desktop'].includes(defaultDeviceType)) {
            console.error('useDeviceType hook: defaultDeviceType must equal "mobile", "tablet", or "desktop"')
        }
        return { 
            isMobile: defaultDeviceType === 'mobile' || false, 
            isTablet: defaultDeviceType === 'tablet' || false, 
            isDesktop: defaultDeviceType === 'desktop' || true, 
            deviceType: defaultDeviceType,
            isServer: true
        }
    }

    const { device: { type: parsedDeviceType } } = UAParser()
    const width = useHandleWindowResize({ throttle })

    const isDesktop = useMemo(() =>  (width > 1024 || !parsedDeviceType), [width, parsedDeviceType])
    const isTablet = useMemo(() => !!parsedDeviceType && (width <= 1024) || parsedDeviceType === 'tablet', [width, parsedDeviceType]);
    const isMobile = useMemo(() => !isDesktop && (width <= 768 || parsedDeviceType === 'mobile'), [isDesktop, width, parsedDeviceType]);
    const deviceType = useMemo(() =>  isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile', [isDesktop, isTablet])

    return useMemo(() => ({ isMobile, isTablet, isDesktop, deviceType, isServer: false }), [isMobile, isTablet, isDesktop, deviceType])
}

export default useDeviceType