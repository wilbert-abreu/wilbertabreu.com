import styles from './index.module.scss'

const CheckmarkSVG = () => {
    return (
        <svg class={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
            <path class={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
    )
}

export default CheckmarkSVG