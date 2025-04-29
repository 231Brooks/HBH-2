export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Homes in Better Hands</h1>
      <p className="mb-4">Welcome to our real estate platform. We're currently under maintenance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <p>Track your real estate transactions and progress.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Services</h2>
          <p>Find professional services for your real estate needs.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
          <p>Browse properties and connect with sellers.</p>
        </div>
      </div>
    </div>
  )
}
