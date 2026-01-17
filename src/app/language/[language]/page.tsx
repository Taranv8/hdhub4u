interface LanguagePageProps {
    params: {
      languages: string;
    };
  }
  
  export default function LanguagePage({ params }: LanguagePageProps) {
    const language = decodeURIComponent(params.languages);
  
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-500 capitalize">
          {language} Movies
        </h1>
  
        <p className="text-gray-300 mb-6">
          Browse and download the latest <strong>{language}</strong> movies in
          different qualities such as 480p, 720p, and 1080p.
        </p>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Demo cards */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h2 className="text-sm font-semibold">
                Sample {language} Movie {item}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                720p • 1.2GB
              </p>
            </div>
          ))}
        </div>
  
        <p className="mt-8 text-xs text-gray-500">
          Disclaimer: We do not host any files on our server. All content is
          provided by third-party sources.
        </p>
      </main>
    );
  }
  