import styles from './index.module.scss'

const Subscribe = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.image}>
                    <img src="/profile-pic.jpg" height="50" width="50" />
                </div> 
                
                <div className={styles.title}>Wilbert's Abreu Blog</div>
                <div className={styles.subtitle}>Musings of a lifelong learner</div>
                <div className={styles.subscribe}>
                    <input className={styles.input}/>
                    <button className={styles.cta}>Subscribe</button>
                </div>
                <div className={styles.preview}>Let me Try First {'>'}</div>
            </div>
        </div>
    )
}

export default Subscribe