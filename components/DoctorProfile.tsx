import React, { useState, useMemo } from 'react';
import type { Appointment, ConsultationType, Doctor } from '../types';
import { ChatIcon, PhoneIcon, VideoCameraIcon } from './Icons';

interface DoctorProfileProps {
    doctor: Doctor;
    onBookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status'>) => void;
}

const ConsultationTypeOption: React.FC<{
    type: ConsultationType;
    selected: boolean;
    onClick: () => void;
}> = ({ type, selected, onClick }) => {
    const iconMap = {
        chat: <ChatIcon className={`w-8 h-8 ${selected ? 'text-white' : 'text-blue-600'}`} />,
        audio: <PhoneIcon className={`w-8 h-8 ${selected ? 'text-white' : 'text-blue-600'}`} />,
        video: <VideoCameraIcon className={`w-8 h-8 ${selected ? 'text-white' : 'text-blue-600'}`} />,
    };
    const textMap = { chat: 'Chat', audio: 'Audio Call', video: 'Video Call' };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all w-full ${selected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 hover:border-blue-500'}`}
        >
            {iconMap[type]}
            <span className="mt-2 font-semibold text-sm">{textMap[type]}</span>
        </button>
    );
};

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onBookAppointment }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType | null>(null);

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];
        // Mock available times for demonstration
        const times = [];
        for (let i = 9; i < 17; i++) {
            if (Math.random() > 0.3) times.push(`${i}:00`);
            if (Math.random() > 0.5) times.push(`${i}:30`);
        }
        return times.sort();
    }, [selectedDate]);

    const handleDateSelect = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        setSelectedTime(null);
    };
    
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setSelectedConsultationType(doctor.consultationTypes[0] || null);
        setIsModalOpen(true);
    };

    const handleBookingConfirm = () => {
        if (!selectedDate || !selectedTime || !selectedConsultationType) return;

        onBookAppointment({
            doctor,
            patient: { name: 'Alex Doe', id: 'user1' },
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            consultationType: selectedConsultationType,
        });
        setIsModalOpen(false);
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>&lt;</button>
                    <h3 className="font-bold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-semibold text-slate-500">{day}</div>)}
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const isToday = isCurrentMonth && day === today.getDate();
                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;
                        return (
                            <button
                                key={day}
                                onClick={() => handleDateSelect(day)}
                                className={`w-10 h-10 rounded-full transition-colors ${isSelected ? 'bg-blue-600 text-white' : ''} ${isToday ? 'border-2 border-blue-500' : ''} hover:bg-blue-100`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8">
            {/* Doctor Info Header */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 mb-8">
                <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-full object-cover" />
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-800">{doctor.name}</h1>
                    <p className="text-xl text-blue-600 font-semibold">{doctor.specialty}</p>
                    <p className="text-slate-500 mt-1">{doctor.location}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-bold text-slate-700">{doctor.rating}</span>
                        <span className="ml-2 text-sm text-slate-500">({doctor.reviews} reviews)</span>
                    </div>
                </div>
                <div className="md:ml-auto text-center md:text-right">
                    <p className="text-3xl font-bold text-green-600">${doctor.consultationFee}</p>
                    <p className="text-slate-500">per session</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {renderCalendar()}
                    {selectedDate && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg mb-4">Available Times for {selectedDate.toDateString()}</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {availableTimes.map(time => (
                                    <button 
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className="p-2 border rounded-lg text-blue-600 border-blue-500 font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-3">About Dr. {doctor.name.split(' ').pop()}</h3>
                        <p className="text-slate-600 text-sm">{doctor.bio}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-3">Credentials</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li><span className="font-semibold">Experience:</span> {doctor.yearsOfExperience} years</li>
                            <li><span className="font-semibold">License:</span> {doctor.licenseNumber}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Booking Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirm Your Booking</h2>
                        <p className="text-slate-600 mb-6">You are booking an appointment with <span className="font-semibold">{doctor.name}</span> on <span className="font-semibold">{selectedDate?.toDateString()}</span> at <span className="font-semibold">{selectedTime}</span>.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Select Consultation Type</label>
                                <div className="grid grid-cols-3 gap-4">
                                   {doctor.consultationTypes.map(type => (
                                       <ConsultationTypeOption 
                                           key={type}
                                           type={type}
                                           selected={selectedConsultationType === type}
                                           onClick={() => setSelectedConsultationType(type)}
                                       />
                                   ))}
                                </div>
                            </div>
                             <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-slate-600">Reason for Visit (optional)</label>
                                <textarea 
                                    id="reason" 
                                    rows={3}
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="e.g. Annual check-up, follow-up, second opinion..."
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                            <button onClick={handleBookingConfirm} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfile;