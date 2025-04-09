import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Check, AlertCircle } from "lucide-react";
import { savePayment } from "@/lib/payment-service";

interface QRCodePaymentProps {
  amount: number;
  packageId: string;
  packageName: string;
  onPaymentComplete: (screenshotUrl: string, paymentId: string) => void;
}

export function QRCodePayment({ amount, packageId, packageName, onPaymentComplete }: QRCodePaymentProps) {
  const { user } = useAuth();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setScreenshot(file);
        setError(null);
      } else {
        setError('Please upload an image file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      setError('Please upload your payment screenshot');
      return;
    }

    if (!user) {
      setError('You must be logged in to make a payment');
      return;
    }

    setUploading(true);
    try {
      // Save payment data to Supabase
      const result = await savePayment({
        userId: user.id,
        packageId,
        packageName,
        amount,
        paymentDate: new Date().toISOString(),
        status: 'pending'
      }, screenshot);

      if (!result.success || !result.screenshotUrl || !result.paymentId) {
        throw new Error(result.error || 'Failed to process payment');
      }

      // Call the success callback with the screenshot URL
      onPaymentComplete(result.screenshotUrl, result.paymentId);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload screenshot. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Pay ₹{amount}</h3>
          <p className="text-sm text-muted-foreground">Scan QR code to pay via UPI</p>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border my-4">
            <img
              src="https://media-hosting.imagekit.io/8a987219fd764ff9/WhatsApp%20Image%202025-03-30%20at%2021.19.22.jpeg?Expires=1838125404&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=erpjTvxH8OsUd2472MBtlL0x8CTdDc6Bn-re87VD1UzWmOyppZAz3S-dXcC7-U0QSt7ISAuKdQfRWmpY4WIiQRgtIobYDBbc-Z7R-li5JY0X4um4tX74ko6o9ln95X9IkM7AO~DMzy6TKI5DavJJg4soz8QWjwdLBKZzm2F6km15UEY8VtzkFBEnV00Wb8zmMTdaPiHJzUi8yk9nR-KxVlaHQXFOOFEg5tUeBSsZzB7kBs0fCJabD4A2PQ2NilIfAEqgSD9g0phCrTlmZCUqyeEbm8fAreKZPekTY9MunqlAGCo05IqbFkWzHreQI8dR5TrAK3EBbJAACJ894yCXgw__"
              alt="Payment QR Code"
              className="w-48 h-48 mx-auto"
            />
            <p className="text-sm text-muted-foreground mt-2">
              UPI ID: 9757157958@pthdfcc
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {screenshot && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <Check className="h-4 w-4" />
                Screenshot selected
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!screenshot || uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Payment Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open any UPI app (Paytm, PhonePe, Google Pay, etc.)</li>
            <li>Scan the QR code shown above</li>
            <li>Pay exactly ₹{amount}</li>
            <li>Take a screenshot of successful payment</li>
            <li>Upload the screenshot here</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 