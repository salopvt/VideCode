// auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db";
import { getUserById } from "./modules/auth/actions";
import authConfig from "./auth.config"; // Assuming this is defined and exports providers

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks:{
    async signIn({user,account}){
        if(!user || !account) return false;

        const existingUser = await db.user.findUnique({
            where:{email:user.email!}
        })

        if(!existingUser){
            const newUser= await db.user.create({
                data:{
                    email: user.email!,
                    name: user.name,
                    image: user.image,

                    accounts: {
                        create:{
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refreshToken: account.refresh_token,
                            accessToken : account.access_token,
                            expiresAt : account.expires_at,
                            tokenType: account.token_type,
                            scope: account.scope,
                            idToken: account.id_token,
                            sessionState: account.session_state, // Corrected typo here
                        }
                    }
                }
            });

            if(!newUser) return false
        }
        else{
            const existingAccount = await db.account.findUnique({
                where:{
                    provider_providerAccountId:{
                        provider:account.provider,
                        providerAccountId: account.providerAccountId,

                    },
                },
            });
            if(!existingAccount){
                 await db.account.create({
                    data:{
                        userId: existingUser.id,
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        refreshToken: account.refresh_token,
                        accessToken: account.access_token,
                        expiresAt: account.expires_at,
                        tokenType: account.token_type,
                        scope: account.scope,
                        idToken: account.id_token,
                        sessionState: account.session_state,
                    },
                 });
            }
        }

        return true;
    },
    async jwt({token}){
        if(!token.sub) return token;

        const existingUser= await getUserById(token.sub);
        if(!existingUser) return token;

        token.name=existingUser.name;
        token.email=existingUser.email;
        token.role=existingUser.role;

        return token
    },

    async session({session,token}){
         if(token.sub && session.user){
            session.user.id= token.sub
         }

         if(token.sub && session.user){
            session.user.role= token.role
         }
         return session;
    }
  },
  
  // --- ADDED CONFIGURATION TO FIX REDIRECTS ---
  session: {
      strategy: "jwt",
  },
  // --- END ADDED CONFIGURATION ---
  
  secret:process.env.AUTH_SECRET,
  adapter:PrismaAdapter(db),
  ...authConfig // Ensure this line remains at the end
});