export interface AccountProfile {
  fullName: string
  userName: string
  subjectsOffered: string[]
  pictures: { id: string; url: string }[]
}
