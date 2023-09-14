import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth.route";
import morgan from "morgan";

export const prisma = new PrismaClient();
const app = express();
const cors= require('cors');

async function main() {
  // Middleware
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  //   Health Checker
  app.get("/api/healthchecker", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to Two-Factor Authentication with Node.js",
    });
  });

  app.use("/api/auth", authRouter);

  app.all("*", (req: Request, res: Response) => {
    return res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} not found`,
    });
  });

  const PORT = 8000;
  app.listen(PORT, () => {
    console.info(`Server started on port: ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
