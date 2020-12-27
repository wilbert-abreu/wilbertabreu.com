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
      // console.warn({supportsVersion: ApplePaySession.supportsVersion(10)})
      if (!window?.ApplePaySession) {
        throw 'This device is not capable of making Apple Pay payments: ApplePaySession undefined';
      }
      if (!window.ApplePaySession?.supportsVersion(10)) {
        throw 'This device is not capable of making Apple Pay payments: ApplePaySession version not supported';
      }
      if (!window.ApplePaySession?.canMakePayments()) {
        throw 'This device is not capable of making Apple Pay payments';
      }
      
      window.ApplePaySession?.canMakePaymentsWithActiveCard('merchant.com.wilbertabreu')
        .then((isAbleToMakePayments) => {
          if(!isAbleToMakePayments) throw 'User can not make payments with active card'
          setIsAbleToMakePayments(true)
        })
    } catch(e) {
      console.warn({e})
    }
  }, [])
 
  const onClick = () => {
    try {
      // const applePayMethod = {
      //   supportedMethods: "https://apple.com/apple-pay",
      //   data: {
      //     version: 3,
      //     merchantIdentifier: "merchant.com.example",
      //     merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      //     supportedNetworks: ["amex", "discover", "masterCard", "visa"],
      //     countryCode: "US",
      //   },
      // };
      const ApplePayPaymentRequest = {
        merchantCapabilities: [ 'supports3DS', 'supportsEMV', 'supportsCredit', 'supportsDebit' ],
        supportedNetworks: ['amex', 'masterCard', 'visa' ],
        countryCode: 'US',
        total: {
          type: 'final',
          label: 'Wilbert Abreu Blog',
          amount: '13.00',
          currencyCode: 'USD'
        }
      }
      const session = window?.ApplePaySession(10, ApplePayPaymentRequest)

      const sendPaymentToken = (paymentToken) => {
        return new Promise(function(resolve, reject) {
          console.warn('starting function sendPaymentToken()');
          console.warn(paymentToken);
          
          if ( debug == true )
          resolve(true);
          else
          reject;
        });
      }

      const performValidation = (url) => {
        return fetch('/payment/apple', {
          method: 'POST',
          body: JSON.stringify({url}),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
      }
      session.onvalidatemerchant = async (event) => {
        try {
          const merchantSession = await performValidation(event.validationURL);
          session.completeMerchantValidation(merchantSession)
        } catch (e) {
          console.error('onvalidatemerchant failed', {e})
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
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/">
          <a aria-label="Blog - Wilbert Abreu">
            Home
          </a>
        </Link>
      </div>
      {isAbleToMakePayments && <div class="apple-pay-button apple-pay-button-black" onClick={onClick} />}
      {/* <Elements stripe={stripePromise}></Elements> */}
      {/* <div className="text-base leading-5">
        <a href="https://tailwindcss.com" className="font-medium text-gray-500 dark:text-white hover:text-gray-700">
          Documentation &rarr;
        </a>
      </div> */}
    </header>
  )
}
