import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, AlertTriangle, Lock, Shield, Eye, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Subject } from "@/shared/schema";

interface TestInstructionsProps {
  duration: number;
  totalQuestions: number;
  onStart: () => void;
  subject?: Subject;
  isFullMockTest?: boolean;
}

// Subject-specific instructions
const subjectInstructions = {
  "Basic Mathematics": {
    title: "Basic Mathematics Test",
    description: "Test your proficiency in fundamental mathematical concepts and operations",
    notes: [
      "Use the provided virtual calculator for complex calculations",
      "Pay attention to units when solving measurement problems",
      "Show your work for partial credit on multi-step problems"
    ]
  },
  "Advanced Mathematics": {
    title: "Advanced Mathematics Test",
    description: "Assess your understanding of advanced mathematical concepts and problem-solving skills",
    notes: [
      "Graphing tools are available for coordinate geometry questions",
      "Formula sheet is accessible via the reference tab",
      "Simplify expressions and equations in your final answers"
    ]
  },
  "English": {
    title: "English Proficiency Test",
    description: "Evaluate your reading comprehension, vocabulary, and grammar skills",
    notes: [
      "Read passages carefully before answering comprehension questions",
      "Pay attention to context when selecting vocabulary answers",
      "Grammar questions require understanding of standard English rules"
    ]
  },
  "Logical Reasoning": {
    title: "Logical Reasoning Test",
    description: "Test your analytical thinking and problem-solving abilities",
    notes: [
      "Use scratch paper for diagramming logic puzzles",
      "Track negations carefully in conditional reasoning questions",
      "Avoid common logical fallacies in argument analysis"
    ]
  }
};

export function TestInstructions({ duration, totalQuestions, onStart, subject, isFullMockTest = false }: TestInstructionsProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleStartTest = () => {
    if (!agreedToTerms) {
      setShowWarning(true);
      return;
    }
    onStart();
  };

  const getCardTitle = () => {
    if (isFullMockTest) {
      return "NSAT Full Mock Test";
    }
    return subject ? subjectInstructions[subject]?.title || `${subject} Test` : "NSAT Practice Test";
  };

  const getDescription = () => {
    if (isFullMockTest) {
      return "This comprehensive test covers all NSAT subjects and simulates the actual exam environment";
    }
    return subject 
      ? subjectInstructions[subject]?.description || `Test your knowledge in ${subject}`
      : "This practice test helps you prepare for the NSAT exam";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4"
    >
      <Card>
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl">{getCardTitle()}</CardTitle>
          <p className="text-muted-foreground mt-2">
            {getDescription()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Questions</p>
                <p className="text-sm text-muted-foreground">{totalQuestions} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Secure Test</p>
                <p className="text-sm text-muted-foreground">Fullscreen required</p>
              </div>
            </div>
          </div>

          {isFullMockTest && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Test Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    subject: "Basic Mathematics",
                    questions: 30,
                    time: 45,
                    icon: <FileText className="h-4 w-4 text-blue-500" />
                  },
                  {
                    subject: "Advanced Mathematics",
                    questions: 30,
                    time: 45,
                    icon: <FileText className="h-4 w-4 text-purple-500" />
                  },
                  {
                    subject: "English",
                    questions: 30,
                    time: 45,
                    icon: <FileText className="h-4 w-4 text-green-500" />
                  },
                  {
                    subject: "Logical Reasoning",
                    questions: 30,
                    time: 45,
                    icon: <FileText className="h-4 w-4 text-orange-500" />
                  }
                ].map((subj, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {subj.icon}
                    <div className="flex-1">
                      <p className="font-medium">{subj.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {subj.questions} questions • {subj.time} minutes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Important Instructions</h3>
            
            {/* Subject-specific instructions */}
            {subject && subjectInstructions[subject]?.notes && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-500">Subject Specific Instructions</h4>
                    <ul className="space-y-2 mt-2 text-sm">
                      {subjectInstructions[subject].notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-500">Security Measures</h4>
                  <p className="text-sm text-muted-foreground">
                    This test uses advanced security features to maintain integrity. Please note:
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mt-3 text-sm text-muted-foreground pl-9">
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    The test will run in fullscreen mode. Exiting fullscreen will trigger a warning.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Switching tabs or applications during the test will be detected and logged.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    After 3 security violations, your test will be automatically submitted.
                  </span>
                </li>
              </ul>
            </div>
            
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">1.</span>
                The test will be automatically submitted when the time is up.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">2.</span>
                You can navigate between questions using the question panel or next/previous buttons.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">3.</span>
                Questions can be marked for review and revisited before final submission.
              </li>
              {!subject && (
                <li className="flex items-start gap-2">
                  <span className="font-medium text-primary">4.</span>
                  You can switch between subjects during the test using the tabs at the top.
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="font-medium text-primary">{subject ? '4' : '5'}.</span>
                Ensure you have a stable internet connection throughout the test.
              </li>
            </ul>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => {
                  setAgreedToTerms(checked === true);
                  if (checked) setShowWarning(false);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand and agree to follow all test rules and security measures
                </label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, you acknowledge that violations may result in test termination
                </p>
              </div>
            </div>
            
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-sm"
              >
                You must agree to the terms before starting the test.
              </motion.div>
            )}
            
            <Button onClick={handleStartTest} className="w-full">
              Start {isFullMockTest ? "Full Mock Test" : subject ? `${subject} Test` : "Test"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {isFullMockTest 
                ? "This test simulates the actual NSAT exam environment and difficulty level." 
                : "This practice test helps you prepare for the NSAT exam."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}