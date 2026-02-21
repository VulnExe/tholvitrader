import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { getTierLabel } from '@/lib/tierSystem';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function SupportChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 I'm your TholviTrader assistant. How can I help you level up your trading today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { courses, tools, siteSettings } = useStore();

    const clearChat = () => {
        setMessages([
            {
                id: '1',
                text: "Hi there! 👋 I'm your TholviTrader assistant. How can I help you level up your trading today?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const response = generateResponse(text);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const generateResponse = (input: string): string => {
        const query = input.toLowerCase();

        if (query.includes('course') || query.includes('learn') || query.includes('education')) {
            if (courses.length > 0) {
                const courseList = courses.slice(0, 3).map(c => `• ${c.title}`).join('\n');
                return `We have some great educational content! Currently we offer ${courses.length} courses including:\n${courseList}\n\nYou can find them all in the "Courses" tab.`;
            }
            return "We offer premium trading courses tailored for all levels. Check out the Courses section to get started!";
        }

        if (query.includes('tool') || query.includes('software') || query.includes('crack')) {
            if (tools.length > 0) {
                const toolList = tools.slice(0, 3).map(t => `• ${t.title}`).join('\n');
                return `Our toolbox is packed! We have tools like:\n${toolList}\n\nHead over to the "Tools" section to see the full list.`;
            }
            return "Our tools section includes premium crack tools and indicators to give you an edge in the market.";
        }

        if (query.includes('upgrade') || query.includes('price') || query.includes('cost') || query.includes('buy') || query.includes('join')) {
            return `We have multiple tiers to fit your needs:\n• Free: Basic access\n• Tier 1 ($${siteSettings.tier1Price}): Premium courses & basic tools\n• Tier 2 ($${siteSettings.tier2Price}): Full access to everything including VIP indicators.\n\nYou can upgrade anytime in the "My Access" or "Upgrade" page!`;
        }

        if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return "Hello! I'm here to help you navigate TholviTrader. Ask me about our courses, tools, or how to upgrade your account.";
        }


        return "I'm not quite sure I understand, but I can tell you about our Courses, Tools, or Subscription plans. What would you like to know more about?";
    };

    const quickReplies = [
        "Tell me about courses",
        "What tools do you have?",
        "How do I upgrade?",
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="mb-4 w-[380px] h-[550px] bg-[#101014]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Tholvi Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={clearChat}
                                    className="p-2 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all tooltip"
                                    title="Clear Chat"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {msg.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none'
                                            : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-end gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                            <Bot className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                            <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce" />
                                            <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {!isTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {quickReplies.map((reply) => (
                                    <button
                                        key={reply}
                                        onClick={() => handleSend(reply)}
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[11px] text-white/50 hover:text-white transition-all flex items-center gap-1"
                                    >
                                        {reply}
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Ask anything..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1.2 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-purple-500/10 mt-1"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-center text-[9px] text-white/20 mt-3 uppercase tracking-widest font-bold">
                                Powered by <span className="text-purple-400">Tholvi AI</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300
                    ${isOpen
                        ? 'bg-white/10 text-white border border-white/10'
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-purple-500/25 border-t border-white/20'}
                `}
            >
                {isOpen ? <X className="w-6 h-6" /> : (
                    <div className="relative">
                        <MessageSquare className="w-6 h-6" />
                        <Sparkles className="absolute -top-3 -right-3 w-4 h-4 text-white animate-pulse" />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
