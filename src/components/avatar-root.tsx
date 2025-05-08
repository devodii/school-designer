import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface AvatarRootProps
  extends ComponentProps<typeof Avatar>,
    MixinProps<"image", ComponentProps<typeof AvatarImage>>,
    MixinProps<"fallback", ComponentProps<typeof Avatar>> {}

export const AvatarRoot = (mixinProps: AvatarRootProps) => {
  const { image, fallback, ...rest } = splitProps(mixinProps, "image", "fallback")

  return (
    <Avatar {...rest}>
      <AvatarImage {...image} />
      <AvatarFallback {...fallback} />
    </Avatar>
  )
}
