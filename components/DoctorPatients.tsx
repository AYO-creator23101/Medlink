import React from 'react';
import type { Patient } from '../types';
import { UserCircleIcon, ChevronRightIcon } from './Icons';

interface DoctorPatientsProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ patients, onSelectPatient }) => {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Patients</h1>
        <p className="text-slate-500 mt-1">View patient records and consultation history.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="space-y-4">
          {patients.length > 0 ? (
            patients.map(patient => (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="w-full flex items-center p-4 text-left border-b last:border-b-0 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <UserCircleIcon className="w-12 h-12 text-slate-400 mr-4" />
                <div className="flex-grow">
                  <p className="font-bold text-lg text-slate-800">{patient.name}</p>
                  <p className="text-sm text-slate-500">Patient ID: {patient.id}</p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-slate-400" />
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">You have not seen any patients yet.</p>
              <p className="text-slate-400 text-sm mt-1">Your patient list will populate after your first consultation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
