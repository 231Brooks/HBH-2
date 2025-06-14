"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TestTube,
  CreditCard,
  DollarSign,
  Calculator,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Banknote
} from "lucide-react"

import { paperMoneyConfig } from "@/lib/paper-money-config"
import { mockPaymentService, createTestPaymentScenarios } from "@/lib/mock-payment-service"
import { 
  calculateTestTransactionFees, 
  calculateTestListingFees, 
  calculateTestAdvertisingFees,
  getTestSubscriptionPricing,
  formatTestFeeCalculation,
  getTestPaymentScenarios
} from "@/lib/paper-money-fees"
import { TestModeWarning, TestAmountDisplay } from "@/components/test-mode-banner"

export default function TestPaperMoneyPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(2500) // $25.00
  const [selectedAccountType, setSelectedAccountType] = useState<'buyer' | 'seller' | 'service_provider'>('service_provider')

  // Validate paper money environment
  const validation = paperMoneyConfig.validate()

  const runPaymentTest = async (cardNumber: string, expectedResult: string) => {
    try {
      setIsRunning(true)
      
      // Create payment method
      const paymentMethod = await mockPaymentService.createPaymentMethod(cardNumber)
      
      // Create payment intent
      const paymentIntent = await mockPaymentService.createPaymentIntent({
        amount: selectedAmount,
        metadata: {
          test: 'true',
          accountType: selectedAccountType
        }
      })
      
      // Confirm payment
      const result = await mockPaymentService.confirmPaymentIntent(
        paymentIntent.id,
        paymentMethod.id
      )
      
      return {
        success: result.status === expectedResult,
        status: result.status,
        expected: expectedResult,
        paymentMethod: paymentMethod.card,
        amount: selectedAmount
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        expected: expectedResult
      }
    } finally {
      setIsRunning(false)
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    const scenarios = createTestPaymentScenarios()
    const results = []
    
    for (const [name, scenario] of Object.entries(scenarios)) {
      const result = await runPaymentTest(scenario.cardNumber, scenario.expectedResult)
      results.push({
        name,
        ...result
      })
    }
    
    setTestResults(results)
    setIsRunning(false)
  }

  const testCards = paperMoneyConfig.payments.testCards
  const feeCalculation = calculateTestTransactionFees(selectedAmount, selectedAccountType)
  const subscriptionPricing = getTestSubscriptionPricing(selectedAccountType as any)
  const paymentScenarios = getTestPaymentScenarios()

  if (!validation.isValid) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Paper Money Mode Not Configured:</strong>
            <ul className="mt-2 list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Banknote className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold">Paper Money Testing</h1>
        </div>
        <p className="text-muted-foreground">
          Safe testing environment for payment flows and fee calculations
        </p>
      </div>

      <TestModeWarning />

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Payment Tests</TabsTrigger>
          <TabsTrigger value="fees">Fee Calculator</TabsTrigger>
          <TabsTrigger value="cards">Test Cards</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Payment Flow Testing
              </CardTitle>
              <CardDescription>
                Test different payment scenarios with mock credit cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Test Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={selectedAmount / 100}
                    onChange={(e) => setSelectedAmount(Math.round(parseFloat(e.target.value) * 100))}
                    step="0.01"
                    min="0.01"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    <TestAmountDisplay amount={selectedAmount} />
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={selectedAccountType} onValueChange={(value: any) => setSelectedAccountType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer (Free)</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="service_provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? "Running Tests..." : "Run All Payment Tests"}
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results:</h3>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expected: {result.expected} | Got: {result.status || result.error}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Fee Calculator
              </CardTitle>
              <CardDescription>
                Calculate fees for different transaction types and account levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Transaction Fee Breakdown</h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {formatTestFeeCalculation(feeCalculation)}
                </pre>
              </div>

              {subscriptionPricing.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Subscription Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscriptionPricing.map((plan, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{plan.plan}</h4>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                            <TestAmountDisplay amount={plan.amount} className="font-bold" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Test Credit Cards
              </CardTitle>
              <CardDescription>
                Use these test card numbers for payment testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(testCards).map(([type, number]) => (
                  <div key={type} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{number}</code>
                    </div>
                  </div>
                ))}
              </div>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Use any future expiry date and any 3-digit CVC for testing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Scenarios
              </CardTitle>
              <CardDescription>
                Pre-configured test scenarios with different amounts and fee structures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(paymentScenarios).map(([size, scenario]) => (
                  <Card key={size}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium capitalize">{scenario.description}</h4>
                          <TestAmountDisplay amount={scenario.amount} />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Platform Fee: <TestAmountDisplay amount={scenario.fees.platformFee} /></div>
                          <div>Transaction Fee: <TestAmountDisplay amount={scenario.fees.transactionFee} /></div>
                          <div className="font-medium">Total: <TestAmountDisplay amount={scenario.fees.totalAmount} /></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
