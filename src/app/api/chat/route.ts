import { app } from "@/ai/entry";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

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
            // Greet with personalized introduction
            new HumanMessage({ content: `Hello, I am ${firstName}.` }),
            // Preserve role information from previous turns
            ...messages.map((m: { role: string; content: string }) =>
                m.role === "assistant"
                    ? new AIMessage({ content: m.content })
                    : new HumanMessage({ content: m.content })
            ),
        ];

        const state = await app.getState(config);
        console.log(state.values);
        const currentSection = state.values.currentSection || 'investmentObjective';

        // Call the LLM
        const res = await app.invoke({
            [currentSection]: llmMessages
        }, config)

        console.log(res.traits);
        console.log(res.summary);

        // Return the response
        return NextResponse.json(
            { 
                message: res.response,
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
