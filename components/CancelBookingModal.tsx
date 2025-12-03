
import React from 'react';
import { Booking } from '../types';

interface CancelBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: (bookingId: string) => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({ booking, onClose, onConfirm }) => {
  if (!booking) return null;

  const { therapist, date, time } = booking;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-5">
            <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Confirm Cancellation</h2>
          <div className="mt-4">
            <p className="text-gray-600">
              Are you sure you want to cancel your appointment with <span className="font-semibold text-gray-800">{therapist.name}</span>?
            </p>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg border">
                <p className="font-semibold text-gray-700">{formattedDate}</p>
                <p className="font-bold text-amber-600">{time}</p>
            </div>
            <p className="text-sm text-red-600 mt-4">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-center sm:items-center sm:space-x-4 gap-3">
            <button 
                onClick={onClose} 
                className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold"
            >
                Nevermind
            </button>
            <button 
                onClick={() => onConfirm(booking.id)}
                className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
                Confirm Cancellation
            </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;