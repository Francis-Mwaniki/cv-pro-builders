"use server"
import * as jose from 'jose'
import { cookies } from 'next/headers'
export async function getUserIdFromCookie(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token');
  
      if (!token?.value) {
        console.log("No token found in cookies");
        return null;
      }
  
      if (typeof token.value !== 'string' || !token.value.includes('.')) {
        console.log("Invalid token format");
        return null;
      }
  
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      if (!secret || secret.length === 0) {
        console.error("JWT_SECRET is not properly configured");
        return null;
      }
  
      const { payload } = await jose.jwtVerify(token.value, secret);
  
      if (!payload || typeof payload.userId !== 'string') {
        console.log("Invalid payload or missing userId");
        return null;
      }
  
      return payload.userId;
    } catch (error) {
      console.error("Error in getUserIdFromCookie:", error);
      return null;
    }
  }