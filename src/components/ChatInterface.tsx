
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowDown, Globe, Sparkles, Clipboard, ExternalLink } from "lucide-react";
import { searchDeals } from "@/services/dealsService";
import { answerProductQuestion } from "@/services/aiService";
import DealCard from "@/components/DealCard";
import { Deal } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  deals?: Deal[];
  isProductInfo?: boolean;
  sources?: string[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! How can I help you find deals today? You can ask about specific products or browse categories.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set up an event listener for quick ask examples
  useEffect(() => {
    const handleQuickAsk = (e: CustomEvent) => {
      setInputValue(e.detail.question);
      setTimeout(() => {
        handleSend();
      }, 100);
    };
    
    document.addEventListener('quickAsk', handleQuickAsk as EventListener);
    
    return () => {
      document.removeEventListener('quickAsk', handleQuickAsk as EventListener);
    };
  }, [inputValue]); // Include inputValue to prevent stale closure

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Determine if this is a product info question or a deals search
    const isProductInfoQuestion = 
      inputValue.toLowerCase().includes("what") || 
      inputValue.toLowerCase().includes("how") || 
      inputValue.toLowerCase().includes("which") ||
      inputValue.toLowerCase().includes("when") ||
      inputValue.toLowerCase().includes("where") ||
      inputValue.toLowerCase().includes("why") ||
      inputValue.toLowerCase().includes("best") ||
      inputValue.toLowerCase().includes("compare") ||
      inputValue.toLowerCase().includes("vs") ||
      inputValue.toLowerCase().includes("versus") ||
      inputValue.toLowerCase().includes("difference") ||
      inputValue.toLowerCase().includes("review") ||
      inputValue.toLowerCase().includes("opinion");

    try {
      if (isProductInfoQuestion) {
        // This is a product information question, use the AI service
        const response = await answerProductQuestion(inputValue);
        
        const botMessage: Message = {
          id: `bot-info-${Date.now()}`,
          content: response.answer,
          isUser: false,
          timestamp: new Date(),
          isProductInfo: true,
          sources: response.sources
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // This is a deals search query
        const response = await searchDeals({ query: inputValue });
        
        let botResponse = "";
        if (response.deals.length > 0) {
          botResponse = `I found ${response.total} deals for "${inputValue}" by scraping multiple sites. Here are the best ones:`;
        } else {
          botResponse = `I searched several sites but couldn't find any deals matching "${inputValue}". Try searching for something else or check back later!`;
        }

        const botMessage: Message = {
          id: `bot-deals-${Date.now()}`,
          content: botResponse,
          isUser: false,
          timestamp: new Date(),
          deals: response.deals,
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error while searching for deals. Our web scrapers might be having trouble reaching the sites. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copySourceToClipboard = (source: string) => {
    navigator.clipboard.writeText(source);
    toast.success("Source copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-h-[600px] bg-white rounded-lg border shadow-lg">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-primary text-white rounded-t-lg">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-primary-foreground">
            <span className="text-primary font-bold">PR</span>
          </Avatar>
          <div>
            <h3 className="font-semibold">PriceRunner Assistant</h3>
            <p className="text-xs opacity-75">Finding the best prices across the web</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.isProductInfo && !message.isUser && (
                <div className="flex items-center mb-2 text-xs text-gray-500">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Web scraped</span>
                  <Sparkles className="h-3 w-3 mx-1" />
                  <span>AI generated</span>
                </div>
              )}
              
              <p className="whitespace-pre-line">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Sources:</p>
                  <ul className="text-xs text-gray-600">
                    {message.sources.map((source, index) => (
                      <li key={index} className="mb-1 flex items-center justify-between">
                        <div className="flex-1">{source}</div>
                        <button 
                          onClick={() => copySourceToClipboard(source)}
                          className="ml-2 p-1 hover:bg-gray-200 rounded"
                        >
                          <Clipboard className="h-3 w-3 text-gray-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-xs mt-1 text-right opacity-75">
                {formatTime(message.timestamp)}
              </div>
              
              {message.deals && message.deals.length > 0 && (
                <div className="mt-4 space-y-4">
                  {message.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  
                  <div className="text-center mt-6">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open('https://www.pricerunner.com', '_blank')}>
                      <ExternalLink className="h-3 w-3 mr-1" /> 
                      Compare more prices on PriceRunner
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[75%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about products, deals, or search for prices..."
          className="flex-1 bg-gray-100 text-gray-800 border-0 focus-visible:ring-1"
        />
        <Button 
          className="ml-2" 
          onClick={handleSend} 
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
