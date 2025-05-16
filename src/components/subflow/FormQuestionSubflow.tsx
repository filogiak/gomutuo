import React, { useState, useEffect } from "react";
import { useSubflow } from "./SubflowContextProvider";
import { Question, ValidationTypes } from "@/types/form";
import { InputSubflow } from "./ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectPlaceholderBoxSubflow } from "./SelectPlaceholderBoxSubflow";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { validateInput } from "@/utils/validationUtils";

interface FormQuestionSubflowProps {
  question: Question;
}

export function FormQuestionSubflow({ question }: FormQuestionSubflowProps) {
  const {
    getResponse,
    setResponse,
    navigateToNextQuestion,
    state,
    goToQuestion,
    blocks,
    onFinish,
  } = useSubflow();

  const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState<{ [key: string]: boolean }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const existingResponses: { [key: string]: string | string[] } = {};
    const initialVisibleOptions: { [key: string]: boolean } = {};
    const initialValidationErrors: { [key: string]: boolean } = {};

    Object.keys(question.placeholders).forEach(key => {
      const existingResponse = getResponse(question.question_id, key);
      if (existingResponse) {
        existingResponses[key] = existingResponse;
        initialVisibleOptions[key] = false;
        if (question.placeholders[key].type === "input") {
          const placeholder = question.placeholders[key];
          const validationType = (placeholder as any).input_validation as ValidationTypes;
          if (!validateInput(existingResponse as string, validationType)) {
            initialValidationErrors[key] = true;
          }
        }
      } else {
        initialVisibleOptions[key] = true;
      }
    });

    setResponses(existingResponses);
    setVisibleOptions(initialVisibleOptions);
    setValidationErrors(initialValidationErrors);
    setIsNavigating(false);
  }, [question.question_id, getResponse, question.placeholders]);

  const handleResponseChange = (key: string, value: string | string[]) => {
    setResponses({
      ...responses,
      [key]: value
    });

    if (question.placeholders[key].type === "input" && typeof value === "string") {
      const placeholder = question.placeholders[key];
      const validationType = (placeholder as any).input_validation as ValidationTypes;
      const isValid = validateInput(value, validationType);
      setValidationErrors(prev => ({
        ...prev,
        [key]: !isValid
      }));
      if (isValid) {
        setResponse(question.question_id, key, value);
        setVisibleOptions(prev => ({
          ...prev,
          [key]: false
        }));
      }
    } else {
      setResponse(question.question_id, key, value);
      setVisibleOptions(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };

  const handlePlaceholderClick = (key: string) => {
    setVisibleOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isLastQuestion = () => {
    const block = blocks.find(b => b.block_id === state.activeQuestion.block_id) as { questions: any[] };
    if (!block) {
      console.log('[Subflow][isLastQuestion] No block found for block_id:', state.activeQuestion.block_id);
      return false;
    }
    const currentIndex = block.questions.findIndex(q => q.question_id === state.activeQuestion.question_id);
    console.log('[Subflow][isLastQuestion] block_id:', state.activeQuestion.block_id, 'question_id:', state.activeQuestion.question_id, 'currentIndex:', currentIndex, 'questions.length:', block.questions.length);
    return currentIndex === block.questions.length - 1;
  };

  const handleNextQuestion = () => {
    console.log('[Subflow] handleNextQuestion called');
    const last = isLastQuestion();
    console.log('[Subflow] isLastQuestion() result:', last);
    if (isNavigating) return;
    setIsNavigating(true);
    if (question.leads_to_placeholder_priority &&
      question.placeholders[question.leads_to_placeholder_priority]) {
      const priorityPlaceholder = question.placeholders[question.leads_to_placeholder_priority];
      const priorityResponse = responses[question.leads_to_placeholder_priority] ||
        getResponse(question.question_id, question.leads_to_placeholder_priority);
      if (priorityResponse && priorityPlaceholder.type === "select" && !Array.isArray(priorityResponse)) {
        const selectedOption = (priorityPlaceholder as any).options.find(
          (opt: any) => opt.id === priorityResponse
        );
        if (selectedOption?.leads_to === "end_of_subflow") {
          console.log('[Subflow] onFinish called due to end_of_subflow (priority select)');
          if (typeof onFinish === 'function') {
            onFinish(state.responses);
          }
          setIsNavigating(false);
          return;
        } else if (selectedOption?.leads_to) {
          setTimeout(() => {
            navigateToNextQuestion(question.question_id, selectedOption.leads_to);
            setIsNavigating(false);
          }, 50);
          return;
        }
      } else if (priorityResponse && priorityPlaceholder.type === "input" && (priorityPlaceholder as any).leads_to) {
        if ((priorityPlaceholder as any).leads_to === "end_of_subflow") {
          console.log('[Subflow] onFinish called due to end_of_subflow (priority input)');
          if (typeof onFinish === 'function') {
            onFinish(state.responses);
          }
          setIsNavigating(false);
          return;
        }
        setTimeout(() => {
          navigateToNextQuestion(question.question_id, (priorityPlaceholder as any).leads_to);
          setIsNavigating(false);
        }, 50);
        return;
      }
    }
    for (const key of Object.keys(question.placeholders)) {
      const response = responses[key] || getResponse(question.question_id, key);
      if (response && question.placeholders[key].type === "select" && !Array.isArray(response)) {
        const selectedOption = (question.placeholders[key] as any).options.find(
          (opt: any) => opt.id === response
        );
        if (selectedOption?.leads_to === "end_of_subflow") {
          console.log('[Subflow] onFinish called due to end_of_subflow (fallback select)');
          if (typeof onFinish === 'function') {
            onFinish(state.responses);
          }
          setIsNavigating(false);
          return;
        } else if (selectedOption?.leads_to) {
          setTimeout(() => {
            navigateToNextQuestion(question.question_id, selectedOption.leads_to);
            setIsNavigating(false);
          }, 50);
          return;
        }
      } else if (response && question.placeholders[key].type === "input" && (question.placeholders[key] as any).leads_to) {
        if ((question.placeholders[key] as any).leads_to === "end_of_subflow") {
          console.log('[Subflow] onFinish called due to end_of_subflow (fallback input)');
          if (typeof onFinish === 'function') {
            onFinish(state.responses);
          }
          setIsNavigating(false);
          return;
        }
        setTimeout(() => {
          navigateToNextQuestion(question.question_id, (question.placeholders[key] as any).leads_to);
          setIsNavigating(false);
        }, 50);
        return;
      }
    }
    if (isLastQuestion()) {
      console.log('[Subflow] onFinish called with responses:', state.responses);
      if (typeof onFinish === 'function') {
        onFinish(state.responses);
      }
      setIsNavigating(false);
      return;
    }
    setTimeout(() => {
      navigateToNextQuestion(question.question_id, "next_block");
      setIsNavigating(false);
    }, 50);
  };

  // --- Inline Placeholder Rendering ---
  const renderQuestionPlaceholders = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      const placeholderKey = match[1];
      if (question.placeholders[placeholderKey]) {
        if (question.placeholders[placeholderKey].type === "select") {
          const placeholder = question.placeholders[placeholderKey];
          parts.push(
            <span
              key={`placeholder-${placeholderKey}`}
              onClick={() => handlePlaceholderClick(placeholderKey)}
              className="cursor-pointer"
            >
              <SelectPlaceholderBoxSubflow
                questionId={question.question_id}
                placeholderKey={placeholderKey}
                options={(placeholder as any).options}
              />
            </span>
          );
        } else if (question.placeholders[placeholderKey].type === "input") {
          const placeholder = question.placeholders[placeholderKey] as any;
          const existingResponse = getResponse(question.question_id, placeholderKey);
          const value = (responses[placeholderKey] as string) || (existingResponse as string) || "";
          const hasError = validationErrors[placeholderKey];
          const validationType = placeholder.input_validation;
          parts.push(
            <TooltipProvider key={`tooltip-${placeholderKey}`}>
              <Tooltip open={hasError ? undefined : false}>
                <TooltipTrigger asChild>
                  <span
                    key={`placeholder-${placeholderKey}`}
                    className="inline-block align-middle mx-1"
                  >
                    <InputSubflow
                      type={placeholder.input_type || "text"}
                      value={value}
                      onChange={(e) => handleResponseChange(placeholderKey, e.target.value)}
                      placeholder={placeholder.placeholder_label || ""}
                      className={cn(
                        "inline-block align-middle text-center",
                        "border-[1.5px] rounded-[8px]",
                        "text-[16px] text-[#222222] font-['Inter']",
                        "h-[48px] px-[12px] py-[10px]",
                        "outline-none focus:ring-0",
                        "placeholder:text-[#E7E1D9] placeholder:font-normal",
                        {
                          "border-[#245C4F] focus:border-[#245C4F]": !hasError,
                          "border-red-500 focus:border-red-500": hasError,
                          "w-[70px]": placeholder.input_type === "number",
                          "w-[120px]": placeholder.input_type === "text" && placeholder.placeholder_label?.toLowerCase().includes("cap"),
                          "w-[200px]": placeholder.input_type === "text" && !placeholder.placeholder_label?.toLowerCase().includes("cap"),
                        }
                      )}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-red-50 text-red-600 border border-red-200">
                  {(() => {
                    switch (validationType) {
                      case 'euro': return 'Inserire un numero intero positivo';
                      case 'month': return 'Inserire un mese valido in italiano (es. gennaio)';
                      case 'year': return 'Inserire un anno tra 1900 e 2150';
                      case 'age': return 'Inserire un\'età tra 16 e 100 anni';
                      case 'city': return 'Inserire un nome di città valido';
                      case 'cap': return 'Inserire un CAP valido (5 cifre)';
                      case 'free_text': return '';
                      default: return 'Valore non valido';
                    }
                  })()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
          parts.push(<span key={`placeholder-${placeholderKey}`} className="mx-1 px-2 py-0.5 bg-gray-100 rounded-md text-[16px]">_____</span>);
        }
      } else {
        parts.push(<span key={`placeholder-${placeholderKey}`} className="mx-1 px-2 py-0.5 bg-gray-100 rounded-md text-[16px]">_____</span>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }
    return <>{parts}</>;
  };

  // Render select options as buttons when visibleOptions[key] is true
  const renderVisibleSelectOptions = (key: string, placeholder: any) => {
    const existingResponse = getResponse(question.question_id, key);
    if (placeholder.type === "select" && visibleOptions[key]) {
      return (
        <div key={`select-${key}`} className="mt-5">
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            {placeholder.placeholder_label || "Seleziona un'opzione"}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {placeholder.options.map((option: any) => (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "text-left px-[18px] py-[12px] border-[1.5px] rounded-[10px] transition-all font-['Inter'] text-[16px] font-normal",
                  "shadow-[0_3px_0_0_#AFA89F] mb-[10px] cursor-pointer w-fit",
                  "hover:shadow-[0_3px_4px_rgba(175,168,159,0.25)]",
                  responses[key] === option.id || existingResponse === option.id
                    ? "border-black bg-gray-50"
                    : "border-[#BEB8AE]"
                )}
                onClick={() => handleResponseChange(key, option.id)}
              >
                <div className="font-medium text-black">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Validation for enabling the next button
  const allInputsHaveValidContent = () => {
    const inputPlaceholders = Object.keys(question.placeholders).filter(
      key => question.placeholders[key].type === "input"
    );
    if (inputPlaceholders.length === 0) {
      return true;
    }
    return inputPlaceholders.every(key => {
      const value = responses[key] || getResponse(question.question_id, key);
      if (value === undefined || value === "") {
        return false;
      }
      if (validationErrors[key]) {
        return false;
      }
      const placeholder = question.placeholders[key];
      if (placeholder.type === "input") {
        const validationType = (placeholder as any).input_validation;
        if (!validateInput(value as string, validationType)) {
          return false;
        }
      }
      return true;
    });
  };

  const hasValidResponses = Object.keys(question.placeholders).every(key =>
    responses[key] !== undefined || getResponse(question.question_id, key) !== undefined
  ) && allInputsHaveValidContent();

  return (
    <div className="max-w-xl animate-fade-in">
      <div className="text-[16px] font-normal text-gray-900 mb-5 leading-relaxed">
        {question.question_text.includes("{{")
          ? renderQuestionPlaceholders(question.question_text)
          : question.question_text}
      </div>
      <Separator className="h-[1px] bg-[#F0EAE0] mb-5" />
      <div className="space-y-5">
        {Object.keys(question.placeholders).map(key => renderVisibleSelectOptions(key, question.placeholders[key]))}
      </div>
      {hasValidResponses && (
        <div className="mt-8">
          <Button
            type="button"
            className={cn(
              "bg-[#245C4F] hover:bg-[#1e4f44] text-white px-[32px] py-[16px] rounded-[12px] text-[17px] font-medium",
              "transition-all shadow-[0_6px_12px_rgba(36,92,79,0.2)] hover:shadow-[0_8px_16px_rgba(36,92,79,0.25)]",
              "inline-flex items-center gap-[12px]"
            )}
            onClick={handleNextQuestion}
            disabled={isNavigating || Object.keys(question.placeholders).length === 0}
          >
            Avanti <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 