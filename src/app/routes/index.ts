import express from "express";
import { UserRoutes } from "../mdoules/User/user.route";
import { AuthRoutes } from "../mdoules/Auth/auth.route";
import { CategoryRoutes } from "../mdoules/category/category.route";
import { ProductRoutes } from "../mdoules/product/product.route";
import { ShopRoutes } from "../mdoules/shop/shop.route";
import { OrderRoutes } from "../mdoules/order/order.route";
import { ReviewRoutes } from "../mdoules/review/review.route";
import { FollowerRoutes } from "../mdoules/ShopFollow/shopFollow.route";
import { PaymentRoutes } from "../mdoules/payment/payment.route";
import { BannerRoutes } from "../mdoules/banner/banner.route";
import { PaymentRoutesSsl } from "../mdoules/SSLPAYMENT/payment.route";
import { MetaRoutes } from "../mdoules/meta/meta.route";
import { CouponRoutes } from "../mdoules/coupon/coupon.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/shop",
    route: FollowerRoutes,
  },
  {
    path: "",
    route: PaymentRoutes,
  },
  {
    path:'/banner',
    route:BannerRoutes
  },
  {
    path:'/payment-gate',
    route:PaymentRoutesSsl
  },
    {
    path:'',
    route:MetaRoutes
  },
      {
    path:'',
    route:CouponRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
