export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-16 z-10 bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block space-y-6 bg-white p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border border-gray-200">
                <div className="h-10 w-full md:w-[300px] bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-[180px] bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-[300px] bg-gray-200 rounded animate-pulse"></div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
