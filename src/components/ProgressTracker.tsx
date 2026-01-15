import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, ProgressEntry } from '@/types/fitness';
import { Plus, TrendingUp, TrendingDown, Minus, Calendar, Dumbbell, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressTrackerProps {
  profile: UserProfile;
  progress: ProgressEntry[];
  onProgressUpdate: (progress: ProgressEntry[]) => void;
}

const ProgressTracker = ({ profile, progress, onProgressUpdate }: ProgressTrackerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddEntry = () => {
    if (!newEntry.weight && !newEntry.workoutsCompleted && !newEntry.notes) {
      toast.error('Please fill in at least one field');
      return;
    }

    const entry: ProgressEntry = {
      date: newEntry.date || new Date().toISOString().split('T')[0],
      weight: newEntry.weight,
      workoutsCompleted: newEntry.workoutsCompleted,
      notes: newEntry.notes,
    };

    const updated = [...progress, entry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    onProgressUpdate(updated);
    setNewEntry({ date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    toast.success('Progress logged successfully!');
  };

  const getTrend = () => {
    const weightEntries = progress.filter(p => p.weight).slice(-7);
    if (weightEntries.length < 2) return null;
    
    const first = weightEntries[0].weight!;
    const last = weightEntries[weightEntries.length - 1].weight!;
    const diff = last - first;
    
    return { diff, percentage: ((diff / first) * 100).toFixed(1) };
  };

  const trend = getTrend();
  const chartData = progress
    .filter(p => p.weight)
    .map(p => ({
      date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: p.weight,
    }));

  const totalWorkouts = progress.reduce((sum, p) => sum + (p.workoutsCompleted || 0), 0);
  const currentWeight = progress.filter(p => p.weight).pop()?.weight || profile.weight;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">Track Your Progress</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gradient-fire border-0 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Progress
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-heading font-bold">
                  {currentWeight} {profile.weightUnit}
                </p>
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-sm ${
                  trend.diff > 0 ? 'text-warning' : trend.diff < 0 ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {trend.diff > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : trend.diff < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span>{Math.abs(parseFloat(trend.percentage))}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Dumbbell className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-heading font-bold">{totalWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entries Logged</p>
                <p className="text-2xl font-heading font-bold">{progress.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card className="border-primary/30 shadow-card animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Log Today's Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight ({profile.weightUnit})</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder={`${profile.weight}`}
                  value={newEntry.weight || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) || undefined })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="workouts">Workouts Completed</Label>
                <Input
                  id="workouts"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={newEntry.workoutsCompleted || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, workoutsCompleted: parseInt(e.target.value) || undefined })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did you feel today?"
                value={newEntry.notes || ''}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddEntry} className="gradient-fire border-0">
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {progress.length > 0 && (
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...progress].reverse().slice(0, 10).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {entry.weight && (
                      <span className="text-muted-foreground">
                        {entry.weight} {profile.weightUnit}
                      </span>
                    )}
                    {entry.workoutsCompleted && (
                      <span className="text-success">
                        {entry.workoutsCompleted} workout{entry.workoutsCompleted > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {progress.length === 0 && !showForm && (
        <Card className="border-border/50 shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-2xl bg-muted mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              No progress entries yet. Start logging to see your journey!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;
