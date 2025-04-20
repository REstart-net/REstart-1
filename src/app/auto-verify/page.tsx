"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AutoNsatVerification } from "@/components/AutoNsatVerification";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function AutoVerifyPage() {
  const { userId, isLoaded, isSignedIn, getToken } = useAuth();
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchUserEmail = async () => {
      try {
        // This is a simplified example - in a real app, you might want to use Clerk's
        // getUserProfile or a similar method to get the user's email
        const token = await getToken();
        const response = await fetch("/api/user-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserEmail(data.emailAddress);
      } catch (error) {
        console.error("Failed to fetch user email:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, [isLoaded, isSignedIn, router, getToken]);

  const handleVerified = () => {
    router.push("/dashboard");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  if (loading || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">NSAT Verification</h1>
        <p className="text-muted-foreground">
          We're automatically verifying your NSAT registration to enable full access to the platform.
        </p>
      </div>

      <AutoNsatVerification
        userId={userId || ""}
        userEmail={userEmail}
        onVerified={handleVerified}
        onSkip={handleSkip}
      />
    </div>
  );
} 