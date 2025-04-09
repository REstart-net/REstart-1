import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[] | Record<string, number>;
  markedQuestions: number[] | Set<number>;
  onQuestionSelect: (index: number) => void;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedQuestions,
  onQuestionSelect,
}: QuestionNavigatorProps) {
  // Convert answeredQuestions to array of indices if it's an object
  const answeredIndices = Array.isArray(answeredQuestions) 
    ? answeredQuestions 
    : Object.keys(answeredQuestions).map(() => 1).map((_, i) => i);

  // Convert markedQuestions to array if it's a Set
  const markedIndices = Array.isArray(markedQuestions) 
    ? markedQuestions 
    : Array.from(markedQuestions);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-muted rounded-lg"
    >
      <h3 className="font-semibold mb-4">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              currentQuestion === i && "border-primary",
              answeredIndices.includes(i) && "bg-primary/10",
              markedIndices.includes(i) && "ring-2 ring-yellow-500"
            )}
            onClick={() => onQuestionSelect(i)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-primary/10 rounded" />
          <span className="text-muted-foreground">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border border-primary rounded" />
          <span className="text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 ring-2 ring-yellow-500 rounded" />
          <span className="text-muted-foreground">Marked for review</span>
        </div>
      </div>
    </motion.div>
  );
}