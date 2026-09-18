import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  User,
  CheckCircle2,
  RefreshCw,
  Clock,
  Heart,
} from 'lucide-react';
import { PetProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePet?: PetProfile;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  activePet,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your Petwrld AI Care Concierge. I can answer pet health, nutrition, behavioral, or first-aid questions about ${
        activePet?.name || 'your pet'
      }. How can I assist you and your furry family member today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const petContext = activePet
        ? `Pet profile: Name is ${activePet.name}, Species: ${activePet.species}, Breed: ${activePet.breed}, Age: ${activePet.age}, Weight: ${activePet.weight}kg, Known allergies: ${activePet.allergies.join(', ') || 'None'}.`
        : 'Pet profile: General dog/cat inquiry.';

      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history,
          petProfile: activePet,
          petContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text:
          data.reply ||
          'Thank you for sharing. For acute or severe symptoms, please also contact our 24/7 Veterinary Hospital.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: Message = {
        id: `a-err-${Date.now()}`,
        sender: 'assistant',
        text: `Based on standard veterinary guidelines for ${activePet?.name || 'your pet'}: If your pet is showing sudden lethargy, vomiting, or breathing issues, keep them comfortable and consult an on-duty emergency vet immediately via our 24/7 SOS dispatch. For dietary transitions, always introduce new foods slowly over 7-10 days.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `Is chocolate toxic to ${activePet?.name || 'dogs'}?`,
    `How much exercise does a ${activePet?.breed || 'pet'} need daily?`,
    `Safe home remedies for itchy paws`,
    `Vaccine schedule for ${activePet?.species || 'puppies'}`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[90vh] max-h-[680px] shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">Petwrld AI Pet Care Concierge</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini Flash Live
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Active Patient Context:{' '}
                <strong className="text-amber-400">
                  {activePet?.name || 'Milo'} ({activePet?.breed || 'Golden Retriever'})
                </strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-1.5 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            AI guidance is educational and does not replace emergency clinical veterinary diagnosis.
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-900 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-tr-xs'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] text-stone-400 px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%]">
              <div className="w-7 h-7 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Consulting Petwrld veterinary knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInputValue(prompt);
              }}
              className="text-[11px] bg-stone-100 hover:bg-amber-50 hover:text-amber-900 text-stone-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-stone-200"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            placeholder={`Ask a question about ${activePet?.name || 'your pet'} (diet, symptoms, training)...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
