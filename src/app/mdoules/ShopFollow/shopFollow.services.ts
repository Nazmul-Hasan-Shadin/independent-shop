import prisma from "../../../utils/prisma";

const followShop = async (user: any, shopId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      shopFollower: true,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const alreadyFollowing = existingUser.shopFollower?.some(
    (follower:any) => follower.shopId === shopId
  );

  if (alreadyFollowing) {
    throw new Error("User already follows this shop");
  }

  return prisma.shopFollower.create({
    data: {
      userId: existingUser.id,
      shopId,
    },
  });
};

const checkValidityOfFollow = async (user: any, shopId: string) => {
  // if (!userId || !shopId) {
  //   throw new Error("Both userId and shopId are required.");
  // }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      shopFollower: true,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }
  const result = await prisma.shopFollower.findUnique({
    where: {
      userId_shopId: {
        userId: existingUser?.id,
        shopId,
      },
    },
  });

  return result;
};

const unfollowShop = async (user: any, shopId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      shopFollower: true,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const userId = existingUser?.id;

  // const followerRecord = existingUser.shopFollower?.find(
  //   (follower) => follower.shopId === shopId
  // );

  // if (!followerRecord) {
  //   throw new Error("User does not follow this shop");
  // }

  return await prisma.shopFollower.delete({
    where: {
      userId_shopId: {
        userId,
        shopId,
      },
    },
  });
};

export const FollowerServices = {
  unfollowShop,
  followShop,
  checkValidityOfFollow,
};
