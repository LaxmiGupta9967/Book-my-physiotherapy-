
import React, { useState, useEffect } from 'react';
import { Therapist, User } from '../types';
import { supabase } from '../lib/supabaseClient';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// 1. FRONTEND: Razorpay Live Key ID provided by user
const RAZORPAY_KEY_ID = "rzp_live_RUv2nx9Eg3xoQf"; 

// 2. BACKEND: You must set the following secrets in Supabase Dashboard > Settings > Edge Functions:
//    - RAZORPAY_KEY_ID (Same as above)
//    - RAZORPAY_KEY_SECRET (Your secret key)
// ------------------------------------------------------------------

interface PaymentProcessingModalProps {
  amount: number;
  therapist: Therapist;
  currentUser: User;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
  bookingDate: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({ amount, therapist, currentUser, onSuccess, onClose, bookingDate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'initiating' | 'processing' | 'verifying'>('initiating');

  useEffect(() => {
    initiatePayment();
  }, []);

  const initiatePayment = async () => {
    try {
        setError('');
        setLoading(true);
        setStep('initiating');
        
        // Check/Load Razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
             throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        console.log("Invoking create-razorpay-order function...");
        
        // 1. Create Order via Supabase Function
        const { data: order, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
            body: {
                amount: amount,
                receipt: `receipt_${Date.now()}`.substring(0, 40),
            }
        });

        if (orderError) {
            console.error('Supabase Invoke Error:', orderError);
            let errorMessage = 'Failed to initiate payment.';
            
            // Handle common Supabase invoke errors
            if (orderError.message) {
                 if (orderError.message.includes("Failed to send a request") || orderError.message.includes("fetch failed")) {
                    errorMessage = "Network Error: Could not connect to the backend. Please ensure the 'create-razorpay-order' function is deployed in Supabase.";
                 } else {
                    errorMessage += ` (${orderError.message})`;
                 }
            }
            throw new Error(errorMessage);
        }

        // Check if the function returned a logical error in the body
        if (!order || order.error) {
            console.error('Order Response Logic Error:', order);
            const msg = order?.error || 'Order creation failed. Please check server logs.';
            throw new Error(msg);
        }

        if (!order.id) {
             throw new Error("Invalid order received from server. Order ID is missing.");
        }

        setLoading(false);
        setStep('processing');

        // 2. Open Razorpay Checkout
        const options = {
            key: RAZORPAY_KEY_ID, 
            amount: order.amount,
            currency: order.currency,
            name: "BookMyPhysiotherapy",
            description: `Appointment with ${therapist.name}`,
            image: "https://i.postimg.cc/QtNF6WNd/Whats-App-Image-2025-10-24-at-9-45-56-AM.jpg",
            order_id: order.id,
            handler: async function (response: any) {
                setStep('verifying');
                setLoading(true);
                await verifyPayment(response, order.id);
            },
            prefill: {
                name: currentUser.name,
                email: currentUser.email || '',
                contact: '', // Can be prefilled if you have the phone number
            },
            notes: {
                therapist_id: therapist.id,
                booking_date: bookingDate
            },
            theme: {
                color: "#F59E0B"
            },
            modal: {
                ondismiss: function() {
                    // If user closes the modal, we stay in 'processing' state but show an error or option to retry
                    setLoading(false);
                    setError('Payment cancelled by user.');
                }
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
            console.error('Payment failed:', response.error);
            setError(response.error.description || 'Payment Failed');
            setLoading(false);
        });
        rzp1.open();

    } catch (err: any) {
        console.error("Payment flow error:", err);
        setError(err.message || "Something went wrong initializing payment.");
        setLoading(false);
    }
  };

  const verifyPayment = async (response: any, orderId: string) => {
      try {
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
                order_id: orderId,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
            }
        });

        if (verifyError || !verifyData?.success) {
            const msg = verifyData?.message || verifyError?.message || 'Verification failed';
            throw new Error(msg);
        }

        onSuccess(response.razorpay_payment_id);
      } catch (err: any) {
          console.error("Verification error:", err);
          setError(`Payment successful but verification failed: ${err.message}. Please contact support with Payment ID: ${response.razorpay_payment_id}`);
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 text-center relative">
        {/* Manual Close Button - Always available to prevent getting stuck */}
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {error ? (
             <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Error</h3>
                <p className="text-gray-600 mb-6 text-sm break-words">{error}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={initiatePayment} 
                        className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                    >
                        Retry Payment
                    </button>
                    <button 
                        onClick={onClose} 
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
             </>
        ) : (
            <>
                <div className="relative w-16 h-16 mx-auto mb-4">
                     <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step === 'initiating' && 'Setting up Payment...'}
                    {step === 'processing' && 'Processing Payment...'}
                    {step === 'verifying' && 'Verifying Transaction...'}
                </h3>
                <p className="text-gray-500 text-sm">
                    {step === 'processing' 
                        ? 'Please complete the payment in the popup.' 
                        : 'Please do not close this window.'}
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Amount to Pay</p>
                    <p className="text-2xl font-bold text-gray-800">₹{amount}</p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessingModal;
