interface QualityPageProps {
    params: {
      quality: string;
    };
  }
  
  export default function QualityPage({ params }: QualityPageProps) {
    const quality = decodeURIComponent(params.quality);
  
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-500 uppercase">
          {quality} Movies
        </h1>
  
        <p className="text-gray-300 mb-6">
          Download movies in <strong>{quality}</strong> quality with fast servers
          and multiple formats.
        </p>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h2 className="text-sm font-semibold">
                Sample Movie {item}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {quality} • 1.5GB
              </p>
            </div>
          ))}
        </div>
  
        <p className="mt-8 text-xs text-gray-500">
          Note: We do not host any files. All download links are indexed from
          third-party sources.
        </p>
      </main>
    );
  }
  