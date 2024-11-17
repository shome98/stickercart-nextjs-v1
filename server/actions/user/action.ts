"use server";
import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";

export const registerUser = async (formData: { email: string; password:string})=>{
    try {
        const { email, password } = formData;
        await dbConnect();
        if (!email || !password) { throw new Error("All fields are expected"); }
        const checkExist = await User.findOne({ email });
        if (checkExist) { throw new Error("User already exist please login or reset password"); }
        
        const newUser = await User.create({ ...formData,username:email.split("@")[0] });
        const createduser = await User.findById(newUser._id);
        return { success: true, data: JSON.parse(JSON.stringify(createduser)) };
    } catch (error) {
        console.error(error);
        //return { error };
    }
}