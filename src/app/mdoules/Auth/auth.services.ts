import { UserStatus } from "../../../generated/prisma/enums";
import config from "../../../config";
import { generateToken } from "../../../utils/jwtUtils";
import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../../utils/sendMail";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new AppError(404, "User not found");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(401,"password is incorrect");
  }

  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as any
  );

  const refreshtoken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.refreshToken_sec as string,
    config.jwt.refresh_token_expires_in as any
  );

  return {
    accessToken,
    refreshtoken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }

  const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
    },
  });

  return {
    message: "password changed successfully",
  };
};

const forgetPassword = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: id,
    },
  });

  const userStatus = user?.status;

  if (!user) {
    throw new AppError(404, "This user is not found ");
  }

  const jwtPayload = { email: user.email, role: user.role };

  const resetToken = jwt.sign(
    jwtPayload,
    config.jwt.reset_pass_token as string,
    {
      expiresIn: "10m",
    }
  );

  const resetUILink = `https://e-commerce-frontend-beryl-nu.vercel.app/reset-pass?id=${user.email}&token=${resetToken}`;

  sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: any
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(404, "This user is not found ");
  }

  if (!token) {
    throw new AppError(403, "you are forbidden");
  }

  const decoded = jwt.verify(
    token,
    config.jwt.reset_pass_token as string
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new AppError(401, "Your are forbidden");
  }

  const newHashedPassword = await bcrypt.hash(payload.newPassword, 7);
  const result = await prisma.user.update({
    where: {
      email: decoded.email,
      role: decoded.role,
    },
    data: {
      password: newHashedPassword,
    },
  });
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
