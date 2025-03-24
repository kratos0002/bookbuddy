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
          className="flex items-center gap-2 mb-2"
          onClick={() => handleOptionSelected(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ));
    }
    
    if (messages.length > 0 && messages[messages.length - 1].type === 'bot' && 
        messages[messages.length - 1].content === THANK_YOU_MESSAGE.content) {
      return THANK_YOU_MESSAGE.options?.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mb-2"
          onClick={() => handleOptionSelected(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ));
    }
    
    return null;
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        className="fixed right-4 bottom-4 rounded-full p-4 bg-book-primary hover:bg-book-primary/80 shadow-lg z-[9999]"
        onClick={toggleChat}
        aria-label={isOpen ? "Close feedback chat" : "Open feedback chat"}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </div>
        )}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-120px)] bg-card rounded-lg shadow-xl flex flex-col overflow-hidden border border-border z-50"
          >
            {/* Chat header */}
            <div className="p-3 bg-book-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Book Buddy Feedback</h3>
                  <p className="text-xs opacity-80">We'd love to hear from you!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-book-primary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Options buttons if applicable */}
                <div className="flex flex-col items-start gap-2 mt-2">
                  {renderCurrentOptions()}
                </div>

                {/* Invisible element to scroll to */}
                <div ref={endOfMessagesRef} />
              </div>
            </ScrollArea>

            {/* Chat input */}
            <div className="p-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[40px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-book-primary hover:bg-book-primary/80"
                  disabled={!currentInput.trim() || submitting}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
              
              {/* Shows when feedback is being submitted */}
              {submitting && (
                <p className="text-xs text-muted-foreground mt-1 animate-pulse">
                  Saving your valuable feedback...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackChatbot; 