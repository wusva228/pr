import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import { CORGI_ICON_URL } from '../constants';
import { hapticImpact, hapticSelection, hapticNotification } from '../services/haptics';

const SYSTEM_INSTRUCTION = 'Ты — дружелюбный и немного озорной корги по имени Степан. Ты обожаешь свою хозяйку Анастасию и вкусняшки. Твои ответы должны быть короткими, милыми, в собачьей манере. Ты понимаешь русский язык, но отвечаешь так, как думала бы собака. Используй слова "гав", "тяф", "урр", "хррр". Пример: "Гав! Вкусняшка? Бегу!", а не "Здравствуйте, я бы хотел получить лакомство". Твои ответы должны быть очень короткими, максимум 1-3 слова или звука.';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isBot = message.sender === 'bot';
    return (
        <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && (
                <img src={CORGI_ICON_URL} alt="Stepan" className="w-8 h-8 rounded-full shadow-md flex-shrink-0 object-cover" />
            )}
            <div
                className={`max-w-[75%] p-3 rounded-2xl text-white shadow-md ${
                    isBot ? 'bg-gray-500 rounded-bl-lg' : 'bg-blue-500 rounded-br-lg'
                }`}
            >
                {message.text}
            </div>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <img src={CORGI_ICON_URL} alt="Stepan" className="w-8 h-8 rounded-full shadow-md object-cover" />
        <div className="p-3 rounded-2xl bg-gray-500 rounded-bl-lg">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    </div>
);


export default function ChatWithStepan({ onBack }: { onBack: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        try {
            const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
            if (!apiKey) {
                throw new Error("API_KEY is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
                }
            });
            chatRef.current = chat;
            setMessages([{ id: 0, sender: 'bot', text: 'Гав!' }]);
        } catch (e: any) {
            console.error(e);
            setError(`Ошибка инициализации чата: ${e.message}`);
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatRef.current) return;
        
        const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        hapticImpact('medium');

        try {
            const stream = await chatRef.current.sendMessageStream({ message: input });

            let botMessage: ChatMessage = { id: Date.now() + 1, text: '', sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

            for await (const chunk of stream) {
                botMessage.text += chunk.text;
                setMessages(prev => prev.map(m => m.id === botMessage.id ? { ...m, text: botMessage.text } : m));
            }

        } catch (e: any) {
            console.error(e);
            setError('Степан утомился и не может сейчас ответить. Попробуйте позже.');
            hapticNotification('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gray-800 text-white">
            <header className="flex justify-between items-center p-3 bg-gray-900/70 backdrop-blur-sm shadow-lg z-10">
                <button onClick={onBack} className="text-sm font-bold bg-gray-700 py-2 px-4 rounded-xl transition-colors hover:bg-gray-600">Меню</button>
                <div className="text-center">
                    <h1 className="text-lg font-bold">Степан</h1>
                    <p className="text-xs text-green-400">в сети</p>
                </div>
                <div className="w-16"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                {error && <div className="text-center text-red-400 text-sm p-2 bg-red-900/50 rounded-lg">{error}</div>}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-2 bg-gray-900/70 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Написать Степану..."
                        className="flex-1 bg-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => { handleSend(); hapticSelection(); }}
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center transition-transform transform active:scale-90 disabled:bg-gray-600"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                       </svg>
                    </button>
                </div>
            </footer>
        </div>
    );
}