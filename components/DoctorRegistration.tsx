
import React, { useState } from 'react';
import type { DoctorProfile, ConsultationType } from '../types';
import type { View } from '../types';
import { UploadIcon } from './Icons';

interface DoctorRegistrationProps {
    setCurrentView: (view: View) => void;
}

const specialties = ["Cardiology", "Dermatology", "Pediatrics", "Neurology", "Orthopedics", "General Practice"];
const consultationOptions: { id: ConsultationType, label: string }[] = [
    { id: 'chat', label: 'Chat' },
    { id: 'audio', label: 'Audio Call' },
    { id: 'video', label: 'Video Call' },
];

const DoctorRegistration: React.FC<DoctorRegistrationProps> = ({ setCurrentView }) => {
    const [formData, setFormData] = useState<DoctorProfile>({
        fullName: '',
        email: '',
        phoneNumber: '',
        specialty: '',
        licenseNumber: '',
        yearsOfExperience: 0,
        consultationFee: 0,
        consultationTypes: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, document: e.target.files![0] }));
        }
    };
    
    const handleConsultationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const type = value as ConsultationType;

        setFormData(prev => {
            const currentTypes = prev.consultationTypes || [];
            if (checked) {
                return { ...prev, consultationTypes: [...new Set([...currentTypes, type])] };
            } else {
                return { ...prev, consultationTypes: currentTypes.filter(t => t !== type) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting Doctor Profile:", formData);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if(isSuccess) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                 <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Registration Submitted!</h1>
                    <p className="text-slate-600 mb-6">Thank you for submitting your profile. Our team will review your credentials and you will be notified via email once your account is approved. This process usually takes 2-3 business days.</p>
                    <button 
                        onClick={() => setCurrentView('patient_app')}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </button>
                 </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-2xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">Become a Medlink Doctor</h1>
                    <p className="text-slate-500 mt-2">Join our network of trusted healthcare professionals. Fill out the form below to get started.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-600">Full Name</label>
                            <input type="text" name="fullName" id="fullName" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
                            <input type="email" name="email" id="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-600">Phone Number</label>
                            <input type="tel" name="phoneNumber" id="phoneNumber" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-medium text-slate-600">Specialty</label>
                            <select name="specialty" id="specialty" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select a specialty</option>
                                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="licenseNumber" className="block text-sm font-medium text-slate-600">Medical License Number</label>
                            <input type="text" name="licenseNumber" id="licenseNumber" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-600">Years of Experience</label>
                                <input type="number" name="yearsOfExperience" id="yearsOfExperience" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                             <div>
                                <label htmlFor="consultationFee" className="block text-sm font-medium text-slate-600">Fee (USD)</label>
                                <input type="number" name="consultationFee" id="consultationFee" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <fieldset>
                            <legend className="block text-sm font-medium text-slate-600 mb-2">Consultation Types Offered</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
                                {consultationOptions.map((option) => (
                                    <div key={option.id} className="relative flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id={option.id}
                                                name="consultationTypes"
                                                type="checkbox"
                                                value={option.id}
                                                onChange={handleConsultationTypeChange}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={option.id} className="font-medium text-slate-700">
                                                {option.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        <label htmlFor="document" className="block text-sm font-medium text-slate-600">Upload License/CV</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600 justify-center"><label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" required className="sr-only" onChange={handleFileChange} /></label><p className="pl-1">or drag and drop</p></div>
                                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                                {formData.document && <p className="text-sm text-green-600 pt-2">File selected: {formData.document.name}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setCurrentView('patient_app')} className="px-6 py-3 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait transition-colors">
                            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistration;
