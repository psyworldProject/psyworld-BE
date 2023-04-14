import { myDataBase } from "./db";
import express, { Request, Response } from "express";
import cors from "cors";
import AuthRouter from "./router/auth";
import diaryRouter from "./router/diary";
import usersRouter from "./router/users";
import { upload } from "./uploadS3";

export const tokenList = {};

myDataBase
  .initialize()
  .then(() => {
    console.log("DataBase has been initialized!");
  })
  .catch((error) => {
    console.error("Error during DataBase initialization:", error);
  });

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: true, // 모두 허용
  })
);

app.use("/users", usersRouter);
app.use("/auth", AuthRouter);
app.use("/diary", diaryRouter);

app.post("/upload", upload.single("img"), (req: Request, res: Response) => {
  res.json(req.file);
});

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
