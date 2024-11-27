import dbConnect from "@/db/dbConnection";
import { Category } from "@/db/models/category.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const { title } = await req.json();
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        if (title) {
            await dbConnect();
            const exists = await Category.findOne({ title });
            if(!exists)
            {
                const catObj = new Category({ title, createdBy: token?._id });
                const newCat = await Category.create(catObj);
                if (newCat) return NextResponse.json({ success: true, data: Category.findById(newCat._id) });
            }
            return NextResponse.json({ success: false, error: "Category already exists" }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: "Please provide a title" });
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