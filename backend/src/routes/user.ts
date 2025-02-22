import { Router } from "express";
import { isAuth } from "@middlewares/auth";
import { getUserById } from "@controllers/user";

const router = Router();

router.get("/me", isAuth, getUserById);

export default router;
