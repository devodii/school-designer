import { ComponentProps } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MixinProps, splitProps } from "@/lib/mixin"

interface CardRootProps
  extends ComponentProps<typeof Card>,
    MixinProps<"title", ComponentProps<typeof CardTitle>>,
    MixinProps<"description", ComponentProps<typeof CardDescription>>,
    MixinProps<"content", ComponentProps<typeof CardContent>>,
    MixinProps<"header", Omit<ComponentProps<typeof CardHeader>, "children">>,
    MixinProps<"footer", ComponentProps<typeof CardFooter>> {}

export const CardRoot = (mixinProps: CardRootProps) => {
  const { title, description, content, footer, header, rest } = splitProps(
    mixinProps,
    "title",
    "description",
    "content",
    "footer",
    "header",
  )

  return (
    <Card {...rest}>
      <CardHeader {...header}>
        <CardTitle {...title} />
        <CardDescription {...description} />
      </CardHeader>

      <CardContent {...content} />
      <CardFooter {...footer} />
    </Card>
  )
}
