import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Calendar, FileText, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface StudentProfilePageProps {
  params: Promise<{ handle: string }>
}

export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { handle } = await params

  // Mock data - in a real app, this would come from an API
  const studentData = {
    username: handle || "student",
    name: handle ? `${handle.charAt(0).toUpperCase() + handle.slice(1)}` : "Student",
    bio: "Student interested in science and mathematics. Always eager to learn new things and collaborate with classmates.",
    imageUrl: "https://596gq6g4k3.ufs.sh/f/SqSXRwJrsBHTO9XCJrQqPEHjhasfVTMtyoWGv7nbZBx2Krld",
    joinedDate: "May 2023",
    classrooms: [
      { id: "1", name: "Chemistry 101" },
      { id: "2", name: "Advanced Mathematics" },
    ],
    recentActivities: [
      { id: "1", type: "notes", title: "Shared notes on Chapter 5", date: "2 days ago" },
      { id: "2", type: "homework", title: "Completed Assignment 3", date: "1 week ago" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start">
              <Image
                src={studentData.imageUrl || "/images/default-avatar.png"}
                alt={studentData.name}
                width={96}
                height={96}
                className="size-24 rounded-full"
              />
              <div className="mt-4 text-center sm:mt-0 sm:ml-6 sm:text-left"></div>

              <div className="mt-4 text-center sm:mt-0 sm:ml-6 sm:text-left">
                <h1 className="mb-1 text-2xl font-bold">{studentData.name}</h1>
                <div className="mb-3 text-gray-500">@{studentData.username}</div>
                <p className="mb-4 text-gray-700">{studentData.bio}</p>
                <div className="text-sm text-gray-500">Member since {studentData.joinedDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Classrooms */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-medium">Classrooms</h2>
                {studentData.classrooms.length > 0 ? (
                  <div className="space-y-3">
                    {studentData.classrooms.map(classroom => (
                      <Link href={`/classroom/${classroom.id}`} key={classroom.id}>
                        <div className="rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                          {classroom.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">No classrooms joined yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-medium">Recent Activity</h2>
                {studentData.recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {studentData.recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start rounded-md bg-gray-50 p-3">
                        <div className="mt-0.5 mr-3">
                          {activity.type === "notes" && <BookOpen size={16} className="text-blue-500" />}
                          {activity.type === "homework" && <Calendar size={16} className="text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline">
                            <span className="font-medium">{activity.title}</span>
                            <span className="text-xs text-gray-500 sm:ml-2">{activity.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No activity yet</h3>
                    <p className="max-w-sm text-gray-500">
                      When this student shares notes, homework, or participates in classrooms, their activity will
                      appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button className="bg-black text-white hover:bg-gray-800">
            <MessageCircle size={16} className="mr-2" />
            Message Student
          </Button>
        </div>
      </div>
    </div>
  )
}
