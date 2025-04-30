"use client"

import * as React from "react"

import { cn } from "@/lib/tw-merge"
import Image, { type ImageProps } from "next/image"

interface Props extends ImageProps {}

export const BlurImage = ({ className, ...forwardedProps }: Props) => {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <Image
      {...forwardedProps}
      onLoad={() => setIsLoading(false)}
      className={cn("duration-700 ease-in-out", isLoading ? "scale-100 blur-sm" : "blur-0 scale-100", className)}
    />
  )
}
