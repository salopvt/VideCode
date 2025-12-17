"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUserById= async(id:string)=>{
     if (!id) return null

  try {
    return await db.user.findUnique({
      where: { id }
    })
  } catch (e) {
    console.error("getUserById error:", e)
    return null
  }
        }

export const getAccountByUserId= async(userId:string)=>{
    try {
       const account= await db.account.findFirst({
        where:{
            userId
        }
       })
       return account
    } catch (error) {
        console.log(error)
        return null
    }
}


export const currentUser= async()=>{
    const user= await auth();
    return user?.user;
}