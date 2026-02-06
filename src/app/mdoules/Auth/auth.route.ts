import express from "express";
import { AuthController } from "./auth.controller";
import auth from "./auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post(
  "/change-password",
  auth(Role.user, Role.admin, Role.vendor),
  AuthController.changePassword
);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
