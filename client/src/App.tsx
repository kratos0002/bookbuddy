import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConversationPage from "./pages/ConversationPage";
import ChatPage from "./pages/chat";
import NotFound from "./pages/NotFound";
import LibrarianChat from "./pages/LibrarianChat";
import CareersPage from "./pages/CareersPage";
import { BookProvider } from "./contexts/BookContext";
import { queryClient } from './lib/queryClient';
import Layout from "./components/Layout";
import FeedbackChatbot from "./components/feedback/FeedbackChatbot";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FeedbackChatbot />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="chat" element={<ConversationPage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/book/:bookId" element={<ConversationPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:conversationId" element={<ChatPage />} />
              <Route path="/librarian" element={<LibrarianChat />} />
              <Route path="/careers" element={<CareersPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </BookProvider>
  </QueryClientProvider>
);

export default App;
