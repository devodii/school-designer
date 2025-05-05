"use client"

import { ComponentProps } from "react"

import { DialogRoot } from "@/components/dialog-root"
import { PricingPlans } from "@/components/pricing-plans"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useUrlState } from "@/hooks/use-url-state"
import { cn } from "@/lib/tw-merge"
import { Slot } from "@radix-ui/react-slot"
import { XIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface WrapperProps extends ComponentProps<"div"> {
  asChild?: boolean
}

export const Wrapper = ({ children, asChild, ...forwardedProps }: WrapperProps) => {
  const Comp = asChild ? Slot : "div"

  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { remove } = useUrlState()

  const showPriceModal = searchParams?.has("pricing")

  if (showPriceModal && isMobile) {
    return (
      <div
        className={cn(
          "relative z-50 flex h-full flex-col items-center justify-center gap-4 overflow-y-auto bg-white px-4 py-12 transition-transform duration-300 ease-in-out",
          showPriceModal ? "translate-y-0" : "translate-y-full",
        )}
      >
        <XIcon className="absolute top-4 right-4 size-6 cursor-pointer" onClick={() => remove(["pricing"])} />

        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <PricingPlans intent={searchParams?.get("pricing") ?? ""} />
      </div>
    )
  }

  return (
    <Comp className={cn(forwardedProps.className)} {...forwardedProps}>
      {children}

      {showPriceModal && (
        <DialogRoot
          open={showPriceModal}
          onOpenChange={() => remove(["pricing"])}
          titleClassName="text-2xl font-bold"
          titleChildren="Choose Your Plan"
          contentClassName="w-full sm:max-w-[700px]"
          component={() => <PricingPlans intent={searchParams?.get("pricing") ?? ""} />}
        />
      )}
    </Comp>
  )
}
