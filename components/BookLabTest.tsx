import React, { useState } from 'react';
import { findNearbyLabs } from '../services/geminiService';
import { LocationPinIcon } from './Icons';
import type { GroundingChunk } from '../types';
import { mockLabTests } from '../data/mockLabTests';

interface BookLabTestProps {
  location: { latitude: number; longitude: number } | null;
  locationStatus: 'idle' | 'pending' | 'success' | 'denied';
  onRequestLocation: () => void;
}

const BookLabTest: React.FC<BookLabTestProps> = ({ location, locationStatus, onRequestLocation }) => {
  const [testName, setTestName] = useState('');
  const [geminiResults, setGeminiResults] = useState('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');

  const handleSearch = async (query?: string) => {
    const searchTerm = query || testName;
    if (!searchTerm.trim()) {
      setError('Please enter a test name to search.');
      return;
    }
    if (!location) {
      setError('Please allow location access to find labs near you.');
      return;
    }
    
    setSearchedTerm(searchTerm);
    setIsLoading(true);
    setError('');
    setGeminiResults('');
    setGroundingChunks([]);

    const response = await findNearbyLabs(searchTerm, location);
    setGeminiResults(response.text);
    setGroundingChunks(response.groundingChunks);
    setIsLoading(false);
  };

  const handlePopularTestClick = (name: string) => {
    setTestName(name);
    handleSearch(name);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderLocationRequest = () => {
    switch (locationStatus) {
      case 'denied':
        return (
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-slate-800">Location Access Denied</h3>
            <p className="text-slate-600 my-2">Please enable location services to find labs near you.</p>
            <button onClick={onRequestLocation} className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Retry</button>
          </div>
        );
      case 'pending':
        return <div className="text-center p-4"><p className="text-slate-600">Getting your location...</p></div>;
      default:
        return (
          <div className="text-center p-4">
            <p className="text-slate-600 mb-4">We need your location to find labs nearby.</p>
            <button onClick={onRequestLocation} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Allow Location Access</button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Book a Lab Test</h1>
        <p className="text-slate-500 mt-1">Find diagnostic centers and schedule your tests.</p>
      </header>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg flex-shrink-0">
        {!location ? renderLocationRequest() : (
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Blood Test, MRI Scan"
              className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
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
            <p className="mt-4 text-slate-600">Finding labs for you...</p>
          </div>
        )}
        
        {geminiResults && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Labs near you for "{searchedTerm}"</h2>
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: geminiResults.replace(/\n/g, '<br />') }} />
            {groundingChunks.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-slate-700">Locations</h3>
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

        {!geminiResults && !isLoading && (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Popular Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockLabTests.map(test => (
                        <button 
                            key={test.id} 
                            onClick={() => handlePopularTestClick(test.name)}
                            className="p-4 border rounded-lg text-left hover:border-blue-500 hover:bg-slate-50 transition-colors"
                        >
                            <p className="font-semibold text-slate-700">{test.name}</p>
                            <p className="text-sm text-slate-500 mt-1">{test.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        )}
        
      </div>
    </div>
  );
};

export default BookLabTest;