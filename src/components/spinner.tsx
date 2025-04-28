"use client"

import * as React from "react"

import dynamic from "next/dynamic"
import loadingAnimation from "react-useanimations/lib/loading"

const UseAnimations = dynamic(() => import("react-useanimations"), { ssr: false })

interface Props extends Omit<React.ComponentPropsWithoutRef<typeof UseAnimations>, "animation"> {}

export const Spinner = ({ size = 30, strokeColor = "currentColor", ...props }: Props) => {
  return <UseAnimations animation={loadingAnimation} size={size} strokeColor={strokeColor} {...props} />
}
