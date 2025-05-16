import React from "react";
import { useSubflow } from "./SubflowContextProvider";
import { QuestionViewSubflow } from "./QuestionViewSubflow";
import { Block } from "@/types/form";

interface FormReaderSubflowProps {
  // You can add subflow-specific props if needed
}

export function FormReaderSubflow({}: FormReaderSubflowProps) {
  const { state, blocks } = useSubflow();

  // You can add subflow-specific logic here if needed

  return <QuestionViewSubflow />;
} 