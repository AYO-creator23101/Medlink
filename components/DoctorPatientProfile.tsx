import React from 'react';
import type { Patient, Appointment, MedicalRecord } from '../types';
import { UserCircleIcon, ArrowUturnLeftIcon, CalendarIcon, RecordsIcon } from './Icons';

interface DoctorPatientProfileProps {
  patient: Patient;
  appointments: Appointment[];
  records: MedicalRecord[];
  onBack: () => void;
  onStartConsultation: (appointment: Appointment) => void;
}

const RecordTypePill: React.FC<{ type: MedicalRecord['type'] }> = ({ type }) => {
  const styles = {
    prescription: 'bg-red-100 text-red-800',
    lab_result: 'bg-blue-100 text-blue-800',
    health_history: 'bg-green-100 text-green-800',
    consultation_note: 'bg-purple-100 text-purple-800',
  };
  const text = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[type]}`}>{text}</span>;
};

const DoctorPatientProfile: React.FC<DoctorPatientProfileProps> = ({ patient, appointments, records, onBack, onStartConsultation }) => {

  const upcomingAppointment = appointments.find(a => a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status !== 'upcoming').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <UserCircleIcon className="w-16 h-16 text-slate-500" />
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{patient.name}</h1>
                <p className="text-slate-500 mt-1">Patient Profile & History</p>
            </div>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
            <ArrowUturnLeftIcon className="w-5 h-5"/>
            <span>Back to Patient List</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
            {upcomingAppointment && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-500">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-blue-600"/>
                        Upcoming Appointment
                    </h2>
                    <p className="font-semibold text-slate-700">{new Date(upcomingAppointment.date).toDateString()} at {upcomingAppointment.time}</p>
                    <p className="text-sm text-slate-500 capitalize">{upcomingAppointment.consultationType} Consultation</p>
                    <button 
                        onClick={() => onStartConsultation(upcomingAppointment)}
                        className="mt-4 w-full text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Start Consultation
                    </button>
                </div>
            )}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <RecordsIcon className="w-6 h-6 text-yellow-600"/>
                    Patient Medical Records
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {records.map(record => (
                        <div key={record.id} className="p-3 border rounded-lg">
                            <p className="font-semibold text-slate-700">{record.title}</p>
                             {record.type === 'consultation_note' && record.notes && (
                                <div className="mt-2 text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded">
                                    <p><strong className="font-semibold">S:</strong> {record.notes.subjective}</p>
                                    <p><strong className="font-semibold">O:</strong> {record.notes.objective}</p>
                                    <p><strong className="font-semibold">A:</strong> {record.notes.assessment}</p>
                                    <p><strong className="font-semibold">P:</strong> {record.notes.plan}</p>
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-slate-500">{record.date}</p>
                                <RecordTypePill type={record.type} />
                            </div>
                        </div>
                    ))}
                     {records.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">No records found.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Consultation History</h2>
                <div className="space-y-4">
                    {pastAppointments.length > 0 ? (
                        pastAppointments.map(appt => (
                            <div key={appt.id} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50">
                                <img src={appt.doctor.image} alt={appt.doctor.name} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-slate-800">Consultation with {appt.doctor.name}</p>
                                    <p className="text-sm text-slate-500">{new Date(appt.date).toDateString()}</p>
                                    <p className="mt-2 text-sm text-slate-600 bg-slate-100 p-2 rounded">
                                        Notes: Discussed symptoms and treatment plan. Follow-up scheduled. (Placeholder)
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No past consultations found for this patient.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientProfile;