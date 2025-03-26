import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import BookCover from '../components/BookCover';
import { BookText, X, Eye, MessageCircle, User } from 'lucide-react';
import { useBook } from '../contexts/BookContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ContextPanel from '../components/ContextPanel';
import { useParams, useNavigate } from 'react-router-dom';
import { EncyclopediaProvider, useEncyclopedia, EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import EntryUnlockedNotification from '@/components/encyclopedia/EntryUnlockedNotification';
import SimpleLibrarian from '@/components/SimpleLibrarian';
import SuggestionPanel from '@/components/chat/suggestions/SuggestionPanel';

interface Message {
  id: number;
  content: string;
  isUserMessage: boolean;
  senderId?: number;
  sentAt: string;
}

interface Character {
  id: number;
  name: string;
  avatarUrl?: string;
}

// Keywords that trigger encyclopedia entries to unlock
const ENCYCLOPEDIA_TRIGGERS: Record<string, string[]> = {
  'telescreen': ['telescreen', 'telescreens', 'screen', 'surveillance', 'watching'],
  'big-brother': ['big brother', 'watching you', 'leader', 'big', 'brother'],
  'newspeak': ['newspeak', 'language', 'words', 'vocabulary', 'dictionary'],
  'thought-police': ['thought police', 'thoughtpolice', 'police', 'arrested', 'crime', 'criminal'],
  'doublethink': ['doublethink', 'contradictory', 'believe', 'truth', 'thinking'],
  'room-101': ['room 101', 'torture', 'fear', 'worst fear', 'rats'],
  'ministry-of-truth': ['ministry of truth', 'minitrue', 'records', 'news', 'propaganda'],
  'two-minutes-hate': ['two minutes hate', 'hate', 'goldstein', 'enemy', 'emmanuel'],
  'thoughtcrime': ['thoughtcrime', 'crimethink', 'criminal thoughts', 'illegal thoughts'],
  'memory-hole': ['memory hole', 'records', 'documents', 'disposal', 'erase', 'forgotten']
};

const ConversationPageContent = () => {
  const [contextOpen, setContextOpen] = useState(false);
  const { selectedBook, selectedCharacter, setSelectedBook } = useBook();
  const [showEye, setShowEye] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedChatCharacter, setSelectedChatCharacter] = useState<number | null>(null);
  const [isLibrarianSelected, setIsLibrarianSelected] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationId, setConversationId] = useState<number | string | null>(null);
  const queryClient = useQueryClient();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Encyclopedia integration
  const { entries, unlockedEntryIds, unlockEntry, selectEntry } = useEncyclopedia();
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<EncyclopediaEntry | null>(null);
  
  // If a book ID is provided in the URL, update the selected book
  useEffect(() => {
    if (bookId) {
      // We only have book ID 1 (1984) in the system, so we'll use that
      console.log(`Book ID from URL: ${bookId}, using book ID: 1`);
      // In a real app with multiple books, we would fetch book details here
    }
  }, [bookId, selectedBook.id]);
  
  // Always use book ID 1 for API calls since we only have one book
  const apiBookId = 1;
  
  // Fetch characters using the hardcoded book ID
  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: [`/api/books/${apiBookId}/characters`],
    queryFn: () => {
      console.log(`Fetching characters for book ${apiBookId}...`);
      return apiRequest('GET', `/api/books/${apiBookId}/characters`).then(data => {
        console.log("Characters received:", data);
        return data;
      });
    },
  });

  // Fetch messages with polling
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    queryFn: () => apiRequest('GET', `/api/conversations/${conversationId}/messages`),
    enabled: !!conversationId && conversationId !== "dummy",
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  // Create new conversation
  const createConversation = async (characterId: number | null) => {
    setIsCreatingConversation(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/conversations',
        {
          bookId: apiBookId,
          characterIds: isLibrarianSelected ? [] : [characterId],
          isLibrarianPresent: isLibrarianSelected,
          conversationMode: isLibrarianSelected ? 'analysis' : 'character',
          userId: 1,
          title: isLibrarianSelected 
            ? `Chat with Alexandria, the AI Librarian` 
            : `Chat with ${characters?.find(c => c.id === characterId)?.name || 'Character'}`
        }
      );

      // Set the conversation ID
      if (response && response.id) {
        setConversationId(response.id);
      }
      return response;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) {
      console.log("Message empty or no conversation ID, not sending", { message, conversationId });
      return;
    }

    console.log("Sending message:", { message, conversationId });
    
    try {
      const msgToSend = message.trim();
      setMessage(''); // Clear input field immediately for better UX
      
      const response = await apiRequest(
        'POST',
        `/api/conversations/${conversationId}/messages`,
        {
          content: msgToSend,
          isUserMessage: true,
          conversationId: conversationId // Make sure conversationId is included
        }
      );

      console.log("Message sent successfully:", response);
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      // Add the message back if it failed to send
      setMessage(message);
      // Display error notification (you might want to add a toast here)
      alert("Failed to send message. Please try again.");
    }
  };

  // Check for encyclopedia entries to unlock in new messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    // Get the latest message
    const latestMessage = messages[messages.length - 1];
    
    // Skip if it's a user message
    if (latestMessage.isUserMessage) return;
    
    // Check the message content against trigger keywords
    const messageContent = latestMessage.content.toLowerCase();
    
    Object.entries(ENCYCLOPEDIA_TRIGGERS).forEach(([entryId, keywords]) => {
      // Skip already unlocked entries
      if (unlockedEntryIds.includes(entryId)) return;
      
      // Check if any keyword is in the message
      const hasKeyword = keywords.some(keyword => messageContent.includes(keyword.toLowerCase()));
      
      if (hasKeyword) {
        console.log(`Character mentioned ${entryId}, unlocking in encyclopedia`);
        
        // Find the entry to unlock
        const entryToUnlock = entries.find(entry => entry.id === entryId);
        
        if (entryToUnlock) {
          // Call the API to unlock the entry
          unlockEntry(entryId)
            .then(() => {
              // Show notification
              setRecentlyUnlocked(entryToUnlock);
            })
            .catch(err => {
              console.error(`Error unlocking ${entryId}:`, err);
            });
        }
      }
    });
  }, [messages, unlockedEntryIds, entries, unlockEntry]);

  // Handler for selecting a character
  const handleCharacterSelect = async (characterId: number | null) => {
    // When librarian is selected, clear conversationId but set librarian flag
    if (characterId === null) {
      setSelectedChatCharacter(null);
      setIsLibrarianSelected(true);
      setConversationId(null); // No API calls with null conversationId
      return;
    }
    
    // Character is selected
    setSelectedChatCharacter(characterId);
    setIsLibrarianSelected(false);
    
    // Create a conversation only if we don't have one yet
    if (!conversationId) {
      await createConversation(characterId);
    }
  };
  
  // Close context panel when character is selected on mobile
  useEffect(() => {
    if (selectedCharacter && contextOpen && window.innerWidth < 768) {
      setContextOpen(false);
    }
  }, [selectedCharacter, contextOpen]);
  
  // Hide the watching eye after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEye(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Inside the ConversationPage component, add state for suggestions
  const [suggestionsMinimized, setSuggestionsMinimized] = useState(false);

  // Add this function to handle suggestion clicks
  const handleSuggestionClick = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden relative">
      {/* Big Brother watching overlay effect - appears briefly */}
      {showEye && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-out pointer-events-none">
          <div className="text-book-primary text-center">
            <Eye size={60} className="mx-auto mb-4 animate-pulse-subtle" />
            <p className="text-xl text-book-secondary typewriter">Big Brother is watching you...</p>
          </div>
        </div>
      )}
    
      {/* Left section - Book Cover (visible on mobile, hidden on larger screens) */}
      <div className="md:hidden p-4 bg-gradient-to-b from-background to-muted/30">
        <BookCover />
      </div>
      
      {/* Middle section - Chat interface (main content) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="hidden md:block absolute top-0 left-0 m-6 z-10">
          <BookCover />
        </div>
        
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 mt-12 relative z-0 big-brother-watching">
            <div className="w-full h-full flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-book-primary flex items-center gap-2">
                <MessageCircle size={20} className="text-book-primary/70" />
                Chat with {selectedBook.title} Characters
              </h2>
              
              {/* Chat interface */}
              {!conversationId && !isLibrarianSelected ? (
                <div className="p-6 border rounded-lg bg-white shadow-sm flex-1">
                  <h4 className="text-lg font-medium mb-4">Who would you like to chat with?</h4>
                  
                  {/* Librarian option */}
                  <div className="mb-4">
                    <Button
                      variant={isLibrarianSelected ? "default" : "outline"}
                      className="w-full justify-start bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200 hover:from-amber-200 hover:to-amber-100 text-amber-900"
                      onClick={() => handleCharacterSelect(null)}
                      disabled={isCreatingConversation}
                    >
                      <BookText className="mr-2 h-4 w-4" />
                      Alexandria, the AI Librarian
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      Chat with a knowledgeable librarian about themes, analysis, and literary context
                    </p>
                  </div>
                  
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">or select a character</span>
                    </div>
                  </div>
                  
                  {/* Character grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.isArray(characters) && characters.length > 0 ? (
                      characters.map((char: Character) => (
                        <Button
                          key={char.id}
                          variant={selectedChatCharacter === char.id ? "default" : "outline"}
                          className="w-full justify-start py-3"
                          onClick={() => handleCharacterSelect(char.id)}
                          disabled={isCreatingConversation}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {char.name || `Character ${char.id}`}
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-full text-center p-4 border rounded">
                        {isLoadingCharacters ? (
                          "Loading characters..."
                        ) : (
                          <div>
                            <p className="mb-2">No characters found. API call information:</p>
                            <code className="bg-muted p-1 rounded text-xs block mb-2">GET /api/books/{apiBookId}/characters</code>
                            <p className="text-sm text-muted-foreground mb-2">Attempting to fetch characters...</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                queryClient.invalidateQueries({ queryKey: [`/api/books/${apiBookId}/characters`] });
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* If librarian is selected, use the SimpleLibrarian component */}
                  {isLibrarianSelected ? (
                    <div className="flex flex-col h-full">
                      <div className="p-2 bg-muted border mb-4 rounded-md flex items-center">
                        <h4 className="font-medium">
                          Chatting with Alexandria, the AI Librarian
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            setConversationId(null);
                            setIsLibrarianSelected(false);
                          }}
                        >
                          New Chat
                        </Button>
                      </div>
                      <div className="flex-1">
                        <SimpleLibrarian />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      {/* Character chat header */}
                      <div className="p-2 bg-muted border mb-4 rounded-md flex items-center">
                        <h4 className="font-medium">
                          {selectedChatCharacter
                            ? `Chatting with ${characters?.find(c => c.id === selectedChatCharacter)?.name || "Character"}`
                            : "Select a character to chat with"}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => setConversationId(null)}
                        >
                          New Chat
                        </Button>
                      </div>

                      {/* Messages display */}
                      <div 
                        className="flex-1 overflow-y-auto mb-4"
                        ref={messagesContainerRef}
                      >
                        {messages?.map((message, i) => (
                          <div
                            key={i}
                            className={`mb-4 flex items-start ${
                              message.isUserMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`rounded-lg p-3 max-w-[80%] ${
                                message.isUserMessage
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Suggestion Panel */}
                      <SuggestionPanel
                        characterId={selectedChatCharacter}
                        messageCount={messages?.length || 0}
                        onSuggestionClick={handleSuggestionClick}
                        minimized={suggestionsMinimized}
                        onToggleMinimize={() => setSuggestionsMinimized(!suggestionsMinimized)}
                        className="mt-auto"
                      />

                      {/* Message input form */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Form submitted, sending message");
                        sendMessage();
                      }} className="mt-auto">
                        <div className="flex gap-2">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1"
                          />
                          <Button type="submit" disabled={isCreatingConversation}>
                            {isCreatingConversation ? "Loading..." : "Send"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section - Context panel (hidden on mobile) */}
      <div 
        className={`fixed inset-y-0 right-0 transform transition-transform duration-300 ease-in-out md:relative z-40 w-full md:w-96 md:translate-x-0 ${
          contextOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ContextPanel />
        <Button
          className="absolute top-2 left-2 md:hidden z-50"
          size="sm"
          variant="outline"
          onClick={() => setContextOpen(false)}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Button to open context panel on mobile */}
      <Button
        className={`fixed bottom-4 right-4 md:hidden z-30 ${contextOpen ? 'hidden' : ''}`}
        size="sm"
        onClick={() => setContextOpen(true)}
      >
        <BookText size={16} className="mr-1" /> Context
      </Button>
      
      {/* Encyclopedia unlocked notification */}
      {recentlyUnlocked && (
        <EntryUnlockedNotification 
          entry={recentlyUnlocked}
          onView={() => {
            setContextOpen(true);
            selectEntry(recentlyUnlocked.id);
            setRecentlyUnlocked(null);
          }}
          onDismiss={() => setRecentlyUnlocked(null)}
        />
      )}
    </div>
  );
};

// Wrapper component that provides the EncyclopediaProvider
const ConversationPage = () => (
  <EncyclopediaProvider>
    <ConversationPageContent />
  </EncyclopediaProvider>
);

export default ConversationPage;
