
import { toast } from "sonner";
import { config } from "@/config/env";

// Types for the AI service
interface AISearchResponse {
  answer: string;
  sources?: string[];
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Use OpenRouter API for natural chat responses
export async function answerProductQuestion(query: string): Promise<AISearchResponse> {
  try {
    toast.info("Searching for information...", { duration: 2000 });
    
    // First, simulate web scraping to gather price and deal information
    const scrapedResults = await simulateWebScraping(query);
    
    // Only call OpenRouter API if configured
    if (config.openRouterApiKey && config.openRouterApiKey !== 'your_openrouter_api_key_here') {
      const answer = await getOpenRouterResponse(query, scrapedResults);
      return {
        answer,
        sources: scrapedResults
      };
    } else {
      // Fallback to simulated response if API key not configured
      const answer = generateSimulatedResponse(query, scrapedResults);
      return {
        answer,
        sources: scrapedResults
      };
    }
  } catch (error) {
    console.error("Error in AI search:", error);
    toast.error("Sorry, I had trouble finding that information.");
    
    return {
      answer: "I apologize, but I encountered an error while searching for information about your query. Please try again or rephrase your question.",
      sources: []
    };
  }
}

// Simulate web scraping from multiple deal sites
async function simulateWebScraping(query: string): Promise<string[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const queryLower = query.toLowerCase();
  const results: string[] = [];
  
  // Simulate different sources with more realistic scraped content
  const sources = [
    { name: "PriceRunner", probability: 0.9 },
    { name: "Slickdeals", probability: 0.85 },
    { name: "RetailMeNot", probability: 0.8 },
    { name: "CouponFollow", probability: 0.75 },
    { name: "Honey", probability: 0.7 },
  ];
  
  // Product-specific responses
  if (queryLower.includes("airpods") || queryLower.includes("airpod")) {
    results.push("PriceRunner: Apple AirPods Pro (2nd Gen) prices range from $189.99-$249.00 across 24 retailers. Lowest at Amazon.");
    results.push("Slickdeals: DEAL ALERT: Apple AirPods Pro for $179.00 at Walmart with code AUDIO20 until Apr 30.");
    results.push("RetailMeNot: Amazon offering $60 off AirPods Pro with Prime membership, bringing price to $189.00.");
    results.push("CouponFollow: Best Buy coupon 'AUDIO15' gives additional 5% off AirPods, confirmed working today.");
  }
  else if (queryLower.includes("gaming laptop") || queryLower.includes("laptop for gaming")) {
    results.push("PriceRunner: ASUS ROG Strix G15 (RTX 4060) prices from $1,199-$1,699 across 18 retailers.");
    results.push("Slickdeals: HOT! MSI Katana gaming laptop with RTX 4060 for $899 at Best Buy (50+ upvotes).");
    results.push("RetailMeNot: Lenovo offering 15% student discount on all Legion gaming laptops with code 'STUDENT15'.");
    results.push("Honey: Automatically applied $150 coupon on Dell G15 at Dell.com, dropping price to $799.99.");
  }
  else if (queryLower.includes("kitchen") || queryLower.includes("appliance")) {
    results.push("PriceRunner: Ninja Foodi Smart XL Grill price history shows current $159.99 is 47% below average.");
    results.push("Slickdeals: KitchenAid Stand Mixer Professional 5qt for $279.99 at Target (regular $429.99).");
    results.push("RetailMeNot: Bed Bath and Beyond 20% off single item coupon applicable to most kitchen appliances.");
    results.push("CouponFollow: Instant Pot Duo 7-in-1 price dropped to $69.99 on Amazon, historically low price.");
  }
  else {
    // Generic product analysis for other queries
    results.push(`PriceRunner: Found ${Math.floor(Math.random() * 30) + 10} retailers selling "${query}" with prices ranging from $${Math.floor(Math.random() * 100) + 50} to $${Math.floor(Math.random() * 300) + 200}.`);
    results.push(`Slickdeals: ${Math.floor(Math.random() * 10)} active community deals for "${query}" with the hottest at ${Math.floor(Math.random() * 50) + 10} upvotes.`);
    results.push(`RetailMeNot: ${Math.floor(Math.random() * 5) + 1} active coupon codes for "${query}" with success rates between 70-95%.`);
    results.push(`CouponFollow: Recent price drop for "${query}" detected at ${["Amazon", "Walmart", "Target", "Best Buy"][Math.floor(Math.random() * 4)]}, now ${Math.floor(Math.random() * 30) + 10}% below average.`);
  }
  
  return results;
}

// Call OpenRouter API to generate a response
async function getOpenRouterResponse(query: string, scrapedResults: string[]): Promise<string> {
  try {
    const messages: OpenRouterMessage[] = [
      {
        role: "system",
        content: `You are a helpful shopping assistant that helps users find deals and answer product questions.
        You respond in a natural, conversational way. Be helpful and informative but concise.
        Provide specific product recommendations based on the web search results provided.
        If the search results mention prices, retailers, or discounts, include those details in your response.
        Don't mention that you're an AI or that you've received search results.`
      },
      {
        role: "user",
        content: query
      }
    ];

    // If we have scraped results, add them to the context
    if (scrapedResults.length > 0) {
      messages.splice(1, 0, {
        role: "system",
        content: `Web search results:\n${scrapedResults.join('\n')}`
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus:beta",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    // Fallback to simulated response if API call fails
    return generateSimulatedResponse(query, scrapedResults);
  }
}

// Generate a simulated response if API key is not configured
function generateSimulatedResponse(query: string, scrapedResults: string[]): string {
  const queryLower = query.toLowerCase();
  
  // Create a natural-sounding response based on the scraped results
  if (scrapedResults.length > 0) {
    const introduction = "Based on what I found across different sites:";
    const details = scrapedResults.map(result => {
      // Extract the actual information without the source name
      const parts = result.split(': ');
      return parts.length > 1 ? parts.slice(1).join(': ') : result;
    }).join('\n\n');
    
    if (queryLower.includes("airpods") || queryLower.includes("airpod")) {
      return `${introduction}\n\nThe best deal on AirPods Pro right now appears to be at Walmart for $179.00 with code AUDIO20, which is significantly below the typical retail price of $249.00.\n\nAmazon also has them for $189.99 if you have Prime, and Best Buy offers an additional 5% off with code AUDIO15.\n\nWould you like me to find more specific information about any of these deals?`;
    }
    else if (queryLower.includes("gaming laptop")) {
      return `${introduction}\n\nThere's a highly-rated deal on the MSI Katana with an RTX 4060 at Best Buy for $899, which is an excellent price for those specs.\n\nFor higher-end options, the ASUS ROG Strix G15 is available starting at $1,199 across several retailers.\n\nIf you're a student, Lenovo is offering 15% off their Legion gaming laptops with code 'STUDENT15'.\n\nWhat's your budget range for a gaming laptop?`;
    }
    else {
      return `${introduction}\n\n${details}\n\nIs there any specific aspect you'd like more information about?`;
    }
  }
  
  // Generic response if no scraped results
  return `I searched for information about "${query}" but couldn't find specific deals at the moment. Could you tell me more about what features or price range you're looking for?`;
}
