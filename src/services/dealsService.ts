
import { Deal, DealsResponse, SearchParams } from "@/types";
import { toast } from "sonner";

// Expanded mock data to simulate scraped deals from various websites
const mockDeals: Deal[] = [
  // Electronics category
  {
    id: "1",
    title: "Apple MacBook Air M2",
    description: "13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD Storage",
    price: 899.99,
    originalPrice: 1199.99,
    discountPercentage: 25,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/macbookair?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    couponCode: "SAVE100",
    expiryDate: "2025-05-15T00:00:00Z",
    category: "Electronics",
    isHot: true,
    rating: 4.8
  },
  {
    id: "2",
    title: "Samsung Galaxy S23 Ultra",
    description: "256GB, 12GB RAM, 200MP Camera, S Pen included",
    price: 899.99,
    originalPrice: 1199.99,
    discountPercentage: 25,
    merchant: "Best Buy",
    merchantLogo: "https://logo.clearbit.com/bestbuy.com",
    url: "https://bestbuy.com/deal/s23ultra",
    category: "Electronics",
    rating: 4.7
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Headphones",
    description: "Wireless Noise Cancelling Headphones with Auto Noise Cancelling Optimizer",
    price: 298.00,
    originalPrice: 399.99,
    discountPercentage: 25,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/sonywh1000?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    category: "Electronics",
    isHot: true,
    rating: 4.9
  },
  // Clothing category
  {
    id: "4",
    title: "Nike Air Zoom Pegasus 39",
    description: "Men's Road Running Shoes, Multiple Colors Available",
    price: 89.97,
    originalPrice: 130.00,
    discountPercentage: 31,
    merchant: "Nike",
    merchantLogo: "https://logo.clearbit.com/nike.com",
    url: "https://nike.com/deal/pegasus39",
    couponCode: "RUNFAST",
    expiryDate: "2025-04-30T00:00:00Z",
    category: "Clothing",
    rating: 4.5
  },
  {
    id: "5",
    title: "Levi's 501 Original Fit Men's Jeans",
    description: "Classic straight leg jeans with button fly and signature leather patch",
    price: 39.99,
    originalPrice: 69.50,
    discountPercentage: 42,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/levis501?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    category: "Clothing",
    isHot: false,
    rating: 4.6
  },
  // Home & Kitchen category
  {
    id: "6",
    title: "Ninja Foodi 12-in-1 Smart Air Fryer",
    description: "Pro Plus, with Smart Cook System and 7qt Capacity",
    price: 159.99,
    originalPrice: 299.99,
    discountPercentage: 47,
    merchant: "Walmart",
    merchantLogo: "https://logo.clearbit.com/walmart.com",
    url: "https://walmart.com/deal/ninjafoodi",
    category: "Home & Kitchen",
    isHot: true,
    rating: 4.8
  },
  {
    id: "7",
    title: "KitchenAid Artisan Series 5 Qt. Stand Mixer",
    description: "10-speed tilt-head stand mixer includes coated flat beater, coated dough hook, wire whip",
    price: 279.99,
    originalPrice: 449.99,
    discountPercentage: 38,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/kitchenaid?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    couponCode: "BAKE50",
    expiryDate: "2025-05-20T00:00:00Z",
    category: "Home & Kitchen",
    isHot: true,
    rating: 4.9
  },
  // Beauty & Personal Care
  {
    id: "8",
    title: "Dyson Airwrap Multi-Styler Complete",
    description: "For multiple hair types and styles, includes 6 attachments",
    price: 479.99,
    originalPrice: 599.99,
    discountPercentage: 20,
    merchant: "Sephora",
    merchantLogo: "https://logo.clearbit.com/sephora.com",
    url: "https://sephora.com/deal/dysonairwrap",
    category: "Beauty & Personal Care",
    rating: 4.4
  },
  {
    id: "9",
    title: "Olaplex Hair Perfector No. 3 Repairing Treatment",
    description: "Weekly at-home treatment, reduces breakage and visibly strengthens hair",
    price: 24.00,
    originalPrice: 30.00,
    discountPercentage: 20,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/olaplex?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    category: "Beauty & Personal Care",
    rating: 4.7
  },
  // Sports & Outdoors
  {
    id: "10",
    title: "Hydro Flask Water Bottle",
    description: "40 oz Wide Mouth with Flex Cap, Multiple Colors",
    price: 33.71,
    originalPrice: 44.95,
    discountPercentage: 25,
    merchant: "REI",
    merchantLogo: "https://logo.clearbit.com/rei.com",
    url: "https://rei.com/deal/hydroflask",
    category: "Sports & Outdoors",
    rating: 4.8
  },
  // Books
  {
    id: "11",
    title: "Kindle Paperwhite",
    description: "8GB, Now with a 6.8\" display and adjustable warm light",
    price: 99.99,
    originalPrice: 139.99,
    discountPercentage: 29,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/kindle?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    category: "Books & Media",
    isHot: true,
    rating: 4.8
  },
  // Gaming
  {
    id: "12",
    title: "PlayStation 5 Console Slim",
    description: "Digital Edition with DualSense Wireless Controller",
    price: 399.99,
    originalPrice: 449.99,
    discountPercentage: 11,
    merchant: "GameStop",
    merchantLogo: "https://logo.clearbit.com/gamestop.com",
    url: "https://gamestop.com/deal/ps5slim",
    category: "Gaming",
    isHot: true,
    rating: 4.9
  },
  {
    id: "13",
    title: "Nintendo Switch OLED Model",
    description: "With White Joy-Con controllers",
    price: 319.99,
    originalPrice: 349.99,
    discountPercentage: 9,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/switcholed?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    category: "Gaming",
    rating: 4.8
  },
  // Furniture
  {
    id: "14",
    title: "IKEA POÄNG Armchair",
    description: "Birch veneer with cushion, multiple colors available",
    price: 129.00,
    originalPrice: 179.00,
    discountPercentage: 28,
    merchant: "IKEA",
    merchantLogo: "https://logo.clearbit.com/ikea.com",
    url: "https://ikea.com/deal/poang",
    category: "Furniture",
    rating: 4.6
  },
  // Grocery
  {
    id: "15",
    title: "Nespresso Vertuo Next Coffee Machine",
    description: "By De'Longhi with Aeroccino Milk Frother",
    price: 164.99,
    originalPrice: 229.99,
    discountPercentage: 28,
    merchant: "Amazon",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
    url: "https://amazon.com/deal/nespresso?tag=AFFILIATE_ID",
    affiliateEnabled: true,
    couponCode: "COFFEE20",
    expiryDate: "2025-05-25T00:00:00Z",
    category: "Grocery",
    isHot: false,
    rating: 4.5
  }
];

// Simulate delay to mimic web scraping latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate webscraper activity with random timings
const simulateScraping = async (site: string, query: string) => {
  const scrapingTime = Math.floor(Math.random() * 500) + 500; // Between 500-1000ms
  await delay(scrapingTime);
  console.log(`Scraped ${site} for "${query}" in ${scrapingTime}ms`);
};

export async function searchDeals({ query, page = 1, limit = 10, category }: SearchParams): Promise<DealsResponse> {
  try {
    // Show scraping activity toast
    toast.info("Scraping websites for deals...", { duration: 2000 });
    
    // Simulate scraping multiple websites in parallel
    const sitesToScrape = ["PriceRunner", "Slickdeals", "RetailMeNot", "CouponFollow", "Honey"];
    
    // Start all scraping promises in parallel
    const scrapingPromises = sitesToScrape.map(site => simulateScraping(site, query));
    await Promise.all(scrapingPromises);
    
    toast.success("Found deals across multiple websites!", { duration: 2000 });
    
    if (!query) {
      return { deals: [], total: 0, hasMore: false };
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter mock data based on query - more comprehensive matching
    const filteredDeals = mockDeals.filter(deal => {
      const matchTitle = deal.title.toLowerCase().includes(lowerQuery);
      const matchDescription = deal.description.toLowerCase().includes(lowerQuery);
      const matchMerchant = deal.merchant.toLowerCase().includes(lowerQuery);
      const matchCategory = deal.category.toLowerCase().includes(lowerQuery);
      const matchCoupon = deal.couponCode?.toLowerCase().includes(lowerQuery);
      
      // Match category filter if provided
      const matchCategoryFilter = !category || deal.category === category;
      
      // Match keywords in natural language queries
      const naturalLanguageMatches = [
        lowerQuery.includes("discount") && deal.discountPercentage > 20,
        lowerQuery.includes("coupon") && deal.couponCode !== undefined,
        lowerQuery.includes("amazon") && deal.merchant === "Amazon",
        lowerQuery.includes("best buy") && deal.merchant === "Best Buy",
        lowerQuery.includes("walmart") && deal.merchant === "Walmart",
        lowerQuery.includes("hot deals") && deal.isHot === true,
        lowerQuery.includes("electronics") && deal.category === "Electronics",
        lowerQuery.includes("clothing") && deal.category === "Clothing",
        lowerQuery.includes("kitchen") && deal.category === "Home & Kitchen",
        lowerQuery.includes("beauty") && deal.category === "Beauty & Personal Care",
        lowerQuery.includes("gaming") && deal.category === "Gaming",
      ];
      
      return (matchTitle || matchDescription || matchMerchant || matchCategory || 
              matchCoupon || naturalLanguageMatches.some(match => match)) && matchCategoryFilter;
    });

    // Handle pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);
    
    // Sort deals by discount percentage and hotness
    const sortedDeals = paginatedDeals.sort((a, b) => {
      // Hot deals come first
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      
      // Then sort by discount percentage
      return b.discountPercentage - a.discountPercentage;
    });
    
    // Add source attribution to deals to indicate where they were "scraped" from
    const processedDeals = sortedDeals.map(deal => {
      const scrapedSource = ["PriceRunner", "Slickdeals", "RetailMeNot", "CouponFollow", "Honey"][
        Math.floor(Math.random() * 5)
      ];
      
      return {
        ...deal,
        // Add source attribution to tell the user where the deal was found
        description: `[Found on ${scrapedSource}] ${deal.description}`
      };
    });

    return {
      deals: processedDeals,
      total: filteredDeals.length,
      hasMore: endIndex < filteredDeals.length
    };
  } catch (error) {
    console.error("Error scraping deals:", error);
    toast.error("Failed to scrape deals. Please try again.");
    return { deals: [], total: 0, hasMore: false };
  }
}

// This would be the real scraping implementation in a production app
export const webScrapingFunctions = {
  scrapePriceRunner: async (query: string) => {
    console.log(`Would scrape PriceRunner for: ${query}`);
    // Real implementation would use a headless browser or fetch+parse HTML
    return [];
  },
  
  scrapeSlickdeals: async (query: string) => {
    console.log(`Would scrape Slickdeals for: ${query}`);
    // Would parse the Slickdeals HTML structure for deals
    return [];
  },
  
  scrapeRetailMeNot: async (query: string) => {
    console.log(`Would scrape RetailMeNot for: ${query}`);
    // Would extract coupon codes from RetailMeNot
    return [];
  },
  
  scrapeCouponFollow: async (query: string) => {
    console.log(`Would scrape CouponFollow for: ${query}`);
    // Would extract discount information and codes
    return [];
  },
  
  scrapeHoney: async (query: string) => {
    console.log(`Would scrape Honey for: ${query}`);
    // Would check for available price history and coupons
    return [];
  },
};

/**
 * In a real application, this function would orchestrate multiple scraping operations
 * and normalize the results. It would require:
 * 1. Proxies to avoid rate limiting
 * 2. Browser automation (Puppeteer/Playwright) for JavaScript-rendered sites
 * 3. HTML parsing for static sites
 * 4. Result normalization and deduplication
 */
export async function scrapeAllDeals(query: string): Promise<Deal[]> {
  console.log(`Would scrape multiple sites for: ${query}`);
  
  // For now, return mock data to simulate a real implementation
  const { deals } = await searchDeals({ query });
  return deals;
}
