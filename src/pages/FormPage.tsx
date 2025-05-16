import React, { useState } from "react";
import { FormProvider } from "@/contexts/FormContext";
import { FormReader } from "@/components/form/FormReader";
import { SubflowForm } from "@/components/subflow/SubflowForm";
import { Block, FormResponse } from "@/types/form";
import { saveRepeatingGroupEntry, getRepeatingGroupEntries } from "@/utils/repeatingGroupUtils";
import { allBlocks } from "@/data/blocks";

type Mode = 'main' | 'subflow';

export function FormPage() {
  const [mode, setMode] = useState<Mode>('main');
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEnterSubflow = (block: Block, index?: number) => {
    setCurrentBlock(block);
    setEditIndex(index ?? null);
    setMode('subflow');
  };

  const handleSubflowFinish = (responses: FormResponse) => {
    // Normalize responses
    const normalizedResponses = Object.entries(responses).reduce((acc, [key, value]) => {
      // Convert numeric strings to numbers
      if (typeof value === 'string' && !isNaN(Number(value))) {
        acc[key] = Number(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    // Save to repeating group store
    if (currentBlock && 'type' in currentBlock && currentBlock.type === 'repeating_group') {
      if (editIndex !== null) {
        // Update existing entry
        saveRepeatingGroupEntry(currentBlock.block_id, normalizedResponses, editIndex);
      } else {
        // Add new entry
        saveRepeatingGroupEntry(currentBlock.block_id, normalizedResponses);
      }
    }

    setMode('main');
  };

  const handleSubflowCancel = () => {
    setMode('main');
  };

  return (
    <div>
      {mode === 'main' ? (
        <FormProvider blocks={allBlocks}>
          <FormReader onEnterSubflow={handleEnterSubflow} />
        </FormProvider>
      ) : (
        currentBlock && (
          <SubflowForm
            block={currentBlock}
            initialResponses={editIndex !== null ? 
              getRepeatingGroupEntries(currentBlock.block_id)[editIndex] : 
              undefined}
            onFinish={handleSubflowFinish}
            onCancel={handleSubflowCancel}
          />
        )
      )}
    </div>
  );
} 