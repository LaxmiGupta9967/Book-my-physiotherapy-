
import React, { useState } from 'react';
import { Therapist, User } from '../types';

interface BookingModalProps {
  therapist: Therapist;
  currentUser: User | null;
  onClose: () => void;
  onConfirm: (details: { date: Date; time: string; patientName: string; phoneNo: string; service: string; }) => void;
  isRescheduling?: boolean;
}

const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const BookingModal: React.FC<BookingModalProps> = ({ therapist, currentUser, onClose, onConfirm, isRescheduling = false }) => {
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [phoneNo, setPhoneNo] = useState('');
  const [service, setService] = useState(therapist.specialties[0] || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [error, setError] = useState('');

  const handleConfirmClick = () => {
    if (!patientName || !phoneNo || !service || !selectedDate || !selectedTime) {
      setError('Please fill in all fields, and select a date and time.');
      return;
    }
    // Final sanity check for date object
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        setError('Invalid date selected. Please select again.');
        return;
    }
    setError('');
    onConfirm({ date: selectedDate, time: selectedTime, patientName, phoneNo, service });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Add time zone offset to ensure the date is parsed in the user's local timezone, not UTC.
    // This prevents the selected date from being off by one day.
    const dateString = e.target.value;
    if (!dateString) {
        setSelectedDate(null);
        return;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
  }
  
  // Using explicit check for boolean true to avoid undefined/null issues
  const isOnlinePayment = therapist.clinic?.isOnlinePaymentAvailable === true && !isRescheduling;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-700">Your appointment with</p>
            <h3 className="text-2xl font-bold text-amber-600">{therapist.name}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter patient name"
                    required
                />
            </div>
             <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                    type="tel" 
                    id="phoneNo"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    required
                />
            </div>
             <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service</label>
                <select 
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white"
                    required
                >
                    {therapist.specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="General Consultation">General Consultation</option>
                </select>
            </div>
            <div className="border-t pt-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select a Date</label>
                <input 
                    type="date" 
                    id="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Time</label>
                <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map(time => (
                        <button 
                            key={time} 
                            onClick={() => setSelectedTime(time)}
                            className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${selectedTime === time ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end items-center gap-3">
            <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold order-2 sm:order-1">
                Cancel
            </button>
            <div className="w-full sm:w-auto order-1 sm:order-2">
              <button 
                  onClick={handleConfirmClick}
                  className={`w-full px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 ${
                      isOnlinePayment 
                      ? 'bg-[#3395ff] hover:bg-[#2b7dcf] text-white' // Razorpay Blue-ish color
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
              >
                  {isRescheduling ? 'Confirm Reschedule' : 
                   isOnlinePayment ? `Pay ₹${therapist.fee} via Razorpay` : 'Confirm Booking'}
              </button>
              {isOnlinePayment && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-600">
                     <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.082 2.956 9.565 7.321 11.74a.75.75 0 00.858 0C14.794 21.565 17.75 17.082 17.75 12c0-2.316-.396-4.512-1.135-6.235a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.095a9.708 9.708 0 006.014 2.378c.559 1.488.86 3.102.86 4.777 0 4.163-2.186 7.843-5.54 9.695-3.354-1.852-5.54-5.532-5.54-9.695 0-1.675.301-3.29.861-4.777A9.708 9.708 0 0012 4.095zM8.28 10.22a.75.75 0 111.06-1.06l1.97 1.97 3.22-3.22a.75.75 0 011.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0L8.28 10.22z" clipRule="evenodd" />
                   </svg>
                   <span>100% Secure Payment</span>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
