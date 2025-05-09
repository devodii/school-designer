import { useState } from "react"

import {
  createCustomerPortalSession as createCustomerPortalSessionAction,
  createPolarCheckoutSession,
} from "@/actions/subscriptions"
import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { TabsRoot } from "@/components/tabs-root"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAccountSubscriptions } from "@/queries/subscriptions"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BadgePlus, Check } from "lucide-react"
import moment from "moment"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ActiveTab = "monthly" | "yearly"

const YEARLY_PRICE = 9
const MONTHLY_PRICE = 12

interface PricingPlansProps {
  intent: string
}

const Benefit = ({ text }: { text: string }) => (
  <div className="mb-4 flex items-start gap-2">
    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
    <span className="text-sm">{text}</span>
  </div>
)

export const PricingPlans = ({ intent }: PricingPlansProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>("monthly")
  const { data: subscriptions, isLoading: isFetchingSubscriptions } = useQuery(getAccountSubscriptions())

  const isMonthlySelected = activeTab === "monthly"

  const { mutate: createCheckoutSession, isPending } = useMutation({
    mutationFn: async () => {
      const response = await createPolarCheckoutSession({
        metadata: { intent },
        frequency: isMonthlySelected ? "MONTHLY" : "YEARLY",
      })

      return response
    },
    onError: () => {
      toast.error("Something went wrong")
    },
    onSuccess: url => router.push(url),
  })

  const { mutate: createCustomerPortalSession, isPending: isCreatingCustomerPortalSession } = useMutation({
    mutationFn: createCustomerPortalSessionAction,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: url => router.push(url),
  })

  const activeSubscription = subscriptions?.find(it => it.status === "active")

  if (isFetchingSubscriptions) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner size={25} />
      </div>
    )
  }

  if (activeSubscription) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 flex justify-center">
          <Badge className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 px-2 py-0.5 text-white">
            <BadgePlus className="size-4" />
            <span className="text-xs font-medium">Plus</span>
          </Badge>
        </div>
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">You're a Plus Member!</h2>
        <p className="mx-auto mb-6 max-w-md text-gray-600">
          Thank you for your support. Your subscription is active until{" "}
          {moment(activeSubscription.expiresAt).format("MMM D, YYYY")}.
        </p>

        <div className="mx-auto mb-6 max-w-md rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-bold">Your Plus Benefits</h3>
          <div className="space-y-3 text-left">
            <Benefit text="Unlimited AI study quiz generation" />
            <Benefit text="Advanced notebook templates and customization" />
            <Benefit text="Speech-to-text note taking" />
            <Benefit text="Create unlimited classrooms" />
            <Benefit text="Priority AI chat assistance" />
            <Benefit text="Custom anime-style notebook covers" />
          </div>
        </div>

        <div className="mx-auto flex max-w-md items-center justify-center gap-4">
          <Button onClick={() => createCustomerPortalSession()} className="w-full">
            <span className="text-sm font-semibold">Manage Subscription</span>
            {isCreatingCustomerPortalSession && <Spinner size={16} />}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-2xl font-bold md:text-3xl">Choose Your Plan</h2>
      <TabsRoot
        defaultValue={activeTab}
        onValueChange={value => setActiveTab(value as ActiveTab)}
        className="w-full"
        triggerClassName="cursor-pointer"
        listClassName="w-full mx-auto max-w-xs flex gap-3 px-4"
        data={[
          {
            value: "monthly",
            label: () => <div className="flex cursor-pointer items-center gap-1.5">Monthly</div>,
            component: () => <div />,
          },
          {
            value: "yearly",
            label: () => (
              <div className="flex cursor-pointer items-center gap-1.5">
                <span>Yearly</span>
                <Badge className="text-xs">{100 - Math.round((YEARLY_PRICE / MONTHLY_PRICE) * 100)}% off</Badge>
              </div>
            ),
            component: () => <div />,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CardRoot
          titleChildren={
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold">Free</span>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground text-sm">forever</span>
            </div>
          }
          titleClassName="text-xl font-semibold text-start"
          contentChildren={
            <div className="-mt-4 flex flex-col gap-4">
              <span className="text-sm font-medium text-black">
                Basic features for students getting started with AI study tools.
              </span>

              <Button variant="outline" className="w-full">
                Your Current Plan
              </Button>

              <ul className="flex flex-col gap-1">
                {[
                  "Limited AI study quiz generation",
                  "Basic notebook template access",
                  "Create one classroom",
                  "Community support",
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-1">
                    <Check className="size-4" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />

        <CardRoot
          className="border border-black"
          titleChildren={
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold">Plus</span>
              <span className="text-3xl font-bold">${activeTab === "monthly" ? MONTHLY_PRICE : YEARLY_PRICE}</span>
              <span className="text-muted-foreground text-sm">
                {activeTab === "monthly" ? "USD/month" : "USD/month, billed annually ($108)"}
              </span>
            </div>
          }
          titleClassName="text-xl font-semibold text-start"
          contentChildren={
            <div className="-mt-6 flex flex-col gap-4">
              <span className="text-sm font-medium text-black">
                Level up productivity and creativity with expanded access.
              </span>

              <Button className="flex w-full items-center justify-center gap-2" onClick={() => createCheckoutSession()}>
                <span className="text-sm font-semibold">Get Plus</span>
                {isPending && <Spinner size={16} />}
              </Button>

              <ul className="flex flex-col gap-2">
                {[
                  "Everything in Free*",
                  "Unlimited AI study quiz generation",
                  "Advanced notebook templates and customization",
                  "Create unlimited classrooms",
                  "Priority AI chat assistance",
                  "Custom anime-style notebook covers",
                  "Advanced student profile discovery",
                  "Early access to new features",
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-1">
                    <Check className="size-4" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
      </div>

      <div className="text-muted-foreground text-center text-sm">
        Limits apply. Upgrade, downgrade, or cancel anytime.
      </div>
    </div>
  )
}
