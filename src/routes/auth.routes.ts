import { Router } from "express";
import {
  adminLogin,
  customerLogin,
  customerRegister,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const router = Router();

router.post("/admin/login", validate(loginSchema), adminLogin);
router.post("/customers/login", validate(loginSchema), customerLogin);
router.post("/customers/register", validate(registerSchema), customerRegister);

export default router;
