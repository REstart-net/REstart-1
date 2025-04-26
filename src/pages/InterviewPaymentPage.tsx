import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, IndianRupee } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface BookingDetails {
  package: "STANDARD";
  price: number;
}

// Mock UPI ID - replace with your actual payment details
const UPI_ID = "9757157958@pthdfcc";

export default function InterviewPaymentPage() {
  const { loading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed">("pending");
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve booking details from localStorage
    const storedBooking = localStorage.getItem('interviewBooking');
    if (storedBooking) {
      setBookingDetails(JSON.parse(storedBooking));
    } else {
      // Redirect if no booking details found
      navigate("/dashboard");
    }
  }, [navigate]);

  if (loading || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({
      description: "UPI ID copied to clipboard",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProofImage(reader.result as string);
        setScreenshotUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentConfirmation = () => {
    setPaymentStatus("processing");
    
    // Simulate payment verification
    setTimeout(() => {
      setPaymentStatus("completed");
      // Clear the booking details from localStorage after successful payment
      localStorage.removeItem('interviewBooking');
    }, 2000);
  };

  if (paymentStatus === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>Your interview session has been booked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package:</span>
                  <span className="font-medium">Standard Interview</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-medium">₹{bookingDetails.price}</span>
                </div>
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                You will receive a confirmation email with the details of your interview session within 24 hours.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/bookings")}>
                View Bookings
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Please make a payment of ₹{bookingDetails.price} to book your standard interview session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <img
                src="https://media-hosting.imagekit.io/8a987219fd764ff9/WhatsApp%20Image%202025-03-30%20at%2021.19.22.jpeg?Expires=1838125404&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=erpjTvxH8OsUd2472MBtlL0x8CTdDc6Bn-re87VD1UzWmOyppZAz3S-dXcC7-U0QSt7ISAuKdQfRWmpY4WIiQRgtIobYDBbc-Z7R-li5JY0X4um4tX74ko6o9ln95X9IkM7AO~DMzy6TKI5DavJJg4soz8QWjwdLBKZzm2F6km15UEY8VtzkFBEnV00Wb8zmMTdaPiHJzUi8yk9nR-KxVlaHQXFOOFEg5tUeBSsZzB7kBs0fCJabD4A2PQ2NilIfAEqgSD9g0phCrTlmZCUqyeEbm8fAreKZPekTY9MunqlAGCo05IqbFkWzHreQI8dR5TrAK3EBbJAACJ894yCXgw__"
                alt="Payment QR Code"
                className="w-48 h-48 mx-auto"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                UPI ID: {UPI_ID}
              </p>
            </div>
            <div className="flex items-center bg-muted p-2 rounded-md w-full">
              <span className="text-sm flex-grow font-mono px-2">{UPI_ID}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyUPI}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm mb-4">
              After making the payment, please upload a screenshot for verification:
            </p>
            <div className="space-y-4">
              {paymentProofImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img 
                    src={paymentProofImage} 
                    alt="Payment proof" 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-48">
                  <label className="cursor-pointer text-center">
                    <span className="block text-sm text-muted-foreground mb-2">
                      Click to upload payment screenshot
                    </span>
                    <Button variant="secondary" size="sm" className="relative" type="button">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Payment Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open any UPI app (Paytm, PhonePe, Google Pay, etc.)</li>
              <li>Scan the QR code shown above</li>
              <li>Pay exactly ₹{bookingDetails.price}</li>
              <li>Take a screenshot of successful payment</li>
              <li>Upload the screenshot here</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-5 w-5" />
            <span className="text-xl font-bold">{bookingDetails.price}</span>
          </div>
          <Button
            onClick={handlePaymentConfirmation}
            disabled={paymentStatus === "processing" || !screenshotUploaded}
          >
            {paymentStatus === "processing" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 