import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download } from 'lucide-react';

interface Certificate {
  id: string;
  created_at: string;
  user_id: string;
  order_id: string;
  certificate_url: string;
  first_name: string;
  last_name: string;
}

export default function CertificatePage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const orderId = location.query.orderId;
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertificate() {
      if (!user) {
        setError('You must be logged in to view your certificates');
        setLoading(false);
        return;
      }

      try {
        const query = supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id);
        
        // If orderId is provided, filter by that specific order
        if (orderId) {
          query.eq('order_id', orderId);
        } else {
          // Otherwise get the most recent certificate
          query.order('created_at', { ascending: false }).limit(1);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          setCertificate(data[0] as Certificate);
        } else {
          setError('No certificates found');
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    }

    fetchCertificate();
  }, [user, orderId]);

  const downloadCertificate = () => {
    if (certificate?.certificate_url) {
      // In a real app, this would be an actual download implementation
      // For now, we'll just open the URL
      window.open(certificate.certificate_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No Certificate Found</h2>
        <p className="mt-2">We couldn't find any certificates associated with your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Certificate</h1>
      <Card className="border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Certificate of Completion</CardTitle>
          <CardDescription>
            Issued to {certificate.first_name} {certificate.last_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          {/* Mock certificate preview */}
          <div className="bg-white border-4 border-double border-gray-200 p-8 w-full max-w-xl text-center">
            <div className="border-b-2 border-gray-200 pb-4">
              <h2 className="text-3xl font-serif mb-2">Certificate of Achievement</h2>
              <p className="text-gray-600 italic">This certifies that</p>
              <p className="text-2xl font-semibold mt-2">{certificate.first_name} {certificate.last_name}</p>
            </div>
            <div className="py-4">
              <p className="text-gray-700">has successfully completed the course and is recognized for their achievement</p>
              <p className="font-semibold mt-4">Date Issued: {new Date(certificate.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500 mt-6">Certificate ID: {certificate.id}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={downloadCertificate} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 