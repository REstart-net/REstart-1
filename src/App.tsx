import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import DashboardPage from "./pages/DashboardPage";
import SubjectPage from "./pages/SubjectPage";
import TestPage from "./pages/TestPage";
import FullMockTestPage from "./pages/FullMockTestPage";
import CertificatePage from "./pages/CertificatePage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import InterviewResourcesPage from "./pages/InterviewResourcesPage";

export default function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/subjects/:subject" component={SubjectPage} />
        <Route path="/subjects/:subject/test" component={TestPage} />
        <Route path="/full-mock-test" component={FullMockTestPage} />
        <Route path="/certificates" component={CertificatePage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/checkout/:package" component={CheckoutPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/interview-resources" component={InterviewResourcesPage} />
      </Switch>
    </>
  );
}