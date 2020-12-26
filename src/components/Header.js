import Link from 'next/link'
import { useRef } from 'react'
import { useState, useLayoutEffect } from 'react'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export default function Header() {
  const [isAbleToMakePayments, setIsAbleToMakePayments] = useState(false)
  
  useLayoutEffect(() => {
    try {
      if (window?.ApplePaySession?.canMakePayments()) {
        setIsAbleToMakePayments(true)
      }

      window?.ApplePaySession?.canMakePaymentsWithActiveCard('merchant.com.wilbertabreu').then((test) => console.warn({test}))
    } catch(e) {
      console.warn({e})
    }
  }, [])

  console.warn({isAbleToMakePayments})
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/">
          <a aria-label="Blog - Wilbert Abreu">
            Home

          </a>
        </Link>
      </div>
      <div class="apple-pay-button apple-pay-button-black"/>
      {/* <Elements stripe={stripePromise}></Elements> */}
      {/* <div className="text-base leading-5">
        <a href="https://tailwindcss.com" className="font-medium text-gray-500 dark:text-white hover:text-gray-700">
          Documentation &rarr;
        </a>
      </div> */}
    </header>
  )
}
