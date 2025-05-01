export const TEst = () => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          {msg.sender === "ai" && (
            <div className="mr-2 flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200">AI</AvatarFallback>
              </Avatar>
            </div>
          )}

          <div
            className={`max-w-[80%] rounded-xl p-3 ${
              msg.sender === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
          >
            {msg.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-100"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-500 delay-200"></div>
              </div>
            ) : (
              <>
                {msg.tags && msg.tags.length > 0 && (
                  <div className="mb-1 flex gap-1">
                    {msg.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div>{msg.content}</div>
                {msg.profileData && <UserProfileCard profile={msg.profileData} />}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
