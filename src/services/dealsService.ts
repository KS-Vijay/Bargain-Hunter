
import { Deal, DealsResponse, SearchParams } from "@/types";
import { toast } from "sonner";

// Mock data to simulate API responses
const mockDeals: Deal[] = [
  {
    id: "1",
    title: "ASUS ROG Strix G15 Gaming Laptop",
    description: "AMD Ryzen 7 5800H, NVIDIA GeForce RTX 3070, 16GB DDR4, 1TB SSD, RGB Keyboard",
    price: 1299.99,
    originalPrice: 1699.99,
    discountPercentage: 23,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/asusrog",
    couponCode: "TECH20",
    expiryDate: "2025-05-10T00:00:00Z",
    category: "Electronics",
    isHot: true,
    rating: 4.7
  },
  {
    id: "2",
    title: "ASUS ZenBook 14 Ultra-Slim Laptop",
    description: "14\" Full HD NanoEdge, Intel Core i7-1165G7, 16GB RAM, 512GB SSD, NumberPad",
    price: 899.99,
    originalPrice: 1199.99,
    discountPercentage: 25,
    merchant: "Best Buy",
    merchantLogo: "https://logo.clearbit.com/bestbuy.com",
    url: "https://bestbuy.com/deal/asuszenbook",
    category: "Electronics",
    rating: 4.5
  },
  {
    id: "3",
    title: "ASUS TUF Gaming F15 Gaming Laptop",
    description: "15.6\" 144Hz FHD Display, Intel Core i5-11400H, 8GB DDR4, 512GB PCIe SSD",
    price: 749.99,
    originalPrice: 999.99,
    discountPercentage: 25,
    merchant: "Newegg",
    merchantLogo: "https://logo.clearbit.com/newegg.com",
    url: "https://newegg.com/deal/asustuf",
    couponCode: "GAMING10",
    expiryDate: "2025-04-25T00:00:00Z",
    category: "Electronics",
    isHot: true,
    rating: 4.3
  },
  {
    id: "4",
    title: "ASUS Chromebook Flip C434",
    description: "2-In-1 Laptop 14\\\" Touchscreen FHD, 4GB RAM, 64GB eMMC Storage",
    price: 389.99,
    originalPrice: 499.99,
    discountPercentage: 22,
    merchant: "Walmart",
    merchantLogo: "https://logo.clearbit.com/walmart.com",
    url: "https://walmart.com/deal/asuschromebook",
    category: "Electronics",
    rating: 4.2
  },
  {
    id: "5",
    title: "ASUS ProArt StudioBook Pro 16",
    description: "16\" OLED 4K, AMD Ryzen 9, NVIDIA RTX 3080, 32GB RAM, 2TB SSD",
    price: 2199.99,
    originalPrice: 2799.99,
    discountPercentage: 21,
    merchant: "B&H Photo",
    merchantLogo: "https://logo.clearbit.com/bhphotovideo.com",
    url: "https://bhphoto.com/deal/asusproart",
    couponCode: "PROART100",
    expiryDate: "2025-04-30T00:00:00Z",
    category: "Electronics",
    isHot: false,
    rating: 4.8
  }
];

// Simulated delay to mimic API call latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchDeals({ query, page = 1, limit = 10 }: SearchParams): Promise<DealsResponse> {
  try {
    // Simulate API latency
    await delay(600);
    
    if (!query) {
      return { deals: [], total: 0, hasMore: false };
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter mock data based on query
    const filteredDeals = mockDeals.filter(deal => {
      return (
        deal.title.toLowerCase().includes(lowerQuery) ||
        deal.description.toLowerCase().includes(lowerQuery) ||
        deal.merchant.toLowerCase().includes(lowerQuery) ||
        deal.category.toLowerCase().includes(lowerQuery)
      );
    });

    // Handle pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

    return {
      deals: paginatedDeals,
      total: filteredDeals.length,
      hasMore: endIndex < filteredDeals.length
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    toast.error("Failed to fetch deals. Please try again.");
    return { deals: [], total: 0, hasMore: false };
  }
}

// In a real application, you would implement these API calls
export const fetchDealApis = {
  // Example integration with a deals API 
  fetchFromRetailMeNot: async (query: string) => {
    // API_KEY would be stored in environment variables or secure storage
    const API_KEY = "YOUR_RETAILMENOT_API_KEY";
    // Implementation would go here
    return [];
  },
  
  fetchFromCouponFollow: async (query: string) => {
    const API_KEY = "YOUR_COUPONFOLLOW_API_KEY";
    // Implementation would go here
    return [];
  },
  
  fetchFromHoney: async (query: string) => {
    const API_KEY = "YOUR_HONEY_API_KEY";
    // Implementation would go here
    return [];
  }
};
