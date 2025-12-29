import React, { useState, useEffect, useMemo } from 'react';
import { DashboardIcon, StethoscopeIcon, ChatIcon, RecordsIcon, CalendarIcon, UserCircleIcon, PillIcon, WalletIcon, BriefcaseIcon, BeakerIcon } from './components/Icons';
import Dashboard from './components/Dashboard';
import FindDoctor from './components/FindDoctor';
import Telemedicine from './components/Telemedicine';
import Records from './components/Records';
import Appointments from './components/Appointments';
import Prescriptions from './components/Prescriptions';
import Wallet from './components/Wallet';
import DoctorRegistration from './components/DoctorRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorProfile from './components/DoctorProfile';
import ConsultationRoom from './components/ConsultationRoom';
import DoctorAppointments from './components/DoctorAppointments';
import DoctorPatients from './components/DoctorPatients';
import DoctorPatientProfile from './components/DoctorPatientProfile';
import DoctorRefills from './components/DoctorRefills';
import BookLabTest from './components/BookLabTest';
import PostConsultationSummary from './components/PostConsultationSummary';
import { mockAppointments } from './data/mockAppointments';
import type { Appointment, Doctor, MedicalRecord, Prescription, Patient, ConsultationChatMessage, Page, View } from './types';

const mockRecordsData: MedicalRecord[] = [
  { id: '1', title: 'Annual Check-up Results', date: '2023-10-15', type: 'lab_result', fileName: 'lab_results_2023.pdf' },
  { id: '2', title: 'Amoxicillin Prescription', date: '2023-09-22', type: 'prescription', fileName: 'amoxicillin_rx.pdf' },
  { id: '3', title: 'Allergy Test Report', date: '2023-08-01', type: 'lab_result', fileName: 'allergy_report.pdf' },
  { id: '4', title: 'Cardiology Consultation Notes', date: '2023-07-19', type: 'health_history', fileName: 'cardio_notes.pdf' },
];

const mockPrescriptionsData: Prescription[] = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg Tablet',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'Cardiologist' },
    refillsLeft: 2,
    status: 'active',
  },
  {
    id: '2',
    medication: 'Metformin',
    dosage: '500mg Tablet',
    doctor: { name: 'Dr. Evelyn Reed', specialty: 'Cardiologist' },
    refillsLeft: 1,
    status: 'active',
  },
  {
    id: '3',
    medication: 'Atorvastatin',
    dosage: '20mg Tablet',
    doctor: { name: 'Dr. Samuel Chen', specialty: 'Dermatologist' },
    refillsLeft: 0,
    status: 'expired',
  },
  {
    id: '4',
    medication: 'Albuterol',
    dosage: '90mcg Inhaler',
    doctor: { name: 'Dr. Alex Doe', specialty: 'Cardiologist' }, // Matches current logged in doctor
    refillsLeft: 0,
    status: 'pending_approval',
  },
  {
    id: '5',
    medication: 'Omeprazole',
    dosage: '20mg Capsule',
    doctor: { name: 'Dr. Alex Doe', specialty: 'Cardiologist' }, // Matches current logged in doctor
    refillsLeft: 0,
    status: 'pending_approval',
  }
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [currentView, setCurrentView] = useState<View>('patient_app');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockRecordsData);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptionsData);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'pending' | 'success' | 'denied'>('idle');
  const [consultationChatHistory, setConsultationChatHistory] = useState<ConsultationChatMessage[]>([]);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('pending');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus('success');
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocationStatus('denied');
        }
      );
    } else {
        console.error("Geolocation is not supported by this browser.");
        setLocationStatus('denied');
    }
  };
  
  useEffect(() => {
    handleRequestLocation();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setActivePage('doctor-profile');
  };

  const handleBookAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
        ...newAppointmentData,
        id: (appointments.length + 1).toString(),
        status: 'upcoming',
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setActivePage('appointments'); 
    setSelectedDoctor(null);
  };

  const handleJoinCall = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    setConsultationChatHistory([]);
    setActivePage('consultation');
  };
  
  const handleAddPrescription = (newPrescriptionData: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
        ...newPrescriptionData,
        id: Date.now().toString(),
    };
    setPrescriptions(prev => [newPrescription, ...prev]);
  };

  const handleEndCall = () => {
    const isDoctorMode = currentView === 'doctor_app';
    if (isDoctorMode && activeAppointment) {
        setActivePage('post-consultation-summary');
    } else {
        setActiveAppointment(null);
        setConsultationChatHistory([]);
        setActivePage('appointments');
    }
  };

  const handleAddRecord = (newRecordData: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
        ...newRecordData,
        id: Date.now().toString(),
    };
    setMedicalRecords(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSaveConsultationNotes = (notes: MedicalRecord['notes']) => {
    if (!activeAppointment) return;
    const newRecordData: Omit<MedicalRecord, 'id'> = {
        title: `Consultation Note: ${new Date(activeAppointment.date).toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'consultation_note',
        notes,
        doctorName: activeAppointment.doctor.name,
    };
    handleAddRecord(newRecordData);
    setActiveAppointment(null);
    setConsultationChatHistory([]);
    setActivePage('doctor-appointments');
  };

  const handleDeleteRecord = (recordId: string) => {
      setMedicalRecords(prev => prev.filter(record => record.id !== recordId));
  };
  
  const handleUpdatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActivePage('doctor-patient-profile');
  };
  
  const handleReviewRefill = (id: string, status: 'active' | 'denied') => {
      handleUpdatePrescription(id, { status, refillsLeft: status === 'active' ? 3 : 0 });
  };

  const uniquePatients = useMemo(() => {
    const patients = new Map<string, Patient>();
    appointments.forEach(appt => {
        if (!patients.has(appt.patient.id)) {
            patients.set(appt.patient.id, appt.patient);
        }
    });
    return Array.from(patients.values());
  }, [appointments]);


  const renderPatientPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'find-doctor':
        return <FindDoctor onSelectDoctor={handleSelectDoctor} location={location} locationStatus={locationStatus} onRequestLocation={handleRequestLocation} />;
      case 'doctor-profile':
        return selectedDoctor 
            ? <DoctorProfile doctor={selectedDoctor} onBookAppointment={handleBookAppointment} /> 
            : <FindDoctor onSelectDoctor={handleSelectDoctor} location={location} locationStatus={locationStatus} onRequestLocation={handleRequestLocation} />; // Fallback
      case 'telemedicine':
        return <Telemedicine setActivePage={setActivePage} />;
      case 'records':
        return <Records records={medicalRecords} onAddRecord={handleAddRecord} onDeleteRecord={handleDeleteRecord} />;
      case 'appointments':
        return <Appointments appointments={appointments} onJoinCall={handleJoinCall} />;
      case 'book-lab-test':
        return <BookLabTest location={location} locationStatus={locationStatus} onRequestLocation={handleRequestLocation} />;
      case 'prescriptions':
        return <Prescriptions prescriptions={prescriptions} onUpdatePrescription={handleUpdatePrescription} location={location} locationStatus={locationStatus} onRequestLocation={handleRequestLocation} />;
      case 'wallet':
        return <Wallet />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  const renderDoctorPage = () => {
    switch (activePage) {
        case 'doctor-dashboard':
            return <DoctorDashboard setActivePage={setActivePage} />;
        case 'doctor-appointments':
            return <DoctorAppointments appointments={appointments} onStartConsultation={handleJoinCall} onSelectPatient={handleSelectPatient} />;
        case 'doctor-patients':
            return <DoctorPatients patients={uniquePatients} onSelectPatient={handleSelectPatient} />;
        case 'doctor-refills':
             return <DoctorRefills prescriptions={prescriptions} onReviewRequest={handleReviewRefill} />;
        case 'doctor-patient-profile':
            return selectedPatient 
                ? <DoctorPatientProfile 
                    patient={selectedPatient} 
                    appointments={appointments.filter(a => a.patient.id === selectedPatient.id)} 
                    records={medicalRecords}
                    onBack={() => {
                      setSelectedPatient(null);
                      setActivePage('doctor-patients');
                    }}
                    onStartConsultation={handleJoinCall}
                  />
                : <DoctorPatients patients={uniquePatients} onSelectPatient={handleSelectPatient} />; // Fallback
        case 'post-consultation-summary':
            return activeAppointment 
                ? <PostConsultationSummary 
                    appointment={activeAppointment} 
                    chatHistory={consultationChatHistory}
                    onSaveNotes={handleSaveConsultationNotes}
                    onBack={() => {
                        setActiveAppointment(null);
                        setConsultationChatHistory([]);
                        setActivePage('doctor-appointments');
                    }}
                  />
                : <DoctorDashboard setActivePage={setActivePage} />; // Fallback
        default:
            return <DoctorDashboard setActivePage={setActivePage} />;
    }
  };
  
  const isDoctorMode = currentView === 'doctor_app';

  const renderContent = () => {
    if(activePage === 'consultation') {
        return activeAppointment
            ? <ConsultationRoom 
                appointment={activeAppointment} 
                onEndCall={handleEndCall} 
                onAddPrescription={handleAddPrescription} 
                chatHistory={consultationChatHistory}
                onChatHistoryChange={setConsultationChatHistory}
                isDoctorMode={isDoctorMode}
              />
            : isDoctorMode ? renderDoctorPage() : renderPatientPage();
    }
  
    switch (currentView) {
        case 'patient_app':
            return renderPatientPage();
        case 'doctor_app':
            return renderDoctorPage();
        case 'doctor_registration':
            return <DoctorRegistration setCurrentView={setCurrentView} />;
        default:
            return renderPatientPage();
    }
  }
  
  const patientNavItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'find-doctor', label: 'Find a Doctor', icon: <StethoscopeIcon /> },
      { id: 'telemedicine', label: 'AI Symptom Checker', icon: <ChatIcon /> },
      { id: 'appointments', label: 'Appointments', icon: <CalendarIcon /> },
      { id: 'book-lab-test', label: 'Book a Lab Test', icon: <BeakerIcon /> },
      { id: 'prescriptions', label: 'Prescription Refills', icon: <PillIcon /> },
      { id: 'records', label: 'Medical Records', icon: <RecordsIcon /> },
      { id: 'wallet', label: 'Wallet & Insurance', icon: <WalletIcon /> },
  ];
  
  const doctorNavItems = [
    { id: 'doctor-dashboard', label: 'Dashboard', icon: <BriefcaseIcon /> },
    { id: 'doctor-appointments', label: 'Appointments', icon: <CalendarIcon /> },
    { id: 'doctor-patients', label: 'My Patients', icon: <RecordsIcon /> },
    { id: 'doctor-refills', label: 'Refill Requests', icon: <ChatIcon /> },
  ];

  const NavLink: React.FC<{item: {id: string; label: string; icon: React.ReactNode;}; isActive: boolean; onClick: () => void;}> = ({item, isActive, onClick}) => (
      <button 
        key={item.id}
        onClick={onClick}
        className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
      >
        <div className="w-6 h-6 mr-3">{item.icon}</div>
        <span className="font-medium">{item.label}</span>
      </button>
  );
  
  const navItems = isDoctorMode ? doctorNavItems : patientNavItems;
  
  const handleNavClick = (id: string) => {
    if(!isDoctorMode) {
        setSelectedDoctor(null); 
    }
    if (isDoctorMode) {
      setSelectedPatient(null);
    }
    setActivePage(id as Page);
    setIsSidebarOpen(false);
  };
  
  const handleViewChange = (newView: View) => {
    setCurrentView(newView);
    if(newView === 'doctor_app') {
      setActivePage('doctor-dashboard');
    } else if (newView === 'patient_app') {
      setActivePage('dashboard');
    }
  };

  const HeaderContent = () => (
     <div className="flex items-center gap-4">
        {currentView !== 'doctor_registration' && (
             <div className="flex items-center gap-2">
                 { !isDoctorMode && 
                    <button onClick={() => setCurrentView('doctor_registration')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
                        <StethoscopeIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">New Doctor Registration</span>
                    </button>
                 }

                <span className="text-sm font-medium text-slate-700">{isDoctorMode ? 'Doctor Mode' : 'Patient Mode'}</span>
                <button
                    onClick={() => handleViewChange(isDoctorMode ? 'patient_app' : 'doctor_app')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDoctorMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDoctorMode ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
            </div>
        )}
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar for desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 fixed h-full ${currentView === 'doctor_registration' || activePage === 'consultation' || activePage === 'post-consultation-summary' ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="text-2xl font-bold text-blue-600 mb-8 flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 12h3v8h5v-6h4v6h5v-8h3L12 2z"></path></svg>
            <span>Medlink</span>
          </div>
          <nav className="flex flex-col space-y-2">
              {navItems.map(item => <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={() => handleNavClick(item.id)} />)}
          </nav>
          <div className="mt-auto">
            <div className="flex items-center p-3 rounded-lg bg-slate-100">
                <UserCircleIcon className="w-10 h-10 text-slate-500"/>
                <div className="ml-3">
                    <p className="font-semibold text-slate-800">{isDoctorMode ? 'Dr. Alex Doe' : 'Alex Doe'}</p>
                    <p className="text-sm text-slate-500">{isDoctorMode ? 'Cardiologist' : 'Patient'}</p>
                </div>
            </div>
          </div>
      </aside>

      {/* Mobile header & Desktop top bar */}
      <header className={`fixed top-0 left-0 right-0 bg-white shadow-md z-20 flex justify-between items-center p-4 md:ml-64 ${currentView === 'doctor_registration' || activePage === 'consultation' || activePage === 'post-consultation-summary' ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="text-xl font-bold text-blue-600 md:hidden">Medlink</div>
        <div className="hidden md:block"></div> {/* Spacer for desktop */}
        <div className="flex items-center gap-4">
            <HeaderContent/>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-700 md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-4 z-40 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-2xl font-bold text-blue-600 mb-8">Medlink</div>
        <nav className="flex flex-col space-y-2">
            {navItems.map(item => <NavLink key={item.id} item={item} isActive={activePage === item.id} onClick={() => handleNavClick(item.id)} />)}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${activePage !== 'consultation' ? 'md:ml-64' : ''} ${currentView !== 'doctor_registration' && activePage !== 'consultation' && activePage !== 'post-consultation-summary' ? 'mt-16 md:mt-20' : ''} ${activePage === 'consultation' || activePage === 'post-consultation-summary' ? 'md:ml-0' : ''}`}>
        <div className="h-full w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;