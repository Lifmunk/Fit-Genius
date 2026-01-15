import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingForm from "@/components/OnboardingForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserProfile } from "@/types/fitness";
import Dashboard from "@/components/Dashboard";

// Component to handle get-started route with conditional rendering
const GetStartedPage = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('fitgenius-profile', null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  if (userProfile) {
    return <Dashboard profile={userProfile} onProfileUpdate={setUserProfile} onLogout={() => setUserProfile(null)} />;
  }

  return <OnboardingForm onComplete={handleOnboardingComplete} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
