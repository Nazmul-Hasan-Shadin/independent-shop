import { User } from "../../../generated/prisma/client";
import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";

const createUser = async (payload: any) => {
   if (!payload.email || !payload.password || !payload.username) {
  throw new AppError(400, "Required fields are missing");
}
  const existUser=await prisma.user.findUnique({
    where:{
      email:payload.email
    }
  })
   const existUserName= await prisma.user.findFirst({
    where:{
      email:payload.username
    }
  })
   if (existUser) {
    throw new AppError(409,'This email already registered')
   }

      if (existUserName) {
    throw new AppError(409,'This username already taken')
   }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const result = prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  return result;
};

const getUserByEmail = async (userInfo: any): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: userInfo.email,
    },
    include: {
      Order: true,
      shop: true,
      shopFollower: true,
    },
  });
  console.log(user,'iamu suer');
  

  return user;
};
const getAllUser = async () => {
  const user = await prisma.user.findMany({});

  return user;
};

export const UserServices = {
  createUser,
  getUserByEmail,
  getAllUser,
};
