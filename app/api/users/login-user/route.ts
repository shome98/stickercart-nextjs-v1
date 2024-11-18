import { User } from "@/db/models/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {email,password}=await req.json();
    if(!email && !password) {
        return NextResponse.json(
            { success: false, error: "Both email and password are required." },
            { status: 400 }
          );
    }
    const existingUser = await User.findOne({ email });
        if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Looks like you don't have an account here. Please Sign up first." },
        { status: 409 }
      );
    }
    if(existingUser.password!==password){
        return NextResponse.json(
            { success: false, error: "Looks like you have entered a wrong password." },
            { status: 409 }
          );
    }
    const cookie=cookies();
    (await cookie).set("login","user is logged in");
    return NextResponse.json(
        {success:true,message:"you have successfully logged in."},
        {status:201}
    );
}