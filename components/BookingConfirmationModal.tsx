import React from 'react';
import { Therapist } from '../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  therapist: Therapist | null;
  onClose: () => void;
  onGoToProfile: () => void;
  isPaid?: boolean;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  therapist,
  onClose,
  onGoToProfile,
  isPaid = false,
}) => {
  if (!isOpen || !therapist) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        <div className="p-8 text-center flex-grow flex flex-col justify-center">
            {isPaid && (
              <div className="mb-4 inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold fade-in-up delay-75 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Payment Received
              </div>
            )}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 pop-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 fade-in-up delay-100">Appointment Finalized!</h3>
            <p className="text-gray-600 mt-2 fade-in-up delay-200">Your appointment with {therapist.name} is confirmed. A confirmation has been sent to your email.</p>
            <p className="text-sm text-gray-500 mt-1 fade-in-up delay-300">You can view and manage your appointments on your profile page.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-center items-center gap-3 flex-shrink-0">
            <button onClick={onGoToProfile} className="w-full sm:w-auto px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold">
                View My Bookings
            </button>
            <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;