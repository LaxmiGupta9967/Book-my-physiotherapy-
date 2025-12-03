

import React from 'react';
import { Therapist } from '../types';
import StarRating from './StarRating';

interface TherapistCardProps {
  therapist: Therapist;
  onViewProfile: () => void;
  onBookNow: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onViewProfile, onBookNow }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <div className="p-4 sm:p-6 flex-grow">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-100 flex items-center justify-center border-4 border-amber-200 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{therapist.name}</h3>
            <p className="text-teal-600 font-medium">{therapist.title}</p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {therapist.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
            <StarRating rating={therapist.rating} />
            <span className="text-gray-600 text-sm">{therapist.rating.toFixed(1)} ({therapist.reviewCount} reviews)</span>
        </div>
        
        <div className="mt-4">
            <h4 className="font-semibold text-gray-700 text-sm">Specialties:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {therapist.specialties.slice(0, 3).map(spec => (
                    <span key={spec} className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-xs font-medium">{spec}</span>
                ))}
            </div>
        </div>

      </div>
      <div className="p-4 sm:p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
        <button 
            onClick={onViewProfile}
            className="w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold"
        >
          View Profile
        </button>
        <button 
            onClick={onBookNow}
            className="w-full text-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300 font-semibold"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;