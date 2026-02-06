
import { Prisma, Shop } from "../../../generated/prisma/client";
import prisma from "../../../utils/prisma";
import { Request } from "express";

const createShop = async (req: Request) => {
  if (req.file) {
    req.body.logo = req?.file.path;
  }

  const newShop: Shop = await prisma.shop.create({
    data: req.body,
    include: {
      vendor: true,
    },
  });
  return newShop;
};

const getTopTenShop = async () => {
  const result = await prisma.shop.findMany({
    include: {
      product: true,
    },
  });
  return result;
};

const getAllShop = async (
  filterQuery: Record<string, any>,
  options: Record<string, any>
) => {

  console.log('iam hit');
  
  const { searchTerm, ...othersFilter } = filterQuery;
    console.log(othersFilter,'otherFileters');
    console.log(filterQuery,'filterquery');
    
    
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: ["name", "description"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const filteredQuery = {...options};

  const excludePaginationParameterFromQuery = [
    "limit",
    "page",
    "orderBy",
    'searchTerm',
    "sortBy",
  ];
  for (const key of excludePaginationParameterFromQuery) {
    delete filteredQuery[key];
  }

  if (Object.keys(filteredQuery).length > 0) {
    const filterCondition = Object.keys(filterQuery).map((key) => ({
      [key]: {
        contains: filterQuery[key],
      },
    }));

    andCondition.push(...filterCondition);
  }

  const filteredWhereCondition =
    andCondition.length > 0 ? { AND: andCondition } : {};
     console.log(filterQuery?.limit,'k');

     
  let limit = Number(filterQuery.limit) || 12;
  let page = Number(filterQuery.page) || 1;
  let skip = (page - 1) * limit;

  const result = await prisma.shop.findMany({
    include: {
       _count:{
        select:{
          product:true,
          Order:true,
          shopFollower:true
        }
       }
    },
    where: filteredWhereCondition,
    skip:skip,
    take:limit,
    orderBy: filterQuery.sortBy && filterQuery?.orderBy ? {[filterQuery.orderBy]:filterQuery.sortBy}:{createdAt:'asc'}
  });

    const total = await prisma.product.count({ where: filteredWhereCondition });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };


};

const getShopById = async (shopId: string) => {
  const result = await prisma.shop.findUnique({
    where: {
      id: shopId,
    },
    include: {
      shopFollower: true,
    },
  });
  return result;
};
export const shopServices = {
  createShop,
  getShopById,
  getTopTenShop,
  getAllShop,
};
