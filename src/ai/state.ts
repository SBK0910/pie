import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { investmentObjectiveEnum, marketReactionEnum, decisionMakingEnum, investmentHorizonEnum, riskComfortEnum, marketVolatilityEnum } from "@/db/schema/riskProfile";

export type TraitMap = {
    investmentObjective: typeof investmentObjectiveEnum.enumValues[number];
    marketReaction: typeof marketReactionEnum.enumValues[number];
    decisionMaking: typeof decisionMakingEnum.enumValues[number];
    investmentHorizon: typeof investmentHorizonEnum.enumValues[number];
    riskComfort: typeof riskComfortEnum.enumValues[number];
    marketVolatility: typeof marketVolatilityEnum.enumValues[number];
}

export const RiskProfileState = Annotation.Root({
    currentSection: Annotation<'investmentObjective' | 'marketReaction' | 'decisionMaking' | 'investmentHorizon' | 'riskComfort' | 'marketVolatility' | 'end'>({
        default: () => 'investmentObjective',
        reducer: (left, right) => right,
    }),

    previousSection: Annotation<'investmentObjective' | 'marketReaction' | 'decisionMaking' | 'investmentHorizon' | 'riskComfort' | 'marketVolatility' | null>({
        default: () => null,
        reducer: (left, right) => right,
    }),

    traits: Annotation<TraitMap>({
        default: () => ({} as TraitMap),
        reducer: (left,right) => {
            left.investmentObjective = right.investmentObjective;
            left.marketReaction = right.marketReaction;
            left.decisionMaking = right.decisionMaking;
            left.investmentHorizon = right.investmentHorizon;
            left.riskComfort = right.riskComfort;
            left.marketVolatility = right.marketVolatility;
            return left;
        }
    }),

    summary: Annotation<string>({
        default: () => '',
        reducer: (left,right) => {
            return left + ' ' + right;
        }
    }),

    investmentObjective: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),
    marketReaction: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),
    decisionMaking: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),
    investmentHorizon: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),
    riskComfort: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),
    marketVolatility: Annotation<BaseMessage[]>({
        default: () => [],
        reducer: (left,right) => {
            left.push(...right);
            return left;
        }
    }),

    response: Annotation<string | null>({
        default: () => null,
        reducer: (left,right) => {
            return right;
        }
    }),
})