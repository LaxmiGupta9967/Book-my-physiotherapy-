

import React, { useState } from 'react';
import { User, Booking } from '../types';
import BookingCard from './BookingCard';

interface ProfilePageProps {
  user: User;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string) => void;
  onFillIntakeForm: (bookingId: string) => void;
  onViewIntakeForm: (bookingId: string) => void;
}


const ProfilePage: React.FC<ProfilePageProps> = ({ user, bookings, onCancelBooking, onRescheduleBooking, onFillIntakeForm, onViewIntakeForm }) => {
  const [activeTab, setActiveTab] = useState<'appointments'>('appointments');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings
    .filter(b => b.date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastBookings = bookings
    .filter(b => b.date < today || b.status === 'cancelled')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
    

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome, {user.name}</h1>
      <p className="text-md md:text-lg text-gray-600 mb-10">Manage your appointments and view your booking history.</p>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('appointments')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                    activeTab === 'appointments'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === 'appointments' ? 'page' : undefined}
            >
                My Appointments
            </button>
        </nav>
      </div>
      
      {activeTab === 'appointments' && (
        <div className="space-y-12">
            {/* Upcoming Bookings */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">My Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                <div className="space-y-6">
                    {upcomingBookings.map(booking => (
                    <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        onCancelBooking={onCancelBooking}
                        onRescheduleBooking={onRescheduleBooking}
                        onFillIntakeForm={onFillIntakeForm}
                        onViewIntakeForm={onViewIntakeForm}
                        isPast={false} 
                    />
                    ))}
                </div>
                ) : (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-xl">You have no upcoming bookings.</p>
                    <p className="text-gray-400 mt-1">When you book an appointment, it will appear here.</p>
                </div>
                )}
            </div>

            {/* Past Bookings */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Booking History</h2>
                {pastBookings.length > 0 ? (
                <div className="space-y-6">
                    {pastBookings.map(booking => (
                    <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        onCancelBooking={onCancelBooking}
                        onRescheduleBooking={onRescheduleBooking}
                        onFillIntakeForm={onFillIntakeForm}
                        onViewIntakeForm={onViewIntakeForm}
                        isPast={true}
                    />
                    ))}
                </div>
                ) : (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-gray-500 text-xl">You have no past appointments.</p>
                    <p className="text-gray-400 mt-1">Completed appointments will be recorded here.</p>
                </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;