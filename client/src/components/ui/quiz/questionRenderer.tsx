"use client";

import { TaskQuestion } from "@/lib/types/task";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type QuestionRendererProps = {
  question: TaskQuestion;
  options: string[];
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
};

export function QuestionRenderer({
  question,
  options,
  answer,
  onAnswerChange,
  disabled,
}: QuestionRendererProps) {
  if (question.type === "QUIZ") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">{question.question_text}</h2>
        <RadioGroup
          value={answer}
          onValueChange={onAnswerChange}
          className="space-y-3"
          disabled={disabled}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 rounded-md border dark:border-zinc-700 has-[input:checked]:border-primary has-[input:checked]:bg-muted/50 transition-all"
            >
              <RadioGroupItem
                value={option}
                id={`q-${question.ID}-opt-${index}`}
              />
              <Label
                htmlFor={`q-${question.ID}-opt-${index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  if (question.type === "FILL_BLANK") {
    const parts = question.question_text.split("___");
    const preText = parts[0];
    const postText = parts.length > 1 ? parts[1] : "";

    return (
      <div>
        <h2 className="text-xl font-semibold mb-6 leading-relaxed">
          {preText}
          <Input
            type="text"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={disabled}
            className="inline-block w-40 mx-2 font-mono text-base px-2 py-1 h-auto"
            placeholder="wpisz..."
          />
          {postText}
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{question.question_text}</h2>
      <Input
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Wpisz odpowiedź..."
      />
    </div>
  );
}
