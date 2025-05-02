import { useState } from "react"

import { CardRoot } from "@/components/card-root"
import { TabsRoot } from "@/components/tabs-root"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type ActiveTab = "monthly" | "yearly"

export const PricingPlans = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("monthly")

  return (
    <div className="flex flex-col gap-4">
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
                <Badge className="text-xs">25% off</Badge>
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
          titleChildren={
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold">Plus</span>
              <span className="text-3xl font-bold">{activeTab === "monthly" ? "$12" : "$9"}</span>
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

              <Button className="w-full">Get Plus</Button>

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
