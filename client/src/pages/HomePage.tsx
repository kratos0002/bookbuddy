import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedBookSection from '../components/home/FeaturedBookSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CombinedCTASection from '../components/home/CombinedCTASection';
import Footer from '../components/home/Footer';
import FeedbackChatbot from '../components/feedback/FeedbackChatbot';

const HomePage = () => {
  return (
    <div className="bg-background min-h-screen relative">
      {/* Hero Section with clear value proposition */}
      <HeroSection />
      
      {/* Featured Books - direct access to conversations */}
      <FeaturedBookSection />
      
      {/* How It Works - simplified 3-step process */}
      <HowItWorksSection />
      
      {/* CTA Section - for conversions */}
      <CombinedCTASection />
      
      {/* Footer */}
      <Footer />
      
      {/* Add FeedbackChatbot directly to HomePage */}
      <FeedbackChatbot />
    </div>
  );
};

export default HomePage;
