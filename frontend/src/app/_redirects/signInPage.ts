'use server'
 
import { redirect } from 'next/navigation'
 
export async function redirectToSignIn() {
  redirect(`/signin`)
}