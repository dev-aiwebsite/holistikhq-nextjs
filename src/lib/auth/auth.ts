import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from './authconfig';
import bcrypt from 'bcrypt';
import { _getUsers } from "@lib/server_actions/database_crud";
import { ExtendedSession, ExtendedUser } from "@lib/types";

const login = async (credentials:Partial<Record<string, unknown>>) => {
    try {
        let user = await _getUsers({email: credentials?.useremail as string})
        
        if(Array.isArray(user)){
            user = user[0]
        }
        if(!user) throw new Error('wrong credentials')
        const viaAdmin = credentials?.viaadmin || false
        if (!viaAdmin) {
            const isPasswordCorrect = await bcrypt.compare( credentials.userpass as string, user.password as string);
            if (!isPasswordCorrect) throw new Error('wrong credentials');
          }

          console.log(user, 'from login auth.ts return user object')
        return user

    } catch  {
        throw new Error('wrong credentials')
    }
}   
class CustomError extends CredentialsSignin {
    code = "custom_error"
}

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await login(credentials)
                if(user){
                    console.log(user, 'from authorized auth.ts return user object')
                    return user
                }  else {
                    throw new CustomError('wrong credentials 2')
                }
              
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const extendedUser = user as ExtendedUser;
                token.firstName = extendedUser.firstName;
                token.lastName = extendedUser.lastName; 
                token.email = extendedUser.email; 
                token.userId = extendedUser.id;
                token.profileImage = extendedUser.profileImage;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                const ExtendedSession = session as unknown as ExtendedSession
                ExtendedSession.firstName = token.firstName as string
                ExtendedSession.lastName = token.lastName as string
                ExtendedSession.email = token.email as string
                ExtendedSession.userId = token.userId as string
                ExtendedSession.profileImage = token.profileImage as string
            }
            return session
        }
    }
});