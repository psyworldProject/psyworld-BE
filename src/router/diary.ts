import { Router } from 'express';
import { DiaryController } from '../controller/DiaryController';

const routes = Router();

routes.get('', DiaryController.getDiaries);

export default routes;
