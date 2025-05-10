"use client"

import { CreateResearch } from "@/components/research/create-research"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { ResearchSchema } from "@/db/schema/research"
import { useUrlState } from "@/hooks/use-url-state"
import { FileText } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { CREATE_RESEARCH_CANVAS_NAME } from "~/constants/canvas"

interface ViewResearchesProps {
  researches: Array<ResearchSchema>
}

export const ViewResearches = ({ researches }: ViewResearchesProps) => {
  const searchParams = useSearchParams()
  const { openCanvas } = useCanvas()
  const { set } = useUrlState()

  const handleOpenCanvas = () => {
    openCanvas({
      position: "right",
      width: "350px",
      content: <CreateResearch />,
      id: CREATE_RESEARCH_CANVAS_NAME,
      pushElementId: "__dashboard-layout-container",
      wrapperClassName: "h-full p-0",
    })
  }

  useEffect(() => {
    const sid = searchParams.get("sid")
    if (sid == CREATE_RESEARCH_CANVAS_NAME) handleOpenCanvas()
  }, [searchParams])

  if (researches.length < 1) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FileText className="size-12 text-gray-500" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">No research papers yet</h2>

          <p className="mb-8 text-gray-500">Create your first research paper to collect data through surveys.</p>
          <p className="mb-8 text-gray-500">Your survey automatically gets shared to other users on the platform.</p>

          <Button
            onClick={e => {
              e.stopPropagation()
              handleOpenCanvas()
              set([{ name: "sid", value: CREATE_RESEARCH_CANVAS_NAME }])
            }}
            className="flex h-auto items-center justify-center gap-2 rounded-xl bg-black px-6 py-5 text-white hover:bg-gray-800"
          >
            <span className="text-sm font-semibold">Create Your First Research Paper</span>
          </Button>
        </div>
      </div>
    )
  }

  return <div>ViewResearches</div>
}
