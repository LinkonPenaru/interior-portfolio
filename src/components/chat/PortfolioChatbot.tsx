import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AboutChatbotEngine,
  ChatbotMessage,
  PendingAction,
} from '../../services/aboutChatbotService';

export const PortfolioChatbot: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        'Hello! I am Urvi’s Architectural & Portfolio Assistant. You can ask me about her spatial philosophy, academic background, drafting methodology, or current location.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const engineRef = useRef<AboutChatbotEngine>(new AboutChatbotEngine(isAdmin));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync owner status with auth
  useEffect(() => {
    engineRef.current.setOwnerStatus(isAdmin);
  }, [isAdmin]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatbotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const { responseText, pendingAction } = await engineRef.current.processUserMessage(
        userMsg.text,
        messages
      );

      const assistantMsg: ChatbotMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pendingAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'system',
          text: `Error processing request: ${(err as Error).message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAction = async (msgId: string, action: PendingAction) => {
    setIsProcessing(true);
    try {
      const res = await engineRef.current.executeConfirmedAction(action);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, pendingAction: undefined } : m))
        );
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            sender: 'assistant',
            text: `✅ **Changes Confirmed & Saved!**\n\n${action.diffSummary} has been saved to your live profile.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        const errorText = Object.values(res.errors || {}).join('\n');
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            sender: 'assistant',
            text: `❌ **Validation Failed:**\n\n${errorText}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: 'assistant',
          text: `❌ Action failed: ${(err as Error).message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, pendingAction: undefined } : m))
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        sender: 'assistant',
        text: 'Action cancelled. No changes were made to your profile.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          className="group flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-cream-50 hover:bg-stone-800 shadow-xl border border-stone-700 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs uppercase tracking-[0.12em] font-medium hidden sm:inline">
            Design AI Assistant
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          role="region"
          aria-label="Portfolio AI Assistant"
          className="fixed bottom-20 right-4 sm:right-6 z-40 w-[92vw] sm:w-[420px] max-h-[600px] h-[78vh] bg-cream-50 border border-stone-300 shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-stone-900 text-cream-50 border-b border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-serif text-sm font-medium text-cream-100">
                  Urvi&apos;s Design AI Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Shield className="w-3 h-3" />
                      <span>Owner Mode Active</span>
                    </span>
                  ) : (
                    <span className="text-stone-400">Public Visitor Mode</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-cream-50 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-sand-50/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[88%] p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-stone-900 text-cream-50 rounded-none'
                        : 'bg-white border border-stone-200 text-stone-800 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Staged Confirmation Diff Card */}
                    {msg.pendingAction && (
                      <div className="mt-3 pt-3 border-t border-stone-200 bg-sand-50 p-2.5 space-y-2 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5 text-stone-800 font-semibold uppercase">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Confirmation Required</span>
                        </div>
                        <p className="text-stone-700">{msg.pendingAction.diffSummary}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleConfirmAction(msg.id, msg.pendingAction!)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 bg-stone-900 text-cream-50 uppercase text-[10px] tracking-wider hover:bg-stone-800 disabled:opacity-50"
                          >
                            Confirm Save
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelAction(msg.id)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 bg-white border border-stone-300 text-stone-700 uppercase text-[10px] tracking-wider hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] p-2 bg-white/70 border border-stone-200 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
                <span>Assistant reasoning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-sand-100/70 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono shrink-0">
            <span className="text-stone-500 whitespace-nowrap">Suggested:</span>
            <button
              type="button"
              onClick={() => handleSendMessage('Academic background')}
              className="px-2 py-0.5 bg-white border border-stone-300 hover:border-stone-800 whitespace-nowrap"
            >
              🎓 Education
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Current location')}
              className="px-2 py-0.5 bg-white border border-stone-300 hover:border-stone-800 whitespace-nowrap"
            >
              📍 Location
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleSendMessage('Hide my grade')}
                className="px-2 py-0.5 bg-amber-50 border border-amber-300 hover:border-amber-800 text-amber-900 whitespace-nowrap"
              >
                🔒 Hide Grade
              </button>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isAdmin
                  ? 'Ask or instruct: "Update location to Mumbai" or "Add education..."'
                  : 'Ask about design philosophy, education, or location...'
              }
              disabled={isProcessing}
              className="flex-grow px-3 py-2 text-xs bg-cream-50 border border-stone-300 focus:outline-none focus:border-stone-800 text-stone-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="p-2 bg-stone-900 text-cream-50 hover:bg-stone-800 disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
