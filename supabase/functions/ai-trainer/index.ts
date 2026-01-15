import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userProfile, messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";

    if (type === "workout") {
      systemPrompt = `You are an expert fitness trainer and workout planner. Create a personalized weekly workout plan based on the user's profile.
      
User Profile:
- Weight: ${userProfile.weight} ${userProfile.weightUnit}
- Height: ${userProfile.height} ${userProfile.heightUnit}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Fitness Goal: ${userProfile.goal}
- Fitness Level: ${userProfile.fitnessLevel}
- Available Equipment: ${userProfile.equipment || 'None specified'}

Create a detailed 7-day workout plan. For each day, include:
1. Workout name and focus area
2. Warm-up exercises (5-10 mins)
3. Main exercises with sets, reps, and rest periods
4. Cool-down stretches

Format the response as valid JSON with this structure:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "focus": "Chest & Triceps",
      "duration": "45 mins",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 sec",
          "notes": "Optional tips"
        }
      ]
    }
  ],
  "tips": ["General tip 1", "General tip 2"]
}`;
    } else if (type === "diet") {
      const bmr = calculateBMR(userProfile);
      const tdee = calculateTDEE(bmr, userProfile.activityLevel || "moderate");
      const targetCalories = calculateTargetCalories(tdee, userProfile.goal);

      systemPrompt = `You are an expert nutritionist and meal planner. Create a personalized daily meal plan based on the user's profile.

User Profile:
- Weight: ${userProfile.weight} ${userProfile.weightUnit}
- Height: ${userProfile.height} ${userProfile.heightUnit}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Goal: ${userProfile.goal}
- Estimated Daily Calories: ${targetCalories}
- Dietary Preferences: ${userProfile.dietaryPreferences || 'None'}
- Allergies: ${userProfile.allergies || 'None'}

Create a detailed daily meal plan. Include:
1. Breakfast, Lunch, Dinner, and 2 Snacks
2. Specific portions and ingredients
3. Macronutrient breakdown for each meal
4. Total daily macros

Format the response as valid JSON with this structure:
{
  "dailyPlan": {
    "targetCalories": ${targetCalories},
    "meals": [
      {
        "meal": "Breakfast",
        "time": "7:00 AM",
        "name": "Meal Name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "calories": 400,
        "protein": 30,
        "carbs": 40,
        "fat": 15
      }
    ],
    "totalMacros": {
      "calories": 2000,
      "protein": 150,
      "carbs": 200,
      "fat": 70
    }
  },
  "tips": ["Nutrition tip 1", "Nutrition tip 2"]
}`;
    } else if (type === "chat") {
      systemPrompt = `You are an expert AI fitness coach and nutritionist. You help users with:
- Workout advice and exercise form tips
- Nutrition guidance and meal suggestions
- Motivation and accountability
- Answering fitness-related questions
- Adjusting their workout or diet plans

User Profile:
- Weight: ${userProfile.weight} ${userProfile.weightUnit}
- Height: ${userProfile.height} ${userProfile.heightUnit}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Goal: ${userProfile.goal}
- Fitness Level: ${userProfile.fitnessLevel}

Be encouraging, supportive, and provide actionable advice. Keep responses concise but helpful.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || [{ role: "user", content: "Generate the plan" }]),
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (type === "chat") {
      return new Response(JSON.stringify({ response: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON response for workout/diet plans
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify(parsedData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in ai-trainer function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function calculateBMR(profile: any): number {
  const weight = profile.weightUnit === 'lbs' ? profile.weight * 0.453592 : profile.weight;
  const height = profile.heightUnit === 'ft' ? profile.height * 30.48 : profile.height;
  
  if (profile.gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * profile.age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * profile.age);
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500);
    case 'gain':
      return Math.round(tdee + 300);
    default:
      return tdee;
  }
}