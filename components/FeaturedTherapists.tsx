import React from 'react';
import { Therapist } from '../types';
import TherapistCard from './TherapistCard';

interface FeaturedTherapistsProps {
  therapists: Therapist[];
  onViewProfile: (therapist: Therapist) => void;
  onBookNow: (therapist: Therapist) => void;
}

const FeaturedTherapists: React.FC<FeaturedTherapistsProps> = ({ therapists, onViewProfile, onBookNow }) => {
  if (!therapists || therapists.length === 0) {
    return null;
  }

  return (
    <div className="bg-teal-50/50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800">Meet Our Featured Professionals</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Highly-rated experts ready to help you on your recovery journey.</p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist, index) => (
            <div key={therapist.id} className="fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
              <TherapistCard
                therapist={therapist}
                onViewProfile={() => onViewProfile(therapist)}
                onBookNow={() => onBookNow(therapist)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedTherapists;
