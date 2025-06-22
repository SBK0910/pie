import { MessageSchema } from '@/schemas/schema';
import { z } from 'zod';

interface MessageProps {
    message: z.infer<typeof MessageSchema>;
}

export default function Message({ message }: MessageProps) {
    return (
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
    );
}