
export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  merchant: string;
  merchantLogo?: string;
  url: string;
  couponCode?: string;
  expiryDate?: string;
  category: string;
  isHot?: boolean;
  rating?: number;
  affiliateEnabled?: boolean;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  hasMore: boolean;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
}
