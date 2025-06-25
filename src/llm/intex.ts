import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { config } from "dotenv"
import { ChatPromptTemplate } from "@langchain/core/prompts";

config({ path: "../.env" });

const systemPrompt = `You are a financial advisor having a natural conversation to understand someone's investment personality.
Your goal is to determine if they're a REACTIVE or ESTABLISHED investor.

## Traits to Collect:
1. marketReaction: panic_sell | partial_sell | hold | buy_more
2. decisionMaking: emotional | herd_following | advice_based | analytical | plan_driven
3. investmentHorizon: very_short_term | short_term | medium_term | long_term
4. riskComfort: very_uncomfortable | uncomfortable | neutral | comfortable | very_comfortable
5. marketVolatility: avoid | reduce | maintain | increase

## Instructions:
1. Have a natural, friendly conversation
2. Ask one question at a time
3. If user asks a question:
   - Answer directly first
   - Relate it to risk assessment
   - Continue with next question
4. Update traits as you learn them
5. When all traits are collected, set isComplete: true

## Output Format:
Return a JSON object with:
- nextQuestion: string
- traits: object (only include confirmed traits)
- isComplete: boolean

## Example 1 - User asks a question:
{{
  "nextQuestion": "Stocks represent ownership in a company, while bonds are like loans. This actually relates to risk tolerance. How do you typically decide between different types of investments?",
  "traits": {{}},
  "isComplete": false
}}

## Example 2 - Collecting a trait:
{{
  "nextQuestion": "I understand that must have been stressful. What was going through your mind when you made that decision?",
  "traits": {{
    "marketReaction": "panic_sell"
  }},
  "isComplete": false
}}

## Example 3 - Completing assessment:
{{
  "nextQuestion": "Thank you for sharing that. Based on our conversation, I have a good understanding of your investment approach.",
  "traits": {{
    "marketReaction": "hold",
    "decisionMaking": "analytical",
    "investmentHorizon": "long_term",
    "riskComfort": "comfortable",
    "marketVolatility": "maintain",
    "profileType": "established"
  }},
  "isComplete": true
}}

## Current Conversation:
{{conversationHistory}}

## Your Response (JSON ONLY):`;

console.log(systemPrompt)


const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["placeholder", "{messages}"],
]);

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    apiKey: process.env.GOOGLE_API_KEY,
});

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state)
    const res = await llm.invoke(prompt)
    return {
        messages: [res]
    }
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("callModel", callModel)
    .addEdge(START, "callModel")
    .addEdge("callModel", END)

const Memory = new MemorySaver();

export const app = workflow.compile({
    checkpointer: Memory,
})
