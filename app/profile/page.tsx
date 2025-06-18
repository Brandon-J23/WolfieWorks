"use client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProfileContent from "./profile-content"

export default async function ProfilePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return <ProfileContent />
}
