import { lazy, Suspense } from 'react';
import { Route } from 'wouter';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const FullMockTestPage = lazy(() => import('./pages/FullMockTestPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/subjects/:subject" component={SubjectPage} />
        <Route path="/subjects/:subject/test" component={TestPage} />
        <Route path="/full-mock-test" component={FullMockTestPage} />
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;