import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { verifyNsatRegistration, storeUserReferral } from "@/lib/api";

interface AutoNsatVerificationProps {
  userId: string;
  userEmail: string;
  onVerified: () => void;
  onSkip: () => void;
}

export function AutoNsatVerification({ userId, userEmail, onVerified, onSkip }: AutoNsatVerificationProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success?: boolean;
    message?: string;
    isRegistered?: boolean;
  }>({});
  const { toast } = useToast();

  const handleVerification = async () => {
    setVerifying(true);
    setVerificationResult({});

    try {
      // Check if the user is registered with NSAT using their email
      const nsatStatus = await verifyNsatRegistration(userEmail);
      
      if (nsatStatus.isRegistered) {
        // Record the successful verification with a default referral code
        const defaultReferralCode = "NSATAUTO";
        await storeUserReferral(userId, defaultReferralCode, userEmail);
        
        setVerificationResult({
          success: true,
          message: "Your NSAT registration has been verified successfully!",
          isRegistered: true,
        });
        
        toast({
          title: "Verification successful",
          description: "Your NSAT registration has been verified. You now have access to all tests.",
        });

        // Allow a short delay to see the success message
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setVerificationResult({
          success: false,
          message: "We couldn't verify your NSAT registration. Please ensure you're registered for NSAT using this email.",
          isRegistered: false,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        message: "An error occurred during verification. Please try again later.",
      });
    } finally {
      setVerifying(false);
    }
  };

  // Auto-verify on component mount
  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>NSAT Registration Verification</CardTitle>
        <CardDescription>
          We're automatically verifying your NSAT registration status...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verifying && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Verifying your NSAT registration...</p>
          </div>
        )}

        {verificationResult.message && (
          <Alert variant={verificationResult.success ? "default" : "destructive"}>
            {verificationResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {verificationResult.success ? "Success" : "Verification Failed"}
            </AlertTitle>
            <AlertDescription>{verificationResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onSkip} disabled={verifying}>
          Skip for now
        </Button>
        <Button onClick={handleVerification} disabled={verifying}>
          {verifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Try Again"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 