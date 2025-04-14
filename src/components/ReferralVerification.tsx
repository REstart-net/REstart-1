import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { verifyReferralCode, verifyNsatRegistration, storeUserReferral } from "@/lib/api";

interface ReferralVerificationProps {
  userId: string;
  userEmail: string;
  onVerified: () => void;
  onSkip: () => void;
}

export function ReferralVerification({ userId, userEmail, onVerified, onSkip }: ReferralVerificationProps) {
  const [referralCode, setReferralCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success?: boolean;
    message?: string;
    isRegistered?: boolean;
  }>({});
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!referralCode.trim()) {
      toast({
        title: "Referral code required",
        description: "Please enter a valid referral code.",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    setVerificationResult({});

    try {
      // First verify if the referral code exists in our system
      const isValidCode = await verifyReferralCode(referralCode);
      
      if (!isValidCode) {
        setVerificationResult({
          success: false,
          message: "Invalid referral code. Please check and try again.",
        });
        setVerifying(false);
        return;
      }

      // Now check if the user is registered with NSAT
      const nsatStatus = await verifyNsatRegistration(userEmail, referralCode);
      
      if (nsatStatus.isRegistered) {
        // Record the successful verification
        await storeUserReferral(userId, referralCode, userEmail);
        
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

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>NSAT Registration Verification</CardTitle>
        <CardDescription>
          Enter your referral code to validate your NSAT registration and unlock unlimited test attempts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="referral-code">Referral Code</Label>
          <Input
            id="referral-code"
            placeholder="Enter your referral code (e.g., NSAT2024)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={verifying}
          />
        </div>

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
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 