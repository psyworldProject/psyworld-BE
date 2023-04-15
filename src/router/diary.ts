import { Router } from "express";
import { DiaryController } from "../controller/DiaryController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const routes = Router();

routes.post("", AuthMiddleware.verifyToken, DiaryController.createDiary);
routes.get("", DiaryController.getDiaries);
routes.get("/:id", DiaryController.getDiary);
routes.put("/:id", AuthMiddleware.verifyToken, DiaryController.updateDiary);
routes.delete("/:id", AuthMiddleware.verifyToken, DiaryController.deleteDairy);

export default routes;
