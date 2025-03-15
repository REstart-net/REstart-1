import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: string[];
    explanation?: string;
  };
  selectedAnswer?: number;
  correctAnswer?: number;
  onAnswerSelect?: (answerId: number) => void;
  showExplanation?: boolean;
}

export function QuestionCard({
  question,
  selectedAnswer,
  correctAnswer,
  onAnswerSelect,
  showExplanation
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <p className="text-lg font-medium mb-4">{question.text}</p>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => onAnswerSelect?.(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = correctAnswer === index;
              const isIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg p-3 transition-colors ${
                    isSelected
                      ? "bg-primary/5"
                      : "hover:bg-muted/50"
                  } ${
                    showExplanation && isCorrect
                      ? "bg-green-500/10 border-green-500/20 border"
                      : ""
                  } ${
                    isIncorrect
                      ? "bg-red-500/10 border-red-500/20 border"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`${question.id}-${index}`}
                    disabled={showExplanation}
                  />
                  <Label
                    htmlFor={`${question.id}-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          {showExplanation && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-muted rounded-lg"
            >
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-muted-foreground whitespace-pre-line">
                {question.explanation}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}