
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Deal } from "@/types";
import { searchDeals } from "@/services/dealsService";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Tag, Percent, ShoppingCart, Star } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <div className="flex items-center space-x-3 text-sm mt-2">
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
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-8 max-w-md mx-auto">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1">
              <Tag className="h-4 w-4 mr-2" />
              Deal Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="max-w-4xl mx-auto">
              <ChatInterface />
              
              <div className="mt-8 bg-white p-4 rounded-lg border shadow">
                <h3 className="font-semibold mb-2">Quick Ask Examples:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="cursor-pointer p-2" variant="outline">Find me gaming laptop deals</Badge>
                  <Badge className="cursor-pointer p-2" variant="outline">What's the best price for AirPods Pro?</Badge>
                  <Badge className="cursor-pointer p-2" variant="outline">Show me kitchen appliance sales</Badge>
                  <Badge className="cursor-pointer p-2" variant="outline">Find Amazon deals with coupons</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="max-w-3xl mx-auto mb-8">
              <SearchBar onSearch={() => {}} isLoading={false} />
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Use the chat assistant for a more personalized deal hunting experience!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
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
