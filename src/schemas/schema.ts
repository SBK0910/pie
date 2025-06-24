import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty'),
});

export type MessageFormValues = z.infer<typeof messageSchema>;

export const MessageSchema = z.object({
    id: z.string(),
    content: z.string(),
    sender: z.enum(['user', 'assistant']),
    timestamp: z.date(),
});