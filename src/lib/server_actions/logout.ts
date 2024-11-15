"use server"
import { signOut } from "@lib/auth/auth";

export async function _logout(){
    const res = await signOut()
    return res
}