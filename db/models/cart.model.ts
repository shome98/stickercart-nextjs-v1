import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.model";

export interface ICart{
    createdBy:string|Schema.Types.ObjectId;
    items:[{productId:string|Schema.Types.ObjectId,quantity:number}];
}
const cartSchema=new Schema<ICart>({
    createdBy:{type:Schema.Types.ObjectId,ref:"User"},
    items:{type:[{productId:{type:Schema.Types.ObjectId,ref:"Product"},
    quantity:{type:Number,required:true,min:[1,"Quantity can not be Zero"],default:1}}],default:[]}
},{timestamps:true});
export const Cart=mongoose.model<ICart>("Cart",cartSchema);