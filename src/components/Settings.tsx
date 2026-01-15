import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/types/fitness';
import { Save, Key, User, ArrowLeft, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onBack: () => void;
}

const Settings = ({ profile, onProfileUpdate, onBack }: SettingsProps) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [customApiKey, setCustomApiKey] = useLocalStorage<string>('fitgenius-gemini-api-key', '');
  const [useCustomApi, setUseCustomApi] = useLocalStorage<boolean>('fitgenius-use-custom-api', false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);

  const handleProfileSave = () => {
    onProfileUpdate(formData);
    toast.success('Profile updated successfully!');
  };

  const handleApiKeySave = () => {
    setCustomApiKey(tempApiKey);
    toast.success('API key saved successfully!');
  };

  const handleClearApiKey = () => {
    setTempApiKey('');
    setCustomApiKey('');
    setUseCustomApi(false);
    toast.success('API key cleared');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gradient">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your profile and preferences</p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details and fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="bg-background flex-1"
                  />
                  <Select
                    value={formData.weightUnit}
                    onValueChange={(value: 'kg' | 'lbs') => setFormData({ ...formData, weightUnit: value })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                    className="bg-background flex-1"
                  />
                  <Select
                    value={formData.heightUnit}
                    onValueChange={(value: 'cm' | 'ft') => setFormData({ ...formData, heightUnit: value })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female' | 'other') => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value: 'lose' | 'gain' | 'maintain' | 'build') => setFormData({ ...formData, goal: value })}
                >
                  <SelectTrigger className="bg-background">
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

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFormData({ ...formData, fitnessLevel: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive') => setFormData({ ...formData, activityLevel: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="veryActive">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Available Equipment</Label>
              <Textarea
                id="equipment"
                value={formData.equipment || ''}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="e.g., Dumbbells, Resistance bands, Pull-up bar..."
                className="bg-background resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Preferences</Label>
              <Textarea
                id="dietary"
                value={formData.dietaryPreferences || ''}
                onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                placeholder="e.g., Vegetarian, High-protein, Low-carb..."
                className="bg-background resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies / Restrictions</Label>
              <Textarea
                id="allergies"
                value={formData.allergies || ''}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g., Peanuts, Lactose intolerant..."
                className="bg-background resize-none"
                rows={2}
              />
            </div>

            <Button onClick={handleProfileSave} className="w-full gradient-fire">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* API Key Settings */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Custom Gemini API Key
            </CardTitle>
            <CardDescription>
              Use your own free Gemini API key for unlimited requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="use-custom-api">Use Custom API Key</Label>
                <p className="text-xs text-muted-foreground">
                  Enable to use your own Gemini API key instead of built-in
                </p>
              </div>
              <Switch
                id="use-custom-api"
                checked={useCustomApi}
                onCheckedChange={setUseCustomApi}
              />
            </div>

            {useCustomApi && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api-key">Gemini API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key..."
                      className="bg-background pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key at{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleApiKeySave} className="flex-1 gradient-fire">
                    <Save className="w-4 h-4 mr-2" />
                    Save API Key
                  </Button>
                  {customApiKey && (
                    <Button variant="outline" onClick={handleClearApiKey}>
                      Clear
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
