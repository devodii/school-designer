"use client"

import * as React from "react"

interface Props {
  size?: number
  strokeColor?: string
  [key: string]: any
}

export const Spinner = ({ size = 30, strokeColor = "currentColor", ...props }: Props) => {
  const [UseAnimations, setUseAnimations] = React.useState<any>(null)
  const [loadingAnimation, setLoadingAnimation] = React.useState<any>(null)

  React.useEffect(() => {
    // Dynamically import on client only
    Promise.all([import("react-useanimations"), import("react-useanimations/lib/loading")]).then(
      ([{ default: UseAnimationsMod }, loadingAnimationMod]) => {
        setUseAnimations(() => UseAnimationsMod)
        setLoadingAnimation(() => loadingAnimationMod.default || loadingAnimationMod)
      },
    )
  }, [])

  if (!UseAnimations || !loadingAnimation) return null // or a fallback

  return <UseAnimations animation={loadingAnimation} size={size} strokeColor={strokeColor} {...props} />
}
