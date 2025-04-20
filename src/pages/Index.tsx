import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import DealsList from "@/components/DealsList";
import { Deal, DealsResponse } from "@/types";
import { searchDeals } from "@/services/dealsService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent, Tag, Tags } from "lucide-react";

const Index = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setDeals([]);
    await fetchDeals(query, 1);
  };
  
  const fetchDeals = async (query: string, pageNum: number) => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response: DealsResponse = await searchDeals({ 
        query, 
        page: pageNum,
        limit: 9
      });
      
      if (pageNum === 1) {
        setDeals(response.deals);
      } else {
        setDeals(prevDeals => [...prevDeals, ...response.deals]);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDeals(searchQuery, nextPage);
  };
  
  const filterDeals = (category: string) => {
    setActiveTab(category);
    // In a real app, this would filter the deals by category
    // For now, we're just simulating the behavior
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Percent className="h-8 w-8 mr-2" />
              Bargain Hunter
            </h1>
            <p className="text-lg mb-8 max-w-2xl">
              Find the best deals, discounts and coupons across the web instantly
            </p>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Results for "{searchQuery}"
            </h2>
            <Tabs defaultValue="all" className="w-full" onValueChange={filterDeals}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Deals</TabsTrigger>
                <TabsTrigger value="hot">Hot Offers</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="electronics">Electronics</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {loading && page === 1 ? (
                  <LoadingSpinner />
                ) : (
                  <DealsList 
                    deals={deals} 
                    total={total} 
                    loading={loading} 
                    hasMore={hasMore} 
                    onLoadMore={handleLoadMore}
                  />
                )}
              </TabsContent>
              <TabsContent value="hot" className="space-y-4">
                {/* Other tabs would have filtered content in a real app */}
                <DealsList 
                  deals={deals.filter(deal => deal.isHot)} 
                  total={deals.filter(deal => deal.isHot).length} 
                  loading={loading} 
                  hasMore={false} 
                  onLoadMore={() => {}}
                />
              </TabsContent>
              <TabsContent value="coupons" className="space-y-4">
                <DealsList 
                  deals={deals.filter(deal => deal.couponCode)} 
                  total={deals.filter(deal => deal.couponCode).length} 
                  loading={loading} 
                  hasMore={false} 
                  onLoadMore={() => {}}
                />
              </TabsContent>
              <TabsContent value="electronics" className="space-y-4">
                <DealsList 
                  deals={deals.filter(deal => deal.category === "Electronics")} 
                  total={deals.filter(deal => deal.category === "Electronics").length} 
                  loading={loading} 
                  hasMore={false} 
                  onLoadMore={() => {}}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!searchQuery && !loading && (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="bg-white rounded-full p-8 shadow-md mb-6">
              <Tag className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Start Your Deal Hunt</h2>
            <p className="text-gray-600 max-w-lg mb-6">
              Search for products to find the best prices, discounts, and coupons from across the web.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-xl">
              <Badge className="text-sm py-1.5 cursor-pointer" variant="outline" onClick={() => handleSearch("laptop")}>
                Laptops
              </Badge>
              <Badge className="text-sm py-1.5 cursor-pointer" variant="outline" onClick={() => handleSearch("smartphone")}>
                Smartphones
              </Badge>
              <Badge className="text-sm py-1.5 cursor-pointer" variant="outline" onClick={() => handleSearch("headphones")}>
                Headphones
              </Badge>
              <Badge className="text-sm py-1.5 cursor-pointer" variant="outline" onClick={() => handleSearch("gaming")}>
                Gaming
              </Badge>
              <Badge className="text-sm py-1.5 cursor-pointer" variant="outline" onClick={() => handleSearch("clothing")}>
                Clothing
              </Badge>
            </div>
          </div>
        )}
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
        </div>
      </footer>
    </div>
  );
};

export default Index;
