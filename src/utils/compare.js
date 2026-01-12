// const bcrypt=require("bcryptjs")
import bcrypt from "bcryptjs";
export const compare =async (password,comparepassword) =>{
    return await bcrypt.compare(password,comparepassword);
}