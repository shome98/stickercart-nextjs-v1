import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { generateToken } from "./genToken";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
}=NextAuth({
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
                    if (isPasswordValid) {
                        generateToken(user);
                        return user;
                    }
                    else throw new Error("Invalid Password");
                } catch (error:any) {
                    throw new Error(` Login error occurred ${error}`);
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const newUser = new User({
                    username: user.email?.split("@")[0],
                    email: user.email,
                    avatar: { url: profile?.avatar_url || profile?.picture },
                    provider: account?.provider,
                    isEmailVerified:true
                })
                const savedUser = await newUser.save();
                user._id = savedUser._id?.toString();
                user.username = savedUser.username;
            }
            //user = {...existingUser};
            user._id = existingUser._id?.toString();
            user.role = existingUser.role;
            await generateToken(user);
            return true;
        },
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.role = user.role;
            }
            //console.log("from route token:", token);
            //console.log("access token is-", token.access_token);
            return token;
        },
        async session({session,token}){
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
            }
            //console.log("from route :",session);
            return session;
        }
    },
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"auth/sign-in",
        signOut:"auth/sign-out"
    }
})