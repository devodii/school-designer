"use client"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { Button, ButtonProps } from "@components/ui/button"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"

interface LinkButtonProps extends Omit<LinkProps, "href">, MixinProps<"button", Omit<ButtonProps, "asChild">> {
  href: string
  label: string
  icon: React.ElementType
}

export const LinkButton = ({ label, icon: Icon, href, ...mixProps }: LinkButtonProps) => {
  const { button, ...rest } = splitProps(mixProps, "button")

  const pathname = usePathname()
  const isActive = pathname == href

  console.log({ isActive, pathname, href })

  return (
    <Link href={href} {...rest.rest} className="w-full">
      <Button
        {...button}
        variant="ghost"
        className={cn("flex items-center justify-start gap-2", isActive && "bg-accent", button.className)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  )
}
