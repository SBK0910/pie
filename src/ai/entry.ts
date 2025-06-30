import { StateGraph } from "@langchain/langgraph";
import { RiskProfileState } from "./state";
import { riskProfileNode } from "./node";
import { determineTraitNode } from "./node";
import { summaryNode } from "./node";
import { END, MemorySaver, START } from "@langchain/langgraph";


const workflow = new StateGraph(RiskProfileState)
    .addNode("riskProfileNode", riskProfileNode)
    .addNode("determineTraitNode", determineTraitNode)
    .addNode("summaryNode", summaryNode)
    .addConditionalEdges(START,(state) => {
        return state.currentSection === 'end' ? 'summaryNode' : 'riskProfileNode'
    })
    .addEdge('riskProfileNode', 'determineTraitNode')
    // After determining trait, decide whether to continue asking or move to summary
    .addEdge('determineTraitNode', 'summaryNode')
    .addConditionalEdges('summaryNode', (state) =>{
        if (state.currentSection === 'end' && state.response === null) {
            return 'summaryNode'
        }else if (state.response !== null){
            return END
        }
        return 'riskProfileNode'            
    })

const Memory = new MemorySaver();

export const app = workflow.compile({
    checkpointer: Memory,
})      