
import React, { useState } from 'react';
import { Therapist, User } from '../types';
import StarRating from './StarRating';

interface TherapistProfileProps {
  therapist: Therapist;
  onBack: () => void;
  onBookNow: () => void;
  currentUser: User | null;
}

const PhotoViewerModal: React.FC<{ photoUrl: string; onClose: () => void }> = ({ photoUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[100]" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img src={photoUrl} alt="Clinic photo enlarged" className="w-full h-full object-contain rounded-lg" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-gray-200"
          aria-label="Close photo viewer"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

interface BookingPanelProps {
  therapist: Therapist;
  onBookNow: () => void;
  currentUser: User | null;
}

const BookingPanel: React.FC<BookingPanelProps> = ({ therapist, onBookNow, currentUser }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border-t-8 border-t-amber-500">
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
            
            <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-4 flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-full p-2 border border-amber-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-700">Clinic Appointment</span>
                </div>
                <span className="font-bold text-gray-800">₹{therapist.fee}</span>
            </div>

            {therapist.clinic ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="font-bold text-gray-800">{therapist.clinic.name}</p>
                  {therapist.clinic.rating > 0 && (
                      <div className="flex items-center text-sm mt-1">
                          <span className="font-bold mr-1">{therapist.clinic.rating.toFixed(1)}</span>
                          <StarRating rating={therapist.clinic.rating} starColor="text-green-500" halfStarRgbColor="rgb(34 197 94)"/>
                      </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{therapist.location.split(',')[0]}</p>
              </div>
            ) : (
               <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500">Clinic details not available.</p>
               </div>
            )}


            <button onClick={onBookNow} className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg mt-6 hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Book Appointment</span>
            </button>
        </div>
    </div>
  );
};


const TherapistProfile: React.FC<TherapistProfileProps> = ({ therapist, onBack, onBookNow, currentUser }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const descriptionWords = therapist.description ? therapist.description.split(' ') : [];
  const canShrink = descriptionWords.length > 50;
  const shortDescription = canShrink ? descriptionWords.slice(0, 50).join(' ') + '...' : therapist.description;
  
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(therapist.clinic?.address || therapist.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-gray-50">
        {selectedPhoto && <PhotoViewerModal photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 lg:pb-12">
            <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-teal-600 font-semibold transition-colors mb-8 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Results
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-8 border-t-amber-500">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-8 border-slate-200 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-2xl font-bold text-gray-800">{therapist.name}</h1>
                                    {therapist.isProfileClaimed && (
                                        <span className="text-xs text-gray-500 font-medium">Profile is claimed</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{therapist.title}</p>
                                <p className="text-sm text-gray-600">{therapist.specialties?.slice(0,2).join(', ')}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {therapist.experience} Years Experience Overall
                                    {therapist.specialistExperience && therapist.experience !== therapist.specialistExperience && ` (${therapist.specialistExperience} years as specialist)`}
                                </p>
                                
                                {therapist.patientSatisfaction > 0 && (
                                    <div className="mt-4 flex items-center space-x-2 bg-green-50 border border-green-200 rounded-md p-2 w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-green-800 font-semibold text-sm">{therapist.patientSatisfaction}% ({therapist.reviewCount} patients)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                            <p>
                                {showFullDescription ? therapist.description : shortDescription}
                                {canShrink && (
                                <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-cyan-600 hover:underline ml-1 font-semibold">
                                    {showFullDescription ? '[shrink]' : '[more]'}
                                </button>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-8 border-t-amber-500 space-y-4">
                        <h3 className="font-bold text-lg text-gray-800">Clinic Information</h3>
                        {therapist.clinic ? (
                          <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex-grow">
                                      <a href="#" className="font-bold text-cyan-600 hover:underline">{therapist.clinic.name}</a>
                                      {therapist.clinic.rating > 0 && (
                                          <div className="flex items-center mt-1">
                                              <span className="font-bold mr-1">{therapist.clinic.rating.toFixed(1)}</span>
                                              <StarRating rating={therapist.clinic.rating} starColor="text-green-500" halfStarRgbColor="rgb(34 197 94)"/>
                                          </div>
                                      )}
                                      <p className="text-sm text-gray-600 mt-2">{therapist.clinic.address}</p>

                                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(therapist.clinic.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-cyan-600 hover:underline text-sm font-semibold">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-5.5m6 5.5v-5.5m0 0l-6-3m6 3l6-3" />
                                              </svg>
                                              Get Directions
                                          </a>
                                          {therapist.clinic.phone && (
                                              <a href={`tel:${therapist.clinic.phone.replace(/\s/g, '')}`} className="inline-flex items-center text-cyan-600 hover:underline text-sm font-semibold">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                  </svg>
                                                  <span>Call Clinic ({therapist.clinic.phone})</span>
                                              </a>
                                          )}
                                      </div>
                                      
                                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                                          <iframe
                                              width="100%"
                                              height="300"
                                              loading="lazy"
                                              allowFullScreen
                                              referrerPolicy="no-referrer-when-downgrade"
                                              src={mapSrc}
                                              aria-label={`${therapist.clinic.name} map location`}
                                          ></iframe>
                                      </div>

                                  </div>
                                  <div className="text-sm flex-shrink-0 w-full sm:w-48">
                                    {therapist.clinic.timings ? (
                                      <>
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800">{therapist.clinic.timings.days}</p>
                                            <p className="font-semibold text-gray-800 flex items-center">
                                                ₹{therapist.fee}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </p>
                                        </div>
                                        {therapist.clinic.timings.hours.map(h => <p key={h} className="text-gray-600">{h}</p>)}
                                      </>
                                    ) : (
                                      <p className="text-gray-500">Timings not available.</p>
                                    )}
                                  </div>
                              </div>
                          </div>
                        ) : (
                           <p className="text-gray-500 p-4">Detailed clinic information is not available for this therapist.</p>
                        )}
                    </div>
                    
                    {therapist.clinicPhotos && therapist.clinicPhotos.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-xl border-t-8 border-t-amber-500">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">Clinic Photos</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {therapist.clinicPhotos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedPhoto(photo)}
                                        className="relative w-full rounded-lg overflow-hidden block group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                        style={{ paddingTop: '100%' }} /* 1:1 Aspect Ratio */
                                    >
                                        <img
                                            src={photo}
                                            alt={`Clinic photo ${index + 1}`}
                                            className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="lg:sticky top-28 z-30">
                        <BookingPanel therapist={therapist} onBookNow={onBookNow} currentUser={currentUser} />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Mobile Floating CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-3 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
            <button 
                onClick={onBookNow} 
                className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center space-x-2 text-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Book Appointment</span>
            </button>
        </div>
    </div>
  );
};

export default TherapistProfile;
