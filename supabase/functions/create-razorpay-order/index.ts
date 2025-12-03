import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const key_id = Deno.env.get("RAZORPAY_KEY_ID");
    const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!key_id || !key_secret) {
      throw new Error("Razorpay keys (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing in Supabase Secrets.");
    }

    // Use Basic Auth for Razorpay API
    const auth = btoa(`${key_id}:${key_secret}`);

    // Call Razorpay API directly using fetch to avoid npm dependency issues
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // Convert to paise
        currency,
        receipt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay API Error:", data);
      throw new Error(data.error?.description || "Failed to create order with Razorpay");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});