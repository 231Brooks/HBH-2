import Link from "next/link"
import { ChevronRight, FileText, Key, Lock, Settings, User, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ManualPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-6 w-6" />
        <h1 className="text-3xl font-bold">5Sense Platform User Manual</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Contents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium">
                <ChevronRight className="h-4 w-4" />
                <a href="#getting-started" className="hover:underline">
                  Getting Started
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#system-requirements" className="hover:underline text-sm">
                  System Requirements
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#account-creation" className="hover:underline text-sm">
                  Account Creation
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#user-authentication" className="hover:underline">
                  User Authentication
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#login-process" className="hover:underline text-sm">
                  Login Process
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#password-recovery" className="hover:underline text-sm">
                  Password Recovery
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#platform-features" className="hover:underline">
                  Platform Features
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#investments" className="hover:underline text-sm">
                  Investments
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#choirs" className="hover:underline text-sm">
                  Choirs
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4 opacity-0" />
                <a href="#shop" className="hover:underline text-sm">
                  Shop
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#account-management" className="hover:underline">
                  Account Management
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#admin-guide" className="hover:underline">
                  Admin Guide
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#troubleshooting" className="hover:underline">
                  Troubleshooting
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ChevronRight className="h-4 w-4" />
                <a href="#technical-reference" className="hover:underline">
                  Technical Reference
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Card>
            <CardContent className="p-6 space-y-8">
              {/* Getting Started */}
              <section id="getting-started">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Getting Started
                </h2>
                <p className="mb-4">
                  Welcome to the 5Sense Platform! This comprehensive manual will guide you through all aspects of using
                  our platform, from creating an account to managing your investments, choirs, and shopping activities.
                </p>

                <h3 id="system-requirements" className="text-xl font-semibold mt-6 mb-3">
                  System Requirements
                </h3>
                <p className="mb-4">
                  The 5Sense Platform is a web-based application that works on most modern devices with an internet
                  connection. For the best experience, we recommend:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>A modern web browser (Chrome, Firefox, Safari, or Edge - latest versions)</li>
                  <li>Stable internet connection</li>
                  <li>Screen resolution of at least 1280x720</li>
                  <li>JavaScript enabled</li>
                </ul>

                <h3 id="account-creation" className="text-xl font-semibold mt-6 mb-3">
                  Account Creation
                </h3>
                <p className="mb-4">To create a new account on the 5Sense Platform:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Navigate to the{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                      Sign Up
                    </Link>{" "}
                    page
                  </li>
                  <li>Enter your personal information (name, email, etc.)</li>
                  <li>Create a strong password (at least 8 characters with a mix of letters, numbers, and symbols)</li>
                  <li>Review and accept the Terms of Service and Privacy Policy</li>
                  <li>Click the "Create Account" button</li>
                  <li>Verify your email address by clicking the link sent to your email</li>
                </ol>

                <Alert className="mb-4">
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Keep your login credentials secure and never share them with others. 5Sense will never ask for your
                    password via email or phone.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator />

              {/* User Authentication */}
              <section id="user-authentication">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  User Authentication
                </h2>
                <p className="mb-4">
                  The 5Sense Platform uses a secure authentication system to protect your account and personal
                  information.
                </p>

                <h3 id="login-process" className="text-xl font-semibold mt-6 mb-3">
                  Login Process
                </h3>
                <p className="mb-4">To log in to your 5Sense account:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Navigate to the{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Login
                    </Link>{" "}
                    page
                  </li>
                  <li>Enter your registered email address</li>
                  <li>Enter your password</li>
                  <li>Click the "Log In" button</li>
                </ol>

                <div className="bg-muted p-4 rounded-md mb-4">
                  <h4 className="font-semibold mb-2">Session Management</h4>
                  <p>
                    For security reasons, your session will automatically expire after 7 days of inactivity. You'll need
                    to log in again to continue using the platform.
                  </p>
                </div>

                <h3 id="password-recovery" className="text-xl font-semibold mt-6 mb-3">
                  Password Recovery
                </h3>
                <p className="mb-4">If you forget your password:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Click on the "Forgot password?" link on the{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Login
                    </Link>{" "}
                    page
                  </li>
                  <li>Enter your registered email address</li>
                  <li>Click "Send Reset Link"</li>
                  <li>Check your email for a password reset link</li>
                  <li>Click the link and follow the instructions to create a new password</li>
                </ol>

                <Alert className="mb-4">
                  <AlertTitle>Security Tip</AlertTitle>
                  <AlertDescription>
                    Change your password regularly and avoid using the same password across multiple websites or
                    services.
                  </AlertDescription>
                </Alert>
              </section>

              <Separator />

              {/* Platform Features */}
              <section id="platform-features">
                <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
                <p className="mb-4">
                  The 5Sense Platform offers a variety of features to help you manage your investments, participate in
                  choirs, and shop for products and services.
                </p>

                <Tabs defaultValue="investments" className="mt-6">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="investments">Investments</TabsTrigger>
                    <TabsTrigger value="choirs">Choirs</TabsTrigger>
                    <TabsTrigger value="shop">Shop</TabsTrigger>
                  </TabsList>

                  <TabsContent value="investments" id="investments">
                    <Card>
                      <CardHeader>
                        <CardTitle>Investments</CardTitle>
                        <CardDescription>
                          Manage your investment portfolio and explore new investment opportunities.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <h4 className="font-semibold">Key Features:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>View and manage your investment portfolio</li>
                          <li>Track performance of individual investments</li>
                          <li>Explore new investment opportunities in companies and resource centers</li>
                          <li>Buy and sell investments</li>
                          <li>View detailed analytics and reports</li>
                        </ul>

                        <h4 className="font-semibold mt-4">How to Get Started:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>
                            Navigate to the{" "}
                            <Link href="/invest" className="text-primary hover:underline">
                              Investments
                            </Link>{" "}
                            page
                          </li>
                          <li>Browse available investment opportunities</li>
                          <li>Click on an investment to view details</li>
                          <li>Use the "Buy Investment" button to make a purchase</li>
                          <li>Track your investments in the "Portfolio" tab</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="choirs" id="choirs">
                    <Card>
                      <CardHeader>
                        <CardTitle>Choirs</CardTitle>
                        <CardDescription>Find and participate in community service opportunities.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <h4 className="font-semibold">Key Features:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Browse available tasks based on your qualifications</li>
                          <li>Accept and complete tasks</li>
                          <li>Communicate with clients</li>
                          <li>Track your completed tasks and earnings</li>
                          <li>Receive ratings and build your reputation</li>
                        </ul>

                        <h4 className="font-semibold mt-4">How to Get Started:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>
                            Navigate to the{" "}
                            <Link href="/choirs" className="text-primary hover:underline">
                              Choirs
                            </Link>{" "}
                            page
                          </li>
                          <li>Browse available tasks that match your qualifications</li>
                          <li>Click on a task to view details</li>
                          <li>Use the "Accept Task" button to take on a task</li>
                          <li>Communicate with the client using the messaging system</li>
                          <li>Complete the task and mark it as completed</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="shop" id="shop">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shop</CardTitle>
                        <CardDescription>
                          Browse and purchase products and services from our marketplace.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <h4 className="font-semibold">Key Features:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Browse products and services</li>
                          <li>Filter by category, price, and ratings</li>
                          <li>Add items to your cart</li>
                          <li>Secure checkout process</li>
                          <li>Track your orders</li>
                          <li>Leave reviews for purchased items</li>
                        </ul>

                        <h4 className="font-semibold mt-4">How to Get Started:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>
                            Navigate to the{" "}
                            <Link href="/shop" className="text-primary hover:underline">
                              Shop
                            </Link>{" "}
                            page
                          </li>
                          <li>Browse products and services by category</li>
                          <li>Use filters to narrow down your search</li>
                          <li>Click on an item to view details</li>
                          <li>Add items to your cart</li>
                          <li>Proceed to checkout when ready</li>
                          <li>Enter shipping and payment information</li>
                          <li>Confirm your order</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              <Separator />

              {/* Account Management */}
              <section id="account-management">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Management
                </h2>
                <p className="mb-4">
                  Managing your 5Sense account is easy. You can update your personal information, change your password,
                  and manage your notification preferences.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Profile Settings</h3>
                <p className="mb-4">To update your profile information:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Navigate to the{" "}
                    <Link href="/settings" className="text-primary hover:underline">
                      Settings
                    </Link>{" "}
                    page
                  </li>
                  <li>Click on the "Account" tab</li>
                  <li>Update your personal information</li>
                  <li>Click "Save Changes"</li>
                </ol>

                <h3 className="text-xl font-semibold mt-6 mb-3">Security Settings</h3>
                <p className="mb-4">To change your password or update security settings:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Navigate to the{" "}
                    <Link href="/settings" className="text-primary hover:underline">
                      Settings
                    </Link>{" "}
                    page
                  </li>
                  <li>Click on the "Account" tab</li>
                  <li>Scroll down to the "Password" section</li>
                  <li>Enter your current password</li>
                  <li>Enter and confirm your new password</li>
                  <li>Click "Save Changes"</li>
                </ol>

                <h3 className="text-xl font-semibold mt-6 mb-3">Notification Preferences</h3>
                <p className="mb-4">To manage your notification preferences:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>
                    Navigate to the{" "}
                    <Link href="/settings" className="text-primary hover:underline">
                      Settings
                    </Link>{" "}
                    page
                  </li>
                  <li>Click on the "Notifications" tab</li>
                  <li>Toggle on/off the types of notifications you want to receive</li>
                  <li>Click "Save Preferences"</li>
                </ol>
              </section>

              <Separator />

              {/* Admin Guide */}
              <section id="admin-guide">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Guide
                </h2>
                <p className="mb-4">
                  This section is for platform administrators who manage users, content, and system settings.
                </p>

                <Alert className="mb-4">
                  <AlertTitle>Admin Access Required</AlertTitle>
                  <AlertDescription>
                    You need administrator privileges to access the features described in this section.
                  </AlertDescription>
                </Alert>

                <h3 className="text-xl font-semibold mt-6 mb-3">User Management</h3>
                <p className="mb-4">As an administrator, you can:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>View all registered users</li>
                  <li>Create new user accounts</li>
                  <li>Edit user information</li>
                  <li>Disable or delete user accounts</li>
                  <li>Reset user passwords</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Content Management</h3>
                <p className="mb-4">Administrators can manage platform content:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Add, edit, or remove investment opportunities</li>
                  <li>Manage choir tasks and assignments</li>
                  <li>Add, edit, or remove products and services in the shop</li>
                  <li>Moderate user-generated content</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">System Settings</h3>
                <p className="mb-4">Administrators can configure system settings:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Configure email notifications</li>
                  <li>Set up payment gateways</li>
                  <li>Manage API integrations</li>
                  <li>Configure security settings</li>
                  <li>View system logs and analytics</li>
                </ul>

                <div className="bg-muted p-4 rounded-md mb-4">
                  <h4 className="font-semibold mb-2">Admin Dashboard Access</h4>
                  <p>
                    To access the admin dashboard, navigate to{" "}
                    <code className="bg-muted-foreground/20 px-1 rounded">/admin</code> after logging in with an admin
                    account.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Troubleshooting */}
              <section id="troubleshooting">
                <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
                <p className="mb-4">
                  If you encounter issues while using the 5Sense Platform, here are some common problems and solutions.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Login Issues</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Problem: Cannot log in</h4>
                        <p className="text-muted-foreground mb-2">Possible solutions:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Verify that you're using the correct email address and password</li>
                          <li>Check if Caps Lock is turned on</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Try using a different browser</li>
                          <li>Use the "Forgot password?" link to reset your password</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold">Problem: Session expires too quickly</h4>
                        <p className="text-muted-foreground mb-2">Possible solutions:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Make sure your browser accepts cookies</li>
                          <li>Check if you're using browser extensions that clear cookies automatically</li>
                          <li>Try using a different browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Payment Issues</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Problem: Payment not processing</h4>
                        <p className="text-muted-foreground mb-2">Possible solutions:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Verify that your payment information is correct</li>
                          <li>Check if your card has sufficient funds</li>
                          <li>Contact your bank to ensure they're not blocking the transaction</li>
                          <li>Try using a different payment method</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Technical Issues</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Problem: Page not loading</h4>
                        <p className="text-muted-foreground mb-2">Possible solutions:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Check your internet connection</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Try using a different browser</li>
                          <li>Disable browser extensions that might be interfering</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold">Problem: Features not working correctly</h4>
                        <p className="text-muted-foreground mb-2">Possible solutions:</p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Make sure you're using a supported browser and version</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Try logging out and logging back in</li>
                          <li>Check if JavaScript is enabled in your browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md mt-6">
                  <h4 className="font-semibold mb-2">Contact Support</h4>
                  <p className="mb-2">
                    If you're still experiencing issues, please contact our support team for assistance:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Email:{" "}
                      <a href="mailto:support@5sense.com" className="text-primary hover:underline">
                        support@5sense.com
                      </a>
                    </li>
                    <li>Phone: 1-800-555-5555 (Monday-Friday, 9am-5pm EST)</li>
                    <li>
                      Live Chat: Available on the platform during business hours (click the chat icon in the bottom
                      right corner)
                    </li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Technical Reference */}
              <section id="technical-reference">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Technical Reference
                </h2>
                <p className="mb-4">
                  This section provides technical details about the 5Sense Platform's authentication system and database
                  structure.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Authentication System</h3>
                <p className="mb-4">
                  The 5Sense Platform uses a secure authentication system with the following components:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>Server Actions:</strong> Handles login and logout operations securely on the server side
                  </li>
                  <li>
                    <strong>Session Management:</strong> Uses HTTP-only cookies for secure session storage
                  </li>
                  <li>
                    <strong>Route Protection:</strong> Middleware ensures that authenticated users can access protected
                    routes
                  </li>
                  <li>
                    <strong>Database Integration:</strong> Authenticates users against the Neon PostgreSQL database
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Database Structure</h3>
                <p className="mb-4">
                  The 5Sense Platform uses a Neon PostgreSQL database with the following key tables:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Table</th>
                        <th className="border p-2 text-left">Description</th>
                        <th className="border p-2 text-left">Key Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">users</td>
                        <td className="border p-2">Stores user account information</td>
                        <td className="border p-2">id, email, password_hash, first_name, last_name</td>
                      </tr>
                      <tr>
                        <td className="border p-2">investments</td>
                        <td className="border p-2">Stores investment opportunities</td>
                        <td className="border p-2">id, name, description, type, price</td>
                      </tr>
                      <tr>
                        <td className="border p-2">user_investments</td>
                        <td className="border p-2">Tracks user investments</td>
                        <td className="border p-2">id, user_id, investment_id, quantity, purchase_price</td>
                      </tr>
                      <tr>
                        <td className="border p-2">choirs</td>
                        <td className="border p-2">Stores choir tasks</td>
                        <td className="border p-2">id, name, description, location, rehearsal_day</td>
                      </tr>
                      <tr>
                        <td className="border p-2">user_choirs</td>
                        <td className="border p-2">Tracks user participation in choirs</td>
                        <td className="border p-2">id, user_id, choir_id, role, join_date</td>
                      </tr>
                      <tr>
                        <td className="border p-2">products</td>
                        <td className="border p-2">Stores shop products</td>
                        <td className="border p-2">id, name, description, price, category, stock_quantity</td>
                      </tr>
                      <tr>
                        <td className="border p-2">orders</td>
                        <td className="border p-2">Tracks user orders</td>
                        <td className="border p-2">id, user_id, total_amount, status, shipping_address</td>
                      </tr>
                      <tr>
                        <td className="border p-2">order_items</td>
                        <td className="border p-2">Stores items in each order</td>
                        <td className="border p-2">id, order_id, product_id, quantity, price_per_unit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">API Endpoints</h3>
                <p className="mb-4">The 5Sense Platform provides the following key API endpoints:</p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Endpoint</th>
                        <th className="border p-2 text-left">Method</th>
                        <th className="border p-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">/api/auth/login</td>
                        <td className="border p-2">POST</td>
                        <td className="border p-2">Authenticates a user and creates a session</td>
                      </tr>
                      <tr>
                        <td className="border p-2">/api/auth/logout</td>
                        <td className="border p-2">POST</td>
                        <td className="border p-2">Ends the current user session</td>
                      </tr>
                      <tr>
                        <td className="border p-2">/api/auth/session</td>
                        <td className="border p-2">GET</td>
                        <td className="border p-2">Returns the current user session information</td>
                      </tr>
                      <tr>
                        <td className="border p-2">/api/investments</td>
                        <td className="border p-2">GET</td>
                        <td className="border p-2">Returns available investment opportunities</td>
                      </tr>
                      <tr>
                        <td className="border p-2">/api/user/settings</td>
                        <td className="border p-2">GET/PUT</td>
                        <td className="border p-2">Retrieves or updates user settings</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted p-4 rounded-md mt-6">
                  <h4 className="font-semibold mb-2">Developer Resources</h4>
                  <p className="mb-2">
                    For more detailed technical information, please refer to our developer resources:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      <a href="#" className="text-primary hover:underline">
                        API Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline">
                        Database Schema
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline">
                        Authentication Guide
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 5Sense. All rights reserved. Last updated: April 25, 2025.
        </p>
      </div>
    </div>
  )
}
