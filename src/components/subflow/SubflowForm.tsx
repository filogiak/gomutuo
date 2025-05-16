import React from "react";
import { Block, FormResponse, RepeatingGroupBlock } from "@/types/form";
import { SubflowProvider } from "./SubflowContextProvider";
import { FormReaderSubflow } from "./FormReaderSubflow";

interface SubflowFormProps {
  block: RepeatingGroupBlock;
  initialResponses?: FormResponse;
  onFinish: (responses: FormResponse) => void;
  onCancel: () => void;
}

export function SubflowForm({ block, initialResponses, onFinish, onCancel }: SubflowFormProps) {
  // Create a synthetic block for the subflow
  const syntheticBlock: Block = {
    block_number: block.block_number,
    block_id: `${block.block_id}_subflow`,
    title: block.title,
    priority: 0,
    default_active: true,
    questions: block.subflow
  };

  return (
    <SubflowProvider
      blocks={[syntheticBlock]}
      initialResponses={initialResponses}
      onFinish={onFinish}
      onCancel={onCancel}
    >
      <FormReaderSubflow />
    </SubflowProvider>
  );
} 