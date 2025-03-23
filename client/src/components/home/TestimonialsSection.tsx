import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  imageSrc?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "BookBuddy transformed how I study literature. It's like having a conversation with the author and characters that brings deeper understanding than just reading alone.",
    author: "Sarah Chen",
    role: "English Literature Student",
  },
  {
    id: 2,
    quote: "I've always loved classic literature but sometimes struggled to fully grasp certain themes. The character conversations in BookBuddy illuminate perspectives I never considered before.",
    author: "Michael Torres",
    role: "Book Club Organizer",
  },
  {
    id: 3,
    quote: "Teaching Orwell's 1984 has never been more engaging for my students. They're having meaningful discussions with characters that deepen their critical thinking skills.",
    author: "Dr. Emily Johnson",
    role: "High School English Teacher",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-[#1a3a5f]/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b2439]/20 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b2439]/20 to-transparent"></div>
      
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7d8c75]/10 rounded-full"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-[#8b2439]/10 rounded-full"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#1a3a5f]">
            Transforming Reading Experiences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how readers are moving beyond passive consumption to active literary engagement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden border border-[#f8f0e3]"
            >
              {/* Quotation mark decoration */}
              <div className="absolute top-6 right-6">
                <Quote className="h-12 w-12 text-[#8b2439]/10" />
              </div>
              
              {/* Testimonial content */}
              <div className="mb-6 relative z-10">
                <p className="italic text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
              </div>
              
              {/* Author info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a3a5f]/10 flex items-center justify-center">
                  {testimonial.imageSrc ? (
                    <img 
                      src={testimonial.imageSrc} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-[#1a3a5f] font-serif font-bold text-lg">
                      {testimonial.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#1a3a5f]">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 