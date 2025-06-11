"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

export function FeeReportFilters() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    minAmount: "",
    maxAmount: "",
  })

  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      status: "",
      minAmount: "",
      maxAmount: "",
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, description, or related item..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button variant="default">Apply</Button>
      </div>

      {showFilters && (
        <div className="bg-muted/40 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Fee Type</Label>
              <Select value={filters.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="SERVICE_FEE">Service Fee</SelectItem>
                  <SelectItem value="TRANSACTION_FEE">Transaction Fee</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAmount">Min Amount ($)</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0.00"
                value={filters.minAmount}
                onChange={(e) => handleChange("minAmount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Max Amount ($)</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="Any"
                value={filters.maxAmount}
                onChange={(e) => handleChange("maxAmount", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
