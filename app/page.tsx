import Link from "next/link"

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Real Estate Hub</h1>
        <p className="text-xl text-gray-600 mb-8">Your one-stop platform for real estate transactions and services</p>
        <div className="space-x-4">
          <Link
            href="/marketplace"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
          <Link
            href="/marketplace"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            List Property
          </Link>
        </div>
      </div>
    </div>
  )
}
