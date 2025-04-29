import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Homes Better Hands</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Our Platform</h2>
            <p className="mb-4">Your one-stop solution for real estate transactions, services, and marketplace.</p>
            <div className="flex justify-center">
              <Link href="/api/db-test" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Test Database Connection
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Main Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Progress tracking for transactions</li>
              <li>Service marketplace for professionals</li>
              <li>Property listings and management</li>
              <li>Calendar integration for appointments</li>
              <li>User profiles and messaging</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Progress", "Services", "Marketplace", "Calendar", "Profile"].map((section) => (
            <Link
              key={section}
              href={`/${section.toLowerCase()}`}
              className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center"
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
