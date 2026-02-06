import { Banner } from "../../../generated/prisma/client"; 
import prisma from "../../../utils/prisma";

const createBannerIntoDb = async (bannerInfo: Banner) => {
  const result = await prisma.banner.create({
    data: bannerInfo,
  });

  return result;
};

const getBannerFromDb = async () => {
  const result = await prisma.banner.findMany({});
  return result;
};

const updateBannerIntoDb = async (payload: Banner) => {
  const result = await prisma.banner.update({
    where: {
      id: payload.id,
    },
    data: payload,
  });
  return result;
};

export const BannerServices = {
  createBannerIntoDb,
  getBannerFromDb,
  updateBannerIntoDb
};
