import { AnyZodObject } from './../../node_modules/zod/src/v3/types';


import catchAsync from "../utils/catchAsync"

const validateRequest=(schema:AnyZodObject)=>{

    return catchAsync(async(req,res,next)=>{
       await schema.parseAsync({
        body:req.body
       })
       next()
    })
}

export default validateRequest