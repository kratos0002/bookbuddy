import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedBookSection from '../components/home/FeaturedBookSection';
import ComingSoonBooksSection from '../components/home/ComingSoonBooksSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import ValuePropositionSection from '../components/home/ValuePropositionSection';
import CombinedCTASection from '../components/home/CombinedCTASection';
import Footer from '../components/home/Footer';

const HomePage = () => {
  return (
    <Layout>
      <div className="w-full">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Book */}
        <FeaturedBookSection />
        
        {/* Coming Soon Books */}
        <ComingSoonBooksSection />
        
        {/* How It Works */}
        <HowItWorksSection />
        
        {/* Value Proposition */}
        <ValuePropositionSection />
        
        {/* Combined CTA Section */}
        <CombinedCTASection />
        
        {/* Footer */}
        <Footer />
      </div>
    </Layout>
  );
};

export default HomePage;
