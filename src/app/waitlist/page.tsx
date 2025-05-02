import { JoinWaitlist } from "@/components/join-waitlist"

export default function WaitlistPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="container mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-bold">School Designer</div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col space-y-6">
              <h1 className="text-center text-2xl leading-tight font-bold md:text-left md:text-4xl">
                Your AI-Powered Study Sidekick Is Coming
              </h1>
              <p className="text-lg">
                Get your own anime-style AI notebook, quizzes, and custom study tools – all from one chat.
              </p>

              <JoinWaitlist />
            </div>

            <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6">
              {/* Mockup images */}
              <div className="mb-6 text-center">
                <h3 className="mb-2 font-medium">AI Chat with Smart Tags</h3>
                <div className="aspect-[9/16] w-full max-w-xs overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                  <div className="flex h-12 items-center border-b border-gray-200 px-4">
                    <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-full p-4">
                    <div className="mb-4 flex justify-start">
                      <div className="max-w-[75%] rounded-xl bg-gray-100 p-3">
                        <div className="mb-2 h-3 w-24 rounded bg-gray-300"></div>
                        <div className="h-3 w-48 rounded bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="mb-4 flex justify-end">
                      <div className="max-w-[75%] rounded-xl bg-black p-3">
                        <div className="mb-2 h-3 w-32 rounded bg-gray-600"></div>
                        <div className="h-3 w-24 rounded bg-gray-600"></div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[75%] rounded-xl bg-gray-100 p-3">
                        <div className="mb-2 h-24 w-full rounded-md bg-gray-300"></div>
                        <div className="h-3 w-28 rounded bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
