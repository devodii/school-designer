export const ChatMessageSkeleton = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500"></div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-100"></div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-200"></div>
    </div>
  )
}
