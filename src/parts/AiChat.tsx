import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export default function AiChat() {
   const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Add user message to the UI
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Request failed');
      }

      const data: ChatResponse = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <>
      {/* Flytande chattfönster */}
      {isOpen && (
        <div className="
        fixed bottom-24 right-0
        w-[calc(100%-2rem)]   
         md:right-2 sm:max-w-sm h-[300px] sm:h-[500px]  z-50
        rounded-lg overflow-hidden bg-zinc-900
        border border-white/10 flex flex-col mx-4 ">
          {/* Header */}
          <div className="bg-red-800 text-white p-4 flex justify-between items-center">
            <h5 className="font-semibold">Chatta med Adam</h5>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded "
            >
              <X size={18} />
            </button>
          </div>

          {/* Meddelanden */}
          <div className=" flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-4">
                <p>Hej! Jag heter Adam. Hur kan jag hjälpa dig?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-red-800 text-white'
                        : 'bg-zinc-800 text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer med input */}
          <div className="border-t border-white/10 p-4 bg-zinc-900">
            {isLoading && (
              <div className="text-gray-400 mb-2 text-sm flex items-center gap-2">
                <Loader className="animate-spin h-4 w-4" />
                Adam skriver...
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skriv ditt meddelande..."
                rows={1}
                className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-800 resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-red-800 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flytande knapp */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-red-800 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
