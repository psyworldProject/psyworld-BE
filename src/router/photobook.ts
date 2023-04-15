import { Router } from 'express';
import { PhotobookController } from '../controller/PhotobookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/uploadS3';

const routes = Router();

routes.get('', PhotobookController.getPhotobooks);
routes.post('', upload.single('image'), AuthMiddleware.verifyToken, PhotobookController.createPhotobook);
routes.get('/:id', PhotobookController.getPhotobook);
routes.put('/:id', AuthMiddleware.verifyToken, PhotobookController.updatePhotobook);
routes.delete('/:id', AuthMiddleware.verifyToken, PhotobookController.deletePhotobook);

export default routes;
