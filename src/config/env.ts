
// Environment variables configuration
export const config = {
  openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || 'your_openrouter_api_key_here',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || 'your_gemini_api_key_here',
};

// Check if API keys are configured
export const isConfigured = () => {
  return config.openRouterApiKey && config.openRouterApiKey !== 'your_openrouter_api_key_here';
};
