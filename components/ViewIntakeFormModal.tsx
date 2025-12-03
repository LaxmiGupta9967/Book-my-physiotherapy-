import React from 'react';
import { IntakeForm } from '../types';

interface ViewIntakeFormModalProps {
  intakeData: IntakeForm;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  value ? (
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  ) : null
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <details className="bg-slate-50 border border-slate-200 rounded-lg p-4" open>
        <summary className="font-semibold text-lg text-gray-800 cursor-pointer">{title}</summary>
        <div className="mt-4 space-y-4 pt-4 border-t">
            {children}
        </div>
    </details>
);

const ViewIntakeFormModal: React.FC<ViewIntakeFormModalProps> = ({ intakeData, onClose }) => {
  if (!intakeData) return null;

  const { personalInfo, medicalHistory, currentCondition, goals } = intakeData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Submitted Intake Form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-4">
            <Section title="Personal Information">
                <DetailRow label="Full Name" value={personalInfo.fullName} />
                <DetailRow label="Date of Birth" value={personalInfo.dob} />
                <DetailRow label="Gender" value={personalInfo.gender} />
            </Section>
            
            <Section title="Medical History">
                <DetailRow label="Allergies" value={medicalHistory.allergies || 'N/A'} />
                <DetailRow label="Current Medications" value={medicalHistory.medications || 'N/A'} />
                <DetailRow label="Past Surgeries or Major Injuries" value={medicalHistory.pastSurgeries || 'N/A'} />
                <DetailRow label="Chronic Conditions" value={medicalHistory.chronicConditions || 'N/A'} />
            </Section>
            
            <Section title="Current Condition">
                <DetailRow label="Primary Complaint" value={currentCondition.primaryComplaint} />
                <DetailRow label="Pain Level (1-10)" value={currentCondition.painLevel} />
                <DetailRow label="When Symptoms Began" value={currentCondition.onset} />
                <DetailRow label="What Makes it Better" value={currentCondition.betterWith} />
                <DetailRow label="What Makes it Worse" value={currentCondition.worseWith} />
            </Section>

             <Section title="Patient Goals">
                <DetailRow label="Goals for Physiotherapy" value={goals.patientGoals} />
            </Section>
        </div>

         <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end items-center flex-shrink-0">
            <button 
                onClick={onClose} 
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold"
            >
                Close
            </button>
        </div>

      </div>
    </div>
  );
};

export default ViewIntakeFormModal;