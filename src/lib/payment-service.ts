import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PaymentData {
  userId: string;
  packageId: string;
  packageName: string;
  amount: number;
  paymentDate: string;
  screenshotPath: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface DirectCheckoutData {
  userId: string;
  packageId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function savePayment(paymentData: Omit<PaymentData, 'screenshotPath'>, screenshot: File): Promise<{ success: boolean; error?: string; paymentId?: string; screenshotUrl?: string }> {
  try {
    // 1. Upload the screenshot to storage
    const fileName = `payment_screenshots/${paymentData.userId}_${Date.now()}.${screenshot.name.split('.').pop()}`;
    
    const { error: uploadError } = await supabase.storage
      .from('payments')
      .upload(fileName, screenshot);
    
    if (uploadError) {
      throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
    }
    
    // 2. Get the public URL for the uploaded file
    const { data: urlData } = await supabase.storage
      .from('payments')
      .getPublicUrl(fileName);
    
    const screenshotUrl = urlData.publicUrl;
    
    // 3. Save the payment record in the database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        ...paymentData,
        screenshotPath: fileName,
        screenshotUrl: screenshotUrl
      })
      .select()
      .single();
    
    if (dbError) {
      throw new Error(`Failed to save payment record: ${dbError.message}`);
    }
    
    return { 
      success: true, 
      paymentId: paymentRecord.id,
      screenshotUrl
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getPaymentsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('userId', userId);
    
  if (error) {
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
  
  return data;
}

export async function getPaymentById(paymentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();
    
  if (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }
  
  return data;
}

export async function updatePaymentStatus(paymentId: string, status: 'verified' | 'rejected', adminNotes?: string) {
  const { error } = await supabase
    .from('payments')
    .update({ 
      status, 
      adminNotes,
      verifiedAt: status === 'verified' ? new Date().toISOString() : null
    })
    .eq('id', paymentId);
    
  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }
  
  return { success: true };
}

export async function processDirectCheckout(data: DirectCheckoutData) {
  try {
    // 1. Create the order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: data.userId,
        package_id: data.packageId,
        status: 'completed',
        payment_method: 'direct',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    
    // 2. Generate certificate URL
    const certificateUrl = `/certificates/certificate.pdf`;
    
    // 3. Insert certificate record
    const { error: certError } = await supabase
      .from('certificates')
      .insert({
        user_id: data.userId,
        order_id: orderData.id,
        certificate_url: certificateUrl,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        issue_date: new Date().toISOString(),
      });
    
    if (certError) throw certError;
    
    return { 
      success: true, 
      orderId: orderData.id,
      certificateUrl 
    };
  } catch (error) {
    console.error('Error processing direct checkout:', error);
    return { success: false, error };
  }
} 