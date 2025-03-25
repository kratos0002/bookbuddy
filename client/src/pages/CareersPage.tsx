import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CareersPage = () => {
  const openPositions = [
    {
      title: "AI Research Engineer",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to help develop and improve our AI-powered book discussion platform. You'll work on enhancing our character interactions, improving conversation quality, and developing new features."
    },
    {
      title: "Full Stack Developer",
      location: "Remote",
      type: "Full-time",
      description: "Help build and maintain our web application. Work with modern technologies including React, TypeScript, and Node.js to create engaging user experiences."
    },
    {
      title: "Content Curator",
      location: "Remote",
      type: "Part-time",
      description: "Help us expand our library of books and improve the quality of our character interactions. Strong literature background required."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#8b2439] mb-6">Join Our Team</h1>
        
        <div className="prose mb-8">
          <p className="text-lg text-gray-700">
            At BookBuddy, we're passionate about making literature more accessible and engaging through 
            innovative AI technology. We're looking for talented individuals who share our vision of 
            transforming how people interact with books and their favorite characters.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
        
        <div className="grid gap-6">
          {openPositions.map((position, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>{position.location}</span>
                <span>•</span>
                <span>{position.type}</span>
              </div>
              <p className="text-gray-700 mb-4">{position.description}</p>
              <Button 
                className="bg-[#8b2439] hover:bg-[#6d1c2d] text-white"
                onClick={() => window.location.href = 'mailto:careers@bookbuddy.ai'}
              >
                Apply Now
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Don't see a perfect fit?</h2>
          <p className="text-gray-700 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume 
            and tell us how you can contribute to BookBuddy's mission.
          </p>
          <Button 
            className="bg-[#8b2439] hover:bg-[#6d1c2d] text-white"
            onClick={() => window.location.href = 'mailto:careers@bookbuddy.ai'}
          >
            Submit Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage; 