import { NextFunction, Request, Response, Router } from "express"
import fs from "fs"
import multer, { MulterError } from "multer"
import path from "path"
import { createArticle, getArticle, getArticles } from "../controllers/article.controller"
import { authenticate } from "../middleware/auth"

const router = Router()
const uploadDirectory = path.join(__dirname, "../../uploads")

fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"))
    }

    callback(null, true)
  }
})

router.post("/create", authenticate, upload.single("imageURL"), createArticle)
router.get("/", authenticate, getArticles)
router.get("/:id", authenticate, getArticle)

router.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller"
      : `Image upload failed: ${error.message}`
    return res.status(400).json({ message })
  }

  if (error instanceof Error && error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message })
  }

  next(error)
})

export default router
