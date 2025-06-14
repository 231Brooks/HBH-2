"use client"

import React from "react"
import { ProfileHeader } from "@/components/profile-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  MapPin,
  Phone,
  Mail,
  Edit3
} from "lucide-react"

export default function ProfileDemoPage() {
  // Demo user data
  const demoUser = {
    id: "demo-user-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=300&fit=crop&crop=center",
    role: "PROFESSIONAL" as const,
    location: "Austin, TX",
    bio: "Experienced real estate professional specializing in luxury homes and commercial properties. Helping clients find their perfect space for over 8 years.",
    rating: 4.9,
    reviewCount: 47
  }

  const handleProfileUpdate = () => {
    console.log("Profile updated!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header with Cover Photo and Profile Picture */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto">
          <ProfileHeader 
            user={demoUser}
            isOwnProfile={true}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Dashboard Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">+3 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-gray-500">8 unread</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-gray-500">This week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Client Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  4.9 <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
                <p className="text-xs text-gray-500">47 reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">List Property</span>
                    <span className="text-xs text-gray-500 text-center">Add a new property listing</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Schedule Showing</span>
                    <span className="text-xs text-gray-500 text-center">Book property viewings</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-medium">Client Messages</span>
                    <span className="text-xs text-gray-500 text-center">View and respond to messages</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Market Analytics</span>
                    <span className="text-xs text-gray-500 text-center">View market trends</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New listing published</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Client meeting scheduled</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Property inquiry received</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Review received</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Dashboard</CardTitle>
              <CardDescription>Manage your services and client relationships</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Button variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Services
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Client Portal
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
