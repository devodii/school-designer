import { BlurImage } from "@/components/blur-image"
import { CardRoot } from "@/components/card-root"
import { Button } from "@/components/ui/button"

interface ClassroomCardProps {
  name: string
  backgroundImage: string
  members: Array<{ id: string; name: string; avatar: string }>
  isJoined?: boolean
}

export const ClassroomCard = ({ backgroundImage, members, name, isJoined }: ClassroomCardProps) => {
  return (
    <CardRoot
      as="li"
      headerClassName="p-0"
      className="pt-0 pb-2"
      titleChildren={
        <div className="relative flex flex-col gap-2">
          <div
            className="top-0 right-0 left-0 h-24 rounded-ss-xl rounded-se-xl bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      }
      contentChildren={
        <div className="-mt-6 flex flex-col items-start gap-2">
          <div className="text-md font-semibold">{name}</div>
          <div>
            {members.map(m => (
              <BlurImage
                key={m.id}
                src={m.avatar}
                alt={m.name}
                width={32}
                height={32}
                className="-ml-2 inline-flex rounded-full"
              />
            ))}
          </div>
        </div>
      }
      footerChildren={
        <div className="flex w-full items-center justify-end">
          {isJoined ? <Button>Open</Button> : <Button>Join</Button>}
        </div>
      }
    />
  )
}
