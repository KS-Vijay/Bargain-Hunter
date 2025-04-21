
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
  Sparkles,
  BarChart3,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import DealCard from "@/components/DealCard";

// Import images manually since we can't modify the existing imports
// In a real site, we'd use imported images

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Clothing", icon: "👕" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Beauty", icon: "✨" },
  { name: "Sports", icon: "🏀" },
  { name: "Gaming", icon: "🎮" },
  { name: "Books", icon: "📚" },
  { name: "Toys", icon: "🧸" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const chatInterfaceRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await searchDeals({ 
        query, 
        category: activeCategory ?? undefined 
      });
      setSearchResults(response.deals);
      setTotalResults(response.total);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleCategoryClick = async (category: string) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
    
    // If we have an active search, update with new category filter
    if (searchResults.length > 0 || isSearching) {
      setIsSearching(true);
      try {
        // Use empty string if there wasn't a previous search
        const response = await searchDeals({ 
          query: searchResults.length > 0 ? searchResults[0].title : "",
          category: newCategory ?? undefined
        });
        setSearchResults(response.deals);
        setTotalResults(response.total);
      } catch (error) {
        console.error("Category filter error:", error);
      } finally {
        setIsSearching(false);
      }
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
              <BarChart3 className="h-8 w-8 mr-2" />
              PriceRunner Plus
            </h1>
            <p className="text-lg mb-4 max-w-2xl">
              Compare prices and find deals across the web with AI assistance
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
              <Badge variant="secondary" className="flex items-center">
                <ShoppingCart className="h-3 w-3 mr-1" />
                500+ Stores
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                Web Scraped Deals
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Price Comparison
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                AI Assistant
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Price History
              </Badge>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                className={`cursor-pointer p-2 px-3 ${activeCategory === category.name ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="mr-1">{category.icon}</span> {category.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="search" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-8 max-w-md mx-auto">
            <TabsTrigger value="search" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Price Comparison
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Shopping Assistant
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            {searchResults.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Found {totalResults} matching products</h2>
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sort by: Best match <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
                <h3 className="text-lg font-medium mb-2">Compare prices</h3>
                <p className="text-gray-600 mb-4">
                  Enter a product name, brand, or category to find the best prices
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-2xl mx-auto">
                  {["Smartphones", "Laptops", "Headphones", "Cameras"].map(item => (
                    <Button 
                      key={item}
                      variant="outline" 
                      onClick={() => handleSearch(item)}
                      className="text-sm"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("chat")}
                    className="mt-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Or try the AI assistant
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
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
                    onClick={() => handleQuickAskClick("Compare prices for 4K TVs")}
                  >
                    Compare prices for 4K TVs
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">How the Price Comparison Works</h3>
                    <p className="text-sm text-blue-700">
                      Our system scrapes prices from over 500 retailers and uses AI to find the best deals. 
                      Ask questions about product prices, find coupons, or compare options in natural language.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 PriceRunner Plus | All prices are scraped in real-time and subject to change
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Note: This application simulates web scraping and does not actually scrape live data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
