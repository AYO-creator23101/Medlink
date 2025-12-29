import React, { useState } from 'react';
import type { MedicalRecord } from '../types';
import { PlusIcon, TrashIcon, UploadIcon, XMarkIcon } from './Icons';

interface RecordsProps {
    records: MedicalRecord[];
    onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
    onDeleteRecord: (id: string) => void;
}

const initialFormState: Omit<MedicalRecord, 'id'> = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'lab_result',
    fileName: '',
};

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

const Records: React.FC<RecordsProps> = ({ records, onAddRecord, onDeleteRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewRecord(prev => ({ ...prev, fileName: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.title || !newRecord.date || !newRecord.type) {
        alert("Please fill in all required fields.");
        return;
    }
    onAddRecord(newRecord);
    setIsModalOpen(false);
    setNewRecord(initialFormState);
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Medical Records</h1>
          <p className="text-slate-500 mt-1">Your secure digital health history.</p>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">All Records</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5"/>
              Upload Record
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b text-sm text-slate-500">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">File / Details</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{record.title}</td>
                    <td className="p-3 text-slate-600">{record.date}</td>
                    <td className="p-3"><RecordTypePill type={record.type} /></td>
                    <td className="p-3 text-slate-600 text-sm">{record.fileName ? record.fileName : (record.type === 'consultation_note' ? 'View Notes' : 'N/A')}</td>
                    <td className="p-3 text-right">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-800 mr-4">View</a>
                      <button onClick={() => onDeleteRecord(record.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                        <TrashIcon className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500">You have no medical records yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Click "Upload Record" to add your first one.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload a New Medical Record</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Record Title</label>
                        <input type="text" name="title" id="title" value={newRecord.title} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Annual Blood Test"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                            <input type="date" name="date" id="date" value={newRecord.date} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700">Record Type</label>
                            <select name="type" id="type" value={newRecord.type} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="lab_result">Lab Result</option>
                                <option value="prescription">Prescription</option>
                                <option value="health_history">Health History</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Attach File (Optional)</label>
                        <div className="mt-1 flex items-center justify-center w-full">
                            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon className="w-8 h-8 mb-3 text-slate-400"/>
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-400">PDF, PNG, JPG (MAX. 10MB)</p>
                                </div>
                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div> 
                        {newRecord.fileName && <p className="text-sm text-green-600 mt-2">File selected: {newRecord.fileName}</p>}
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Save Record</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  );
};

export default Records;