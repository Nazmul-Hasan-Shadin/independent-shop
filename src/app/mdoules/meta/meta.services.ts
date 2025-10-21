import { Role } from "@prisma/client";
import { IAuthUser } from "../../../interface/common";
import prisma from "../../../utils/prisma";
import AppError from "../../error/AppError";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  switch (user.role) {
    case Role.admin:
      return getAdminMetaData(user);
      break;
    case Role.vendor:
      return getVendorMetaData(user);
      break;
    default:
      throw new AppError(404, "invalid role");
  }
};

const getAdminMetaData = async (user: IAuthUser) => {
  const vendorCount = await prisma.user.count({
    where: {
      role: Role.vendor,
    },
  });
  const userCount = await prisma.user.count({
    where: {
      role: Role.user,
    },
  });
  const adminCount = await prisma.user.count({
    where: {
      role: Role.admin,
    },
  });
  const totalRevenu = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });
  return {
    vendorCount,
    userCount,
    totalRevenu: totalRevenu?._sum?.totalAmount,
    adminCount,
  };
};

const getVendorMetaData = async (user: IAuthUser) => {
  const orderCount = await prisma.order.count({
    where: {
      shop: {
        vendor: {
          email: user.email,
        },
      },
    },
  });

  const totalRevenu = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      shop: {
        vendor: {
          email: user.email,
        },
      },
    },
  });

  const totalReview = await prisma.review.count({
    where: {
      product: {
        shop: {
          vendor: {
            email: user.email,
          },
        },
      },
    },
  });

  const productCount = await prisma.product.count({
    where: {
      shop: {
        vendor: {
          email: user.email,
        },
      },
    },
  });

  const saleCountByMonth = await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('month', "createdAt") AS month,
    COUNT(*) AS count
  FROM "orders"
  GROUP BY month
  ORDER BY month ASC
`;

  //   console.log( {orderCount,totalRevenu,totalReview,productCount});

  return {
    orderCount,
    totalRevenu: totalRevenu?._sum?.totalAmount,
    totalReview,
    productCount,
    saleCountByMonth
  };
};

// const getUserMetaData = async (user: IAuthUser) => {
//   const vendorCount = await prisma.user.count({
//     where: {
//       role: "vendor",
//     },
//   });
//   const userCount = await prisma.user.count({});
//   const totalRevenu = await prisma.order.aggregate({
//     _sum: {
//       totalAmount: true,
//     },
//   });
// };

// const getBarChartData=async()=>{
//      const saleCountByMonth:{month:Date}=await prisma.$queryRaw`
//      SELECT DATE_TRUNC('month','createdAt') AS month;
//      COUNT(*) AS count,
//      FROM "order"
//      GROUP BY month
//      ORDER BY month ASC
//      `
// }

export const MetaServices = {
  fetchDashboardMetaData,
};
