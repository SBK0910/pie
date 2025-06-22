'use client';

import { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import { MessageFormValues } from '@/schemas/schema';
import Message from './Message';

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

  const handleSendMessage = async (values: MessageFormValues) => {
    if (!values.content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: values.content,
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Add await for the timeout
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Thank you for your message. How can I assist you further?',
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
}

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col pt-20">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <TextInput onSubmit={handleSendMessage} isLoading={false} /> 
    </div>
  );
}
