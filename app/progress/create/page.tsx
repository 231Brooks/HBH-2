"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Calendar, Upload, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { createTransaction } from "@/app/actions/transaction-actions"

function CreateTransactionContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    transactionType: "PURCHASE" as "PURCHASE" | "SALE",
    propertyAddress: "",
    transactionPrice: "",
    closingDate: "",
    buyerName: "",
    sellerName: "",
    transactionDescription: "",
    titleCompany: "",
    inspectionDate: "",
    financingDate: "",
    appraisalDate: "",
    titleCommitmentDate: "",
    escrowOfficer: "",
    titleNotes: "",
    status: "IN_PROGRESS"
  })

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleContinue = async () => {
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit the form
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await createTransaction({
        type: formData.transactionType,
        status: formData.status as any,
        property: {
          address: formData.propertyAddress,
          price: formData.transactionPrice ? parseFloat(formData.transactionPrice) : undefined,
        },
        closingDate: formData.closingDate ? new Date(formData.closingDate) : undefined,
        titleCompany: formData.titleCompany ? {
          name: formData.titleCompany,
          escrowOfficer: formData.escrowOfficer || undefined,
        } : undefined,
        notes: formData.transactionDescription || undefined,
        milestones: {
          inspectionDate: formData.inspectionDate ? new Date(formData.inspectionDate) : undefined,
          financingDate: formData.financingDate ? new Date(formData.financingDate) : undefined,
          appraisalDate: formData.appraisalDate ? new Date(formData.appraisalDate) : undefined,
          titleCommitmentDate: formData.titleCommitmentDate ? new Date(formData.titleCommitmentDate) : undefined,
        }
      })

      if (result.success && result.transaction) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/progress/${result.transaction.id}`)
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to create transaction")
      }
    } catch (err: any) {
      console.error("Transaction creation error:", err)
      setError(err.message || "Failed to create transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Link href="/progress" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} />
        <span>Back to Progress</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Transaction</h1>
        <p className="text-muted-foreground mb-8">Track and manage your real estate transaction from start to finish</p>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground/30"}`}
              >
                1
              </div>
              <span className="text-sm mt-2">Basic Info</span>
            </div>
            <div className="h-0.5 w-16 bg-muted"></div>
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground/30"}`}
              >
                2
              </div>
              <span className="text-sm mt-2">Title & Timeline</span>
            </div>
            <div className="h-0.5 w-16 bg-muted"></div>
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground/30"}`}
              >
                3
              </div>
              <span className="text-sm mt-2">Documents</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Transaction created successfully! Redirecting to transaction details...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Transaction Information</CardTitle>
                <CardDescription>Enter the basic details of your transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <div className="flex gap-4">
                    <div
                      className={`flex-1 border rounded-md p-4 cursor-pointer ${formData.transactionType === "PURCHASE" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                      onClick={() => updateFormData("transactionType", "PURCHASE")}
                    >
                      <h3 className="font-medium mb-2">Purchase</h3>
                      <p className="text-sm text-muted-foreground">I am buying a property</p>
                    </div>
                    <div
                      className={`flex-1 border rounded-md p-4 cursor-pointer ${formData.transactionType === "SALE" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                      onClick={() => updateFormData("transactionType", "SALE")}
                    >
                      <h3 className="font-medium mb-2">Sale</h3>
                      <p className="text-sm text-muted-foreground">I am selling a property</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property-address">Property Address</Label>
                  <Input
                    id="property-address"
                    placeholder="Enter the complete property address"
                    value={formData.propertyAddress}
                    onChange={(e) => updateFormData("propertyAddress", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-price">Transaction Price ($)</Label>
                    <Input
                      id="transaction-price"
                      type="number"
                      placeholder="e.g., 450000"
                      value={formData.transactionPrice}
                      onChange={(e) => updateFormData("transactionPrice", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closing-date">Expected Closing Date</Label>
                    <div className="relative">
                      <Input
                        id="closing-date"
                        type="date"
                        value={formData.closingDate}
                        onChange={(e) => updateFormData("closingDate", e.target.value)}
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Buyer Name</Label>
                    <Input
                      id="buyer-name"
                      placeholder="Full name of buyer"
                      value={formData.buyerName}
                      onChange={(e) => updateFormData("buyerName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller-name">Seller Name</Label>
                    <Input
                      id="seller-name"
                      placeholder="Full name of seller"
                      value={formData.sellerName}
                      onChange={(e) => updateFormData("sellerName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-description">Transaction Notes (Optional)</Label>
                  <Textarea
                    id="transaction-description"
                    placeholder="Any additional information about this transaction"
                    className="min-h-[100px]"
                    value={formData.transactionDescription}
                    onChange={(e) => updateFormData("transactionDescription", e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Title Company & Timeline</CardTitle>
                <CardDescription>Select your title company and set key milestone dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Title Company</Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter title company name"
                      value={formData.titleCompany}
                      onChange={(e) => updateFormData("titleCompany", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the name of your title company or leave blank to add later
                    </p>
                  </div>
                  {/* Removed demo title companies - users can enter their own */}
                  <div className="hidden">
                    {[].map((company) => (
                      <div
                        key={company.id}
                        className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:border-muted-foreground ${
                          formData.titleCompany === company.name ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => company.id !== 4 && updateFormData("titleCompany", company.name)}
                      >
                        {company.id !== 4 ? (
                          <>
                            <Avatar>
                              <AvatarImage src={company.image || "/placeholder.svg"} alt={company.name} />
                              <AvatarFallback>{company.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{company.name}</span>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 text-primary">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="h-5 w-5" />
                            </div>
                            <span>{company.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Key Milestones</Label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="inspection-date">Inspection Date</Label>
                        <div className="relative">
                          <Input
                            id="inspection-date"
                            type="date"
                            value={formData.inspectionDate}
                            onChange={(e) => updateFormData("inspectionDate", e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="financing-date">Financing Contingency</Label>
                        <div className="relative">
                          <Input
                            id="financing-date"
                            type="date"
                            value={formData.financingDate}
                            onChange={(e) => updateFormData("financingDate", e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="appraisal-date">Appraisal Date</Label>
                        <div className="relative">
                          <Input
                            id="appraisal-date"
                            type="date"
                            value={formData.appraisalDate}
                            onChange={(e) => updateFormData("appraisalDate", e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title-commitment">Title Commitment Due</Label>
                        <div className="relative">
                          <Input
                            id="title-commitment"
                            type="date"
                            value={formData.titleCommitmentDate}
                            onChange={(e) => updateFormData("titleCommitmentDate", e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escrow-officer">Escrow Officer (Optional)</Label>
                  <Input
                    id="escrow-officer"
                    placeholder="Name of escrow officer"
                    value={formData.escrowOfficer}
                    onChange={(e) => updateFormData("escrowOfficer", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title-notes">Title Company Notes (Optional)</Label>
                  <Textarea
                    id="title-notes"
                    placeholder="Any specific instructions for the title company"
                    className="min-h-[100px]"
                    value={formData.titleNotes}
                    onChange={(e) => updateFormData("titleNotes", e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Documents & Finalize</CardTitle>
                <CardDescription>Upload relevant documents and finalize your transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="space-y-3">
                    <div className="border border-dashed rounded-md p-4">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">Purchase Agreement</p>
                        <p className="text-sm text-muted-foreground">Upload the signed purchase agreement</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" /> Upload File
                        </Button>
                      </div>
                    </div>

                    <div className="border border-dashed rounded-md p-4">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">Property Disclosure</p>
                        <p className="text-sm text-muted-foreground">Upload the property disclosure form</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" /> Upload File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Optional Documents</Label>
                  <div className="space-y-3">
                    <div className="border border-dashed rounded-md p-4">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium">Additional Documents</p>
                        <p className="text-sm text-muted-foreground">Upload any additional relevant documents</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" /> Upload Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-status">Initial Transaction Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                      <SelectItem value="DOCUMENT_REVIEW">Document Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notify-parties">Notify Parties</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-buyer" className="rounded text-primary" defaultChecked />
                    <label htmlFor="notify-buyer" className="text-sm">
                      Buyer
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-seller" className="rounded text-primary" defaultChecked />
                    <label htmlFor="notify-seller" className="text-sm">
                      Seller
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notify-title" className="rounded text-primary" defaultChecked />
                    <label htmlFor="notify-title" className="text-sm">
                      Title Company
                    </label>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between border-t pt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/progress">Cancel</Link>
              </Button>
            )}
            <Button onClick={handleContinue} disabled={loading}>
              {loading ? "Creating..." : (step < 3 ? "Continue" : "Create Transaction")}
            </Button>
          </CardFooter>
        </Card>

        {step === 3 && (
          <div className="mt-6 bg-muted/30 rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Your transaction will be created and all parties will be notified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>You can track progress, share documents, and communicate with all parties</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>You'll receive notifications for important milestones and deadlines</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreateTransactionPage() {
  return (
    <ProtectedRoute>
      <CreateTransactionContent />
    </ProtectedRoute>
  )
}
