
import React from 'react';
import { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string) => void;
  onFillIntakeForm: (bookingId: string) => void;
  onViewIntakeForm: (bookingId: string) => void;
  isPast?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancelBooking, onRescheduleBooking, onFillIntakeForm, onViewIntakeForm, isPast = false }) => {
  const { therapist, date, time } = booking;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const getStatusBadge = () => {
    if (isPast && !['cancelled', 'completed'].includes(booking.status || '')) {
      return <span className="mt-2 text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-gray-600 bg-gray-200">Completed</span>;
    }
    switch (booking.status) {
      case 'checked-in':
        return <span className="mt-2 text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-200">Checked-In</span>;
      case 'cancelled':
        return <span className="mt-2 text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-red-700 bg-red-100">Cancelled</span>;
      case 'confirmed':
         return <span className="mt-2 text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-teal-700 bg-teal-100">Confirmed</span>;
      default:
        return null;
    }
  };

  const isCancelled = booking.status === 'cancelled';

  return (
    <>
    <div className={`border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition-shadow hover:shadow-md ${isCancelled ? 'bg-red-50 opacity-80' : isPast ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div className="flex-grow">
        <h3 className={`text-xl font-bold text-gray-800 ${isCancelled ? 'line-through' : ''}`}>{therapist.name}</h3>
        <p className={`text-amber-600 font-medium ${isCancelled ? 'line-through' : ''}`}>{therapist.title}</p>
        
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Patient:</span> {booking.patientName}
          </p>
          {booking.service && (
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Service:</span> {booking.service}
            </p>
          )}
          <p className="text-sm text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a5 5 0 00-5 5c0 4.418 5 11 5 11s5-6.582 5-11a5 5 0 00-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            {therapist.location}
          </p>
        </div>
      </div>
      <div className="text-left md:text-right w-full md:w-auto mt-4 md:mt-0 md:border-l md:pl-6">
        <p className={`text-lg font-semibold text-gray-700 ${isCancelled ? 'line-through' : ''}`}>{formattedDate}</p>
        <p className={`text-amber-500 font-bold text-xl ${isCancelled ? 'line-through' : ''}`}>{time}</p>
         {getStatusBadge()}
      </div>
      <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2">
        {!isPast && !isCancelled && (
          <>
            {booking.intakeForm ? (
                <button 
                    onClick={() => onViewIntakeForm(booking.id)}
                    className="w-full sm:w-auto bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300 font-semibold text-sm"
                >
                    View Form
                </button>
            ) : (
                <button 
                    onClick={() => onFillIntakeForm(booking.id)}
                    className="w-full sm:w-auto bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition duration-300 font-semibold text-sm animate-pulse"
                >
                    Fill Intake Form
                </button>
            )}
           
            <button 
                onClick={() => onRescheduleBooking(booking.id)}
                className="w-full sm:w-auto bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition duration-300 font-semibold text-sm"
            >
                Reschedule
            </button>

            <button 
                onClick={() => onCancelBooking(booking.id)}
                className="w-full sm:w-auto bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition duration-300 font-semibold text-sm"
            >
                Cancel
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default BookingCard;
