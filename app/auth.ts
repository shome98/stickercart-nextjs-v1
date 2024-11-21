import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {
    handlers: { GET, POST },
    auth,signIn,signOut
} = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            id: "credentials",
            name:"credentials",
            credentials:{
                email: { label: "Email", type: "text" },
                password:{label:"Password",type:"text"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or: [{ email: credentials.identifier },
                        { username: credentials.identifier }
                        ]
                    });
                    if (!user) {
                        throw new Error(`No user found with this email ${credentials.identifier}`)
                    }
                    const isPasswordValid = await user.isPasswordCorrect();
                    if (isPasswordValid) return user;
                    else throw new Error("Invalid Password");
                } catch (error:any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        
    }
})