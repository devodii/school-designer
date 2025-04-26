import db from "@/db"

export const getUser = async (email: string) => {
  return await db.query.account.findFirst({ where: (account, { eq }) => eq(account.email, email) })
}
