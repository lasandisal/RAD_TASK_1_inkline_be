import { model, Schema } from "mongoose"

export interface IArticle {
  title: string
  content: string
  author: string
  imageURL?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    imageURL: { type: String, trim: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
)

export const ArticleModel = model<IArticle>("articles", articleSchema)
