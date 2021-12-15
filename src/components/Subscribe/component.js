import React from 'react'
import styles from './index.module.scss'
import CheckmarkSVG from './CheckmarkSVG'
import { useRouter } from 'next/router'
import useDeviceType from '@/hooks/useDeviceType'
import TapSVG from './tap.svg'

const Subscribe = ({ emailType = 'subscribe' }) => {
    const router = useRouter()
    const inputRef = React.useRef(null)
    const [subState, setSubState] = React.useState('')
    const { isMobile, isTablet, isServer } = useDeviceType()
    const { type = emailType } = router.query
    const isSubscribePage = type === 'subscribe'

    const onClick = React.useCallback(async () => {
        const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!inputRef.current?.value?.match(validate)) {
            setSubState('invalid')
            return 
        }
        setSubState('loading')
        try {
            const response = await fetch(`${window.location.origin}/api/email/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: inputRef.current?.value
                })
            })
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json()
            if(isSubscribePage && json.message === 'User already tried subscribed') {
                setSubState('alreadySubscribed')
            } else {
                setSubState('done')
            }
        } catch (err) {
            console.error({err})
            setSubState('error')
        }
    }, [])

    React.useEffect(() => {
        if(subState === 'done') {
            setTimeout(() => {
                router.push('/')
            }, 4000)     
        }
    }, [subState])

    const handleKeypress = e => {
      if (e.key === 'Enter') {
        onClick();
      }
    };

    return ((isMobile || isTablet) && isSubscribePage) ? (
        <div className={styles.subscribe}>
            <a className={`${styles.cta} ${styles.mobileCta} text-white`} href="mailto:subscribewilbertabreublog@gmail.com?subject=Subscribe%20Me%20Please!&body=Subscribe%20me%20to%20Wilbert%20Abreu's%20Blog!">
                <TapSVG height="30" fill="white" className="pr-4"/>
                {
                    subState === 'loading' && (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )
                }
                {
                    subState === 'done' && (
                        <CheckmarkSVG />
                    )
                }
                One Tap Subscribe
            </a>
        </div>
    ) : (
        <>
            <div className={styles.subscribe}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    placeholder="Type your email..."
                    type="email"
                    name="email"
                    pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
                    onKeyPress={handleKeypress}
                />
                <button className={styles.cta} onClick={onClick}>
                    {
                        subState === 'loading' && (
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )
                    }
                    {
                        subState === 'done' && (
                            <CheckmarkSVG />
                        )
                    }
                    {isSubscribePage ? 'Subscribe' : 'Unsubscribe'}
                </button>
            </div>
            {/* {isMobile && <div></div>} */}
            {subState === 'invalid' && (
                <div className="pt-5 dark:text-red-300">Email Format invalid</div>
            )}
            {subState === 'error' && (
                <div className="pt-5 dark:text-red-300">Error subscribing</div>
            )}
            {subState === 'alreadySubscribed' && (
                <div className="pt-5 dark:text-red-300">User already subscribed</div>
            )}
        </>
    )
}

export default Subscribe