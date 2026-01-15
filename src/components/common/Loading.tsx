// src/components/common/Loading.tsx

export default function Loading() {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 text-sm text-center">Loading...</p>
        </div>
      </div>
    );
  }
  
  // src/components/common/MovieCardSkeleton.tsx
  
  export function MovieCardSkeleton() {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
        <div className="aspect-[2/3] bg-gray-700"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }