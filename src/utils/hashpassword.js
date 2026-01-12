// const bcrypt=require("bcryptjs")
import bcrypt from "bcryptjs";
export const hash =async (password) =>{
    const gensalt=await bcrypt.genSalt(10);
    return  await bcrypt.hash(password,gensalt)
}