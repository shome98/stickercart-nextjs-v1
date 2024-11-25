import dbConnect from "@/db/dbConnection";
import { User } from "@/db/models/user.model";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
export async function generateToken(user){
    const {_id,email,username,role}=user;
    const tokenData={id:_id,username:username,email:email,role:role};
    const refreshData={id:_id,role:role};
    const accessToken=jwt.sign(tokenData,process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:"30m"});
    const refreshToken=jwt.sign(refreshData,process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:"7d"});
    const getCookies = cookies();
    (await getCookies).set("access_token",accessToken);
    (await getCookies).set("refresh_token",refreshToken);
}

// export async function refreshAccess(refreshToken){
// const decodedToken=await jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY as string);
// //strategy 1
// await dbConnect();
// const userInfo=await User.find(decodedToken.id);
// if(userInfo){
// const {_id,email,username,role}=userInfo;
// const tokenData={id:_id,username:username,email:email,role:role};
// const accessToken=jwt.sign(tokenData,process.env.ACCESS_SECRET_KEY as string,{expiresIn:"30m"}); 
// const getCookies=cookies();
// (await getCookies).set("access_token",accessToken);
// }
// }