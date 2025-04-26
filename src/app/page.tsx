import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 p-6 md:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-8 lg:flex-row">
        <div className="flex max-w-2xl flex-col gap-3">
          <h4 className="text-4xl font-semibold">🎒 Design your school life</h4>
          <p className="text-secondary-foreground text-[17px]">
            AI-made notebooks, planners, timetables, and class themes that actually match your vibe. Download & print,
            or flex it with your friends
          </p>
          <ul className="">
            <li>🎨 Make notebooks with your picture on the cover</li>
            <li>🎓 Generate photos of you in your dream college/university</li>
            <li>📚 Join or create classrooms for studying with your buddies!</li>
            <li>🔥 And lots more...</li>
          </ul>
        </div>

        <div className="flex max-w-sm flex-1 flex-col gap-3">
          <TextField labelHtmlFor="email" inputId="email" labelText="Email" />
          <Button className="w-full">Continue</Button>
        </div>
      </section>
    </div>
  )
}
