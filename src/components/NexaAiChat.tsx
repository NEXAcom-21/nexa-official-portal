import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  RefreshCw,
  Bot,
  User,
  AlertCircle,
  Maximize2,
  Minimize2,
  Plus,
  History,
  Image as ImageIcon,
  Video as VideoIcon,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isError?: boolean;
  type?: 'text' | 'image' | 'video';
  mediaUrl?: string;
  status?: 'generating' | 'ready' | 'failed';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

interface NexaAiChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (page: string) => void;
}

export const NexaAiChat: React.FC<NexaAiChatProps> = ({ isOpen, onToggle, onNavigate }) => {
  const { user } = useAuth();
  const userKey = user?.email || 'guest';
  const storageKey = `nexa_ai_sessions_${userKey}`;

  // Load existing sessions or initialize default
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved chat sessions:', e);
    }
    return [
      {
        id: 'session-default',
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 'welcome',
            role: 'model',
            text: "Hello! I am **NEXA AI**, the official intelligence assistant. Ask me questions across **Biology, Physics, Chemistry, Mathematics, Finance, Programming, General Knowledge**, or explore our official tools.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-default');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image' | 'video'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist chat sessions:', e);
    }
  }, [sessions, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen, activeSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const updateActiveSessionMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setSessions((prevSessions) =>
      prevSessions.map((s) => {
        if (s.id === activeSessionId) {
          const newMessages = updater(s.messages);
          // Set dynamic title from first user message if still default
          let title = s.title;
          if (title === 'New Conversation') {
            const firstUserMsg = newMessages.find((m) => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
            }
          }
          return { ...s, title, messages: newMessages };
        }
        return s;
      })
    );
  };

  const handleStartNewChat = () => {
    const newId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-' + Date.now(),
          role: 'model',
          text: "New conversation started. How can NEXA AI help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setShowHistoryDrawer(false);
    setLastFailedMessage(null);
    setInput('');
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleClearChat();
      return;
    }
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0]?.id || '');
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateActiveSessionMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastFailedMessage(null);

    // If in Image mode or text starts with /image
    if (mode === 'image' || text.toLowerCase().startsWith('/image ')) {
      const prompt = text.replace(/^\/image\s+/i, '');
      try {
        const res = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Image generation is not configured yet.');
        }

        const modelMessage: ChatMessage = {
          id: 'model-img-' + Date.now(),
          role: 'model',
          type: 'image',
          mediaUrl: data.imageUrl,
          text: `Generated image for prompt: "${prompt}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateActiveSessionMessages((prev) => [...prev, modelMessage]);
      } catch (err: any) {
        setLastFailedMessage(text);
        const errorMessage: ChatMessage = {
          id: 'err-' + Date.now(),
          role: 'model',
          text: err.message || 'Image generation is not configured yet. An active image-generation provider or billing-enabled Gemini project is required.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        updateActiveSessionMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If in Video mode or text starts with /video
    if (mode === 'video' || text.toLowerCase().startsWith('/video ')) {
      const prompt = text.replace(/^\/video\s+/i, '');
      try {
        const res = await fetch('/api/ai/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Video generation requires configuration.');
        }

        const modelMessage: ChatMessage = {
          id: 'model-vid-' + Date.now(),
          role: 'model',
          type: 'video',
          mediaUrl: data.videoUrl,
          text: `Video generated for prompt: "${prompt}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        updateActiveSessionMessages((prev) => [...prev, modelMessage]);
      } catch (err: any) {
        setLastFailedMessage(text);
        const errorMessage: ChatMessage = {
          id: 'err-' + Date.now(),
          role: 'model',
          text: err.message || 'Video generation requires configuration. A video generation provider (such as Veo API with active billing credentials) is required on the backend.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        updateActiveSessionMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Standard AI Text / Multi-turn chat
    const historyPayload = messages
      .filter((m) => !m.isError && m.id !== 'welcome' && m.type !== 'image' && m.type !== 'video')
      .map((m) => ({
        role: m.role,
        text: m.text
      }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: 'model-' + Date.now(),
        role: 'model',
        text: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updateActiveSessionMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('NEXA AI Chat error:', err);
      setLastFailedMessage(text);
      const errorMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: err.message || "I encountered a problem processing your request. Please check your connection and tap Retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      updateActiveSessionMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSend(lastFailedMessage);
    }
  };

  const handleClearChat = () => {
    updateActiveSessionMessages(() => [
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        text: "Conversation reset. Feel free to ask questions about science, math, coding, finance, or NEXA features.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastFailedMessage(null);
  };

  const samplePrompts = [
    { label: "Biology", text: "What is photosynthesis? Explain light-dependent reactions." },
    { label: "Physics", text: "State Newton's third law of motion with an example." },
    { label: "Mathematics", text: "Solve 4x + 12 = 36 step-by-step." },
    { label: "Finance", text: "What is CAGR and how is it calculated?" },
    { label: "Programming", text: "How do you define a typed interface in TypeScript?" },
    { label: "NEXA v2.5", text: "What are the core departments in NEXA v2.5?" }
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="ask-nexa-ai-floating-btn"
          onClick={onToggle}
          aria-label="Ask NEXA AI"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] hover:scale-105 transition-all duration-200 cursor-pointer border border-cyan-300/40"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-sm tracking-wide font-medium">Ask NEXA AI</span>
        </button>
      )}

      {/* Chat Window / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="nexa-ai-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-50 flex flex-col bg-[#060c18] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden ${
              isExpanded
                ? 'inset-3 sm:inset-6 md:inset-10'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] md:w-[500px] h-[620px] max-h-[calc(100vh-2rem)]'
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#030712]/95 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">NEXA AI</h3>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      v2.5
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {activeSession?.title || 'Conversational Neural Agent'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Mode Selector */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 mr-1 text-[11px]">
                  <button
                    onClick={() => setMode('chat')}
                    className={`px-2 py-0.5 rounded ${mode === 'chat' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Q&A and Text Chat"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setMode('image')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 ${mode === 'image' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Image Generation"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Img
                  </button>
                  <button
                    onClick={() => setMode('video')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 ${mode === 'video' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Video Generation"
                  >
                    <VideoIcon className="w-3 h-3" />
                    Vid
                  </button>
                </div>

                <button
                  id="new-ai-chat-btn"
                  onClick={handleStartNewChat}
                  title="New Conversation"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  id="history-ai-chat-btn"
                  onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                  title="Previous Chats"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    showHistoryDrawer ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60'
                  }`}
                >
                  <History className="w-4 h-4" />
                </button>

                <button
                  id="clear-ai-chat-btn"
                  onClick={handleClearChat}
                  title="Clear Active Chat"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  id="expand-ai-chat-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer hidden sm:inline-flex"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  id="close-ai-chat-btn"
                  onClick={onToggle}
                  title="Close"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* History Drawer Overlay */}
            {showHistoryDrawer && (
              <div className="absolute inset-x-0 top-14 bottom-14 z-30 bg-[#040813]/95 backdrop-blur-md p-4 flex flex-col border-b border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    Saved Conversations ({sessions.length})
                  </span>
                  <button
                    onClick={handleStartNewChat}
                    className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => {
                        setActiveSessionId(sess.id);
                        setShowHistoryDrawer(false);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        sess.id === activeSessionId
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-medium truncate">{sess.title}</p>
                        <span className="text-[10px] text-slate-500">
                          {sess.messages.length} messages • {new Date(sess.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete Session"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode Banner Indicator */}
            {mode !== 'chat' && (
              <div className={`px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b ${
                mode === 'image'
                  ? 'bg-purple-950/60 border-purple-500/30 text-purple-200'
                  : 'bg-amber-950/60 border-amber-500/30 text-amber-200'
              }`}>
                <span>Mode: {mode === 'image' ? 'Image Generation (Prompt → Image)' : 'Video Generation (Prompt → Video)'}</span>
                <button
                  onClick={() => setMode('chat')}
                  className="underline hover:text-white"
                >
                  Switch to Text Chat
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-xs sm:text-[13px] ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-[0_2px_12px_rgba(6,182,212,0.25)]'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-bl-none'
                        : 'bg-slate-900/95 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Image result if present */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-purple-500/30">
                        <img
                          src={msg.mediaUrl}
                          alt="Generated AI Visual"
                          className="w-full max-h-60 object-contain bg-black"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Rich Markdown display for responses */}
                    {msg.role === 'model' && !msg.isError ? (
                      <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed break-words space-y-1">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}

                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        msg.role === 'user' ? 'text-blue-200/80' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>

                    {msg.isError && (
                      <div className="mt-2 pt-2 border-t border-rose-500/30 flex items-center justify-between">
                        <span className="text-[10px] text-rose-300">Request failed</span>
                        <button
                          onClick={handleRetry}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-900/80 text-rose-100 hover:bg-rose-800 text-[11px] font-medium transition-colors cursor-pointer border border-rose-500/50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-300 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-none bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      {mode === 'image'
                        ? 'Synthesizing image...'
                        : mode === 'video'
                        ? 'Contacting video engine...'
                        : 'NEXA AI is reasoning...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-[#040813] border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-mono uppercase shrink-0">Topics:</span>
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.text)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <strong className="text-cyan-400 font-semibold mr-1">{p.label}:</strong>
                  <span className="truncate max-w-[120px] inline-block align-bottom">{p.text}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#030712] border-t border-slate-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'image'
                    ? 'Enter image prompt (e.g., "A modern cyber city")...'
                    : mode === 'video'
                    ? 'Enter video prompt (e.g., "Drone flyover of neon mountain")...'
                    : 'Ask about Biology, Physics, Math, Finance, Code, or NEXA...'
                }
                disabled={isLoading}
                className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
