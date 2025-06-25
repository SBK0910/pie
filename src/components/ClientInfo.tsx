'use client';

import { useProfiling } from "@/components/providers/profiling-provider";
import { Button } from "./ui/button";
import FinancialForm from "./forms/FinancialForm";
import InvestmentForm from "./forms/InvestmentForm";
import { useEffect, useState, useRef } from "react";
import { headers } from "next/headers";

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
}

interface ChatProps {
    messages: Message[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isGenerating: boolean;
    stop: () => void;
    className?: string;
}

const Chat = ({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isGenerating,
    stop,
    className = "",
}: ChatProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={`relative w-full h-screen flex flex-col bg-gray-50 ${className}`}>
            {/* Header */}
            <div className="border-b p-4 bg-white shadow-sm">
                <h2 className="text-xl font-semibold">Financial Advisor</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>Start a conversation with your financial advisor</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3/4 rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 rounded-bl-none'}`}
                            >
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3 max-w-3/4">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="w-full min-h-[40px] max-h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            disabled={isGenerating}
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            className="absolute right-1 bottom-1 h-8 w-8 p-0"
                            variant="ghost"
                            size="icon"
                            disabled={!input.trim() || isGenerating}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </Button>
                    </div>
                    {isGenerating && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={stop}
                            className="whitespace-nowrap h-10"
                        >
                            Stop
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default function ClientInfo() {
    const { profiling: { stage } } = useProfiling();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
    };

    const stop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            createdAt: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            type HeadersType = {
                'Content-Type': string;
                'x-thread-id'?: string;
            };
            
            let headers: HeadersType = {
                'Content-Type': 'application/json',
            };
            
            if (threadId) {
                headers = {
                    ...headers,
                    'x-thread-id': threadId
                };
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    messages: [{ role: 'user', content: input }],
                    threadId,
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Store the thread ID from response if present (both in headers and response body)
            const responseThreadId = response.headers.get('x-thread-id') || data.threadId;
            if (responseThreadId && responseThreadId !== threadId) {
                setThreadId(responseThreadId);
            }
            
            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.message || 'No response from server',
                createdAt: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.log('Request was aborted');
                } else {
                    console.error('Error:', error);
                    const errorMessage: Message = {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: 'Sorry, there was an error processing your message. Please try again.',
                        createdAt: new Date(),
                    };
                    setMessages(prev => [...prev, errorMessage]);
                }
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col">
            {stage === 'financial' && (
                <div className="p-4 md:p-6">
                    <FinancialForm />
                </div>
            )}

            {stage === 'investment' && (
                <div className="p-4 md:p-6">
                    <InvestmentForm />
                </div>
            )}

            {stage === 'chat' && (
                <div className="flex-1 flex flex-col h-full">
                    <Chat
                        messages={messages}
                        input={input}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isGenerating={isLoading}
                        stop={stop}
                        className="flex-1 flex flex-col h-full"
                    />
                </div>
            )}
        </div>
    );
}