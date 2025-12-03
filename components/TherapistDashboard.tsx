
import React from 'react';
import { Therapist, Booking } from '../types';

interface TherapistDashboardProps {
  therapist: Therapist;
  bookings: Booking[];
  onEditProfile: () => void;
  onViewIntakeForm: (bookingId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-amber-100 text-amber-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ therapist, bookings, onEditProfile, onViewIntakeForm }) => {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings
        .filter(b => new Date(b.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const uniquePatientIds = new Set(bookings.map(b => b.userId));

    return (
        <>
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome, {therapist.name}</h1>
                    <p className="text-md md:text-lg text-gray-600 mt-1">Here's your practice at a glance.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <button
                        onClick={onEditProfile}
                        className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300 font-semibold flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        <span>Edit My Profile</span>
                    </button>
                </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard 
                    title="Upcoming Appointments" 
                    value={upcomingBookings.length}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                 <StatCard 
                    title="Total Patients" 
                    value={uniquePatientIds.size}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                 <StatCard 
                    title="Total Bookings" 
                    value={bookings.length}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
            </div>
            
            {/* Upcoming Appointments List */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Upcoming Appointments</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingBookings.map(booking => (
                            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{booking.patientName}</p>
                                    <p className="text-gray-600">{booking.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at <span className="font-semibold">{booking.time}</span></p>
                                    {booking.status === 'checked-in' && (
                                        <span className="mt-2 text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-green-600 bg-green-200">
                                            Checked-In
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {booking.intakeForm ? (
                                        <button 
                                            onClick={() => onViewIntakeForm(booking.id)}
                                            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300 font-semibold text-sm"
                                        >
                                            View Intake Form
                                        </button>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">No intake form submitted</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-4 text-gray-500 text-xl">You have no upcoming appointments.</p>
                        <p className="text-gray-400 mt-1">New bookings will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default TherapistDashboard;
