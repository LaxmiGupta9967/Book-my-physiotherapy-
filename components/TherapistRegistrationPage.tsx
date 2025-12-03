import React, { useState, useEffect } from 'react';
import { Therapist } from '../types';
import { SPECIALTIES } from '../constants';

interface TherapistRegistrationPageProps {
  onProfileCreate: (therapist: Therapist) => void;
  onProfileUpdate?: (therapist: Therapist) => void;
  therapistToEdit?: Therapist | null;
  onBack: () => void;
}


const BenefitsSidebar: React.FC = () => (
    <div className="bg-amber-500/10 p-8 rounded-2xl h-full flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-amber-700 mb-6">Why Join Us?</h2>
        <ul className="space-y-5">
            <li className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Reach More Patients</h3>
                    <p className="text-gray-600 text-sm mt-1">Connect with a wider audience actively seeking physiotherapy services in your area.</p>
                </div>
            </li>
            <li className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Simplify Your Schedule</h3>
                    <p className="text-gray-600 text-sm mt-1">Our intuitive platform helps you manage appointments and reduce administrative work.</p>
                </div>
            </li>
            <li className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Build Your Reputation</h3>
                    <p className="text-gray-600 text-sm mt-1">Showcase your expertise, collect patient reviews, and establish yourself as a trusted professional.</p>
                </div>
            </li>
        </ul>
    </div>
);

interface FormSectionProps {
    step: number;
    title: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ step, title, children }) => (
    <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">{step}</div>
            <h2 className="text-xl font-semibold text-gray-800 ml-4">{title}</h2>
        </div>
        {children}
    </div>
);

const ProfileCompleteness: React.FC<{
  formData: any;
  selectedSpecialties: Set<string>;
  clinicPhotos: File[];
  therapistToEdit?: Therapist | null;
}> = ({ formData, selectedSpecialties, clinicPhotos, therapistToEdit }) => {
  const completenessChecks = {
    name: {
      label: 'Add your full name',
      complete: !!formData.name,
    },
    title: {
      label: 'Add your professional title',
      complete: !!formData.title,
    },
    description: {
      label: 'Write a short bio (min 50 chars)',
      complete: formData.description.length >= 50,
    },
    qualifications: {
      label: 'List your qualifications',
      complete: !!formData.qualifications,
    },
    experience: {
      label: 'Enter years of experience',
      complete: !!formData.experience && parseInt(formData.experience, 10) > 0,
    },
    clinicName: {
      label: 'Add your clinic name',
      complete: !!formData.clinicName,
    },
    clinicAddress: {
      label: 'Add clinic address',
      complete: !!formData.clinicAddress,
    },
    phone: {
      label: 'Add clinic phone number',
      complete: !!formData.phone,
    },
    specialties: {
      label: 'Select at least one specialty',
      complete: selectedSpecialties.size > 0,
    },
    photos: {
      label: 'Upload at least one clinic photo',
      complete:
        clinicPhotos.length > 0 ||
        (therapistToEdit?.clinicPhotos?.length || 0) > 0,
    },
  };

  const totalChecks = Object.keys(completenessChecks).length;
  const completedChecks = Object.values(completenessChecks).filter(
    (check) => check.complete
  ).length;
  const percentage = Math.round((completedChecks / totalChecks) * 100);

  const incompleteItems = Object.values(completenessChecks).filter(
    (check) => !check.complete
  );

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
      <h3 className="font-bold text-gray-800 text-lg mb-4">
        Profile Completion
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e6e6e6"
              strokeWidth="3.5"
            />
            <path
              className="transition-all duration-500"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4fd1c5"
              strokeWidth="3.5"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-teal-600">{percentage}%</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-700">
            A complete profile attracts more patients.
          </p>
        </div>
      </div>

      {incompleteItems.length > 0 && (
        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">Here's what's missing:</p>
          <ul className="space-y-2 text-sm">
            {incompleteItems.map((item, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 text-red-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {percentage === 100 && (
        <div className="mt-6 text-center bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="font-semibold text-green-700">
            Your profile is complete! Great job!
          </p>
        </div>
      )}
    </div>
  );
};


const TherapistRegistrationPage: React.FC<TherapistRegistrationPageProps> = ({ onProfileCreate, onProfileUpdate, therapistToEdit, onBack }) => {
  const isEditMode = !!therapistToEdit;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    location: '',
    description: '',
    qualifications: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    phone: '',
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [clinicPhotos, setClinicPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditMode && therapistToEdit) {
      setFormData({
        name: therapistToEdit.name,
        email: '', // Admin should not see/edit credentials
        password: '', // Admin should not see/edit credentials
        title: therapistToEdit.title,
        location: therapistToEdit.location,
        description: therapistToEdit.description,
        qualifications: therapistToEdit.qualifications.join(', '),
        experience: String(therapistToEdit.experience),
        clinicName: therapistToEdit.clinic.name,
        clinicAddress: therapistToEdit.clinic.address,
        phone: therapistToEdit.clinic.phone || '',
      });
      setSelectedSpecialties(new Set(therapistToEdit.specialties));
      setClinicPhotos([]);
    }
  }, [therapistToEdit, isEditMode]);
  
  // Effect to clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(specialty)) {
        newSet.delete(specialty);
      } else {
        newSet.add(specialty);
      }
      return newSet;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setClinicPhotos(files);
        
        // Create blob URLs for previews
        // FIX: The type of `file` was inferred as `unknown`, which is not compatible with
        // `URL.createObjectURL`. Casting it to `File` (which extends Blob) resolves the type mismatch.
        const newPreviews = files.map(file => URL.createObjectURL(file as File));
        setPhotoPreviews(newPreviews);
    }
  };

  const handleClearPhotos = () => {
    setClinicPhotos([]);
    setPhotoPreviews([]);
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['name', 'title', 'location', 'description', 'qualifications', 'experience', 'clinicName', 'clinicAddress', 'phone'];
    if (!isEditMode) {
        requiredFields.push('email', 'password');
    }

    for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
            setError(`Please fill in all fields. Missing: ${field}`);
            return;
        }
    }
    
    if (selectedSpecialties.size === 0) {
      setError('Please select at least one specialty.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    try {
        const newPhotoDataUrls = await Promise.all(clinicPhotos.map(fileToBase64));
        
        const therapistData: Therapist = {
            id: isEditMode && therapistToEdit ? therapistToEdit.id : Date.now(),
            name: formData.name,
            title: formData.title,
            location: formData.location,
            rating: isEditMode && therapistToEdit ? therapistToEdit.rating : 0,
            reviewCount: isEditMode && therapistToEdit ? therapistToEdit.reviewCount : 0,
            specialties: Array.from(selectedSpecialties),
            description: formData.description,
            qualifications: formData.qualifications.split(',').map(q => q.trim()),
            clinicPhotos: isEditMode && therapistToEdit ? [...therapistToEdit.clinicPhotos, ...newPhotoDataUrls] : newPhotoDataUrls,
            reviews: isEditMode && therapistToEdit ? therapistToEdit.reviews : [],
            fee: isEditMode && therapistToEdit ? therapistToEdit.fee : 500,
            isProfileClaimed: true,
            experience: parseInt(formData.experience, 10) || 0,
            specialistExperience: parseInt(formData.experience, 10) || 0,
            patientSatisfaction: isEditMode && therapistToEdit ? therapistToEdit.patientSatisfaction : 0,
            clinic: isEditMode && therapistToEdit ? {
                ...therapistToEdit.clinic,
                name: formData.clinicName,
                address: formData.clinicAddress,
                phone: formData.phone,
            } : {
                name: formData.clinicName,
                address: formData.clinicAddress,
                phone: formData.phone,
                rating: 0,
                timings: { days: 'Mon - Sat', hours: ['10:00 AM - 07:00 PM'] },
                isOnlinePaymentAvailable: false,
                isPrime: false,
                maxWaitTime: 15,
                isVerified: false,
            },
        };
        
        if (isEditMode && onProfileUpdate) {
            onProfileUpdate(therapistData);
        } else {
            onProfileCreate(therapistData);
        }

    } catch (error) {
        console.error("Error creating profile:", error);
        setError("Could not process photos. Please try again.");
    } finally {
        setIsSubmitting(false);
    }

  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-lg">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{isEditMode ? 'Edit Therapist Profile' : 'Empower Your Practice'}</h1>
              <p className="text-gray-600 mt-2">{isEditMode && therapistToEdit ? `Updating the profile for ${therapistToEdit.name}.` : 'Create your professional profile and connect with patients seeking care.'}</p>
            </div>

            <ProfileCompleteness
              formData={formData}
              selectedSpecialties={selectedSpecialties}
              clinicPhotos={clinicPhotos}
              therapistToEdit={therapistToEdit}
            />
            
            <form onSubmit={handleSubmit} className="space-y-10">
              
             {!isEditMode && (
                <FormSection step={1} title="Personal & Account Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Professional Title</label>
                        <input type="text" name="title" id="title" placeholder="e.g., DPT, Physiotherapist" value={formData.title} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                         <div className="relative mt-1">
                            <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.14 2.14" /> </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    </div>
                </FormSection>
             )}
              
              <FormSection step={isEditMode ? 1 : 2} title="Professional Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditMode && (
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                  )}
                  {isEditMode && (
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Professional Title</label>
                        <input type="text" name="title" id="title" placeholder="e.g., DPT, Physiotherapist" value={formData.title} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                    </div>
                  )}
                  <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                      <input type="number" name="experience" id="experience" value={formData.experience} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                   <div>
                      <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications (comma-separated)</label>
                      <input type="text" name="qualifications" id="qualifications" placeholder="BPTh/BPT, MPTh/MPT" value={formData.qualifications} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Short Bio</label>
                      <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                    <div className="flex flex-wrap gap-3">
                      {SPECIALTIES.map(spec => (
                        <div key={spec}>
                          <input type="checkbox" id={`spec-${spec}`} checked={selectedSpecialties.has(spec)} onChange={() => handleSpecialtyChange(spec)} className="hidden peer" />
                          <label htmlFor={`spec-${spec}`} className="block text-sm px-4 py-2 border rounded-full cursor-pointer transition-colors peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500 hover:bg-gray-100">
                            {spec}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection step={isEditMode ? 2 : 3} title="Clinic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                    <input type="text" name="clinicName" id="clinicName" value={formData.clinicName} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">City / Area</label>
                    <input type="text" name="location" id="location" placeholder="e.g. Kharghar, Navi Mumbai" value={formData.location} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Clinic Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700">Full Clinic Address</label>
                    <textarea name="clinicAddress" id="clinicAddress" rows={3} value={formData.clinicAddress} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Clinic Photos</label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" multiple onChange={handlePhotoChange} className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                  </div>
                  {(photoPreviews.length > 0 || (isEditMode && therapistToEdit?.clinicPhotos?.length > 0)) && (
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Photo Previews:</p>
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {isEditMode && therapistToEdit?.clinicPhotos?.map((photo, index) => (
                                <img key={`existing-${index}`} src={photo} alt={`Existing preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                            ))}
                            {photoPreviews.map((preview, index) => (
                                <img key={`new-${index}`} src={preview} alt={`New preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                            ))}
                        </div>
                        {photoPreviews.length > 0 && 
                            <button type="button" onClick={handleClearPhotos} className="text-sm text-red-600 hover:underline mt-2">
                                Clear new photos
                            </button>
                        }
                    </div>
                  )}
                </div>
              </FormSection>

              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

              <div className="border-t border-gray-200 pt-8 mt-10 flex items-center justify-between">
                  <button type="button" onClick={onBack} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold">
                      Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold disabled:bg-gray-400">
                      {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Profile' : 'Create Profile'}
                  </button>
              </div>

            </form>
          </div>
          <div className="hidden lg:block">
              <BenefitsSidebar />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TherapistRegistrationPage;