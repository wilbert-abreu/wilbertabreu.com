import Link from 'next/link'
import { useRef } from 'react'
import { useState, useLayoutEffect } from 'react'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export default function Header() {
  const [isAbleToMakePayments, setIsAbleToMakePayments] = useState(false)
  
  // useLayoutEffect(() => {
  //   try {
  //     // console.warn({supportsVersion: ApplePaySession.supportsVersion(10)})
  //     if (!window?.ApplePaySession) {
  //       throw new Error('This device is not capable of making Apple Pay payments: ApplePaySession undefined')
  //     }
  //     if (!window.ApplePaySession?.supportsVersion(10)) {
  //       throw new Error('This device is not capable of making Apple Pay payments: ApplePaySession version not supported')
  //     }
  //     if (!window.ApplePaySession?.canMakePayments()) {
  //       throw new Error('This device is not capable of making Apple Pay payments')
  //     }
      
  //     window.ApplePaySession?.canMakePaymentsWithActiveCard('merchant.com.wilbertabreu')
  //       .then((isAbleToMakePayments) => {
  //         if(!isAbleToMakePayments) return console.error('canMakePaymentsWithActiveCard: User can not make payments with active card');
  //         setIsAbleToMakePayments(true)
  //       })
  //   } catch(e) {
  //     console.warn({e})
  //   }
  // }, [])
 
  const onClick = () => {
    try {
      const ApplePayPaymentRequest = {
        merchantCapabilities: [ 'supports3DS', 'supportsCredit', 'supportsDebit' ],
        supportedNetworks: ['amex', 'masterCard', 'visa', 'discover'],
        countryCode: 'US',
        currencyCode: 'USD',
        total: {
          type: 'final',
          label: 'Wilbert Abreu Blog',
          amount: '1.00'
        }
      }
      const session = new ApplePaySession(10, ApplePayPaymentRequest)

      const sendPaymentToken = (paymentToken) => {
        return new Promise(function(resolve, reject) {
          if ( debug == true )
          resolve(true);
          else
          reject;
        });
      }

      const performValidation = (url) => {
        return fetch('/api/payment/apple', {
          method: 'POST',
          body: JSON.stringify({url}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(async response => {
          if(!response.ok) {
            const responseJson = await response.json();
            const error = {
              status: response.status,
              statusText: response.statusText,
              message: responseJson.error.message
            };
            return Promise.reject(new Error(error));
          }
          return response;
        })
        .then((response) => response.json())
      }
      session.onvalidatemerchant = async (event) => {
        try {
          const merchantSession = await performValidation(event.validationURL);
          console.warn({merchantSession})
          session.completeMerchantValidation(merchantSession)
        } catch (error) {
          console.error('onvalidatemerchant failed', {error})
        }
      }

      session.onpaymentauthorized = (event) => {

        console.warn('starting session.onpaymentauthorized');
    
        // const promise = sendPaymentToken(event.payment.token);
        // promise.then(function (success) {	
          
        // });

        let status;
        if (success){
          status = window.ApplePaySession.STATUS_SUCCESS;
        } else {
          status = window.ApplePaySession.STATUS_FAILURE;
        }
        session.completePayment(status);
      }

      session.begin();
    } catch (e) {
      console.error('onpaymentauthorized failed', {e})
    }
  }

  return (
    <header className="flex items-center justify-between">
      <div>
        <Link href="/">
          <a aria-label="Blog - Wilbert Abreu">
            Home
          </a>
        </Link>
      </div>

      <div className="pl-7">
        <Link href="/email/subscribe">
          <a aria-label="Subscribe to Blog - Wilbert Abreu">
            Subscribe
          </a>
        </Link>
      </div>
      {/* {isAbleToMakePayments && <div class="apple-pay-button apple-pay-button-black" onClick={onClick} />} */}
      {/* <Elements stripe={stripePromise}></Elements> */}
      {/* <div className="text-base leading-5">
        <a href="https://tailwindcss.com" className="font-medium text-gray-500 dark:text-white hover:text-gray-700">
          Documentation &rarr;
        </a>
      </div> */}
    </header>
  )
}
