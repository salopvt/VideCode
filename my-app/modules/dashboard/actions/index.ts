"use server";
import { currentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";

export const getAllPlaygroundForUser = async()=>{
    const user = await currentUser()
  if (!user?.id) return []

  try {
    return await db.playground.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (e) {
    console.error("getAllPlaygroundForUser error:", e)
    return []
  }
}