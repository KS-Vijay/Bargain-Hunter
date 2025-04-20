
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-8 w-full">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
      <span className="ml-4 text-lg font-medium text-gray-700">Hunting for deals...</span>
    </div>
  );
};

export default LoadingSpinner;
