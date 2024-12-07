import { roles } from './../const';
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from './authconfig';
import bcrypt from 'bcrypt';
import { _getUsers } from "@lib/server_actions/database_crud";
import { ExtendedSession, ExtendedUser } from "@lib/types";
import { User } from "prisma/prisma-client";

const login = async (credentials:Partial<Record<string, unknown>>) => {
    try {
        let resuser = await _getUsers({email: credentials?.useremail as string})
        let user:User | null = null
        if(Array.isArray(resuser)){
            user = resuser[0]
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
                
                token.firstName = user.firstName;
                token.lastName = user.lastName; 
                token.email = user.email; 
                token.userId = user.id;
                token.profileImage = user.profileImage;
                token.roles = user.roles;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                
                session.firstName = token.firstName
                session.lastName = token.lastName 
                session.email = token.email 
                session.userId = token.userId 
                session.profileImage = token.profileImage 
                session.roles = token.roles
                
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName 
                session.user.email = token.email 
                session.user.userId = token.userId 
                session.user.profileImage = token.profileImage 
                session.user.roles = token.roles
                
            }
            return session
        }
    }
});