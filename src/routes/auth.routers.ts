import { Router } from "express"
import { getMyDetails, getRefreshToken, login, register } from "./../controllers/auth.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/login", login)
router.post("/register", register)
router.post("/refresh-token", getRefreshToken)

// PR
router.get("/me", authenticate, getMyDetails)

// ADMIN, 

export default router
