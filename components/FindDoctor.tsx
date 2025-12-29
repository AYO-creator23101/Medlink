import React, { useState, useCallback } from 'react';
import { findNearbySpecialists } from '../services/geminiService';
import { LocationPinIcon } from './Icons';
import type { GroundingChunk, Doctor } from '../types';
import { mockDoctors } from '../data/mockDoctors';

interface FindDoctorProps {
  onSelectDoctor: (doctor: Doctor) => void;
  location: { latitude: number; longitude: number } | null;
  locationStatus: 'idle' | 'pending' | 'success' | 'denied';
  onRequestLocation: () => void;
}

const FindDoctor: React.FC<FindDoctorProps> = ({ onSelectDoctor, location, locationStatus, onRequestLocation }) => {
  const [specialty, setSpecialty] = useState('');
  const [geminiResults, setGeminiResults] = useState('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!specialty.trim()) {
      setError('Please enter a medical specialty.');
      return;
    }
    if (!location) {
      setError('Please allow location access to find doctors near you.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setGeminiResults('');
    setGroundingChunks([]);

    const response = await findNearbySpecialists(specialty, location);
    setGeminiResults(response.text);
    setGroundingChunks(response.groundingChunks);
    setIsLoading(false);
  };

  const filteredDoctors = specialty.trim() 
    ? mockDoctors.filter(d => d.specialty.toLowerCase().includes(specialty.trim().toLowerCase())) 
    : mockDoctors;

  const renderLocationRequest = () => {
    switch (locationStatus) {
      case 'denied':
        return (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <LocationPinIcon className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">Location Access Denied</h3>
            <p className="text-slate-600 my-2 max-w-md">
              To find specialists near you, Medlink needs location access. Please enable location services for this site in your browser settings.
            </p>
            <button
              onClick={onRequestLocation}
              className="mt-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Retry Location Access
            </button>
          </div>
        );
      case 'pending':
        return (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Getting your location...</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <LocationPinIcon className="w-12 h-12 text-blue-500 mb-4" />
            <p className="text-slate-600 mb-4">We need your location to find specialists nearby.</p>
            {/* FIX: Removed unreachable conditions for `locationStatus === 'pending'`.
                Inside the default case of the switch, locationStatus is narrowed to 'idle' | 'success',
                so checking for 'pending' is unnecessary and causes a type error. */}
            <button
              onClick={onRequestLocation}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              Allow Location Access
            </button>
          </div>
        );
    }
  };


  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Find a Specialist</h1>
        <p className="text-slate-500 mt-1">Search for verified doctors and specialists near you.</p>
      </header>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg flex-shrink-0">
        {!location ? renderLocationRequest() : (
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g., Cardiologist, Dermatologist"
              className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isLoading ? 'AI Searching...' : 'AI Search'}
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      <div className="mt-8 flex-grow overflow-y-auto">
        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Finding specialists for you...</p>
          </div>
        )}
        
        {geminiResults && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">AI-Powered Suggestions</h2>
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: geminiResults.replace(/\n/g, '<br />') }} />
            {groundingChunks.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-slate-700">Sources & Locations</h3>
                <ul className="mt-2 space-y-2">
                  {groundingChunks.filter(chunk => chunk.maps).map((chunk, index) => (
                    <li key={index} className="flex items-start">
                      <LocationPinIcon className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <a href={chunk.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {chunk.maps?.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 px-2">Available Doctors</h2>
            {filteredDoctors.map(doctor => (
                <button 
                    key={doctor.id} 
                    onClick={() => onSelectDoctor(doctor)}
                    className="w-full bg-white p-4 rounded-2xl shadow-lg flex items-center gap-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                    <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover"/>
                    <div className="flex-grow">
                        <p className="font-bold text-lg text-slate-800">{doctor.name}</p>
                        <p className="text-md text-blue-600 font-semibold">{doctor.specialty}</p>
                        <p className="text-sm text-slate-500 mt-1">{doctor.location}</p>
                        <div className="flex items-center mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 font-bold text-slate-700">{doctor.rating}</span>
                            <span className="ml-2 text-sm text-slate-500">({doctor.reviews} reviews)</span>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${doctor.consultationFee}</p>
                        <p className="text-sm text-slate-500">per session</p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;