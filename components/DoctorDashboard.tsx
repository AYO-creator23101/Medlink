import React from 'react';
import { CalendarIcon, RecordsIcon, ChatIcon } from './Icons';
import type { Page } from '../types';

interface DoctorDashboardProps {
  setActivePage: (page: Page) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ setActivePage }) => {
  const features = [
    { name: 'My Appointments', icon: <CalendarIcon className="w-10 h-10 text-purple-500" />, page: 'doctor-appointments' as Page, description: 'View and manage your consultation schedule.' },
    { name: 'My Patients', icon: <RecordsIcon className="w-10 h-10 text-yellow-500" />, page: 'doctor-patients' as Page, description: 'Access patient records and consultation history.' },
    { name: 'Refill Requests', icon: <ChatIcon className="w-10 h-10 text-green-500" />, page: 'doctor-refills' as Page, description: 'Review and approve prescription refill requests.' },
  ];

  const analyticsData = [
      { day: 'Mon', visits: 8, earnings: 400 },
      { day: 'Tue', visits: 12, earnings: 600 },
      { day: 'Wed', visits: 10, earnings: 500 },
      { day: 'Thu', visits: 15, earnings: 750 },
      { day: 'Fri', visits: 11, earnings: 550 },
      { day: 'Sat', visits: 6, earnings: 300 },
      { day: 'Sun', visits: 4, earnings: 200 },
  ];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome, Dr. Doe</h1>
        <p className="text-slate-500 mt-1">Your professional dashboard.</p>
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
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xl font-semibold text-slate-800">Weekly Practice Analytics</h3>
                <p className="text-slate-600">Consultations and activity overview.</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">$3,300</p>
            </div>
        </div>
        
        <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
            {analyticsData.map((data, index) => (
                <div key={index} className="w-full flex flex-col items-center gap-2 group">
                    <div className="w-full bg-blue-50 rounded-t-lg relative h-full flex items-end hover:bg-blue-100 transition-colors">
                        <div 
                            className="w-full bg-blue-600 rounded-t-lg transition-all duration-1000 ease-out"
                            style={{ height: `${(data.visits / 15) * 100}%` }}
                        ></div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {data.visits} Visits<br/>${data.earnings}
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{data.day}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;