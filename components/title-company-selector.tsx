"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search } from "lucide-react"
import { getTitleCompanies } from "@/app/actions/title-company-actions"

interface TitleCompany {
  id: string
  name: string
  logo: string
  city?: string
  state?: string
}

interface TitleCompanySelectorProps {
  selectedId: string
  onSelect: (id: string, name: string) => void
}

export default function TitleCompanySelector({ selectedId, onSelect }: TitleCompanySelectorProps) {
  const [titleCompanies, setTitleCompanies] = useState<TitleCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function loadTitleCompanies() {
      setIsLoading(true)
      const result = await getTitleCompanies()
      if (result.success) {
        setTitleCompanies(result.titleCompanies)
      }
      setIsLoading(false)
    }

    loadTitleCompanies()
  }, [])

  const filteredCompanies = titleCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (company: TitleCompany) => {
    onSelect(company.id, company.name)
    setIsDialogOpen(false)
  }

  const selectedCompany = titleCompanies.find((company) => company.id === selectedId)

  return (
    <div className="space-y-2">
      <Label>Title Company</Label>

      {selectedCompany ? (
        <div className="flex items-center justify-between border rounded-md p-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedCompany.logo || "/placeholder.svg"} alt={selectedCompany.name} />
              <AvatarFallback>{selectedCompany.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedCompany.name}</p>
              {selectedCompany.city && selectedCompany.state && (
                <p className="text-xs text-muted-foreground">
                  {selectedCompany.city}, {selectedCompany.state}
                </p>
              )}
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Title Company</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search title companies..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSelect(company)}
                      >
                        <Avatar>
                          <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                          <AvatarFallback>{company.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          {company.city && company.state && (
                            <p className="text-xs text-muted-foreground">
                              {company.city}, {company.state}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredCompanies.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No title companies found</div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/title-companies/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Title Company
                    </a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Select Title Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Title Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search title companies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelect(company)}
                    >
                      <Avatar>
                        <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                        <AvatarFallback>{company.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.city && company.state && (
                          <p className="text-xs text-muted-foreground">
                            {company.city}, {company.state}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No title companies found</div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/title-companies/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Title Company
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
