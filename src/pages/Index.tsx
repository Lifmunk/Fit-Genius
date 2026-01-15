import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfile } from '@/types/fitness';
import OnboardingForm from '@/components/OnboardingForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('fitgenius-profile', null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserProfile(null);
  };

  if (!userProfile) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard profile={userProfile} onLogout={handleLogout} />;
};

export default Index;
