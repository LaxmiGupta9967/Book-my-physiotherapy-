import React from 'react';
import { Booking, IntakeForm } from '../types';
import PatientIntakeForm from './PatientIntakeForm';

interface IntakeFormModalProps {
  booking: Booking;
  userName: string;
  onClose: () => void;
  onSubmit: (bookingId: string, formData: IntakeForm) => void;
}

const IntakeFormModal: React.FC<IntakeFormModalProps> = ({ booking, userName, onClose, onSubmit }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Intake Form</h2>
            <p className="text-sm text-gray-500">For your appointment with {booking.therapist.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto">
          <PatientIntakeForm 
            userName={userName}
            onSubmit={(formData) => onSubmit(booking.id, formData)}
          />
        </div>
      </div>
    </div>
  );
};

export default IntakeFormModal;