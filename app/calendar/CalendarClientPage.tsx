"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, MapPin, FileText, Home, Camera } from "lucide-react"

export default function CalendarClientPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDay.getDay()
    // Total days in the month
    const daysInMonth = lastDay.getDate()

    // Previous month's days to show
    const prevMonthDays = []
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0)
      const prevMonthDaysCount = prevMonth.getDate()
      for (let i = prevMonthDaysCount - firstDayOfWeek + 1; i <= prevMonthDaysCount; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          isCurrentMonth: false,
          events: [],
        })
      }
    }

    // Current month's days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        events: getEventsForDate(new Date(year, month, i)),
      })
    }

    // Next month's days to show
    const nextMonthDays = []
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length
    const remainingDays = 42 - totalDaysShown // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: [],
      })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  // Mock function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    const events = [
      {
        id: 1,
        title: "Property Closing",
        time: "10:00 AM",
        type: "closing",
        location: "Desert Title Company",
        address: "123 Main St, Phoenix, AZ",
        with: ["Sarah Johnson (Title Agent)", "Michael Brown (Buyer)"],
      },
      {
        id: 2,
        title: "Home Inspection",
        time: "2:00 PM",
        type: "inspection",
        location: "456 Oak Avenue",
        address: "456 Oak Avenue, Scottsdale, AZ",
        with: ["Elite Home Inspections"],
      },
      {
        id: 3,
        title: "Property Photoshoot",
        time: "9:00 AM",
        type: "photography",
        location: "789 Pine Road",
        address: "789 Pine Road, Tempe, AZ",
        with: ["Premium Real Estate Photography"],
      },
      {
        id: 4,
        title: "Contract Review",
        time: "3:30 PM",
        type: "legal",
        location: "Johnson & Associates Law",
        address: "555 Legal Blvd, Phoenix, AZ",
        with: ["Jennifer Lee (Attorney)"],
      },
      {
        id: 5,
        title: "Renovation Consultation",
        time: "11:00 AM",
        type: "renovation",
        location: "101 River Lane",
        address: "101 River Lane, Mesa, AZ",
        with: ["Reliable Renovation Contractors"],
      },
    ]

    // Return events that match the date (this is just a mock implementation)
    if (date.getDate() === 5 && date.getMonth() === currentDate.getMonth()) {
      return [events[0]]
    } else if (date.getDate() === 12 && date.getMonth() === currentDate.getMonth()) {
      return [events[1]]
    } else if (date.getDate() === 15 && date.getMonth() === currentDate.getMonth()) {
      return [events[2], events[3]]
    } else if (date.getDate() === 20 && date.getMonth() === currentDate.getMonth()) {
      return [events[4]]
    } else if (date.getDate() === 25 && date.getMonth() === currentDate.getMonth()) {
      return [events[0], events[4]]
    }
    return []
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Calendar</h1>
          <p className="text-muted-foreground">Manage all your appointments and deadlines in one place</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => console.log('Add Event clicked')}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
          <Button variant="outline" onClick={() => console.log('Sync Calendar clicked')}>
            <CalendarIcon className="mr-2 h-4 w-4" /> Sync Calendar
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Tabs defaultValue="month" className="w-[300px]">
                    <TabsList>
                      <TabsTrigger value="month" onClick={() => setCurrentView("month")}>
                        Month
                      </TabsTrigger>
                      <TabsTrigger value="week" onClick={() => setCurrentView("week")}>
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="day" onClick={() => setCurrentView("day")}>
                        Day
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentView === "month" && (
                <div className="grid grid-cols-7 gap-1">
                  {/* Day names */}
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square p-1 border rounded-md ${
                        day.isCurrentMonth ? "bg-white" : "bg-slate-50 text-muted-foreground"
                      } ${
                        day.date.getDate() === new Date().getDate() &&
                        day.date.getMonth() === new Date().getMonth() &&
                        day.date.getFullYear() === new Date().getFullYear()
                          ? "border-primary"
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start p-1">
                        <span
                          className={`text-sm font-medium ${
                            day.date.getDay() === 0 || day.date.getDay() === 6 ? "text-red-500" : ""
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {day.events.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`text-xs p-1 rounded truncate ${
                              event.type === "closing"
                                ? "bg-blue-100 text-blue-800"
                                : event.type === "inspection"
                                  ? "bg-amber-100 text-amber-800"
                                  : event.type === "photography"
                                    ? "bg-purple-100 text-purple-800"
                                    : event.type === "legal"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                          >
                            {event.time} - {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentView === "week" && (
                <div className="text-center p-10 text-muted-foreground">Week view would be implemented here</div>
              )}

              {currentView === "day" && (
                <div className="text-center p-10 text-muted-foreground">Day view would be implemented here</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Property Closing</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Jul 5, 10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Desert Title Company</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Home Inspection</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Jul 12, 2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>456 Oak Avenue</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Property Photoshoot</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Jul 15, 9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>789 Pine Road</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => console.log('View All Events clicked')}>
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Connected Calendars</CardTitle>
              <CardDescription>Your synced calendar accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">G</span>
                    </div>
                    <span>Google Calendar</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-sm">A</span>
                    </div>
                    <span>Apple Calendar</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">O</span>
                    </div>
                    <span>Outlook Calendar</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>Filter events by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { id: "cat-closing", label: "Closings", color: "bg-blue-500", defaultChecked: true },
                  { id: "cat-inspection", label: "Inspections", color: "bg-amber-500", defaultChecked: true },
                  { id: "cat-photography", label: "Photography", color: "bg-purple-500", defaultChecked: true },
                  { id: "cat-legal", label: "Legal", color: "bg-green-500", defaultChecked: true },
                  { id: "cat-renovation", label: "Renovation", color: "bg-red-500", defaultChecked: true },
                ].map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={category.id}
                      className="rounded text-primary"
                      defaultChecked={category.defaultChecked}
                      onChange={(e) => {
                        // Handle checkbox change
                        console.log(`${category.label} filter: ${e.target.checked ? "enabled" : "disabled"}`)
                        // In a real app, you would update state here to filter events
                      }}
                    />
                    <label htmlFor={category.id} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span>{category.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
