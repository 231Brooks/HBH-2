"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, MapPin, Clock, Briefcase, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock user profile with qualifications
const userProfile = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  qualifications: ["Design", "Content Writing", "Technical Support", "Social Media"],
  skills: ["UI/UX", "Figma", "Responsive Design", "Content Writing", "Editing", "Research"],
  rating: 4.8,
  completedTasks: 32,
  level: "Advanced",
}

// Mock tasks data
const tasksData = [
  {
    id: "1",
    title: "Website Design for Resource Center",
    client: {
      name: "Community Project Alpha",
      rating: 4.9,
    },
    location: "Remote",
    difficulty: "Medium",
    payment: "$150",
    deadline: "3 days",
    description:
      "Create a modern, responsive website design for our new community resource center. The design should be accessible and user-friendly.",
    skills: ["UI/UX", "Figma", "Responsive Design"],
    category: "Design",
    requiredQualifications: ["Design"],
    messages: [
      {
        id: 1,
        sender: "client",
        name: "Community Project Alpha",
        message: "Hi there! We're looking for a clean, modern design that emphasizes accessibility.",
        timestamp: "2 days ago",
      },
    ],
  },
  {
    id: "2",
    title: "Content Writing for Newsletter",
    client: {
      name: "Resource Center Beta",
      rating: 4.7,
    },
    location: "Remote",
    difficulty: "Easy",
    payment: "$75",
    deadline: "5 days",
    description:
      "Write engaging content for our monthly newsletter focusing on community resources and upcoming events.",
    skills: ["Content Writing", "Editing", "Research"],
    category: "Content Creation",
    requiredQualifications: ["Content Writing"],
    messages: [
      {
        id: 1,
        sender: "client",
        name: "Resource Center Beta",
        message: "We need someone who can write in a friendly, approachable tone that resonates with our community.",
        timestamp: "3 days ago",
      },
    ],
  },
  {
    id: "3",
    title: "On-site Technical Support",
    client: {
      name: "Resource Center Gamma",
      rating: 4.5,
    },
    location: "On-site (Chicago, IL)",
    difficulty: "Medium",
    payment: "$120",
    deadline: "Tomorrow",
    description:
      "Provide technical support for our computer lab and assist visitors with basic computer tasks for a 4-hour session.",
    skills: ["Technical Support", "Customer Service", "Troubleshooting"],
    category: "Support",
    requiredQualifications: ["Technical Support"],
    status: "accepted",
    messages: [
      {
        id: 1,
        sender: "client",
        name: "Resource Center Gamma",
        message: "Please arrive 15 minutes early to get familiar with our setup before visitors arrive.",
        timestamp: "1 day ago",
      },
      {
        id: 2,
        sender: "user",
        name: "John Doe",
        message: "No problem! I'll be there early. Do you have any specific software I should be familiar with?",
        timestamp: "1 day ago",
      },
      {
        id: 3,
        sender: "client",
        name: "Resource Center Gamma",
        message: "We mainly use Microsoft Office and some basic web browsing. Nothing too complex!",
        timestamp: "1 day ago",
      },
    ],
  },
  {
    id: "4",
    title: "Social Media Graphics Creation",
    client: {
      name: "Community Project Delta",
      rating: 4.6,
    },
    location: "Remote",
    difficulty: "Easy",
    payment: "$90",
    deadline: "1 week",
    description: "Create a set of 10 social media graphics promoting our upcoming community events and services.",
    skills: ["Graphic Design", "Social Media", "Photoshop"],
    category: "Design",
    requiredQualifications: ["Design", "Social Media"],
    messages: [
      {
        id: 1,
        sender: "client",
        name: "Community Project Delta",
        message: "We need graphics that are eye-catching and align with our brand colors (blue and green).",
        timestamp: "4 days ago",
      },
    ],
  },
  {
    id: "5",
    title: "Database Management and Cleanup",
    client: {
      name: "Resource Center Alpha",
      rating: 4.8,
    },
    location: "Hybrid",
    difficulty: "Hard",
    payment: "$200",
    deadline: "Completed",
    description:
      "Clean up and optimize our community member database, ensuring data integrity and implementing better organization.",
    skills: ["Database", "Data Management", "Excel", "Organization"],
    category: "Data Management",
    requiredQualifications: ["Data Management"],
    status: "completed",
    messages: [
      {
        id: 1,
        sender: "client",
        name: "Resource Center Alpha",
        message: "Great job on the database cleanup! Everything is much more organized now.",
        timestamp: "1 week ago",
      },
      {
        id: 2,
        sender: "user",
        name: "John Doe",
        message: "Thank you! I've also included some documentation on how to maintain it going forward.",
        timestamp: "1 week ago",
      },
    ],
  },
  {
    id: "6",
    title: "Video Editing for Community Event",
    client: {
      name: "Resource Center Epsilon",
      rating: 4.7,
    },
    location: "Remote",
    difficulty: "Medium",
    payment: "$180",
    deadline: "4 days",
    description: "Edit footage from our recent community event into a 3-5 minute highlight video for social media.",
    skills: ["Video Editing", "Adobe Premiere", "Storytelling"],
    category: "Media Production",
    requiredQualifications: ["Media Production"],
    messages: [],
  },
  {
    id: "7",
    title: "Workshop Facilitation on Digital Literacy",
    client: {
      name: "Community Project Zeta",
      rating: 4.9,
    },
    location: "On-site (Boston, MA)",
    difficulty: "Medium",
    payment: "$160",
    deadline: "Next week",
    description: "Facilitate a 2-hour workshop teaching basic digital literacy skills to community members.",
    skills: ["Teaching", "Public Speaking", "Digital Literacy"],
    category: "Education",
    requiredQualifications: ["Education"],
    messages: [],
  },
]

export default function ChoirsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Filter tasks based on user qualifications and search query
  const filterTasks = () => {
    let filtered = tasksData

    // Filter by user qualifications
    if (activeTab !== "completed") {
      filtered = filtered.filter((task) =>
        task.requiredQualifications.some((qual) => userProfile.qualifications.includes(qual)),
      )
    }

    // Filter by status
    if (activeTab === "available") {
      filtered = filtered.filter((task) => !task.status)
    } else if (activeTab === "accepted") {
      filtered = filtered.filter((task) => task.status === "accepted")
    } else if (activeTab === "completed") {
      filtered = filtered.filter((task) => task.status === "completed")
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((task) => task.category === filterCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.skills.some((skill) => skill.toLowerCase().includes(query)),
      )
    }

    return filtered
  }

  const filteredTasks = filterTasks()

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    // In a real app, this would send the message to an API
    alert(`Message sent to ${selectedTask.client.name}: ${messageText}`)
    setMessageText("")
    setShowMessageDialog(false)
  }

  const handleAcceptTask = (taskId) => {
    // In a real app, this would call an API to accept the task
    alert(`Task accepted: ${taskId}`)
  }

  const handleCompleteTask = (taskId) => {
    // In a real app, this would call an API to mark the task as complete
    alert(`Task marked as complete: ${taskId}`)
  }

  const openMessageDialog = (task) => {
    setSelectedTask(task)
    setShowMessageDialog(true)
  }

  // Helper function to render rating stars
  const renderRatingStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Choirs</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              My Tasks
            </Button>
            <Button size="sm">View Calendar</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6">
          {/* User Qualification Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-primary">
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {renderRatingStars(userProfile.rating)}
                      <span className="text-sm">
                        {userProfile.rating} ({userProfile.completedTasks} tasks)
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Your Qualifications:</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.qualifications.map((qual) => (
                      <Badge key={qual} variant="secondary">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="hidden md:block space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Task Type</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="remote" className="mr-2" />
                    <label htmlFor="remote" className="text-sm">
                      Remote
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="onsite" className="mr-2" />
                    <label htmlFor="onsite" className="text-sm">
                      On-site
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="hybrid" className="mr-2" />
                    <label htmlFor="hybrid" className="text-sm">
                      Hybrid
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Difficulty Level</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="easy" className="mr-2" />
                    <label htmlFor="easy" className="text-sm">
                      Easy
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="medium" className="mr-2" />
                    <label htmlFor="medium" className="text-sm">
                      Medium
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="hard" className="mr-2" />
                    <label htmlFor="hard" className="text-sm">
                      Hard
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Payment Range</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-1" className="mr-2" />
                    <label htmlFor="payment-1" className="text-sm">
                      $0 - $50
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-2" className="mr-2" />
                    <label htmlFor="payment-2" className="text-sm">
                      $50 - $100
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-3" className="mr-2" />
                    <label htmlFor="payment-3" className="text-sm">
                      $100 - $200
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-4" className="mr-2" />
                    <label htmlFor="payment-4" className="text-sm">
                      $200+
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <div className="space-y-2">
                  {["Design", "Content Creation", "Support", "Media Production", "Education", "Data Management"].map(
                    (category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={category.toLowerCase().replace(" ", "-")}
                          className="mr-2"
                          checked={filterCategory === category || filterCategory === "all"}
                          onChange={() => setFilterCategory(filterCategory === category ? "all" : category)}
                        />
                        <label htmlFor={category.toLowerCase().replace(" ", "-")} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tasks..."
                      className="pl-8 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="payment-high">Payment: High to Low</SelectItem>
                      <SelectItem value="payment-low">Payment: Low to High</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-4">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onAccept={() => handleAcceptTask(task.id)}
                          onComplete={() => handleCompleteTask(task.id)}
                          onMessage={() => openMessageDialog(task)}
                          renderRatingStars={renderRatingStars}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No matching tasks found</h3>
                        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="available" className="space-y-4">
                  <div className="space-y-4">
                    {filteredTasks.filter((task) => !task.status).length > 0 ? (
                      filteredTasks
                        .filter((task) => !task.status)
                        .map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onAccept={() => handleAcceptTask(task.id)}
                            onMessage={() => openMessageDialog(task)}
                            renderRatingStars={renderRatingStars}
                          />
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No available tasks</h3>
                        <p className="text-sm text-muted-foreground mt-2">Check back later for new opportunities</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="accepted" className="space-y-4">
                  <div className="space-y-4">
                    {filteredTasks.filter((task) => task.status === "accepted").length > 0 ? (
                      filteredTasks
                        .filter((task) => task.status === "accepted")
                        .map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onComplete={() => handleCompleteTask(task.id)}
                            onMessage={() => openMessageDialog(task)}
                            renderRatingStars={renderRatingStars}
                          />
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No accepted tasks</h3>
                        <p className="text-sm text-muted-foreground mt-2">Browse available tasks to find work</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <div className="space-y-4">
                    {filteredTasks.filter((task) => task.status === "completed").length > 0 ? (
                      filteredTasks
                        .filter((task) => task.status === "completed")
                        .map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onMessage={() => openMessageDialog(task)}
                            renderRatingStars={renderRatingStars}
                          />
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No completed tasks</h3>
                        <p className="text-sm text-muted-foreground mt-2">Tasks you complete will appear here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-6 w-6 bg-primary">
                <AvatarFallback>{selectedTask?.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {selectedTask?.client.name}
            </DialogTitle>
            <DialogDescription>Task: {selectedTask?.title}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-4 p-1">
            {selectedTask?.messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : ""}`}>
                {message.sender !== "user" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {selectedTask?.messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-end mt-2">
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskCard({ task, onAccept, onComplete, onMessage, renderRatingStars }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/choirs/${task.id}`} className="hover:underline">
                <h3 className="text-lg font-semibold">{task.title}</h3>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 bg-primary">
                  <AvatarFallback>{task.client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">{task.client.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {task.location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {task.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {task.deadline}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onMessage}>
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Message client</span>
            </Button>
          </div>
          <p className="text-sm">{task.description}</p>
          <div className="flex flex-wrap gap-2">
            {task.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Required qualification: {task.requiredQualifications.join(", ")}</div>
            <div className="flex items-center">
              {renderRatingStars(task.client.rating)}
              <span className="ml-1">Client rating: {task.client.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/20 px-6 py-4">
        <div className="font-medium">{task.payment}</div>
        {task.status === "accepted" ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onMessage}>
              Message Client
            </Button>
            <Button onClick={onComplete}>Mark Complete</Button>
          </div>
        ) : task.status === "completed" ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onMessage}>
              Message Client
            </Button>
            <Button variant="outline" disabled>
              Completed
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onMessage}>
              Message Client
            </Button>
            <Button onClick={onAccept}>Accept Task</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
