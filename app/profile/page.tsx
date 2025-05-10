"use client"

import { useState } from "react"
import { Activity, Award, Briefcase, CheckCircle, Clock, DollarSign, Star, TrendingUp, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  // Mock data - in a real app, this would come from an API
  const userData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joinedDate: "January 2023",
    completedChoirs: 24,
    earnings: 1250.75,
    rating: 4.8,
    qualifications: [
      { id: "1", name: "Web Development", level: "Expert" },
      { id: "2", name: "Graphic Design", level: "Intermediate" },
      { id: "3", name: "Content Writing", level: "Advanced" },
      { id: "4", name: "Data Analysis", level: "Beginner" },
    ],
    recentChoirs: [
      { id: "c1", title: "Website Redesign", date: "2023-04-15", status: "completed", payment: 350 },
      { id: "c2", title: "Logo Creation", date: "2023-04-10", status: "completed", payment: 120 },
      { id: "c3", title: "Blog Article", date: "2023-04-05", status: "completed", payment: 85 },
    ],
    investments: [
      { id: "i1", name: "Tech Growth Fund", amount: 500, performance: 12.5 },
      { id: "i2", name: "Sustainable Energy", amount: 300, performance: -2.1 },
      { id: "i3", name: "Real Estate Trust", amount: 450, performance: 5.8 },
    ],
  }

  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary */}
        <Card className="md:w-1/3">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle>{userData.name}</CardTitle>
                <CardDescription>{userData.email}</CardDescription>
                <div className="text-sm text-muted-foreground mt-1">Member since {userData.joinedDate}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userData.completedChoirs}</div>
                <div className="text-xs text-muted-foreground">Choirs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${userData.earnings}</div>
                <div className="text-xs text-muted-foreground">Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold flex items-center justify-center">
                  {userData.rating}
                  <Star className="h-4 w-4 text-yellow-500 ml-1" fill="currentColor" />
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {userData.qualifications.map((qual) => (
                  <Badge key={qual.id} variant="outline">
                    {qual.name} • {qual.level}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Custom Tabs Implementation */}
          <div className="border rounded-md p-1 flex space-x-1 bg-muted">
            <button
              onClick={() => setActiveTab("stats")}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                activeTab === "stats"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Stats & Activity
            </button>
            <button
              onClick={() => setActiveTab("choirs")}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                activeTab === "choirs"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Recent Choirs
            </button>
            <button
              onClick={() => setActiveTab("investments")}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                activeTab === "investments"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Investments
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Activity Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87/100</div>
                      <Progress value={87} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98%</div>
                      <Progress value={98} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Response Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.2 hrs</div>
                      <Progress value={85} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skills Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Web Development</span>
                          <span>Expert</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Graphic Design</span>
                          <span>Intermediate</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Content Writing</span>
                          <span>Advanced</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Data Analysis</span>
                          <span>Beginner</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Choirs Tab */}
            {activeTab === "choirs" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Recent Choirs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.recentChoirs.map((choir) => (
                        <div
                          key={choir.id}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="font-medium">{choir.title}</div>
                            <div className="text-sm text-muted-foreground">Completed on {choir.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">${choir.payment}</div>
                            <Badge variant="outline" className="capitalize">
                              {choir.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center text-center p-2 border rounded-lg">
                        <Award className="h-8 w-8 text-amber-500 mb-2" />
                        <div className="font-medium">Top Performer</div>
                        <div className="text-xs text-muted-foreground">March 2023</div>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 border rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        <div className="font-medium">Perfect Completion</div>
                        <div className="text-xs text-muted-foreground">10 Choirs</div>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 border rounded-lg">
                        <Star className="h-8 w-8 text-yellow-500 mb-2" />
                        <div className="font-medium">5-Star Rating</div>
                        <div className="text-xs text-muted-foreground">15 Reviews</div>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 border rounded-lg">
                        <Clock className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="font-medium">Quick Response</div>
                        <div className="text-xs text-muted-foreground">Under 1 hour</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === "investments" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Your Investments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.investments.map((inv) => (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="font-medium">{inv.name}</div>
                            <div className="text-sm text-muted-foreground">Invested: ${inv.amount}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${inv.performance >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {inv.performance >= 0 ? "+" : ""}
                              {inv.performance}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${(inv.amount * (1 + inv.performance / 100)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Investment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-2 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Total Invested</div>
                        <div className="text-xl font-bold">$1,250</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Current Value</div>
                        <div className="text-xl font-bold">$1,325</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Total Return</div>
                        <div className="text-xl font-bold text-green-600">+$75</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="text-xs text-muted-foreground">ROI</div>
                        <div className="text-xl font-bold text-green-600">+6%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
