import { ComponentProps } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MixinProps, splitProps } from "@/lib/mixin"

interface CardRootProps
  extends ComponentProps<typeof Card>,
    MixinProps<"title", ComponentProps<typeof CardTitle>>,
    MixinProps<"description", ComponentProps<typeof CardDescription>>,
    MixinProps<"content", ComponentProps<typeof CardContent>>,
    MixinProps<"footer", ComponentProps<typeof CardFooter>> {
  cardHeaderClassname?: string
}

export const CardRoot = ({ cardHeaderClassname, ...mixinProps }: CardRootProps) => {
  const { title, description, content, footer, action, rest } = splitProps(
    mixinProps,
    "title",
    "description",
    "content",
    "footer",
    "action",
  )

  return (
    <Card {...rest}>
      <CardHeader className={cardHeaderClassname}>
        <CardTitle {...title} />
        <CardDescription {...description} />
      </CardHeader>

      <CardContent {...content} />
      <CardFooter {...footer} />
    </Card>
  )
}
