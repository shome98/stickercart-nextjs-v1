import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document{
    title:string;
    createdBy:string|Schema.Types.ObjectId;
}
const categorySchema=new Schema<ICategory>({
    title:{type:String, required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:"User"}
})
export const Category=mongoose.models.Category||mongoose.model<ICategory>("Category",categorySchema);