import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { UserProfile, WorkoutPlan } from '@/types/fitness';
import { Loader2, Dumbbell, Clock, RefreshCw, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkoutPlanViewProps {
  profile: UserProfile;
  workoutPlan: WorkoutPlan | null;
  onPlanGenerated: (plan: WorkoutPlan) => void;
}

const WorkoutPlanView = ({ profile, workoutPlan, onPlanGenerated }: WorkoutPlanViewProps) => {
  const [loading, setLoading] = useState(false);

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
    try {
      const customApiKey = getCustomApiKey();
      const { data, error } = await supabase.functions.invoke('ai-trainer', {
        body: {
          type: 'workout',
          userProfile: profile,
          customApiKey,
        },
      });

      if (error) throw error;

      if (data.weeklyPlan) {
        onPlanGenerated({
          ...data,
          generatedAt: new Date().toISOString(),
        });
        toast.success('Workout plan generated successfully!');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error: any) {
      console.error('Error generating workout plan:', error);
      toast.error(error.message || 'Failed to generate workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (!workoutPlan) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-2xl gradient-fire mb-6 shadow-glow animate-pulse-glow">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2">Ready to Start Training?</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Let our AI create a personalized 7-day workout plan tailored to your goals and fitness level.
          </p>
          <Button
            onClick={generatePlan}
            disabled={loading}
            className="gradient-fire border-0 hover:opacity-90 shadow-glow text-lg px-8 py-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Dumbbell className="w-5 h-5 mr-2" />
                Generate Workout Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Your Workout Plan</h2>
          <p className="text-muted-foreground text-sm">
            Generated on {new Date(workoutPlan.generatedAt).toLocaleDateString()}
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

      {workoutPlan.tips && workoutPlan.tips.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning mb-2">Pro Tips</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {workoutPlan.tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible className="space-y-3">
        {workoutPlan.weeklyPlan.map((day, index) => (
          <AccordionItem
            key={index}
            value={`day-${index}`}
            className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-card"
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-lg gradient-fire">
                  <Dumbbell className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-heading font-semibold">{day.day}</div>
                  <div className="text-sm text-muted-foreground">{day.focus}</div>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{day.duration}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-3">
                {day.exercises.map((exercise, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      {exercise.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{exercise.sets} sets</Badge>
                      <Badge variant="secondary">{exercise.reps}</Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        {exercise.rest}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default WorkoutPlanView;
