import { RiskProfileState, TraitMap } from "./state";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { aiMessageSchema } from "@/schemas/validators/aimessage.validator";

const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash-exp"
})

const createPromptTemplete = (trait: keyof TraitMap, summary?: string, messages?: BaseMessage[]) => {
    const traitConfig = {
        investmentObjective: {
            description: 'How do you typically decide between different types of investments?',
            options: {
                'Preserve': 'Prefer to preserve my capital and avoid taking risks.',
                'Income': 'Prefer to generate income from my investments.',
                'Growth': 'Prefer to grow my capital through investments.',
                'Aggressive': 'Prefer to take risks for higher returns.',
            }
        },
        marketReaction: {
            description: 'How do you typically react to market changes?',
            options: {
                'Panic sell': 'Panic sell when the market goes down.',
                'Partial sell': 'Sell some of my investments when the market goes down.',
                'Hold': 'Hold my investments when the market goes down.',
                'Buy more': 'Buy more of my investments when the market goes down.',
            }
        },
        decisionMaking: {
            description: 'How do you typically make decisions?',
            options: {
                'Emotional': 'Make decisions based on emotions.',
                'Herd following': 'Make decisions based on advice.',
                'Advice based': 'Make decisions based on advice.',
                'Analytical': 'Make decisions based on advice.',
                'Plan driven': 'Make decisions based on advice.',
            }
        },
        investmentHorizon: {
            description: 'How do you typically plan to invest?',
            options: {
                'Very short term': 'Very short term',
                'Short term': 'Short term',
                'Medium term': 'Medium term',
                'Long term': 'Long term',
            }
        },
        riskComfort: {
            description: 'How do you typically feel about risk?',
            options: {
                'Very uncomfortable': 'Very uncomfortable',
                'Uncomfortable': 'Uncomfortable',
                'Neutral': 'Neutral',
                'Comfortable': 'Comfortable',
                'Very comfortable': 'Very comfortable',
            }
        },
        marketVolatility: {
            description: 'How do you typically feel about market volatility?',
            options: {
                'Avoid': 'Avoid',
                'Reduce': 'Reduce',
                'Maintain': 'Maintain',
                'Increase': 'Increase',
            }
        },
    }[trait]

    const systemPrompt = `
        # Financial Risk Profiling - ${trait}

        ## Your Role
        You are a friendly financial advisor helping to understand someone's investment personality through natural conversation.

        ## Conversation Continuity
        - Carefully read the entire conversation history before responding
        - Acknowledge and reference previous points when relevant
        - Maintain context across multiple turns
        - If the user refers to something said earlier, acknowledge it
        - Keep the conversation flowing naturally

        ## Current Context
        ${summary ? `### Previous Summary:\n${summary}\n` : ''}
        ${messages?.length ? `### Recent Messages:\n${messages.slice(-3).map(m =>
        `${m.getType() === 'human' ? 'User' : 'Advisor'}: ${m.content}`
    ).join('\n')}\n` : ''}

        ## Current Focus
        We're discussing: ${traitConfig.description}

        ## Possible ${trait} Options:
        ${Object.entries(traitConfig.options)
            .map(([key, desc]) => `- ${key}: ${desc}`)
            .join('\n')}

        ## Instructions
        1. **Conversation Flow**:
        - Keep the conversation natural and engaging
        - Ask one question at a time
        - Be conversational and friendly
        - Don't list options directly, work them into conversation naturally

        2. **When User Asks a Question**:
        - First, answer their question directly and helpfully
        - Then, relate it back to risk assessment if possible
        - Finally, continue with the next question

        3. **When User Goes Off-Topic**:
        - Acknowledge their point briefly
        - Gently guide back to the current topic
        - Example: "That's an interesting point about [topic]. Going back to our discussion about [current topic]..."

        4. **When Determining a Trait**:
        - If you've confidently determined the trait:
            - Include ONLY "determinedTrait" and "isComplete" in the response
            - Do NOT include a "response" field
        - If you need more information:
            - Include a "response" to continue the conversation
            - Include "determinedTrait" ONLY if you're confident

        5. **Response Format Rules**:
        - When trait is determined (isComplete: true):
            {
            "trait": "${trait}",
            "value": "determinedValue",
            "isComplete": true
            }
        - When continuing conversation:
           {
            "trait": "${trait}",
            "value": null,
            "isComplete": false,
            "response": "Your natural language response to continue the conversation"
        }

        ## Example Response
        {
        "response": "I understand you prefer to hold your investments during market downturns. That shows a balanced approach to risk management. Have there been times when you've considered changing this strategy?",
        "trait": "${trait}",
        "value": null,
        "isComplete": false
        }

        ## Important Notes
        - Be patient and don't rush to conclusions
        - It's okay to take multiple exchanges to determine a trait
        - Maintain a friendly, professional tone throughout
        - If the user seems confused, rephrase your questions
        - If last message is from system, acknowledge it and continue the conversation with next question since we moved to next section.
    `

    return systemPrompt
}

export const riskProfileNode = async (state: typeof RiskProfileState.State): Promise<Partial<typeof RiskProfileState.State>> => {
    const messages = state.previousSection ? state[state.previousSection] : [];

    if (state.currentSection === 'end') {
        return {

        }
    }

    const systemPrompt = createPromptTemplete(
        state.currentSection,
        state.summary,
        messages
    );
    const prompt = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemPrompt),
        new MessagesPlaceholder({
            variableName: "messages",
        }),
    ]);

    const currentMessages = state[state.currentSection];
    if (currentMessages.length === 0) {
        const res = await llm.invoke(systemPrompt);
        return {
            [state.currentSection]: [res]
        }
    }
    
    const res = await prompt.pipe(llm).invoke({
        messages: currentMessages
    });

    return {
        [state.currentSection]: [res]
    }
}

export const determineTraitNode = async (state: typeof RiskProfileState.State): Promise<Partial<typeof RiskProfileState.State>> => {
    if (state.currentSection === 'end') {
        return {

        };
    }
    const lastMsg = state[state.currentSection].at(-1);   // newest
    let payload: unknown;

    if (lastMsg && typeof lastMsg.content === "string") {
        const cleaned = lastMsg.content
            .replace(/^```json\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();
        payload = JSON.parse(cleaned);
    } else {
        payload = lastMsg?.content;
    }

    const parsed = aiMessageSchema.safeParse(payload);

    if (parsed.success) {
        if (parsed.data.isComplete) {
            return {
                traits: {
                    ...state.traits,
                    [parsed.data.trait]: parsed.data.value
                },
                response: null
            }
        }
        return {
            response: parsed.data.response
        }
    }
    throw new Error("Invalid response from LLM", { cause: parsed.error });
}

export const summaryNode = async (state: typeof RiskProfileState.State): Promise<Partial<typeof RiskProfileState.State>> => {
    if (state.currentSection === 'end') {
        const thankYouPrompt = `## Risk Profile Summary
        ${state.summary}

        ## Important Instructions
        1. Generate a friendly, conversational thank you message
        2. Use ONLY plain text - NO markdown, code blocks, or JSON
        3. Keep it warm, professional and encouraging
        4. Include a brief summary of their key preferences
        5. End with a positive, forward-looking statement

        ## Key Preferences to Include:
        - Investment objective: ${state.traits.investmentObjective || 'Not specified'}
        - Market reaction: ${state.traits.marketReaction || 'Not specified'}
        - Decision making style: ${state.traits.decisionMaking || 'Not specified'}
        - Investment horizon: ${state.traits.investmentHorizon || 'Not specified'}
        - Risk comfort: ${state.traits.riskComfort || 'Not specified'}
        - Market volatility approach: ${state.traits.marketVolatility || 'Not specified'}

        ## Thank You Message (plain text only):`;

        const thankYouResponse = await llm.invoke(thankYouPrompt);
        return {
            response: thankYouResponse.text,
            currentSection: 'end'
        };
    }

    if (state.response) {
        return {

        }
    }

    type Section = 'investmentObjective' | 'marketReaction' | 'decisionMaking' |
        'investmentHorizon' | 'riskComfort' | 'marketVolatility' | 'end';

    const nextSectionMap: Record<Exclude<Section, 'end'>, Section> = {
        investmentObjective: 'marketReaction',
        marketReaction: 'decisionMaking',
        decisionMaking: 'investmentHorizon',
        investmentHorizon: 'riskComfort',
        riskComfort: 'marketVolatility',
        marketVolatility: 'end',
    };

    const nextSection = nextSectionMap[state.currentSection as Exclude<Section, 'end'>];

    const currentMessages = state[state.currentSection] || [];

    // Create summary prompt based on whether we have a previous summary
    const summaryPrompt = state.summary
        ? `## Previous Summary
    ${state.summary}

    ## New Conversation
    ${currentMessages.map(m => `${m.getType() === 'human' ? 'User' : 'AI'}: ${m.content}`).join('\n')}

    ## Instructions
    1. Update the previous summary with the new conversation
    2. Keep it concise but preserve key details
    3. Focus on the user's preferences and decisions
    4. Maintain context for future conversations

    ## Updated Summary:`
        : `## Conversation to Summarize
    ${currentMessages.map(m => `${m.getType() === 'human' ? 'User' : 'AI'}: ${m.content}`).join('\n')}

    ## Instructions
    1. Create a concise summary of the conversation
    2. Highlight the user's preferences and decisions
    3. Note any important details about their investment style
    4. Keep it brief but informative
    5. Use ONLY plain text - NO markdown, code blocks, or JSON

    ## Summary:`;

    // Call LLM to generate summary
    const summaryResponse = await llm.invoke(summaryPrompt);
    const summary = summaryResponse.text;
    const previousSection = state.currentSection;

    return {
        summary: summary,
        currentSection: nextSection,
        previousSection: previousSection,
    }
}