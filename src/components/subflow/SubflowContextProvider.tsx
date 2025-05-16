import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { Block, FormState, FormResponse, NavigationHistory } from "@/types/form";
import { Emitter } from "@/utils/emitter";

// Simplified state for subflow
const initialState: FormState = {
  activeBlocks: [],
  activeQuestion: {
    block_id: "",
    question_id: ""
  },
  responses: {},
  answeredQuestions: new Set(),
  isNavigating: false,
  navigationHistory: [],
  repeatingGroups: {}
};

type SubflowContextType = {
  state: FormState;
  blocks: Block[];
  goToQuestion: (block_id: string, question_id: string, replace?: boolean) => void;
  setResponse: (question_id: string, placeholder_key: string, value: string | string[]) => void;
  getResponse: (question_id: string, placeholder_key: string) => string | string[] | undefined;
  isQuestionAnswered: (question_id: string) => boolean;
  navigateToNextQuestion: (currentQuestionId: string, leadsTo: string) => void;
  getProgress: () => number;
  resetForm: () => void;
  onFinish: (responses: FormResponse) => void;
};

const SubflowContext = createContext<SubflowContextType | undefined>(undefined);

// Simplified reducer for subflow
function subflowReducer(state: FormState, action: any): FormState {
  switch (action.type) {
    case "GO_TO_QUESTION":
      return {
        ...state,
        activeQuestion: {
          block_id: action.block_id,
          question_id: action.question_id
        }
      };
    case "SET_RESPONSE": {
      const newResponses = { ...state.responses };
      if (!newResponses[action.question_id]) {
        newResponses[action.question_id] = {};
      }
      newResponses[action.question_id][action.placeholder_key] = action.value;
      return {
        ...state,
        responses: newResponses
      };
    }
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export const SubflowProvider: React.FC<{
  children: ReactNode;
  blocks: Block[];
  initialResponses?: FormResponse;
  onFinish: (responses: FormResponse) => void;
  onCancel: () => void;
}> = ({ children, blocks, initialResponses, onFinish, onCancel }) => {
  const [state, dispatch] = useReducer(subflowReducer, {
    ...initialState,
    activeBlocks: blocks.map(b => b.block_id),
    activeQuestion: {
      block_id: blocks[0].block_id,
      question_id: (blocks[0] as any).questions[0].question_id
    },
    responses: initialResponses || {}
  });

  const navigationEmitter = React.useMemo(() => new Emitter(), []);

  const goToQuestion = useCallback((block_id: string, question_id: string, replace?: boolean) => {
    dispatch({ type: "GO_TO_QUESTION", block_id, question_id });
  }, []);

  const setResponse = useCallback((question_id: string, placeholder_key: string, value: string | string[]) => {
    dispatch({ type: "SET_RESPONSE", question_id, placeholder_key, value });
  }, []);

  const getResponse = useCallback((question_id: string, placeholder_key: string) => {
    return state.responses[question_id]?.[placeholder_key];
  }, [state.responses]);

  const isQuestionAnswered = useCallback((question_id: string) => {
    return state.answeredQuestions.has(question_id);
  }, [state.answeredQuestions]);

  const navigateToNextQuestion = useCallback((currentQuestionId: string, leadsTo: string) => {
    const currentBlock = blocks.find(b => (b as { questions: any[] }).questions.some(q => q.question_id === currentQuestionId));
    if (!currentBlock) return;
    const nextQuestion = (currentBlock as { questions: any[] }).questions.find(q => q.question_id === leadsTo);
    if (nextQuestion) {
      goToQuestion(currentBlock.block_id, nextQuestion.question_id);
    }
  }, [blocks, goToQuestion]);

  const getProgress = useCallback(() => {
    const totalQuestions = blocks.reduce((acc, block) => acc + (block as { questions: any[] }).questions.length, 0);
    const answeredQuestions = state.answeredQuestions.size;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  }, [blocks, state.answeredQuestions]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  const value = {
    state,
    blocks,
    goToQuestion,
    setResponse,
    getResponse,
    isQuestionAnswered,
    navigateToNextQuestion,
    getProgress,
    resetForm,
    onFinish
  };

  return (
    <SubflowContext.Provider value={value}>
      {children}
    </SubflowContext.Provider>
  );
};

export const useSubflow = () => {
  const context = useContext(SubflowContext);
  if (!context) {
    throw new Error("useSubflow must be used within a SubflowProvider");
  }
  return context;
}; 