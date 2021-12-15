import React from 'react'
import styles from './index.module.scss'
import Link from 'next/link'
import Subscribe from '@/components/Subscribe'

const EmailPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <div className={styles.image}>
                <img src="/profile-pic.jpg" height="50" width="50" />
            </div> 
            
            <div className={styles.title}>Wilbert Abreu's Blog</div>
            <div className={styles.subtitle}>Musings of a lifelong learner</div>
            <div className="h-12"></div>
            <Subscribe />
            <div className={styles.preview}>  
                <Link href="/">{`Let me try first >`}</Link>
            </div>
        </div>
    </div>
)

export default EmailPage