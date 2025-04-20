
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Deal } from "@/types";
import { ArrowRight, Tag, Percent, ExternalLink, Clock, Star } from "lucide-react";
import { toast } from "sonner";

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const discountAmount = deal.originalPrice - deal.price;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(deal.price);
  
  const formattedOriginalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(deal.originalPrice);
  
  const formattedDiscount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(discountAmount);

  const isExpiringSoon = deal.expiryDate && new Date(deal.expiryDate).getTime() - new Date().getTime() < 86400000 * 3; // 3 days
  
  const copyCode = () => {
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode);
      toast.success(`Coupon code "${deal.couponCode}" copied to clipboard!`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{deal.title}</CardTitle>
          <div className="flex items-center space-x-2">
            {deal.isHot && (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                Hot Deal 🔥
              </Badge>
            )}
            <Badge className="bg-primary text-white">
              <Percent className="mr-1 h-3 w-3" />
              {deal.discountPercentage}% off
            </Badge>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>From {deal.merchant}</span>
          {deal.rating && (
            <span className="ml-2 flex items-center">
              • <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" /> {deal.rating}
            </span>
          )}
          {deal.affiliateEnabled && (
            <Badge variant="outline" className="ml-2 text-xs">Affiliate</Badge>
          )}
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {deal.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">{formattedPrice}</span>
            <span className="ml-2 text-base line-through text-gray-500">{formattedOriginalPrice}</span>
            <span className="ml-2 text-sm text-green-600">Save {formattedDiscount}</span>
          </div>
          
          {deal.couponCode && (
            <div className="flex items-center mt-2">
              <div className="flex-1 flex items-center bg-gray-100 border border-dashed border-gray-300 rounded-lg p-2">
                <Tag className="h-4 w-4 text-primary mr-2" />
                <span className="font-mono font-medium">{deal.couponCode}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyCode} 
                className="ml-2 whitespace-nowrap"
              >
                Copy
              </Button>
            </div>
          )}
          
          {deal.expiryDate && (
            <div className="text-sm flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span className={`font-medium ${isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
                {isExpiringSoon ? 'Expires soon: ' : 'Valid until: '}
                {new Date(deal.expiryDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <a href={deal.url} target="_blank" rel="noopener noreferrer">
            Get Deal <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DealCard;
