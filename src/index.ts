import express, { type Request, type Response } from "express"
import AuthRouter from "./routes/auth.routers"
import ArticleRouter from "./routes/article.routes"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
dotenv.config()

const MONGO_URL = process.env.MONGO_LOCAL_URL
const PORT = process.env.PORT || 3000

if (!MONGO_URL) {
  throw new Error("MONGO_LOCAL_URL is not configured")
}

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/article", ArticleRouter)

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected..!")

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Fail to connect DB..!", err)
    process.exitCode = 1
  })
