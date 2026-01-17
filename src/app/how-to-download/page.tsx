export default function HowToDownloadPage() {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-red-500">
          How to Download Movies
        </h1>
  
        <ol className="space-y-4 text-gray-300 list-decimal list-inside">
          <li>
            Browse the website and open the movie you want to download.
          </li>
          <li>
            Scroll down to the <strong>Download Links</strong> section.
          </li>
          <li>
            Choose a server and quality (480p / 720p / 1080p).
          </li>
          <li>
            Click the download button and wait for the redirect.
          </li>
          <li>
            Close any extra tabs and start the download from the final page.
          </li>
        </ol>
  
        <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-900">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">
            Important Note
          </h2>
          <p className="text-sm text-gray-400">
            We do not host any files on our servers. All files are provided by
            third-party services. If you face any issues, try switching servers
            or using a different browser.
          </p>
        </div>
      </main>
    );
  }
  