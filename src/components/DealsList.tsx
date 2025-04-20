
import { Deal } from "@/types";
import DealCard from "./DealCard";
import { Button } from "@/components/ui/button";

interface DealsListProps {
  deals: Deal[];
  total: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const DealsList = ({ deals, total, loading, hasMore, onLoadMore }: DealsListProps) => {
  if (deals.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">No deals found</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Try searching for a different product or check back later for new deals.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {deals.length > 0 && `Showing ${deals.length} of ${total} deals`}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={onLoadMore} 
            variant="outline" 
            size="lg" 
            disabled={loading}
            className="px-8"
          >
            {loading ? "Loading..." : "Load more deals"}
          </Button>
        </div>
      )}
    </>
  );
};

export default DealsList;
