import { useEffect, useState, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import { Deal } from "@/types";
import { searchDeals } from "@/services/dealsService";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Tag, 
  Percent, 
  ShoppingCart, 
  Star, 
  Search,
  Globe,
  Sparkles
} from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { initializeModel } from "@/services/aiService";
import DealCard from "@/components/DealCard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const chatInterfaceRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    initializeModel();
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await searchDeals({ query });
      setSearchResults(response.deals);
      setTotalResults(response.total);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleQuickAskClick = (question: string) => {
    setActiveTab("chat");
    const event = new CustomEvent('quickAsk', { detail: { question } });
    document.dispatchEvent(event);
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Percent className="h-8 w-8 mr-2" />
              Bargain Hunter
            </h1>
            <p className="text-lg mb-4 max-w-2xl">
              Your AI shopping assistant that finds the best deals across the web instantly
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
              <Badge variant="secondary" className="flex items-center">
                <ShoppingCart className="h-3 w-3 mr-1" />
                500+ Stores
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                Real-time Deals
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Verified Coupons
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                Web Search
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart Answers
              </Badge>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8 max-w-md mx-auto">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Deal Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="max-w-4xl mx-auto" ref={chatInterfaceRef}>
              <ChatInterface />
              
              <div className="mt-8 bg-white p-4 rounded-lg border shadow">
                <h3 className="font-semibold mb-2">Quick Ask Examples:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white transition-colors" 
                    variant="outline"
                    onClick={() => handleQuickAskClick("Find me gaming laptop deals")}
                  >
                    Find me gaming laptop deals
                  </Badge>
                  <Badge 
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white transition-colors" 
                    variant="outline"
                    onClick={() => handleQuickAskClick("What's the best price for AirPods Pro?")}
                  >
                    What's the best price for AirPods Pro?
                  </Badge>
                  <Badge 
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white transition-colors" 
                    variant="outline"
                    onClick={() => handleQuickAskClick("Show me kitchen appliance sales")}
                  >
                    Show me kitchen appliance sales
                  </Badge>
                  <Badge 
                    className="cursor-pointer p-2 hover:bg-primary hover:text-white transition-colors" 
                    variant="outline"
                    onClick={() => handleQuickAskClick("Find Amazon deals with coupons")}
                  >
                    Find Amazon deals with coupons
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">How the AI Assistant Works</h3>
                    <p className="text-sm text-blue-700">
                      Our AI assistant searches over 500+ stores in real-time to find the best deals and answers your 
                      product questions using the latest web information. Just ask about any product or deal in natural language!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="max-w-3xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
              
              {searchResults.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Found {totalResults} matching deals</h2>
                  <div className="space-y-4">
                    {searchResults.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}
              
              {searchResults.length === 0 && !isSearching && (
                <div className="mt-6 text-center p-8 bg-white rounded-lg border">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">Search for deals</h3>
                  <p className="text-gray-600 mb-4">
                    Enter a product name, brand, or category to find the best deals
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("chat")}
                    className="mt-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Or try the chat assistant
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 Bargain Hunter | All prices and deals are subject to change
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Note: Some links may include affiliate codes that support this service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
