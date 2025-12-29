import React from 'react';
import type { Appointment } from '../types';
import { ChatIcon, PhoneIcon, VideoCameraIcon } from './Icons';

const StatusBadge: React.FC<{ status: Appointment['status'] }> = ({ status }) => {
  const styles = {
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const ConsultationIcon: React.FC<{ type: Appointment['consultationType'] }> = ({ type }) => {
    const iconMap = {
        chat: <ChatIcon className="w-5 h-5 text-slate-500" />,
        audio: <PhoneIcon className="w-5 h-5 text-slate-500" />,
        video: <VideoCameraIcon className="w-5 h-5 text-slate-500" />,
    };
    const textMap = {
        chat: 'Chat',
        audio: 'Audio Call',
        video: 'Video Call',
    }
    return <div className="flex items-center gap-2 text-sm text-slate-600">
        {iconMap[type]}
        <span>{textMap[type]}</span>
    </div>;
};

interface AppointmentsProps {
    appointments: Appointment[];
    onJoinCall: (appointment: Appointment) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, onJoinCall }) => {
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAppointments = appointments.filter(a => a.status !== 'upcoming').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500 mt-1">View and manage your scheduled consultations.</p>
      </header>

      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appt => (
                <div key={appt.id} className="bg-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img src={appt.doctor.image} alt={appt.doctor.name} className="w-16 h-16 rounded-full" />
                  <div className="flex-grow">
                    <p className="font-bold text-slate-800">{appt.doctor.name}</p>
                    <p className="text-sm text-slate-500">{appt.doctor.specialty}</p>
                    <p className="text-sm text-slate-600 font-medium mt-2">{new Date(appt.date).toDateString()} at {appt.time}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <StatusBadge status={appt.status} />
                    <ConsultationIcon type={appt.consultationType} />
                    <button 
                        onClick={() => onJoinCall(appt)}
                        disabled={appt.status !== 'upcoming'}
                        className="mt-2 w-full sm:w-auto text-sm text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <p className="text-slate-500">You have no upcoming appointments.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Past Appointments</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="space-y-4">
              {pastAppointments.map(appt => (
                <div key={appt.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                  <img src={appt.doctor.image} alt={appt.doctor.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-grow">
                    <p className="font-semibold text-slate-700">{appt.doctor.name}</p>
                    <p className="text-xs text-slate-500">{new Date(appt.date).toDateString()}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;