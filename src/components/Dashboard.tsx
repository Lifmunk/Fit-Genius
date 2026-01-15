import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile, WorkoutPlan, DietPlan, ProgressEntry, ChatMessage } from '@/types/fitness';
import { Dumbbell, Utensils, TrendingUp, MessageSquare, User, LogOut, Flame, Target, Calendar, Settings as SettingsIcon } from 'lucide-react';
import WorkoutPlanView from './WorkoutPlanView';
import DietPlanView from './DietPlanView';
import ProgressTracker from './ProgressTracker';
import AIChat from './AIChat';
import Settings from './Settings';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

const Dashboard = ({ profile, onProfileUpdate, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('workout');
  const [showSettings, setShowSettings] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useLocalStorage<WorkoutPlan | null>('fitgenius-workout', null);
  const [dietPlan, setDietPlan] = useLocalStorage<DietPlan | null>('fitgenius-diet', null);
  const [progress, setProgress] = useLocalStorage<ProgressEntry[]>('fitgenius-progress', []);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('fitgenius-chat', []);

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      lose: 'Weight Loss',
      gain: 'Weight Gain',
      maintain: 'Maintenance',
      build: 'Muscle Building',
    };
    return labels[goal] || goal;
  };

  const calculateBMI = () => {
    const weightKg = profile.weightUnit === 'lbs' ? profile.weight * 0.453592 : profile.weight;
    const heightM = profile.heightUnit === 'ft' ? profile.height * 0.3048 : profile.height / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  if (showSettings) {
    return (
      <Settings
        profile={profile}
        onProfileUpdate={onProfileUpdate}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50 theme-transition">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2 rounded-xl gradient-primary shadow-glow transition-all duration-300 hover:shadow-glow-lg">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient">FitGenius</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground">
              <User className="w-4 h-4" />
              <span>{profile.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(true)} 
              className="text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout} 
              className="text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 shadow-card card-hover transition-all duration-300 animate-fade-in-up animation-delay-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goal</p>
                  <p className="font-heading font-semibold">{getGoalLabel(profile.goal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card card-hover transition-all duration-300 animate-fade-in-up animation-delay-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 transition-transform duration-300 hover:scale-110">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BMI</p>
                  <p className="font-heading font-semibold">{calculateBMI()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card card-hover transition-all duration-300 animate-fade-in-up animation-delay-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10 transition-transform duration-300 hover:scale-110">
                  <Flame className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-heading font-semibold">{profile.weight} {profile.weightUnit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-card card-hover transition-all duration-300 animate-fade-in-up animation-delay-400">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 transition-transform duration-300 hover:scale-110">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Workouts</p>
                  <p className="font-heading font-semibold">
                    {progress.filter(p => p.workoutsCompleted).reduce((a, b) => a + (b.workoutsCompleted || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-card border border-border/50 p-1 h-auto">
            <TabsTrigger
              value="workout"
              className="flex items-center gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Workout</span>
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="flex items-center gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex items-center gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2 py-3 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Coach</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="animate-fade-in">
            <WorkoutPlanView
              profile={profile}
              workoutPlan={workoutPlan}
              onPlanGenerated={setWorkoutPlan}
            />
          </TabsContent>

          <TabsContent value="diet" className="animate-fade-in">
            <DietPlanView
              profile={profile}
              dietPlan={dietPlan}
              onPlanGenerated={setDietPlan}
            />
          </TabsContent>

          <TabsContent value="progress" className="animate-fade-in">
            <ProgressTracker
              profile={profile}
              progress={progress}
              onProgressUpdate={setProgress}
            />
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <AIChat
              profile={profile}
              chatHistory={chatHistory}
              onChatUpdate={setChatHistory}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
