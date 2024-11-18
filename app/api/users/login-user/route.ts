import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Both email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Account does not exist. Please sign up." },
        { status: 404 }
      );
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const cookie = cookies();
    (await cookie).set("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60,secure:true }); 
    (await cookie).set("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60,secure:true });

    return NextResponse.json(
      { success: true, message: "Successfully logged in." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
