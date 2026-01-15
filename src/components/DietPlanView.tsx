import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProfile, DietPlan } from '@/types/fitness';
import { Loader2, Utensils, Clock, RefreshCw, Lightbulb, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DietPlanViewProps {
  profile: UserProfile;
  dietPlan: DietPlan | null;
  onPlanGenerated: (plan: DietPlan) => void;
}

const DietPlanView = ({ profile, dietPlan, onPlanGenerated }: DietPlanViewProps) => {
  const [loading, setLoading] = useState(false);
  const [macroProgress, setMacroProgress] = useState({ protein: false, carbs: false, fat: false });

  const getCustomApiKey = () => {
    const useCustomApi = localStorage.getItem('fitgenius-use-custom-api');
    if (useCustomApi === 'true') {
      const apiKey = localStorage.getItem('fitgenius-gemini-api-key');
      return apiKey ? JSON.parse(apiKey) : null;
    }
    return null;
  };

  const generatePlan = async () => {
    setLoading(true);
    setMacroProgress({ protein: false, carbs: false, fat: false });
    try {
      const customApiKey = getCustomApiKey();
      const { data, error } = await supabase.functions.invoke('ai-trainer', {
        body: {
          type: 'diet',
          userProfile: profile,
          customApiKey,
        },
      });

      if (error) throw error;

      if (data.dailyPlan) {
        onPlanGenerated({
          ...data,
          generatedAt: new Date().toISOString(),
        });
        toast.success('Diet plan generated successfully!');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error: any) {
      console.error('Error generating diet plan:', error);
      toast.error(error.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  // Animate macro bars when diet plan is loaded
  React.useEffect(() => {
    if (dietPlan) {
      const timer1 = setTimeout(() => setMacroProgress(prev => ({ ...prev, protein: true })), 100);
      const timer2 = setTimeout(() => setMacroProgress(prev => ({ ...prev, carbs: true })), 300);
      const timer3 = setTimeout(() => setMacroProgress(prev => ({ ...prev, fat: true })), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [dietPlan]);

  if (!dietPlan) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-2xl gradient-primary mb-6 shadow-glow animate-pulse-glow transition-all duration-300 hover:shadow-glow-lg">
            <Utensils className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2 animate-fade-in">Plan Your Nutrition</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6 animate-fade-in animation-delay-200">
            Get a personalized daily meal plan with macro calculations tailored to your body and goals.
          </p>
          <Button
            onClick={generatePlan}
            disabled={loading}
            className="gradient-primary border-0 hover:opacity-90 transition-all duration-300 hover:shadow-glow text-lg px-8 py-6 animate-fade-in animation-delay-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5 mr-2" />
                Generate Diet Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { dailyPlan, tips } = dietPlan;
  const macros = dailyPlan.totalMacros;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-heading font-bold">Your Diet Plan</h2>
          <p className="text-muted-foreground text-sm">
            Generated on {new Date(dietPlan.generatedAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          onClick={generatePlan}
          disabled={loading}
          variant="outline"
          className="border-primary/50 hover:bg-primary/10 transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Regenerate
        </Button>
      </div>

      {/* Macro Overview */}
      <Card className="border-border/50 shadow-card gradient-card animate-fade-in animation-delay-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-primary transition-transform duration-300 hover:scale-110">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading font-bold text-2xl">{macros.calories}</p>
              <p className="text-sm text-muted-foreground">Daily Calories</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{macros.protein}g</span>
              </div>
              <Progress 
                value={macroProgress.protein ? 33 : 0} 
                className="h-2 bg-muted transition-all duration-1000 ease-out" 
              />
            </div>
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-medium">{macros.carbs}g</span>
              </div>
              <Progress 
                value={macroProgress.carbs ? 45 : 0} 
                className="h-2 bg-muted transition-all duration-1000 ease-out" 
              />
            </div>
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fat</span>
                <span className="font-medium">{macros.fat}g</span>
              </div>
              <Progress 
                value={macroProgress.fat ? 22 : 0} 
                className="h-2 bg-muted transition-all duration-1000 ease-out" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {tips && tips.length > 0 && (
        <Card className="border-warning/30 bg-warning/5 animate-fade-in animation-delay-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning mb-2">Nutrition Tips</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {tips.map((tip, i) => (
                    <li key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meals */}
      <div className="space-y-4">
        {dailyPlan.meals.map((meal, index) => (
          <Card 
            key={index} 
            className="border-border/50 shadow-card overflow-hidden transition-all duration-300 hover:shadow-glow animate-fade-in-up"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                    <Utensils className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold">{meal.meal}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </p>
                  </div>
                </div>
                <Badge className="gradient-primary border-0 transition-all duration-300 hover:shadow-glow">{meal.calories} cal</Badge>
              </div>

              <p className="font-medium mb-2 transition-colors duration-200 hover:text-primary">{meal.name}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {meal.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" className="text-xs transition-all duration-200 hover:scale-105">
                    {ing}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="transition-colors duration-200 hover:text-primary">P: {meal.protein}g</span>
                <span className="transition-colors duration-200 hover:text-primary">C: {meal.carbs}g</span>
                <span className="transition-colors duration-200 hover:text-primary">F: {meal.fat}g</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

import React from 'react';

export default DietPlanView;
