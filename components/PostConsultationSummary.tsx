import React, { useState } from 'react';
import { summarizeConsultation } from '../services/geminiService';
import type { ConsultationChatMessage, Appointment } from '../types';

interface PostConsultationSummaryProps {
    appointment: Appointment;
    chatHistory: ConsultationChatMessage[];
    onSaveNotes: (notes: { subjective: string, objective: string, assessment: string, plan: string }) => void;
    onBack: () => void;
}

const PostConsultationSummary: React.FC<PostConsultationSummaryProps> = ({ appointment, chatHistory, onSaveNotes, onBack }) => {
    const [notes, setNotes] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNotes(prev => ({ ...prev, [name]: value }));
    };

    const handleSummarize = async () => {
        setIsSummarizing(true);
        const transcript = chatHistory.map(msg => `${msg.sender === 'doctor' ? appointment.doctor.name : appointment.patient.name}: ${msg.text}`).join('\n');
        const summary = await summarizeConsultation(transcript);
        setNotes(summary);
        setIsSummarizing(false);
    };

    const handleSave = () => {
        onSaveNotes(notes);
    };

    const NoteField: React.FC<{ name: keyof typeof notes, label: string }> = ({ name, label }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
            <textarea
                id={name}
                name={name}
                value={notes[name]}
                onChange={handleNoteChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${label.toLowerCase()} details...`}
            />
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Post-Consultation Summary</h1>
                <p className="text-slate-500 mt-1">For patient: <span className="font-semibold">{appointment.patient.name}</span> | Date: {new Date(appointment.date).toDateString()}</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">SOAP Notes</h2>
                    <button
                        onClick={handleSummarize}
                        disabled={isSummarizing || chatHistory.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSummarizing ? 'AI Summarizing...' : 'AI Summarize from Chat'}
                    </button>
                </div>
                <div className="space-y-4">
                    <NoteField name="subjective" label="Subjective" />
                    <NoteField name="objective" label="Objective" />
                    <NoteField name="assessment" label="Assessment" />
                    <NoteField name="plan" label="Plan" />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onBack} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Save to Patient Record</button>
                </div>
            </div>
        </div>
    );
};

export default PostConsultationSummary;
