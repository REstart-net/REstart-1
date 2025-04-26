import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import DashboardPage from "./pages/DashboardPage";
import SubjectPage from "./pages/SubjectPage";
import SubjectsPage from "./pages/SubjectsPage";
import TestPage from "./pages/TestPage";
import FullMockTestPage from "./pages/FullMockTestPage";
import CertificatePage from "./pages/CertificatePage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import InterviewResourcesPage from "./pages/InterviewResourcesPage";
import TechnicalInterviewResourcesPage from "./pages/TechnicalInterviewResourcesPage";
import SoftSkillsInterviewResourcesPage from "./pages/SoftSkillsInterviewResourcesPage";
import ExamDatesPage from "./pages/ExamDatesPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import SupportDashboardPage from "./pages/SupportDashboardPage";
import InterviewPaymentPage from "./pages/InterviewPaymentPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/subjects" component={SubjectsPage} />
        <Route path="/subjects/:subject" component={SubjectPage} />
        <Route path="/subjects/:subject/test" component={TestPage} />
        <Route path="/subjects/:subject/full-test" component={TestPage} />
        <Route path="/full-mock-test" component={FullMockTestPage} />
        <Route path="/certificates" component={CertificatePage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/checkout/:package" component={CheckoutPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/exam-dates" component={ExamDatesPage} />
        <Route path="/interview-resources" component={InterviewResourcesPage} />
        <Route path="/interview-resources/technical" component={TechnicalInterviewResourcesPage} />
        <Route path="/interview-resources/soft-skills" component={SoftSkillsInterviewResourcesPage} />
        <Route path="/technical-interview-resources" component={TechnicalInterviewResourcesPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/support" component={ContactSupportPage} />
        <Route path="/support/dashboard" component={SupportDashboardPage} />
        <Route path="/interview-payment" component={InterviewPaymentPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}