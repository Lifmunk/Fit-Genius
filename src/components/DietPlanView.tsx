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

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trainer', {
        body: {
          type: 'diet',
          userProfile: profile,
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

  if (!dietPlan) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-2xl gradient-energy mb-6 shadow-glow animate-pulse-glow">
            <Utensils className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2">Plan Your Nutrition</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Get a personalized daily meal plan with macro calculations tailored to your body and goals.
          </p>
          <Button
            onClick={generatePlan}
            disabled={loading}
            className="gradient-energy border-0 hover:opacity-90 shadow-glow text-lg px-8 py-6"
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
      <div className="flex items-center justify-between">
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
          className="border-primary/50 hover:bg-primary/10"
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
      <Card className="border-border/50 shadow-card gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-fire">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading font-bold text-2xl">{macros.calories}</p>
              <p className="text-sm text-muted-foreground">Daily Calories</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{macros.protein}g</span>
              </div>
              <Progress value={33} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-medium">{macros.carbs}g</span>
              </div>
              <Progress value={45} className="h-2 bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fat</span>
                <span className="font-medium">{macros.fat}g</span>
              </div>
              <Progress value={22} className="h-2 bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {tips && tips.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning mb-2">Nutrition Tips</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
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
          <Card key={index} className="border-border/50 shadow-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
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
                <Badge className="gradient-fire border-0">{meal.calories} cal</Badge>
              </div>

              <p className="font-medium mb-2">{meal.name}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {meal.ingredients.map((ing, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {ing}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>P: {meal.protein}g</span>
                <span>C: {meal.carbs}g</span>
                <span>F: {meal.fat}g</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DietPlanView;
