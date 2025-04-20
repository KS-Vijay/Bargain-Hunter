
import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";

// Types for the AI service
interface AISearchResponse {
  answer: string;
  sources?: string[];
}

// Flag to track if the model is loading
let isModelLoading = false;
let generationModel: any = null;

// Initialize the model
export const initializeModel = async () => {
  try {
    if (!generationModel && !isModelLoading) {
      isModelLoading = true;
      toast.info("Loading AI model...", { duration: 2000 });
      
      // Load a lightweight model for text generation
      generationModel = await pipeline(
        "text-generation",
        "Xenova/distilgpt2",
        { device: "cpu" }
      );
      
      isModelLoading = false;
      toast.success("AI model loaded successfully!", { duration: 2000 });
    }
    return true;
  } catch (error) {
    console.error("Failed to load AI model:", error);
    isModelLoading = false;
    toast.error("Failed to load AI model. Using fallback mode.");
    return false;
  }
};

// Simulate web search results for product questions
const simulateWebSearch = async (query: string): Promise<string[]> => {
  // This would be replaced with a real web search API in a production app
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  // Predefined responses for common product queries
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes("airpods pro") || queryLower.includes("airpod")) {
    return [
      "The Apple AirPods Pro (2nd Generation) are currently on sale for $189.99 on Amazon (regular price $249.00).",
      "Best Buy has the AirPods Pro for $199.99 with their rewards program offering $10 back in rewards.",
      "Walmart occasionally drops the price of AirPods Pro to $179.00 during major sale events.",
      "Target has AirPods Pro for $199.99 with an additional 5% off for RedCard holders."
    ];
  }
  
  if (queryLower.includes("gaming laptop") || queryLower.includes("laptop for gaming")) {
    return [
      "The ASUS ROG Strix G15 is currently on sale for $1,299 (originally $1,699) on Amazon with excellent performance reviews.",
      "Dell G15 Gaming Laptop is available for $799.99 at Best Buy, featuring an RTX 3050 and Ryzen 5 processor.",
      "The Lenovo Legion 5 Pro is rated as one of the best value gaming laptops at $1,199 on the Lenovo website.",
      "MSI GF63 Thin is one of the most affordable gaming laptops at $649 at Walmart."
    ];
  }
  
  if (queryLower.includes("kitchen appliance") || queryLower.includes("air fryer") || queryLower.includes("mixer")) {
    return [
      "The Ninja Foodi 12-in-1 Smart Air Fryer is on sale for $159.99 (regularly $299.99) at Walmart.",
      "KitchenAid Stand Mixers are 38% off on Amazon right now, dropping from $449.99 to $279.99.",
      "Instant Pot Duo 7-in-1 is available for $69.99 (regular $99.99) at Target right now.",
      "Cuisinart food processors are on sale at Bed Bath & Beyond, with the 8-cup model at $79.99."
    ];
  }
  
  if (queryLower.includes("amazon") && queryLower.includes("coupon")) {
    return [
      "Amazon currently offers 20% off coupons for many household essentials when you subscribe.",
      "There are 242 active coupon deals on Amazon electronics section right now.",
      "Amazon Prime members can access exclusive coupon deals in the 'Just for Prime' section.",
      "Amazon's coupon page currently lists over 9,000 active coupons across all categories."
    ];
  }
  
  // Generic response for other queries
  return [
    `Found 237 results for "${query}" across major retailers.`,
    `Best prices for "${query}" range from $49.99 to $299.99 depending on brand and features.`,
    `Most highly-rated ${query} products are from Samsung, Apple, and Sony based on consumer reviews.`,
    `Recent price drops for "${query}" have been spotted on Amazon, Walmart, and Best Buy.`
  ];
};

// Generate a response from the AI model
const generateAIResponse = async (query: string, searchResults: string[]): Promise<string> => {
  try {
    if (generationModel) {
      // Create a prompt that combines the query and search results
      const prompt = `
Question: ${query}
Web search results:
${searchResults.map((result, index) => `${index + 1}. ${result}`).join('\n')}

Based on the web search results, the best answer is:`;

      // Generate response with the model
      const result = await generationModel(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
      });
      
      let response = result[0].generated_text;
      
      // Extract only the new text that was generated (after the prompt)
      response = response.substring(prompt.length).trim();
      
      // Fallback in case of poor generation
      if (response.length < 20) {
        return formatSearchResults(searchResults);
      }
      
      return response;
    } else {
      // Fallback if the model isn't loaded
      return formatSearchResults(searchResults);
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return formatSearchResults(searchResults);
  }
};

// Format search results into a coherent response if AI fails
const formatSearchResults = (searchResults: string[]): string => {
  return `Based on my research, here's what I found:\n\n${searchResults.join('\n\n')}`;
};

// Main function to answer product questions
export async function answerProductQuestion(query: string): Promise<AISearchResponse> {
  try {
    // Initialize the model if not already done
    await initializeModel();
    
    // Show searching message
    toast.info("Searching the web for the best deals...", { duration: 2000 });
    
    // Simulate searching the web
    const searchResults = await simulateWebSearch(query);
    
    // Generate AI response based on search results
    const answer = await generateAIResponse(query, searchResults);
    
    return {
      answer,
      sources: searchResults
    };
  } catch (error) {
    console.error("Error in AI search:", error);
    toast.error("Sorry, I had trouble finding that information.");
    
    return {
      answer: "I apologize, but I encountered an error while searching for information about your query. Please try again or rephrase your question.",
      sources: []
    };
  }
}
