
import React, { useState, useRef, useEffect } from 'react';
import type { Appointment, ConsultationChatMessage, Prescription } from '../types';
import { UserCircleIcon, SendIcon, MicOnIcon, MicOffIcon, VideoCameraIcon, VideoCameraSlashIcon, PhoneXMarkIcon, ArrowUturnLeftIcon } from './Icons';

interface ConsultationRoomProps {
  appointment: Appointment;
  onEndCall: () => void;
  onAddPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  chatHistory: ConsultationChatMessage[];
  onChatHistoryChange: (history: ConsultationChatMessage[]) => void;
  isDoctorMode: boolean;
}

const ConsultationRoom: React.FC<ConsultationRoomProps> = ({ appointment, onEndCall, onAddPrescription, chatHistory, onChatHistoryChange, isDoctorMode }) => {
  const { doctor, patient } = appointment;
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messages = chatHistory;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = () => {
    if (input.trim() === '' || isSending) return;

    const currentMessage: ConsultationChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: isDoctorMode ? 'doctor' : 'patient',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, currentMessage];
    onChatHistoryChange(newHistory);
    setInput('');
    setIsSending(true);

    // Simulate response from the OTHER party
    setTimeout(() => {
      const responseSender = isDoctorMode ? 'patient' : 'doctor';
      const responseText = isDoctorMode 
        ? "Thank you doctor, I will follow your advice." 
        : "Thank you for sharing. Let's talk about that.";

      const responseMessage: ConsultationChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: responseSender,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onChatHistoryChange([...newHistory, responseMessage]);
      setIsSending(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleEndAndPrescribe = () => {
    if (isDoctorMode) {
        // Simulate doctor issuing a prescription at the end of the call
        const possibleMeds = [
            { name: 'Amoxicillin', dosage: '500mg Capsule' },
            { name: 'Ibuprofen', dosage: '200mg Tablet' },
            { name: 'Azithromycin', dosage: '250mg Tablet' },
        ];
        const randomMed = possibleMeds[Math.floor(Math.random() * possibleMeds.length)];
        
        const newPrescription: Omit<Prescription, 'id'> = {
            medication: randomMed.name,
            dosage: randomMed.dosage,
            doctor: { name: doctor.name, specialty: doctor.specialty },
            refillsLeft: Math.floor(Math.random() * 3) + 1,
            status: 'active',
        };
        onAddPrescription(newPrescription);
    }
    onEndCall(); // Navigate away
  };


  const CallControlButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    ariaLabel: string;
  }> = ({ onClick, children, className = 'bg-slate-700 hover:bg-slate-600', ariaLabel }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-3 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white ${className}`}
    >
      {children}
    </button>
  );
  
  const remoteName = isDoctorMode ? patient.name : doctor.name;
  const remoteImage = isDoctorMode ? null : doctor.image; // Patient usually doesn't have a profile pic in this mock
  const localName = isDoctorMode ? doctor.name : patient.name;

  return (
    <div className="h-screen bg-slate-100 flex flex-col">
      <header className="flex-shrink-0 bg-white shadow-md z-10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Consultation with {remoteName}</h1>
          <p className="text-sm text-slate-500">{isDoctorMode ? 'Patient' : doctor.specialty}</p>
        </div>
        <button onClick={onEndCall} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
            <ArrowUturnLeftIcon className="w-5 h-5"/>
            <span>Back to Appointments</span>
        </button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        {/* Video and Controls Section */}
        <div className="lg:col-span-3 bg-slate-900 flex flex-col relative p-4">
          {/* Main Video (Remote User) */}
          <div className="flex-1 bg-black rounded-xl flex items-center justify-center relative overflow-hidden">
            {remoteImage ? (
                 <img src={remoteImage} alt={remoteName} className="w-32 h-32 rounded-full opacity-50"/>
            ) : (
                 <UserCircleIcon className="w-32 h-32 text-slate-600 opacity-50" />
            )}
           
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {remoteName}
            </div>
          </div>
          
          {/* PIP Video (Local User) */}
          <div className="absolute bottom-20 right-8 w-1/4 max-w-xs bg-black rounded-xl border-4 border-slate-700 flex items-center justify-center overflow-hidden aspect-video z-20">
             {/* In a real app, this would be the local camera stream */}
             {isDoctorMode ? (
                 <img src={doctor.image} alt="You" className="w-full h-full object-cover opacity-80"/>
             ) : (
                 <UserCircleIcon className="w-16 h-16 text-slate-600" />
             )}
             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {localName} (You)
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md z-20">
            <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-full p-2 flex justify-center items-center gap-4">
              <CallControlButton onClick={() => setIsMicOn(!isMicOn)} ariaLabel={isMicOn ? "Mute microphone" : "Unmute microphone"}>
                {isMicOn ? <MicOnIcon className="w-6 h-6"/> : <MicOffIcon className="w-6 h-6"/>}
              </CallControlButton>
              <CallControlButton onClick={() => setIsCameraOn(!isCameraOn)} ariaLabel={isCameraOn ? "Turn off camera" : "Turn on camera"}>
                {isCameraOn ? <VideoCameraIcon className="w-6 h-6"/> : <VideoCameraSlashIcon className="w-6 h-6"/>}
              </CallControlButton>
              <CallControlButton onClick={handleEndAndPrescribe} className="bg-red-600 hover:bg-red-700" ariaLabel="End call">
                <PhoneXMarkIcon className="w-6 h-6"/>
              </CallControlButton>
            </div>
          </div>
        </div>

        {/* Chat and Info Sidebar */}
        <div className="lg:col-span-1 bg-white flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-bold text-lg text-slate-800">Live Chat</h2>
            </div>
            {/* Chat messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                 {messages.map((msg) => {
                    const isMe = (isDoctorMode && msg.sender === 'doctor') || (!isDoctorMode && msg.sender === 'patient');
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'justify-end' : ''}`}>
                            {!isMe && (
                                isDoctorMode ? <UserCircleIcon className="w-8 h-8 text-slate-400 flex-shrink-0" /> : <img src={doctor.image} alt="Doctor" className="w-8 h-8 rounded-full flex-shrink-0" />
                            )}
                            <div className={`max-w-xs p-3 rounded-2xl ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <span className="text-xs opacity-70 mt-1 block text-right">{msg.timestamp}</span>
                            </div>
                            {isMe && (
                                isDoctorMode ? <img src={doctor.image} alt="Me" className="w-8 h-8 rounded-full flex-shrink-0" /> : <UserCircleIcon className="w-8 h-8 text-slate-400 flex-shrink-0" />
                            )}
                        </div>
                    );
                 })}
                {isSending && (
                    <div className="flex items-start gap-3">
                         {isDoctorMode ? <UserCircleIcon className="w-8 h-8 text-slate-400 flex-shrink-0" /> : <img src={doctor.image} alt="Doctor" className="w-8 h-8 rounded-full flex-shrink-0" />}
                        <div className="max-w-xs p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            {/* Chat input */}
            <div className="p-4 bg-slate-50 border-t">
                <div className="flex items-center bg-white border border-slate-300 rounded-full p-1 shadow-sm">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-sm"
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isSending || !input.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ConsultationRoom;
