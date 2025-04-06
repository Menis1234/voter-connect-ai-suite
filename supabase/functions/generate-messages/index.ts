
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language, messageType } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Example responses - in a real app, you would use an AI API (OpenAI, etc.)
    const englishResponses = [
      "Hello! Just a reminder about tomorrow's election. Your vote matters.",
      "Don't forget to visit your polling station tomorrow. Your participation is crucial for our future.",
      "Election reminder: Polls open from 6am to 6pm tomorrow. Please remember to bring your ID.",
    ];

    const swahiliResponses = [
      "Habari! Tunataka kukumbusha kuhusu uchaguzi kesho. Kura yako ni muhimu.",
      "Ndugu mpigakura, tutafurahi kukuona katika kituo cha kupigia kura kesho.",
      "Tafadhali kumbuka kupiga kura kesho. Vituo vya kupigia kura vitafunguliwa saa 12 asubuhi.",
    ];

    // Select responses based on language
    const responses = language === 'en' ? englishResponses : swahiliResponses;

    // For demo purposes, just returning static suggestions
    // In a real app, this would call the OpenAI API
    return new Response(
      JSON.stringify({ 
        suggestions: responses
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
