import express from "express";

import { Role } from "../../../generated/prisma/enums"; 
import { MetaController } from "./meta.controller";
import auth from "../Auth/auth";

const router = express.Router();

router.get("/meta", auth(Role.admin,Role.user,Role.vendor),MetaController.getRoleMeta);



export const MetaRoutes = router;
