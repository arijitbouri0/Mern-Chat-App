import {Schema,model} from 'mongoose'

const UserSchema=new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        userName:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            select:false,
        },
        bio:{
            type:String,
        },
        avatar:{
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            },
        }
    },
    {
        timestamps:true
    }
)


export const User=model("User",UserSchema)