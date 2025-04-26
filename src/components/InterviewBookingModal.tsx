import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

// Price plans based on referral status
const PRICES = {
  REFERRAL: {
    STANDARD: 100
  },
  NORMAL: {
    STANDARD: 100
  }
};

export function InterviewBookingModal() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [hasReferral, setHasReferral] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function checkReferralStatus() {
      if (!user) {
        setHasReferral(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_referrals')
          .select('*')
          .eq('user_id', user.id)
          .not('verified_at', 'is', null)
          .limit(1);

        if (error) throw error;
        
        setHasReferral(data && data.length > 0);
      } catch (err) {
        console.error('Error checking referral status:', err);
        setHasReferral(false);
      }
    }

    checkReferralStatus();
  }, [user]);

  const getPrice = () => {
    return hasReferral ? PRICES.REFERRAL.STANDARD : PRICES.NORMAL.STANDARD;
  };

  const handleBooking = () => {
    // Store booking details in localStorage for the checkout page
    localStorage.setItem('interviewBooking', JSON.stringify({
      package: "STANDARD",
      price: getPrice()
    }));
    
    // Close the modal
    setOpen(false);
    
    // Redirect to payment page
    setLocation(`/interview-payment`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Book Interview Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Mock Interview</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="p-4 border rounded-md">
            <h5 className="font-semibold">Standard Interview</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• 30-minute mock interview</li>
              <li>• Basic feedback</li>
              <li>• One practice question</li>
            </ul>
            <div className="flex items-center gap-1 mt-3">
              <IndianRupee className="h-4 w-4" />
              <span className="font-bold">{getPrice()}</span>
              {hasReferral && <span className="text-xs text-muted-foreground ml-1">(with referral)</span>}
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-1">
              <IndianRupee className="h-5 w-5" />
              <span className="text-xl font-bold">{getPrice()}</span>
            </div>
            <Button 
              onClick={handleBooking}
            >
              Book Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 