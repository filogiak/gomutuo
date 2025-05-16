import React from "react";
import { useSubflow } from "./SubflowContextProvider";
import { FormQuestionSubflow } from "./FormQuestionSubflow";
import { StandardBlock, Block } from "@/types/form";

const isStandardBlock = (block: Block): block is StandardBlock => {
  return !('type' in block) || block.type !== 'repeating_group';
};

export function QuestionViewSubflow() {
  const { state, blocks } = useSubflow();
  
  const activeBlock = blocks.find(block => block.block_id === state.activeQuestion.block_id);
  
  if (!activeBlock || !isStandardBlock(activeBlock)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Blocco non trovato.</p>
      </div>
    );
  }

  const activeQuestion = activeBlock.questions.find(
    question => question.question_id === state.activeQuestion.question_id
  );

  if (!activeQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Domanda non trovata.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <FormQuestionSubflow question={activeQuestion} />
      </div>
    </div>
  );
} 