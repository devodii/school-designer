"use client"

import { ComponentProps } from "react"

import { DialogRoot } from "@/components/dialog-root"
import { PricingPlans } from "@/components/pricing-plans"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/tw-merge"
import { Slot } from "@radix-ui/react-slot"
import { XIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface WrapperProps extends ComponentProps<"div"> {
  asChild?: boolean
}

export const Wrapper = ({ children, asChild, ...forwardedProps }: WrapperProps) => {
  const Comp = asChild ? Slot : "div"

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile(760)

  const showPriceModal = searchParams?.has("pricing")

  const handleClosePriceModal = () => {
    const params = new URLSearchParams(searchParams!)
    params.delete("pricing")
    router.replace(`${pathname}?${params.toString()}`)
  }

  if (showPriceModal && isMobile) {
    return (
      <div
        className={cn(
          "relative z-50 flex h-full flex-col items-center justify-center gap-4 overflow-y-auto bg-white px-4 py-12 transition-transform duration-300 ease-in-out",
          showPriceModal ? "translate-y-0" : "translate-y-full",
        )}
      >
        <XIcon className="absolute top-4 right-4 size-6 cursor-pointer" onClick={handleClosePriceModal} />

        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <PricingPlans />
      </div>
    )
  }

  return (
    <Comp className={cn(forwardedProps.className)} {...forwardedProps}>
      {children}

      {showPriceModal && (
        <DialogRoot
          open={showPriceModal}
          onOpenChange={handleClosePriceModal}
          titleClassName="text-2xl font-bold"
          titleChildren="Choose Your Plan"
          contentClassName="w-full sm:max-w-[700px]"
          component={PricingPlans}
        />
      )}
    </Comp>
  )
}
