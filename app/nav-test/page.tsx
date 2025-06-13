export default function NavTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Navigation Test</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Mobile Navigation</h2>
          <p className="text-gray-600 mb-4">
            On mobile devices (screen width less than 768px), you should see a bottom navigation bar with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Progress</li>
            <li>Services</li>
            <li>Marketplace</li>
            <li>Calendar</li>
            <li>Profile</li>
            <li>Messages (if logged in)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Desktop Navigation</h2>
          <p className="text-gray-600 mb-4">
            On desktop devices (screen width 768px or more), you should see a top navigation bar with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Horizontal navigation items</li>
            <li>User profile dropdown</li>
            <li>Quick access buttons</li>
            <li>Enhanced hover effects</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
          <p className="text-gray-700">
            Try resizing your browser window or viewing on different devices to see the navigation adapt automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
