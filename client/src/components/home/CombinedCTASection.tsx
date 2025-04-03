import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CombinedCTASection: React.FC = () => {
  return (
    <section className="py-16 bg-[#1a3a5f] text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Ready to Experience Books in a New Way?</h2>
          <p className="text-[#f8f0e3]/90 mb-10 max-w-2xl mx-auto">
            Move beyond reading to having meaningful conversations with characters that deepen your understanding and connection to classic literature.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/conversation">
              <Button className="bg-[#8b2439] hover:bg-[#8b2439]/90 text-white px-8 py-6 text-lg">
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/book/1">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Explore Available Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombinedCTASection; 