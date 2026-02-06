import express from "express";

import { FollowerController } from "./shopFollow.controller";
import auth from "../Auth/auth";
import { Role } from "../../../generated/prisma/client";

const router = express();

router.post(
  "/check-validity-follow",
  auth(Role.user, Role.admin, Role.vendor),
  FollowerController.checkFollowValidity
);

router.post(
  "/follow",
  auth(Role.user, Role.admin, Role.vendor),
  FollowerController.followShop
);
router.post(
  "/unfollow",
  auth(Role.user, Role.admin, Role.vendor),
  FollowerController.unfollowShop
);

export const FollowerRoutes = router;
