import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ThumbsUp, AlertCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Types for our chat messages
type MessageType = 'bot' | 'user';
type FeedbackType = 'bug' | 'feature' | 'feedback' | null;

interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

interface BotMessage {
  content: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  waitForResponse?: boolean;
}

const INITIAL_MESSAGES: BotMessage[] = [
  {
    content: "👋 Hi there! I'm your Book Buddy assistant. I'd love to hear your thoughts about our platform. What kind of feedback would you like to share today?",
    options: [
      { label: "Report a Bug", value: "bug", icon: <AlertCircle className="h-4 w-4" /> },
      { label: "Suggest a Feature", value: "feature", icon: <Lightbulb className="h-4 w-4" /> },
      { label: "Share General Feedback", value: "feedback", icon: <ThumbsUp className="h-4 w-4" /> }
    ],
  }
];

const FEEDBACK_FOLLOW_UP: Record<string, BotMessage[]> = {
  bug: [
    {
      content: "I'm sorry to hear you encountered an issue. Could you please describe what happened?",
      waitForResponse: true
    },
    {
      content: "Thank you for that detail. Where in the app did this occur?",
      waitForResponse: true
    },
    {
      content: "Got it. Is there anything else about this bug you'd like to share, like steps to reproduce it?",
      waitForResponse: true
    }
  ],
  feature: [
    {
      content: "Great! We love new ideas. What feature would you like to see added to Book Buddy?",
      waitForResponse: true
    },
    {
      content: "Thanks for sharing! How would this feature improve your experience with Book Buddy?",
      waitForResponse: true
    },
    {
      content: "Is there anything else you'd like to add about this feature suggestion?",
      waitForResponse: true
    }
  ],
  feedback: [
    {
      content: "We appreciate your feedback! Please share your thoughts about your experience with Book Buddy.",
      waitForResponse: true
    },
    {
      content: "Thank you! What aspects of Book Buddy do you enjoy the most?",
      waitForResponse: true
    },
    {
      content: "Is there anything specific you think we could improve?",
      waitForResponse: true
    }
  ]
};

const THANK_YOU_MESSAGE: BotMessage = {
  content: "Thank you so much for your valuable feedback! It will help us improve Book Buddy. Is there anything else you'd like to share?",
  options: [
    { label: "Yes, I have more feedback", value: "more" },
    { label: "No, that's all for now", value: "done" }
  ]
};

export const FeedbackChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(0);
  const [currentFeedbackType, setCurrentFeedbackType] = useState<FeedbackType>(null);
  const [feedbackData, setFeedbackData] = useState<Record<string, string[]>>({
    bug: [],
    feature: [],
    feedback: []
  });
  const [feedbackStage, setFeedbackStage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat with bot greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(INITIAL_MESSAGES[0].content);
    }
  }, [isOpen]);

  // Auto-scroll to the latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, type: MessageType) => {
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now().toString(), 
        content, 
        type, 
        timestamp: new Date() 
      }
    ]);
  };

  const addBotMessage = (content: string) => {
    // Add a small delay to simulate bot thinking
    setTimeout(() => {
      addMessage(content, 'bot');
    }, 500);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    const userInput = currentInput.trim();
    addMessage(userInput, 'user');
    setCurrentInput('');

    if (currentFeedbackType) {
      // Store the response
      setFeedbackData(prev => ({
        ...prev,
        [currentFeedbackType]: [
          ...prev[currentFeedbackType],
          userInput
        ]
      }));

      // Advance in the conversation
      if (feedbackStage < FEEDBACK_FOLLOW_UP[currentFeedbackType].length - 1) {
        // Still have more follow-up questions
        setFeedbackStage(prev => prev + 1);
        addBotMessage(FEEDBACK_FOLLOW_UP[currentFeedbackType][feedbackStage + 1].content);
      } else {
        // End of follow-up questions, send thank you
        addBotMessage(THANK_YOU_MESSAGE.content);
        saveFeedback();
      }
    }
  };

  const handleOptionSelected = (value: string) => {
    // Handle option selection
    if (['bug', 'feature', 'feedback'].includes(value)) {
      setCurrentFeedbackType(value as FeedbackType);
      addMessage(value === 'bug' ? 'Report a Bug' : 
                 value === 'feature' ? 'Suggest a Feature' : 
                 'Share General Feedback', 'user');
      addBotMessage(FEEDBACK_FOLLOW_UP[value][0].content);
      setFeedbackStage(0);
    } else if (value === 'more') {
      // Reset to ask for new feedback type
      setCurrentFeedbackType(null);
      setFeedbackStage(0);
      addMessage("I have more feedback", 'user');
      addBotMessage(INITIAL_MESSAGES[0].content);
    } else if (value === 'done') {
      // Close the chat with a final thank you
      addMessage("That's all for now", 'user');
      addBotMessage("Thank you for chatting with Book Buddy! We hope you enjoy using our platform. Feel free to reach out anytime with more feedback.");
      setTimeout(() => setIsOpen(false), 3000);
    }
  };

  const saveFeedback = async () => {
    setSubmitting(true);
    
    try {
      // Send feedback to the server
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: currentFeedbackType,
          responses: feedbackData[currentFeedbackType as string],
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving feedback:', errorData);
        addBotMessage("I'm having trouble saving your feedback. Please try again later.");
        return false;
      }
      
      // Log success to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Feedback Data sent successfully:', {
          type: currentFeedbackType,
          responses: feedbackData[currentFeedbackType as string],
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error sending feedback:', error);
      addBotMessage("I couldn't save your feedback due to a network error. Please try again later.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Render the current bot message options if any
  const renderCurrentOptions = () => {
    if (!currentFeedbackType && messages.length > 0) {
      return INITIAL_MESSAGES[0].options?.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mb-2 w-full justify-start text-left"
          onClick={() => handleOptionSelected(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ));
    }
    
    // Check if we're at the thank you stage
    if (currentFeedbackType && feedbackStage === FEEDBACK_FOLLOW_UP[currentFeedbackType].length - 1) {
      return THANK_YOU_MESSAGE.options?.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mb-2 w-full justify-start text-left"
          onClick={() => handleOptionSelected(option.value)}
        >
          {option.label}
        </Button>
      ));
    }
    
    return null;
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-5 right-5 w-14 h-14 md:w-16 md:h-16 bg-[#8b2439] rounded-full shadow-lg flex items-center justify-center z-[9999] text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        aria-label="Toggle feedback chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 md:h-7 md:w-7" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
            {/* Notification dot */}
            <motion.div 
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[70vh] sm:h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-[9990]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-[#8b2439] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-medium">Book Buddy Feedback</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleChat}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        p-3 rounded-lg max-w-[80%] break-words text-sm
                        ${msg.type === 'user' 
                          ? 'bg-[#8b2439] text-white' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }
                      `}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {/* Options */}
                {messages.length > 0 && (
                  <div className="flex justify-start mt-2">
                    <div className="space-y-2 w-full">
                      {renderCurrentOptions()}
                    </div>
                  </div>
                )}
                
                <div ref={endOfMessagesRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            {currentFeedbackType && !FEEDBACK_FOLLOW_UP[currentFeedbackType][feedbackStage]?.options && (
              <div className="p-3 border-t bg-gray-50">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    className="resize-none rounded-md text-sm flex-1 min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    className="bg-[#8b2439] text-white h-10 w-10"
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || submitting}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackChatbot; 