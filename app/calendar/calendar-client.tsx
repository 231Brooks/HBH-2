"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  MapPin,
  FileText,
  Home,
  Camera,
  Briefcase,
  PenToolIcon as Tool,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react"
import { getUserAppointments, createAppointment, updateAppointment, deleteAppointment } from "../actions/calendar-actions"
import { getUserTransactions } from "../actions/transaction-actions"

interface Appointment {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  type: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface Transaction {
  id: string
  title: string
  status: string
  closingDate?: Date
  property?: {
    address: string
    city: string
    state: string
  }
}

interface CalendarEvent {
  id: string
  title: string
  time: string
  type: string
  location?: string
  description?: string
  date: Date
  source: 'appointment' | 'transaction'
  originalData: Appointment | Transaction
}

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "OTHER",
  })
  const [submitting, setSubmitting] = useState(false)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const appointmentTypes = [
    { value: "CLOSING", label: "Closing", icon: <FileText className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
    { value: "INSPECTION", label: "Inspection", icon: <Home className="h-4 w-4" />, color: "bg-amber-100 text-amber-800" },
    { value: "PHOTOGRAPHY", label: "Photography", icon: <Camera className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
    { value: "LEGAL", label: "Legal", icon: <Briefcase className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
    { value: "RENOVATION", label: "Renovation", icon: <Tool className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
    { value: "OTHER", label: "Other", icon: <CalendarIcon className="h-4 w-4" />, color: "bg-gray-100 text-gray-800" },
  ]

  // Load data
  useEffect(() => {
    loadCalendarData()
  }, [currentDate])

  const loadCalendarData = async () => {
    setLoading(true)
    try {
      // Get start and end of month for filtering
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      // Load appointments and transactions
      const [appointmentsResult, transactionsResult] = await Promise.all([
        getUserAppointments({ startDate: startOfMonth, endDate: endOfMonth }),
        getUserTransactions({ limit: 100, offset: 0 })
      ])

      setAppointments(appointmentsResult.appointments || [])
      setTransactions(transactionsResult.transactions || [])

      // Convert to calendar events
      const calendarEvents: CalendarEvent[] = []

      // Add appointments
      appointmentsResult.appointments?.forEach((appointment) => {
        calendarEvents.push({
          id: `appointment-${appointment.id}`,
          title: appointment.title,
          time: new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: appointment.type.toLowerCase(),
          location: appointment.location,
          description: appointment.description,
          date: new Date(appointment.startTime),
          source: 'appointment',
          originalData: appointment,
        })
      })

      // Add transaction closing dates
      transactionsResult.transactions?.forEach((transaction) => {
        if (transaction.closingDate) {
          calendarEvents.push({
            id: `transaction-${transaction.id}`,
            title: `Closing: ${transaction.title}`,
            time: "All Day",
            type: "closing",
            location: transaction.property ? `${transaction.property.address}, ${transaction.property.city}, ${transaction.property.state}` : undefined,
            description: `Property closing for ${transaction.title}`,
            date: new Date(transaction.closingDate),
            source: 'transaction',
            originalData: transaction,
          })
        }
      })

      setEvents(calendarEvents)
    } catch (error) {
      console.error("Failed to load calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

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

    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        events: getEventsForDate(date),
      })
    }

    const nextMonthDays = []
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length
    const remainingDays = 42 - totalDaysShown
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: [],
      })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("startTime", formData.startTime)
      formDataObj.append("endTime", formData.endTime)
      formDataObj.append("location", formData.location)
      formDataObj.append("type", formData.type)

      const result = await createAppointment(formDataObj)

      if (result.success) {
        setShowCreateDialog(false)
        setFormData({
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          location: "",
          type: "OTHER",
        })
        await loadCalendarData()
      } else {
        console.error("Failed to create appointment:", result.error)
      }
    } catch (error) {
      console.error("Failed to create appointment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || selectedEvent.source !== 'appointment') return

    setSubmitting(true)

    try {
      const appointment = selectedEvent.originalData as Appointment
      const formDataObj = new FormData()
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("startTime", formData.startTime)
      formDataObj.append("endTime", formData.endTime)
      formDataObj.append("location", formData.location)
      formDataObj.append("type", formData.type)

      const result = await updateAppointment(appointment.id, formDataObj)

      if (result.success) {
        setShowEditDialog(false)
        setSelectedEvent(null)
        await loadCalendarData()
      } else {
        console.error("Failed to update appointment:", result.error)
      }
    } catch (error) {
      console.error("Failed to update appointment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAppointment = async () => {
    if (!selectedEvent || selectedEvent.source !== 'appointment') return

    setSubmitting(true)

    try {
      const appointment = selectedEvent.originalData as Appointment
      const result = await deleteAppointment(appointment.id)

      if (result.success) {
        setShowEditDialog(false)
        setSelectedEvent(null)
        await loadCalendarData()
      } else {
        console.error("Failed to delete appointment:", result.error)
      }
    } catch (error) {
      console.error("Failed to delete appointment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (event: CalendarEvent) => {
    if (event.source === 'appointment') {
      const appointment = event.originalData as Appointment
      setFormData({
        title: appointment.title,
        description: appointment.description || "",
        startTime: new Date(appointment.startTime).toISOString().slice(0, 16),
        endTime: new Date(appointment.endTime).toISOString().slice(0, 16),
        location: appointment.location || "",
        type: appointment.type,
      })
      setSelectedEvent(event)
      setShowEditDialog(true)
    }
  }

  const getEventTypeInfo = (type: string) => {
    return appointmentTypes.find(t => t.value.toLowerCase() === type.toLowerCase()) || appointmentTypes[appointmentTypes.length - 1]
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Calendar</h1>
          <p className="text-muted-foreground">Manage all your appointments and deadlines in one place</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogDescription>
                  Add a new appointment to your calendar.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Appointment"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
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
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
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
                          className={`aspect-square p-1 border rounded-md cursor-pointer transition-colors ${
                            day.isCurrentMonth ? "bg-white hover:bg-slate-50" : "bg-slate-50 text-muted-foreground"
                          } ${
                            day.date.getDate() === new Date().getDate() &&
                            day.date.getMonth() === new Date().getMonth() &&
                            day.date.getFullYear() === new Date().getFullYear()
                              ? "border-primary bg-primary/5"
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
                            {day.events.map((event, eventIndex) => {
                              const typeInfo = getEventTypeInfo(event.type)
                              return (
                                <div
                                  key={eventIndex}
                                  onClick={() => openEditDialog(event)}
                                  className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${typeInfo.color}`}
                                  title={`${event.time} - ${event.title}${event.location ? ` at ${event.location}` : ''}`}
                                >
                                  {event.time} - {event.title}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentView === "week" && (
                    <div className="text-center p-10 text-muted-foreground">
                      <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Week View</h3>
                      <p>Week view will be implemented in a future update.</p>
                    </div>
                  )}

                  {currentView === "day" && (
                    <div className="text-center p-10 text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Day View</h3>
                      <p>Day view will be implemented in a future update.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled appointments and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {events
                    .filter(event => new Date(event.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((event) => {
                      const typeInfo = getEventTypeInfo(event.type)
                      return (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color}`}>
                            {typeInfo.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(event.date).toLocaleDateString()} {event.time !== "All Day" && `, ${event.time}`}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                    <div className="text-center py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                      <p className="text-gray-500 mb-4">Create your first appointment to get started.</p>
                      <Button onClick={() => setShowCreateDialog(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>Filter events by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {appointmentTypes.map((category) => (
                  <div key={category.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`cat-${category.value}`}
                      className="rounded text-primary"
                      defaultChecked={true}
                      onChange={(e) => {
                        // Handle checkbox change for filtering
                        console.log(`${category.label} filter: ${e.target.checked ? "enabled" : "disabled"}`)
                      }}
                    />
                    <label htmlFor={`cat-${category.value}`} className="flex items-center gap-2 cursor-pointer">
                      {category.icon}
                      <span>{category.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your calendar overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-medium">
                    {events.filter(event => {
                      const eventDate = new Date(event.date)
                      return eventDate.getMonth() === currentDate.getMonth() &&
                             eventDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upcoming</span>
                  <span className="font-medium">
                    {events.filter(event => new Date(event.date) >= new Date()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closings</span>
                  <span className="font-medium">
                    {events.filter(event => event.type === 'closing').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Appointment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update your appointment details.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && selectedEvent.source === 'appointment' ? (
            <form onSubmit={handleEditAppointment} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAppointment}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Event</h3>
              <p className="text-gray-500 mb-4">This is a closing date from your transactions. Edit it in the Progress section.</p>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}