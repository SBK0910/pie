'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

interface ChatInterfaceProps {
  initialMessages?: Message[];
}

export function ChatInterface({ 
  initialMessages = [
    {
      id: '1',
      content: 'Hello! How can I help you with your financial planning today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ] 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. How can I assist you further?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-4 py-3 text-sm ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                  : 'bg-muted text-foreground rounded-2xl rounded-tl-sm'
              }`}
            >
              <p>{message.content}</p>
              <p className={`mt-1 text-xs ${
                message.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="px-6 pb-6 pt-4 ">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            placeholder="Type your message..."
            className="w-full"
            rows={10}
            onChange={handleTextareaChange}
          />
          <Button 
            type="submit" 
            variant="outline"
            size="icon" 
            className="absolute right-1 bottom-1 h-8 w-8 text-foreground hover:bg-accent"
          >
            <Send className="h-4 w-4" />
          </Button>
      </form>
    </div>
  );
}
