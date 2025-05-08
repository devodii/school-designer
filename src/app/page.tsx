import { getCurrentUser } from "@/actions/session"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col items-center justify-center gap-20 p-6 md:p-12 lg:p-24">
      <header className="fixed top-4 right-0 left-0 flex w-screen justify-between px-4 md:px-8">
        <Logo />

        <nav className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline">Log in</Button>
              </Link>

              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="flex w-full">
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <h2 className="text-center text-4xl font-semibold">The #1 Note taking app for students</h2>
          <p className="text-secondary-foreground max-w-2xl text-center text-[17px]">
            AI-made notebooks, planners, timetables, and class themes that actually match your vibe. Download & print,
            or flex it with your friends
          </p>
          <ul className="">
            <li>🎨 Make notebooks with your picture on the cover</li>
            <li>🎓 Generate photos of you in your dream college/university</li>
            <li>📚 Join or create classrooms for studying with your buddies!</li>
            <li>🔥 ... and lots more</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
