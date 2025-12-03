import React from 'react';
import { Therapist } from '../types';

interface AdminPageProps {
  therapists: Therapist[];
  onAddTherapist: () => void;
  onEditTherapist: (therapist: Therapist) => void;
  onDeleteTherapist: (therapist: Therapist) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ therapists, onAddTherapist, onEditTherapist, onDeleteTherapist }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-md md:text-lg text-gray-600 mt-1">Manage Therapist Profiles</p>
        </div>
        <button
          onClick={onAddTherapist}
          className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition duration-300 font-semibold flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add New Therapist</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialties
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {therapists.map((therapist) => (
                <tr key={therapist.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{therapist.name}</div>
                      <div className="text-sm text-gray-500">{therapist.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{therapist.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {therapist.specialties.slice(0, 2).join(', ')}
                    {therapist.specialties.length > 2 && '...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => onEditTherapist(therapist)} className="text-amber-600 hover:text-amber-900">Edit</button>
                    <button onClick={() => onDeleteTherapist(therapist)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
            <ul className="divide-y divide-gray-200">
                {therapists.map((therapist) => (
                    <li key={therapist.id} className="p-4">
                        <div className="flex flex-col">
                           <div>
                                <p className="text-sm font-medium text-gray-900">{therapist.name}</p>
                                <p className="text-sm text-gray-500">{therapist.title}</p>
                           </div>
                           <p className="text-sm text-gray-700 mt-2">{therapist.location}</p>
                           <p className="text-xs text-gray-500 mt-1">{therapist.specialties.slice(0, 3).join(', ')}</p>
                           <div className="flex justify-end space-x-4 mt-4">
                               <button onClick={() => onEditTherapist(therapist)} className="text-amber-600 hover:text-amber-900 font-semibold">Edit</button>
                               <button onClick={() => onDeleteTherapist(therapist)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                           </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {therapists.length === 0 && (
          <div className="text-center py-16">
              <p className="text-gray-500">No therapists found. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
