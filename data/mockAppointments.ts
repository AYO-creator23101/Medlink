import type { Appointment } from '../types';
import { mockDoctors } from './mockDoctors';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctor: mockDoctors[0],
    patient: { name: 'Alex Doe', id: 'user1' },
    date: '2024-08-15',
    time: '10:30 AM',
    status: 'upcoming',
    consultationType: 'video',
  },
  {
    id: '2',
    doctor: mockDoctors[1],
    patient: { name: 'Alex Doe', id: 'user1' },
    date: '2024-07-20',
    time: '02:00 PM',
    status: 'completed',
    consultationType: 'chat',
  },
  {
    id: '3',
    doctor: mockDoctors[2],
    patient: { name: 'Alex Doe', id: 'user1' },
    date: '2024-06-10',
    time: '11:00 AM',
    status: 'completed',
    consultationType: 'audio',
  },
  {
    id: '4',
    doctor: mockDoctors[0],
    patient: { name: 'Jane Smith', id: 'user2' },
    date: '2024-08-18',
    time: '09:00 AM',
    status: 'upcoming',
    consultationType: 'video',
  },
  {
    id: '5',
    doctor: mockDoctors[0],
    patient: { name: 'Jane Smith', id: 'user2' },
    date: '2024-07-22',
    time: '03:30 PM',
    status: 'completed',
    consultationType: 'chat',
  },
];
