"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Check,
  Crown,
  CreditCard,
  AlertCircle,
  Zap,
  Star,
  DollarSign,
  Users,
  Shield,
} from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"
import { SubscriptionTier } from "@prisma/client"
import {
  getSubscriptionDisplayName,
  getSubscriptionFeatures,
  SUBSCRIPTION_LIMITS,
} from "@/lib/subscription"

interface UserSubscription {
  id: string
  tier: SubscriptionTier
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  listingsUsed: number
  listingsLimit: number | null
}

export default function SubscriptionPage() {
  const { user } = useSupabase()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      // This would typically fetch from your API
      // For now, we'll simulate a free subscription
      setSubscription({
        id: "temp",
        tier: SubscriptionTier.FREE,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        listingsUsed: 0,
        listingsLimit: null,
      })
    } catch (error) {
      console.error("Failed to load subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setUpgrading(true)
    try {
      // This would integrate with Stripe for payment processing
      console.log("Upgrading to:", tier)
      // Simulate upgrade
      setTimeout(() => {
        setUpgrading(false)
        alert("Upgrade functionality will be implemented with Stripe integration")
      }, 1000)
    } catch (error) {
      console.error("Failed to upgrade:", error)
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing preferences
        </p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Plan: {getSubscriptionDisplayName(subscription.tier)}
            </CardTitle>
            <CardDescription>
              {subscription.tier === SubscriptionTier.FREE
                ? "You're currently on the free plan"
                : `Your subscription renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={subscription.status === "ACTIVE" ? "default" : "destructive"}>
                  {subscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Listings Used</p>
                <p className="text-lg font-semibold">
                  {subscription.listingsUsed}
                  {subscription.listingsLimit ? ` / ${subscription.listingsLimit}` : " / Unlimited"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Fee</p>
                <p className="text-lg font-semibold">
                  ${SUBSCRIPTION_LIMITS[subscription.tier].monthlyFee}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Free Plan */}
        <Card className={subscription?.tier === SubscriptionTier.FREE ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Free
            </CardTitle>
            <CardDescription>Perfect for service users</CardDescription>
            <div className="text-3xl font-bold">$0<span className="text-lg font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {getSubscriptionFeatures(SubscriptionTier.FREE).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {subscription?.tier === SubscriptionTier.FREE ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleUpgrade(SubscriptionTier.FREE)}
                disabled={upgrading}
              >
                Downgrade to Free
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Professional Monthly Plan */}
        <Card className={subscription?.tier === SubscriptionTier.PROFESSIONAL_MONTHLY ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Professional
              <Badge variant="secondary">Most Popular</Badge>
            </CardTitle>
            <CardDescription>Best for active service providers</CardDescription>
            <div className="text-3xl font-bold">$50<span className="text-lg font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {getSubscriptionFeatures(SubscriptionTier.PROFESSIONAL_MONTHLY).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {subscription?.tier === SubscriptionTier.PROFESSIONAL_MONTHLY ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleUpgrade(SubscriptionTier.PROFESSIONAL_MONTHLY)}
                disabled={upgrading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade to Professional
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pay Per Listing Plan */}
        <Card className={subscription?.tier === SubscriptionTier.PAY_PER_LISTING ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pay Per Listing
            </CardTitle>
            <CardDescription>Flexible option for occasional providers</CardDescription>
            <div className="text-3xl font-bold">$10<span className="text-lg font-normal">/listing</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {getSubscriptionFeatures(SubscriptionTier.PAY_PER_LISTING).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {subscription?.tier === SubscriptionTier.PAY_PER_LISTING ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleUpgrade(SubscriptionTier.PAY_PER_LISTING)}
                disabled={upgrading}
              >
                Switch to Pay Per Listing
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </CardTitle>
          <CardDescription>Manage your payment methods and billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Billing management will be available once Stripe integration is complete.
              You'll be able to update payment methods, view invoices, and manage billing preferences.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Service Provider Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Service Provider Benefits
          </CardTitle>
          <CardDescription>Understanding our freemium model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For Service Users (Free)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Browse and use all services for free</li>
                <li>• No fees when hiring professionals</li>
                <li>• Full access to marketplace</li>
                <li>• Contact service providers directly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Service Providers</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Professional Monthly: $50/month, no transaction fees</li>
                <li>• Pay Per Listing: $10/listing + 5% transaction fees</li>
                <li>• Professional dashboard and tools</li>
                <li>• Priority support and verification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
