import { ComponentProps, ElementType } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface RadioCardProps
  extends ComponentProps<"button">,
    MixinProps<"title", ComponentProps<"h3">>,
    MixinProps<"description", ComponentProps<"div">> {
  icon: ElementType
  titleText: string
  descriptionText: string
  isSelected: boolean
  onClick: () => void
}

export const RadioCard = ({
  titleText,
  descriptionText,
  icon: Icon,
  onClick,
  isSelected,
  ...mixinProps
}: RadioCardProps) => {
  const { rest, title, description } = splitProps(mixinProps, "title", "description")

  return (
    <button
      {...rest}
      className={cn(
        "relative flex cursor-pointer flex-col items-center rounded-lg border-2 p-6 transition-all",
        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
        rest.className,
      )}
      onClick={onClick}
    >
      <div className={cn("mb-4 rounded-full p-3", isSelected ? "bg-primary text-white" : "bg-muted")}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 {...title} className={cn("text-lg font-medium", title.className)}>
        {titleText}
      </h3>
      <p {...description} className={cn("text-muted-foreground mt-2 text-center text-sm", description.className)}>
        {descriptionText}
      </p>

      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      )}
    </button>
  )
}
