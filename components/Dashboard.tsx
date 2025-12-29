import React from 'react';
import { CalendarIcon, ChatIcon, PillIcon, RecordsIcon, StethoscopeIcon, WalletIcon, BeakerIcon } from './Icons';
import type { Page } from '../types';

interface DashboardProps {
  setActivePage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const features = [
    { name: 'Find a Specialist', icon: <StethoscopeIcon className="w-10 h-10 text-blue-500" />, page: 'find-doctor' as Page, description: 'Search for verified doctors and specialists near you.' },
    { name: 'AI Symptom Checker', icon: <ChatIcon className="w-10 h-10 text-green-500" />, page: 'telemedicine' as Page, description: 'Get AI-powered advice on your symptoms.' },
    { name: 'My Appointments', icon: <CalendarIcon className="w-10 h-10 text-purple-500" />, page: 'appointments' as Page, description: 'View and manage your upcoming appointments.' },
    { name: 'Book a Lab Test', icon: <BeakerIcon className="w-10 h-10 text-teal-500" />, page: 'book-lab-test' as Page, description: 'Find labs and book diagnostic tests.' },
    { name: 'Prescription Refills', icon: <PillIcon className="w-10 h-10 text-red-500" />, page: 'prescriptions' as Page, description: 'Request refills for your active prescriptions.' },
    { name: 'Wallet & Insurance', icon: <WalletIcon className="w-10 h-10 text-cyan-500" />, page: 'wallet' as Page, description: 'Manage your payment methods and insurance.'},
    { name: 'Medical Records', icon: <RecordsIcon className="w-10 h-10 text-yellow-500" />, page: 'records' as Page, description: 'Access and manage your digital health records.' },
  ];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome to Medlink</h1>
        <p className="text-slate-500 mt-1">Your connected health dashboard.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <button
            key={feature.name}
            onClick={() => setActivePage(feature.page)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex flex-col"
          >
            <div className="mb-4">{feature.icon}</div>
            <h2 className="text-lg font-semibold text-slate-800">{feature.name}</h2>
            <p className="text-sm text-slate-500 mt-1 flex-grow">{feature.description}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Health Overview</h3>
        <p className="text-slate-600 mb-6">Your recent activity and health trends.</p>
        <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
            {[40, 70, 30, 85, 50, 65, 90].map((height, index) => (
                <div key={index} className="w-full bg-blue-100 rounded-t-lg relative group hover:bg-blue-200 transition-colors">
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-1000 ease-out"
                        style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {height}%
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;