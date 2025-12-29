import React from 'react';
import type { Appointment, Patient } from '../types';
import { ChatIcon, PhoneIcon, VideoCameraIcon, UserCircleIcon } from './Icons';

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

interface DoctorAppointmentsProps {
    appointments: Appointment[];
    onStartConsultation: (appointment: Appointment) => void;
    onSelectPatient: (patient: Patient) => void;
}

const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ appointments, onStartConsultation, onSelectPatient }) => {
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAppointments = appointments.filter(a => a.status !== 'upcoming').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500 mt-1">Manage your patient consultation schedule.</p>
      </header>

      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming Consultations</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appt => (
                <div key={appt.id} className="bg-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <UserCircleIcon className="w-16 h-16 text-slate-400 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold text-slate-800 text-lg">{appt.patient.name}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">{new Date(appt.date).toDateString()} at {appt.time}</p>
                    <ConsultationIcon type={appt.consultationType} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => onSelectPatient(appt.patient)}
                        className="text-sm w-full sm:w-auto text-blue-600 border border-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                    >
                        View Profile
                    </button>
                    <button 
                        onClick={() => onStartConsultation(appt)}
                        className="w-full sm:w-auto text-sm text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Start Consultation
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
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Past Consultations</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b text-sm text-slate-500">
                        <tr>
                            <th className="p-3">Patient</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastAppointments.map(appt => (
                        <tr key={appt.id} className="border-b hover:bg-slate-50 last:border-b-0">
                            <td className="p-3 font-medium text-slate-800">{appt.patient.name}</td>
                            <td className="p-3 text-slate-600">{new Date(appt.date).toDateString()}</td>
                            <td className="p-3 text-slate-600 capitalize">{appt.consultationType}</td>
                            <td className="p-3"><StatusBadge status={appt.status} /></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;