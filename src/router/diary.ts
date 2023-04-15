import { Router } from 'express';
import { DiaryController } from '../controller/DiaryController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const routes = Router();

routes.get('', DiaryController.getDiaries);
routes.post('', AuthMiddleware.verifyToken, DiaryController.createDiary);
routes.get('/:id', DiaryController.getDiary);
export default routes;
