import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const { email, password } = await req.json();
        await dbConnect();
        if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Both email and password are required." },
        { status: 400 }
      );
    }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists. Please login." },
        { status: 409 }
      );
    }
        
        const newUser = await User.create({ email, password, username: email.split("@")[0] });
        const createduser = await User.findById(newUser._id);
        return NextResponse.json({ success: true, data: createduser });
    } 
    catch (error: unknown) {
    console.error(error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}



