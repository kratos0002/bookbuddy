import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedBookSection from '../components/home/FeaturedBookSection';
import ComingSoonBooksSection from '../components/home/ComingSoonBooksSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import ValuePropositionSection from '../components/home/ValuePropositionSection';
import CombinedCTASection from '../components/home/CombinedCTASection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Footer from '../components/home/Footer';

const HomePage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with new design */}
      <HeroSection />
      
      {/* How It Works - moved up to explain the concept early */}
      <HowItWorksSection />
      
      {/* Value Proposition - explains why users should care */}
      <ValuePropositionSection />
      
      {/* Testimonials - new section for social proof */}
      <TestimonialsSection />
      
      {/* Featured Book Section */}
      <FeaturedBookSection />
      
      {/* CTA Section - for conversions */}
      <CombinedCTASection />
      
      {/* Coming Soon - showing future catalog */}
      <ComingSoonBooksSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
