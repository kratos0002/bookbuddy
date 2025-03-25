import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ThumbsUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface BookSuggestion {
  title: string;
  submittedAt: string;
  votes: number;
}

const BookSuggestionSection = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topSuggestions, setTopSuggestions] = useState<BookSuggestion[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch top suggestions when component mounts
  useEffect(() => {
    fetchTopSuggestions();
  }, []);

  const fetchTopSuggestions = async () => {
    try {
      const response = await fetch('/api/book-suggestions');
      if (response.ok) {
        const data = await response.json();
        setTopSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching book suggestions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookTitle.trim()) {
      toast.error('Please enter a book title');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/book-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: bookTitle.trim() })
      });
      
      if (response.ok) {
        const result = await response.json();
        setBookTitle('');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        toast.success('Thank you for your suggestion!');
        
        // Refresh the list of top suggestions
        fetchTopSuggestions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit suggestion');
      }
    } catch (error) {
      console.error('Error submitting book suggestion:', error);
      toast.error('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-20 bg-[#f8f0e3]/30 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b2439]/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#1a3a5f]">Expanding Our Library</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're bringing more literary worlds to life. Help us decide which books to add next!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          {/* Image Collage Area */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#f8f0e3] p-4 transform hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-serif font-bold mb-4 text-[#1a3a5f]">A Reader's Paradise</h3>
            <div className="aspect-video relative overflow-hidden rounded-lg group">
              <img 
                src="/bookstore-reader.jpg" 
                alt="A reader surrounded by stacks of books in a cozy bookstore"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#1a3a5f]/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>
            <p className="text-gray-600 mt-4 text-sm italic">
              "In the quiet corners of a bookstore, every reader finds their story."
            </p>
          </div>
          
          {/* Suggestion Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#f8f0e3] p-6">
            <h3 className="text-xl font-serif font-bold mb-4 text-[#1a3a5f]">Suggest a Book</h3>
            <p className="text-gray-600 mb-6">
              Which book would you like to have conversations with next? Let us know and we'll consider adding it to our library.
            </p>
            
            {showSuccessMessage && (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  Thank you for your suggestion! We've recorded your request.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter book title"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="border-[#8b2439]/20 focus-visible:ring-[#8b2439]/30"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#8b2439] hover:bg-[#8b2439]/90 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            {topSuggestions.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-700 mb-3">Popular Suggestions:</h4>
                <ul className="space-y-2">
                  {topSuggestions.slice(0, 5).map((suggestion, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between bg-[#f8f0e3]/50 p-2 rounded-md"
                    >
                      <span className="text-gray-800">{suggestion.title}</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1 text-[#8b2439]" />
                        {suggestion.votes}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm italic">
            "The more that you read, the more things you will know. The more that you learn, the more places you'll go." - Dr. Seuss
          </p>
        </div>
      </div>
      
      <Toaster position="top-center" />
    </section>
  );
};

export default BookSuggestionSection; 