import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, BrainCircuit, BookOpen, FileText, GraduationCap } from "lucide-react";
import { subjects } from "@/shared/schema";
import { motion } from "framer-motion";

const subjectIcons = {
  "Basic Mathematics": FileText,
  "Advanced Mathematics": GraduationCap,
  "Logical Reasoning": BrainCircuit,
  "English": BookOpen,
} as const;

const subjectChapters = {
  "Basic Mathematics": [
    "HCF & LCM | Divisibility",
    "Ratios, Averages & Percentages",
    "Polynomials",
    "Inequalities",
    "Linear Equations",
    "Navigation Using Direction",
    "Speed | Profit & Loss | Interest"
  ],
  "Advanced Mathematics": [
    "Sets | Permutations & Combinations (PnC)",
    "Functions",
    "Sequence and Series",
    "Differentiation | Integration",
    "Matrices and Determinants",
    "Probability",
    "Statistics"
  ],
  "Logical Reasoning": [
    "Tables",
    "Graphs",
    "Venn Diagrams",
    "Scatter Plots",
    "Arrangements of People",
    "Navigation Using Direction",
    "Family Relation",
    "Encryption - Decryption",
    "Outcome from Specific Set of Instructions",
    "Instructions Required for a Specific Outcome"
  ],
  "English": [
    "Summary & Tone of Passage",
    "Cause and Effect Relationships",
    "High Order Inferences from Texts"
  ]
};

const subjectDescriptions = {
  "Basic Mathematics": "These chapters cover foundational mathematical concepts and applications",
  "Advanced Mathematics": "These chapters focus on higher-level mathematical concepts and problem-solving",
  "Logical Reasoning": "These chapters focus on problem-solving, reasoning patterns, and analytical thinking",
  "English": "These chapters test comprehension, grammar, tone, and inference from texts"
};

const subjectEmoji = {
  "Basic Mathematics": "➗",
  "Advanced Mathematics": "📚",
  "Logical Reasoning": "🔍",
  "English": "📘"
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Subjects</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subjects.map((subject, index) => {
            const Icon = subjectIcons[subject as keyof typeof subjectIcons];
            const chapters = subjectChapters[subject as keyof typeof subjectChapters];
            const description = subjectDescriptions[subject as keyof typeof subjectDescriptions];
            const emoji = subjectEmoji[subject as keyof typeof subjectEmoji];
            
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {Icon && <Icon className="h-6 w-6 text-primary" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {emoji} {subject}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {chapters.map((chapter, i) => (
                        <li key={i} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary/50 mr-3"></div>
                          <span>{chapter}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={`/subjects/${encodeURIComponent(subject)}`}>
                      <Button className="w-full mt-6 flex items-center justify-center gap-2">
                        Explore Subject
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
} 