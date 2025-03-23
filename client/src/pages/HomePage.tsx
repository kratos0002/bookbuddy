
import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedBookSection from '../components/home/FeaturedBookSection';
import ComingSoonBooksSection from '../components/home/ComingSoonBooksSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import ValuePropositionSection from '../components/home/ValuePropositionSection';
import CTASection from '../components/home/CTASection';
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
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Footer */}
        <Footer />
      </div>
    </Layout>
  );
};

export default HomePage;
