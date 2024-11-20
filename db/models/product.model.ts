import mongoose, { Schema } from "mongoose";

export interface IProduct{
    title:string;
    description:string;
    category:string|Schema.Types.ObjectId;
    price:number;
    image:{url:string};
    subImages:[{url:string}];
    createdBy:string|Schema.Types.ObjectId;
    inventory:number;
}
const productSchema=new Schema<IProduct>({
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,default:0},
    image:{type:{url:String}},
    subImages:{type:[{url:String}]},
    inventory:{type:Number,default:0},
    category:{type:Schema.Types.ObjectId,ref:"Category",required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});
export const Product=mongoose.model<IProduct>("Product",productSchema);