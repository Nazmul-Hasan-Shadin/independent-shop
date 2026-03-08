-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'SSL', 'STRIPE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
