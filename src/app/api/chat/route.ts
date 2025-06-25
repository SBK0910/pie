import { app } from "@/llm/intex";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

// Using basic auth without user personalization for now
const clerk = await clerkClient();

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const userId = session.userId;

        const {firstName} = await clerk.users.getUser(userId);

        // Get the request body
        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        // Initialize thread ID from headers or generate a new one
        let threadId = req.headers.get("x-thread-id") || uuidv4();
        const config = { configurable: { thread_id: threadId } };

        // Prepare the messages for the LLM
        const llmMessages = [
            {
                role: "user",
                content: `Hello I am ${firstName}.`
            },
            ...messages
        ];

        // Call the LLM
        const res = await app.invoke({
            messages: llmMessages
        }, config);

        // Get the last assistant message
        const lastMessage = res.messages[res.messages.length - 1];
        
        // Process the response content
        let content = '';
        if (Array.isArray(lastMessage.content)) {
            content = lastMessage.content
                .filter(part => {
                    if (typeof part === 'string') return true;
                    if (part && typeof part === 'object' && 'type' in part && part.type === 'text') {
                        return true;
                    }
                    return false;
                })
                .map(part => typeof part === 'string' ? part : 'text' in part ? String(part.text) : '')
                .join('\n');
        } else if (typeof lastMessage.content === 'string') {
            content = lastMessage.content;
        }

        // Clean the response
        const cleanContent = content
            .replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/g, '$1')
            .trim();

        // Return the response
        return NextResponse.json(
            { 
                message: cleanContent,
                threadId 
            },
            {
                headers: {
                    'x-thread-id': threadId,
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
