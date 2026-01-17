interface YearPageProps {
    params: {
      year: string;
    };
  }
  
  export default function YearPage({ params }: YearPageProps) {
    const year = decodeURIComponent(params.year);
  
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Movies Released in {year}
        </h1>
  
        <p className="text-gray-300 mb-6">
          Explore movies released in <strong>{year}</strong> across all genres
          and languages.
        </p>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h2 className="text-sm font-semibold">
                Sample {year} Movie {item}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Action • 720p
              </p>
            </div>
          ))}
        </div>
  
        <p className="mt-8 text-xs text-gray-500">
          Disclaimer: Movie details are for informational purposes only.
        </p>
      </main>
    );
  }
  