import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getSymptomCheckerResponse } from '../services/geminiService';
import { UserCircleIcon, BotIcon, SendIcon } from './Icons';
import type { Page } from '../types';

interface TelemedicineProps {
  setActivePage: (page: Page) => void;
}

const Telemedicine: React.FC<TelemedicineProps> = ({ setActivePage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.dataset.action === 'find-doctor') {
        event.preventDefault();
        setActivePage('find-doctor');
      }
    };
    
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('click', handleLinkClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleLinkClick);
      }
    };
  }, [setActivePage]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }]
    }));

    const botResponseText = await getSymptomCheckerResponse(chatHistory, input);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const processMessageText = (text: string): string => {
    const linkRegex = /\[consult a doctor\]\(find-doctor\)/g;
    const linkHtml = `<a href="#" data-action="find-doctor" class="font-bold text-blue-600 underline hover:no-underline">consult a doctor</a>`;
    return text.replace(/\n/g, '<br />').replace(linkRegex, linkHtml);
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-8 flex-shrink-0">
        <h1 className="text-3xl font-bold text-slate-800">AI Symptom Checker</h1>
        <p className="text-slate-500 mt-1">Get AI-powered insights into your symptoms. This is not a substitute for professional medical advice.</p>
      </header>

      <div className="flex-grow bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'bot' && <BotIcon className="w-8 h-8 text-white bg-blue-500 rounded-full p-1.5 flex-shrink-0" />}
              <div className={`max-w-md p-4 rounded-2xl ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                 <p className="text-sm" dangerouslySetInnerHTML={{ __html: processMessageText(message.text) }} />
                 <span className="text-xs opacity-60 mt-2 block text-right">{message.timestamp}</span>
              </div>
              {message.sender === 'user' && <UserCircleIcon className="w-8 h-8 text-slate-400 flex-shrink-0" />}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <BotIcon className="w-8 h-8 text-white bg-blue-500 rounded-full p-1.5 flex-shrink-0" />
                <div className="max-w-md p-4 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-center bg-white border border-slate-300 rounded-full p-1 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-grow px-4 py-2 bg-transparent focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;