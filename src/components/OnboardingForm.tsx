import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/fitness';
import { Dumbbell, Target, Activity, User } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    weightUnit: 'kg',
    heightUnit: 'cm',
    gender: 'male',
    goal: 'maintain',
    fitnessLevel: 'beginner',
    activityLevel: 'moderate',
  });

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (profile.name && profile.weight && profile.height && profile.age) {
      onComplete(profile as UserProfile);
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setDirection('forward');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setDirection('backward');
    setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.age && profile.gender;
      case 2:
        return profile.weight && profile.height;
      case 3:
        return profile.goal && profile.fitnessLevel;
      default:
        return true;
    }
  };

  const getStepAnimation = () => {
    if (direction === 'forward') {
      return 'animate-slide-in-left';
    }
    return 'animate-slide-in-right';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 theme-transition">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-glow transition-all duration-300 hover:shadow-glow-lg hover:scale-105 cursor-pointer">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            <span className="text-gradient">FitGenius</span> AI
          </h1>
          <p className="text-muted-foreground">Your personal AI fitness coach</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-all duration-500 ${
                s < step ? 'gradient-primary' : s === step ? 'gradient-primary animate-pulse-glow' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="border-border/50 shadow-card animate-fade-in-scale">
          <CardContent className="p-6">
            <div className={`space-y-6 ${getStepAnimation()}`}>
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold">Basic Info</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={profile.name || ''}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={profile.age || ''}
                        onChange={(e) => updateProfile('age', parseInt(e.target.value) || 0)}
                        className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <Select value={profile.gender} onValueChange={(v) => updateProfile('gender', v)}>
                        <SelectTrigger className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold">Body Measurements</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={profile.weight || ''}
                          onChange={(e) => updateProfile('weight', parseFloat(e.target.value) || 0)}
                          className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select value={profile.weightUnit} onValueChange={(v) => updateProfile('weightUnit', v)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          value={profile.height || ''}
                          onChange={(e) => updateProfile('height', parseFloat(e.target.value) || 0)}
                          className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select value={profile.heightUnit} onValueChange={(v) => updateProfile('heightUnit', v)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Activity Level</Label>
                      <Select value={profile.activityLevel} onValueChange={(v) => updateProfile('activityLevel', v)}>
                        <SelectTrigger className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                          <SelectItem value="active">Very Active (6-7 days/week)</SelectItem>
                          <SelectItem value="veryActive">Extra Active (athlete)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold">Fitness Goals</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Primary Goal</Label>
                      <Select value={profile.goal} onValueChange={(v) => updateProfile('goal', v)}>
                        <SelectTrigger className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">Lose Weight</SelectItem>
                          <SelectItem value="gain">Gain Weight</SelectItem>
                          <SelectItem value="maintain">Maintain Weight</SelectItem>
                          <SelectItem value="build">Build Muscle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fitness Level</Label>
                      <Select value={profile.fitnessLevel} onValueChange={(v) => updateProfile('fitnessLevel', v)}>
                        <SelectTrigger className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (new to exercise)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (some experience)</SelectItem>
                          <SelectItem value="advanced">Advanced (experienced)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold">Additional Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="equipment">Available Equipment (optional)</Label>
                      <Input
                        id="equipment"
                        placeholder="e.g., Dumbbells, Pull-up bar, Gym access"
                        value={profile.equipment || ''}
                        onChange={(e) => updateProfile('equipment', e.target.value)}
                        className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dietary">Dietary Preferences (optional)</Label>
                      <Input
                        id="dietary"
                        placeholder="e.g., Vegetarian, Vegan, Keto"
                        value={profile.dietaryPreferences || ''}
                        onChange={(e) => updateProfile('dietaryPreferences', e.target.value)}
                        className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergies">Food Allergies (optional)</Label>
                      <Input
                        id="allergies"
                        placeholder="e.g., Nuts, Dairy, Gluten"
                        value={profile.allergies || ''}
                        onChange={(e) => updateProfile('allergies', e.target.value)}
                        className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 transition-all duration-200 hover:bg-primary/10"
                  >
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-all duration-300 hover:shadow-glow"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 gradient-primary border-0 hover:opacity-90 transition-all duration-300 hover:shadow-glow shadow-glow"
                  >
                    Start My Journey
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingForm;
