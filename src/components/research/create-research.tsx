import { CheckboxCard } from "@/components/checkbox-card"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { educationLevelEnum } from "@/db/schema/account"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCap, School, TestTube } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const createResearchSchema = z.object({
  title: z.string().min(1),
  surveyLink: z
    .string()
    .url()
    .refine(url => url.startsWith("https://forms.gle/"), {
      message: "Invalid Google Forms survey link",
    }),
  description: z.string().min(1),
  targetAudience: z.array(z.enum(educationLevelEnum.enumValues)).min(1),
})

const targetAudienceOptions = [
  {
    value: "ELEMENTARY_SCHOOL",
    icon: School,
    titleText: "Elementary School",
    descriptionText: "Elementary School",
  },
  {
    value: "HIGH_SCHOOL",
    icon: School,
    titleText: "High School",
    descriptionText: "High School",
  },
  {
    value: "COLLEGE",
    icon: GraduationCap,
    titleText: "College",
    descriptionText: "College",
  },
  {
    value: "RESEARCHER",
    icon: TestTube,
    titleText: "Researcher",
    descriptionText: "Researcher",
  },
]

type CreateResearchSchema = z.infer<typeof createResearchSchema>

export const CreateResearch = () => {
  const form = useForm<CreateResearchSchema>({
    resolver: zodResolver(createResearchSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(d => console.log({ d }))} className="space-y-4 py-4">
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="Title"
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputValue={field.value}
            errorText={error?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <TextareaField
            id={field.name}
            labelText="Description"
            textareaOnChange={field.onChange}
            textareaOnBlur={field.onBlur}
            textareaValue={field.value}
            errorText={error?.message}
            textareaPlaceholder="Explain what your research is about"
            textareaClassName="min-h-[100px]"
          />
        )}
      />

      <Controller
        control={form.control}
        name="surveyLink"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="Google Forms Survey Link (Optional)"
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputValue={field.value}
            errorText={error?.message}
            inputPlaceholder="https://forms.gle/..."
          />
        )}
      />

      <Controller
        control={form.control}
        name="targetAudience"
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <CheckboxCard options={targetAudienceOptions} onChange={field.onChange} />
            <p className="text-muted-foreground text-sm">This will help us personalize the recommendations for you.</p>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        )}
      />

      <div className="flex w-full justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button className="w-max" type="submit">
          <span className="text-sm font-medium">Create Research</span>
          <Spinner size={16} />
        </Button>
      </div>
    </form>
  )
}
