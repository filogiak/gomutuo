import React from "react";
import { useForm } from "@/contexts/FormContext";
import { QuestionView } from "./QuestionView";
import { Block } from "@/types/form";

interface FormReaderProps {
  onEnterSubflow: (block: Block, index?: number) => void;
}

export function FormReader({ onEnterSubflow }: FormReaderProps) {
  const { state, blocks } = useForm();

  // Find the current active block
  const activeBlock = blocks.find(block => block.block_id === state.activeQuestion.block_id);

  // If the active block is a repeating group, enter subflow
  React.useEffect(() => {
    if (activeBlock && 'type' in activeBlock && activeBlock.type === 'repeating_group') {
      onEnterSubflow(activeBlock);
    }
  }, [activeBlock, onEnterSubflow]);

  return <QuestionView />;
} 