
export type ConsultationType = 'chat' | 'audio' | 'video';

export type Page = 
  'dashboard' | 'find-doctor' | 'telemedicine' | 'records' | 'appointments' | 
  'prescriptions' | 'wallet' | 'doctor-profile' | 'consultation' | 
  'doctor-dashboard' | 'doctor-appointments' | 'doctor-patients' | 'doctor-patient-profile' | 'doctor-refills' |
  'book-lab-test' | 'post-consultation-summary';

export type View = 'patient_app' | 'doctor_app' | 'doctor_registration';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  bio: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  consultationTypes: ConsultationType[];
}

export interface DoctorProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  consultationTypes: ConsultationType[];
  document?: File;
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: 'prescription' | 'lab_result' | 'health_history' | 'consultation_note';
  fileName?: string;
  notes?: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
  };
  doctorName?: string;
}

export interface Patient {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  patient: Patient;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  consultationType: ConsultationType;
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ConsultationChatMessage {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
  timestamp: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  }
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  doctor: Pick<Doctor, 'name' | 'specialty'>;
  pharmacy?: string;
  refillsLeft: number;
  status: 'active' | 'order_placed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'expired' | 'pending_approval' | 'denied';
  orderDate?: string;
}

export interface Insurance {
  id: string;
  provider: string;
  policyNumber: string;
  documentName?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'week' | 'month' | 'year';
  type: 'individual' | 'corporate';
  features: string[];
  isPopular?: boolean;
}

export interface LabTest {
    id: string;
    name: string;
    category: string;
    description: string;
}
