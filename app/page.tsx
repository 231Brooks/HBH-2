import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 z-10 text-center">
          <p className="text-sm text-gray-500 mb-2">*your finances are secure</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="maybe-gradient-text">5Sense</span> is a fully* open-source <br />
            OS for your personal finances
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Built by a small team alongside an incredible community
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <input type="email" placeholder="Enter your email address" className="maybe-input w-full pr-24" />
              <Button className="absolute right-1 top-1 bottom-1 bg-maybe-purple hover:bg-opacity-90">
                Join waitlist
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Don't want to wait?{" "}
              <Link href="/login" className="text-maybe-purple hover:underline">
                Self-host
              </Link>{" "}
              an early version of 5Sense.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-maybe-light-gray">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Get a complete overview of your finances in one place. Track your net worth, income, spending, and
                  investments.
                </p>
                <Button className="bg-maybe-purple hover:bg-opacity-90">
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
              <div className="md:w-2/3">
                <div className="bg-gray-50 rounded-lg h-[400px] flex items-center justify-center">
                  <p className="text-gray-400">Dashboard preview image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-maybe-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-maybe-purple h-8 w-8"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Services</h3>
              <p className="text-gray-500 mb-4">
                Access a wide range of professional services from our vetted freelancers and experts.
              </p>
              <Button variant="link" asChild className="text-maybe-purple hover:text-maybe-purple/80">
                <Link href="/login" className="flex items-center justify-center gap-1">
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-maybe-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-maybe-blue h-8 w-8"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-500 mb-4">Shop our curated selection of high-quality print-on-demand products.</p>
              <Button variant="link" asChild className="text-maybe-blue hover:text-maybe-blue/80">
                <Link href="/login" className="flex items-center justify-center gap-1">
                  Browse Products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-maybe-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-maybe-teal h-8 w-8"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Investment Opportunities</h3>
              <p className="text-gray-500 mb-4">Invest in future resource centers and track your portfolio growth.</p>
              <Button variant="link" asChild className="text-maybe-teal hover:text-maybe-teal/80">
                <Link href="/login" className="flex items-center justify-center gap-1">
                  Start Investing <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-maybe-dark py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-maybe-purple to-maybe-blue">
                  <span className="text-lg font-bold text-white">5</span>
                </div>
                <span className="text-xl font-bold text-white">5Sense</span>
              </Link>
              <p className="text-sm text-gray-400">
                Your all-in-one platform for services, products, and investments in future resource centers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-maybe-purple">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#products" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#invest" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Invest
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Sales
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-400 hover:text-maybe-purple">
                    Partnerships
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">© 2025 5Sense. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-maybe-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-maybe-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-maybe-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
