import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfile } from '@/types/fitness';
import OnboardingForm from '@/components/OnboardingForm';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

const Index = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('fitgenius-profile', null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserProfile(null);
  };

  // Show landing page first, then onboarding or dashboard
  return <LandingPage />;
};

export default Index;
