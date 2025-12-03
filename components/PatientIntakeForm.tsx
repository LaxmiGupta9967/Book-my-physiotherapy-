import React, { useState, useEffect } from 'react';
import { IntakeForm } from '../types';

interface PatientIntakeFormProps {
  userName: string;
  onSubmit: (formData: IntakeForm) => void;
}

const initialFormData: IntakeForm = {
  personalInfo: {
    fullName: '',
    dob: '',
    gender: 'Prefer not to say',
  },
  medicalHistory: {
    allergies: '',
    medications: '',
    pastSurgeries: '',
    chronicConditions: '',
  },
  currentCondition: {
    primaryComplaint: '',
    symptoms: '',
    painLevel: 5,
    onset: '',
    betterWith: '',
    worseWith: '',
  },
  goals: {
    patientGoals: '',
  },
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ userName, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeForm>(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill the user's name
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, fullName: userName }}));
  }, [userName]);

  const handleNext = () => {
    // Basic validation for the current step
    if (step === 1) {
        if (!formData.personalInfo.fullName || !formData.personalInfo.dob) {
            setError('Please fill in your Full Name and Date of Birth.');
            return;
        }
    }
    if (step === 3) {
        if (!formData.currentCondition.primaryComplaint) {
            setError('Please describe your primary complaint.');
            return;
        }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 4) {
        if (!formData.goals.patientGoals) {
            setError('Please describe your goals for physiotherapy.');
            return;
        }
    }
    setError('');
    onSubmit(formData);
  };

  const handleChange = (section: keyof IntakeForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div className="absolute top-0 left-0 h-2 bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Personal Info</span>
          <span>Medical History</span>
          <span>Current Condition</span>
          <span>Goals</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {step === 1 && (
            <FormSection title="Step 1: Personal Information">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="fullName" value={formData.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} className="mt-1 w-full input-styled" required />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" id="dob" value={formData.personalInfo.dob} onChange={e => handleChange('personalInfo', 'dob', e.target.value)} className="mt-1 w-full input-styled" required />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select id="gender" value={formData.personalInfo.gender} onChange={e => handleChange('personalInfo', 'gender', e.target.value)} className="mt-1 w-full input-styled">
                        <option>Prefer not to say</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </FormSection>
        )}
        
        {step === 2 && (
            <FormSection title="Step 2: Medical History (Optional)">
                <p className="text-sm text-gray-500 mb-4">Please list any relevant medical information. Write 'N/A' if not applicable.</p>
                <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                    <textarea id="allergies" rows={2} value={formData.medicalHistory.allergies} onChange={e => handleChange('medicalHistory', 'allergies', e.target.value)} className="mt-1 w-full input-styled"></textarea>
                </div>
                <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700">Current Medications</label>
                    <textarea id="medications" rows={2} value={formData.medicalHistory.medications} onChange={e => handleChange('medicalHistory', 'medications', e.target.value)} className="mt-1 w-full input-styled"></textarea>
                </div>
                 <div>
                    <label htmlFor="pastSurgeries" className="block text-sm font-medium text-gray-700">Past Surgeries or Major Injuries</label>
                    <textarea id="pastSurgeries" rows={2} value={formData.medicalHistory.pastSurgeries} onChange={e => handleChange('medicalHistory', 'pastSurgeries', e.target.value)} className="mt-1 w-full input-styled"></textarea>
                </div>
                 <div>
                    <label htmlFor="chronicConditions" className="block text-sm font-medium text-gray-700">Chronic Conditions (e.g., Diabetes, Hypertension, Arthritis)</label>
                    <textarea id="chronicConditions" rows={2} value={formData.medicalHistory.chronicConditions} onChange={e => handleChange('medicalHistory', 'chronicConditions', e.target.value)} className="mt-1 w-full input-styled"></textarea>
                </div>
            </FormSection>
        )}

        {step === 3 && (
            <FormSection title="Step 3: Current Condition">
                <div>
                    <label htmlFor="primaryComplaint" className="block text-sm font-medium text-gray-700">What is the primary problem or reason for your visit?</label>
                    <textarea id="primaryComplaint" rows={3} value={formData.currentCondition.primaryComplaint} onChange={e => handleChange('currentCondition', 'primaryComplaint', e.target.value)} className="mt-1 w-full input-styled" required></textarea>
                </div>
                <div>
                    <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700">On a scale of 1 to 10, what is your current pain level? ({formData.currentCondition.painLevel})</label>
                    <input type="range" id="painLevel" min="1" max="10" value={formData.currentCondition.painLevel} onChange={e => handleChange('currentCondition', 'painLevel', parseInt(e.target.value, 10))} className="mt-1 w-full" />
                </div>
                <div>
                    <label htmlFor="onset" className="block text-sm font-medium text-gray-700">When did your symptoms begin?</label>
                    <input type="text" id="onset" value={formData.currentCondition.onset} onChange={e => handleChange('currentCondition', 'onset', e.target.value)} className="mt-1 w-full input-styled" />
                </div>
                 <div>
                    <label htmlFor="betterWith" className="block text-sm font-medium text-gray-700">What makes your symptoms feel better?</label>
                    <input type="text" id="betterWith" value={formData.currentCondition.betterWith} onChange={e => handleChange('currentCondition', 'betterWith', e.target.value)} className="mt-1 w-full input-styled" />
                </div>
                 <div>
                    <label htmlFor="worseWith" className="block text-sm font-medium text-gray-700">What makes your symptoms feel worse?</label>
                    <input type="text" id="worseWith" value={formData.currentCondition.worseWith} onChange={e => handleChange('currentCondition', 'worseWith', e.target.value)} className="mt-1 w-full input-styled" />
                </div>
            </FormSection>
        )}
        
        {step === 4 && (
            <FormSection title="Step 4: Your Goals">
                 <div>
                    <label htmlFor="patientGoals" className="block text-sm font-medium text-gray-700">What do you hope to achieve with physiotherapy?</label>
                    <textarea id="patientGoals" rows={5} value={formData.goals.patientGoals} onChange={e => handleChange('goals', 'patientGoals', e.target.value)} className="mt-1 w-full input-styled" placeholder="e.g., Run a 5k without pain, lift my grandchild, improve my posture..." required></textarea>
                </div>
            </FormSection>
        )}

      </div>
        
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t flex justify-between items-center">
        <button type="button" onClick={handleBack} disabled={step === 1} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            Back
        </button>
        {step < 4 ? (
            <button type="button" onClick={handleNext} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold">
                Next
            </button>
        ) : (
            <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-semibold">
                Submit Form
            </button>
        )}
      </div>
      <style>{`.input-styled { padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); outline: none; } .input-styled:focus { ring: 1px solid #F59E0B; border-color: #F59E0B; }`}</style>
    </form>
  );
};

export default PatientIntakeForm;
