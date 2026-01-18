// src/app/admin/isr-monitor/page.tsx
// DEVELOPMENT ONLY - Monitor ISR behavior

import { getTotalMovieCount, getCacheStats } from '@/lib/controllers/movieISRController';

export const dynamic = 'force-dynamic'; // This page should NOT be cached

export default async function ISRMonitorPage() {
  const totalMovies = await getTotalMovieCount();
  const cacheStats = getCacheStats();
  
  const buildInfo = {
    nodeEnv: process.env.NODE_ENV,
    nextVersion: process.env.npm_package_dependencies_next || 'unknown',
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 ISR Monitoring Dashboard</h1>
        
        {/* Build Information */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Build Information</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">Environment:</span>
                <span className="ml-2 text-green-400">{buildInfo.nodeEnv}</span>
              </div>
              <div>
                <span className="text-gray-400">Next.js Version:</span>
                <span className="ml-2 text-blue-400">{buildInfo.nextVersion}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Current Time:</span>
                <span className="ml-2 text-yellow-400">{buildInfo.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">💾 Database Statistics</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-gray-400">Total Movies:</span>
              <span className="ml-2 text-green-400 text-2xl font-bold">
                {totalMovies.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="text-gray-300">
                📝 <strong>Note:</strong> At build time, Next.js will pre-render the top 2,000 movies.
                The remaining {(totalMovies - 2000).toLocaleString()} movies will use on-demand ISR.
              </p>
            </div>
          </div>
        </div>

        {/* Cache Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🗂️ In-Memory Cache</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400">Cached Items:</span>
                <span className="ml-2 text-blue-400">{cacheStats.size}</span>
              </div>
              <div>
                <span className="text-gray-400">Max Size:</span>
                <span className="ml-2 text-yellow-400">{cacheStats.maxSize}</span>
              </div>
              <div>
                <span className="text-gray-400">TTL:</span>
                <span className="ml-2 text-green-400">{cacheStats.ttl}s</span>
              </div>
            </div>
            
            {cacheStats.size > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 mb-2">Recently Cached Movie IDs:</p>
                <div className="bg-gray-700 p-3 rounded max-h-40 overflow-y-auto">
                  <code className="text-xs text-green-300">
                    {cacheStats.entries.slice(-10).join('\n')}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ISR Configuration */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔧 ISR Configuration</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Movie Detail Pages (/movie/[id])</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ <span className="text-gray-400">revalidate:</span> <span className="text-green-400">3600 seconds (1 hour)</span></li>
                <li>✅ <span className="text-gray-400">dynamicParams:</span> <span className="text-green-400">true</span></li>
                <li>✅ <span className="text-gray-400">dynamic:</span> <span className="text-green-400">force-static</span></li>
                <li>✅ <span className="text-gray-400">Pre-rendered at build:</span> <span className="text-green-400">2,000 pages</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Verify ISR */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔍 How to Verify ISR is Working</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Check Build Logs</h3>
              <p className="text-gray-300 mb-2">During <code className="bg-gray-700 px-2 py-1 rounded">npm run build</code>, look for:</p>
              <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                <div>🚀 ISR BUILD: Generating static params for movie pages...</div>
                <div>✅ ISR BUILD: Pre-rendering 2000 static pages at build time</div>
                <div>○ /movie/[id] (2000 pages) ... XXms</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Check Server Logs</h3>
              <p className="text-gray-300 mb-2">When accessing pages, look for:</p>
              <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                <div>🔍 ISR FETCH: getMovieForISR called</div>
                <div>💾 CACHE HIT (for subsequent requests within revalidation period)</div>
                <div>💿 DATABASE QUERY (for first request or after revalidation)</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Check Response Headers</h3>
              <p className="text-gray-300 mb-2">Use browser DevTools Network tab:</p>
              <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                <div>x-nextjs-cache: HIT (page served from cache)</div>
                <div>x-nextjs-cache: STALE (cache expired, regenerating)</div>
                <div>x-nextjs-cache: MISS (not in cache, generating)</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Test Cache Behavior</h3>
              <ol className="list-decimal ml-5 space-y-1 text-gray-300">
                <li>Visit a movie page: <code className="bg-gray-700 px-2 py-1 rounded">/movie/[some-id]</code></li>
                <li>Check logs - should see "DATABASE QUERY"</li>
                <li>Refresh the page immediately - should see "CACHE HIT" (faster response)</li>
                <li>Wait 1+ hours and refresh - should see "STALE" then regenerate</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Testing Commands */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🧪 Testing Commands</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-gray-400 mb-1"># Build and check ISR</p>
              <code className="text-green-400">npm run build</code>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-gray-400 mb-1"># Start production server</p>
              <code className="text-green-400">npm run start</code>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-gray-400 mb-1"># Check response headers</p>
              <code className="text-green-400">curl -I http://localhost:3000/movie/[movie-id]</code>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="mt-6 bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-200">
            ⚠️ <strong>Important:</strong> This monitoring page is for development only. 
            Remove or protect it before deploying to production!
          </p>
        </div>
      </div>
    </div>
  );
}