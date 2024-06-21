'use server'
 
import { redirect } from 'next/navigation'
 
export async function redirectToTool() {
  redirect(`/tool`)
}