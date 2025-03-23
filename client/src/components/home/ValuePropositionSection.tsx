
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

const ValuePropositionSection = () => {
  const valueProps = [
    {
      icon: <GraduationCap className="h-8 w-8 text-book-primary" />,
      title: "For Students",
      description: "Gain deeper insights for essays and analysis. Explore themes and character motivations directly from the source."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-book-primary" />,
      title: "For Book Lovers",
      description: "See your favorite books from new perspectives. Engage with characters in a way that brings stories to life."
    },
    {
      icon: <Users className="h-8 w-8 text-book-primary" />,
      title: "For Casual Readers",
      description: "Make literature interactive and accessible. Discover classic works in a more engaging format."
    }
  ];

  return (
    <section className="px-4 py-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-book-primary/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-center mb-4">Why BookBuddy?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          BookBuddy offers a unique way to engage with literature for all types of readers.
        </p>
        
        <Carousel className="w-full">
          <CarouselContent>
            {valueProps.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card className="transition-all duration-300 hover:shadow-md h-full">
                    <CardHeader className="pb-2 flex flex-col items-center">
                      <div className="mb-4">{item.icon}</div>
                      <CardTitle className="text-center">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Example conversation preview */}
        <div className="mt-16 p-6 border border-dashed border-book-primary/30 rounded-lg bg-book-primary/5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-4 text-sm font-medium text-book-primary">
            Sample Conversation
          </div>
          
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            <div className="bg-background rounded-lg p-4 shadow-sm ml-auto max-w-[80%] md:max-w-[60%]">
              <p className="text-sm font-medium">What did the glass paperweight symbolize for Winston?</p>
            </div>
            
            <div className="bg-book-primary/10 rounded-lg p-4 shadow-sm max-w-[80%] md:max-w-[60%]">
              <p className="text-sm">The glass paperweight symbolized the past that Winston was trying to connect with, a world before the Party. It represented beauty, fragility, and a tangible connection to history that the Party was trying to erase.</p>
            </div>
            
            <div className="bg-background rounded-lg p-4 shadow-sm ml-auto max-w-[80%] md:max-w-[60%]">
              <p className="text-sm font-medium">Why was it significant when it broke?</p>
            </div>
            
            <div className="bg-book-primary/10 rounded-lg p-4 shadow-sm max-w-[80%] md:max-w-[60%]">
              <p className="text-sm">When the paperweight shattered during Winston and Julia's arrest, it symbolized the destruction of Winston's hope and connection to the past. Just as the paperweight was destroyed, so too was Winston's rebellion against the Party.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
