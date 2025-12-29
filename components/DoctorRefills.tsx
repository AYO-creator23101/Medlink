import React from 'react';
import type { Prescription } from '../types';
import { CheckBadgeIcon, XMarkIcon, PillIcon, UserCircleIcon } from './Icons';

interface DoctorRefillsProps {
  prescriptions: Prescription[];
  onReviewRequest: (id: string, status: 'active' | 'denied') => void;
}

const DoctorRefills: React.FC<DoctorRefillsProps> = ({ prescriptions, onReviewRequest }) => {
  const pendingRequests = prescriptions.filter(p => p.status === 'pending_approval');

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Refill Requests</h1>
        <p className="text-slate-500 mt-1">Review and approve medication refill requests from your patients.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.map(request => (
              <div key={request.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <PillIcon className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{request.medication}</h3>
                        <p className="text-sm text-slate-600">{request.dosage}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <UserCircleIcon className="w-4 h-4"/>
                            <span>Requested by Patient ID: {request.id}</span> 
                            {/* In a real app, patient info would be linked properly */}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => onReviewRequest(request.id, 'denied')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5"/>
                        Deny
                    </button>
                    <button 
                        onClick={() => onReviewRequest(request.id, 'active')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                        <CheckBadgeIcon className="w-5 h-5"/>
                        Approve
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="w-10 h-10 text-slate-300"/>
             </div>
            <p className="text-lg font-medium text-slate-600">All caught up!</p>
            <p className="text-slate-500">No pending refill requests at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRefills;