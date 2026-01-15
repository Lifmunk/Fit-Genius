import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Activity, 
  Utensils, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Play,
  Dumbbell,
  Heart,
  Brain,
  ChevronRight,
  Star,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Workouts",
    description: "Personalized exercise routines tailored to your fitness level, goals, and available equipment.",
    gradient: "from-orange-500 to-red-500",
    delay: "animation-delay-100"
  },
  {
    icon: Utensils,
    title: "Smart Diet Plans",
    description: "Nutrition recommendations based on your dietary preferences, allergies, and calorie needs.",
    gradient: "from-green-500 to-emerald-500",
    delay: "animation-delay-200"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your fitness journey with detailed charts, measurements, and milestone celebrations.",
    gradient: "from-blue-500 to-cyan-500",
    delay: "animation-delay-300"
  },
  {
    icon: Heart,
    title: "Health Insights",
    description: "Advanced analytics and health recommendations powered by machine learning algorithms.",
    gradient: "from-purple-500 to-pink-500",
    delay: "animation-delay-400"
  }
];

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Tell us about yourself - your goals, preferences, fitness level, and any constraints.",
    icon: Users
  },
  {
    number: "02",
    title: "Get AI Recommendations",
    description: "Our AI analyzes your profile to create personalized workout and meal plans just for you.",
    icon: Sparkles
  },
  {
    number: "03",
    title: "Track & Improve",
    description: "Log your workouts, meals, and progress. Watch as AI adapts to help you succeed.",
    icon: Activity
  }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Lost 30 lbs",
    avatar: "SM",
    rating: 5,
    content: "AI Fit Buddy completely transformed my fitness journey. The personalized workouts feel like having a trainer in my pocket!",
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "James Rodriguez",
    role: "Muscle Gain",
    avatar: "JR",
    rating: 5,
    content: "The AI understands my progress and adjusts my workout intensity perfectly. Best fitness app I've ever used.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Emily Chen",
    role: "Marathon Prep",
    avatar: "EC",
    rating: 5,
    content: "Training for my first marathon was seamless. The nutrition plans and gradual progression were exactly what I needed.",
    gradient: "from-green-500 to-emerald-500"
  }
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "2M+", label: "Workouts Completed" },
  { value: "98%", label: "Goal Success Rate" },
  { value: "4.9", label: "App Store Rating" }
];

const FloatingShape = ({ className, delay }: { className: string; delay?: string }) => (
  <div 
    className={`absolute rounded-full blur-3xl opacity-20 animate-float ${delay || ''} ${className}`}
  />
);

const GradientOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[100px] opacity-30 ${className}`} />
);

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-b border-border/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">AI Fit Buddy</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/get-started">
                <Button className="gradient-primary hover:opacity-90 transition-opacity">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <GradientOrb className="bg-gradient-to-r from-orange-500/30 to-red-500/30 w-[600px] h-[600px] top-[-200px] left-[-200px]" />
        <GradientOrb className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 w-[500px] h-[500px] bottom-[-100px] right-[-100px]" />
        
        <FloatingShape className="w-72 h-72 bg-gradient-to-r from-orange-500 to-red-500 top-20 right-[10%]" delay="animation-delay-100" />
        <FloatingShape className="w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 bottom-20 left-[5%]" delay="animation-delay-300" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powered by Advanced AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              Your Personal AI
              <br />
              <span className="text-gradient">Fitness Coach</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
              Transform your fitness journey with AI-powered workout plans, personalized nutrition guidance, and real-time progress tracking.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
              <Link to="/get-started">
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-all hover:scale-105 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-4xl mx-auto animate-fade-in-up animation-delay-500">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                <div className="aspect-video bg-gradient-to-br from-card via-card to-secondary flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-6 p-8 w-full max-w-2xl">
                    {/* Dashboard Preview Cards */}
                    <Card className="col-span-1 bg-card/80 backdrop-blur border-primary/20 card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="w-5 h-5 text-primary" />
                          <span className="font-semibold">Today's Workout</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 gradient-primary animate-shimmer" />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>75% Complete</span>
                            <span>320 cal</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2 bg-card/80 backdrop-blur border-primary/20 card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Dumbbell className="w-5 h-5 text-green-500" />
                          <span className="font-semibold">AI Workout Plan</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['Strength', 'Cardio', 'Flexibility'].map((item, i) => (
                            <div key={item} className="bg-secondary/50 rounded-lg p-2 text-center">
                              <span className="text-xs text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2 bg-card/80 backdrop-blur border-primary/20 card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Utensils className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold">Meal Plan</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Breakfast: Oatmeal & Berries</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>Lunch: Grilled Chicken Salad</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-1 bg-card/80 backdrop-blur border-primary/20 card-hover">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-2 animate-pulse-glow">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-lg font-bold">+12%</span>
                        <span className="text-xs text-muted-foreground">This Week</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`group relative bg-card/50 backdrop-blur border-border/50 overflow-hidden card-hover ${
                  isLoaded ? 'opacity-100 animate-stagger-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: index * 100 }}
              >
                <CardContent className="p-6 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              How <span className="text-gradient">AI Fit Buddy</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy. In just 3 simple steps, you'll have your personalized fitness plan ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`relative ${index !== steps.length - 1 ? 'hidden md:block' : ''}`}
              >
                <div className={`text-center ${isLoaded ? 'opacity-100 animate-stagger-fade-in' : 'opacity-0'}`}
                     style={{ animationDelay: index * 150 }}>
                  {/* Step Number */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse-glow" />
                    <span className="text-3xl font-heading font-bold text-gradient">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-heading font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow Connector */}
                {index !== steps.length - 1 && (
                  <div className="hidden md:flex absolute top-10 left-1/2 -translate-x-1/2 items-center">
                    <ChevronRight className="w-8 h-8 text-primary/30 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA for How It Works */}
          <div className="text-center mt-12">
            <Link to="/get-started">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center ${isLoaded ? 'opacity-100 animate-stagger-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: index * 100 }}
              >
                <div className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with AI Fit Buddy.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold ${
                    isLoaded ? 'animate-fade-in' : 'opacity-0'
                  }`}>
                    {testimonials[activeTestimonial].avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Rating */}
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative mb-4">
                      <Quote className="w-10 h-10 text-primary/20 absolute -top-2 -left-2" />
                      <p className="text-lg md:text-xl text-foreground relative z-10 leading-relaxed">
                        "{testimonials[activeTestimonial].content}"
                      </p>
                    </div>

                    {/* Author */}
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[activeTestimonial].role}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-primary w-8' 
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <GradientOrb className="bg-gradient-to-r from-orange-500/20 to-red-500/20 w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`relative bg-card/50 backdrop-blur-lg rounded-3xl border border-border/50 p-8 md:p-16 shadow-2xl shadow-primary/10 ${
            isLoaded ? 'opacity-100 animate-fade-in-scale' : 'opacity-0'
          }`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Ready to Transform
              <br />
              <span className="text-gradient">Your Fitness?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already achieved their fitness goals with AI Fit Buddy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-all hover:scale-105 w-full sm:w-auto group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-heading font-bold">AI Fit Buddy</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your AI-powered fitness companion for a healthier lifestyle.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Fit Buddy. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

